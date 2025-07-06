import { Expense, PopulatedExpense } from "@/types/expense";
import { Category } from "@/types/category";
import { RecurringExpense } from "@/types/recurringExpense";

/**
 * Transforms raw Expense[] into PopulatedExpense[] by injecting category and recurring info.
 */
export function populateExpenses(
  expenses: Expense[],
  categories: Category[],
  recurringExpenses: RecurringExpense[]
): PopulatedExpense[] {
  return expenses.map((expense) => {
    const category = categories.find((c) => c.id === expense.category_id);
    const recurring = expense.recurring_id
      ? recurringExpenses.find((r) => r.id === expense.recurring_id)
      : null;

    return {
      ...expense,
      category: category
        ? { name: category.name, color: category.color }
        : null,
      recurring_expenses: recurring
        ? {
            frequency: recurring.frequency,
            start_date: new Date(recurring.start_date).toISOString(),
            end_date: recurring.end_date
              ? new Date(recurring.end_date).toISOString()
              : null,
          }
        : null,
    };
  });
}

