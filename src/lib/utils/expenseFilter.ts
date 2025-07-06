// utils/filterExpenses.ts

import { isWithinInterval, startOfMonth, endOfMonth, setMonth } from "date-fns";
import { PopulatedExpense } from "@/types/expense"; 

export type FilterMode = "month" | "range" | "showAll";

interface FilterOptions {
  expenses: PopulatedExpense[];
  filterMode: FilterMode;
  selectedMonth: number;
  customStartDate?: Date | null;
  customEndDate?: Date | null;
  now?: Date;
}

export function filterExpenses({
  expenses,
  filterMode,
  selectedMonth,
  customStartDate,
  customEndDate,
  now = new Date(),
}: FilterOptions): PopulatedExpense[] {
  return expenses.filter((exp) => {
    const date = new Date(exp.expense_date);

    if (filterMode === "month") {
      const start = startOfMonth(setMonth(now, selectedMonth));
      const end = endOfMonth(start);
      return isWithinInterval(date, { start, end });
    }

    if (filterMode === "range" && customStartDate && customEndDate) {
      return isWithinInterval(date, {
        start: customStartDate,
        end: customEndDate,
      });
    }

    if (filterMode === "showAll") {
      return true;
    }

    return true;
  });
}

export function searchExpenses(
  expenses: PopulatedExpense[],
  searchTerm: string
): PopulatedExpense[] {
  const lowerSearchTerm = searchTerm.toLowerCase();
  return expenses.filter(
    (exp) =>
      exp.name.toLowerCase().includes(lowerSearchTerm) ||
      (exp.category?.name?.toLowerCase().includes(lowerSearchTerm) ?? false)
  );
}
