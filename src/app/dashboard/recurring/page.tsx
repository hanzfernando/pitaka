"use client";

import { useState, useEffect } from "react";

import RecurringExpenseTable from "@/components/recurring/RecurringExpenseTable";
import AddRecurringExpenseModal from "@/components/recurring/AddRecurringExpenseModal";
import EditRecurringExpenseModal from "@/components/recurring/EditRecurringExpenseModal";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";

import { RecurringExpense, PopulatedRecurringExpense, CreateRecurringExpenseInput } from "@/types/recurringExpense";
// import { RecurringExpense } from "@/types/recurringExpense";
import { fetchRecurringExpenses, addRecurringExpense, updateRecurringExpense, deleteRecurringExpense } from "@/lib/services/recurringExpenseService";

type ModalType = "add" | "edit" | "delete" | null;

export default function RecurringPage() {
  const [recurringExpenses, setRecurringExpenses] = useState<PopulatedRecurringExpense[]>([]);
  const [modal, setModal] = useState<ModalType>(null);
  const [activeRecurringExpense, setActiveRecurringExpense] = useState<PopulatedRecurringExpense | null>(null);

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

  const handleEditRecurringExpense = async (updated: PopulatedRecurringExpense) => {
    console.log("Updating recurring expense:", updated);
    const baseRecurringExpense: RecurringExpense = {
      id: updated.id,
      user_id: updated.user_id,
      category_id: updated.category_id,
      name: updated.name,
      amount: updated.amount,
      frequency: updated.frequency,
      start_date: updated.start_date,
      end_date: updated.end_date ?? null,
      created_at: updated.created_at,
    };
    const saved = await updateRecurringExpense(baseRecurringExpense);
    if (saved) {
      updateRecurringExpenseList(saved);
    }
    closeModal();
  };

  const handleDeleteRecurringExpense = async () => {
    if (!activeRecurringExpense) return;

    const deleted = await deleteRecurringExpense(activeRecurringExpense.id);
    if (deleted) {
      setRecurringExpenses((prev) =>
        prev.filter((recurring) => recurring.id !== activeRecurringExpense.id)
      );
      closeModal();
    }
  };


  // ─── Helpers ─────────────────────────────────────────
  const updateRecurringExpenseList = (updated: PopulatedRecurringExpense) => {
    setRecurringExpenses((prev) =>
      prev.map((recurring) =>
        recurring.id === updated.id ? updated : recurring
      )
    ); 
  }

  const closeModal = () => {
    setModal(null);
  };

  const openModal = (type: ModalType, recurringExpense: PopulatedRecurringExpense | null = null) => {
    setModal(type);
    setActiveRecurringExpense(recurringExpense);
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
          onEdit={(recurringExpense) => openModal("edit", recurringExpense)}
          onDelete={(recurringExpense) => openModal("delete", recurringExpense)}
        />
      </div>

      {modal === "add" && (
        <AddRecurringExpenseModal
          onClose={closeModal}
          onAdd={handleAddRecurringExpense}
        />
      )}

      {modal === "edit" && activeRecurringExpense && (
        <EditRecurringExpenseModal
          recurringExpense={activeRecurringExpense}
          onClose={closeModal}
          onUpdate={handleEditRecurringExpense} 
          
        />
      )}
      
      {modal === "delete" && activeRecurringExpense && (
        <ConfirmDeleteModal
          itemName={activeRecurringExpense.name}
          title="Delete Recurring Expense"
          onClose={closeModal}
          onConfirm={handleDeleteRecurringExpense}
        />
      )}

      
    </div>  
  );
}