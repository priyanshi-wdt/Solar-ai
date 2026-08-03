function isBusinessOpen(company) {
  if (!company?.businessHours) {
    return false;
  }

  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  const now = new Date();

  const today = days[now.getDay()];

  const hours = company.businessHours[today];

  if (!hours || hours.closed) {
    return false;
  }

  const currentMinutes =
    now.getHours() * 60 + now.getMinutes();

  const [openHour, openMinute] =
    hours.open.split(":").map(Number);

  const [closeHour, closeMinute] =
    hours.close.split(":").map(Number);

  const openMinutes =
    openHour * 60 + openMinute;

  const closeMinutes =
    closeHour * 60 + closeMinute;

  return (
    currentMinutes >= openMinutes &&
    currentMinutes <= closeMinutes
  );
}

module.exports = isBusinessOpen;