export const converTime =(time)=> {
      
    const [hours, minutes, seconds] = time.split(':').map(Number);
  
    // Xây dựng chuỗi mới với định dạng "xhym"
    const formattedTime = `${hours}h${minutes}m`;
  
    return formattedTime;
  }
