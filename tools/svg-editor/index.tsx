'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import CodeEditor from '../../components/ui/CodeEditor';
import CopyButton from '../../components/ui/CopyButton';
import { defaultSVG, validateSVG } from './logic';
import type { ToolMeta } from '../registry';

export default function SvgEditorTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.svg-editor');
  const [code, setCode] = useState(defaultSVG);
  const isValid = validateSVG(code);

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <CodeEditor label="SVG Code" value={code} onChange={setCode} showLineNumbers rows={16} />
          <div className="flex items-center justify-between">
            {!isValid && <span className="text-sm text-red-600">Invalid SVG</span>}
            <CopyButton text={code} />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-gray-700">Preview</span>
          <div className="border rounded-md bg-white p-4 flex items-center justify-center min-h-[300px]" dangerouslySetInnerHTML={{ __html: isValid ? code : '<p style="color:red">Invalid SVG</p>' }} />
        </div>
      </div>
    </ToolLayout>
  );
}
