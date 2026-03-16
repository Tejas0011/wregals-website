/**
 * Vercel Serverless Function — Email Existence Check
 *
 * POST /api/users/check-email
 * Body: { "email": "someone@example.com" }
 * Response: { "exists": true | false }
 *
 * Uses the Supabase service-role key (SUPABASE_SERVICE_KEY) to query
 * auth.users, which is not accessible via the anon key.
 */

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://elcrnjbftzncbrptqjgk.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

export default async function handler(req, res) {
    // Only allow POST
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'content-type');
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    res.setHeader('Access-Control-Allow-Origin', '*');

    if (!SUPABASE_SERVICE_KEY) {
        console.error('SUPABASE_SERVICE_KEY is not set');
        return res.status(500).json({ error: 'Server misconfiguration' });
    }

    let email;
    try {
        // Body may arrive as a Buffer (bodyParser disabled) or already parsed
        if (typeof req.body === 'object' && req.body !== null) {
            email = req.body.email;
        } else {
            const raw = await new Promise((resolve, reject) => {
                const chunks = [];
                req.on('data', (c) => chunks.push(c));
                req.on('end', () => resolve(Buffer.concat(chunks).toString()));
                req.on('error', reject);
            });
            email = JSON.parse(raw).email;
        }
    } catch {
        return res.status(400).json({ error: 'Invalid request body' });
    }

    if (!email || typeof email !== 'string') {
        return res.status(400).json({ error: 'email is required' });
    }

    try {
        // Use the Admin API to list users filtered by email
        const response = await fetch(
            `${SUPABASE_URL}/auth/v1/admin/users?email=${encodeURIComponent(email.toLowerCase().trim())}`,
            {
                method: 'GET',
                headers: {
                    'apikey': SUPABASE_SERVICE_KEY,
                    'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) {
            const text = await response.text();
            console.error('Supabase admin API error:', text);
            return res.status(502).json({ error: 'Failed to check email' });
        }

        const data = await response.json();
        // data.users is an array; filter for exact email match
        const users = (data.users || []).filter(
            (u) => u.email && u.email.toLowerCase() === email.toLowerCase().trim()
        );

        return res.status(200).json({ exists: users.length > 0 });
    } catch (err) {
        console.error('check-email error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const config = {
    api: {
        bodyParser: false,
    },
};
