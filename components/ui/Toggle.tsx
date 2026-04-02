'use client';

import React, { useState, useCallback } from 'react';

interface ToggleProps {
  label?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
}

export default function Toggle({ label, checked, onChange, className = '' }: ToggleProps) {
  const [internalChecked, setInternalChecked] = useState(checked ?? false);
  const current = checked ?? internalChecked;

  const handleToggle = useCallback(() => {
    const next = !current;
    setInternalChecked(next);
    onChange?.(next);
  }, [current, onChange]);

  return (
    <div className={['flex items-center gap-3', className].filter(Boolean).join(' ')}>
      <button
        type="button"
        role="switch"
        aria-checked={current}
        aria-label={label ?? 'Toggle'}
        onClick={handleToggle}
        className={[
          'relative inline-flex h-[28px] w-[52px] min-w-[44px] min-h-[44px] items-center rounded-full transition-colors',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
          current ? 'bg-blue-600' : 'bg-gray-300',
        ].join(' ')}
      >
        <span
          aria-hidden="true"
          className={[
            'inline-block h-[22px] w-[22px] rounded-full bg-white shadow-sm transition-transform',
            current ? 'translate-x-[27px]' : 'translate-x-[3px]',
          ].join(' ')}
        />
      </button>
      {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
    </div>
  );
}
