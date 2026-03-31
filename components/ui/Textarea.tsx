import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  className?: string;
  rows?: number;
}

export default function Textarea({ label, error, className = '', rows = 5, id, ...rest }: TextareaProps) {
  const textareaId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label htmlFor={textareaId} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        rows={rows}
        className={[
          'w-full rounded-md border px-3 py-2 text-base text-gray-900 min-h-[120px]',
          'placeholder:text-gray-400 bg-white resize-y',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error ? 'border-red-500' : 'border-gray-300',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error && textareaId ? `${textareaId}-error` : undefined}
        {...rest}
      />
      {error && (
        <p id={textareaId ? `${textareaId}-error` : undefined} className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
