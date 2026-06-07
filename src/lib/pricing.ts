// June 12th, 2026 at 00:00 AM (local time)
export const PRICE_INCREASE_DATE = new Date("2026-06-12T00:00:00+03:00");

export function getGuidePrices() {
  const now = new Date();
  const isAfterIncrease = now >= PRICE_INCREASE_DATE;
  return {
    low: isAfterIncrease ? 15 : 2,
    high: isAfterIncrease ? 20 : 5,
    isAfterIncrease,
  };
}
