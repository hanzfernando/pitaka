"use client";

import { useEffect, useState } from "react";
import { PopulatedExpense } from "@/types/expense";
import { fetchCategories } from "@/lib/services/categoryService";
import { Category } from "@/types/category";
import { X } from "lucide-react";

type EditExpenseProps = {
  expense: PopulatedExpense;
  onClose: () => void;
  onUpdate: (exp: PopulatedExpense) => void;
};

const EditExpenseModal: React.FC<EditExpenseProps> = ({ expense, onClose, onUpdate }) => {
  const [name, setName] = useState(expense.name);
  const [amount, setAmount] = useState(expense.amount.toString());
  const [categoryId, setCategoryId] = useState(expense.category_id);
  const [expenseDate, setExpenseDate] = useState(
    () => new Date(expense.expense_date).toISOString().split("T")[0]
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
    if (!name.trim()) {
      setError("Name cannot be empty.");
      setLoading(false);
      return;
    }
    if (isNaN(amt) || amt <= 0) {
      setError("Amount must be a valid number greater than 0.");
      setLoading(false);
      return;
    }
    if (!categoryId) {
      setError("Please select a category.");
      setLoading(false);
      return;
    }

    // 🔍 Find the category details for populated field
  const selectedCategory = categories.find((cat) => cat.id === categoryId);

  const updatedExpense: PopulatedExpense = {
    ...expense,
    name,
    amount: amt,
    category_id: categoryId,
    expense_date: new Date(expenseDate),
    categories: selectedCategory
      ? { name: selectedCategory.name, color: selectedCategory.color }
      : null, // fallback just in case
  };

    onUpdate(updatedExpense);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg w-full max-w-md p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Edit Expense</h2>
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
            <input
              type="date"
              value={expenseDate}
              onChange={(e) => setExpenseDate(e.target.value)}
              className="w-full border border-input bg-muted text-foreground rounded-lg px-4 py-2"
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
              className="px-4 py-2 rounded-lg bg-primary  text-black dark:text-white hover:bg-primary/90 transition"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditExpenseModal;
