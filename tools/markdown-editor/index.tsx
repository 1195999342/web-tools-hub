'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import { markdownToHtml } from './logic';
import type { ToolMeta } from '../../tools/registry';

export default function MarkdownEditorTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.markdown-editor');
  const [input, setInput] = useState('# Hello\n\nThis is **bold** and *italic* text.\n\n- Item 1\n- Item 2\n\n[Link](https://example.com)\n\n`inline code`\n\n```\ncode block\n```');

  const html = markdownToHtml(input);

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[400px]">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">{t('editor_label')}</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-mono text-gray-900 bg-white resize-y min-h-[300px] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            placeholder={t('input_placeholder')}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">{t('preview_label')}</label>
          <div
            className="flex-1 rounded-md border border-gray-200 bg-white p-4 overflow-auto prose prose-sm max-w-none min-h-[300px]"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </ToolLayout>
  );
}
