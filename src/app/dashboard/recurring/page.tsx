"use client";

import { useState } from "react";
import {
  isWithinInterval,
  parseISO,
  startOfDay,
  endOfDay,
} from "date-fns";

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
import { useCategoryContext } from "@/hooks/useCategoryContext";
import { populateRecurringExpenses } from "@/lib/utils/populateRecurringExpense";
import { withToast } from "@/lib/utils/withToast";
import RecurringExpenseCardList from "@/components/recurring/RecurringExpenseCardList";

type ModalType = "add" | "edit" | "delete" | null;
type FilterMode = "activeNow" | "range" | "all";

export default function RecurringPage() {
  const { state: recurringState, dispatch: recurringExpenseDispatch } = useRecurringExpenseContext();
  const { recurringExpenses, loading, error } = recurringState;

  const { state: categoryState } = useCategoryContext();
  const { dispatch: expenseDispatch } = useExpenseContext();

  const [modal, setModal] = useState<ModalType>(null);
  const [activeRecurringExpense, setActiveRecurringExpense] = useState<PopulatedRecurringExpense | null>(null);

  const [filterMode, setFilterMode] = useState<FilterMode>("activeNow");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [selectedFrequency, setSelectedFrequency] = useState("");

  const populatedRecurringExpenses = populateRecurringExpenses(recurringExpenses, categoryState.categories);

  const today = new Date();

  const filteredRecurringExpenses = populatedRecurringExpenses.filter((item) => {
    const start = item.start_date instanceof Date ? item.start_date : parseISO(item.start_date);
    const end = item.end_date
      ? (item.end_date instanceof Date ? item.end_date : parseISO(item.end_date))
      : null;
    const frequencyMatch = selectedFrequency === "" || item.frequency === selectedFrequency;

    if (filterMode === "activeNow") {
      return isWithinInterval(today, {
        start: startOfDay(start),
        end: end ? endOfDay(end) : endOfDay(today),
      }) && frequencyMatch;
    }

    if (filterMode === "range" && startDate && endDate) {
      const from = parseISO(startDate);
      const to = parseISO(endDate);
      return (
        isWithinInterval(start, { start: from, end: to }) ||
        (end && isWithinInterval(end, { start: from, end: to }))
      ) && frequencyMatch;
    }

    return frequencyMatch;
  });

  const handleClearFilters = () => {
    setFilterMode("activeNow");
    setStartDate("");
    setEndDate("");
    setSelectedFrequency("");
  };

  // ─── Handlers ─────────────────────────────────────────
  const handleAddRecurringExpense = async (input: CreateRecurringExpenseInput) => {
    recurringExpenseDispatch({ type: recurringExpenseActionTypes.SET_LOADING, payload: true });

    const result = await withToast(
      () => addRecurringExpense(input),
      {
        success: "Recurring expense added!",
        error: "Failed to add recurring expense",
      }
    );

    if (result) {
      const { recurringExpense, generatedExpense } = result;

      recurringExpenseDispatch({
        type: recurringExpenseActionTypes.ADD_RECURRING_EXPENSE,
        payload: recurringExpense,
      });

      for (const expense of generatedExpense || []) {
        expenseDispatch({ type: expenseActionTypes.ADD_EXPENSE, payload: expense });
      }

      closeModal();
    }

    recurringExpenseDispatch({ type: recurringExpenseActionTypes.SET_LOADING, payload: false });
  };

  const handleEditRecurringExpense = async (updated: PopulatedRecurringExpense) => {
    const base: RecurringExpense = {
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

    const saved = await withToast(
      () => updateRecurringExpense(base),
      {
        success: "Recurring expense updated!",
        error: "Failed to update recurring expense",
      }
    );

    if (saved) {
      recurringExpenseDispatch({
        type: recurringExpenseActionTypes.UPDATE_RECURRING_EXPENSE,
        payload: updated,
      });
      closeModal();
    }

    recurringExpenseDispatch({ type: recurringExpenseActionTypes.SET_LOADING, payload: false });
  };


  const handleDeleteRecurringExpense = async () => {
    if (!activeRecurringExpense) return;

    recurringExpenseDispatch({ type: recurringExpenseActionTypes.SET_LOADING, payload: true });

    const success = await withToast(
      () => deleteRecurringExpense(activeRecurringExpense.id),
      {
        success: "Recurring expense deleted!",
        error: "Failed to delete recurring expense",
      }
    );

    if (success) {
      recurringExpenseDispatch({
        type: recurringExpenseActionTypes.DELETE_RECURRING_EXPENSE,
        payload: activeRecurringExpense.id,
      });
      closeModal();
    }

    recurringExpenseDispatch({ type: recurringExpenseActionTypes.SET_LOADING, payload: false });
  };


  // ─── Modal Helpers ────────────────────────────────────────
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
        <h1 className="text-3xl font-bold text-primary">Your Recurring Expenses ♻️</h1>
        <button
          onClick={() => openModal("add")}
          className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow hover:brightness-110 transition"
        >
          + Add Recurring Expense
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center max-w-5xl w-full mx-auto">
        <select
          className="border border-input rounded px-3 py-1 dark:bg-background dark:text-white"
          value={filterMode}
          onChange={(e) => setFilterMode(e.target.value as FilterMode)}
        >
          <option value="activeNow">Active Now</option>
          <option value="range">Custom Range</option>
          <option value="all">Show All</option>
        </select>

        {filterMode === "range" && (
          <>
            <label className="text-sm dark:text-white">From</label>
            <input
              type="date"
              className="border rounded px-2 py-1 dark:bg-background dark:text-white"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <label className="text-sm dark:text-white">To</label>
            <input
              type="date"
              className="border rounded px-2 py-1 dark:bg-background dark:text-white"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </>
        )}

        <select
          className="border border-input rounded px-3 py-1 dark:bg-background dark:text-white"
          value={selectedFrequency}
          onChange={(e) => setSelectedFrequency(e.target.value)}
        >
          <option value="">All Frequencies</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>

        <button
          onClick={handleClearFilters}
          className="text-sm text-blue-600 underline dark:text-blue-400"
        >
          Clear Filters
        </button>
      </div>

      <div className="max-w-5xl w-full mx-auto">
        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : error ? (
          <p className="text-destructive">{error}</p>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block">
              <RecurringExpenseTable
                recurringExpenses={filteredRecurringExpenses}
                onEdit={(item) => openModal("edit", item)}
                onDelete={(item) => openModal("delete", item)}
              />
            </div>

            {/* Mobile Card List */}
            <div className="md:hidden">
              <RecurringExpenseCardList
                recurringExpenses={filteredRecurringExpenses}
                onEdit={(item) => openModal("edit", item)}
                onDelete={(item) => openModal("delete", item)}
              />
            </div>
          </>
        )}
      </div>

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
