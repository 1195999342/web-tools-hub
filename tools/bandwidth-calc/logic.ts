// Bandwidth Calculator logic
export const TOOL_NAME = 'bandwidth-calc';

// bandwidth in Mbps, data in MB, time in seconds
export function calcBandwidth(data: number, time: number): number {
  return (data * 8) / time; // Mbps
}

export function calcData(bandwidth: number, time: number): number {
  return (bandwidth * time) / 8; // MB
}

export function calcTime(bandwidth: number, data: number): number {
  return (data * 8) / bandwidth; // seconds
}

export function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds.toFixed(2)} seconds`;
  if (seconds < 3600) return `${(seconds / 60).toFixed(2)} minutes`;
  return `${(seconds / 3600).toFixed(2)} hours`;
}
