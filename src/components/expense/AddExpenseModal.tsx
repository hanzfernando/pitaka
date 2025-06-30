"use client";

import { useState } from "react";
import { X } from "lucide-react";

import { useCategoryContext } from "@/hooks/useCategoryContext";
import { CreateExpenseInput } from "@/types/expense";

type Props = {
  onClose: () => void;
  onAdd: (exp: CreateExpenseInput) => void;
};

const AddExpenseModal: React.FC<Props> = ({ onClose, onAdd }) => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [expenseDate, setExpenseDate] = useState(() =>
    new Date().toISOString().split("T")[0]
  );
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { state: categoryState } = useCategoryContext();
  const { categories, loading: loadingCategories, error: categoryError } = categoryState;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setIsSubmitting(true);

    const amt = parseFloat(amount);
    if (!name || isNaN(amt) || !categoryId) {
      setFormError("Please fill in all fields correctly.");
      setIsSubmitting(false);
      return;
    }

    onAdd({
      name,
      amount: amt,
      category_id: categoryId,
      expense_date: new Date(expenseDate),
    });

    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg w-full max-w-md p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Add Expense</h2>
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
              disabled={isSubmitting}
            />
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border border-input bg-muted text-foreground rounded-lg px-4 py-2"
              disabled={isSubmitting}
            />

            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full border border-input bg-white dark:bg-zinc-800 text-black dark:text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isSubmitting || loadingCategories}
            >
              <option value="">Select a category</option>
              {loadingCategories ? (
                <option disabled>Loading...</option>
              ) : categoryError ? (
                <option disabled>Error loading categories</option>
              ) : (
                categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))
              )}
            </select>

            <input
              type="date"
              value={expenseDate}
              onChange={(e) => setExpenseDate(e.target.value)}
              className="w-full border border-input bg-muted text-foreground rounded-lg px-4 py-2"
              disabled={isSubmitting}
            />

            {formError && <p className="text-sm text-destructive">{formError}</p>}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg border border-border text-muted-foreground hover:bg-muted/30 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 transition text-white"
            >
              {isSubmitting ? "Adding..." : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseModal;
