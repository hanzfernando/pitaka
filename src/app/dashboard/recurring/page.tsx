"use client";

import { useState } from "react";

import RecurringExpenseTable from "@/components/recurring/RecurringExpenseTable";
import AddRecurringExpenseModal from "@/components/recurring/AddRecurringExpenseModal";
import EditRecurringExpenseModal from "@/components/recurring/EditRecurringExpenseModal";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";

import {
  RecurringExpense,
  PopulatedRecurringExpense,
  CreateRecurringExpenseInput,
} from "@/types/recurringExpense";

import {
  addRecurringExpense,
  updateRecurringExpense,
  deleteRecurringExpense,
} from "@/lib/services/recurringExpenseService";

import { useRecurringExpenseContext } from "@/hooks/useRecurringExpenseContext";
import { recurringExpenseActionTypes } from "@/context/RecurringExpenseContext";
import { useExpenseContext } from "@/hooks/useExpenseContext";
import { expenseActionTypes } from "@/context/ExpenseContext";

type ModalType = "add" | "edit" | "delete" | null;

export default function RecurringPage() {
  const { state, dispatch: recurringExpenseDispatch } = useRecurringExpenseContext();
  const { recurringExpenses, loading, error } = state;

  const { dispatch: expenseDispatch } = useExpenseContext();

  const [modal, setModal] = useState<ModalType>(null);
  const [activeRecurringExpense, setActiveRecurringExpense] = useState<PopulatedRecurringExpense | null>(null);

  // ─── Handlers ─────────────────────────────────────────
  const handleAddRecurringExpense = async (input: CreateRecurringExpenseInput) => {
  recurringExpenseDispatch({ type: recurringExpenseActionTypes.SET_LOADING, payload: true });
  try {
    const result = await addRecurringExpense(input);
    if (result) {
      const { recurringExpense, generatedExpense } = result;

      recurringExpenseDispatch({
        type: recurringExpenseActionTypes.ADD_RECURRING_EXPENSE,
        payload: recurringExpense,
      });

      if (generatedExpense) {
        expenseDispatch({
          type: expenseActionTypes.ADD_EXPENSE,
          payload: generatedExpense,
        });
      }

      closeModal();
    }
  } catch (err) {
    recurringExpenseDispatch({
      type: recurringExpenseActionTypes.SET_ERROR,
      payload: err instanceof Error ? err.message : "Failed to add recurring expense",
    });
  } finally {
    recurringExpenseDispatch({ type: recurringExpenseActionTypes.SET_LOADING, payload: false });
  }
};

  const handleEditRecurringExpense = async (updated: PopulatedRecurringExpense) => {
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

    recurringExpenseDispatch({ type: recurringExpenseActionTypes.SET_LOADING, payload: true });
    try {
      const saved = await updateRecurringExpense(baseRecurringExpense);
      if (saved) {
        recurringExpenseDispatch({
          type: recurringExpenseActionTypes.UPDATE_RECURRING_EXPENSE,
          payload: updated,
        });
        closeModal();
      }
    } catch (err) {
      recurringExpenseDispatch({
        type: recurringExpenseActionTypes.SET_ERROR,
        payload: err instanceof Error ? err.message : "Failed to update recurring expense",
      });
    } finally {
      recurringExpenseDispatch({ type: recurringExpenseActionTypes.SET_LOADING, payload: false });
    }
  };

  const handleDeleteRecurringExpense = async () => {
    if (!activeRecurringExpense) return;

    recurringExpenseDispatch({ type: recurringExpenseActionTypes.SET_LOADING, payload: true });
    try {
      const deleted = await deleteRecurringExpense(activeRecurringExpense.id);
      if (deleted) {
        recurringExpenseDispatch({
          type: recurringExpenseActionTypes.DELETE_RECURRING_EXPENSE,
          payload: activeRecurringExpense.id,
        });
        closeModal();
      }
    } catch (err) {
      recurringExpenseDispatch({
        type: recurringExpenseActionTypes.SET_ERROR,
        payload: err instanceof Error ? err.message : "Failed to delete recurring expense",
      });
    } finally {
      recurringExpenseDispatch({ type: recurringExpenseActionTypes.SET_LOADING, payload: false });
    }
  };

  // ─── Helpers ─────────────────────────────────────────
  const closeModal = () => {
    setModal(null);
    setActiveRecurringExpense(null);
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
        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : error ? (
          <p className="text-destructive">{error}</p>
        ) : (
          <RecurringExpenseTable
            recurringExpenses={recurringExpenses}
            onEdit={(item) => openModal("edit", item)}
            onDelete={(item) => openModal("delete", item)}
          />
        )}
      </div>

      {/* Modals */}
      {modal === "add" && (
        <AddRecurringExpenseModal onClose={closeModal} onAdd={handleAddRecurringExpense} />
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
          title="Delete Recurring Expense"
          itemName={activeRecurringExpense.name}
          onClose={closeModal}
          onConfirm={handleDeleteRecurringExpense}
        />
      )}
    </div>
  );
}
