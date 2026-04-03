'use client';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import type { ToolMeta } from '../registry';
import { PHOTO_SIZES } from './logic';

export default function IdPhotoSizesTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.id-photo-sizes');
  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-3 py-2 border border-gray-200 font-medium">Type</th>
              <th className="px-3 py-2 border border-gray-200 font-medium">Size (mm)</th>
              <th className="px-3 py-2 border border-gray-200 font-medium">Pixels (300dpi)</th>
              <th className="px-3 py-2 border border-gray-200 font-medium">Usage</th>
            </tr>
          </thead>
          <tbody>
            {PHOTO_SIZES.map((p, i) => (
              <tr key={i} className="hover:bg-blue-50">
                <td className="px-3 py-2 border border-gray-200 font-medium">{p.name}</td>
                <td className="px-3 py-2 border border-gray-200 font-mono">{p.widthMm}×{p.heightMm}</td>
                <td className="px-3 py-2 border border-gray-200 font-mono">{p.widthPx300}×{p.heightPx300}</td>
                <td className="px-3 py-2 border border-gray-200 text-gray-600">{p.usage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ToolLayout>
  );
}
