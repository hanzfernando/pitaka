"use client";

import { createContext, useEffect, useReducer } from "react";
import { RecurringExpense } from "@/types/recurringExpense";
import { fetchRecurringExpenses, syncRecurringExpenses } from "@/lib/services/recurringExpenseService"; // 🟢 make sure sync is imported
import { useExpenseContext } from "@/hooks/useExpenseContext"; // 🟢 to dispatch new synced expenses
import { expenseActionTypes } from "@/context/ExpenseContext"; // 🟢 to dispatch to ExpenseContext

// ─── Action Constants ────────────────────────────────
const SET_RECURRING_EXPENSES = "SET_RECURRING_EXPENSES";
const ADD_RECURRING_EXPENSE = "ADD_RECURRING_EXPENSE";
const UPDATE_RECURRING_EXPENSE = "UPDATE_RECURRING_EXPENSE";
const DELETE_RECURRING_EXPENSE = "DELETE_RECURRING_EXPENSE";
const SET_LOADING = "SET_LOADING";
const SET_ERROR = "SET_ERROR";

// ─── Types ────────────────────────────────────────────
type RecurringExpenseState = {
  recurringExpenses: RecurringExpense[];
  loading: boolean;
  error: string | null;
};

type RecurringExpenseAction =
  | { type: typeof SET_RECURRING_EXPENSES; payload: RecurringExpense[] }
  | { type: typeof ADD_RECURRING_EXPENSE; payload: RecurringExpense }
  | { type: typeof UPDATE_RECURRING_EXPENSE; payload: RecurringExpense }
  | { type: typeof DELETE_RECURRING_EXPENSE; payload: string }
  | { type: typeof SET_LOADING; payload: boolean }
  | { type: typeof SET_ERROR; payload: string | null };

const initialState: RecurringExpenseState = {
  recurringExpenses: [],
  loading: true,
  error: null,
};

// ─── Reducer ──────────────────────────────────────────
function recurringExpenseReducer(
  state: RecurringExpenseState,
  action: RecurringExpenseAction
): RecurringExpenseState {
  switch (action.type) {
    case SET_RECURRING_EXPENSES:
      return { ...state, recurringExpenses: action.payload, loading: false, error: null };
    case ADD_RECURRING_EXPENSE:
      return { ...state, recurringExpenses: [action.payload, ...state.recurringExpenses], error: null };
    case UPDATE_RECURRING_EXPENSE:
      return {
        ...state,
        recurringExpenses: state.recurringExpenses.map((r) =>
          r.id === action.payload.id ? action.payload : r
        ),
        error: null,
      };
    case DELETE_RECURRING_EXPENSE:
      return {
        ...state,
        recurringExpenses: state.recurringExpenses.filter((r) => r.id !== action.payload),
        error: null,
      };
    case SET_LOADING:
      return { ...state, loading: action.payload };
    case SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────
export const RecurringExpenseContext = createContext<{
  state: RecurringExpenseState;
  dispatch: React.Dispatch<RecurringExpenseAction>;
} | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────
export const RecurringExpenseProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(recurringExpenseReducer, initialState);

  const { dispatch: expenseDispatch } = useExpenseContext(); 

  useEffect(() => {
    const initialize = async () => {
      dispatch({ type: SET_LOADING, payload: true });
      try {
        const newlyCreated = await syncRecurringExpenses();
        if (newlyCreated.length > 0) {
          for (const expense of newlyCreated) {
            expenseDispatch({ type: expenseActionTypes.ADD_EXPENSE, payload: expense });
          }
        }

        const recurrences = await fetchRecurringExpenses();
        dispatch({ type: SET_RECURRING_EXPENSES, payload: recurrences });

      } catch (error) {
        dispatch({
          type: SET_ERROR,
          payload: error instanceof Error ? error.message : "Unknown error",
        });
      } finally {
        dispatch({
          type: SET_LOADING,
          payload: false
        })
      }
    };

    initialize();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <RecurringExpenseContext.Provider value={{ state, dispatch }}>
      {children}
    </RecurringExpenseContext.Provider>
  );
};

// ─── Action Types Export ─────────────────────────────
export const recurringExpenseActionTypes = {
  SET_RECURRING_EXPENSES,
  ADD_RECURRING_EXPENSE,
  UPDATE_RECURRING_EXPENSE,
  DELETE_RECURRING_EXPENSE,
  SET_LOADING,
  SET_ERROR,
} as const;
