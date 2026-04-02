'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Textarea from '../../components/ui/Textarea';
import DiffViewer from '../../components/ui/DiffViewer';
import type { ToolMeta } from '../../tools/registry';

export default function DiffViewerTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.diff-viewer');
  const [left, setLeft] = useState('');
  const [right, setRight] = useState('');

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Textarea label={t('left_label')} value={left} onChange={(e) => setLeft(e.target.value)} placeholder={t('left_placeholder')} rows={10} />
          <Textarea label={t('right_label')} value={right} onChange={(e) => setRight(e.target.value)} placeholder={t('right_placeholder')} rows={10} />
        </div>
        {(left || right) && (
          <DiffViewer left={left} right={right} leftLabel={t('left_label')} rightLabel={t('right_label')} />
        )}
      </div>
    </ToolLayout>
  );
}
