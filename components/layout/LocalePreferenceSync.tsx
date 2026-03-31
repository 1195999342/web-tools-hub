'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getLocalePreference } from '@/lib/useLocalePreference';
import { locales } from '@/i18n';
import type { Locale } from '@/i18n';

interface LocalePreferenceSyncProps {
  currentLocale: string;
}

/**
 * On first render, checks localStorage for a saved locale preference.
 * If it differs from the current locale, redirects to the preferred locale.
 * This runs only once per page load (not on every navigation).
 */
export default function LocalePreferenceSync({ currentLocale }: LocalePreferenceSyncProps) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const preferred = getLocalePreference();
    if (preferred && preferred !== currentLocale && locales.includes(preferred as Locale)) {
      const segments = pathname.split('/').filter(Boolean);
      if (segments.length > 0) {
        segments[0] = preferred;
      }
      router.replace('/' + segments.join('/'));
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
