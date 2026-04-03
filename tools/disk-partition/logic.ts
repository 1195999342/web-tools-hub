// Disk Partition logic
export const TOOL_NAME = 'disk-partition';

// Windows shows GB as GiB (1 GB = 1024 MB), so to get Windows to display X GB,
// you need X * 1024 MB
export function calcPartitionMB(desiredGB: number): number {
  return desiredGB * 1024;
}

export function calcActualGB(mb: number): number {
  return mb / 1024;
}
