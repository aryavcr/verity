import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase env variables. ' +
    'Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// table name constants
export const TABLES = {
  EVAL_HISTORY: 'eval_history',
  TEMPLATES: 'templates',
  USAGE_COUNTER: 'usage_counter',
} as const