'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Button from './Button';

interface CopyButtonProps {
  text: string;
  className?: string;
}

export default function CopyButton({ text, className }: CopyButtonProps) {
  const t = useTranslations('common');
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API not available or permission denied
    }
  }

  return (
    <Button variant="secondary" size="sm" onClick={handleCopy} className={className}>
      {copied ? t('copied') : t('copy')}
    </Button>
  );
}
