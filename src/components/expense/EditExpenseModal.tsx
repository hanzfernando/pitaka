"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { PopulatedExpense } from "@/types/expense";
import { useCategoryContext } from "@/hooks/useCategoryContext";

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

  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { state: categoryState } = useCategoryContext();
  const { categories, loading: loadingCategories, error: categoryError } = categoryState;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setIsSubmitting(true);

    const amt = parseFloat(amount);
    if (!name.trim()) {
      setFormError("Name cannot be empty.");
      setIsSubmitting(false);
      return;
    }
    if (isNaN(amt) || amt <= 0) {
      setFormError("Amount must be a valid number greater than 0.");
      setIsSubmitting(false);
      return;
    }
    if (!categoryId) {
      setFormError("Please select a category.");
      setIsSubmitting(false);
      return;
    }

    const selectedCategory = categories.find((cat) => cat.id === categoryId);
    if (!selectedCategory) console.warn("Category not found for ID:", categoryId);

    const updatedExpense: PopulatedExpense = {
      ...expense,
      name,
      amount: amt,
      category_id: categoryId,
      expense_date: new Date(expenseDate),
      category: selectedCategory
        ? { name: selectedCategory.name, color: selectedCategory.color }
        : null,
    };

    onUpdate(updatedExpense);
    setIsSubmitting(false);
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
              disabled={isSubmitting || loadingCategories}
            />
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border border-input bg-muted text-foreground rounded-lg px-4 py-2"
              disabled={isSubmitting || loadingCategories}
            />
            <select
              value={categoryId ?? ""}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full border border-input bg-white dark:bg-zinc-800 text-black dark:text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isSubmitting || loadingCategories}
            >
              <option value="">Select a category</option>
              {loadingCategories ? (
                <option disabled>Loading categories...</option>
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
              disabled={isSubmitting || loadingCategories}
            />

            {formError && <p className="text-sm text-destructive">{formError}</p>}
            {categoryError && <p className="text-sm text-destructive">{categoryError}</p>}
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
              disabled={isSubmitting || loadingCategories}
              className="px-4 py-2 rounded-lg bg-primary text-black dark:text-white hover:bg-primary/90 transition"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditExpenseModal;
