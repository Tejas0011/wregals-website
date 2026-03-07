// @ts-nocheck
import { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Link } from 'react-router-dom';
import IIcon from './IIcon';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

function buildSystemPrompt(user: any): string {
    const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || null;
    const userEmail = user?.email || null;
    const isLoggedIn = !!user;

    return `You are WREN, the official AI concierge for WREGALS — a premium, invite-only luxury auction house specialising in rare watches, fine jewellery, and collectibles. You speak with quiet confidence, warmth, and sophistication. You are brief but insightful.

PLATFORM KNOWLEDGE:
- WREGALS is a curated auction platform. All items are authenticated and verified before listing.
- Pages: Home (/), Live Auctions (/auctions/live), Upcoming Auctions (/auctions/upcoming), Auction Results (/auctions/results), How It Works (/how-it-works), Gallery (/gallery), Social (/social), About (/about), Careers (/careers), Press (/press), Contact (/contact).
- HOW IT WORKS: Users register → complete KYC verification → get approved → browse and place bids → winner is notified → secure payment → item is shipped.
- BIDDING: Users must have a verified wallet with sufficient balance. Bids are binding. Outbid users are notified in real time.
- WALLET: Allows pre-loading funds for seamless bidding. All transactions are secured.
- SOCIAL PAGE: A broadcast channel where verified creators and sellers share previews, auction insights, and lot updates.
- KYC: Identity verification required to participate in auctions. Takes 24–48 hours in most cases.
- All items come with full provenance documentation and certificates of authenticity.

USER CONTEXT:
- Signed in: ${isLoggedIn ? 'Yes' : 'No'}
${userName ? `- Name: ${userName}` : ''}
${userEmail ? `- Email: ${userEmail}` : ''}

BEHAVIOUR RULES:
- If the user is signed in, greet them by first name on the very first message.
- If not signed in, warmly invite them to create an account.
- Answer navigation questions by mentioning the page name (e.g. "Head to Live Auctions to browse current lots").
- Never reveal confidential data (bid history of others, internal pricing, seller identities).
- Never make up auction results or lot details — say data is available on the platform.
- Keep responses concise (2–4 sentences max unless a list is helpful).
- Respond in plain text, no markdown asterisks or hashes. Use clean natural language.
- If asked something outside your scope, gently redirect to the relevant page or suggest contacting support at contact@wregals.com.`;
}

interface Message {
    role: 'user' | 'model';
    text: string;
}

interface AIChatbotProps {
    visible: boolean;
    user: any;
    onSignInClick: () => void;
}

export default function AIChatbot({ visible, user, onSignInClick }: AIChatbotProps) {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [chatSession, setChatSession] = useState<any>(null);
    const [hasGreeted, setHasGreeted] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Initialise Gemini chat session
    useEffect(() => {
        if (!API_KEY || chatSession) return;
        try {
            const genAI = new GoogleGenerativeAI(API_KEY);
            const model = genAI.getGenerativeModel({
                model: 'gemini-2.5-flash',
                systemInstruction: buildSystemPrompt(user),
            });
            const session = model.startChat({ history: [] });
            setChatSession(session);
        } catch (e) {
            console.error('Gemini init error:', e);
        }
    }, [user]);

    // Re-init session when user changes (login/logout)
    useEffect(() => {
        if (!API_KEY) return;
        try {
            const genAI = new GoogleGenerativeAI(API_KEY);
            const model = genAI.getGenerativeModel({
                model: 'gemini-2.5-flash',
                systemInstruction: buildSystemPrompt(user),
            });
            const session = model.startChat({ history: [] });
            setChatSession(session);
            setMessages([]);
            setHasGreeted(false);
        } catch (e) {
            console.error('Gemini re-init error:', e);
        }
    }, [user?.id]);

    // Auto-scroll to latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    // Focus input when panel opens
    useEffect(() => {
        if (open) {
            setTimeout(() => inputRef.current?.focus(), 150);
        }
    }, [open]);

    // Send opening greeting when panel opens for the first time
    const handleOpen = async () => {
        setOpen(true);
        if (hasGreeted || !chatSession) return;
        setHasGreeted(true);

        const firstName = user?.user_metadata?.full_name?.split(' ')[0] || null;
        const greetMsg = firstName
            ? `Welcome back, ${firstName}. I'm WREN, your WREGALS concierge. How can I assist you today?`
            : `Welcome to WREGALS. I'm WREN, your personal auction concierge. How can I help you today?`;

        setMessages([{ role: 'model', text: greetMsg }]);
    };

    const sendMessage = async () => {
        const text = input.trim();
        if (!text || loading || !chatSession) return;

        setInput('');
        setMessages(prev => [...prev, { role: 'user', text }]);
        setLoading(true);

        try {
            const result = await chatSession.sendMessage(text);
            const response = await result.response;
            const reply = response.text();
            setMessages(prev => [...prev, { role: 'model', text: reply }]);
        } catch (e) {
            console.error('Gemini error:', e);
            setMessages(prev => [...prev, {
                role: 'model',
                text: 'I apologise — I encountered an issue. Please try again in a moment.'
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    if (!visible) return null;

    return (
        <>
            {/* ── Chat Panel ─────────────────────────────────────────────────────── */}
            {open && (
                <div
                    className="fixed bottom-24 right-5 z-50 flex flex-col"
                    style={{
                        width: 'min(380px, calc(100vw - 24px))',
                        height: 'min(520px, calc(100vh - 120px))',
                        background: '#0A0A0A',
                        border: '1px solid rgba(212, 175, 55, 0.25)',
                        boxShadow: '0 24px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(212,175,55,0.05)',
                        animation: 'wren-slide-up 0.25s ease',
                    }}
                >
                    {/* Header */}
                    <div
                        className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0"
                        style={{ borderColor: 'rgba(212,175,55,0.15)', background: '#0D0D0D' }}
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className="w-8 h-8 flex items-center justify-center flex-shrink-0"
                                style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)' }}
                            >
                                <IIcon icon="solar:star-shine-bold" width="16" class="text-[#D4AF37]" />
                            </div>
                            <div>
                                <p className="text-white text-sm font-semibold tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '15px' }}>WREN</p>
                                <p className="text-[10px] uppercase tracking-widest" style={{ color: '#D4AF37' }}>WREGALS Concierge</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setOpen(false)}
                            className="text-neutral-500 hover:text-white transition-colors"
                        >
                            <IIcon icon="solar:close-square-linear" width="20" class="text-neutral-500" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'model' && (
                                    <div
                                        className="w-6 h-6 flex-shrink-0 flex items-center justify-center mr-2 mt-0.5"
                                        style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)' }}
                                    >
                                        <IIcon icon="solar:star-shine-bold" width="10" class="text-[#D4AF37]" />
                                    </div>
                                )}
                                <div
                                    className="max-w-[80%] px-3 py-2 text-sm leading-relaxed"
                                    style={{
                                        background: msg.role === 'user'
                                            ? 'rgba(212,175,55,0.12)'
                                            : 'rgba(255,255,255,0.04)',
                                        border: msg.role === 'user'
                                            ? '1px solid rgba(212,175,55,0.2)'
                                            : '1px solid rgba(255,255,255,0.06)',
                                        color: msg.role === 'user' ? '#E8D5A3' : '#CCCCCC',
                                    }}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}

                        {/* Typing indicator */}
                        {loading && (
                            <div className="flex justify-start items-center gap-2">
                                <div
                                    className="w-6 h-6 flex-shrink-0 flex items-center justify-center"
                                    style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)' }}
                                >
                                    <IIcon icon="solar:star-shine-bold" width="10" class="text-[#D4AF37]" />
                                </div>
                                <div
                                    className="px-3 py-2 flex items-center gap-1"
                                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                                >
                                    {[0, 1, 2].map(i => (
                                        <span
                                            key={i}
                                            className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full"
                                            style={{ animation: `wren-dot 1.2s ease-in-out ${i * 0.2}s infinite` }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick suggestions (show only at start) */}
                    {messages.length <= 1 && !loading && (
                        <div className="px-3 pb-2 flex flex-wrap gap-1.5 flex-shrink-0">
                            {['How do I bid?', 'Live auctions', 'How does KYC work?', 'What is WREGALS?'].map(s => (
                                <button
                                    key={s}
                                    onClick={() => { setInput(s); setTimeout(() => sendMessage(), 0); }}
                                    className="text-[10px] px-2.5 py-1 uppercase tracking-widest transition-colors"
                                    style={{
                                        border: '1px solid rgba(212,175,55,0.2)',
                                        color: '#D4AF37',
                                        background: 'rgba(212,175,55,0.05)',
                                    }}
                                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(212,175,55,0.12)')}
                                    onMouseLeave={e => (e.currentTarget.style.background = 'rgba(212,175,55,0.05)')}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Not logged in nudge */}
                    {!user && messages.length > 0 && (
                        <div
                            className="mx-3 mb-2 px-3 py-2 flex items-center justify-between gap-2 flex-shrink-0"
                            style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)' }}
                        >
                            <span className="text-[10px] text-neutral-400 uppercase tracking-wider">Sign in for account insights</span>
                            <button
                                onClick={onSignInClick}
                                className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 transition-colors"
                                style={{ background: '#D4AF37', color: '#000' }}
                            >
                                Sign In
                            </button>
                        </div>
                    )}

                    {/* Input */}
                    <div
                        className="flex items-center gap-2 px-3 py-3 flex-shrink-0"
                        style={{ borderTop: '1px solid rgba(212,175,55,0.1)', background: '#0D0D0D' }}
                    >
                        <input
                            ref={inputRef}
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask WREN anything..."
                            className="flex-1 bg-transparent text-sm text-white placeholder-neutral-600 outline-none"
                            style={{ fontFamily: 'inherit' }}
                            disabled={loading}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={loading || !input.trim()}
                            className="flex-shrink-0 w-8 h-8 flex items-center justify-center transition-all"
                            style={{
                                background: input.trim() ? '#D4AF37' : 'rgba(255,255,255,0.05)',
                                color: input.trim() ? '#000' : '#555',
                            }}
                        >
                            <IIcon icon="solar:arrow-up-bold" width="14" class="text-inherit" />
                        </button>
                    </div>
                </div>
            )}

            {/* ── FAB Button ─────────────────────────────────────────────────────── */}
            <button
                onClick={open ? () => setOpen(false) : handleOpen}
                className={`fixed bottom-6 right-6 z-50 flex items-center justify-center outline-none transition-all duration-300 ${open ? 'w-14 h-14 rounded-full' : 'w-16 h-16 rounded-full group'}`}
                style={{
                    background: open ? '#0A0A0A' : 'transparent',
                    border: open ? '1px solid rgba(212,175,55,0.4)' : 'none',
                    color: open ? '#D4AF37' : '#000',
                    boxShadow: open ? '0 8px 24px rgba(0,0,0,0.5)' : 'none',
                    animation: 'wren-fab-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
                title={open ? 'Close WREN' : 'Chat with WREN'}
            >
                {open ? (
                    <IIcon icon="solar:close-square-linear" width="22" class="text-[#D4AF37]" />
                ) : (
                    <div className="relative flex items-center justify-center w-full h-full">
                        {/* Ambient glow that breathes */}
                        <div 
                            className="absolute inset-0 rounded-full bg-[#D4AF37] blur-[14px] opacity-40 group-hover:opacity-70 transition-opacity duration-700"
                            style={{ animation: 'wren-breathe 3s ease-in-out infinite' }}
                        ></div>
                        
                        {/* Spinning golden gradient border */}
                        <div 
                            className="absolute inset-0 rounded-full" 
                            style={{ 
                                background: 'conic-gradient(from 0deg, transparent 0%, rgba(212,175,55,0.8) 25%, transparent 50%, rgba(212,175,55,0.8) 75%, transparent 100%)', 
                                padding: '1.5px', 
                                animation: 'wren-spin 4s linear infinite' 
                            }}
                        >
                            {/* Solid inner core */}
                            <div className="w-full h-full bg-[#0A0A0A] rounded-full flex items-center justify-center relative overflow-hidden transition-all duration-500 shadow-[inset_0_0_10px_rgba(212,175,55,0.15)] group-hover:bg-[#121212]">
                                {/* Subtle inner radial glow on hover */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.25)_0%,transparent_70%)]"></div>
                                
                                {/* Dynamic Magic Icon */}
                                <IIcon 
                                    icon="solar:magic-stick-3-bold" 
                                    width="28" 
                                    class="text-[#D4AF37] relative z-10 drop-shadow-[0_0_10px_rgba(212,175,55,0.8)] transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6" 
                                />
                            </div>
                        </div>
                    </div>
                )}
            </button>

            {/* ── Keyframe styles ─────────────────────────────────────────────────── */}
            <style>{`
        @keyframes wren-slide-up {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes wren-fab-in {
          from { opacity: 0; transform: scale(0.6); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes wren-dot {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40%            { opacity: 1;   transform: scale(1.2); }
        }
        @keyframes wren-breathe {
          0%, 100% { transform: scale(1); opacity: 0.35; }
          50% { transform: scale(1.1); opacity: 0.6; }
        }
        @keyframes wren-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
        </>
    );
}
