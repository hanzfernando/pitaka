"use client";

import { useEffect, useState } from "react";
import ExpenseTable from "@/components/expense/ExpenseTable";
import AddExpenseModal from "@/components/expense/AddExpenseModal";
import EditExpenseModal from "@/components/expense/EditExpenseModal";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";

import { Expense } from "@/types/expense";
import { PopulatedExpense } from "@/types/expense";
import { fetchExpenses, addExpense, updateExpense, deleteExpense } from "@/lib/services/expenseService";

type ModalType = "add" | "edit" | "delete" | null;

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<PopulatedExpense[]>([]);
  const [modal, setModal] = useState<ModalType>(null);
  const [activeExpense, setActiveExpense] = useState<PopulatedExpense | null>(null);

  useEffect(() => {
    const loadExpenses = async () => {
      const data = await fetchExpenses();
      console.log("Fetched expenses:", data);
      setExpenses(data);
    };
    loadExpenses();
  }, []);

  // ─── Handlers ─────────────────────────────────────────
  const handleAddExpense = async (
    input: Omit<
      PopulatedExpense,
      "id" | "created_at" | "user_id" | "recurring_expenses" | "categories"
    >
  ) => {
    const created = await addExpense(input);
    if (!created) return;

    setExpenses((prev) => [created, ...prev]); // no casting needed
    closeModal();
  };



  const handleEditExpense = async (updated: PopulatedExpense) => {
    console.log("Updating expense:", updated);
    const baseExpense: Expense = {
      id: updated.id,
      user_id: updated.user_id,
      category_id: updated.category_id,
      name: updated.name,
      amount: updated.amount,
      expense_date: updated.expense_date,
      recurring_id: updated.recurring_id ?? null,
      created_at: updated.created_at,
    };

    const saved = await updateExpense(baseExpense);
    if (saved) {
      // Keep local state updated with possibly enriched PopulatedExpense
      updateExpenseList(updated);
    }

    closeModal();
  }

  const handleDeleteCategory = async () => {
    if (!activeExpense) return;
    const success = await deleteExpense(activeExpense.id);
    if (success) {
      setExpenses((prev) => prev.filter((exp) => exp.id !== activeExpense.id));
    }
    closeModal();
  };

  // ─── Helpers ─────────────────────────────────────────
  const updateExpenseList = (updated: PopulatedExpense) => {
    setExpenses((prev) =>
      prev.map((exp) => (exp.id === updated.id ? updated : exp))
    );
  };

  const openModal = (type: ModalType, expense: PopulatedExpense | null = null) => {
    setModal(type);
    setActiveExpense(expense);
  };

  const closeModal = () => {
    setModal(null);
    setActiveExpense(null);
  };

  return (
    <div className="flex flex-col gap-6 w-full h-full px-4 py-10 bg-background text-foreground">
      <div className="flex justify-between items-center max-w-5xl w-full mx-auto">
        <h1 className="text-3xl font-bold text-primary">Your Expenses 📂</h1>
        <button
          onClick={() => openModal("add")}
          className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow hover:brightness-110 transition"
        >
          + Add Expense
        </button>
      </div>

      <div className="max-w-5xl w-full mx-auto">
        <ExpenseTable
          expense={expenses}
          onEdit={(expense) => openModal("edit", expense)}
          onDelete={(expense) => openModal("delete", expense)}
        />
      </div>

      {modal === "add" && (
        <AddExpenseModal onClose={closeModal} onAdd={handleAddExpense} />
      )}
      {modal === "edit" && activeExpense && (
        <EditExpenseModal
          expense={activeExpense}
          onClose={closeModal}
          onUpdate={handleEditExpense}
        />
      )}
      {modal === "delete" && activeExpense && (
        <ConfirmDeleteModal
          title="Delete Category"
          itemName={activeExpense.name}
          onClose={closeModal}
          onConfirm={handleDeleteCategory}
        />
      )}
    </div>
  );
}
