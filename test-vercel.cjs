async function testVercel(domain) {
    console.log(`Testing ${domain}...`);
    try {
        const res = await fetch(`https://${domain}/api/msg91/send-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mobile: '919000000000' })
        });
        const data = await res.json().catch(() => null);
        console.log(`[${domain}] Status: ${res.status}`, data);
    } catch (e) {
        console.error(`[${domain}] Error:`, e.message);
    }
}

async function run() {
    await testVercel('wregals-website.vercel.app');
    await testVercel('wregals.vercel.app');
    await testVercel('wregals-git-main-tejas0011s-projects.vercel.app'); // common pattern
}
run();
