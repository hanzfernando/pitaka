// import { RecurringExpense } from "@/types/recurringExpense";
import { createClient } from "@/lib/supabase/client";
import { addExpense } from "@/lib/services/expenseService";
// import { PopulatedRecurringExpense } from "@/types/recurringExpense";
import { AddRecurringExpenseResult, RecurringExpense } from "@/types/recurringExpense";
import { CreateRecurringExpenseInput } from "@/types/recurringExpense";
import { getRecurringDateRange, getExpectedRecurringDates } from "../utils/dateUtil";
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
    // .select(`
    //   *,
    //     category:categories (
    //     name,
    //     color
    //   )
    // `)
    .select("*")
    .eq("user_id", user.id);
  if (error) {
    console.error("Error fetching recurring expenses:", error.message);
    return [];
  }
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

  // 1. Insert recurring expense
  const { data, error } = await supabase
    .from("recurring_expenses")
    .insert({ ...recurring, user_id: user.id })
    .select("*")
    .single();

  if (error) {
    console.error("Error adding recurring expense:", error.message);
    return null;
  }

  const generatedExpense = await generateExpenseFromStartDate(
    recurring,
    data.id,
  );

  return {
    recurringExpense: data as RecurringExpense,
    generatedExpense,
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

  const { data: recurrences, error: recurrenceError } = await supabase
    .from("recurring_expenses")
    .select("*")
    .eq("user_id", user.id);

  if (recurrenceError || !recurrences) {
    console.error("Failed to fetch recurring expenses:", recurrenceError?.message);
    return [];
  }

  const newExpenses: Expense[] = [];

  for (const rec of recurrences) {
    const start = startOfDay(new Date(rec.start_date));
    const end = rec.end_date ? startOfDay(new Date(rec.end_date)) : startOfDay(new Date());

    // 1. Fetch ALL existing expense dates
    const { data: existingExpenses, error: fetchError } = await supabase
      .from("expenses")
      .select("expense_date")
      .eq("recurring_id", rec.id);

    if (fetchError) {
      console.error("Failed to fetch expenses for recurring:", fetchError.message);
      continue;
    }

    const existingDates = (existingExpenses || []).map(e =>
      startOfDay(new Date(e.expense_date)).toISOString()
    );

    const allExpectedDates = getExpectedRecurringDates(start, rec.frequency, end);

    const missingDates = allExpectedDates.filter(date =>
      !existingDates.includes(date.toISOString())
    );

    for (const date of missingDates) {
      const expense = {
        name: rec.name,
        amount: rec.amount,
        category_id: rec.category_id,
        recurring_id: rec.id,
        expense_date: date,
      };

      const inserted = await addExpense(expense);
      if (inserted) {
        console.log("✅ Synced expense for:", date.toDateString());
        newExpenses.push(inserted); // collect for return
      } else {
        console.warn("⚠️ Failed to insert for:", date.toDateString());
      }
    }
  }

  return newExpenses;
}


// Helper functions
async function generateExpenseFromStartDate(
  recurring: CreateRecurringExpenseInput,
  recurringId: string,
) {
  const generatedExpenses = [];
  const dates = getRecurringDateRange(
    recurring.start_date,
    recurring.frequency,  
  );

  console.log("Generated dates for recurring expense:", dates);

  for (const date of dates) {
    const expense: CreateExpenseInput = {
      name: recurring.name,
      amount: recurring.amount,
      category_id: recurring.category_id,
      recurring_id: recurringId,
      expense_date: date,
    };

    console.log("Generated expense:", expense);

    const result = await addExpense(expense);
    if (result) {
      generatedExpenses.push(result);
    }
  }

  return generatedExpenses;
}