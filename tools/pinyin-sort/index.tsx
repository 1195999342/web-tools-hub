'use client';
import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Textarea from '../../components/ui/Textarea';
import type { ToolMeta } from '../registry';
import { sortByPinyin } from './logic';

const SAMPLE = '张三\n李四\n王五\n赵六\n孙七\n周八\n吴九\n郑十\n陈一\n刘二';

export default function PinyinSortTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.pinyin-sort');
  const [input, setInput] = useState(SAMPLE);
  const groups = useMemo(() => sortByPinyin(input), [input]);

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Textarea label="Chinese text (one per line)" value={input} onChange={e => setInput(e.target.value)} rows={12} />
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 overflow-auto max-h-[400px]">
          <h3 className="text-sm font-medium text-gray-600 mb-3">Sorted by Pinyin</h3>
          {groups.map(g => (
            <div key={g.letter} className="mb-3">
              <div className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded inline-block mb-1">{g.letter}</div>
              <div className="flex flex-wrap gap-2 ml-2">
                {g.items.map((item, i) => (
                  <span key={i} className="text-sm bg-white px-2 py-1 rounded border border-gray-200">{item}</span>
                ))}
              </div>
            </div>
          ))}
          {groups.length === 0 && <p className="text-gray-400 text-sm">Enter Chinese text to sort</p>}
        </div>
      </div>
    </ToolLayout>
  );
}
