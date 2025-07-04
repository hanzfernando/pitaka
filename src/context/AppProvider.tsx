"use client";

import { ReactNode } from "react";
import { UserProvider } from "./UserContext";
import { CategoryProvider } from "./CategoryContext";
import { ExpenseProvider } from "./ExpenseContext";
import { RecurringExpenseProvider } from "./RecurringExpenseContext";

type Props = {
  children: ReactNode;
};

const AppProvider = ({ children }: Props) => {
  return (
    <UserProvider>
      <CategoryProvider>
        <ExpenseProvider>
          <RecurringExpenseProvider>
            {children}
          </RecurringExpenseProvider>
        </ExpenseProvider>
      </CategoryProvider>
    </UserProvider>
  );
};

export default AppProvider;
