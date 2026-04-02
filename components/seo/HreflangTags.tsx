import { type HreflangEntry } from '@/lib/seo';

interface HreflangTagsProps {
  entries: HreflangEntry[];
}

export default function HreflangTags({ entries }: HreflangTagsProps) {
  return (
    <>
      {entries.map((entry) => (
        <link
          key={entry.locale}
          rel="alternate"
          hrefLang={entry.locale}
          href={entry.href}
        />
      ))}
    </>
  );
}
