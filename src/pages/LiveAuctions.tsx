// @ts-nocheck
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import AuctionCard from '../components/AuctionCard';
import type { AuctionCardData } from '../components/AuctionCard';
import IIcon from '../components/IIcon';

// ─── Placeholder auction data ──────────────────────────────────────────────
const now = Date.now();
const mins = (n: number) => new Date(now + n * 60 * 1000);
const hrs = (n: number) => new Date(now + n * 60 * 60 * 1000);

const AUCTIONS: AuctionCardData[] = [
    {
        id: '1',
        title: '1968 Rolex Daytona "Paul Newman"',
        lot: '#1042',
        provenance: 'Ex-Collection: John Legend Estate',
        category: 'Horology',
        image: 'https://images.unsplash.com/photo-1617317376997-8748e6862c01?q=80&w=2070&auto=format&fit=crop',
        currentBid: 4500000,
        minIncrement: 50000,
        buyoutPrice: 8000000,
        bidCount: 18,
        endsAt: mins(90),
        status: 'live',
    },
    {
        id: '2',
        title: 'Cartier Panthère Diamond Ring, 5.2ct',
        lot: '#1043',
        provenance: 'Ex-Collection: Elizabeth Taylor',
        category: 'Jewellery',
        image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=2070&auto=format&fit=crop',
        currentBid: 1850000,
        minIncrement: 25000,
        bidCount: 12,
        endsAt: mins(1.5),
        status: 'ending-soon',
        extended: true,
    },
    {
        id: '3',
        title: '1955 Porsche 550 Spyder',
        lot: '#1044',
        provenance: 'Ex-Collection: Steve McQueen Estate',
        category: 'Automobiles',
        image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop',
        currentBid: 32000000,
        minIncrement: 500000,
        buyoutPrice: 60000000,
        bidCount: 31,
        endsAt: hrs(4),
        status: 'reserve-met',
    },
    {
        id: '4',
        title: 'Banksy "Girl with Balloon" (Original Print)',
        lot: '#1045',
        provenance: 'Private London Collector',
        category: 'Fine Art',
        image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=2070&auto=format&fit=crop',
        currentBid: 850000,
        minIncrement: 10000,
        bidCount: 9,
        endsAt: hrs(12),
        status: 'live',
    },
    {
        id: '5',
        title: 'Muhammad Ali Fight-Worn Gloves, 1974',
        lot: '#1046',
        provenance: 'Ali Estate, Authenticated by PSA/DNA',
        category: 'Memorabilia',
        image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=2070&auto=format&fit=crop',
        currentBid: 680000,
        minIncrement: 10000,
        bidCount: 22,
        endsAt: hrs(6),
        status: 'live',
    },
    {
        id: '6',
        title: 'Patek Philippe Nautilus 5711/1A',
        lot: '#1047',
        provenance: 'Single Private Owner, Geneva',
        category: 'Horology',
        image: 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?q=80&w=2070&auto=format&fit=crop',
        currentBid: 1125000,
        minIncrement: 25000,
        bidCount: 14,
        endsAt: hrs(2),
        status: 'reserve-met',
    },
];

const CATEGORIES = ['All', 'Horology', 'Jewellery', 'Fine Art', 'Automobiles', 'Memorabilia'];
const STATUSES = ['All', 'Live', 'Ending Soon', 'Reserve Met'];
const SORTS = ['Ending Soonest', 'Highest Bid', 'Lowest Bid', 'Most Bids'];

interface LiveAuctionsProps {
    user: any;
    walletBalance?: number;
    onSignInClick: () => void;
}

export default function LiveAuctions({ user, walletBalance = 0, onSignInClick }: LiveAuctionsProps) {
    const [category, setCategory] = useState('All');
    const [status, setStatus] = useState('All');
    const [sort, setSort] = useState('Ending Soonest');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [showFilters, setShowFilters] = useState(false); // mobile

    const filtered = useMemo(() => {
        let list = [...AUCTIONS];

        if (category !== 'All') list = list.filter(a => a.category === category);

        if (status !== 'All') {
            const map: Record<string, string[]> = {
                'Live': ['live'],
                'Ending Soon': ['ending-soon'],
                'Reserve Met': ['reserve-met'],
            };
            list = list.filter(a => map[status]?.includes(a.status));
        }

        const min = Number(minPrice) || 0;
        const max = Number(maxPrice) || Infinity;
        list = list.filter(a => a.currentBid >= min && a.currentBid <= max);

        if (sort === 'Ending Soonest') list.sort((a, b) => a.endsAt.getTime() - b.endsAt.getTime());
        if (sort === 'Highest Bid') list.sort((a, b) => b.currentBid - a.currentBid);
        if (sort === 'Lowest Bid') list.sort((a, b) => a.currentBid - b.currentBid);
        if (sort === 'Most Bids') list.sort((a, b) => b.bidCount - a.bidCount);

        return list;
    }, [category, status, sort, minPrice, maxPrice]);

    const liveCount = AUCTIONS.filter(a => a.status !== 'ended').length;

    return (
        <div className="bg-[#0C0C0D] min-h-screen text-white">

            {/* ── Page header ──────────────────────────────────────────────────── */}
            <div className="pt-20">
                <div className="max-w-7xl mx-auto px-6 py-12 border-b border-white/5">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            {/* Breadcrumb */}
                            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-neutral-600 mb-3">
                                <Link to="/" className="hover:text-neutral-400 transition-colors">Home</Link>
                                <span>/</span>
                                <span className="text-neutral-400">Auctions</span>
                                <span>/</span>
                                <span className="text-[#D4AF37]">Live</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-light tracking-tight">Live Auctions</h1>
                            <p className="text-neutral-500 text-sm mt-2">
                                <span className="inline-flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse inline-block" />
                                    <span className="text-white font-medium">{liveCount}</span> active lots · Bids updated in real-time
                                </span>
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Sort (desktop) */}
                            <div className="hidden md:flex items-center gap-2 text-xs">
                                <span className="text-neutral-500 uppercase tracking-widest">Sort:</span>
                                <select
                                    value={sort}
                                    onChange={e => setSort(e.target.value)}
                                    className="bg-[#0E0E0E] border border-white/10 text-neutral-300 text-xs px-3 py-2 focus:outline-none focus:border-white/30 rounded-sm cursor-pointer"
                                >
                                    {SORTS.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            {/* Mobile filter toggle */}
                            <button
                                onClick={() => setShowFilters(f => !f)}
                                className="md:hidden flex items-center gap-2 text-xs border border-white/10 px-3 py-2 rounded-sm"
                            >
                                <IIcon icon="solar:filter-linear" width="14" />
                                Filters
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Body ─────────────────────────────────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-6 py-10">
                <div className="flex gap-10">

                    {/* ── Sidebar ──────────────────────────────────────────────────── */}
                    <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-56 flex-shrink-0 space-y-8`}>

                        {/* Category */}
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold mb-3">Category</p>
                            <div className="space-y-1.5">
                                {CATEGORIES.map(c => (
                                    <button
                                        key={c}
                                        onClick={() => setCategory(c)}
                                        className={`w-full text-left text-sm px-3 py-2 rounded-sm transition-all ${category === c
                                            ? 'bg-white/5 text-[#D4AF37] border-l-2 border-[#D4AF37]'
                                            : 'text-neutral-400 hover:text-white'
                                            }`}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Status */}
                        <div className="pt-6 border-t border-white/5">
                            <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold mb-3">Status</p>
                            <div className="space-y-1.5">
                                {STATUSES.map(s => (
                                    <button
                                        key={s}
                                        onClick={() => setStatus(s)}
                                        className={`w-full text-left text-sm px-3 py-2 rounded-sm transition-all ${status === s
                                            ? 'bg-white/5 text-[#D4AF37] border-l-2 border-[#D4AF37]'
                                            : 'text-neutral-400 hover:text-white'
                                            }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Price range */}
                        <div className="pt-6 border-t border-white/5">
                            <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold mb-3">Bid Range (₹)</p>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 border-b border-white/10 pb-1">
                                    <span className="text-neutral-600 text-xs">Min</span>
                                    <input
                                        type="number"
                                        value={minPrice}
                                        onChange={e => setMinPrice(e.target.value)}
                                        placeholder="0"
                                        className="flex-1 bg-transparent text-sm focus:outline-none text-neutral-300 font-mono placeholder:text-neutral-700"
                                    />
                                </div>
                                <div className="flex items-center gap-2 border-b border-white/10 pb-1">
                                    <span className="text-neutral-600 text-xs">Max</span>
                                    <input
                                        type="number"
                                        value={maxPrice}
                                        onChange={e => setMaxPrice(e.target.value)}
                                        placeholder="No limit"
                                        className="flex-1 bg-transparent text-sm focus:outline-none text-neutral-300 font-mono placeholder:text-neutral-700"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Reset */}
                        {(category !== 'All' || status !== 'All' || minPrice || maxPrice) && (
                            <button
                                onClick={() => { setCategory('All'); setStatus('All'); setMinPrice(''); setMaxPrice(''); }}
                                className="text-xs text-neutral-500 hover:text-white transition-colors underline underline-offset-2"
                            >
                                Clear all filters
                            </button>
                        )}

                        {/* How bidding works */}
                        <div className="pt-6 border-t border-white/5 bg-[#0A0A0A] border border-white/5 rounded-sm p-4 space-y-3">
                            <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold">How Bidding Works</p>
                            <ul className="space-y-2 text-[11px] text-neutral-500 leading-relaxed">
                                <li className="flex gap-2"><span className="text-[#D4AF37] flex-shrink-0">·</span> 50% of your bid must be in your wallet</li>
                                <li className="flex gap-2"><span className="text-[#D4AF37] flex-shrink-0">·</span> Funds are blocked, not deducted</li>
                                <li className="flex gap-2"><span className="text-[#D4AF37] flex-shrink-0">·</span> A bid in the last 2 min resets the timer</li>
                                <li className="flex gap-2"><span className="text-[#D4AF37] flex-shrink-0">·</span> Winners have 48h to complete payment</li>
                            </ul>
                        </div>
                    </aside>

                    {/* ── Auction grid ─────────────────────────────────────────────── */}
                    <div className="flex-1 min-w-0">
                        {/* Result count + mobile sort */}
                        <div className="flex justify-between items-center mb-6">
                            <p className="text-xs text-neutral-500">
                                <span className="text-white">{filtered.length}</span> lot{filtered.length !== 1 ? 's' : ''}
                                {category !== 'All' ? ` in ${category}` : ''}
                            </p>
                            <select
                                value={sort}
                                onChange={e => setSort(e.target.value)}
                                className="md:hidden bg-[#0E0E0E] border border-white/10 text-neutral-300 text-xs px-3 py-2 focus:outline-none rounded-sm cursor-pointer"
                            >
                                {SORTS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>

                        {filtered.length === 0 ? (
                            <div className="py-24 text-center">
                                <IIcon icon="solar:box-minimalistic-linear" width="40" class="text-neutral-700 mx-auto block mb-4" />
                                <p className="text-neutral-500 text-sm">No auctions match your filters.</p>
                                <button
                                    onClick={() => { setCategory('All'); setStatus('All'); setMinPrice(''); setMaxPrice(''); }}
                                    className="mt-4 text-xs text-[#D4AF37] hover:underline"
                                >
                                    Clear filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                                {filtered.map(auction => (
                                    <AuctionCard
                                        key={auction.id}
                                        auction={auction}
                                        user={user}
                                        walletBalance={walletBalance}
                                    />
                                ))}
                            </div>
                        )}

                        {filtered.length > 0 && (
                            <div className="mt-16 text-center">
                                <button className="text-xs uppercase tracking-widest border-b border-transparent pb-1 hover:border-white transition-all text-neutral-500 hover:text-white">
                                    Load More Lots
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Footer ───────────────────────────────────────────────────────── */}
            <footer className="mt-24 py-8 border-t border-white/5 text-center">
                <p className="text-[10px] uppercase tracking-wider text-neutral-700">
                    © 2025 Wregals Inc. · All bids are binding and subject to our auction terms.
                </p>
            </footer>
        </div>
    );
}
