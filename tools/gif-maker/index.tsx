'use client';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import type { ToolMeta } from '../registry';

export default function GifMakerTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.gif-maker');
  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <span className="text-5xl mb-4">🚧</span>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Coming Soon</h2>
        <p className="text-gray-500 max-w-md">Create animated GIFs from multiple images with adjustable frame delay, loop settings, and size optimization. Requires a GIF encoding library.</p>
      </div>
    </ToolLayout>
  );
}
