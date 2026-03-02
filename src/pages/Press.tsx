// @ts-nocheck
import { Link } from 'react-router-dom';

const COVERAGE = [
    {
        outlet: 'The Economic Times',
        logo: 'ET',
        headline: '"WREGALS is building the Christie\'s of India — and doing it digitally first."',
        date: 'Feb 2026',
        url: '#',
    },
    {
        outlet: 'Mint Lounge',
        logo: 'ML',
        headline: '"The capital-backed bidding model solves a problem that has plagued online auctions for decades."',
        date: 'Jan 2026',
        url: '#',
    },
    {
        outlet: 'Forbes India',
        logo: 'FI',
        headline: '"From Rolexes to Rajput artefacts — WREGALS is redefining India\'s luxury resale market."',
        date: 'Dec 2025',
        url: '#',
    },
    {
        outlet: 'Business Standard',
        logo: 'BS',
        headline: '"The platform\'s strict KYC and escrow mechanism sets a new standard for digital auction credibility."',
        date: 'Nov 2025',
        url: '#',
    },
    {
        outlet: 'Vogue India',
        logo: 'VI',
        headline: '"Celebrity estates are quietly turning to WREGALS to sell their most personal possessions."',
        date: 'Oct 2025',
        url: '#',
    },
    {
        outlet: 'TechCrunch India',
        logo: 'TC',
        headline: '"WREGALS\' real-time bidding engine with anti-sniping protection is a technical marvel."',
        date: 'Sep 2025',
        url: '#',
    },
];

const ASSETS = [
    { label: 'Brand Logo (SVG)', icon: 'solar:code-square-linear', size: '42 KB' },
    { label: 'Brand Logo (PNG, White)', icon: 'solar:image-linear', size: '180 KB' },
    { label: 'Brand Logo (PNG, Dark)', icon: 'solar:image-linear', size: '180 KB' },
    { label: 'Brand Guidelines PDF', icon: 'solar:document-linear', size: '2.1 MB' },
    { label: 'Founder Headshots', icon: 'solar:user-circle-linear', size: '4.8 MB' },
    { label: 'Product Screenshots', icon: 'solar:gallery-wide-linear', size: '12 MB' },
];

const FACTS = [
    { stat: '2022', label: 'Founded' },
    { stat: '₹100 Cr+', label: 'Platform GMV (2025)' },
    { stat: '1,200+', label: 'Lots Auctioned' },
    { stat: '8,400+', label: 'Verified Bidders' },
    { stat: '400+', label: 'Seller Partners' },
    { stat: '99.1%', label: 'Settlement Rate' },
];

interface PressProps { user: any; onSignInClick: () => void; }

export default function Press({ user, onSignInClick }: PressProps) {
    return (
        <div className="bg-[#080808] min-h-screen text-white">

            {/* Nav */}
            <nav className="fixed top-0 w-full z-50 bg-[#080808]/90 backdrop-blur-md border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link to="/"><img src="/wregals-logo-new.png" alt="WREGALS" className="h-12 w-auto object-contain" /></Link>
                    <div className="flex items-center gap-6 text-xs tracking-widest uppercase text-neutral-400">
                        <Link to="/about" className="hover:text-white transition-colors hidden md:block">Company</Link>
                        <span className="text-[#D4AF37]">Press</span>
                        {user ? <span className="text-neutral-300 hidden md:block">{user.email?.split('@')[0]}</span>
                            : <button onClick={onSignInClick} className="border px-4 py-1.5 rounded-sm border-white/20 hover:bg-white hover:text-black transition-all">Sign In</button>}
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="pt-16 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-[#D4AF37]/4 blur-[100px] pointer-events-none" />
                <div className="max-w-7xl mx-auto px-6 py-24 relative">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-neutral-600 mb-8">
                        <Link to="/" className="hover:text-neutral-400 transition-colors">Home</Link>
                        <span>/</span>
                        <Link to="/about" className="hover:text-neutral-400 transition-colors">Company</Link>
                        <span>/</span>
                        <span className="text-[#D4AF37]">Press</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-6">Press & Media</h1>
                    <p className="text-neutral-400 text-base max-w-xl leading-relaxed mb-8">
                        For media enquiries, interview requests, or brand asset downloads, reach us at{' '}
                        <a href="mailto:press@wregals.com" className="text-[#D4AF37] hover:underline underline-offset-2">press@wregals.com</a>.
                        We aim to respond within one business day.
                    </p>
                    <a href="mailto:press@wregals.com"
                        className="inline-flex items-center gap-2 text-xs uppercase tracking-widest px-6 py-3 border border-white/20 hover:border-white text-neutral-300 hover:text-white transition-all">
                        <iconify-icon icon="solar:letter-linear" width="14" />
                        Contact Press Team
                    </a>
                </div>
            </section>

            {/* Facts */}
            <section className="border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <h2 className="text-[10px] uppercase tracking-widest text-neutral-500 mb-6">Key Facts</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-white/5 border border-white/5">
                        {FACTS.map(f => (
                            <div key={f.label} className="bg-[#080808] px-5 py-5 text-center">
                                <p className="font-mono text-xl text-white mb-1">{f.stat}</p>
                                <p className="text-[9px] uppercase tracking-widest text-neutral-600">{f.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Coverage */}
            <section className="border-t border-white/5 py-16 bg-[#0A0A0A]">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-xl font-light tracking-tight text-neutral-300 mb-10">In The Press</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {COVERAGE.map(item => (
                            <a key={item.outlet} href={item.url}
                                className="group flex gap-5 p-6 border border-white/5 bg-[#0C0C0C] hover:bg-[#111] hover:border-white/10 transition-all rounded-sm">
                                {/* Outlet logo placeholder */}
                                <div className="flex-shrink-0 w-12 h-12 rounded-sm border border-white/10 bg-[#0E0E0E] flex items-center justify-center">
                                    <span className="font-mono text-[10px] text-neutral-400">{item.logo}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <p className="text-xs font-semibold text-[#D4AF37] uppercase tracking-widest">{item.outlet}</p>
                                        <span className="text-[10px] text-neutral-600 flex-shrink-0">{item.date}</span>
                                    </div>
                                    <p className="text-sm text-neutral-300 leading-relaxed italic group-hover:text-white transition-colors">{item.headline}</p>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* Brand Assets */}
            <section className="border-t border-white/5 py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                        <div>
                            <h2 className="text-xl font-light tracking-tight text-neutral-300">Brand Assets</h2>
                            <p className="text-xs text-neutral-500 mt-1">For editorial and news use only. Please read our brand guidelines before using.</p>
                        </div>
                        <a href="mailto:press@wregals.com?subject=Brand Assets Request"
                            className="text-xs uppercase tracking-widest text-[#D4AF37] hover:underline underline-offset-2 whitespace-nowrap">
                            Request full press kit →
                        </a>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {ASSETS.map(a => (
                            <div key={a.label}
                                className="flex items-center gap-4 p-4 border border-white/5 bg-[#0C0C0C] hover:bg-[#111] hover:border-white/10 transition-all rounded-sm cursor-pointer group">
                                <iconify-icon icon={a.icon} width="18" class="text-neutral-500 group-hover:text-[#D4AF37] transition-colors flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-neutral-300 group-hover:text-white transition-colors">{a.label}</p>
                                    <p className="text-[10px] text-neutral-600">{a.size}</p>
                                </div>
                                <iconify-icon icon="solar:download-linear" width="14" class="text-neutral-600 group-hover:text-white transition-colors flex-shrink-0" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <footer className="py-8 border-t border-white/5 text-center">
                <p className="text-[10px] uppercase tracking-wider text-neutral-700">© 2025 Wregals Inc. · All Rights Reserved.</p>
            </footer>
        </div>
    );
}
