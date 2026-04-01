export type ToolCategory = 'text' | 'json' | 'encoding' | 'color' | 'network' | 'math' | 'misc';
export type Locale = 'en' | 'zh-cn' | 'zh-tw' | 'ja' | 'ko' | 'es' | 'fr' | 'de' | 'pt' | 'ru';

export interface ToolMeta {
  slug: string;
  icon: string;
  category: ToolCategory;
  enabled: boolean;
  featured?: boolean;
  supportedLocales: Locale[];
  name: Record<Locale, string>;
  description: Record<Locale, string>;
}

export const TOOL_REGISTRY: ToolMeta[] = [
  {
    slug: 'json-formatter',
    icon: '{}',
    category: 'json',
    enabled: true,
    featured: true,
    supportedLocales: ['en', 'zh-cn', 'zh-tw', 'ja', 'ko', 'es', 'fr', 'de', 'pt', 'ru'],
    name: {
      'en': 'JSON Formatter',
      'zh-cn': 'JSON 格式化',
      'zh-tw': 'JSON 格式化',
      'ja': 'JSON フォーマッター',
      'ko': 'JSON 포매터',
      'es': 'Formateador JSON',
      'fr': 'Formateur JSON',
      'de': 'JSON-Formatierer',
      'pt': 'Formatador JSON',
      'ru': 'Форматировщик JSON',
    },
    description: {
      'en': 'Format and validate JSON data with syntax highlighting',
      'zh-cn': '格式化并验证 JSON 数据，支持语法高亮',
      'zh-tw': '格式化並驗證 JSON 資料，支援語法高亮',
      'ja': 'JSONデータをフォーマットして検証し、シンタックスハイライトを表示',
      'ko': '구문 강조와 함께 JSON 데이터를 포맷하고 유효성 검사',
      'es': 'Formatea y valida datos JSON con resaltado de sintaxis',
      'fr': 'Formatez et validez des données JSON avec coloration syntaxique',
      'de': 'JSON-Daten formatieren und validieren mit Syntaxhervorhebung',
      'pt': 'Formate e valide dados JSON com destaque de sintaxe',
      'ru': 'Форматирование и проверка данных JSON с подсветкой синтаксиса',
    },
  },
  {
    slug: 'word-counter',
    icon: 'Aa',
    category: 'text',
    enabled: true,
    featured: true,
    supportedLocales: ['en', 'zh-cn', 'zh-tw', 'ja', 'ko', 'es', 'fr', 'de', 'pt', 'ru'],
    name: {
      'en': 'Word Counter',
      'zh-cn': '字符统计',
      'zh-tw': '字元統計',
      'ja': '文字カウンター',
      'ko': '단어 카운터',
      'es': 'Contador de palabras',
      'fr': 'Compteur de mots',
      'de': 'Wortzähler',
      'pt': 'Contador de palavras',
      'ru': 'Счётчик слов',
    },
    description: {
      'en': 'Count characters, words, and lines in your text',
      'zh-cn': '统计文本中的字符数、单词数和行数',
      'zh-tw': '統計文字中的字元數、單詞數和行數',
      'ja': 'テキストの文字数、単語数、行数をカウント',
      'ko': '텍스트의 문자 수, 단어 수, 줄 수를 계산',
      'es': 'Cuenta caracteres, palabras y líneas en tu texto',
      'fr': 'Comptez les caractères, mots et lignes dans votre texte',
      'de': 'Zeichen, Wörter und Zeilen in Ihrem Text zählen',
      'pt': 'Conte caracteres, palavras e linhas no seu texto',
      'ru': 'Подсчёт символов, слов и строк в тексте',
    },
  },
];

// Query functions

export function getToolBySlug(slug: string): ToolMeta | undefined {
  return TOOL_REGISTRY.find((tool) => tool.slug === slug);
}

export function getEnabledTools(): ToolMeta[] {
  return TOOL_REGISTRY.filter((tool) => tool.enabled);
}

export function getToolsByCategory(category: ToolCategory): ToolMeta[] {
  return TOOL_REGISTRY.filter((tool) => tool.category === category && tool.enabled);
}

export function getFeaturedTools(): ToolMeta[] {
  return TOOL_REGISTRY.filter((tool) => tool.featured === true && tool.enabled);
}

export function getToolPath(slug: string): string {
  return `/tools/${slug}`;
}

export function validateRegistry(tools: ToolMeta[]): void {
  const seen = new Set<string>();
  const duplicates: string[] = [];
  for (const tool of tools) {
    if (seen.has(tool.slug)) {
      duplicates.push(tool.slug);
    } else {
      seen.add(tool.slug);
    }
  }
  if (duplicates.length > 0) {
    throw new Error(`Duplicate slugs found in registry: ${duplicates.join(', ')}`);
  }
}
