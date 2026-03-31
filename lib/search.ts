import Fuse, { IFuseOptions } from 'fuse.js';
import type { ToolMeta, Locale } from '../tools/registry';

export interface SearchResult {
  tool: ToolMeta;
  score: number; // 相关性分数（0-1，越低越相关）
}

export interface SearchEngine {
  search(query: string): SearchResult[];
  rebuild(tools: ToolMeta[]): void;
}

export function createSearchEngine(tools: ToolMeta[], locale: Locale): SearchEngine {
  const fuseOptions: IFuseOptions<ToolMeta> = {
    keys: [
      { name: `name.${locale}`, weight: 0.6 },
      { name: `description.${locale}`, weight: 0.3 },
      { name: 'category', weight: 0.1 },
    ],
    threshold: 0.4,
    includeScore: true,
  };

  let enabledTools = tools.filter((t) => t.enabled);
  let fuse = new Fuse(enabledTools, fuseOptions);

  return {
    search(query: string): SearchResult[] {
      if (!query || query.trim() === '') {
        return enabledTools.map((tool) => ({ tool, score: 0 }));
      }
      return fuse.search(query).map((result) => ({
        tool: result.item,
        score: result.score ?? 0,
      }));
    },

    rebuild(newTools: ToolMeta[]): void {
      enabledTools = newTools.filter((t) => t.enabled);
      fuse = new Fuse(enabledTools, fuseOptions);
    },
  };
}
