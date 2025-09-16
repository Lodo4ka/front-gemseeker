export const dateNDaysAgo = (n: number): Date => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
};

export const shiftDate = (date: Date, numDays: number): Date => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + numDays);
  return newDate;
};

export const getBeginningTimeForDate = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

export const convertToDate = (date: number): Date => {
  return new Date(date * 1000);
};

export const getRange = (count: number): number[] => {
  return Array.from({ length: count }, (_, i) => i);
};
