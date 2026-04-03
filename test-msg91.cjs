const https = require('https');

const MSG91_AUTH_KEY = "504546AXmJfwQZOBKZ69ca7a10P1";
const MSG91_WIDGET_ID = "3663446c3769343230303532";
const mobile = "919000000000";

const data = JSON.stringify({
    mobile,
    widgetId: MSG91_WIDGET_ID,
});

const options = {
    hostname: 'api.msg91.com',
    port: 443,
    path: '/api/v5/widget/send',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'authkey': MSG91_AUTH_KEY,
        'Content-Length': data.length
    }
};

const req = https.request(options, (res) => {
    let responseData = '';
    console.log('statusCode:', res.statusCode);
    res.on('data', (d) => { responseData += d; });
    res.on('end', () => { console.log('Response:', responseData); });
});

req.on('error', (e) => {
    console.error('HTTPS Error:', e);
});

req.write(data);
req.end();
