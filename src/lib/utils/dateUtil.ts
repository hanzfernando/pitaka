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

function addFrequency(date: Date, frequency: string): Date {
  switch (frequency) {
    case "daily": return addDays(date, 1);
    case "weekly": return addWeeks(date, 1);
    case "monthly": return addMonths(date, 1);
    case "yearly": return addYears(date, 1);
    default: return addDays(date, 1);
  }
}

export function getExpectedRecurringDates(
  startDate: Date,
  frequency: string,
  endDate?: Date
): Date[] {
  const today = startOfDay(new Date());
  const finalDate = endDate ? startOfDay(endDate) : today;

  if (isAfter(startDate, finalDate)) return [];

  const dates: Date[] = [];
  let current = startOfDay(startDate);

  while (isBefore(current, today) || isEqual(current, today)) {
    if (endDate && isAfter(current, finalDate)) break;
    dates.push(current);
    current = addFrequency(current, frequency);
  }

  return dates;
}

export function getMissingDates(expected: Date[], existing: Date[]): Date[] {
  return expected.filter(date =>
    !existing.some(existingDate => isSameDay(existingDate, date))
  );
}


export function getRecurringDateRange(
  startDateInput: Date | string,
  frequency: string,
  endDateInput?: Date | string | null
): Date[] {
  const start = parseSafe(startDateInput);
  const end = endDateInput ? parseSafe(endDateInput) : startOfDay(new Date());

  if (isAfter(start, end)) return [];

  const dates: Date[] = [];
  let current = start;

  while (isBefore(current, end) || isEqual(current, end)) {
    dates.push(current);
    current = addFrequency(current, frequency);
  }

  return dates;
}



function parseSafe(input: Date | string): Date {
  return startOfDay(isDate(input) ? input : parseISO(input));
}

export function formatDateOnly(dateInput: Date | string): string {
  const date = isDate(dateInput) ? dateInput : parseISO(dateInput);
  return format(startOfDay(date), "yyyy-MM-dd"); // outputs '2025-07-03'
}
