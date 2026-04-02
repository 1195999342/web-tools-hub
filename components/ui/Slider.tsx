'use client';

import React, { useState, useCallback } from 'react';

interface SliderProps {
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  onChange?: (value: number) => void;
  showValue?: boolean;
  className?: string;
}

export default function Slider({
  label,
  min = 0,
  max = 100,
  step = 1,
  value,
  onChange,
  showValue = true,
  className = '',
}: SliderProps) {
  const [internalValue, setInternalValue] = useState(value ?? min);
  const current = value ?? internalValue;
  const inputId = label ? label.toLowerCase().replace(/\s+/g, '-') : 'slider';

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = Number(e.target.value);
      setInternalValue(v);
      onChange?.(v);
    },
    [onChange],
  );

  return (
    <div className={['flex flex-col gap-1 w-full', className].filter(Boolean).join(' ')}>
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && (
            <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
              {label}
            </label>
          )}
          {showValue && (
            <span className="text-sm text-gray-500 tabular-nums" aria-live="polite">
              {current}
            </span>
          )}
        </div>
      )}
      <input
        type="range"
        id={inputId}
        min={min}
        max={max}
        step={step}
        value={current}
        onChange={handleChange}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 min-h-[44px]"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={current}
        aria-label={label ?? 'Slider'}
      />
    </div>
  );
}
