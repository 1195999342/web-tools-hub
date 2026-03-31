import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { ToolCategory } from '@/tools/registry';

interface FooterProps {
  locale: string;
}

const CATEGORIES: ToolCategory[] = ['text', 'json', 'encoding', 'color', 'network', 'math', 'misc'];

export default function Footer({ locale }: FooterProps) {
  const t = useTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Main grid: 3 columns on desktop, 1 column on mobile */}
        <div className="grid grid-cols-3 gap-8 mobile:grid-cols-1">
          {/* Brand column */}
          <div>
            <Link
              href={`/${locale}`}
              className="flex items-center gap-2 font-bold text-xl text-white hover:text-blue-400 transition-colors mb-3"
            >
              <span className="text-2xl">🛠️</span>
              <span>Web Tools Hub</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              {t('footer.copyright', { year })}
            </p>
          </div>

          {/* Category quick links */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
              {t('common.categories')}
            </h3>
            <ul className="space-y-2">
              {CATEGORIES.map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/${locale}/category/${cat}`}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {t(`categories.${cat}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & contact links */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
              {t('common.all_tools')}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`/${locale}/privacy`}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {t('footer.privacy')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/terms`}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {t('footer.terms')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/contact`}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {t('footer.contact')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-500">
          {t('footer.copyright', { year })}
        </div>
      </div>
    </footer>
  );
}
