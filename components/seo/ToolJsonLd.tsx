import { type WebApplicationJsonLd } from '@/lib/seo';

interface ToolJsonLdProps {
  jsonLd: WebApplicationJsonLd;
}

export default function ToolJsonLd({ jsonLd }: ToolJsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
