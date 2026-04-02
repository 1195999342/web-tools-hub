'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Slider from '../../components/ui/Slider';
import Toggle from '../../components/ui/Toggle';
import Button from '../../components/ui/Button';
import CopyButton from '../../components/ui/CopyButton';
import { generateBatch, evaluateStrength, type PasswordOptions, type StrengthLevel } from './logic';
import type { ToolMeta } from '../../tools/registry';

interface Props { locale: string; toolMeta: ToolMeta; }

const STRENGTH_COLORS: Record<StrengthLevel, string> = {
  weak: 'bg-red-500', fair: 'bg-yellow-500', good: 'bg-blue-500', strong: 'bg-green-500',
};

export default function PasswordGeneratorTool({ locale, toolMeta }: Props) {
  const t = useTranslations('tools.password-generator');
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [digits, setDigits] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [count, setCount] = useState(1);
  const [results, setResults] = useState<string[]>([]);

  const options: PasswordOptions = { length, uppercase, lowercase, digits, symbols };

  function handleGenerate() {
    setResults(generateBatch(count, options));
  }

  const strength = results.length > 0 ? evaluateStrength(results[0]) : null;

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Slider label={t('length_label')} min={4} max={128} value={length} onChange={setLength} />
        <div className="flex flex-wrap gap-4">
          <Toggle label={t('uppercase')} checked={uppercase} onChange={setUppercase} />
          <Toggle label={t('lowercase')} checked={lowercase} onChange={setLowercase} />
          <Toggle label={t('digits')} checked={digits} onChange={setDigits} />
          <Toggle label={t('symbols')} checked={symbols} onChange={setSymbols} />
        </div>
        <div className="flex items-end gap-4">
          <div className="w-24">
            <label className="text-sm font-medium text-gray-700">{t('count_label')}</label>
            <input
              type="number" min={1} max={100} value={count}
              onChange={(e) => setCount(Math.max(1, Math.min(100, Number(e.target.value))))}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-base min-h-[44px]"
            />
          </div>
          <Button onClick={handleGenerate}>{t('generate_button')}</Button>
        </div>
        {strength && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">{t('strength')}:</span>
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all ${STRENGTH_COLORS[strength]}`}
                style={{ width: strength === 'weak' ? '25%' : strength === 'fair' ? '50%' : strength === 'good' ? '75%' : '100%' }} />
            </div>
            <span className="text-sm font-medium text-gray-700">{t(`strength_${strength}`)}</span>
          </div>
        )}
        {results.length > 0 && (
          <div className="relative">
            <pre className="rounded-md border border-gray-200 bg-gray-50 p-4 overflow-auto text-sm text-gray-900 whitespace-pre-wrap break-all max-h-96">
              <code>{results.join('\n')}</code>
            </pre>
            <div className="mt-2 flex justify-end">
              <CopyButton text={results.join('\n')} />
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
