// @ts-nocheck
import { Link } from 'react-router-dom';
import IIcon from '../components/IIcon';
import Footer from '../components/Footer';

interface AboutPageProps {
    user: any;
    onSignInClick: () => void;
}

const TEAM = [
    {
        name: 'Tejas Wregals',
        role: 'Founder & Chairman',
        bio: 'Visionary behind India\'s first capital-backed digital auction house. 15 years in luxury asset management.',
        initials: 'TW',
    },
    {
        name: 'Mehak Sharma',
        role: 'Chief Auction Officer',
        bio: 'Former specialist at Christie\'s London. Expert in South Asian and European fine art.',
        initials: 'MS',
    },
    {
        name: 'Arjun Kapoor',
        role: 'Head of Risk & Compliance',
        bio: 'CFA. Designed the capital-backing mechanism ensuring every bid on the platform is financially credible.',
        initials: 'AK',
    },
    {
        name: 'Priya Nair',
        role: 'Director of Seller Relations',
        bio: 'Former private wealth advisor. Curates and onboards premium sellers across India and Southeast Asia.',
        initials: 'PN',
    },
];

const VALUES = [
    {
        icon: 'solar:shield-check-linear',
        title: 'Capital Integrity',
        desc: 'Every bid on WREGALS is financially backed. Our 50% wallet requirement ensures only serious, qualified buyers participate.',
    },
    {
        icon: 'solar:eye-linear',
        title: 'Radical Transparency',
        desc: 'Open ascending auctions mean all bids are visible. No shill bidding. No dark pools. Just honest price discovery.',
    },
    {
        icon: 'solar:star-linear',
        title: 'Curation Over Volume',
        desc: 'We list fewer lots, with more care. Every item on WREGALS is authenticated, documented, and worthy of a serious collector.',
    },
    {
        icon: 'solar:hand-shake-linear',
        title: 'Institutional Settlement',
        desc: 'Escrow-backed settlement, liquidated damages clauses, and KYC verification — built for transactions that matter.',
    },
];

const MILESTONES = [
    { year: '2022', label: 'Founded', desc: 'WREGALS incorporated in Mumbai as a premium digital auction platform.' },
    { year: '2023', label: 'First Auction', desc: 'Inaugural sale of a Patek Philippe collection grossed ₹4.2 Cr across 12 lots.' },
    { year: '2024', label: 'Capital-Backing Launch', desc: 'Introduced India\'s first mandatory 50% bid-backing rule on a digital platform.' },
    { year: '2025', label: 'Celebrity Partnerships', desc: 'Onboarded 40+ celebrity consignors. Platform GMV crossed ₹100 Cr.' },
    { year: '2026', label: 'National Expansion', desc: 'Now serving collectors and sellers pan-India with enhanced KYC and settlement.' },
];

export default function About({ user, onSignInClick }: AboutPageProps) {
    return (
        <div className="bg-[#0C0C0D] min-h-screen text-white">

            {/* ── HERO ──────────────────────────────────────────────────────────── */}
            <section className="pt-20 relative overflow-hidden">
                {/* Ambient glow */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-[#D4AF37]/4 blur-[120px]" />
                </div>

                <div className="max-w-7xl mx-auto px-6 py-24 md:py-36 relative">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-neutral-600 mb-8">
                        <Link to="/" className="hover:text-neutral-400 transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-[#D4AF37]">About</span>
                    </div>

                    <div className="max-w-3xl">
                        <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] mb-4 block">Est. 2022 · Mumbai, India</span>
                        <h1 className="text-4xl md:text-6xl font-light tracking-tight leading-tight mb-8">
                            Not a marketplace.<br />
                            <span className="text-neutral-500">A standard.</span>
                        </h1>
                        <p className="text-base md:text-lg text-neutral-400 leading-relaxed max-w-2xl">
                            WREGALS is India's first capital-backed digital auction house — built for collectors, estates,
                            and connoisseurs who expect more than a bid button. We bring institutional rigour to digital auctions:
                            financially verified bidders, transparent price discovery, and escrow-backed settlement.
                        </p>
                    </div>

                    {/* Stat strip */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 mt-16 border border-white/5">
                        {[
                            { label: 'GMV', value: '₹100 Cr+' },
                            { label: 'Lots Auctioned', value: '1,200+' },
                            { label: 'Verified Bidders', value: '8,400+' },
                            { label: 'Seller Partners', value: '400+' },
                        ].map(s => (
                            <div key={s.label} className="bg-[#3D0808] px-8 py-6">
                                <p className="font-mono text-2xl md:text-3xl text-white mb-1">{s.value}</p>
                                <p className="text-[10px] uppercase tracking-widest text-neutral-600">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── MISSION ───────────────────────────────────────────────────────── */}
            <section className="border-t border-white/5 py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] mb-4 block">Our Mission</span>
                            <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-6">
                                Only financially eligible bidders may participate.
                            </h2>
                            <p className="text-neutral-400 text-sm leading-relaxed mb-4">
                                The global auction market is plagued by phantom bids, unsettled sales, and price manipulation. WREGALS was built to fix that.
                            </p>
                            <p className="text-neutral-400 text-sm leading-relaxed">
                                By requiring every bidder to maintain 50% of their bid in their WREGALS wallet — and enforcing a strict
                                liquidated damages clause on default — we've created a marketplace where every bid is a credible commitment,
                                not a speculative gesture.
                            </p>
                        </div>
                        <div className="space-y-4">
                            {VALUES.map(v => (
                                <div key={v.title} className="flex gap-4 p-5 border border-white/5 bg-[#0C0C0C] hover:bg-[#111] hover:border-white/10 transition-all rounded-sm">
                                    <div className="flex-shrink-0 w-9 h-9 border border-white/10 rounded-sm flex items-center justify-center">
                                        <IIcon icon={v.icon} width="16" class="text-[#D4AF37]" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-white mb-1">{v.title}</h3>
                                        <p className="text-xs text-neutral-500 leading-relaxed">{v.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── TIMELINE ──────────────────────────────────────────────────────── */}
            <section className="border-t border-white/5 py-24 bg-[#0A0A0A]">
                <div className="max-w-7xl mx-auto px-6">
                    <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] mb-4 block">Our Story</span>
                    <h2 className="text-3xl font-light tracking-tight mb-16">How we got here</h2>

                    <div className="relative">
                        {/* Vertical line */}
                        <div className="absolute left-24 top-0 bottom-0 w-px bg-white/5 hidden md:block" />

                        <div className="space-y-10">
                            {MILESTONES.map((m, i) => (
                                <div key={m.year} className="flex flex-col md:flex-row gap-4 md:gap-12 items-start">
                                    <div className="md:w-24 flex-shrink-0 text-right hidden md:block">
                                        <span className="font-mono text-sm text-[#D4AF37]">{m.year}</span>
                                    </div>
                                    {/* Dot */}
                                    <div className="hidden md:flex flex-shrink-0 w-3 h-3 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 mt-1 relative z-10" />
                                    <div className="flex-1 pb-8 border-b border-white/5 last:border-0">
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="font-mono text-xs text-[#D4AF37] md:hidden">{m.year}</span>
                                            <h3 className="text-base font-medium text-white">{m.label}</h3>
                                        </div>
                                        <p className="text-sm text-neutral-500 leading-relaxed">{m.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── TEAM ──────────────────────────────────────────────────────────── */}
            <section className="border-t border-white/5 py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] mb-4 block">The Team</span>
                    <h2 className="text-3xl font-light tracking-tight mb-12">The people behind the gavel</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {TEAM.map(member => (
                            <div key={member.name} className="group border border-white/5 bg-[#0C0C0C] hover:bg-[#111] hover:border-white/10 transition-all rounded-sm p-6">
                                {/* Avatar */}
                                <div className="w-14 h-14 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 flex items-center justify-center mb-5">
                                    <span className="font-mono text-base text-[#D4AF37]">{member.initials}</span>
                                </div>
                                <h3 className="text-sm font-semibold text-white mb-0.5">{member.name}</h3>
                                <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] mb-3">{member.role}</p>
                                <p className="text-xs text-neutral-500 leading-relaxed">{member.bio}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CONTACT CTA ───────────────────────────────────────────────────── */}
            <section className="border-t border-white/5 py-24 bg-[#0A0A0A]">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-4">Want to sell with us?</h2>
                    <p className="text-neutral-500 text-sm max-w-md mx-auto mb-8">
                        We work with estates, private collectors, and celebrity consignors. Apply to list your assets on WREGALS.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="mailto:consign@wregals.com" className="px-8 py-3.5 bg-[#D4AF37] text-black text-xs uppercase tracking-widest font-semibold hover:bg-[#c49f2e] transition-colors">
                            Apply to Consign
                        </a>
                        <a href="mailto:hello@wregals.com" className="px-8 py-3.5 border border-white/15 text-neutral-300 text-xs uppercase tracking-widest hover:border-white hover:text-white transition-all">
                            General Enquiries
                        </a>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
