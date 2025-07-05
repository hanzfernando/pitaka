"use client";

import { PopulatedRecurringExpense } from "@/types/recurringExpense";
import { Pencil, Trash2 } from "lucide-react";

type Props = {
  recurringExpenses: PopulatedRecurringExpense[];
  onEdit: (exp: PopulatedRecurringExpense) => void;
  onDelete: (exp: PopulatedRecurringExpense) => void;
};

const RecurringExpenseCardList: React.FC<Props> = ({
  recurringExpenses,
  onEdit,
  onDelete,
}) => {
  if (recurringExpenses.length === 0) {
    return (
      <p className="text-muted-foreground text-center italic">
        No recurring expenses found.
      </p>
    );
  }

  return (
    <div className="md:hidden space-y-4">
      {recurringExpenses.map((exp) => (
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
              <span className="font-medium text-foreground">Frequency: </span>
              <span className="capitalize">{exp.frequency}</span>
            </div>
            <div>
              <span className="font-medium text-foreground">Start Date: </span>
              {new Date(exp.start_date).toLocaleDateString()}
            </div>
            <div>
              <span className="font-medium text-foreground">End Date: </span>
              {exp.end_date
                ? new Date(exp.end_date).toLocaleDateString()
                : "Ongoing"}
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

export default RecurringExpenseCardList;
