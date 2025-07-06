// import { RecurringExpense } from "@/types/recurringExpense";
import { createClient } from "@/lib/supabase/client";
import { addExpense } from "@/lib/services/expenseService";
// import { PopulatedRecurringExpense } from "@/types/recurringExpense";
import { AddRecurringExpenseResult, RecurringExpense } from "@/types/recurringExpense";
import { CreateRecurringExpenseInput } from "@/types/recurringExpense";
import { getExpectedRecurringDates, getMissingDates, getRecurringDateRange } from "../utils/dateUtil";
import { CreateExpenseInput, Expense } from "@/types/expense";
import { startOfDay } from "date-fns";

export async function fetchRecurringExpenses(): Promise<RecurringExpense[]> {
  const supabase = createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    console.error("User not authenticated");
    return [];
  }
  const { data, error } = await supabase
    .from("recurring_expenses")
    .select("*")
    .eq("user_id", user.id);
  if (error) {
    console.error("Error fetching recurring expenses:", error.message);
    return [];
  }

  console.log("fetch recurring")
  console.log(data)
  return data as RecurringExpense[];
}

export async function addRecurringExpense(
  recurring: CreateRecurringExpenseInput
): Promise<AddRecurringExpenseResult | null> {
  const supabase = createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("User not authenticated");
    return null;
  }

  // Step 1: Add the recurring config
  const { data, error } = await supabase
    .from("recurring_expenses")
    .insert({ ...recurring, user_id: user.id })
    .select("*")
    .single();

  if (error || !data) {
    console.error("Error adding recurring expense:", error?.message);
    return null;
  }

  // Step 2: Generate expenses based on frequency, date range
  const generatedExpenses = await generateExpensesFromRecurring(data);

  return {
    recurringExpense: data as RecurringExpense,
    generatedExpense: generatedExpenses,
  };
}


export async function updateRecurringExpense(
  expense: Omit<RecurringExpense, "created_at" | "user_id">,
): Promise<RecurringExpense | null> {
  const supabase = createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("User not authenticated");
    return null;
  }

  const { data, error } = await supabase
    .from("recurring_expenses")
    .update(expense)
    .eq("id", expense.id)
    .eq("user_id", user.id)
    .select("*")
    .single();

  if (error) {
    console.error("Error updating recurring expense:", error.message);
    return null;
  }

  return data as RecurringExpense;
}

export async function deleteRecurringExpense(id: string): Promise<boolean> {
  const supabase = createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("User not authenticated");
    return false;
  }

  const { error } = await supabase
    .from("recurring_expenses")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting recurring expense:", error.message);
    return false;
  }

  return true;
}

export async function syncRecurringExpenses(): Promise<Expense[]> {
  const supabase = createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("User not authenticated");
    return [];
  }

  const recurrences = await fetchRecurringExpenses();
  const allNewExpenses: Expense[] = [];

  for (const rec of recurrences) {
    const start = startOfDay(new Date(rec.start_date));
    const end = rec.end_date ? startOfDay(new Date(rec.end_date)) : startOfDay(new Date());

    const existingDates = await getExistingExpenseDates(rec.id);
    // console.log("existingDates: ", existingDates)
    const expectedDates = getExpectedRecurringDates(start, rec.frequency, end);
    // console.log("expectedDates: ", expectedDates)
    const missingDates = getMissingDates(expectedDates, existingDates);
    // console.log("missingDates: ", missingDates)

    const newInputs: CreateExpenseInput[] = missingDates.map((date) => ({
      name: rec.name,
      amount: rec.amount,
      category_id: rec.category_id,
      recurring_id: rec.id,
      expense_date: date,
    }));

    const inserted = await insertExpenses(newInputs);
    allNewExpenses.push(...inserted);
  }

  return allNewExpenses;
}


async function generateExpensesFromRecurring(
  recurring: RecurringExpense
): Promise<Expense[]> {
  const results: Expense[] = [];

  const dates = getRecurringDateRange(
    recurring.start_date,
    recurring.frequency,
    recurring.end_date
  );

  for (const date of dates) {
    const input: CreateExpenseInput = {
      name: recurring.name,
      amount: recurring.amount,
      category_id: recurring.category_id,
      recurring_id: recurring.id,
      expense_date: date,
    };

    const result = await addExpense(input);
    if (result) results.push(result);
  }

  return results;
}

async function getExistingExpenseDates(recurringId: string): Promise<Date[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("expenses")
    .select("expense_date")
    .eq("recurring_id", recurringId);

  if (error || !data) {
    console.error("Error fetching existing expenses:", error?.message);
    return [];
  }

  return data.map((e) => startOfDay(new Date(e.expense_date)));
}

async function insertExpenses(inputs: CreateExpenseInput[]): Promise<Expense[]> {
  const results: Expense[] = [];
  for (const input of inputs) {
    const result = await addExpense(input);
    if (result) results.push(result);
  }
  return results;
}