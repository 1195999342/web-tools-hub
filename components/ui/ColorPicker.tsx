'use client';

import React, { useState, useCallback } from 'react';

interface ColorPickerProps {
  label?: string;
  value?: string;
  onChange?: (color: string) => void;
  className?: string;
}

export default function ColorPicker({ label, value, onChange, className = '' }: ColorPickerProps) {
  const [internalValue, setInternalValue] = useState(value ?? '#000000');
  const current = value ?? internalValue;
  const inputId = label ? label.toLowerCase().replace(/\s+/g, '-') : 'color-picker';

  const handleChange = useCallback(
    (color: string) => {
      setInternalValue(color);
      onChange?.(color);
    },
    [onChange],
  );

  const handleHexInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      if (/^#[0-9a-fA-F]{0,6}$/.test(val)) {
        handleChange(val);
      }
    },
    [handleChange],
  );

  return (
    <div className={['flex flex-col gap-1 w-full', className].filter(Boolean).join(' ')}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="flex items-center gap-3">
        <input
          type="color"
          id={inputId}
          value={current.length === 7 ? current : '#000000'}
          onChange={(e) => handleChange(e.target.value)}
          className="w-[44px] h-[44px] rounded-md border border-gray-300 cursor-pointer p-0.5"
          aria-label={label ?? 'Color picker'}
        />
        <input
          type="text"
          value={current}
          onChange={handleHexInput}
          placeholder="#000000"
          className="w-28 rounded-md border border-gray-300 px-3 py-2 text-base text-gray-900 min-h-[44px] font-mono focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
          aria-label="Hex color value"
        />
        <div
          className="w-[44px] h-[44px] rounded-md border border-gray-300"
          style={{ backgroundColor: current.length === 7 ? current : '#000000' }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
