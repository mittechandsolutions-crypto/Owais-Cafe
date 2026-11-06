import { menuItems } from './data'

export const OWNER_EMAIL = 'mittechandsolutions@gmail.com'
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)
let clientPromise

export async function getSupabaseClient() {
  if (!isSupabaseConfigured) throw new Error('The secure Supabase backend is not configured.')
  if (!clientPromise) {
    clientPromise = import('@supabase/supabase-js').then(({ createClient }) => createClient(supabaseUrl, supabaseAnonKey))
  }
  return clientPromise
}

export async function fetchMenuItems() {
  if (!isSupabaseConfigured) return { data: menuItems, error: null }

  const client = await getSupabaseClient()
  const { data, error } = await client
    .from('menu_items')
    .select('id,category,name,description,price,image,alt,is_available,sort_order')
    .eq('is_available', true)
    .order('sort_order')

  return { data, error }
}
