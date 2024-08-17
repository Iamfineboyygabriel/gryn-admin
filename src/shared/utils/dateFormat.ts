export const formatDate = (date:any) => {
    const daySuffix = (day:any) => {
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
  
    const options:any = { day: "numeric", month: "long", year: "numeric" };
    const formattedDate = new Date(date).toLocaleDateString("en-US", options);
  
    const day = new Date(date).getDate();
    const dayWithSuffix = `${day}${daySuffix(day)}`;
  
    const [month, , year] = formattedDate.split(' ');
    return `${dayWithSuffix} ${month}, ${year}`;
  };
  