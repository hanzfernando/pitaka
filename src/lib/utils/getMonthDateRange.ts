export function getMonthRange(date: Date): [string, string] {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-based
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0); // last day of the month

  const startStr = start.toISOString().split("T")[0];
  const endStr = end.toISOString().split("T")[0];
  return [startStr, endStr];
}