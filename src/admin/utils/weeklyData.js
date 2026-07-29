export const getWeekFromDate = (inputDate = new Date()) => {
  const date = new Date(inputDate); // clone to avoid mutating
  const dayOfWeek = date.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6

  // Calculate how many days to subtract to get Monday
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(date);
  monday.setDate(date.getDate() + mondayOffset);

  // Generate the week: Monday to Sunday
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return {
      date: d,
      formatted: d.toISOString().split("T")[0],
      label: d.toLocaleDateString('en-US', {
        weekday: 'short',
        day: 'numeric',
      }),
    };
  });

  return weekDates;
};
