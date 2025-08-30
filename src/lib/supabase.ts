import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const supabaseUrl = Constants.expoConfig?.extra?.REACT_APP_SUPABASE_URL || '';
const supabaseKey = Constants.expoConfig?.extra?.REACT_APP_SUPABASE_ANON_KEY || '';

if (!supabaseUrl) {
  console.error('Supabase URL is missing. Check app.json extra configuration.');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
  },
});

// Test query
supabase.from('plans').select('*').then(({ data, error }) => {
  if (error) {
    console.error('Test query error:', error);
  } else {
    console.log('Test query result:', data);
  }
});