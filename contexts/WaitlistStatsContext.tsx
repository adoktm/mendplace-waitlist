import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { fetchWaitlistStats } from '@/lib/supabase';
import { C } from '@/constants/theme';

const AVATAR_COLORS = [C.indigo700, C.terra500, C.sage, '#D4A03E'];

export interface AvatarData { initials: string; bg: string }

interface WaitlistStatsCtx {
  count:        number | null;
  displayCount: string | null;
  avatars:      AvatarData[];
  optimisticAdd: (initials: string) => void;
}

const Ctx = createContext<WaitlistStatsCtx>({
  count: null, displayCount: null, avatars: [], optimisticAdd: () => {},
});

export function WaitlistStatsProvider({ children }: { children: React.ReactNode }) {
  const [count,   setCount]   = useState<number | null>(null);
  const [avatars, setAvatars] = useState<AvatarData[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadStats = useCallback(() => {
    fetchWaitlistStats().then(({ count, lastFour }) => {
      setCount(count);
      setAvatars(lastFour.slice(0, 4).map((initials, i) => ({
        initials,
        bg: AVATAR_COLORS[i % AVATAR_COLORS.length],
      })));
    });
  }, []);

  useEffect(() => {
    loadStats();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [loadStats]);

  // Schedule a real DB refresh — debounced 30s so bursts of submissions
  // all get consolidated into a single fetch.
  const scheduleRefresh = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(loadStats, 30_000);
  }, [loadStats]);

  // Called right after a successful submission: update UI instantly,
  // then reconcile with real DB data after 30s.
  const optimisticAdd = useCallback((initials: string) => {
    setCount(c => (c ?? 0) + 1);
    setAvatars(prev => {
      const next = [{ initials, bg: '' }, ...prev].slice(0, 4);
      return next.map((a, i) => ({ ...a, bg: AVATAR_COLORS[i % AVATAR_COLORS.length] }));
    });
    scheduleRefresh();
  }, [scheduleRefresh]);

  const displayCount = count === null ? null : count.toLocaleString('fr-FR');

  return (
    <Ctx.Provider value={{ count, displayCount, avatars, optimisticAdd }}>
      {children}
    </Ctx.Provider>
  );
}

export const useWaitlistStats = () => useContext(Ctx);
