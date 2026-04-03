// Fuel Calculator logic
export const TOOL_NAME = 'fuel-calc';

export function calcFuelConsumption(distanceKm: number, fuelLiters: number) {
  const lPer100 = (fuelLiters / distanceKm) * 100;
  const mpg = distanceKm / 1.60934 / (fuelLiters / 3.78541);
  const kmPerL = distanceKm / fuelLiters;
  return { lPer100km: lPer100, mpg, kmPerLiter: kmPerL };
}
