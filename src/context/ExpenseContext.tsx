"use client";

import { createContext, useEffect, useReducer } from "react";
import { PopulatedExpense } from "@/types/expense";
import { fetchExpenses } from "@/lib/services/expenseService";

// ─── Action Constants ─────────────────────────────────
const SET_EXPENSES = "SET_EXPENSES";
const ADD_EXPENSE = "ADD_EXPENSE";
const UPDATE_EXPENSE = "UPDATE_EXPENSE";
const DELETE_EXPENSE = "DELETE_EXPENSE";
const SET_LOADING = "SET_LOADING";
const SET_ERROR = "SET_ERROR";

// ─── Types ────────────────────────────────────────────
type ExpenseState = {
  expenses: PopulatedExpense[];
  loading: boolean;
  error: string | null;
};

type ExpenseAction =
  | { type: typeof SET_EXPENSES; payload: PopulatedExpense[] }
  | { type: typeof ADD_EXPENSE; payload: PopulatedExpense }
  | { type: typeof UPDATE_EXPENSE; payload: PopulatedExpense }
  | { type: typeof DELETE_EXPENSE; payload: string }
  | { type: typeof SET_LOADING; payload: boolean }
  | { type: typeof SET_ERROR; payload: string | null };

const initialState: ExpenseState = {
  expenses: [],
  loading: true,
  error: null,
};

// ─── Reducer ──────────────────────────────────────────
function expenseReducer(state: ExpenseState, action: ExpenseAction): ExpenseState {
  switch (action.type) {
    case SET_EXPENSES:
      return { ...state, expenses: action.payload, loading: false, error: null };
    case ADD_EXPENSE:
      return { ...state, expenses: [action.payload, ...state.expenses], error: null };
    case UPDATE_EXPENSE:
      return {
        ...state,
        expenses: state.expenses.map((e) =>
          e.id === action.payload.id ? action.payload : e
        ),
        error: null,
      };
    case DELETE_EXPENSE:
      return {
        ...state,
        expenses: state.expenses.filter((e) => e.id !== action.payload),
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
export const ExpenseContext = createContext<{
  state: ExpenseState;
  dispatch: React.Dispatch<ExpenseAction>;
} | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────
export const ExpenseProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(expenseReducer, initialState);

  useEffect(() => {
    const loadExpenses = async () => {
      dispatch({ type: SET_LOADING, payload: true });
      try {
        const expenses = await fetchExpenses();
        dispatch({ type: SET_EXPENSES, payload: expenses });
      } catch (error) {
        dispatch({
          type: SET_ERROR,
          payload: error instanceof Error ? error.message : "Unknown error",
        });
      }
    };

    loadExpenses();
  }, []);

  return (
    <ExpenseContext.Provider value={{ state, dispatch }}>
      {children}
    </ExpenseContext.Provider>
  );
};

// ─── Action Types Export ─────────────────────────────
export const expenseActionTypes = {
  SET_EXPENSES,
  ADD_EXPENSE,
  UPDATE_EXPENSE,
  DELETE_EXPENSE,
  SET_LOADING,
  SET_ERROR,
} as const;
