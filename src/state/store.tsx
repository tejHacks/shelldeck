/**
 * Saved commands and recently viewed commands, kept on the device.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { commandById } from '@/data/commands';

const KEY = 'shelldeck:v1';
const MAX_RECENT = 20;

type Persisted = { saved: string[]; recent: string[] };

type Store = Persisted & {
  ready: boolean;
  isSaved: (id: string) => boolean;
  toggleSaved: (id: string) => void;
  addRecent: (id: string) => void;
  clearRecent: () => void;
};

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Persisted>({ saved: [], recent: [] });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => {
        if (!raw) return;
        const p = JSON.parse(raw) as Partial<Persisted>;
        // Drop ids that no longer exist (e.g. after a data update).
        const keep = (ids: unknown) => (Array.isArray(ids) ? ids.filter((id) => typeof id === 'string' && commandById[id]) : []);
        setState({ saved: keep(p.saved), recent: keep(p.recent) });
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (ready) AsyncStorage.setItem(KEY, JSON.stringify(state)).catch(() => {});
  }, [state, ready]);

  const toggleSaved = useCallback((id: string) => {
    setState((s) => ({ ...s, saved: s.saved.includes(id) ? s.saved.filter((x) => x !== id) : [id, ...s.saved] }));
  }, []);

  const addRecent = useCallback((id: string) => {
    setState((s) => (s.recent[0] === id ? s : { ...s, recent: [id, ...s.recent.filter((x) => x !== id)].slice(0, MAX_RECENT) }));
  }, []);

  const clearRecent = useCallback(() => setState((s) => ({ ...s, recent: [] })), []);

  const value = useMemo<Store>(
    () => ({ ...state, ready, isSaved: (id) => state.saved.includes(id), toggleSaved, addRecent, clearRecent }),
    [state, ready, toggleSaved, addRecent, clearRecent],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore(): Store {
  const s = useContext(Ctx);
  if (!s) throw new Error('useStore must be used inside StoreProvider');
  return s;
}
