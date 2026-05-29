import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = url && key ? createClient(url, key) : null

const ROW_ID = 'tortiapp'

export async function loadFromSupabase() {
  if (!supabase) return null
  try {
    const { data, error } = await supabase
      .from('app_state')
      .select('data')
      .eq('id', ROW_ID)
      .single()
    if (error || !data) return null
    return data.data
  } catch {
    return null
  }
}

export async function saveToSupabase(state) {
  if (!supabase) return
  try {
    await supabase
      .from('app_state')
      .upsert({ id: ROW_ID, data: state, updated_at: new Date().toISOString() })
  } catch {}
}
