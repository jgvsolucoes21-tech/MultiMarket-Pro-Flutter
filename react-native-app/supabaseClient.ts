import { createClient } from '@supabase/supabase-js'
import * as SecureStore from 'expo-secure-store'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './constants'

const supabaseUrl = SUPABASE_URL
const supabaseAnonKey = SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: {
      getItem: async (key: string) => {
        try {
          return await SecureStore.getItemAsync(key)
        } catch (e) {
          return null
        }
      },
      setItem: async (key: string, value: string) => {
        try {
          await SecureStore.setItemAsync(key, value)
        } catch (e) {
          console.error('Error saving to secure store:', e)
        }
      },
      removeItem: async (key: string) => {
        try {
          await SecureStore.deleteItemAsync(key)
        } catch (e) {
          console.error('Error removing from secure store:', e)
        }
      }
    },
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
})
