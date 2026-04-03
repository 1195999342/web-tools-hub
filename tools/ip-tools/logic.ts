// IP Tools logic

export function randomIPv4(): string {
  return Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join('.');
}

export interface SubnetInfo {
  network: string;
  broadcast: string;
  firstHost: string;
  lastHost: string;
  totalHosts: number;
  mask: string;
}

function ipToNum(ip: string): number {
  const parts = ip.split('.').map(Number);
  return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
}

function numToIp(n: number): string {
  return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.');
}

export function calculateCIDR(cidr: string): SubnetInfo | string {
  const match = cidr.trim().match(/^(\d+\.\d+\.\d+\.\d+)\/(\d+)$/);
  if (!match) return 'Invalid CIDR format (e.g. 192.168.1.0/24)';
  const ip = match[1];
  const prefix = parseInt(match[2], 10);
  if (prefix < 0 || prefix > 32) return 'Prefix must be 0-32';
  const parts = ip.split('.').map(Number);
  if (parts.some(p => p < 0 || p > 255)) return 'Invalid IP address';

  const maskNum = prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0;
  const ipNum = ipToNum(ip);
  const network = (ipNum & maskNum) >>> 0;
  const broadcast = (network | ~maskNum) >>> 0;
  const totalHosts = prefix >= 31 ? (prefix === 32 ? 1 : 2) : (broadcast - network - 1);

  return {
    network: numToIp(network),
    broadcast: numToIp(broadcast),
    firstHost: prefix >= 31 ? numToIp(network) : numToIp(network + 1),
    lastHost: prefix >= 31 ? numToIp(broadcast) : numToIp(broadcast - 1),
    totalHosts,
    mask: numToIp(maskNum),
  };
}
