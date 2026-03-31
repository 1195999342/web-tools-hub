const LOCALE_STORAGE_KEY = 'preferred-locale';

export function saveLocalePreference(locale: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  }
}

export function getLocalePreference(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(LOCALE_STORAGE_KEY);
  }
  return null;
}
