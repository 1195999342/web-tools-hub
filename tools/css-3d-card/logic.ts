// 3D Card Flip logic

export type FlipDirection = 'horizontal' | 'vertical';

export function generate3DCardCSS(direction: FlipDirection, speed: number): { html: string; css: string } {
  const axis = direction === 'horizontal' ? 'Y' : 'X';
  const css = `.card-container {
  width: 300px;
  height: 200px;
  perspective: 1000px;
}

.card {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform ${speed}s ease;
}

.card-container:hover .card {
  transform: rotate${axis}(180deg);
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
}

.card-front {
  background: linear-gradient(135deg, #3B82F6, #8B5CF6);
  color: white;
}

.card-back {
  background: linear-gradient(135deg, #10B981, #3B82F6);
  color: white;
  transform: rotate${axis}(180deg);
}`;

  const html = `<div class="card-container">
  <div class="card">
    <div class="card-front">Front</div>
    <div class="card-back">Back</div>
  </div>
</div>`;

  return { html, css };
}
