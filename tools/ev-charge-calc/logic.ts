// EV Charge Calculator logic
export const TOOL_NAME = 'ev-charge-calc';

export interface EVResult {
  energyNeeded: number; // kWh
  cost: number;
  timeHours: number;
}

export function calcEVCharge(
  batteryCapacity: number, // kWh
  currentPercent: number,
  targetPercent: number,
  chargerPower: number, // kW
  pricePerKwh: number,
): EVResult {
  const energyNeeded = batteryCapacity * (targetPercent - currentPercent) / 100;
  const cost = energyNeeded * pricePerKwh;
  const timeHours = energyNeeded / chargerPower;
  return { energyNeeded, cost, timeHours };
}
