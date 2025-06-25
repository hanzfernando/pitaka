"use client";

import { PopulatedExpense } from "@/types/expense";
import { Pencil, Trash2, RefreshCcw } from "lucide-react";
import { useState } from "react";

type Props = {
  expense: PopulatedExpense[];
  onEdit: (exp: PopulatedExpense) => void;
  onDelete: (exp: PopulatedExpense) => void;
};

const ExpenseTable: React.FC<Props> = ({ expense, onEdit, onDelete }) => {
  const [search, setSearch] = useState("");

  const filtered = expense.filter((exp) =>
    exp.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full rounded-2xl border border-border bg-white dark:bg-zinc-800 shadow-md p-6 space-y-6">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search expenses 🔍"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-input bg-muted text-foreground rounded-full px-4 py-2 text-sm w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-primary transition"
        />
      </div>

      <div className="overflow-auto rounded-xl border border-border">
        <table className="min-w-full text-sm">
          <thead className="bg-muted text-muted-foreground">
            <tr className="text-left font-medium">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Expense Date</th>
              <th className="px-4 py-3">Recurring</th>
              <th className="px-4 py-3">Created At</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-6 text-muted-foreground italic">
                  No expenses yet. Add one above!
                </td>
              </tr>
            ) : (
              filtered.map((exp) => (
                <tr key={exp.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{exp.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {exp.categories?.name ?? "Uncategorized"}
                      {exp.categories?.color && (
                        <span
                          className="w-3 h-3 rounded-full border"
                          style={{ backgroundColor: `#${exp.categories.color}` }}
                        />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-foreground">₱{exp.amount.toFixed(2)}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(exp.expense_date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    {exp.recurring_expenses ? (
                      <div className="flex items-center gap-1 text-blue-500">
                        <RefreshCcw size={14} />
                        <span className="text-xs">{exp.recurring_expenses.frequency}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-xs">One-time</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(exp.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 flex justify-center gap-3">
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
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpenseTable;
