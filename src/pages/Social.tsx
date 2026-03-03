// @ts-nocheck
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

/* ─── Mock data ─────────────────────────────────────────────────────────── */
const CREATORS = [
    { id: 'c1', name: 'Rohit Shetty', handle: '@rohitshetty', role: 'Film Director', initials: 'RS', followers: '142k', posts: 14 },
    { id: 'c2', name: 'Deepika Padukone', handle: '@deepikapadukone', role: 'Actor & Collector', initials: 'DP', followers: '389k', posts: 8 },
    { id: 'c3', name: 'Virat Kohli', handle: '@viratkohli', role: 'Cricketer', initials: 'VK', followers: '512k', posts: 11 },
];

const TRENDING_LOTS = [
    { label: 'Trending · Collectibles', title: '2011 World Cup Jersey', posts: '4.2k bids', time: 'Opens in 6 days' },
    { label: 'Live Now · Jewellery', title: 'Cartier Diamond — Cannes 2018', posts: '₹87.5L current bid', time: '2d 14h left' },
    { label: 'Trending · Cinema', title: 'Singham Director Chair', posts: '₹4.75L hammer', time: 'Sold' },
];

const POSTS_FYP = [
    {
        id: 'p1', creatorId: 'c3', name: 'Virat Kohli', handle: '@viratkohli', initials: 'VK', role: 'Cricketer', time: '2h',
        text: "The jersey I wore in the 2011 World Cup final is going live on WREGALS next week. This one is personal. More than any trophy, it reminds me of what we built together as a team. Verified provenance, original match tag still intact.",
        image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2005&auto=format&fit=crop',
        auctionCard: { lotTitle: '2011 World Cup Final Match Jersey', lotNum: 'Lot #WC2011-07', bid: '₹32,00,000', time: '6 days', status: 'upcoming' },
        likes: 4812, reshares: 634,
    },
    {
        id: 'p2', creatorId: 'c2', name: 'Deepika Padukone', handle: '@deepikapadukone', initials: 'DP', role: 'Actor & Collector', time: '5h',
        text: "The Cartier necklace I wore to the Cannes premiere in 2018 has been authenticated by Cartier Geneva. Every piece I list has a story — this one carries four years of memory. Opening reserve: ₹85L.",
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1974&auto=format&fit=crop',
        auctionCard: { lotTitle: 'Cartier Diamond Necklace — Cannes 2018', lotNum: 'Lot #CRT-DP18', bid: '₹87,50,000', time: '2d 14h', status: 'live' },
        likes: 9231, reshares: 1102,
    },
    {
        id: 'p3', creatorId: 'c1', name: 'Rohit Shetty', handle: '@rohitshetty', initials: 'RS', role: 'Film Director', time: '1d',
        text: "30 years behind the camera. This director's chair from the sets of Singham (2011) sat in my Mumbai office until today. The leather is original, the plaque is hand-engraved. Now it belongs to a collector who truly values cinema.",
        image: null,
        auctionCard: { lotTitle: "Singham (2011) Director's Chair", lotNum: 'Lot #FILM-RS01', bid: '₹4,75,000', time: 'Ended', status: 'sold' },
        likes: 3104, reshares: 289,
    },
    {
        id: 'p4', creatorId: 'c3', name: 'Virat Kohli', handle: '@viratkohli', initials: 'VK', role: 'Cricketer', time: '2d',
        text: "I get asked all the time — why auction instead of donate? Because auction creates a transaction with meaning. The buyer knows the value. The price becomes part of the legacy. That's what WREGALS is built for.",
        image: null, auctionCard: null,
        likes: 6644, reshares: 882,
    },
    {
        id: 'p5', creatorId: 'c2', name: 'Deepika Padukone', handle: '@deepikapadukone', initials: 'DP', role: 'Actor & Collector', time: '3d',
        text: "Behind the scenes from our verification session with the WREGALS provenance team. Every detail — stitching, clasp, hallmark — documented and uploaded to the lot record. This is what authentic looks like.",
        image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?q=80&w=1974&auto=format&fit=crop',
        auctionCard: null,
        likes: 5503, reshares: 477,
    },
];

const POSTS_FOLLOWING = POSTS_FYP.filter(p => ['p1', 'p4'].includes(p.id));

/* ─── Share sheet ─────────────────────────────────────────────────────── */
function ShareSheet({ postId, onClose }: { postId: string; onClose: () => void }) {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, [onClose]);
    const url = `https://wregals.com/social/${postId}`;
    return (
        <div ref={ref} className="absolute bottom-8 right-0 z-50 w-52 bg-[#111] border border-white/10 shadow-2xl overflow-hidden">
            <p className="text-[9px] uppercase tracking-widest text-neutral-600 px-4 pt-3 pb-1">Share via</p>
            {[
                { label: 'WhatsApp', icon: 'ic:baseline-whatsapp', href: `https://wa.me/?text=${encodeURIComponent(url)}` },
                { label: 'Twitter / X', icon: 'ri:twitter-x-fill', href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}` },
                { label: 'LinkedIn', icon: 'mdi:linkedin', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
                { label: 'Instagram', icon: 'mdi:instagram', href: '#' },
            ].map(o => (
                <a key={o.label} href={o.href} target="_blank" rel="noreferrer" className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 text-sm text-neutral-300 transition-colors">
                    <iconify-icon icon={o.icon} width="15" class="text-neutral-400" />{o.label}
                </a>
            ))}
            <button onClick={() => { navigator.clipboard?.writeText(url); onClose(); }} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 text-sm text-neutral-300 w-full border-t border-white/5 transition-colors">
                <iconify-icon icon="solar:copy-linear" width="15" class="text-neutral-400" />Copy Link
            </button>
        </div>
    );
}

/* ─── Auction mini-card ───────────────────────────────────────────────── */
function AuctionCard({ card }) {
    const isLive = card.status === 'live';
    const isSold = card.status === 'sold';
    return (
        <div className="mt-3 border border-[#D4AF37]/20 overflow-hidden bg-[#0D0D0D]">
            <div className="h-px bg-gradient-to-r from-[#D4AF37]/50 to-transparent" />
            <div className="px-4 py-3 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        {isLive && <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse flex-shrink-0" />}
                        <span className={`text-[9px] uppercase tracking-widest font-semibold ${isLive ? 'text-red-400' : isSold ? 'text-neutral-500' : 'text-[#D4AF37]'}`}>
                            {isLive ? 'Live' : isSold ? 'Sold' : 'Upcoming'}
                        </span>
                        <span className="text-[9px] text-neutral-600">{card.lotNum}</span>
                    </div>
                    <p className="text-sm font-medium text-white truncate mb-1">{card.lotTitle}</p>
                    <div className="flex gap-4">
                        <div><p className="text-[9px] text-neutral-600 uppercase">{isSold ? 'Final' : 'Bid'}</p><p className="font-mono text-xs text-white">{card.bid}</p></div>
                        {!isSold && <div><p className="text-[9px] text-neutral-600 uppercase">{isLive ? 'Ends' : 'Opens'}</p><p className="font-mono text-xs text-white">{card.time}</p></div>}
                    </div>
                </div>
                {!isSold && (
                    <Link to={isLive ? '/auctions/live' : '/auctions/upcoming'} className="flex-shrink-0 text-[10px] uppercase tracking-widest border border-[#D4AF37]/40 text-[#D4AF37] px-3 py-1.5 hover:bg-[#D4AF37]/10 transition-colors rounded-sm whitespace-nowrap">
                        View Lot
                    </Link>
                )}
            </div>
        </div>
    );
}

/* ─── Post card ───────────────────────────────────────────────────────── */
function PostCard({ post, liked, reshared, shareOpen, onLike, onReshare, onShare }) {
    const [lc, setLc] = useState(post.likes);
    const [rc, setRc] = useState(post.reshares);
    const fmt = (n) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

    return (
        <article className="flex gap-3 px-4 py-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer">
            {/* Avatar */}
            <div className="flex-shrink-0 w-10 h-10 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 flex items-center justify-center">
                <span className="font-mono text-xs text-[#D4AF37]">{post.initials}</span>
            </div>

            <div className="flex-1 min-w-0">
                {/* Name row */}
                <div className="flex items-center gap-1.5 flex-wrap mb-1">
                    <span className="text-sm font-bold text-white">{post.name}</span>
                    <iconify-icon icon="solar:verified-check-bold" width="14" class="text-[#D4AF37]" />
                    <span className="text-sm text-neutral-600">{post.handle}</span>
                    <span className="text-neutral-700">·</span>
                    <span className="text-sm text-neutral-600">{post.time}</span>
                </div>

                {/* Text */}
                <p className="text-sm text-neutral-200 leading-relaxed mb-3">{post.text}</p>

                {/* Image */}
                {post.image && (
                    <div className="w-full aspect-[16/9] overflow-hidden bg-[#111] mb-3">
                        <img src={post.image} alt="" className="w-full h-full object-cover" />
                    </div>
                )}

                {/* Auction card */}
                {post.auctionCard && <AuctionCard card={post.auctionCard} />}

                {/* Actions */}
                <div className="flex items-center justify-between mt-3 max-w-xs">
                    {/* Like */}
                    <button onClick={() => { setLc(l => liked ? l - 1 : l + 1); onLike(post.id); }}
                        className={`flex items-center gap-1.5 text-xs group transition-colors ${liked ? 'text-pink-500' : 'text-neutral-600 hover:text-pink-500'}`}>
                        <span className="w-8 h-8 flex items-center justify-center group-hover:bg-pink-500/10 transition-colors">
                            <iconify-icon icon={liked ? 'solar:heart-bold' : 'solar:heart-linear'} width="17" />
                        </span>
                        <span>{fmt(lc)}</span>
                    </button>

                    {/* Reshare */}
                    <button onClick={() => { setRc(r => reshared ? r - 1 : r + 1); onReshare(post.id); }}
                        className={`flex items-center gap-1.5 text-xs group transition-colors ${reshared ? 'text-[#D4AF37]' : 'text-neutral-600 hover:text-[#D4AF37]'}`}>
                        <span className="w-8 h-8 flex items-center justify-center group-hover:bg-[#D4AF37]/10 transition-colors">
                            <iconify-icon icon="solar:reorder-linear" width="17" />
                        </span>
                        <span>{fmt(rc)}</span>
                    </button>

                    {/* Share */}
                    <div className="relative">
                        <button onClick={() => onShare(post.id)}
                            className="flex items-center gap-1.5 text-xs text-neutral-600 hover:text-sky-400 group transition-colors">
                            <span className="w-8 h-8 flex items-center justify-center group-hover:bg-sky-400/10 transition-colors">
                                <iconify-icon icon="solar:share-linear" width="17" />
                            </span>
                        </button>
                        {shareOpen === post.id && <ShareSheet postId={post.id} onClose={() => onShare(null)} />}
                    </div>
                </div>
            </div>
        </article>
    );
}

/* ─── Main ────────────────────────────────────────────────────────────── */
interface SocialProps { user: any; onSignInClick: () => void; }

export default function Social({ user, onSignInClick }: SocialProps) {
    const [tab, setTab] = useState<'foryou' | 'following'>('foryou');
    const [liked, setLiked] = useState<Set<string>>(new Set());
    const [reshared, setReshared] = useState<Set<string>>(new Set());
    const [shareOpen, setShareOpen] = useState<string | null>(null);
    const [followed, setFollowed] = useState<Set<string>>(new Set());
    const navigate = useNavigate();

    const toggleLike = (id: string) => setLiked(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
    const toggleReshare = (id: string) => setReshared(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
    const toggleFollow = (id: string) => setFollowed(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
    const toggleShare = (id: string | null) => setShareOpen(p => p === id ? null : id);

    const posts = tab === 'foryou' ? POSTS_FYP : POSTS_FOLLOWING;

    const NAV_ITEMS = [
        { icon: 'solar:home-2-linear', iconActive: 'solar:home-2-bold', label: 'Home', to: '/' },
        { icon: 'solar:star-linear', iconActive: 'solar:star-bold', label: 'Social', to: '/social', active: true },
        { icon: 'solar:notification-linear', iconActive: 'solar:notification-bold', label: 'Auctions', to: '/auctions/live' },
        { icon: 'solar:bookmark-linear', iconActive: 'solar:bookmark-bold', label: 'Watchlist', to: '#' },
        { icon: 'solar:wallet-linear', iconActive: 'solar:wallet-bold', label: 'Wallet', to: '#' },
        { icon: 'solar:user-circle-linear', iconActive: 'solar:user-circle-bold', label: 'Profile', to: '#' },
    ];

    return (
        <div className="bg-[#080808] min-h-screen text-white">
            {/* Mobile top nav */}
            <nav className="fixed top-0 w-full z-50 bg-[#080808]/90 backdrop-blur-md border-b border-white/5 md:hidden">
                <div className="px-4 h-14 flex items-center justify-between">
                    <Link to="/"><img src="/wregals-logo-new.png" alt="WREGALS" className="h-9 w-auto object-contain" /></Link>
                    <span className="text-xs tracking-widest uppercase text-[#D4AF37]">Social</span>
                    {!user && <button onClick={onSignInClick} className="text-xs border border-white/20 px-3 py-1.5 hover:bg-white hover:text-black transition-all">Sign In</button>}
                </div>
            </nav>

            {/* Three-column layout */}
            <div className="max-w-[1280px] mx-auto flex min-h-screen">

                {/* ── LEFT SIDEBAR ── */}
                <aside className="hidden md:flex flex-col w-64 xl:w-72 flex-shrink-0 sticky top-0 h-screen px-3 py-4 border-r border-white/5">
                    {/* Logo */}
                    <Link to="/" className="mb-6 px-3 pt-2 block">
                        <img src="/wregals-logo-new.png" alt="WREGALS" className="h-12 w-auto object-contain" />
                    </Link>

                    {/* Nav items */}
                    <nav className="flex flex-col gap-1 flex-1">
                        {NAV_ITEMS.map(item => (
                            <Link key={item.label} to={item.to}
                                className={`flex items-center gap-4 px-4 py-3 transition-all group ${item.active ? 'text-white font-bold' : 'text-neutral-400 hover:text-white hover:bg-white/5'}`}>
                                <iconify-icon icon={item.active ? item.iconActive : item.icon} width="22" />
                                <span className="text-lg">{item.label}</span>
                            </Link>
                        ))}
                    </nav>

                    {/* User pill at bottom */}
                    {user ? (
                        <div className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 cursor-pointer transition-colors mt-4 border border-white/5">
                            <div className="w-9 h-9 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 flex items-center justify-center flex-shrink-0">
                                <span className="font-mono text-xs text-[#D4AF37]">{(user.user_metadata?.full_name || user.email || 'U')[0].toUpperCase()}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-white truncate">{user.user_metadata?.full_name || user.email?.split('@')[0]}</p>
                                <p className="text-xs text-neutral-600 truncate">@{user.email?.split('@')[0]}</p>
                            </div>
                            <iconify-icon icon="solar:menu-dots-bold" width="16" class="text-neutral-600" />
                        </div>
                    ) : (
                        <button onClick={onSignInClick} className="mt-4 w-full py-3 bg-[#D4AF37] text-black text-sm font-bold hover:bg-[#c49f2e] transition-colors uppercase tracking-widest">
                            Sign In
                        </button>
                    )}
                </aside>

                {/* ── CENTER FEED ── */}
                <main className="flex-1 min-w-0 border-r border-white/5 mt-14 md:mt-0">
                    {/* Sticky header */}
                    <div className="sticky top-0 z-30 bg-[#080808]/80 backdrop-blur-md border-b border-white/5">
                        <div className="px-4 py-3 hidden md:flex items-center gap-3">
                            <img src="/wregals-logo-new.png" alt="W" className="h-7 w-auto object-contain opacity-60" />
                            <h1 className="font-bold text-lg text-white">Social</h1>
                        </div>
                        {/* Tabs */}
                        <div className="flex border-b border-white/5">
                            {[{ id: 'foryou', label: 'For You' }, { id: 'following', label: 'Following' }].map(t => (
                                <button key={t.id} onClick={() => setTab(t.id as any)}
                                    className={`flex-1 h-12 text-sm font-semibold transition-colors relative ${tab === t.id ? 'text-white' : 'text-neutral-600 hover:text-neutral-300 hover:bg-white/5'}`}>
                                    {t.label}
                                    {tab === t.id && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-0.5 bg-[#D4AF37]" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Posts */}
                    <div>
                        {posts.map(post => (
                            <PostCard key={post.id} post={post}
                                liked={liked.has(post.id)} reshared={reshared.has(post.id)} shareOpen={shareOpen}
                                onLike={toggleLike} onReshare={toggleReshare} onShare={toggleShare} />
                        ))}
                        {posts.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-24 text-center px-8">
                                <iconify-icon icon="solar:user-plus-linear" width="40" class="text-neutral-700 mb-4" />
                                <p className="text-lg font-bold text-white mb-1">Follow creators to see their broadcasts</p>
                                <p className="text-sm text-neutral-600">Follow verified creators from the sidebar to build your personalised feed.</p>
                            </div>
                        )}
                    </div>
                </main>

                {/* ── RIGHT SIDEBAR ── */}
                <aside className="hidden lg:block w-80 xl:w-96 flex-shrink-0 px-4 py-4 sticky top-0 h-screen overflow-y-auto">
                    {/* Search bar */}
                    <div className="flex items-center gap-3 bg-[#111] border border-white/10 px-4 py-2.5 mb-5 mt-2">
                        <iconify-icon icon="solar:magnifer-linear" width="15" class="text-neutral-500" />
                        <span className="text-sm text-neutral-600">Search creators & lots</span>
                    </div>

                    {/* Live Lots card */}
                    <div className="bg-[#0C0C0C] border border-white/5 overflow-hidden mb-4">
                        <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            <h3 className="font-bold text-white text-sm">Live Drops</h3>
                        </div>
                        {TRENDING_LOTS.map((t, i) => (
                            <div key={i} className="px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 cursor-pointer">
                                <p className="text-[10px] text-neutral-600 mb-0.5 uppercase tracking-widest">{t.label}</p>
                                <p className="text-sm font-semibold text-white mb-0.5">{t.title}</p>
                                <p className="text-xs text-neutral-500">{t.posts} · {t.time}</p>
                            </div>
                        ))}
                        <Link to="/auctions/live" className="block px-4 py-3 text-sm text-[#D4AF37] hover:bg-white/5 transition-colors">
                            Show all live auctions →
                        </Link>
                    </div>

                    {/* Who to follow */}
                    <div className="bg-[#0C0C0C] border border-white/5 overflow-hidden mb-4">
                        <div className="px-4 py-3 border-b border-white/5">
                            <h3 className="font-bold text-white text-sm">Verified Creators</h3>
                        </div>
                        {CREATORS.map(c => (
                            <div key={c.id} className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                                <div className="w-9 h-9 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 flex items-center justify-center flex-shrink-0">
                                    <span className="font-mono text-xs text-[#D4AF37]">{c.initials}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1">
                                        <span className="text-sm font-semibold text-white truncate">{c.name}</span>
                                        <iconify-icon icon="solar:verified-check-bold" width="12" class="text-[#D4AF37] flex-shrink-0" />
                                    </div>
                                    <p className="text-xs text-neutral-600 truncate">{c.handle}</p>
                                </div>
                                <button onClick={() => toggleFollow(c.id)}
                                    className={`text-xs font-semibold px-4 py-1.5 border transition-all flex-shrink-0 uppercase tracking-widest ${followed.has(c.id)
                                        ? 'border-white/20 text-white hover:border-red-400/50 hover:text-red-400'
                                        : 'bg-white text-black hover:bg-neutral-200'
                                        }`}>
                                    {followed.has(c.id) ? 'Following' : 'Follow'}
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Policy note */}
                    <div className="bg-[#0C0C0C] border border-white/5 px-4 py-4">
                        <div className="flex items-center gap-2 mb-2">
                            <iconify-icon icon="solar:shield-check-linear" width="14" class="text-[#D4AF37]" />
                            <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest">Broadcast Policy</span>
                        </div>
                        <p className="text-xs text-neutral-600 leading-relaxed">Only verified creators post. No public comments in Phase 1. Content is auction-centric and editorially reviewed by WREGALS.</p>
                    </div>
                </aside>

            </div>
        </div>
    );
}
