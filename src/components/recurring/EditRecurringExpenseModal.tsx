"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { PopulatedRecurringExpense } from "@/types/recurringExpense";
import { fetchCategories } from "@/lib/services/categoryService";
import { Category } from "@/types/category";

type EditRecurringExpenseProps = {
  recurringExpense: PopulatedRecurringExpense;
  onClose: () => void;
  onUpdate: (exp: PopulatedRecurringExpense) => void;
};

const EditRecurringExpenseModal: React.FC<EditRecurringExpenseProps> = ({recurringExpense, onClose, onUpdate}) => {
  const [name, setName] = useState(recurringExpense.name);
  const [amount, setAmount] = useState(recurringExpense.amount.toString());
  const [categoryId, setCategoryId] = useState(recurringExpense.category_id);
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "monthly" | "yearly">(recurringExpense.frequency);
  const [startDate, setStartDate] = useState(() =>
    new Date(recurringExpense.start_date).toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    recurringExpense.end_date ? new Date(recurringExpense.end_date).toISOString().split("T")[0] : ""
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const amt = parseFloat(amount);
    if (!name || isNaN(amt) || !categoryId || !frequency || !startDate) {
      setError("Please fill in all required fields correctly.");
      setLoading(false);
      return;
    }

    const updatedExpense: PopulatedRecurringExpense = {
      ...recurringExpense,
      name,
      amount: amt,
      category_id: categoryId,
      frequency,
      start_date: new Date(startDate),
      end_date: endDate ? new Date(endDate) : null,
    };

    onUpdate(updatedExpense);
    setLoading(false);
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg w-full max-w-md p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Edit Recurring Expense</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-input bg-muted text-foreground rounded-lg px-4 py-2"
            />
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border border-input bg-muted text-foreground rounded-lg px-4 py-2"
            />
            <select
              value={categoryId ?? ""}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full border border-input bg-white dark:bg-zinc-800 text-black dark:text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <select
              value={frequency}
              onChange={(e) =>
                setFrequency(e.target.value as "daily" | "weekly" | "monthly" | "yearly")
              }
              className="w-full border border-input bg-white dark:bg-zinc-800 text-black dark:text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-input bg-muted text-foreground rounded-lg px-4 py-2"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border border-input bg-muted text-foreground rounded-lg px-4 py-2"
              placeholder="Optional End Date"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-lg border border-border text-muted-foreground hover:bg-muted/30 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditRecurringExpenseModal