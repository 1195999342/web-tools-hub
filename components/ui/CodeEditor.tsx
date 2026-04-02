'use client';

import React, { useState, useMemo } from 'react';

interface CodeEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  showLineNumbers?: boolean;
  rows?: number;
  readOnly?: boolean;
  className?: string;
}

export default function CodeEditor({
  value,
  onChange,
  placeholder,
  label,
  showLineNumbers = false,
  rows = 12,
  readOnly = false,
  className = '',
}: CodeEditorProps) {
  const [internalValue, setInternalValue] = useState(value ?? '');
  const current = value ?? internalValue;
  const editorId = label ? label.toLowerCase().replace(/\s+/g, '-') : 'code-editor';

  const lineNumbers = useMemo(() => {
    const count = current.split('\n').length;
    return Array.from({ length: count }, (_, i) => i + 1);
  }, [current]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInternalValue(e.target.value);
    onChange?.(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const newValue = current.substring(0, start) + '  ' + current.substring(end);
      setInternalValue(newValue);
      onChange?.(newValue);
      requestAnimationFrame(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      });
    }
  };

  return (
    <div className={['flex flex-col gap-1 w-full', className].filter(Boolean).join(' ')}>
      {label && (
        <label htmlFor={editorId} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="flex rounded-md border border-gray-300 bg-gray-900 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-1">
        {showLineNumbers && (
          <div
            className="flex flex-col items-end px-3 py-3 bg-gray-800 text-gray-500 text-xs font-mono select-none leading-[1.5rem] min-w-[3rem]"
            aria-hidden="true"
          >
            {lineNumbers.map((n) => (
              <span key={n}>{n}</span>
            ))}
          </div>
        )}
        <textarea
          id={editorId}
          value={current}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={rows}
          readOnly={readOnly}
          spellCheck={false}
          className="flex-1 bg-transparent text-gray-100 font-mono text-sm px-3 py-3 resize-y leading-[1.5rem] focus:outline-none placeholder:text-gray-600 min-h-[120px]"
          aria-label={label ?? 'Code editor'}
        />
      </div>
    </div>
  );
}
