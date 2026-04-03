// Basic stroke order data for common characters
const STROKE_DATA: Record<string, string[]> = {
  '一': ['横'], '二': ['横', '横'], '三': ['横', '横', '横'],
  '人': ['撇', '捺'], '大': ['横', '撇', '捺'], '中': ['竖', '横折', '横', '竖'],
  '国': ['竖', '横折', '横', '横', '竖', '横', '横', '横折'],
  '我': ['撇', '横', '竖钩', '提', '斜钩', '撇', '点'],
  '你': ['撇', '竖', '撇', '横撇', '竖钩', '横', '横'],
};

export function getStrokeOrder(char: string): string[] {
  return STROKE_DATA[char] || ['(stroke data not available)'];
}

export function getStrokeCount(char: string): number {
  return STROKE_DATA[char]?.length ?? -1;
}
