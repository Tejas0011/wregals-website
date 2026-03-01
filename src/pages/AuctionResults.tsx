// @ts-nocheck
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

interface ResultLot {
    id: string;
    title: string;
    lot: string;
    provenance: string;
    category: string;
    image: string;
    estimateLow: number;
    estimateHigh: number;
    finalPrice: number | null; // null = unsold
    bidCount: number;
    soldDate: string;
    soldAboveEstimate: boolean;
}

const RESULTS: ResultLot[] = [
    {
        id: 'r1',
        title: 'Andy Warhol "Marilyn Diptych" (Lithograph)',
        lot: '#0991',
        provenance: 'Private New York Collection',
        category: 'Fine Art',
        image: 'https://images.unsplash.com/photo-1580136579312-94651dfd596d?q=80&w=2070&auto=format&fit=crop',
        estimateLow: 4000000,
        estimateHigh: 6000000,
        finalPrice: 7250000,
        bidCount: 34,
        soldDate: '28 Feb 2026',
        soldAboveEstimate: true,
    },
    {
        id: 'r2',
        title: 'Rolex Submariner ref. 5513 "Meters First" (1967)',
        lot: '#0992',
        provenance: 'Single Japanese Private Owner',
        category: 'Horology',
        image: 'https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?q=80&w=2070&auto=format&fit=crop',
        estimateLow: 900000,
        estimateHigh: 1200000,
        finalPrice: 1050000,
        bidCount: 19,
        soldDate: '27 Feb 2026',
        soldAboveEstimate: false,
    },
    {
        id: 'r3',
        title: 'Aston Martin DB5 (1964) — James Bond Heritage',
        lot: '#0993',
        provenance: 'EON Productions Archive',
        category: 'Automobiles',
        image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=2070&auto=format&fit=crop',
        estimateLow: 60000000,
        estimateHigh: 80000000,
        finalPrice: null, // unsold — reserve not met
        bidCount: 7,
        soldDate: '25 Feb 2026',
        soldAboveEstimate: false,
    },
    {
        id: 'r4',
        title: 'Bulgari Serpenti Diamond Necklace',
        lot: '#0994',
        provenance: 'European Royal Estate',
        category: 'Jewellery',
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2070&auto=format&fit=crop',
        estimateLow: 8000000,
        estimateHigh: 11000000,
        finalPrice: 13400000,
        bidCount: 28,
        soldDate: '24 Feb 2026',
        soldAboveEstimate: true,
    },
    {
        id: 'r5',
        title: 'Michael Jordan Game-Worn Sneakers, 1992 Finals',
        lot: '#0995',
        provenance: 'Memorabilia Direct, Chicago',
        category: 'Memorabilia',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop',
        estimateLow: 3500000,
        estimateHigh: 5000000,
        finalPrice: 5800000,
        bidCount: 41,
        soldDate: '22 Feb 2026',
        soldAboveEstimate: true,
    },
    {
        id: 'r6',
        title: 'Lalique "Bacchantes" Rare Opalescent Vase (1927)',
        lot: '#0996',
        provenance: 'Parisian Dealer Collection',
        category: 'Decorative Arts',
        image: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?q=80&w=2070&auto=format&fit=crop',
        estimateLow: 1200000,
        estimateHigh: 1800000,
        finalPrice: 1450000,
        bidCount: 11,
        soldDate: '20 Feb 2026',
        soldAboveEstimate: false,
    },
];

const CATEGORIES = ['All', 'Fine Art', 'Horology', 'Automobiles', 'Jewellery', 'Memorabilia', 'Decorative Arts'];
const OUTCOMES = ['All', 'Sold', 'Not Sold', 'Above Estimate'];
const SORTS = ['Most Recent', 'Highest Price', 'Most Bids'];
const fmt = (n: number) => '₹' + n.toLocaleString('en-IN');

interface AuctionResultsProps {
    user: any;
    onSignInClick: () => void;
}

export default function AuctionResults({ user, onSignInClick }: AuctionResultsProps) {
    const [category, setCategory] = useState('All');
    const [outcome, setOutcome] = useState('All');
    const [sort, setSort] = useState('Most Recent');

    const filtered = useMemo(() => {
        let list = [...RESULTS];
        if (category !== 'All') list = list.filter(r => r.category === category);
        if (outcome === 'Sold') list = list.filter(r => r.finalPrice !== null);
        if (outcome === 'Not Sold') list = list.filter(r => r.finalPrice === null);
        if (outcome === 'Above Estimate') list = list.filter(r => r.soldAboveEstimate);
        if (sort === 'Highest Price') list.sort((a, b) => (b.finalPrice ?? 0) - (a.finalPrice ?? 0));
        if (sort === 'Most Bids') list.sort((a, b) => b.bidCount - a.bidCount);
        return list;
    }, [category, outcome, sort]);

    const totalSold = RESULTS.filter(r => r.finalPrice !== null).length;
    const totalValue = RESULTS.reduce((s, r) => s + (r.finalPrice ?? 0), 0);

    return (
        <div className="bg-[#080808] min-h-screen text-white">

            {/* Nav */}
            <nav className="fixed top-0 w-full z-50 bg-[#080808]/90 backdrop-blur-md border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link to="/"><img src="/wregals-logo-new.png" alt="WREGALS" className="h-12 w-auto object-contain" /></Link>
                    <div className="flex items-center gap-6 text-xs tracking-widest uppercase text-neutral-400">
                        <Link to="/" className="hover:text-white transition-colors hidden md:block">Home</Link>
                        <Link to="/auctions/live" className="hover:text-white transition-colors hidden md:block">Live</Link>
                        <span className="text-[#D4AF37]">Results</span>
                        {user ? (
                            <span className="text-neutral-300 hidden md:block">{user.email?.split('@')[0]}</span>
                        ) : (
                            <button onClick={onSignInClick} className="border px-4 py-1.5 rounded-sm border-white/20 hover:bg-white hover:text-black transition-all">Sign In</button>
                        )}
                    </div>
                </div>
            </nav>

            {/* Header */}
            <div className="pt-16">
                <div className="max-w-7xl mx-auto px-6 py-12 border-b border-white/5">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-neutral-600 mb-3">
                                <Link to="/" className="hover:text-neutral-400 transition-colors">Home</Link>
                                <span>/</span>
                                <span className="text-neutral-400">Auctions</span>
                                <span>/</span>
                                <span className="text-[#D4AF37]">Results</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-light tracking-tight">Auction Results</h1>
                            <p className="text-neutral-500 text-sm mt-2">Closed lots, final hammer prices, and sale outcomes</p>
                        </div>

                        {/* Summary stats */}
                        <div className="flex gap-8">
                            <div className="text-right">
                                <p className="text-[10px] uppercase tracking-widest text-neutral-600 mb-1">Lots Sold</p>
                                <p className="font-mono text-2xl text-white">{totalSold}<span className="text-neutral-600 text-sm">/{RESULTS.length}</span></p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] uppercase tracking-widest text-neutral-600 mb-1">Total Value</p>
                                <p className="font-mono text-2xl text-[#D4AF37]">{fmt(totalValue)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="max-w-7xl mx-auto px-6 py-10 flex gap-10">

                {/* Sidebar */}
                <aside className="hidden md:block w-56 flex-shrink-0 space-y-8">
                    <div>
                        <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold mb-3">Category</p>
                        <div className="space-y-1.5">
                            {CATEGORIES.map(c => (
                                <button key={c} onClick={() => setCategory(c)}
                                    className={`w-full text-left text-sm px-3 py-2 rounded-sm transition-all ${category === c ? 'bg-white/5 text-[#D4AF37] border-l-2 border-[#D4AF37]' : 'text-neutral-400 hover:text-white'}`}>
                                    {c}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-6 border-t border-white/5">
                        <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold mb-3">Outcome</p>
                        <div className="space-y-1.5">
                            {OUTCOMES.map(o => (
                                <button key={o} onClick={() => setOutcome(o)}
                                    className={`w-full text-left text-sm px-3 py-2 rounded-sm transition-all ${outcome === o ? 'bg-white/5 text-[#D4AF37] border-l-2 border-[#D4AF37]' : 'text-neutral-400 hover:text-white'}`}>
                                    {o}
                                </button>
                            ))}
                        </div>
                    </div>

                    {(category !== 'All' || outcome !== 'All') && (
                        <button onClick={() => { setCategory('All'); setOutcome('All'); }}
                            className="text-xs text-neutral-500 hover:text-white transition-colors underline underline-offset-2">
                            Clear filters
                        </button>
                    )}
                </aside>

                {/* Results list */}
                <div className="flex-1 min-w-0">
                    {/* Top bar */}
                    <div className="flex justify-between items-center mb-8">
                        <p className="text-xs text-neutral-500"><span className="text-white">{filtered.length}</span> results</p>
                        <select value={sort} onChange={e => setSort(e.target.value)}
                            className="bg-[#0E0E0E] border border-white/10 text-neutral-300 text-xs px-3 py-2 focus:outline-none rounded-sm cursor-pointer">
                            {SORTS.map(s => <option key={s}>{s}</option>)}
                        </select>
                    </div>

                    {filtered.length === 0 ? (
                        <div className="py-24 text-center">
                            <p className="text-neutral-500 text-sm">No results match your filters.</p>
                            <button onClick={() => { setCategory('All'); setOutcome('All'); }} className="mt-4 text-xs text-[#D4AF37] hover:underline">Clear filters</button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filtered.map(lot => {
                                const sold = lot.finalPrice !== null;
                                const aboveEst = lot.soldAboveEstimate;
                                const ratio = sold ? ((lot.finalPrice! / lot.estimateHigh) * 100).toFixed(0) : null;

                                return (
                                    <div key={lot.id} className="flex flex-col md:flex-row gap-5 p-5 border border-white/5 bg-[#0C0C0C] hover:bg-[#111] hover:border-white/10 transition-all rounded-sm">

                                        {/* Image */}
                                        <div className="w-full md:w-28 h-28 flex-shrink-0 overflow-hidden rounded-sm bg-[#1a1a1a]">
                                            <img src={lot.image} alt={lot.title}
                                                className={`w-full h-full object-cover transition-all duration-500 ${!sold ? 'grayscale opacity-50' : 'grayscale-[20%] opacity-90 group-hover:grayscale-0'}`} />
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                <span className="text-[9px] uppercase tracking-widest border border-white/10 text-neutral-400 px-2 py-0.5 rounded-sm">{lot.category}</span>
                                                {sold ? (
                                                    <>
                                                        <span className="text-[9px] uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-sm">Sold</span>
                                                        {aboveEst && <span className="text-[9px] uppercase tracking-widest bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 px-2 py-0.5 rounded-sm">Above Estimate</span>}
                                                    </>
                                                ) : (
                                                    <span className="text-[9px] uppercase tracking-widest bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-sm">Reserve Not Met</span>
                                                )}
                                            </div>
                                            <h3 className="text-base font-normal text-white leading-snug mb-0.5">{lot.title}</h3>
                                            <p className="text-xs text-neutral-500 mb-3">{lot.provenance} · Lot {lot.lot}</p>

                                            <div className="flex flex-wrap gap-6 text-xs">
                                                <div>
                                                    <p className="text-[9px] uppercase tracking-widest text-neutral-600 mb-1">Estimate</p>
                                                    <p className="font-mono text-neutral-400">{fmt(lot.estimateLow)} – {fmt(lot.estimateHigh)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[9px] uppercase tracking-widest text-neutral-600 mb-1">Hammer Price</p>
                                                    {sold
                                                        ? <p className={`font-mono font-medium ${aboveEst ? 'text-[#D4AF37]' : 'text-white'}`}>{fmt(lot.finalPrice!)}</p>
                                                        : <p className="font-mono text-neutral-600">—</p>
                                                    }
                                                </div>
                                                {ratio && (
                                                    <div>
                                                        <p className="text-[9px] uppercase tracking-widest text-neutral-600 mb-1">vs High Est.</p>
                                                        <p className={`font-mono ${Number(ratio) >= 100 ? 'text-emerald-400' : 'text-neutral-400'}`}>{ratio}%</p>
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="text-[9px] uppercase tracking-widest text-neutral-600 mb-1">Bids</p>
                                                    <p className="font-mono text-neutral-400">{lot.bidCount}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[9px] uppercase tracking-widest text-neutral-600 mb-1">Sale Date</p>
                                                    <p className="text-neutral-400">{lot.soldDate}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            <footer className="mt-24 py-8 border-t border-white/5 text-center">
                <p className="text-[10px] uppercase tracking-wider text-neutral-700">© 2025 Wregals Inc. · Hammer prices shown are final bid values inclusive of buyer premium.</p>
            </footer>
        </div>
    );
}
