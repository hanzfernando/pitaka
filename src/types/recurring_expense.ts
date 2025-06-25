export type RecurringExpense = {
  id: string;
  user_id: string;
  category_id: string;
  name: string;
  amount: number;
  frequency: "daily" | "weekly" | "monthly" | "yearly";
  start_date: Date;
  end_date?: Date | null;
  created_at: Date;
};