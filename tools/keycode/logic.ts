export interface KeyInfo {
  key: string; code: string; keyCode: number; which: number;
  altKey: boolean; ctrlKey: boolean; shiftKey: boolean; metaKey: boolean;
}

export function extractKeyInfo(e: KeyboardEvent): KeyInfo {
  return {
    key: e.key, code: e.code, keyCode: e.keyCode, which: e.which,
    altKey: e.altKey, ctrlKey: e.ctrlKey, shiftKey: e.shiftKey, metaKey: e.metaKey,
  };
}
