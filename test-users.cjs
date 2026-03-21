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

async function testInsert() {
  console.log('--- Testing insert ---');
  // Fake UUID for testing, ideally we would sign up and get a real UUID
  let signUpRes = await supabase.auth.signUp({ email: `test_${Date.now()}@example.com`, password: 'Password123!' });
  const user = signUpRes.data?.user;
  if (!user) {
     console.log('Failed to sign up test user'); return;
  }
  
  let res = await supabase.from('users').upsert(
        {
            id: user.id,
            email: user.email,
            full_name: 'Test User'
        },
        { onConflict: 'id', ignoreDuplicates: true }
  );
  console.log('Insert Error:', res.error);
  console.log('Insert Data:', res.data);
}

testInsert();
