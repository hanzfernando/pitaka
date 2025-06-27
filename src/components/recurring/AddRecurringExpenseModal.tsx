"use client";

import { useEffect, useState } from "react";
import { Category } from "@/types/category";
import { CreateRecurringExpenseInput } from "@/types/recurringExpense";
import { fetchCategories } from "@/lib/services/categoryService";
import { X } from "lucide-react";

type Props = {
  onClose: () => void;
  onAdd: (exp: CreateRecurringExpenseInput) => void;
};

const AddRecurringExpenseModal: React.FC<Props> = ({ onClose, onAdd }) => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "monthly" | "yearly">("monthly");
  const [startDate, setStartDate] = useState(() =>
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState("");
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

    onAdd({
      name,
      amount: amt,
      category_id: categoryId,
      frequency,
      start_date: new Date(startDate),
      end_date: endDate ? new Date(endDate) : null,
    });

    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg w-full max-w-md p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Add Recurring Expense</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

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
              value={categoryId}
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
              {loading ? "Adding..." : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRecurringExpenseModal;
