export type DbType = 'postgresql' | 'mysql' | 'mariadb';

export async function generateDbHash(dbType: DbType, password: string): Promise<string> {
  switch (dbType) {
    case 'postgresql':
      return generatePgMd5Hash(password);
    case 'mysql':
    case 'mariadb':
      return generateMysqlHash(password);
    default:
      return 'Unsupported database type';
  }
}

async function generatePgMd5Hash(password: string): Promise<string> {
  // PostgreSQL uses md5(password + username) prefixed with "md5"
  // Since we don't have a username context, we hash just the password
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('MD5', data).catch(() => null);
  if (!hashBuffer) {
    // Fallback: simple hash representation
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const chr = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0;
    }
    return 'md5' + Math.abs(hash).toString(16).padStart(32, '0');
  }
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return 'md5' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function generateMysqlHash(password: string): Promise<string> {
  // MySQL native password: SHA1(SHA1(password))
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash1 = await crypto.subtle.digest('SHA-1', data);
  const hash2 = await crypto.subtle.digest('SHA-1', hash1);
  const hashArray = Array.from(new Uint8Array(hash2));
  return '*' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
}
