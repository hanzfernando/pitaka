import { RecurringExpense } from "@/types/recurring_expense";
import { createClient } from "@/lib/supabase/client";
import { addExpense } from "@/lib/services/expenseService";

export async function addRecurringExpense(
  recurring: Omit<RecurringExpense, "id" | "created_at" | "user_id">
): Promise<RecurringExpense | null> {
  const supabase = createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("User not authenticated");
    return null;
  }

  const { data, error } = await supabase
    .from("recurring_expenses")
    .insert({ ...recurring, user_id: user.id })
    .select()
    .single();

  if (error) {
    console.error("Error adding recurring expense:", error.message);
    return null;
  }

  // Optionally: create first instance immediately
  const today = new Date();
  const start = new Date(recurring.start_date);
  if (
    today.toDateString() === start.toDateString() ||
    today >= start
  ) {
    await addExpense({
      name: recurring.name,
      amount: recurring.amount,
      category_id: recurring.category_id,
      recurring_id: data.id,
      expense_date: today,
    });
  }

  return data as RecurringExpense;
}

export async function syncRecurringExpenses() {
  const supabase = createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("User not authenticated");
    return;
  }

  const today = new Date();
  const billingMonth = today.toISOString().slice(0, 7);
  const todayDateStr = `${billingMonth}-${String(today.getDate()).padStart(2, "0")}`;

  const { data: recurrences, error } = await supabase
    .from("recurring_expenses")
    .select("*")
    .eq("user_id", user.id);

  if (error || !recurrences) return;

  for (const rec of recurrences) {
    const shouldGenerate =
      new Date(todayDateStr) >= new Date(rec.start_date) &&
      (!rec.end_date || new Date(todayDateStr) <= new Date(rec.end_date));

    if (!shouldGenerate) continue;

    await addExpense({
      name: rec.name,
      amount: rec.amount,
      category_id: rec.category_id,
      recurring_id: rec.id,
      expense_date: today,
    });
  }
}