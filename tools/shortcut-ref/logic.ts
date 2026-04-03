export interface Shortcut { keys: string; action: string; }

export const VSCODE_SHORTCUTS: Shortcut[] = [
  { keys: 'Ctrl+Shift+P', action: 'Command Palette' },
  { keys: 'Ctrl+P', action: 'Quick Open file' },
  { keys: 'Ctrl+Shift+N', action: 'New window' },
  { keys: 'Ctrl+B', action: 'Toggle sidebar' },
  { keys: 'Ctrl+`', action: 'Toggle terminal' },
  { keys: 'Ctrl+/', action: 'Toggle line comment' },
  { keys: 'Ctrl+Shift+K', action: 'Delete line' },
  { keys: 'Alt+Up/Down', action: 'Move line up/down' },
  { keys: 'Ctrl+D', action: 'Select next occurrence' },
  { keys: 'Ctrl+Shift+L', action: 'Select all occurrences' },
  { keys: 'Ctrl+H', action: 'Find and replace' },
  { keys: 'Ctrl+F', action: 'Find in file' },
  { keys: 'Ctrl+Shift+F', action: 'Find in workspace' },
  { keys: 'F12', action: 'Go to definition' },
  { keys: 'Alt+F12', action: 'Peek definition' },
  { keys: 'Ctrl+Shift+E', action: 'Explorer panel' },
  { keys: 'Ctrl+Shift+G', action: 'Source control' },
  { keys: 'Ctrl+Shift+X', action: 'Extensions' },
  { keys: 'Ctrl+K Ctrl+S', action: 'Keyboard shortcuts' },
  { keys: 'Ctrl+,', action: 'Settings' },
];

export const DEVTOOLS_SHORTCUTS: Shortcut[] = [
  { keys: 'F12 / Ctrl+Shift+I', action: 'Open DevTools' },
  { keys: 'Ctrl+Shift+C', action: 'Inspect element' },
  { keys: 'Ctrl+Shift+J', action: 'Open Console' },
  { keys: 'Ctrl+Shift+M', action: 'Toggle device mode' },
  { keys: 'Ctrl+L', action: 'Clear console' },
  { keys: 'Ctrl+Shift+P', action: 'Command menu' },
  { keys: 'Ctrl+F', action: 'Search in panel' },
  { keys: 'Ctrl+O', action: 'Open file in Sources' },
  { keys: 'F8', action: 'Pause/resume script' },
  { keys: 'F10', action: 'Step over' },
  { keys: 'F11', action: 'Step into' },
  { keys: 'Shift+F11', action: 'Step out' },
  { keys: 'Ctrl+Shift+E', action: 'Network panel' },
  { keys: 'Esc', action: 'Toggle console drawer' },
  { keys: 'Ctrl+]', action: 'Next panel' },
  { keys: 'Ctrl+[', action: 'Previous panel' },
];

export function filterShortcuts(list: Shortcut[], query: string): Shortcut[] {
  if (!query.trim()) return list;
  const q = query.toLowerCase();
  return list.filter(s => s.keys.toLowerCase().includes(q) || s.action.toLowerCase().includes(q));
}
