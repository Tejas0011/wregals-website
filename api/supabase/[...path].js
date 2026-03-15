/**
 * Vercel Serverless Function — Supabase Proxy
 *
 * Routes: /api/supabase/*
 * Forwards all requests server-side to the real Supabase URL.
 * This prevents Indian ISPs from blocking direct supabase.co connections
 * since the browser only ever talks to this Vercel domain.
 */

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://elcrnjbftzncbrptqjgk.supabase.co';

export default async function handler(req, res) {
    // Build the target URL: strip /api/supabase prefix, keep the rest
    const path = req.url.replace(/^\/api\/supabase/, '') || '/';
    const targetUrl = `${SUPABASE_URL}${path}`;

    // Forward headers, but fix the Host header
    const headers = { ...req.headers };
    delete headers['host'];
    delete headers['connection'];
    delete headers['transfer-encoding'];

    // Read body for non-GET/HEAD requests
    let body = undefined;
    if (req.method !== 'GET' && req.method !== 'HEAD') {
        body = await new Promise((resolve, reject) => {
            const chunks = [];
            req.on('data', (chunk) => chunks.push(chunk));
            req.on('end', () => resolve(Buffer.concat(chunks)));
            req.on('error', reject);
        });
        if (body.length === 0) body = undefined;
    }

    try {
        const supabaseRes = await fetch(targetUrl, {
            method: req.method,
            headers,
            body,
            // Don't follow redirects — pass them back to the client
            redirect: 'manual',
        });

        // Forward response headers
        supabaseRes.headers.forEach((value, key) => {
            // Skip headers that can't be set manually
            if (['content-encoding', 'transfer-encoding', 'connection'].includes(key.toLowerCase())) return;
            res.setHeader(key, value);
        });

        // Add CORS headers so browser doesn't block the response
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'apikey, authorization, content-type, x-client-info, prefer');

        res.status(supabaseRes.status);

        const responseBody = await supabaseRes.arrayBuffer();
        res.send(Buffer.from(responseBody));
    } catch (err) {
        console.error('Supabase proxy error:', err);
        res.status(502).json({ error: 'Proxy error', detail: err.message });
    }
}

export const config = {
    api: {
        bodyParser: false, // We handle the body manually above
        externalResolver: true,
    },
};
