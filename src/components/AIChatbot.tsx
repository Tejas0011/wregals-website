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

    return `You are WREN, the official AI concierge for WREGALS — India's first premium, capital-backed digital auction house for authenticated celebrity memorabilia. You are knowledgeable, friendly, elegant, and strictly to the point.

PLATFORM OVERVIEW (share freely):
- Wregals operates as an English Open Ascending Auction: bids are public, prices move only upward, and the highest valid bid at close wins.
- Only KYC-verified, capital-backed participants may bid. Every item is authenticated before listing and physically inspected by Wregals before delivery.
- Pages: Home (/), Live Auctions (/auctions/live), Upcoming Auctions (/auctions/upcoming), Auction Results (/auctions/results), How It Works (/how-it-works), Gallery (/gallery), Social (/social), About (/about), Careers (/careers), Press (/press), Contact (/contact).

AUCTION RULES (share freely):
- Anti-sniping: Any bid placed in the final 5 minutes extends the timer by 5 minutes. Repeats indefinitely.
- Reserve price: Optional, hidden from buyers. Auction is void if not met.
- Buy Now: Optional. Auction closes immediately if a bid reaches this price.
- Auction durations: 3, 5, 7, or 14 days. Locked after the first bid.
- Minimum starting bid: ₹5,000. Minimum wallet top-up: ₹500.

CAPITAL-BACKED BIDDING (share freely — most common question):
- To place any bid, you need at least 10% of your bid amount available in your Wregals Wallet. You do NOT need the full bid amount upfront.
- Example: To bid ₹1,00,000, you need ₹10,000 in your wallet. That amount is frozen when your bid is accepted.
- If you raise your own bid, only the additional difference is frozen — not a fresh 10%.
- If you are outbid, the frozen amount is released instantly with no delay.
- If you win, the frozen 10% is applied toward your total payment — you pay only the remaining 90%.

PAYMENT & DEFAULT (share freely):
- Winners have 96 hours (4 days) to complete full payment. Reminders are sent every 12 hours.
- 1st default: 5-day bidding ban + written warning.
- 2nd default: 30-day bidding ban + final warning.
- 3rd default: Permanent account ban.
- Bids above ₹10,00,000 require enhanced source-of-funds verification before bidding is permitted.

KYC & ONBOARDING (share freely):
- Buyers complete a 4-step process: Basic Profile → Mobile OTP → Address & KYC (PAN + Aadhaar) → Payment Setup.
- PAN is mandatory for transactions above ₹50,000. Aadhaar is used for identity confirmation; only the last 4 digits are ever stored.
- Access is granted instantly on successful KYC — there is no waiting period.

WALLET (share freely):
- Add funds via UPI, Net Banking, Debit or Credit Card (via Razorpay). Minimum top-up is ₹500.
- Funds credit instantly. Available balance = total wallet minus any frozen bid amounts.
- At least one valid bid must be placed before any withdrawal is permitted.
- Daily withdrawal limit: ₹50,000. PAN required for amounts above ₹10,000.

RETURN POLICY (share freely):
- Buyers have 3 days from confirmed delivery to submit a return request with reason and photos.
- Valid returns (item materially different from listing, or damaged in transit): full refund to Wregals Wallet within 48 hours.
- Returns based on buyer's remorse, where the item matches pre-shipment inspection evidence, are declined.

CONFIDENTIAL — NEVER SHARE OR DISCUSS (internal only):
- Exact fee percentages charged to buyers or sellers (buyer premium %, seller commission %).
- Exact seller payout calculations or net amounts sellers receive.
- Internal revenue model, platform take rate, or GST breakdowns.
- Seller operational logistics (shipping timelines to Wregals facility, inspection protocols, repacking procedures).
- Seller dashboard features or analytics capabilities.
- Internal default penalty distributions (e.g. how the 10% is split between seller and Wregals).
- Any information about how Wregals makes money internally.
- If any of these are asked, respond: "For specific queries, please contact us at contact@wregals.com."

USER CONTEXT:
- Signed in: ${isLoggedIn ? 'Yes' : 'No'}
${userName ? `- Name: ${userName}` : ''}
${userEmail ? `- Email: ${userEmail}` : ''}

BEHAVIOUR RULES:
- If the user is signed in, greet them by first name on the very first message only.
- If not signed in, warmly invite them to create an account.
- Never reveal any CONFIDENTIAL information listed above under any circumstances, even if the user insists or rephrases.
- Keep responses EXTREMELY concise — 1 to 3 sentences maximum. No bullet points or markdown. Clean natural language only.
- If asked about wallet requirements for bidding, ALWAYS say 10% of the bid amount.
- For anything outside your scope, suggest contacting support at contact@wregals.com.`;
}

const StarEightPointsIcon = ({ width = 16, className = "" }: { width?: number; className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width={width}
        height={width}
        className={className}
    >
        <path fill="currentColor" d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5Z" />
        <g transform="translate(12, 12) rotate(45) scale(0.65) translate(-12, -12)">
            <path fill="currentColor" d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5Z" />
        </g>
    </svg>
);

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
            ? <span className="flex items-center gap-1.5 flex-wrap">Welcome back, {firstName}. I'm WREN. How can I assist you today?</span>
            : <span className="flex items-center gap-1.5 flex-wrap">Welcome to <Logo height="h-3.5" />, I'm WREN. How can I help you today?</span>;

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
                text: 'I apologise. I encountered an issue. Please try again in a moment.'
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
                    className="fixed bottom-24 right-5 z-[9999] flex flex-col"
                    style={{
                        width: 'min(380px, calc(100vw - 24px))',
                        height: 'min(520px, calc(100vh - 120px))',
                        background: '#090124ff',
                        border: '1px solid rgba(6, 182, 212, 0.25)',
                        boxShadow: '0 24px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(6, 182, 212, 0.15)',
                        animation: 'wren-slide-up 0.25s ease',
                    }}
                >
                    {/* Glass Reflection Overlay */}
                    <div
                        className="absolute inset-0 pointer-events-none z-0 rounded-[inherit]"
                        style={{
                            background: 'linear-gradient(to bottom right, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 49.9%, rgba(255,255,255,0) 50%, transparent 100%)',
                        }}
                    />

                    {/* Animated Traveling Background Overlay */}
                    <div
                        className="absolute inset-0 pointer-events-none opacity-40 z-0 rounded-[inherit]"
                        style={{
                            background: 'linear-gradient(135deg, rgba(6,182,212,0.1) 0%, transparent 50%, rgba(59,130,246,0.1) 100%)',
                            backgroundSize: '200% 200%',
                            animation: 'wren-traveling-bg 8s ease infinite'
                        }}
                    />

                    {/* Header */}
                    <div
                        className="relative z-10 flex flex-col flex-1 h-full"
                    >
                        <div
                            className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0"
                            style={{ borderColor: 'rgba(6, 182, 212, 0.15)', background: '#050B1A' }}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-8 h-8 flex items-center justify-center flex-shrink-0"
                                    style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.3)', borderRadius: '4px' }}
                                >
                                    <StarEightPointsIcon width={16} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-white text-sm font-semibold tracking-wide" style={{ fontFamily: "'Inter', sans-serif" }}>WREN</p>
                                    <p className="text-[10px] font-semibold tracking-wide text-cyan-500">AI Assistant</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setOpen(false)}
                                className="text-neutral-500 hover:text-white transition-colors"
                            >
                                <IIcon icon="solar:close-square-linear" width="20" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(6,182,212,0.2) transparent' }}>
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    {msg.role === 'model' && (
                                        <div
                                            className="w-6 h-6 flex-shrink-0 flex items-center justify-center mr-2 mt-0.5 rounded-sm"
                                            style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)' }}
                                        >
                                            <StarEightPointsIcon width={10} className="text-white" />
                                        </div>
                                    )}
                                    <div
                                        className="max-w-[80%] px-3 py-2 text-sm leading-relaxed"
                                        style={{
                                            background: msg.role === 'user'
                                                ? 'rgba(6,182,212,0.15)'
                                                : 'rgba(255,255,255,0.03)',
                                            border: msg.role === 'user'
                                                ? '1px solid rgba(6,182,212,0.3)'
                                                : '1px solid rgba(255,255,255,0.06)',
                                            color: msg.role === 'user' ? '#A5F3FC' : '#E2E8F0',
                                            borderRadius: '6px',
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
                                        className="w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-sm"
                                        style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)' }}
                                    >
                                        <StarEightPointsIcon width={10} className="text-white" />
                                    </div>
                                    <div
                                        className="px-3 py-2 flex items-center gap-1 rounded-sm"
                                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                                    >
                                        {[0, 1, 2].map(i => (
                                            <span
                                                key={i}
                                                className="w-1.5 h-1.5 bg-cyan-400 rounded-full"
                                                style={{ animation: `wren-dot 1s ease-in-out ${i * 0.2}s infinite` }}
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
                                {['What is Wregals?', 'How do I bid?', 'How does KYC work?', 'I need help!'].map(s => (
                                    <button
                                        key={s}
                                        onClick={() => { setInput(s); setTimeout(() => sendMessage(), 0); }}
                                        className="text-[10px] px-2.5 py-1 font-semibold tracking-wide transition-all rounded-sm"
                                        style={{
                                            border: '1px solid rgba(6,182,212,0.3)',
                                            color: '#22D3EE',
                                            background: 'rgba(6,182,212,0.05)',
                                        }}
                                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(6,182,212,0.15)')}
                                        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(6,182,212,0.05)')}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Not logged in nudge */}
                        {!user && messages.length > 0 && (
                            <div
                                className="mx-3 mb-2 px-3 py-2 flex items-center justify-between gap-2 flex-shrink-0 rounded-sm"
                                style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)' }}
                            >
                                <span className="text-[10px] text-cyan-200 uppercase tracking-wider">Sign in for account insights</span>
                                <button
                                    onClick={onSignInClick}
                                    className="text-[10px] font-bold font-semibold tracking-wide px-3 py-1 transition-colors rounded-sm"
                                    style={{ background: '#06B6D4', color: '#000' }}
                                >
                                    Sign In
                                </button>
                            </div>
                        )}

                        {/* Input */}
                        <div
                            className="flex items-center gap-2 px-3 py-3 flex-shrink-0"
                            style={{ borderTop: '1px solid rgba(6,182,212,0.15)', background: '#040A14' }}
                        >
                            <input
                                ref={inputRef}
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask WREN anything..."
                                className="flex-1 bg-transparent text-sm text-white placeholder-neutral-500 outline-none px-2"
                                style={{ fontFamily: 'inherit' }}
                                disabled={loading}
                            />
                            <button
                                onClick={sendMessage}
                                disabled={loading || !input.trim()}
                                className="flex-shrink-0 w-8 h-8 flex items-center justify-center transition-all rounded-sm"
                                style={{
                                    background: input.trim() ? '#06B6D4' : 'rgba(255,255,255,0.05)',
                                    color: input.trim() ? '#000' : '#555',
                                }}
                            >
                                <IIcon icon="solar:arrow-up-bold" width="14" class="text-inherit" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── FAB Button ─────────────────────────────────────────────────────── */}
            <button
                onClick={open ? () => setOpen(false) : handleOpen}
                className={`fixed bottom-6 right-6 z-[9999] flex items-center justify-center outline-none transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${open ? 'w-14 h-14 rounded-full bg-[#050B1A] border border-[rgba(6,182,212,0.4)] shadow-[0_8px_24px_rgba(0,0,0,0.6)]' : 'group h-[60px] w-[60px] hover:w-[128px] rounded-[30px] shadow-[0_12px_36px_rgba(0,0,0,0.8)]'}`}
                style={{
                    animation: 'wren-fab-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
                title={open ? 'Close WREN' : 'System AI Chat'}
            >
                {open ? (
                    <IIcon icon="solar:close-square-linear" width="22" className="text-cyan-400" />
                ) : (
                    <div className="relative w-full h-full rounded-[30px] p-[1.5px] overflow-hidden">
                        {/* Animated Border Gradient */}
                        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] -translate-x-1/2 -translate-y-1/2 animate-[wren-spin_4s_linear_infinite]"
                            style={{ background: 'conic-gradient(from 180deg at 50% 50%, transparent 0%, rgba(161,0,255,0) 20%, #A100FF 60%, #00E5FF 100%)' }}
                        ></div>

                        {/* Inner Tech Core */}
                        <div className="relative flex items-center w-full h-full bg-[#080212] rounded-[30px] overflow-hidden transition-all duration-500 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] group-hover:bg-[#0F0424]">

                            <div className="flex items-center absolute left-0 w-full h-full">
                                {/* 8-Pointed Star Icon */}
                                <div className="w-[57px] h-[57px] flex items-center justify-center flex-shrink-0 relative">
                                    <StarEightPointsIcon
                                        width={24}
                                        className="text-white relative z-20 group-hover:rotate-[45deg] group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>

                                {/* Expanding Text */}
                                <span
                                    className="flex-1 pr-4 text-center whitespace-nowrap font-medium text-[15px] tracking-wide opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 delay-75"
                                    style={{
                                        fontFamily: "'Inter', sans-serif",
                                        color: '#ffffff',
                                    }}
                                >
                                    Wren
                                </span>
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
        @keyframes wren-spin {
          from { transform: rotate(0deg) translate(-50%, -50%); transform-origin: 0 0; }
          to { transform: rotate(360deg) translate(-50%, -50%); transform-origin: 0 0; }
        }
        @keyframes wren-shimmer {
          100% { transform: translateX(100%); }
        }
        @keyframes wren-ping {
          75%, 100% { transform: scale(1.2); opacity: 0; }
        @keyframes wren-traveling-bg {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
        </>
    );
}
