export const formatDate = (date: any) => {
  const daySuffix = (day: any) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const options: any = { day: "numeric", month: "long", year: "numeric" };
  const formattedDate = new Date(date).toLocaleDateString("en-US", options);

  const day = new Date(date).getDate();
  const dayWithSuffix = `${day}${daySuffix(day)}`;

  const [month, , year] = formattedDate.split(" ");
  return `${dayWithSuffix} ${month}, ${year}`;
};

export const formatDateTime = (date: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  };
  return new Date(date).toLocaleString(undefined, options);
};


export const formatDateApplication = (date: Date | null) => {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}T00:00:00Z`;
};

export const formatAmountWithCommas = (amount:any) => {
  return amount?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
