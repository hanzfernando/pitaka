"use client";

import { createContext, useReducer, ReactNode, useEffect } from "react";
import { getUserDisplayName } from "@/lib/services/userService";
// ─── State Type ──────────────────────────────────────────────
type UserState = {
  displayName: string;
  loading: boolean;
  error: string | null;
};

const initialState: UserState = {
  displayName: "",
  loading: false,
  error: null,
};

// ─── Action Types ────────────────────────────────────────────
export const userActionTypes = {
  SET_DISPLAY_NAME: "SET_DISPLAY_NAME",
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
} as const;

type Action =
  | { type: typeof userActionTypes.SET_DISPLAY_NAME; payload: string }
  | { type: typeof userActionTypes.SET_LOADING; payload: boolean }
  | { type: typeof userActionTypes.SET_ERROR; payload: string | null };

// ─── Reducer ─────────────────────────────────────────────────
function userReducer(state: UserState, action: Action): UserState {
  switch (action.type) {
    case userActionTypes.SET_DISPLAY_NAME:
      return { ...state, displayName: action.payload };
    case userActionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    case userActionTypes.SET_ERROR:
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

// ─── Context & Provider ──────────────────────────────────────
export const UserContext = createContext<{
  state: UserState;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => undefined,
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // Load user display name once on initial render
  useEffect(() => {
    const getName = async () => {
      dispatch({ type: userActionTypes.SET_LOADING, payload: true });
      try {
        const displayName = await getUserDisplayName();
        console.log("Fetched display name:", displayName);
        dispatch({
          type: userActionTypes.SET_DISPLAY_NAME,
          payload: displayName || "user",
        });
      } catch (error) {
        dispatch({
          type: userActionTypes.SET_ERROR,
          payload: error instanceof Error ? error.message : "Failed to load user",
        });
      } finally {
        dispatch({ type: userActionTypes.SET_LOADING, payload: false });
      }
    }

    getName();
  }, []);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
}