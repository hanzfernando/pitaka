import { Expense } from "@/types/expense";
import { RecurringExpense } from "@/types/recurringExpense";
import { Category } from "@/types/category";
import { isSameMonth, isSameYear, isWithinInterval, format } from "date-fns";

export function getTotalThisMonth(expenses: Expense[], targetDate: Date): number {
  return expenses
    .filter((e) => {
      const d = new Date(e.expense_date);
      return isSameMonth(d, targetDate) && isSameYear(d, targetDate);
    })
    .reduce((sum, e) => sum + e.amount, 0);
}

export function getTopCategory(expenses: Expense[], categories: Category[], targetDate: Date): string {
  const filtered = expenses.filter((e) => {
    const d = new Date(e.expense_date);
    return isSameMonth(d, targetDate) && isSameYear(d, targetDate);
  });

  const totals: Record<string, number> = {};
  filtered.forEach((e) => {
    if (!e.category_id) return;
    totals[e.category_id] = (totals[e.category_id] || 0) + e.amount;
  });

  const topId = Object.entries(totals).sort((a, b) => b[1] - a[1])?.[0]?.[0];
  const top = categories.find((c) => c.id === topId);
  return top ? top.name : "None";
}

export function getExpensesInRange(expenses: Expense[], start: Date, end: Date): Expense[] {
  return expenses.filter((e) =>
    isWithinInterval(new Date(e.expense_date), { start, end })
  );
}

export function getLineChartData(expenses: Expense[], start: Date, end: Date) {
  const map = new Map<string, number>();
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const key = format(new Date(d), "yyyy-MM-dd");
    map.set(key, 0);
  }

  expenses.forEach((e) => {
    const key = format(new Date(e.expense_date), "yyyy-MM-dd");
    if (map.has(key)) {
      map.set(key, (map.get(key) || 0) + e.amount);
    }
  });

  return Array.from(map.entries()).map(([date, amount]) => ({ date, amount }));
}

export function getRecurringTotalsByFrequency(recurring: RecurringExpense[]) {
  return recurring.reduce((acc, curr) => {
    acc[curr.frequency] = (acc[curr.frequency] || 0) + curr.amount;
    return acc;
  }, {} as Record<string, number>);
}
