import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Load env
const envFile = fs.readFileSync('/home/hckeer/work/toywebsite/.env.local', 'utf-8');
const env = {};
for (const line of envFile.split('\n')) {
  const t = line.trim();
  if (!t || t.startsWith('#')) continue;
  const idx = t.indexOf('=');
  if (idx < 0) continue;
  env[t.slice(0, idx).trim()] = t.slice(idx + 1).trim().replace(/\\\$/g, '$');
}

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const { data, error } = await supabase.from('orders').select('id').limit(1);
if (error && error.code === '42P01') {
  console.log('orders table does not exist yet.');
  console.log('\nPlease run this SQL in your Supabase Dashboard > SQL Editor:');
  console.log(fs.readFileSync('/home/hckeer/work/toywebsite/orders-migration.sql', 'utf-8'));
} else if (error) {
  console.log('Unexpected error:', error.message, error.code);
} else {
  console.log('orders table already exists and is accessible!');
}
