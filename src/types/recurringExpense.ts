export type RecurringExpense = {
  id: string;
  user_id: string;
  category_id: string | null;
  name: string;
  amount: number;
  frequency: "daily" | "weekly" | "monthly" | "yearly";
  start_date: Date;
  end_date?: Date | null;
  created_at: Date;
};

export type PopulatedRecurringExpense = RecurringExpense & {
   category: {
    name: string;
    color: string;
  } | null;
};

export type CreateRecurringExpenseInput = {
  name: string;
  amount: number;
  category_id: string | null;
  frequency: "daily" | "weekly" | "monthly" | "yearly";
  start_date: Date;
  end_date?: Date | null;
};
