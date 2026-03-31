import Link from 'next/link';
import type { ToolMeta, Locale } from '@/tools/registry';

interface ToolCardProps {
  tool: ToolMeta;
  locale: string;
  href: string;
}

export default function ToolCard({ tool, locale, href }: ToolCardProps) {
  const loc = locale as Locale;
  const name = tool.name[loc] ?? tool.name['en'];
  const description = tool.description[loc] ?? tool.description['en'];

  return (
    <Link
      href={href}
      className="flex items-start gap-4 p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-blue-300 transition-all group"
    >
      <span className="text-3xl shrink-0" aria-hidden="true">{tool.icon}</span>
      <div className="min-w-0">
        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
          {name}
        </h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{description}</p>
      </div>
    </Link>
  );
}
