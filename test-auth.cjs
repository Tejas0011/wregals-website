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

async function testRPC() {
  console.log('--- Calling check_email_exists ---');
  let rpc = await supabase.rpc('check_email_exists', { p_email: 'test@example.com' });
  console.log('Data:', rpc.data);
  console.log('Error:', rpc.error);
}

testRPC();
