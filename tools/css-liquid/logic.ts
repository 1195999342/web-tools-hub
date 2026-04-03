// Liquid Effect logic

export function generateLiquidCSS(color1: string, color2: string, complexity: number, speed: number): string {
  const borderRadius = Array.from({ length: 8 }, () => `${30 + Math.floor(Math.random() * complexity)}%`).join(' ');
  const borderRadius2 = Array.from({ length: 8 }, () => `${30 + Math.floor(Math.random() * complexity)}%`).join(' ');
  return `.liquid-blob {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, ${color1}, ${color2});
  border-radius: ${borderRadius};
  animation: liquidMorph ${speed}s ease-in-out infinite;
}

@keyframes liquidMorph {
  0%, 100% {
    border-radius: ${borderRadius};
  }
  50% {
    border-radius: ${borderRadius2};
  }
}`;
}
