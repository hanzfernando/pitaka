"use client";

import { useState } from "react";
import {
  getMonth,
} from "date-fns";

import ExpenseTable from "@/components/expense/ExpenseTable";
import AddExpenseModal from "@/components/expense/AddExpenseModal";
import EditExpenseModal from "@/components/expense/EditExpenseModal";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";

import {
  CreateExpenseInput,
  Expense,
  PopulatedExpense,
} from "@/types/expense";
import {
  addExpense,
  updateExpense,
  deleteExpense,
} from "@/lib/services/expenseService";

import { useExpenseContext } from "@/hooks/useExpenseContext";
import { expenseActionTypes } from "@/context/ExpenseContext";

import { populateExpenses } from "@/lib/utils/populateExpense";
import { useCategoryContext } from "@/hooks/useCategoryContext";
import { useRecurringExpenseContext } from "@/hooks/useRecurringExpenseContext";
import { withToast } from "@/lib/utils/withToast";
import ExpenseCardList from "@/components/expense/ExpenseCardList";

import { filterExpenses } from "@/lib/utils/expenseFilter";

type ModalType = "add" | "edit" | "delete" | null;
type FilterMode = "month" | "range" | "showAll";

export default function ExpensesPage() {
  const { state: expenseState, dispatch } = useExpenseContext();
  const { state: categoryState } = useCategoryContext();
  const { state: recurringState } = useRecurringExpenseContext();

  const [modal, setModal] = useState<ModalType>(null);
  const [activeExpense, setActiveExpense] = useState<PopulatedExpense | null>(
    null
  );

  const now = new Date();
  const currentMonth = getMonth(now);

  // Filter state
  const [filterMode, setFilterMode] = useState<FilterMode>("month");
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
  const [customEndDate, setCustomEndDate] = useState<Date | null>(null);

  const { loading, error } = expenseState;
  const rawExpenses = expenseState.expenses;

  const populatedExpenses = populateExpenses(
    rawExpenses,
    categoryState.categories,
    recurringState.recurringExpenses
  );

  const filteredExpenses = filterExpenses({
    expenses: populatedExpenses,
    filterMode,
    selectedMonth,
    customStartDate,
    customEndDate,
    now,
  });
  
  // useEffect(() => {
  //   const initialize = async () => {
  //     dispatch({ type: expenseActionTypes.SET_LOADING, payload: true });

  //     try {
  //       const expenses = await fetchExpenses();
  //       dispatch({ type: expenseActionTypes.SET_EXPENSES, payload: expenses });

  //       if (!hasSyncedRef.current) {
  //         hasSyncedRef.current = true;
  //         const newlyCreated = await syncRecurringExpenses();

  //         if (newlyCreated.length > 0) {
  //           for (const expense of newlyCreated) {
  //             const alreadyExists = expenses.some((e) => e.id === expense.id);
  //             if (!alreadyExists) {
  //               dispatch({ type: expenseActionTypes.ADD_EXPENSE, payload: expense });
  //             }
  //           }
  //         }
  //       }

  //     } catch (error) {
  //       dispatch({
  //         type: expenseActionTypes.SET_ERROR,
  //         payload: error instanceof Error ? error.message : "Unknown error",
  //       });
  //     } finally {
  //       dispatch({ type: expenseActionTypes.SET_LOADING, payload: false });
  //     }
  //   };

  //   initialize();
  // }, []);



  // ─── Handlers ───────────────────────────────
  const handleAddExpense = async (input: CreateExpenseInput) => {
    dispatch({ type: expenseActionTypes.SET_LOADING, payload: true });

    const created = await withToast(
      () => addExpense(input),
      {
        success: "Expense added successfully!",
        error: "Failed to add expense",
      }
    );

    if (created) {
      dispatch({ type: expenseActionTypes.ADD_EXPENSE, payload: created });
      closeModal();
    }

    dispatch({ type: expenseActionTypes.SET_LOADING, payload: false });
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

    const saved = await withToast(
      () => updateExpense(baseExpense),
      {
        success: "Expense updated!",
        error: "Failed to update expense",
      }
    );

    if (saved) {
      dispatch({
        type: expenseActionTypes.UPDATE_EXPENSE,
        payload: updated,
      });
      closeModal();
    }

    dispatch({ type: expenseActionTypes.SET_LOADING, payload: false });
  };


  const handleDeleteExpense = async () => {
    if (!activeExpense) return;

    dispatch({ type: expenseActionTypes.SET_LOADING, payload: true });

    const success = await withToast(
      () => deleteExpense(activeExpense.id),
      {
        success: "Expense deleted!",
        error: "Failed to delete expense",
      }
    );

    if (success) {
      dispatch({
        type: expenseActionTypes.DELETE_EXPENSE,
        payload: activeExpense.id,
      });
      closeModal();
    }

    dispatch({ type: expenseActionTypes.SET_LOADING, payload: false });
  };


  // ─── Modal Helpers ──────────────────────────
  const openModal = (type: ModalType, expense: PopulatedExpense | null = null) => {
    setModal(type);
    setActiveExpense(expense);
  };

  const closeModal = () => {
    setModal(null);
    setActiveExpense(null);
  };

  const handleClearFilter = () => {
    setFilterMode("month");
    setSelectedMonth(currentMonth);
    setCustomStartDate(null);
    setCustomEndDate(null);
  };

  // ─── Render ─────────────────────────────────
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

      {/* Filter Controls */}
      <div className="flex flex-wrap gap-4 items-center max-w-5xl w-full mx-auto">
        <select
          className="border border-input rounded px-3 py-1 dark:bg-background dark:text-white"
          value={filterMode}
          onChange={(e) => setFilterMode(e.target.value as FilterMode)}
        >
          <option value="month">Monthly</option>
          <option value="range">Custom Range</option>
          <option value="showAll">Show All</option>
        </select>

        {filterMode === "month" && (
          <select
            className="border border-input rounded px-3 py-1 dark:bg-background dark:text-white"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
          >
            {Array.from({ length: 12 }).map((_, idx) => {
              const label = new Date(2000, idx).toLocaleString("default", {
                month: "long",
              });
              return (
                <option key={idx} value={idx}>
                  {label}
                </option>
              );
            })}
          </select>
        )}

        {filterMode === "range" && (
          <>
            <label className="text-sm text-muted-foreground dark:text-white">From</label>
            <input
              type="date"
              className="border border-input rounded px-2 py-1 dark:bg-background dark:text-white"
              value={customStartDate?.toISOString().split("T")[0] || ""}
              onChange={(e) => setCustomStartDate(new Date(e.target.value))}
            />
            <label className="text-sm text-muted-foreground dark:text-white">To</label>
            <input
              type="date"
              className="border border-input rounded px-2 py-1 dark:bg-background dark:text-white"
              value={customEndDate?.toISOString().split("T")[0] || ""}
              onChange={(e) => setCustomEndDate(new Date(e.target.value))}
            />
            <button
              onClick={handleClearFilter}
              className="text-sm text-blue-600 underline dark:text-blue-400"
            >
              Clear Filter
            </button>
          </>
        )}
      </div>

      {/* Expense Table */}
      <div className="max-w-5xl w-full mx-auto">
        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : error ? (
          <p className="text-destructive">{error}</p>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block">
              <ExpenseTable
                expense={filteredExpenses}
                onEdit={(expense) => openModal("edit", expense)}
                onDelete={(expense) => openModal("delete", expense)}
              />
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden">
              <ExpenseCardList
                expenses={filteredExpenses}
                onEdit={(expense) => openModal("edit", expense)}
                onDelete={(expense) => openModal("delete", expense)}
              />
            </div>
          </>

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
