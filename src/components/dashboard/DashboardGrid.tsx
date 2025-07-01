"use client";

import { useState } from "react";
import { format, subMonths } from "date-fns";
import {
  getTopCategory,
  getExpensesInRange,
  getLineChartData,
  getRecurringTotalsByFrequency,
} from "@/lib/utils/dashboardUtil";
import { useExpenseContext } from "@/hooks/useExpenseContext";
import { useCategoryContext } from "@/hooks/useCategoryContext";
import { useRecurringExpenseContext } from "@/hooks/useRecurringExpenseContext";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";

const COLORS = ["#3b82f6", "#6366f1", "#ec4899", "#10b981", "#f59e0b", "#ef4444"];

const DashboardGrid = () => {
  const [mode, setMode] = useState<"monthly" | "custom">("monthly");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [range, setRange] = useState({
    start: subMonths(new Date(), 1),
    end: new Date(),
  });

  const { state: expenseState } = useExpenseContext();
  const { state: categoryState } = useCategoryContext();
  const { state: recurringState } = useRecurringExpenseContext();

  const expenses = expenseState.expenses || [];
  const categories = categoryState.categories || [];
  const recurring = recurringState.recurringExpenses || [];

  const filteredExpenses =
    mode === "monthly"
      ? expenses.filter((e) => {
          const d = new Date(e.expense_date);
          return d.getMonth() === selectedDate.getMonth() && d.getFullYear() === selectedDate.getFullYear();
        })
      : getExpensesInRange(expenses, range.start, range.end);

  const barData = categories.map((cat) => ({
    name: cat.name,
    total: filteredExpenses
      .filter((e) => e.category_id === cat.id)
      .reduce((sum, e) => sum + e.amount, 0),
  }));

  const pieData = [
    {
      name: "Recurring",
      value: expenses.filter((e) => e.recurring_id).reduce((sum, e) => sum + e.amount, 0),
    },
    {
      name: "One-Time",
      value: expenses.filter((e) => !e.recurring_id).reduce((sum, e) => sum + e.amount, 0),
    },
  ];

  const lineData = getLineChartData(
    filteredExpenses,
    mode === "monthly"
      ? new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
      : range.start,
    mode === "monthly"
      ? new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0)
      : range.end
  );

  const frequencyData = Object.entries(getRecurringTotalsByFrequency(recurring)).map(
    ([key, value]) => ({
      name: key,
      total: value,
    })
  );

  const tooltipStyle = {
    backgroundColor: "#1f2937", // Tailwind's bg-gray-800
    color: "#f9fafb",           // Tailwind's text-gray-100
    borderRadius: "0.5rem",     // Tailwind's rounded-md (8px)
    padding: "0.5rem 0.75rem",  // Tailwind's p-2 and px-3
    border: "1px solid #374151", // Tailwind's border-gray-700
  };


  return (
    <div className="max-w-6xl mx-auto px-4 py-10 text-foreground">
      <h1 className="text-3xl font-bold mb-6">📊 Dashboard</h1>

      {/* Mode Toggle */}
      <div className="mb-6 flex items-center gap-4">
        <button
          className={`px-4 py-2 rounded-md transition ${
            mode === "monthly"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-black dark:bg-gray-300 dark:text-black"
          }`}
          onClick={() => setMode("monthly")}
        >
          Monthly
        </button>
        <button
          className={`px-4 py-2 rounded-md transition ${
            mode === "custom"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-black dark:bg-gray-300 dark:text-black"
          }`}
          onClick={() => setMode("custom")}
        >
          Custom Range
        </button>
      </div>

      {/* Month or Range Picker */}
      {mode === "monthly" ? (
        <select
          className="border px-3 py-1 rounded-md bg-white text-black dark:bg-gray-100 dark:text-black mb-6"
          value={selectedDate.getMonth()} // Use month index
          onChange={(e) => {
            const monthIndex = parseInt(e.target.value, 10);
            const newDate = new Date(new Date().getFullYear(), monthIndex, 1);
            setSelectedDate(newDate);
          }}
        >
          {Array.from({ length: 12 }, (_, i) => {
            const date = subMonths(new Date(), i);
            return (
              <option key={i} value={date.getMonth()}>
                {format(date, "MMMM yyyy")}
              </option>
            );
          })}
        </select>
      ) : (
        <div className="flex gap-4 mb-6">
          <div>
            <label className="text-sm">Start:</label>
            <input
              type="date"
              className="border px-3 py-1 rounded-md bg-white text-black dark:bg-gray-100 dark:text-black"
              value={format(range.start, "yyyy-MM-dd")}
              onChange={(e) => setRange((prev) => ({ ...prev, start: new Date(e.target.value) }))}
            />
          </div>
          <div>
            <label className="text-sm">End:</label>
            <input
              type="date"
              className="border px-3 py-1 rounded-md bg-white text-black dark:bg-gray-100 dark:text-black"
              value={format(range.end, "yyyy-MM-dd")}
              onChange={(e) => setRange((prev) => ({ ...prev, end: new Date(e.target.value) }))}
            />
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow">
          <p className="text-sm text-muted-foreground">Total Expenses</p>
          <h2 className="text-2xl font-semibold">
            ₱{filteredExpenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}
          </h2>
        </div>
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow">
          <p className="text-sm text-muted-foreground">Top Category</p>
          <h2 className="text-2xl font-semibold">
            {getTopCategory(expenses, categories, selectedDate)}
          </h2>
        </div>
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow">
          <p className="text-sm text-muted-foreground">Recurring Expenses</p>
          <h2 className="text-2xl font-semibold">{recurring.length}</h2>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow">
          <h3 className="text-lg font-semibold mb-4">Spending by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="total" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow">
        <h3 className="text-lg font-semibold mb-4">Recurring vs One-Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {pieData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip
              contentStyle={tooltipStyle}
              labelStyle={{ color: "#f9fafb" }}
              itemStyle={{ color: "#f9fafb" }} // this fixes inner value text
            />

          </PieChart>
        </ResponsiveContainer>
      </div>

      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow">
          <h3 className="text-lg font-semibold mb-4">Spending Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow">
          <h3 className="text-lg font-semibold mb-4">Recurring by Frequency</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={frequencyData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="total" fill="#ec4899" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default DashboardGrid;