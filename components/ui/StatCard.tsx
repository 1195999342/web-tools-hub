import React from 'react';

interface StatCardProps {
  value: string | number;
  label: string;
  className?: string;
}

export default function StatCard({ value, label, className = '' }: StatCardProps) {
  return (
    <div
      className={[
        'rounded-lg border border-gray-200 bg-gray-50 p-4 text-center',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
    </div>
  );
}
