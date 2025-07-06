"use client";

import { PopulatedExpense } from "@/types/expense";
import { Pencil, Trash2 } from "lucide-react";

type Props = {
  expenses: PopulatedExpense[];
  onEdit: (exp: PopulatedExpense) => void;
  onDelete: (exp: PopulatedExpense) => void;
};

const ExpenseCardList: React.FC<Props> = ({ expenses, onEdit, onDelete }) => {
  if (expenses.length === 0) {
    return (
      <p className="text-muted-foreground text-center italic">
        No expenses yet. Add one above!
      </p>
    );
  }

  return (
    <div className="md:hidden space-y-4">
      {expenses.map((exp) => (
        <div
          key={exp.id}
          className="rounded-lg border border-border p-4 shadow-sm bg-muted/50"
        >
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold text-foreground">{exp.name}</h2>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(exp)}
                className="text-blue-500 hover:text-blue-700"
                title="Edit"
              >
                <Pencil size={18} />
              </button>
              <button
                onClick={() => onDelete(exp)}
                className="text-red-500 hover:text-red-700"
                title="Delete"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          <div className="text-sm text-muted-foreground space-y-1">
            <div>
              <span className="font-medium text-foreground">Category: </span>
              {exp.category?.name ?? "Uncategorized"}
            </div>
            <div>
              <span className="font-medium text-foreground">Amount: </span>
              ₱{exp.amount.toFixed(2)}
            </div>
            <div>
              <span className="font-medium text-foreground">Date: </span>
              {new Date(exp.expense_date).toLocaleDateString()}
            </div>
            <div>
              <span className="font-medium text-foreground">Recurring: </span>
              {exp.recurring_expenses ? (
                <span className="text-blue-500">{exp.recurring_expenses.frequency}</span>
              ) : (
                "One-time"
              )}
            </div>
            <div>
              <span className="font-medium text-foreground">Created: </span>
              {new Date(exp.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExpenseCardList;
