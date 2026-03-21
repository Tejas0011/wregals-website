const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env', 'utf-8');
const envVars = {};
envFile.split('\n').forEach(line => {
  if(line.includes('=')) {
    const parts = line.split('=');
    envVars[parts[0]] = parts.slice(1).join('=').trim();
  }
});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseKey = envVars.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUsers() {
  console.log('--- Querying public.users ---');
  let res = await supabase.from('users').select('*');
  console.log('Users in public.users:', res.data);
  console.log('Error:', res.error);
}

checkUsers();
