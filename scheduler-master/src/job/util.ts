export function getUnixTimeStampMuniteGranularity(date: Date) {
  return Math.floor(date.getTime() / 1000 / 60) * 60;
}

export function convertToServerTimeZone(date: Date) {
  const utcTime = date.getTime();
  const serverTimeZoneOffset = date.getTimezoneOffset() * 60 * 1000;
  const serverTime = utcTime + serverTimeZoneOffset;
  const serverDate = new Date(serverTime);
  return serverDate;
}
