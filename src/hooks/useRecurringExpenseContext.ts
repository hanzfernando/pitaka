import { useContext } from "react";
import { RecurringExpenseContext } from "@/context/RecurringExpenseContext";

export const useRecurringExpenseContext = () => {
  const context = useContext(RecurringExpenseContext);
  if (!context) {
    throw new Error("useRecurringExpenseContext must be used within a RecurringExpenseProvider");
  }
  return context;
};
