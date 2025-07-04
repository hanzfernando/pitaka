import {
  startOfDay,
  isBefore,
  isEqual,
  addDays,
  addWeeks,
  addMonths,
  addYears,
  isAfter,
  isDate,
  parseISO,
  format,
  isSameDay,
} from "date-fns";

// Get start and end of the month for a given date
export function getMonthRange(date: Date): [string, string] {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-based
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0); // last day of month

  return [
    formatDateOnly(start),
    formatDateOnly(end)
  ];
}

// Safer parsing — strips time and supports both string/Date input
function parseSafe(input: Date | string): Date {
  return startOfDay(isDate(input) ? input : parseISO(input));
}

// Generate recurring dates from a start date until end/today — useful for initial generation
export function getRecurringDateRange(
  startDateInput: Date | string,
  frequency: string,
  endDateInput?: Date | string
): Date[] {
  const startDate = parseSafe(startDateInput);
  const today = startOfDay(new Date());
  const endDate = endDateInput ? parseSafe(endDateInput) : today;

  if (isAfter(startDate, endDate)) return []; // Guard clause: skip if date range is invalid

  const dates: Date[] = [];
  let current = startDate;

  while (isBefore(current, endDate) || isEqual(current, endDate)) {
    dates.push(current);
    current = addFrequency(current, frequency);
  }

  return dates;
}

// Used when syncing — generates *all expected* dates starting from the base (inclusive)
export function getExpectedRecurringDates(
  startDateInput: Date,
  frequency: string,
  endDate?: Date
): Date[] {
  const startDate = startOfDay(startDateInput);
  const today = startOfDay(new Date());
  const finalDate = endDate ? startOfDay(endDate) : today;

  if (isAfter(startDate, finalDate)) return []; // Prevent infinite loop

  const result: Date[] = [];
  let current = startDate;

  while (isBefore(current, today) || isEqual(current, today)) {
    if (endDate && isAfter(current, finalDate)) break;

    result.push(current);
    current = addFrequency(current, frequency);
  }

  return result;
}

// Add frequency interval to a date
function addFrequency(date: Date, frequency: string): Date {
  switch (frequency) {
    case "daily": return addDays(date, 1);
    case "weekly": return addWeeks(date, 1);
    case "monthly": return addMonths(date, 1);
    case "yearly": return addYears(date, 1);
    default: return addDays(date, 1);
  }
}

// Format a date as yyyy-MM-dd
export function formatDateOnly(dateInput: Date | string): string {
  const date = isDate(dateInput) ? dateInput : parseISO(dateInput);
  return format(startOfDay(date), "yyyy-MM-dd");
}

// Check if two dates are the same day (for better filtering/matching)
export function areDatesEqual(a: Date, b: Date): boolean {
  return isSameDay(startOfDay(a), startOfDay(b));
}
