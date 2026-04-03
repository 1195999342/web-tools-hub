'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Textarea from '../../components/ui/Textarea';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { checkAccess } from './logic';
import type { ToolMeta } from '../registry';

export default function RobotsCheckerTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.robots-checker');
  const [robotsTxt, setRobotsTxt] = useState('User-agent: *\nDisallow: /admin/\nAllow: /');
  const [url, setUrl] = useState('/admin/secret');
  const [ua, setUa] = useState('*');
  const [result, setResult] = useState<{ allowed: boolean; reason: string } | null>(null);

  function handleCheck() { setResult(checkAccess(robotsTxt, url, ua)); }

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Textarea label="robots.txt content" value={robotsTxt} onChange={e => setRobotsTxt(e.target.value)} rows={8} />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Test URL" value={url} onChange={e => setUrl(e.target.value)} placeholder="/path/to/page" />
          <Input label="User-Agent" value={ua} onChange={e => setUa(e.target.value)} placeholder="*" />
        </div>
        <Button onClick={handleCheck}>Check Access</Button>
        {result && (
          <div className={`rounded-md p-4 text-sm font-medium ${result.allowed ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
            <p className="text-lg">{result.allowed ? '✅ Allowed' : '🚫 Blocked'}</p>
            <p className="mt-1">{result.reason}</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
