'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import type { ToolMeta } from '../registry';

export default function InverseColorTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.inverse-color');
  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <p className="text-gray-600">{t('description')}</p>
      </div>
    </ToolLayout>
  );
}
