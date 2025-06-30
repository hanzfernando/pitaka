import { RecurringExpense, PopulatedRecurringExpense } from "@/types/recurringExpense";
import { Category } from "@/types/category";

/**
 * Populates RecurringExpenses with category details.
 */
export function populateRecurringExpenses(
  recurringExpenses: RecurringExpense[],
  categories: Category[]
): PopulatedRecurringExpense[] {
  return recurringExpenses.map((rec) => {
    const category = categories.find((cat) => cat.id === rec.category_id);

    return {
      ...rec,
      category: category
        ? { name: category.name, color: category.color }
        : null,
    };
  });
}
