function isBusinessOpen(company) {
  if (!company?.businessHours) {
    return false;
  }

  const now = new Date();

  const indiaDate = new Date(
    now.toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    })
  );

  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  const today = days[indiaDate.getDay()];

  const hours = company.businessHours[today];

  if (!hours || hours.closed) {
    return false;
  }

  const currentMinutes =
    indiaDate.getHours() * 60 + indiaDate.getMinutes();

  const [openHour, openMinute] =
    hours.open.split(":").map(Number);

  const [closeHour, closeMinute] =
    hours.close.split(":").map(Number);

  const openMinutes = openHour * 60 + openMinute;
  const closeMinutes = closeHour * 60 + closeMinute;

  return (
    currentMinutes >= openMinutes &&
    currentMinutes <= closeMinutes
  );
}

module.exports = isBusinessOpen;