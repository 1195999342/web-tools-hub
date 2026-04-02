export interface ToolResult<T> {
  output?: T;
  error?: string;
}

export interface JwtDecoded {
  header: string;
  payload: string;
  signature: string;
  timestamps: { field: string; value: number; readable: string }[];
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const pad = base64.length % 4;
  if (pad) base64 += '='.repeat(4 - pad);
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

const TIME_FIELDS = ['exp', 'iat', 'nbf', 'auth_time', 'updated_at'];

export function decodeJwt(token: string): ToolResult<JwtDecoded> {
  try {
    const parts = token.trim().split('.');
    if (parts.length !== 3) {
      return { error: 'Invalid JWT: must have 3 parts separated by dots' };
    }

    const headerJson = base64UrlDecode(parts[0]);
    const payloadJson = base64UrlDecode(parts[1]);

    // Validate JSON
    const headerObj = JSON.parse(headerJson);
    const payloadObj = JSON.parse(payloadJson);

    const timestamps: JwtDecoded['timestamps'] = [];
    for (const field of TIME_FIELDS) {
      if (typeof payloadObj[field] === 'number') {
        const date = new Date(payloadObj[field] * 1000);
        timestamps.push({
          field,
          value: payloadObj[field],
          readable: date.toISOString().replace('T', ' ').replace('.000Z', ' UTC'),
        });
      }
    }

    return {
      output: {
        header: JSON.stringify(headerObj, null, 2),
        payload: JSON.stringify(payloadObj, null, 2),
        signature: parts[2],
        timestamps,
      },
    };
  } catch (e) {
    return { error: `Invalid JWT: ${(e as Error).message}` };
  }
}
