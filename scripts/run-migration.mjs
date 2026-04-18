import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

// Read .env.local
const envLines = fs.readFileSync(path.join(rootDir, '.env.local'), 'utf-8').split('\n');
const env = {};
for (const line of envLines) {
  const t = line.trim();
  if (!t || t.startsWith('#')) continue;
  const idx = t.indexOf('=');
  if (idx === -1) continue;
  const key = t.slice(0, idx).trim();
  const val = t.slice(idx + 1).trim().replace(/\\\$/g, '$');
  env[key] = val;
}

const supabase = createClient(
  env['NEXT_PUBLIC_SUPABASE_URL'],
  env['SUPABASE_SERVICE_ROLE_KEY'],
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const sql = fs.readFileSync(path.join(rootDir, 'orders-migration.sql'), 'utf-8');

// Split SQL into individual statements and run each
const statements = sql
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0 && !s.startsWith('--'));

console.log(`Running ${statements.length} SQL statements...\n`);

for (const stmt of statements) {
  const { error } = await supabase.rpc('exec_sql', { sql: stmt + ';' }).catch(() => ({ error: { message: 'RPC not available' } }));
  
  // Use raw REST if RPC fails
  if (error) {
    // Try direct REST API via fetch
    const res = await fetch(`${env['NEXT_PUBLIC_SUPABASE_URL']}/rest/v1/rpc/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env['SUPABASE_SERVICE_ROLE_KEY']}`,
        'apikey': env['SUPABASE_SERVICE_ROLE_KEY'],
      },
      body: JSON.stringify({ query: stmt + ';' }),
    });
    const body = await res.text();
    console.log(`Statement: ${stmt.slice(0, 60)}...`);
    console.log(`  Status: ${res.status} — ${body.slice(0, 100)}`);
  } else {
    console.log(`✓ ${stmt.slice(0, 60)}...`);
  }
}

console.log('\nDone! Now check your Supabase dashboard for the orders table.');
console.log('If you see errors about missing functions, run orders-migration.sql directly in the Supabase SQL editor.');
