'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import CopyButton from '../../components/ui/CopyButton';
import { randomIPv4, calculateCIDR } from './logic';
import type { ToolMeta } from '../registry';

export default function IpToolsTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.ip-tools');
  const [ip, setIp] = useState('');
  const [cidr, setCidr] = useState('192.168.1.0/24');
  const [subnetResult, setSubnetResult] = useState<any>(null);
  const [subnetError, setSubnetError] = useState('');

  function handleGenerate() { setIp(randomIPv4()); }
  function handleCalc() {
    setSubnetError('');
    const r = calculateCIDR(cidr);
    if (typeof r === 'string') { setSubnetError(r); setSubnetResult(null); }
    else setSubnetResult(r);
  }

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-6">
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold">Random IPv4 Generator</h2>
          <div className="flex items-center gap-3">
            <Button onClick={handleGenerate}>Generate</Button>
            {ip && <span className="font-mono text-lg">{ip}</span>}
            {ip && <CopyButton text={ip} />}
          </div>
        </section>
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold">CIDR Subnet Calculator</h2>
          <div className="flex items-end gap-3">
            <Input label="CIDR Notation" value={cidr} onChange={e => setCidr(e.target.value)} placeholder="192.168.1.0/24" />
            <Button onClick={handleCalc}>Calculate</Button>
          </div>
          {subnetError && <p className="text-sm text-red-600">{subnetError}</p>}
          {subnetResult && (
            <div className="grid grid-cols-2 gap-2 text-sm border rounded-md p-4 bg-gray-50">
              {Object.entries(subnetResult).map(([k, v]) => (
                <div key={k}><span className="font-medium text-gray-700">{k}: </span><span className="font-mono">{String(v)}</span></div>
              ))}
            </div>
          )}
        </section>
      </div>
    </ToolLayout>
  );
}
