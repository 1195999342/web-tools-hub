// CSS Animation logic

export interface AnimationPreset {
  name: string;
  css: string;
  keyframes: string;
}

export const presets: AnimationPreset[] = [
  { name: 'Fade In', css: 'animation: fadeIn 0.5s ease-in forwards;', keyframes: '@keyframes fadeIn {\n  from { opacity: 0; }\n  to { opacity: 1; }\n}' },
  { name: 'Fade Out', css: 'animation: fadeOut 0.5s ease-out forwards;', keyframes: '@keyframes fadeOut {\n  from { opacity: 1; }\n  to { opacity: 0; }\n}' },
  { name: 'Slide In Left', css: 'animation: slideInLeft 0.5s ease-out forwards;', keyframes: '@keyframes slideInLeft {\n  from { transform: translateX(-100%); opacity: 0; }\n  to { transform: translateX(0); opacity: 1; }\n}' },
  { name: 'Slide In Right', css: 'animation: slideInRight 0.5s ease-out forwards;', keyframes: '@keyframes slideInRight {\n  from { transform: translateX(100%); opacity: 0; }\n  to { transform: translateX(0); opacity: 1; }\n}' },
  { name: 'Slide In Up', css: 'animation: slideInUp 0.5s ease-out forwards;', keyframes: '@keyframes slideInUp {\n  from { transform: translateY(100%); opacity: 0; }\n  to { transform: translateY(0); opacity: 1; }\n}' },
  { name: 'Bounce', css: 'animation: bounce 0.6s ease infinite;', keyframes: '@keyframes bounce {\n  0%, 100% { transform: translateY(0); }\n  50% { transform: translateY(-20px); }\n}' },
  { name: 'Pulse', css: 'animation: pulse 1s ease-in-out infinite;', keyframes: '@keyframes pulse {\n  0%, 100% { transform: scale(1); }\n  50% { transform: scale(1.1); }\n}' },
  { name: 'Shake', css: 'animation: shake 0.5s ease-in-out;', keyframes: '@keyframes shake {\n  0%, 100% { transform: translateX(0); }\n  25% { transform: translateX(-10px); }\n  75% { transform: translateX(10px); }\n}' },
  { name: 'Spin', css: 'animation: spin 1s linear infinite;', keyframes: '@keyframes spin {\n  from { transform: rotate(0deg); }\n  to { transform: rotate(360deg); }\n}' },
  { name: 'Zoom In', css: 'animation: zoomIn 0.5s ease-out forwards;', keyframes: '@keyframes zoomIn {\n  from { transform: scale(0); opacity: 0; }\n  to { transform: scale(1); opacity: 1; }\n}' },
  { name: 'Flip', css: 'animation: flip 0.6s ease-in-out;', keyframes: '@keyframes flip {\n  0% { transform: perspective(400px) rotateY(0); }\n  100% { transform: perspective(400px) rotateY(360deg); }\n}' },
  { name: 'Rubber Band', css: 'animation: rubberBand 0.8s ease;', keyframes: '@keyframes rubberBand {\n  0% { transform: scale(1); }\n  30% { transform: scaleX(1.25) scaleY(0.75); }\n  40% { transform: scaleX(0.75) scaleY(1.25); }\n  50% { transform: scaleX(1.15) scaleY(0.85); }\n  65% { transform: scaleX(0.95) scaleY(1.05); }\n  75% { transform: scaleX(1.05) scaleY(0.95); }\n  100% { transform: scale(1); }\n}' },
];

export function getFullCSS(preset: AnimationPreset): string {
  return `.element {\n  ${preset.css}\n}\n\n${preset.keyframes}`;
}
