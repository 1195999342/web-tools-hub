'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import { CATEGORIES } from './logic';
import type { ToolMeta } from '../registry';

export default function EmojiPickerTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.emoji-picker');
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].name);
  const [copied, setCopied] = useState('');

  async function handleCopy(emoji: string) {
    try {
      await navigator.clipboard.writeText(emoji);
      setCopied(emoji);
      setTimeout(() => setCopied(''), 1500);
    } catch {}
  }

  const current = CATEGORIES.find(c => c.name === activeCategory) || CATEGORIES[0];

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button key={cat.name} onClick={() => setActiveCategory(cat.name)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${activeCategory === cat.name ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              {cat.name}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-8 sm:grid-cols-12 gap-1">
          {current.emojis.map((emoji, i) => (
            <button key={i} onClick={() => handleCopy(emoji)} title={`Copy ${emoji}`}
              className={`text-2xl p-2 rounded hover:bg-gray-100 transition-colors ${copied === emoji ? 'bg-green-100' : ''}`}>
              {emoji}
            </button>
          ))}
        </div>
        {copied && <p className="text-sm text-green-600 text-center">Copied: {copied}</p>}
      </div>
    </ToolLayout>
  );
}
