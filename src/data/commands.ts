/**
 * Turns the plain-text sheets into a typed, pre-indexed command list.
 * Parsing ~500 commands takes a couple of milliseconds, once, at startup.
 */
import bash from './sheets/bash';
import csh from './sheets/csh';
import fish from './sheets/fish';
import linux1 from './sheets/linux-1';
import linux2 from './sheets/linux-2';
import linux3 from './sheets/linux-3';
import zsh from './sheets/zsh';

export type ShellId = 'linux' | 'bash' | 'zsh' | 'fish' | 'csh';

export type Example = { cmd: string; desc: string };

export type Command = {
  id: string;
  name: string;
  shell: ShellId;
  category: string;
  summary: string;
  syntax: string;
  examples: Example[];
  danger: boolean;
  /** Lower-cased search fields, computed once. */
  index: { name: string; text: string; examples: string };
};

export type ShellInfo = { id: ShellId; label: string; color: string; /** Darker shade for light backgrounds. */ colorOnLight: string; blurb: string };

export const shells: ShellInfo[] = [
  { id: 'linux', colorOnLight: '#B45309', label: 'Linux', color: '#F59E0B', blurb: 'Programs that work in every shell: files, text, processes, network, packages, git and docker.' },
  { id: 'bash', colorOnLight: '#15803D', label: 'Bash', color: '#22C55E', blurb: 'The default shell on most Linux systems. Builtins, syntax, expansions and shortcuts.' },
  { id: 'zsh', colorOnLight: '#0369A1', label: 'Zsh', color: '#38BDF8', blurb: 'The default shell on macOS. Everything bash has, plus powerful globbing and completion.' },
  { id: 'fish', colorOnLight: '#BE185D', label: 'Fish', color: '#F472B6', blurb: 'The friendly interactive shell: autosuggestions out of the box, a cleaner syntax.' },
  { id: 'csh', colorOnLight: '#6D28D9', label: 'Csh/Tcsh', color: '#A78BFA', blurb: 'The C shell family, still found on BSD systems and older Unix machines.' },
];

export const shellById = Object.fromEntries(shells.map((s) => [s.id, s])) as Record<ShellId, ShellInfo>;

const SEP = ' :: ';

export function slug(text: string): string {
  const s = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  // Names made only of symbols ("&", "[[ ]]") get a stable id from their character codes.
  return s || [...text.replace(/\s/g, '')].map((ch) => ch.charCodeAt(0).toString(16)).join('');
}

/** Parse one sheet. Exported for tests. */
export function parseSheet(shell: ShellId, text: string): Command[] {
  const out: Command[] = [];
  let category = '';
  let current: Command | null = null;
  for (const raw of text.split('\n')) {
    const line = raw.replace(/\s+$/, '');
    if (!line.trim()) continue;
    if (line.startsWith('## ')) {
      category = line.slice(3).trim();
      continue;
    }
    if (line.startsWith('  ')) {
      if (!current) throw new Error(`Example before any command: ${line}`);
      const body = line.trim();
      const at = body.lastIndexOf(SEP);
      if (at < 0) throw new Error(`Example needs " :: description": ${body}`);
      current.examples.push({ cmd: body.slice(0, at), desc: body.slice(at + SEP.length) });
      continue;
    }
    const parts = line.split(SEP);
    if (parts.length < 3) throw new Error(`Command needs name :: summary :: syntax: ${line}`);
    if (!category) throw new Error(`Command before any ## category: ${line}`);
    const [name, summary, syntax, flag] = parts;
    current = {
      id: `${shell}-${slug(name)}`,
      name: name.trim(),
      shell,
      category,
      summary: summary.trim(),
      syntax: syntax.trim(),
      examples: [],
      danger: flag?.trim() === '!',
      index: { name: '', text: '', examples: '' },
    };
    out.push(current);
  }
  for (const c of out) {
    c.index = {
      name: c.name.toLowerCase(),
      text: `${c.summary} ${c.syntax} ${c.category} ${shellById[c.shell].label}`.toLowerCase(),
      examples: c.examples.map((e) => `${e.cmd} ${e.desc}`).join('\n').toLowerCase(),
    };
  }
  return out;
}

const clock = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());
const t0 = clock();

export const commands: Command[] = [
  ...parseSheet('linux', linux1),
  ...parseSheet('linux', linux2),
  ...parseSheet('linux', linux3),
  ...parseSheet('bash', bash),
  ...parseSheet('zsh', zsh),
  ...parseSheet('fish', fish),
  ...parseSheet('csh', csh),
];

/** How long it took to parse and index everything at startup. */
export const parseMs = clock() - t0;

export const commandById: Record<string, Command> = Object.fromEntries(commands.map((c) => [c.id, c]));

/** Categories in sheet order, per shell (or all). */
export function categoriesFor(shell: ShellId | 'all'): string[] {
  const seen = new Set<string>();
  for (const c of commands) if (shell === 'all' || c.shell === shell) seen.add(c.category);
  return [...seen];
}

export const totalExamples = commands.reduce((n, c) => n + c.examples.length, 0);
