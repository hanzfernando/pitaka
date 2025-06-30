"use client";

import { createContext, useEffect, useReducer } from "react";
import { Category } from "@/types/category";
import { fetchCategories } from "@/lib/services/categoryService";

type CategoryState = {
  categories: Category[];
  loading: boolean;
  error: string | null;
};

const SET_CATEGORIES = "SET_CATEGORIES";
const ADD_CATEGORY = "ADD_CATEGORY";
const UPDATE_CATEGORY = "UPDATE_CATEGORY";
const DELETE_CATEGORY = "DELETE_CATEGORY";
const SET_LOADING = "SET_LOADING";
const SET_ERROR = "SET_ERROR";

type CategoryAction =
  | { type: typeof SET_CATEGORIES; payload: Category[] }
  | { type: typeof ADD_CATEGORY; payload: Category }
  | { type: typeof UPDATE_CATEGORY; payload: Category }
  | { type: typeof DELETE_CATEGORY; payload: string }
  | { type: typeof SET_LOADING; payload: boolean }
  | { type: typeof SET_ERROR; payload: string | null };
  

const initialState: CategoryState = {
  categories: [],
  loading: true,
  error: null,
};

function categoryReducer(state: CategoryState, action: CategoryAction): CategoryState {
  switch (action.type) {
    case SET_CATEGORIES:
      return { ...state, categories: action.payload, loading: false, error: null };
    case ADD_CATEGORY:
      return { ...state, categories: [...state.categories, action.payload], error: null };
    case UPDATE_CATEGORY:
      return {
        ...state,
        categories: state.categories.map((cat) =>
          cat.id === action.payload.id ? action.payload : cat
        ),
        error: null,
      };
    case DELETE_CATEGORY:
      return {
        ...state,
        categories: state.categories.filter((cat) => cat.id !== action.payload),
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

export const CategoryContext = createContext<{
  state: CategoryState;
  dispatch: React.Dispatch<CategoryAction>;
} | undefined>(undefined);

export const CategoryProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(categoryReducer, initialState);

  useEffect(() => {
    const loadCategories = async () => {
      dispatch({ type: SET_LOADING, payload: true });
      try {
        const categories = await fetchCategories();
        dispatch({ type: SET_CATEGORIES, payload: categories });
      } catch (error) {
        dispatch({ type: SET_ERROR, payload: error instanceof Error ? error.message : "Unknown error" });
      }
    };

    loadCategories();
  }, []);

  return (
    <CategoryContext.Provider value={{ state, dispatch }}>
      {children}
    </CategoryContext.Provider>
  );
}

export const categoryActionTypes = {
  SET_CATEGORIES,
  ADD_CATEGORY,
  UPDATE_CATEGORY,
  DELETE_CATEGORY,
  SET_LOADING,
  SET_ERROR,
} as const;