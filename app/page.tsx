'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // Detect browser language
    const browserLang = navigator.language.toLowerCase();
    const supportedLocales = ['en', 'zh-cn', 'zh-tw', 'ja', 'ko', 'es', 'fr', 'de', 'pt', 'ru'];
    
    let targetLocale = 'en';
    if (supportedLocales.includes(browserLang)) {
      targetLocale = browserLang;
    } else {
      const langPrefix = browserLang.split('-')[0];
      const match = supportedLocales.find(l => l.startsWith(langPrefix));
      if (match) targetLocale = match;
    }

    router.replace(`/${targetLocale}`);
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-500">Redirecting...</p>
    </div>
  );
}
