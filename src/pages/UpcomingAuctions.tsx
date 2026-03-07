// @ts-nocheck
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import CountdownTimer from '../components/CountdownTimer';
import IIcon from '../components/IIcon';

const now = Date.now();
const days = (n: number) => new Date(now + n * 24 * 60 * 60 * 1000);
const hrs = (n: number) => new Date(now + n * 60 * 60 * 1000);

interface UpcomingLot {
    id: string;
    title: string;
    lot: string;
    provenance: string;
    category: string;
    image: string;
    estimateLow: number;
    estimateHigh: number;
    startingBid: number;
    opensAt: Date;
    interested: number; // number of users who registered interest
}

const UPCOMING: UpcomingLot[] = [
    {
        id: 'u1',
        title: 'Jean-Michel Basquiat "Untitled Head" (1982)',
        lot: '#1050',
        provenance: 'Private Swiss Collection',
        category: 'Fine Art',
        image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?q=80&w=2058&auto=format&fit=crop',
        estimateLow: 8000000,
        estimateHigh: 12000000,
        startingBid: 5000000,
        opensAt: hrs(52),
        interested: 47,
    },
    {
        id: 'u2',
        title: '1963 Ferrari 250 GTO',
        lot: '#1051',
        provenance: 'Single Private Owner, Maranello',
        category: 'Automobiles',
        image: 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?q=80&w=2070&auto=format&fit=crop',
        estimateLow: 500000000,
        estimateHigh: 700000000,
        startingBid: 400000000,
        opensAt: days(4),
        interested: 213,
    },
    {
        id: 'u3',
        title: "Shah Jahan's Personal Dagger (17th c.)",
        lot: '#1052',
        provenance: 'Royal Mughal Era — Sotheby\'s 2001',
        category: 'Historical Artefacts',
        image: 'https://images.unsplash.com/photo-1605792657660-596af9009e82?q=80&w=2002&auto=format&fit=crop',
        estimateLow: 15000000,
        estimateHigh: 22000000,
        startingBid: 10000000,
        opensAt: days(6),
        interested: 89,
    },
    {
        id: 'u4',
        title: 'Natural Kashmir Sapphire Ring, 22ct',
        lot: '#1053',
        provenance: 'Private London Jeweller, est. 1894',
        category: 'Jewellery',
        image: 'https://images.unsplash.com/photo-1573408301185-9519f94f4505?q=80&w=2069&auto=format&fit=crop',
        estimateLow: 25000000,
        estimateHigh: 35000000,
        startingBid: 20000000,
        opensAt: days(9),
        interested: 61,
    },
    {
        id: 'u5',
        title: "Freddie Mercury's Stage Piano, 1986 Magic Tour",
        lot: '#1054',
        provenance: 'Mercury Estate, London — Authenticated',
        category: 'Memorabilia',
        image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=2070&auto=format&fit=crop',
        estimateLow: 30000000,
        estimateHigh: 50000000,
        startingBid: 20000000,
        opensAt: days(14),
        interested: 178,
    },
    {
        id: 'u6',
        title: 'Richard Mille RM 27-03 Tourbillon Rafael Nadal',
        lot: '#1055',
        provenance: 'New Old Stock, Sealed',
        category: 'Horology',
        image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=2080&auto=format&fit=crop',
        estimateLow: 18000000,
        estimateHigh: 24000000,
        startingBid: 15000000,
        opensAt: days(18),
        interested: 94,
    },
];

const CATEGORIES = ['All', 'Fine Art', 'Automobiles', 'Jewellery', 'Horology', 'Memorabilia', 'Historical Artefacts'];
const SORTS = ['Opening Soonest', 'Opening Latest', 'Highest Estimate', 'Most Interest'];
const fmt = (n: number) => '₹' + n.toLocaleString('en-IN');

interface UpcomingAuctionsProps {
    user: any;
    onSignInClick: () => void;
}

export default function UpcomingAuctions({ user, onSignInClick }: UpcomingAuctionsProps) {
    const [category, setCategory] = useState('All');
    const [sort, setSort] = useState('Opening Soonest');
    const [reminded, setReminded] = useState<Set<string>>(new Set());

    const filtered = useMemo(() => {
        let list = [...UPCOMING];
        if (category !== 'All') list = list.filter(a => a.category === category);
        if (sort === 'Opening Soonest') list.sort((a, b) => a.opensAt.getTime() - b.opensAt.getTime());
        if (sort === 'Opening Latest') list.sort((a, b) => b.opensAt.getTime() - a.opensAt.getTime());
        if (sort === 'Highest Estimate') list.sort((a, b) => b.estimateHigh - a.estimateHigh);
        if (sort === 'Most Interest') list.sort((a, b) => b.interested - a.interested);
        return list;
    }, [category, sort]);

    const toggleReminder = (id: string) => {
        setReminded(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    return (
        <div className="bg-[#080808] min-h-screen text-white">

            {/* Nav */}
            <nav className="fixed top-0 w-full z-50 bg-[#080808]/90 backdrop-blur-md border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link to="/"><img src="/wregals-logo-new.png" alt="WREGALS" className="h-12 w-auto object-contain" /></Link>
                    <div className="flex items-center gap-6 text-xs tracking-widest uppercase text-neutral-400">
                        <Link to="/" className="hover:text-white transition-colors">Home</Link>
                        <Link to="/auctions/live" className="hover:text-white transition-colors hidden md:block">Live</Link>
                        <span className="text-[#D4AF37]">Upcoming</span>
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
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-neutral-600 mb-3">
                                <Link to="/" className="hover:text-neutral-400 transition-colors">Home</Link>
                                <span>/</span>
                                <span className="text-neutral-400">Auctions</span>
                                <span>/</span>
                                <span className="text-[#D4AF37]">Upcoming</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-light tracking-tight">Upcoming Auctions</h1>
                            <p className="text-neutral-500 text-sm mt-2">
                                Preview future lots · Register interest · Set reminders
                            </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                            <span className="text-neutral-500 uppercase tracking-widest">Sort:</span>
                            <select
                                value={sort}
                                onChange={e => setSort(e.target.value)}
                                className="bg-[#0E0E0E] border border-white/10 text-neutral-300 text-xs px-3 py-2 focus:outline-none rounded-sm cursor-pointer"
                            >
                                {SORTS.map(s => <option key={s}>{s}</option>)}
                            </select>
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

                    {/* Notice */}
                    <div className="pt-6 border-t border-white/5 bg-[#0A0A0A] border border-white/5 rounded-sm p-4 space-y-3">
                        <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold">Pre-Auction</p>
                        <ul className="space-y-2 text-[11px] text-neutral-500 leading-relaxed">
                            <li className="flex gap-2"><span className="text-[#D4AF37] flex-shrink-0">·</span> Set a reminder to be notified when bidding opens</li>
                            <li className="flex gap-2"><span className="text-[#D4AF37] flex-shrink-0">·</span> Top up your wallet before the lot opens</li>
                            <li className="flex gap-2"><span className="text-[#D4AF37] flex-shrink-0">·</span> Estimates are subject to change</li>
                        </ul>
                    </div>
                </aside>

                {/* Grid */}
                <div className="flex-1 min-w-0">
                    <p className="text-xs text-neutral-500 mb-6"><span className="text-white">{filtered.length}</span> upcoming lots</p>

                    {filtered.length === 0 ? (
                        <div className="py-24 text-center">
                            <p className="text-neutral-500 text-sm">No upcoming lots in this category.</p>
                            <button onClick={() => setCategory('All')} className="mt-4 text-xs text-[#D4AF37] hover:underline">Clear filter</button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                            {filtered.map(lot => {
                                const isReminded = reminded.has(lot.id);
                                return (
                                    <article key={lot.id} className="group flex flex-col">
                                        {/* Image */}
                                        <div className="relative aspect-[3/4] overflow-hidden bg-[#111] rounded-sm mb-5">
                                            <img src={lot.image} alt={lot.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale-[30%]" />

                                            {/* Upcoming badge */}
                                            <div className="absolute top-3 left-3 flex items-center gap-1.5 backdrop-blur-sm bg-black/60 border border-white/10 rounded-sm px-2.5 py-1.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 flex-shrink-0" />
                                                <span className="text-[10px] uppercase tracking-widest text-sky-400">Upcoming</span>
                                            </div>

                                            <div className="absolute top-3 right-3 backdrop-blur-sm bg-black/60 border border-white/10 rounded-sm px-2.5 py-1.5">
                                                <span className="text-[9px] uppercase tracking-widest text-neutral-400">Lot {lot.lot}</span>
                                            </div>

                                            {/* Interest badge */}
                                            <div className="absolute bottom-3 right-3 backdrop-blur-sm bg-black/60 border border-white/10 rounded-sm px-2.5 py-1.5 flex items-center gap-1.5">
                                                <IIcon icon="solar:heart-linear" width="11" class="text-rose-400" />
                                                <span className="text-[10px] text-neutral-300">{lot.interested}</span>
                                            </div>
                                        </div>

                                        {/* Info */}
                                        <div className="space-y-1 flex-1 flex flex-col">
                                            <p className="text-[10px] uppercase tracking-widest text-neutral-500">{lot.category}</p>
                                            <h3 className="text-lg tracking-tight leading-snug text-white group-hover:text-[#D4AF37] transition-colors flex-1">{lot.title}</h3>
                                            <p className="text-xs text-neutral-500">{lot.provenance}</p>

                                            {/* Estimate */}
                                            <div className="pt-3 border-t border-white/5 mt-3">
                                                <p className="text-[10px] uppercase tracking-widest text-neutral-600 mb-1">Estimate</p>
                                                <p className="font-mono text-sm text-neutral-300">{fmt(lot.estimateLow)} – {fmt(lot.estimateHigh)}</p>
                                                <p className="text-[10px] text-neutral-600 mt-1">Starting bid: <span className="text-neutral-400 font-mono">{fmt(lot.startingBid)}</span></p>
                                            </div>

                                            {/* Opens in */}
                                            <div className="flex justify-between items-end pt-3">
                                                <div>
                                                    <p className="text-[10px] uppercase tracking-widest text-neutral-600 mb-1">Opens In</p>
                                                    <CountdownTimer endsAt={lot.opensAt} />
                                                </div>
                                                <button
                                                    onClick={() => toggleReminder(lot.id)}
                                                    className={`flex items-center gap-1.5 text-[10px] uppercase tracking-widest px-3 py-2 border rounded-sm transition-all ${isReminded
                                                        ? 'border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/5'
                                                        : 'border-white/10 text-neutral-500 hover:border-white/30 hover:text-white'
                                                        }`}
                                                >
                                                    <IIcon icon={isReminded ? 'solar:bell-bing-linear' : 'solar:bell-linear'} width="12" />
                                                    {isReminded ? 'Reminded' : 'Remind Me'}
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            <footer className="mt-24 py-8 border-t border-white/5 text-center">
                <p className="text-[10px] uppercase tracking-wider text-neutral-700">© 2025 Wregals Inc. · Estimates are not guarantees of final sale price.</p>
            </footer>
        </div>
    );
}
