// BMI/BMR Calculator logic
export const TOOL_NAME = 'bmi-bmr';

export function calcBMI(weightKg: number, heightCm: number): number {
  const hm = heightCm / 100;
  return weightKg / (hm * hm);
}

export function bmiCategory(bmi: number): string {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}

export function calcBMR(weightKg: number, heightCm: number, age: number, gender: 'male' | 'female'): number {
  // Mifflin-St Jeor
  if (gender === 'male') return 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  return 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
}
