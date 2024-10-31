 export function getDateList  (days)  {
    const dateList = [];
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date();
  
    for (let i = 0; i <= days; i++) {
        const currentDate = new Date(today);
        currentDate.setDate(today.getDate() + i);
        
        // const day = daysOfWeek[currentDate.getDay()];
        // const date = currentDate.getDate();
        const day = daysOfWeek[currentDate.getDay()];
       
      
  
        // dateList.push({ day, date: `${date}` });
        dateList.push({id:i, day:day,date:currentDate});
        
    }
  
    return dateList;
  }