import { filterExpenses, searchExpenses } from "../expenseFilter";
import { PopulatedExpense } from "@/types/expense";

const expenses: PopulatedExpense[] = [
  {
    id: "exp1",
    user_id: "user1",
    category_id: "cat1",
    name: "Groceries",
    amount: 1500,
    expense_date: new Date("2025-07-06"),
    recurring_id: null,
    created_at: new Date("2025-07-01"),
    category: {
      name: "Food",
      color: "#FF5733",
    },
    recurring_expenses: null,
  },
  {
    id: "exp2",
    user_id: "user1",
    category_id: "cat2",
    name: "Monthly Rent",
    amount: 10000,
    expense_date: new Date("2025-07-01"),
    recurring_id: "rec1",
    created_at: new Date("2025-07-01"),
    category: {
      name: "Housing",
      color: "#2980B9",
    },
    recurring_expenses: {
      frequency: "monthly",
      start_date: "2025-01-01",
      end_date: null,
    },
  },
  {
    id: "exp3",
    user_id: "user1",
    category_id: null,
    name: "Gym Membership",
    amount: 1200,
    expense_date: new Date("2025-06-15"),
    recurring_id: null,
    created_at: new Date("2025-06-10"),
    category: null,
    recurring_expenses: null,
  },
]

describe("filterExpenses", () => {
  it("should filter by month", () => {
    const filtered = filterExpenses({
      expenses,
      filterMode: "month",
      selectedMonth: 6, // July
      customStartDate: null,
      customEndDate: null,
      now: new Date("2025-07-01"),
    })

    expect(filtered).toEqual([
      expenses[0], // Groceries
      expenses[1], // Monthly Rent
    ]);
  });

  it("should filter by date range", () => {
    const filtered = filterExpenses({
      expenses,
      filterMode: "range",
      selectedMonth: 0, // Not used in range mode
      customStartDate: new Date("2025-06-15"),
      customEndDate: new Date("2025-07-01"),
      now: new Date("2025-07-01"),
    });

    expect(filtered).toEqual([
      expenses[1], // Monthly Rent
      expenses[2], // Gym Membership
    ]);
  });

  it("should show all expenses", () => {
    const filtered = filterExpenses({
      expenses,
      filterMode: "showAll",
      selectedMonth: 0, // Not used in showAll mode
      customStartDate: null,
      customEndDate: null,
      now: new Date("2025-07-01"),
    });

    expect(filtered).toEqual(expenses);
  });

  it("should return empty array for invalid range", () => {
    const filtered = filterExpenses({
      expenses,
      filterMode: "range",
      selectedMonth: 0, // Not used in range mode
      customStartDate: null,
      // customStartDate: new Date("2025-07-01"),
      customEndDate: new Date("2025-06-15"),
      now: new Date("2025-07-01"),
    });

    expect(filtered).toEqual([]);
  });

  it("should handle empty expenses array", () => {
    const filtered = filterExpenses({
      expenses: [],
      filterMode: "month",
      selectedMonth: 6,
      customStartDate: null,
      customEndDate: null,
      now: new Date("2025-07-01"),
    });

    expect(filtered).toEqual([]);
  });
  
  it("should include expenses on the last day of the selected month", () => {
    const edgeExpense = {
      ...expenses[0],
      id: "exp4",
      name: "Edge Expense",
      expense_date: new Date("2025-07-31"),
    };
    const filtered = filterExpenses({
      expenses: [...expenses, edgeExpense],
      filterMode: "month",
      selectedMonth: 6,
      customStartDate: null,
      customEndDate: null,
      now: new Date("2025-07-01"),
    });

    expect(filtered).toContainEqual(edgeExpense);
  });

  it("should include expense if expense_date matches start and end date exactly", () => {
    const filtered = filterExpenses({
      expenses,
      filterMode: "range",
      selectedMonth: 0,
      customStartDate: new Date("2025-06-15"),
      customEndDate: new Date("2025-06-15"),
      now: new Date("2025-07-01"),
    });

    expect(filtered).toEqual([expenses[2]]); // Gym Membership
  });

});

describe("searchExpenses", () => {
  it("should search by expense name", () => {
    const filtered = searchExpenses(expenses, "GroCerIes");

    expect(filtered).toEqual([expenses[0]]);
  })

  it("should retrun all matching expense", () => {
    const filtered = searchExpenses(expenses, "R");

    expect(filtered).toEqual([expenses[0], expenses[1], expenses[2], ])
  })

  it("should return expense based on searched category name", () => {
    const filtered = searchExpenses(expenses, "Housing")

    expect(filtered).toEqual([expenses[1]])
  })

  it("should return all expenses when search term is empty", () => {
    const filtered = searchExpenses(expenses, "");
    expect(filtered).toEqual(expenses);
  });

  it("should return empty array when no match is found", () => {
    const filtered = searchExpenses(expenses, "Transportation");
    expect(filtered).toEqual([]);
  });

  it("should not crash when expense has null category", () => {
    const filtered = searchExpenses(expenses, "Gym");
    expect(filtered).toEqual([expenses[2]]);
  });


})