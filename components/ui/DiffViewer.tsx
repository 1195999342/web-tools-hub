import React from 'react';

interface DiffViewerProps {
  left: string;
  right: string;
  leftLabel?: string;
  rightLabel?: string;
  className?: string;
}

function diffLines(left: string[], right: string[]): { leftLines: DiffLine[]; rightLines: DiffLine[] } {
  const leftLines: DiffLine[] = [];
  const rightLines: DiffLine[] = [];
  const maxLen = Math.max(left.length, right.length);

  for (let i = 0; i < maxLen; i++) {
    const l = i < left.length ? left[i] : undefined;
    const r = i < right.length ? right[i] : undefined;

    if (l === r) {
      leftLines.push({ text: l ?? '', type: 'unchanged' });
      rightLines.push({ text: r ?? '', type: 'unchanged' });
    } else {
      leftLines.push({ text: l ?? '', type: l !== undefined ? 'removed' : 'empty' });
      rightLines.push({ text: r ?? '', type: r !== undefined ? 'added' : 'empty' });
    }
  }

  return { leftLines, rightLines };
}

interface DiffLine {
  text: string;
  type: 'added' | 'removed' | 'unchanged' | 'empty';
}

const lineStyles: Record<DiffLine['type'], string> = {
  added: 'bg-green-100 text-green-900',
  removed: 'bg-red-100 text-red-900',
  unchanged: 'text-gray-700',
  empty: 'bg-gray-100 text-gray-400',
};

function DiffPanel({ lines, label }: { lines: DiffLine[]; label?: string }) {
  return (
    <div className="flex-1 min-w-0 overflow-auto">
      {label && (
        <div className="px-3 py-2 bg-gray-100 border-b border-gray-200 text-sm font-medium text-gray-700">
          {label}
        </div>
      )}
      <div className="font-mono text-xs leading-[1.5rem]">
        {lines.map((line, i) => (
          <div
            key={i}
            className={['flex', lineStyles[line.type]].join(' ')}
          >
            <span className="w-10 shrink-0 text-right pr-2 text-gray-400 select-none border-r border-gray-200">
              {line.type !== 'empty' ? i + 1 : ''}
            </span>
            <span className="px-2 whitespace-pre">{line.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DiffViewer({
  left,
  right,
  leftLabel,
  rightLabel,
  className = '',
}: DiffViewerProps) {
  const leftArr = left.split('\n');
  const rightArr = right.split('\n');
  const { leftLines, rightLines } = diffLines(leftArr, rightArr);

  return (
    <div
      className={[
        'flex rounded-md border border-gray-200 overflow-hidden',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      role="region"
      aria-label="Diff viewer"
    >
      <DiffPanel lines={leftLines} label={leftLabel} />
      <div className="w-px bg-gray-200" />
      <DiffPanel lines={rightLines} label={rightLabel} />
    </div>
  );
}
