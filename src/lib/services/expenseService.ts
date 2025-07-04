import { Expense } from "@/types/expense";
// import { PopulatedExpense } from "@/types/expense";
import { CreateExpenseInput } from "@/types/expense";
import { createClient } from "@/lib/supabase/client";
import { formatDateOnly } from "../utils/dateUtil";
// import { getMonthRange } from "../utils/dateUtil";

export async function fetchExpenses(): Promise<Expense[]> {
  const supabase = createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) return [];

  const { data, error } = await supabase
    .from("expenses")
    // .select(`
    //   *,
    //   categories:category_id (
    //     name,
    //     color
    //   ),
    //   recurring_expenses:recurring_id (
    //     frequency,
    //     start_date,
    //     end_date
    //   )
    // `)
    .select("*")
    .eq("user_id", user.id)
    .order("expense_date", { ascending: false });

  if (error || !data) {
    console.error("Error fetching populated expenses:", error.message);
    return [];
  }

  return data as Expense[];
}



export async function addExpense(
  expense: CreateExpenseInput
): Promise<Expense | null> {
  const supabase = createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("User not authenticated");
    return null;
  }

  console.log("Adding expense:", expense);

  const { data, error } = await supabase
    .from("expenses")
    .insert({ 
      ...expense, 
      user_id: user.id,
      expense_date: formatDateOnly(expense.expense_date), // safe
    })
    .select("*")
    .single();

  if (error) {
    console.error("Error adding expense:", error.message);
    return null;
  }

  return data as Expense;
}

export async function updateExpense(
  expense: Omit<Expense, "created_at" | "user_id">
): Promise<Expense | null> {
  const supabase = createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("User not authenticated");
    return null;
  }

  const { data, error } = await supabase
    .from("expenses")
    .update(expense)
    .eq("id", expense.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating expense:", error.message);
    return null;
  }

  return data as Expense;
}

export async function deleteExpense(id: string): Promise<boolean> {
  const supabase = createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("User not authenticated");
    return false;
  }

  const { error } = await supabase
    .from("expenses")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting expense:", error.message);
    return false;
  }

  return true;
}