// ID Card Check logic (Chinese ID card - 18 digits)
export const TOOL_NAME = 'id-card-check';

const WEIGHTS = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
const CHECK_CODES = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];

export interface IDCardInfo {
  valid: boolean;
  birthday: string;
  gender: string;
  region: string;
}

export function parseIDCard(id: string): IDCardInfo {
  const cleaned = id.trim().toUpperCase();
  if (cleaned.length !== 18) return { valid: false, birthday: '', gender: '', region: '' };

  const birthday = `${cleaned.slice(6, 10)}-${cleaned.slice(10, 12)}-${cleaned.slice(12, 14)}`;
  const genderCode = parseInt(cleaned[16]);
  const gender = genderCode % 2 === 1 ? 'Male' : 'Female';
  const region = cleaned.slice(0, 6);

  // Validate checksum
  let sum = 0;
  for (let i = 0; i < 17; i++) {
    const d = parseInt(cleaned[i]);
    if (isNaN(d)) return { valid: false, birthday, gender, region };
    sum += d * WEIGHTS[i];
  }
  const expectedCheck = CHECK_CODES[sum % 11];
  const valid = cleaned[17] === expectedCheck;

  return { valid, birthday, gender, region };
}
