export type Expense = {
  id: string;
  user_id: string;
  category_id: string;
  name: string;
  amount: number;
  expense_date: Date;
  recurring_id?: string | null;
  created_at: Date;
};

export type PopulatedExpense = Expense & {
  categories: {
    name: string;
    color: string;
  } | null;
  recurring_expenses?: {
    frequency: string;
    start_date: string;
    end_date?: string | null;
  } | null;
};

export type CreateExpenseInput = {
  name: string;
  amount: number;
  category_id: string;
  expense_date: Date;
  recurring_id?: string | null;
}
