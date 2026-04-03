// Vibration Calculator logic
export const TOOL_NAME = 'vibration-calc';

// velocity (mm/s), frequency (Hz), displacement (mm peak-to-peak)
// displacement = velocity / (π * frequency)  (peak-to-peak = 2 * amplitude)
// velocity = π * frequency * displacement

export function calcVelocity(frequency: number, displacement: number): number {
  return Math.PI * frequency * displacement;
}

export function calcFrequency(velocity: number, displacement: number): number {
  return velocity / (Math.PI * displacement);
}

export function calcDisplacement(velocity: number, frequency: number): number {
  return velocity / (Math.PI * frequency);
}
