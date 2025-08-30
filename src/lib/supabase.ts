import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

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