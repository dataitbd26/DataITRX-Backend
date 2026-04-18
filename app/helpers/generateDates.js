import moment from "moment-timezone";

export function generateRecentDates(timezone = "Asia/Dhaka") {
  // We use moment to respect the timezone when evaluating today vs last month boundaries
  const localMoment = moment().tz(timezone);
  const today = localMoment.date();
  
  const lastMonthMoment = localMoment.clone().subtract(1, 'months').endOf('month');
  const lastDayOfLastMonth = lastMonthMoment.date();

  const dates = [];

  for (let day = today; day <= lastDayOfLastMonth; day++) {
    dates.push({
      _id: day,
    });
  }

  for (let day = 1; day <= today; day++) {
    dates.push({
      _id: day < 10 ? `0${day}` : day,
    });
  }

  return dates;
}

export function generateDates(year, month, timezone = "Asia/Dhaka") {
  const dates = [];
  const currentDays = generateRecentDates(timezone);
  
  const localMoment = moment().tz(timezone);
  const currentMonth = localMoment.month() + 1; // 1-12
  const currentYear = localMoment.year();

  const inputMoment = moment.tz(`${year}-${month < 10 ? '0'+month : month}-01`, "YYYY-MM-DD", timezone);
  const inputYear = inputMoment.year();
  const inputMonth = inputMoment.month() + 1;
  const daysInMonth = inputMoment.daysInMonth();
  for (let day = 1; day <= daysInMonth; day++) {
    dates.push({
      _id: day < 10 ? `0${day}` : day,
    });
  }

  if (currentMonth === inputMonth && currentYear === inputYear) {
    return currentDays;
  }
  return dates;
}

export function convertDateData(year, month, data) {
  const days = generateDates(year, month);
  const result = days.map((day) => {
    const sales = data.find((s) => {
      return s._id === `${year}-${month < 10 ? `0${month}` : month}-${day._id}`;
    });

    // console.log(sales, "sales");

    return {
      label: day._id,
      totalAmount: sales ? sales.totalAmount : 0,
      totalSales: sales ? sales.count : 0,
    };
  });

  return result;
}
