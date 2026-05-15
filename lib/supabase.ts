import { createClient } from '@supabase/supabase-js';

const supabaseUrl     = process.env.EXPO_PUBLIC_SUPABASE_URL     ?? '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

if (__DEV__ && (!supabaseUrl || supabaseUrl.startsWith('REMPLACE') || !supabaseAnonKey || supabaseAnonKey.startsWith('REMPLACE'))) {
  console.warn('[Supabase] ⚠️  Clés manquantes — ouvre .env.local et remplace EXPO_PUBLIC_SUPABASE_URL et EXPO_PUBLIC_SUPABASE_ANON_KEY.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/* ─── Types ─── */

export type WaitlistMode = 'client' | 'pro';

export interface WaitlistRow {
  mode:       WaitlistMode;
  first_name: string;
  last_name:  string;
  email:      string;
  q1:         string | null;
  q2:         string | null;
  q3:         string | null;
  q4:         string | null;
  message:    string | null;
}

/* ─────────────────────────────────────────────────────────────────────────
 *  SQL À EXÉCUTER UNE FOIS dans Supabase → SQL Editor
 * ─────────────────────────────────────────────────────────────────────────
 *
 *  CREATE TABLE waitlist (
 *    id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
 *    created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL,
 *    mode        TEXT        NOT NULL CHECK (mode IN ('client', 'pro')),
 *    first_name  TEXT        NOT NULL,
 *    last_name   TEXT        NOT NULL,
 *    email       TEXT        NOT NULL,
 *    q1          TEXT,
 *    q2          TEXT,
 *    q3          TEXT,
 *    q4          TEXT,
 *    message     TEXT
 *  );
 *
 *  ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
 *
 *  CREATE POLICY "allow_insert" ON waitlist
 *    FOR INSERT TO anon WITH CHECK (true);
 *
 *  -- Empêche un même email de s'inscrire deux fois pour le même mode
 *  ALTER TABLE waitlist ADD CONSTRAINT waitlist_email_mode_unique UNIQUE (email, mode);
 *
 *  -- Fonction publique : retourne uniquement le total et les initiales (pas de données sensibles)
 *  CREATE OR REPLACE FUNCTION get_waitlist_stats()
 *  RETURNS json
 *  LANGUAGE sql
 *  SECURITY DEFINER
 *  AS $$
 *    SELECT json_build_object(
 *      'count', (SELECT COUNT(*) FROM waitlist),
 *      'last_four', (
 *        SELECT COALESCE(json_agg(initials), '[]'::json)
 *        FROM (
 *          SELECT UPPER(LEFT(first_name, 1)) || UPPER(LEFT(last_name, 1)) AS initials
 *          FROM waitlist
 *          ORDER BY created_at DESC
 *          LIMIT 4
 *        ) t
 *      )
 *    );
 *  $$;
 *
 *  GRANT EXECUTE ON FUNCTION get_waitlist_stats() TO anon;
 *
 * ───────────────────────────────────────────────────────────────────────── */

export type SubmitResult = 'ok' | 'duplicate' | 'error';

export async function submitWaitlist(row: WaitlistRow): Promise<SubmitResult> {
  if (!supabaseUrl || supabaseUrl.startsWith('REMPLACE')) return 'ok';
  const { error } = await supabase.from('waitlist').insert(row);
  if (!error) return 'ok';
  if (error.code === '23505') return 'duplicate'; // UNIQUE violation
  console.error('[Supabase] Erreur insertion :', error.message);
  return 'error';
}

export async function fetchWaitlistStats(): Promise<{ count: number; lastFour: string[] }> {
  try {
    const { data, error } = await supabase.rpc('get_waitlist_stats');
    if (error || !data) return { count: 0, lastFour: [] };
    return { count: Number(data.count) || 0, lastFour: (data.last_four as string[]) ?? [] };
  } catch {
    return { count: 0, lastFour: [] };
  }
}
