import { Expense } from "@/types/expense";
import { PopulatedExpense } from "@/types/expense";
import { createClient } from "@/lib/supabase/client";

export async function fetchExpenses(): Promise<PopulatedExpense[]> {
  const supabase = createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) return [];

  const { data, error } = await supabase
    .from("expenses")
    .select(`
      *,
      categories:category_id (
        name,
        color
      ),
      recurring_expenses:recurring_id (
        frequency,
        start_date,
        end_date
      )
    `)
    .eq("user_id", user.id)
    .order("expense_date", { ascending: false });

  if (error || !data) {
    console.error("Error fetching populated expenses:", error.message);
    return [];
  }

  return data as PopulatedExpense[];
}



export async function addExpense(
  expense: Omit<Expense, "id" | "created_at" | "user_id">
): Promise<PopulatedExpense | null> {
  const supabase = createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("User not authenticated");
    return null;
  }

  // ─── Check Recurring Duplication ───
  if (expense.recurring_id) {
    const expenseDate = new Date(expense.expense_date);
    const billingMonth = expenseDate.toISOString().slice(0, 7);

    const { data: existing } = await supabase
      .from("expenses")
      .select("id")
      .eq("recurring_id", expense.recurring_id)
      .gte("expense_date", `${billingMonth}-01`)
      .lte("expense_date", `${billingMonth}-31`)
      .maybeSingle();

    if (existing) {
      console.log("Already added recurring for this month.");
      return null;
    }
  }

  const { data, error } = await supabase
    .from("expenses")
    .insert({ ...expense, user_id: user.id })
    .select(`
      *,
      categories (
        name,
        color
      ),
      recurring_expenses (
        frequency,
        start_date,
        end_date
      )
    `)
    .single();

  if (error) {
    console.error("Error adding expense:", error.message);
    return null;
  }

  return data as PopulatedExpense;
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