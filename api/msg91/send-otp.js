/**
 * Vercel Serverless Function — MSG91 Send OTP
 *
 * POST /api/msg91/send-otp
 * Body: { "mobile": "919876543210" }   (E.164 without leading +)
 *
 * Calls MSG91 Widget API server-side so the auth key is never exposed.
 */

const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY;
const MSG91_WIDGET_ID = process.env.MSG91_WIDGET_ID;

export default async function handler(req, res) {
    // CORS preflight
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { mobile } = req.body || {};

    if (!mobile || !/^\d{10,15}$/.test(mobile)) {
        return res.status(400).json({ error: 'Invalid mobile number. Provide 10–15 digits without + or spaces.' });
    }

    if (!MSG91_AUTH_KEY || !MSG91_WIDGET_ID) {
        console.error('Missing MSG91_AUTH_KEY or MSG91_WIDGET_ID env vars');
        return res.status(500).json({ error: 'OTP service is not configured.' });
    }

    try {
        const msg91Res = await fetch('https://control.msg91.com/api/v5/widget/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authkey': MSG91_AUTH_KEY,
            },
            body: JSON.stringify({
                mobile,
                widgetId: MSG91_WIDGET_ID,
            }),
        });

        const data = await msg91Res.json();

        if (!msg91Res.ok || data.type === 'error') {
            return res.status(400).json({ error: data.message || 'Failed to send OTP. Please try again.' });
        }

        return res.status(200).json({ success: true, message: 'OTP sent successfully.' });
    } catch (err) {
        console.error('MSG91 send-otp error:', err);
        return res.status(502).json({ error: 'Could not reach OTP service. Please try again.' });
    }
}
