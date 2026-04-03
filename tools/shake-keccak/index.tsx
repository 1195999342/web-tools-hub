'use client';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import type { ToolMeta } from '../registry';

export default function ShakeKeccakTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.shake-keccak');
  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="p-8 text-center text-gray-500">
        <p className="text-4xl mb-4">🔑</p>
        <p className="text-lg font-semibold">{t('coming_soon')}</p>
        <p className="text-sm mt-2">{t('requires_library')}</p>
      </div>
    </ToolLayout>
  );
}
