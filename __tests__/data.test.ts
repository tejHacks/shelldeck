import { categoriesFor, commandById, commands, parseSheet, shells, totalExamples } from '@/data/commands';
import { compareRows } from '@/data/compare';
import { search } from '@/lib/search';

describe('command data', () => {
  it('has between 400 and 520 commands', () => {
    expect(commands.length).toBeGreaterThanOrEqual(400);
    expect(commands.length).toBeLessThanOrEqual(520);
  });

  it('gives every command a unique id', () => {
    const ids = commands.map((c) => c.id);
    const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
    expect(dupes).toEqual([]);
    expect(Object.keys(commandById)).toHaveLength(commands.length);
  });

  it('fills in every field and at least one example', () => {
    for (const c of commands) {
      expect({ id: c.id, ok: !!(c.name && c.summary && c.syntax && c.category) }).toEqual({ id: c.id, ok: true });
      expect({ id: c.id, examples: c.examples.length > 0 }).toEqual({ id: c.id, examples: true });
      for (const e of c.examples) expect({ id: c.id, ok: !!(e.cmd && e.desc) }).toEqual({ id: c.id, ok: true });
    }
    expect(totalExamples).toBeGreaterThan(commands.length);
  });

  it('covers every shell with several categories', () => {
    for (const s of shells) {
      const n = commands.filter((c) => c.shell === s.id).length;
      expect({ shell: s.id, enough: n >= 30 }).toEqual({ shell: s.id, enough: true });
      expect(categoriesFor(s.id).length).toBeGreaterThanOrEqual(3);
    }
  });

  it('never leaves template placeholders or the separator in the text', () => {
    for (const c of commands) {
      for (const t of [c.name, c.summary, c.syntax, ...c.examples.flatMap((e) => [e.cmd, e.desc])]) {
        expect({ id: c.id, t, bad: t.includes(' :: ') || t.includes('undefined') }).toEqual({ id: c.id, t, bad: false });
      }
    }
  });

  it('rejects malformed sheets with a clear error', () => {
    expect(() => parseSheet('bash', 'ls :: no category :: ls')).toThrow(/category/);
    expect(() => parseSheet('bash', '## X\nls :: only two')).toThrow(/name :: summary :: syntax/);
    expect(() => parseSheet('bash', '## X\n  orphan :: example')).toThrow(/before any command/);
  });

  it('has a full comparison table', () => {
    expect(compareRows.length).toBeGreaterThanOrEqual(30);
    for (const r of compareRows) for (const v of [r.bash, r.zsh, r.fish, r.csh]) expect(v.length).toBeGreaterThan(0);
  });
});

describe('search', () => {
  const all = { shell: 'all' as const, category: null };

  it('ranks an exact name match first', () => {
    expect(search(commands, 'tar', all).items[0].name).toBe('tar');
    expect(search(commands, 'grep', all).items[0].name).toBe('grep');
  });

  it('requires every word to match', () => {
    const r = search(commands, 'compress folder', all).items;
    expect(r.length).toBeGreaterThan(0);
    expect(search(commands, 'zzqqxx', all).items).toEqual([]);
  });

  it('finds commands by what they do, not just by name', () => {
    const names = search(commands, 'disk space', all).items.map((c) => c.name);
    expect(names).toEqual(expect.arrayContaining(['df']));
    expect(search(commands, 'port', all).items.map((c) => c.name)).toEqual(expect.arrayContaining(['lsof', 'ss']));
  });

  it('filters by shell and category', () => {
    const fish = search(commands, '', { shell: 'fish', category: null }).items;
    expect(fish.every((c) => c.shell === 'fish')).toBe(true);
    const net = search(commands, '', { shell: 'linux', category: 'Networking' }).items;
    expect(net.length).toBeGreaterThan(20);
    expect(net.every((c) => c.category === 'Networking')).toBe(true);
  });

  it('is fast: 200 searches over every command take well under a second', () => {
    const queries = ['a', 'ls', 'file', 'git push', 'net', 'loop', 'zzz', 'variable export', 'compress', 'proc'];
    const t0 = performance.now();
    for (let i = 0; i < 20; i++) for (const q of queries) search(commands, q, all);
    const perSearch = (performance.now() - t0) / 200;
    expect(perSearch).toBeLessThan(5);
  });
});
