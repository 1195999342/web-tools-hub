import { type OpenGraphMeta as OGMeta, type TwitterCardMeta } from '@/lib/seo';

interface OpenGraphMetaProps {
  og: OGMeta;
  twitter: TwitterCardMeta;
}

export default function OpenGraphMeta({ og, twitter }: OpenGraphMetaProps) {
  return (
    <>
      {Object.entries(og).map(([property, content]) => (
        <meta key={property} property={property} content={content} />
      ))}
      {Object.entries(twitter).map(([name, content]) => (
        <meta key={name} name={name} content={content} />
      ))}
    </>
  );
}
