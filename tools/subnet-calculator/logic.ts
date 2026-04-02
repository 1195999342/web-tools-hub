export interface SubnetInfo {
  cidr: number; mask: string; wildcard: string; hosts: number; networkClass: string;
}

export function cidrToMask(cidr: number): string {
  const mask = (0xFFFFFFFF << (32 - cidr)) >>> 0;
  return [(mask >>> 24) & 255, (mask >>> 16) & 255, (mask >>> 8) & 255, mask & 255].join('.');
}

export function maskToCidr(mask: string): number {
  const parts = mask.split('.').map(Number);
  const binary = parts.map(p => p.toString(2).padStart(8, '0')).join('');
  return binary.split('').filter(b => b === '1').length;
}

export function getSubnetTable(): SubnetInfo[] {
  const table: SubnetInfo[] = [];
  for (let cidr = 32; cidr >= 0; cidr--) {
    const mask = cidrToMask(cidr);
    const wildParts = mask.split('.').map(p => 255 - Number(p));
    const hosts = Math.max(0, Math.pow(2, 32 - cidr) - 2);
    let cls = 'N/A';
    if (cidr >= 24) cls = 'C';
    else if (cidr >= 16) cls = 'B';
    else if (cidr >= 8) cls = 'A';
    table.push({ cidr, mask, wildcard: wildParts.join('.'), hosts, networkClass: cls });
  }
  return table;
}
