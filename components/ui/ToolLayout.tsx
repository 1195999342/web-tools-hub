import React from 'react';
import type { ToolMeta, Locale } from '../../tools/registry';

interface ToolLayoutProps {
  toolMeta: ToolMeta;
  locale: Locale;
  children: React.ReactNode;
  instructions?: React.ReactNode;
}

export default function ToolLayout({ toolMeta, locale, children, instructions }: ToolLayoutProps) {
  const name = toolMeta.name[locale] ?? toolMeta.name['en'];
  const description = toolMeta.description[locale] ?? toolMeta.description['en'];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl" aria-hidden="true">
            {toolMeta.icon}
          </span>
          <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
        </div>
        <p className="text-gray-600">{description}</p>
      </header>

      {/* Tool content */}
      <main className="mb-8">{children}</main>

      {/* Instructions */}
      {instructions && (
        <section className="rounded-lg border border-gray-200 bg-gray-50 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Instructions</h2>
          <div className="text-gray-700 text-sm leading-relaxed">{instructions}</div>
        </section>
      )}
    </div>
  );
}
