"use client";

import { useState, useEffect } from "react";

import RecurringExpenseTable from "@/components/recurring/RecurringExpenseTable";
import AddRecurringExpenseModal from "@/components/recurring/AddRecurringExpenseModal";

import { PopulatedRecurringExpense, CreateRecurringExpenseInput } from "@/types/recurringExpense";
// import { RecurringExpense } from "@/types/recurringExpense";
import { fetchRecurringExpenses, addRecurringExpense } from "@/lib/services/recurringExpenseService";

type ModalType = "add" | "edit" | "delete" | null;

export default function RecurringPage() {
  const [recurringExpenses, setRecurringExpenses] = useState<PopulatedRecurringExpense[]>([]);
  const [modal, setModal] = useState<ModalType>(null);

  useEffect(() => {
    const loadRecurringExpenses = async () => {
      const data = await fetchRecurringExpenses();
      console.log("Fetched recurring expenses:", data);
      setRecurringExpenses(data);
    };
    loadRecurringExpenses();
  }, []);

  // ─── Handlers ─────────────────────────────────────────
  const handleAddRecurringExpense = async (input: CreateRecurringExpenseInput) => {
    const created = await addRecurringExpense(input);
    if (!created) return;

    setRecurringExpenses((prev) => [created, ...prev]);
    closeModal();
  };

  // ─── Helpers ─────────────────────────────────────────
  const closeModal = () => {
    setModal(null);
  };

  const openModal = (type: ModalType) => {
    setModal(type);
  };

  return (
    <div className="flex flex-col gap-6 w-full h-full px-4 py-10 bg-background text-foreground">
      <div className="flex justify-between items-center max-w-5xl w-full mx-auto">
        <h1 className="text-3xl font-bold text-primary">Your Recurring Expenses 📂</h1>
        <button
          onClick={() => openModal("add")}
          className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow hover:brightness-110 transition"
        >
          + Add Recurring Expense
        </button>
      </div>

      <div className="max-w-5xl w-full mx-auto">
        <RecurringExpenseTable
          recurringExpenses={recurringExpenses}
          onEdit={() => console.log("Open edit expense modal")}
          onDelete={() => console.log("Open delete expense modal")}
        />
      </div>

      {modal === "add" && (
        <AddRecurringExpenseModal
          onClose={closeModal}
          onAdd={handleAddRecurringExpense}
        />
      )}

      
    </div>  
  );
}