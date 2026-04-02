'use client';

import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import type { ToolMeta } from '../registry';

export default function ImageToPdfTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.image-to-pdf');
  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col items-center justify-center gap-4 py-12 text-gray-500">
        <span className="text-5xl">📄</span>
        <p className="text-lg font-medium">{t('coming_soon')}</p>
        <p className="text-sm">{t('requires_library')}</p>
      </div>
    </ToolLayout>
  );
}
