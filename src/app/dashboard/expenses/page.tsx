"use client";

import { useState } from "react";
import ExpenseTable from "@/components/expense/ExpenseTable";
import AddExpenseModal from "@/components/expense/AddExpenseModal";
import EditExpenseModal from "@/components/expense/EditExpenseModal";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";

import { CreateExpenseInput, Expense, PopulatedExpense } from "@/types/expense";
import { addExpense, updateExpense, deleteExpense } from "@/lib/services/expenseService";

import { useExpenseContext } from "@/hooks/useExpenseContext";
import { expenseActionTypes } from "@/context/ExpenseContext";

import { populateExpenses } from "@/lib/utils/populateExpense";
import { useCategoryContext } from "@/hooks/useCategoryContext";
import { useRecurringExpenseContext } from "@/hooks/useRecurringExpenseContext";


type ModalType = "add" | "edit" | "delete" | null;

export default function ExpensesPage() {
  const { state: expenseState, dispatch } = useExpenseContext();
  const { state: categoryState } = useCategoryContext();
  const { state: recurringState } = useRecurringExpenseContext();

  const rawExpenses = expenseState.expenses;
  const populatedExpenses = populateExpenses(
    rawExpenses,
    categoryState.categories,
    recurringState.recurringExpenses
  );

  const { loading, error } = expenseState;

  const [modal, setModal] = useState<ModalType>(null);
  const [activeExpense, setActiveExpense] = useState<PopulatedExpense | null>(null);

  // ─── Handlers ─────────────────────────────────────────
  const handleAddExpense = async (input: CreateExpenseInput) => {
    dispatch({ type: expenseActionTypes.SET_LOADING, payload: true });
    try {
      const created = await addExpense(input);
      if (created) {
        dispatch({ type: expenseActionTypes.ADD_EXPENSE, payload: created });
      }
      closeModal();
    } catch (err) {
      dispatch({
        type: expenseActionTypes.SET_ERROR,
        payload: err instanceof Error ? err.message : "Failed to add expense",
      });
    } finally {
      dispatch({ type: expenseActionTypes.SET_LOADING, payload: false });
    }
  };

  const handleEditExpense = async (updated: PopulatedExpense) => {
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

    dispatch({ type: expenseActionTypes.SET_LOADING, payload: true });
    try {
      const saved = await updateExpense(baseExpense);
      if (saved) {
        dispatch({ type: expenseActionTypes.UPDATE_EXPENSE, payload: updated });
      }
      closeModal();
    } catch (err) {
      dispatch({
        type: expenseActionTypes.SET_ERROR,
        payload: err instanceof Error ? err.message : "Failed to update expense",
      });
    } finally {
      dispatch({ type: expenseActionTypes.SET_LOADING, payload: false });
    }
  };

  const handleDeleteExpense = async () => {
    if (!activeExpense) return;
    dispatch({ type: expenseActionTypes.SET_LOADING, payload: true });
    try {
      const success = await deleteExpense(activeExpense.id);
      if (success) {
        dispatch({
          type: expenseActionTypes.DELETE_EXPENSE,
          payload: activeExpense.id,
        });
      }
      closeModal();
    } catch (err) {
      dispatch({
        type: expenseActionTypes.SET_ERROR,
        payload: err instanceof Error ? err.message : "Failed to delete expense",
      });
    } finally {
      dispatch({ type: expenseActionTypes.SET_LOADING, payload: false });
    }
  };

  // ─── Modal Helpers ────────────────────────────────────────
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
        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : error ? (
          <p className="text-destructive">{error}</p>
        ) : (
          <ExpenseTable
            expense={populatedExpenses}
            onEdit={(expense) => openModal("edit", expense)}
            onDelete={(expense) => openModal("delete", expense)}
          />
        )}
      </div>

      {/* Modals */}
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
          title="Delete Expense"
          itemName={activeExpense.name}
          onClose={closeModal}
          onConfirm={handleDeleteExpense}
        />
      )}
    </div>
  );
}
