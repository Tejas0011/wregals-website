// @ts-nocheck
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

const ITEMS = [
    {
        id: 'g1',
        title: '1968 Rolex Daytona "Paul Newman"',
        category: 'Horology',
        hammer: '₹4.8 Cr',
        sale: 'Feb 2026',
        image: 'https://images.unsplash.com/photo-1617317376997-8748e6862c01?q=80&w=800&auto=format&fit=crop',
        span: 'col-span-1 row-span-2',
    },
    {
        id: 'g2',
        title: 'Basquiat "Untitled Head" (1982)',
        category: 'Fine Art',
        hammer: '₹9.2 Cr',
        sale: 'Jan 2026',
        image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?q=80&w=800&auto=format&fit=crop',
        span: 'col-span-2 row-span-1',
    },
    {
        id: 'g3',
        title: 'Bulgari Serpenti Diamond Necklace',
        category: 'Jewellery',
        hammer: '₹1.34 Cr',
        sale: 'Feb 2026',
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop',
        span: 'col-span-1 row-span-1',
    },
    {
        id: 'g4',
        title: '1963 Ferrari 250 GTO',
        category: 'Automobiles',
        hammer: '₹490 Cr',
        sale: 'Dec 2025',
        image: 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?q=80&w=800&auto=format&fit=crop',
        span: 'col-span-2 row-span-2',
    },
    {
        id: 'g5',
        title: 'Patek Philippe Nautilus 5711/1A',
        category: 'Horology',
        hammer: '₹1.12 Cr',
        sale: 'Jan 2026',
        image: 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?q=80&w=800&auto=format&fit=crop',
        span: 'col-span-1 row-span-1',
    },
    {
        id: 'g6',
        title: 'Andy Warhol "Marilyn Diptych"',
        category: 'Fine Art',
        hammer: '₹7.25 Cr',
        sale: 'Feb 2026',
        image: 'https://images.unsplash.com/photo-1580136579312-94651dfd596d?q=80&w=800&auto=format&fit=crop',
        span: 'col-span-1 row-span-2',
    },
    {
        id: 'g7',
        title: 'Natural Kashmir Sapphire Ring, 22ct',
        category: 'Jewellery',
        hammer: '₹2.8 Cr',
        sale: 'Nov 2025',
        image: 'https://images.unsplash.com/photo-1573408301185-9519f94f4505?q=80&w=800&auto=format&fit=crop',
        span: 'col-span-1 row-span-1',
    },
    {
        id: 'g8',
        title: 'Muhammad Ali Fight-Worn Gloves, 1974',
        category: 'Memorabilia',
        hammer: '₹68 L',
        sale: 'Oct 2025',
        image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=800&auto=format&fit=crop',
        span: 'col-span-1 row-span-1',
    },
    {
        id: 'g9',
        title: 'Richard Mille RM 27-03 Tourbillon',
        category: 'Horology',
        hammer: '₹19.4 Cr',
        sale: 'Sep 2025',
        image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=800&auto=format&fit=crop',
        span: 'col-span-2 row-span-1',
    },
    {
        id: 'g10',
        title: 'Shah Jahan\'s Personal Dagger (17th c.)',
        category: 'Historical Artefacts',
        hammer: '₹18.6 Cr',
        sale: 'Aug 2025',
        image: 'https://images.unsplash.com/photo-1605792657660-596af9009e82?q=80&w=800&auto=format&fit=crop',
        span: 'col-span-1 row-span-1',
    },
    {
        id: 'g11',
        title: 'Aston Martin DB5 (1964)',
        category: 'Automobiles',
        hammer: 'Unsold',
        sale: 'Feb 2026',
        image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=800&auto=format&fit=crop',
        span: 'col-span-1 row-span-2',
    },
    {
        id: 'g12',
        title: 'Lalique "Bacchantes" Vase (1927)',
        category: 'Decorative Arts',
        hammer: '₹1.45 Cr',
        sale: 'Feb 2026',
        image: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?q=80&w=800&auto=format&fit=crop',
        span: 'col-span-1 row-span-1',
    },
];

const CATS = ['All', 'Horology', 'Fine Art', 'Jewellery', 'Automobiles', 'Memorabilia', 'Historical Artefacts', 'Decorative Arts'];

interface GalleryProps { user: any; onSignInClick: () => void; }

export default function Gallery({ user, onSignInClick }: GalleryProps) {
    const [active, setActive] = useState('All');
    const [hovered, setHovered] = useState<string | null>(null);

    const filtered = useMemo(() =>
        active === 'All' ? ITEMS : ITEMS.filter(i => i.category === active),
        [active]);

    return (
        <div className="bg-[#080808] min-h-screen text-white">

            {/* Nav */}
            <nav className="fixed top-0 w-full z-50 bg-[#080808]/90 backdrop-blur-md border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link to="/"><img src="/wregals-logo-new.png" alt="WREGALS" className="h-12 w-auto object-contain" /></Link>
                    <div className="flex items-center gap-6 text-xs tracking-widest uppercase text-neutral-400">
                        <Link to="/" className="hover:text-white transition-colors">Home</Link>
                        <Link to="/auctions/live" className="hover:text-white transition-colors hidden md:block">Auctions</Link>
                        <span className="text-[#D4AF37]">Gallery</span>
                        {user ? (
                            <span className="text-neutral-300 hidden md:block">{user.email?.split('@')[0]}</span>
                        ) : (
                            <button onClick={onSignInClick} className="border px-4 py-1.5 rounded-sm border-white/20 hover:bg-white hover:text-black transition-all">Sign In</button>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="pt-16 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-[#D4AF37]/4 blur-[100px] pointer-events-none" />
                <div className="max-w-7xl mx-auto px-6 py-20 relative">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-neutral-600 mb-8">
                        <Link to="/" className="hover:text-neutral-400 transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-[#D4AF37]">Gallery</span>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] mb-3 block">Past Sales</span>
                            <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-3">The Archive</h1>
                            <p className="text-neutral-500 text-sm max-w-lg">
                                A curated record of exceptional lots that have passed through WREGALS — watches, art, automobiles, jewellery, and artefacts of historic significance.
                            </p>
                        </div>
                        {/* Category filter */}
                        <div className="flex flex-wrap gap-2">
                            {CATS.map(c => (
                                <button key={c} onClick={() => setActive(c)}
                                    className={`text-[10px] uppercase tracking-widest px-3 py-1.5 border rounded-sm transition-all whitespace-nowrap ${active === c
                                            ? 'border-[#D4AF37] text-[#D4AF37]'
                                            : 'border-white/10 text-neutral-500 hover:border-white/30 hover:text-white'
                                        }`}>
                                    {c}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Gallery Grid */}
            <section className="border-t border-white/5 pb-24">
                <div className="max-w-7xl mx-auto px-6">
                    <p className="text-xs text-neutral-600 py-6">
                        <span className="text-white">{filtered.length}</span> items
                    </p>

                    {filtered.length === 0 ? (
                        <div className="py-32 text-center">
                            <p className="text-neutral-500 text-sm">No items in this category.</p>
                            <button onClick={() => setActive('All')} className="mt-4 text-xs text-[#D4AF37] hover:underline underline-offset-2">
                                Show all
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filtered.map(item => (
                                <div
                                    key={item.id}
                                    onMouseEnter={() => setHovered(item.id)}
                                    onMouseLeave={() => setHovered(null)}
                                    className="group relative overflow-hidden rounded-sm bg-[#111] aspect-[4/5] cursor-pointer">

                                    {/* Image */}
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale-[20%] group-hover:grayscale-0"
                                    />

                                    {/* Gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                                    {/* Category badge */}
                                    <div className="absolute top-3 left-3 backdrop-blur-sm bg-black/60 border border-white/10 rounded-sm px-2.5 py-1.5">
                                        <span className="text-[9px] uppercase tracking-widest text-neutral-400">{item.category}</span>
                                    </div>

                                    {/* Hammer badge */}
                                    <div className={`absolute top-3 right-3 backdrop-blur-sm border rounded-sm px-2.5 py-1.5 transition-all ${item.hammer === 'Unsold'
                                            ? 'bg-red-500/10 border-red-500/20'
                                            : 'bg-[#D4AF37]/10 border-[#D4AF37]/20'
                                        }`}>
                                        <span className={`text-[9px] uppercase tracking-widest font-mono ${item.hammer === 'Unsold' ? 'text-red-400' : 'text-[#D4AF37]'
                                            }`}>{item.hammer}</span>
                                    </div>

                                    {/* Info footer */}
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <h3 className="text-sm font-medium text-white leading-snug mb-1 group-hover:text-[#D4AF37] transition-colors">
                                            {item.title}
                                        </h3>
                                        <p className="text-[10px] uppercase tracking-widest text-neutral-500">{item.sale}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA */}
            <section className="border-t border-white/5 py-20 bg-[#0A0A0A]">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-2xl font-light tracking-tight mb-3">Your item could be next.</h2>
                    <p className="text-neutral-500 text-sm max-w-sm mx-auto mb-8">
                        We accept exceptional items across all categories. Apply to consign today.
                    </p>
                    <a href="mailto:consign@wregals.com"
                        className="inline-block px-8 py-3.5 bg-[#D4AF37] text-black text-xs uppercase tracking-widest font-semibold hover:bg-[#c49f2e] transition-colors">
                        Apply to Consign
                    </a>
                </div>
            </section>

            <footer className="py-8 border-t border-white/5 text-center">
                <p className="text-[10px] uppercase tracking-wider text-neutral-700">© 2025 Wregals Inc. · All Rights Reserved.</p>
            </footer>
        </div>
    );
}
