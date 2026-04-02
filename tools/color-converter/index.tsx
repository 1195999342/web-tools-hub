'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import ColorPicker from '../../components/ui/ColorPicker';
import CopyButton from '../../components/ui/CopyButton';
import { hexToRgb, rgbToHex, rgbToHsl, rgbToHsv, rgbToCmyk, formatRgb, formatHsl, formatHsv, formatCmyk } from './logic';
import type { ToolMeta } from '../../tools/registry';

interface Props { locale: string; toolMeta: ToolMeta; }

export default function ColorConverterTool({ locale, toolMeta }: Props) {
  const t = useTranslations('tools.color-converter');
  const [hex, setHex] = useState('#3b82f6');

  const conversions = useMemo(() => {
    const rgb = hexToRgb(hex);
    if (!rgb) return null;
    return {
      hex: rgbToHex(rgb),
      rgb: formatRgb(rgb),
      hsl: formatHsl(rgbToHsl(rgb)),
      hsv: formatHsv(rgbToHsv(rgb)),
      cmyk: formatCmyk(rgbToCmyk(rgb)),
    };
  }, [hex]);

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <ColorPicker label={t('color_label')} value={hex} onChange={setHex} />
        {conversions && (
          <div className="flex flex-col gap-3">
            {Object.entries(conversions).map(([label, value]) => (
              <div key={label} className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 p-3">
                <div>
                  <span className="text-xs font-semibold text-gray-500 uppercase">{label}</span>
                  <div className="text-sm font-mono text-gray-900">{value}</div>
                </div>
                <CopyButton text={value} />
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
