"use client";

import { ReactNode } from "react";
import { CategoryProvider } from "./CategoryContext";
import { ExpenseProvider } from "./ExpenseContext";
import { RecurringExpenseProvider } from "./RecurringExpenseContext";

type Props = {
  children: ReactNode;
};

const AppProvider = ({ children }: Props) => {
  return (
    <CategoryProvider>
      <ExpenseProvider>
        <RecurringExpenseProvider>
          {children}
        </RecurringExpenseProvider>
      </ExpenseProvider>
    </CategoryProvider>
  );
};

export default AppProvider;
