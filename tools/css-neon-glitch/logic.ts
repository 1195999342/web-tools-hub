// Neon & Glitch Text logic

export function generateNeonCSS(text: string, color: string): string {
  return `.neon-text {
  font-size: 3rem;
  font-weight: bold;
  color: ${color};
  text-shadow:
    0 0 7px ${color},
    0 0 10px ${color},
    0 0 21px ${color},
    0 0 42px ${color},
    0 0 82px ${color};
  animation: neonFlicker 1.5s infinite alternate;
}

@keyframes neonFlicker {
  0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
    text-shadow:
      0 0 7px ${color},
      0 0 10px ${color},
      0 0 21px ${color},
      0 0 42px ${color};
  }
  20%, 24%, 55% {
    text-shadow: none;
  }
}`;
}

export function generateGlitchCSS(text: string, color: string): string {
  return `.glitch {
  position: relative;
  font-size: 3rem;
  font-weight: bold;
  color: ${color};
  animation: glitch 0.3s infinite;
}

.glitch::before,
.glitch::after {
  content: "${text}";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.glitch::before {
  color: #ff0000;
  z-index: -1;
  animation: glitchLeft 0.3s infinite;
}

.glitch::after {
  color: #0000ff;
  z-index: -2;
  animation: glitchRight 0.3s infinite;
}

@keyframes glitchLeft {
  0% { transform: translate(0); }
  20% { transform: translate(-3px, 3px); }
  40% { transform: translate(-3px, -3px); }
  60% { transform: translate(3px, 3px); }
  80% { transform: translate(3px, -3px); }
  100% { transform: translate(0); }
}

@keyframes glitchRight {
  0% { transform: translate(0); }
  20% { transform: translate(3px, -3px); }
  40% { transform: translate(3px, 3px); }
  60% { transform: translate(-3px, -3px); }
  80% { transform: translate(-3px, 3px); }
  100% { transform: translate(0); }
}`;
}
