import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY must be defined in the .env file'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Detect if running in Expo Go
export const isExpoGo = Constants.appOwnership === 'expo';

import type { ApprovalResult } from '../types/auth';

/**
 * Validates an invite code and approves the current user.
 */
export async function validateInviteCode(code: string): Promise<ApprovalResult> {
  const { data, error } = await supabase.rpc('validate_and_approve_user', {
    p_code: code,
  });

  if (error) {
    throw error;
  }

  return data as ApprovalResult;
}

