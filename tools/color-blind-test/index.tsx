'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import type { ToolMeta } from '../registry';
import { PLATES } from './logic';

export default function ColorBlindTestTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.color-blind-test');
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(PLATES.length).fill(''));
  const [showResults, setShowResults] = useState(false);

  const plate = PLATES[current];
  const allDots = [...plate.bgDots, ...plate.fgDots];

  function handleSubmit() {
    if (current < PLATES.length - 1) {
      setCurrent(current + 1);
    } else {
      setShowResults(true);
    }
  }

  function handleReset() {
    setCurrent(0);
    setAnswers(Array(PLATES.length).fill(''));
    setShowResults(false);
  }

  const correct = answers.filter((a, i) => parseInt(a) === PLATES[i].answer).length;

  if (showResults) {
    return (
      <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
        <div className="flex flex-col items-center gap-4 py-8">
          <h2 className="text-2xl font-bold">Results: {correct}/{PLATES.length}</h2>
          <div className="flex flex-col gap-2 w-full max-w-sm">
            {PLATES.map((p, i) => (
              <div key={i} className={`flex justify-between px-4 py-2 rounded ${parseInt(answers[i]) === p.answer ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                <span>Plate {i + 1}</span>
                <span>Your answer: {answers[i] || '—'} (Correct: {p.answer})</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 max-w-md text-center">
            {correct === PLATES.length ? 'Normal color vision detected.' : 'Some plates were incorrect. This is a simplified test — consult an eye care professional for a proper diagnosis.'}
          </p>
          <Button onClick={handleReset}>Try Again</Button>
        </div>
      </ToolLayout>
    );
  }

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col items-center gap-4">
        <p className="text-sm text-gray-500">Plate {current + 1} of {PLATES.length}</p>
        <svg viewBox="0 0 200 200" className="w-64 h-64 rounded-full border-4 border-gray-200" style={{ background: '#f0f0f0' }}>
          {allDots.map((d, i) => (
            <circle key={i} cx={d.cx} cy={d.cy} r={d.r} fill={d.fill} />
          ))}
        </svg>
        <div className="flex items-center gap-3">
          <Input
            label="What number do you see?"
            value={answers[current]}
            onChange={e => { const a = [...answers]; a[current] = e.target.value; setAnswers(a); }}
            placeholder="Enter number"
            className="max-w-[200px]"
          />
        </div>
        <div className="flex gap-2">
          {current > 0 && <Button variant="secondary" onClick={() => setCurrent(current - 1)}>Previous</Button>}
          <Button onClick={handleSubmit}>{current < PLATES.length - 1 ? 'Next' : 'See Results'}</Button>
        </div>
      </div>
    </ToolLayout>
  );
}
