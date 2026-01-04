export function timeAgo(date: Date | string) {
    const now = new Date();
    const past = new Date(date);
  
    const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);
  
    const intervals: [number, string][] = [
      [60, "second"],
      [60, "minute"],
      [24, "hour"],
      [30, "day"],
      [12, "month"],
    ];
  
    let count = seconds;
    let unit = "second";
  
    for (const [limit, nextUnit] of intervals) {
      if (count < limit) break;
      count = Math.floor(count / limit);
      unit = nextUnit;
    }
  
    return `${count} ${unit}${count > 1 ? "s" : ""} ago`;
  }
  