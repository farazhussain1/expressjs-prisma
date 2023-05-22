export function isToday(_date: string) {  
  const dateObj = new Date(_date);
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth();
  const date = dateObj.getDate();

  const givenDate = Date.UTC(year, month, date);

  const todayDate = Date.UTC(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate()
  );
  return todayDate == givenDate;
}