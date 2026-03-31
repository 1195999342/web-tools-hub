'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import type { ToolCategory, Locale } from '@/tools/registry';
import { getEnabledTools } from '@/tools/registry';
import { createSearchEngine } from '@/lib/search';
import type { SearchResult } from '@/lib/search';
import { saveLocalePreference } from '@/lib/useLocalePreference';

interface NavbarProps {
  currentLocale: string;
  currentPath: string;
}

const CATEGORIES: ToolCategory[] = ['text', 'json', 'encoding', 'color', 'network', 'math', 'misc'];

const LOCALES: { code: Locale; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'zh-CN', label: '简体中文' },
  { code: 'zh-TW', label: '繁體中文' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'pt', label: 'Português' },
  { code: 'ru', label: 'Русский' },
];

export default function Navbar({ currentLocale, currentPath }: NavbarProps) {
  const t = useTranslations();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  // Search state
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);

  const effectivePath = currentPath || pathname;

  // Initialize search engine once
  const searchEngineRef = useRef(
    createSearchEngine(getEnabledTools(), currentLocale as Locale)
  );

  // Debounced search
  const handleSearchInput = useCallback((query: string) => {
    setSearchQuery(query);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      if (query.trim() === '') {
        setSearchResults([]);
        setShowDropdown(false);
        setHasSearched(false);
      } else {
        const results = searchEngineRef.current.search(query);
        setSearchResults(results);
        setShowDropdown(true);
        setHasSearched(true);
      }
    }, 300);
  }, []);

  // Close dropdown on outside click or Escape
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
        setSearchExpanded(false);
        setSearchQuery('');
        setHasSearched(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setShowDropdown(false);
        setSearchExpanded(false);
        setSearchQuery('');
        setHasSearched(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Focus input when expanded
  useEffect(() => {
    if (searchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchExpanded]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  function handleResultClick(slug: string) {
    setShowDropdown(false);
    setSearchExpanded(false);
    setSearchQuery('');
    setHasSearched(false);
    router.push(`/${currentLocale}/tools/${slug}`);
  }

  function isCategoryActive(category: ToolCategory): boolean {
    return effectivePath.includes(`/category/${category}`);
  }

  function isHomeActive(): boolean {
    const segments = effectivePath.split('/').filter(Boolean);
    return segments.length <= 1;
  }

  function handleLocaleChange(newLocale: Locale) {
    setLangDropdownOpen(false);
    saveLocalePreference(newLocale);
    const segments = effectivePath.split('/').filter(Boolean);
    if (segments.length > 0) {
      segments[0] = newLocale;
    }
    const newPath = '/' + segments.join('/');
    router.push(newPath);
  }

  const currentLocaleLabel = LOCALES.find((l) => l.code === currentLocale)?.label ?? currentLocale;

  function handleTouchStart(e: React.TouchEvent) {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    const deltaY = touchStartY.current - e.changedTouches[0].clientY;
    const deltaX = touchStartX.current - e.changedTouches[0].clientX;
    // Swipe up or left to close
    if (deltaY > 50 || deltaX > 50) {
      setMobileMenuOpen(false);
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          href={`/${currentLocale}`}
          className="flex items-center gap-2 font-bold text-xl text-blue-600 hover:text-blue-700 transition-colors shrink-0"
          aria-label={t('navbar.home')}
        >
          <span className="text-2xl">🛠️</span>
          <span className="mobile:hidden">Web Tools Hub</span>
        </Link>

        {/* Desktop category nav */}
        <ul className="flex items-center gap-1 mobile:hidden" role="navigation" aria-label="Category navigation">
          {CATEGORIES.map((cat) => (
            <li key={cat}>
              <Link
                href={`/${currentLocale}/category/${cat}`}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isCategoryActive(cat)
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                aria-current={isCategoryActive(cat) ? 'page' : undefined}
              >
                {t(`categories.${cat}`)}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side: search + language switcher + hamburger */}
        <div className="flex items-center gap-2">
          {/* Desktop Search */}
          <div ref={searchContainerRef} className="relative mobile:hidden">
            <div className={`flex items-center transition-all duration-200 ${searchExpanded ? 'w-64' : 'w-11'}`}>
              {searchExpanded ? (
                <input
                  ref={searchInputRef}
                  type="search"
                  value={searchQuery}
                  onChange={(e) => handleSearchInput(e.target.value)}
                  placeholder={t('common.search_placeholder')}
                  className="w-full h-11 pl-10 pr-3 rounded-md border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  aria-label={t('navbar.search')}
                  aria-expanded={showDropdown}
                  aria-haspopup="listbox"
                  role="combobox"
                  aria-autocomplete="list"
                />
              ) : null}
              <button
                type="button"
                onClick={() => setSearchExpanded((v) => !v)}
                className={`flex items-center justify-center w-11 h-11 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors ${searchExpanded ? 'absolute left-0' : ''}`}
                aria-label={t('navbar.search')}
                title={t('navbar.search')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
              </button>
            </div>

            {/* Desktop results dropdown */}
            {showDropdown && searchExpanded && (
              <ul
                role="listbox"
                aria-label="Search results"
                className="absolute right-0 top-full mt-1 z-30 bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-72 max-h-80 overflow-y-auto"
              >
                {searchResults.length === 0 ? (
                  <li className="px-4 py-3 text-sm text-gray-500">{t('common.no_results')}</li>
                ) : (
                  searchResults.map(({ tool }) => (
                    <li key={tool.slug} role="option" aria-selected={false}>
                      <button
                        type="button"
                        onClick={() => handleResultClick(tool.slug)}
                        className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-lg shrink-0 w-8 text-center">{tool.icon}</span>
                        <span className="flex flex-col min-w-0">
                          <span className="text-sm font-medium text-gray-900 truncate">
                            {tool.name[currentLocale as Locale] ?? tool.name['en']}
                          </span>
                          <span className="text-xs text-gray-500 truncate">
                            {tool.description[currentLocale as Locale] ?? tool.description['en']}
                          </span>
                        </span>
                      </button>
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>

          {/* Language switcher */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setLangDropdownOpen((v) => !v)}
              className="flex items-center gap-1 px-3 h-11 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              aria-haspopup="listbox"
              aria-expanded={langDropdownOpen}
              aria-label="Select language"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zm0 0c-2.5 0-4.5-4-4.5-9s2-9 4.5-9 4.5 4 4.5 9-2 9-4.5 9zM3.6 9h16.8M3.6 15h16.8" />
              </svg>
              <span className="mobile:hidden">{currentLocaleLabel}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 mobile:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {langDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setLangDropdownOpen(false)}
                  aria-hidden="true"
                />
                <ul
                  role="listbox"
                  aria-label="Language options"
                  className="absolute right-0 top-full mt-1 z-20 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[160px]"
                >
                  {LOCALES.map(({ code, label }) => (
                    <li key={code} role="option" aria-selected={code === currentLocale}>
                      <button
                        type="button"
                        onClick={() => handleLocaleChange(code)}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                          code === currentLocale
                            ? 'bg-blue-50 text-blue-700 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {label}
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          {/* Hamburger button (mobile only) */}
          <button
            type="button"
            className="hidden mobile:flex items-center justify-center w-11 h-11 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile drawer menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          className="hidden mobile:block border-t border-gray-200 bg-white"
          role="navigation"
          aria-label="Mobile category navigation"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Mobile search */}
          <MobileSearch
            currentLocale={currentLocale}
            onNavigate={() => setMobileMenuOpen(false)}
            t={t}
          />

          {/* Home link */}
          <Link
            href={`/${currentLocale}`}
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center px-4 py-3 text-sm font-medium transition-colors min-h-[44px] ${
              isHomeActive()
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
            aria-current={isHomeActive() ? 'page' : undefined}
          >
            {t('navbar.home')}
          </Link>

          {/* Category links */}
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/${currentLocale}/category/${cat}`}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center px-4 py-3 text-sm font-medium transition-colors min-h-[44px] ${
                isCategoryActive(cat)
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
              aria-current={isCategoryActive(cat) ? 'page' : undefined}
            >
              {t(`categories.${cat}`)}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}

// Mobile search sub-component (avoids hook-in-conditional issues)
function MobileSearch({
  currentLocale,
  onNavigate,
  t,
}: {
  currentLocale: string;
  onNavigate: () => void;
  t: ReturnType<typeof useTranslations>;
}) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const engineRef = useRef(
    createSearchEngine(getEnabledTools(), currentLocale as Locale)
  );

  function handleInput(value: string) {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (value.trim() === '') {
        setResults([]);
        setHasSearched(false);
      } else {
        setResults(engineRef.current.search(value));
        setHasSearched(true);
      }
    }, 300);
  }

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  function handleResultClick(slug: string) {
    onNavigate();
    router.push(`/${currentLocale}/tools/${slug}`);
  }

  return (
    <div className="px-4 py-3 border-b border-gray-100">
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
        </span>
        <input
          type="search"
          value={query}
          onChange={(e) => handleInput(e.target.value)}
          placeholder={t('common.search_placeholder')}
          className="w-full h-11 pl-9 pr-3 rounded-md border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-label={t('navbar.search')}
        />
      </div>
      {hasSearched && (
        <ul className="mt-2 rounded-md border border-gray-200 bg-white overflow-hidden max-h-60 overflow-y-auto">
          {results.length === 0 ? (
            <li className="px-4 py-3 text-sm text-gray-500">{t('common.no_results')}</li>
          ) : (
            results.map(({ tool }) => (
              <li key={tool.slug}>
                <button
                  type="button"
                  onClick={() => handleResultClick(tool.slug)}
                  className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors min-h-[44px]"
                >
                  <span className="text-lg shrink-0 w-8 text-center">{tool.icon}</span>
                  <span className="flex flex-col min-w-0">
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {tool.name[currentLocale as Locale] ?? tool.name['en']}
                    </span>
                    <span className="text-xs text-gray-500 truncate">
                      {tool.description[currentLocale as Locale] ?? tool.description['en']}
                    </span>
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
