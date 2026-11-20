import type { Command, ShellId } from '@/data/commands';

export type Filters = { shell: ShellId | 'all'; category: string | null };

export type SearchResult = { items: Command[]; ms: number };

/** How well one word matches one command (0 = no match). */
function scoreToken(c: Command, t: string): number {
  const { name, text, examples } = c.index;
  if (name === t) return 100;
  if (name.startsWith(t)) return 60;
  if (name.includes(t)) return 40;
  if (text.includes(t)) return 15;
  if (examples.includes(t)) return 6;
  return 0;
}

/**
 * Every word must match somewhere; better matches rank higher.
 * A linear scan over ~500 pre-lowercased commands takes well under a millisecond.
 */
export function search(all: Command[], query: string, filters: Filters, now: () => number = defaultNow): SearchResult {
  const start = now();
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  const pool = all.filter(
    (c) => (filters.shell === 'all' || c.shell === filters.shell) && (!filters.category || c.category === filters.category),
  );
  let items: Command[];
  if (!tokens.length) {
    items = pool;
  } else {
    const scored: { c: Command; s: number }[] = [];
    for (const c of pool) {
      let s = 0;
      for (const t of tokens) {
        const ts = scoreToken(c, t);
        if (!ts) {
          s = 0;
          break;
        }
        s += ts;
      }
      if (s) scored.push({ c, s });
    }
    scored.sort((a, b) => b.s - a.s || a.c.name.localeCompare(b.c.name));
    items = scored.map((x) => x.c);
  }
  return { items, ms: now() - start };
}

function defaultNow() {
  return typeof performance !== 'undefined' ? performance.now() : Date.now();
}
