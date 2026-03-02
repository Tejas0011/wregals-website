// @ts-nocheck
import { useState } from 'react';
import { Link } from 'react-router-dom';

const ROLES = [
    {
        id: 1,
        title: 'Senior Auction Specialist — Fine Art & Jewellery',
        dept: 'Auctions',
        location: 'Mumbai, India',
        type: 'Full-time',
        desc: 'Lead appraisals, work with consignors, and manage end-to-end lot management for Fine Art and Jewellery categories. Minimum 5 years specialist experience required.',
    },
    {
        id: 2,
        title: 'Product Engineer (Full-Stack)',
        dept: 'Technology',
        location: 'Remote / Mumbai',
        type: 'Full-time',
        desc: 'Build and scale the WREGALS platform — real-time bidding engine, wallet infrastructure, and seller tooling. Strong React + Node.js background preferred.',
    },
    {
        id: 3,
        title: 'KYC & Compliance Analyst',
        dept: 'Risk & Compliance',
        location: 'Mumbai, India',
        type: 'Full-time',
        desc: 'Manage bidder verification, AML screening, and source-of-funds review for high-value auction participants. CAMS certification a plus.',
    },
    {
        id: 4,
        title: 'Seller Relations Manager',
        dept: 'Business Development',
        location: 'Delhi / Mumbai',
        type: 'Full-time',
        desc: 'Identify, onboard, and manage relationships with celebrity consignors, private collectors, and institutional sellers. Strong network in the luxury segment essential.',
    },
    {
        id: 5,
        title: 'Graphic & Brand Designer',
        dept: 'Creative',
        location: 'Remote',
        type: 'Contract',
        desc: 'Own the visual identity of WREGALS across digital and print. Experience with premium luxury brands strongly preferred.',
    },
    {
        id: 6,
        title: 'Auction Operations Coordinator',
        dept: 'Operations',
        location: 'Mumbai, India',
        type: 'Full-time',
        desc: 'Coordinate logistics for live auction events, lot shipping, escrow handoffs, and winner settlement. Detail-oriented, high-pressure environment.',
    },
];

const PERKS = [
    { icon: 'solar:medal-ribbon-linear', label: 'Competitive Compensation', desc: 'Top-of-market salaries and equity for early team members.' },
    { icon: 'solar:map-point-linear', label: 'Flexible Location', desc: 'Remote-first culture with hubs in Mumbai and Delhi.' },
    { icon: 'solar:book-linear', label: 'Learning Budget', desc: '₹1L annual learning stipend for courses, conferences, and certifications.' },
    { icon: 'solar:health-linear', label: 'Health Coverage', desc: 'Full medical, dental, and vision coverage for you and your family.' },
    { icon: 'solar:star-shine-linear', label: 'Exclusive Access', desc: 'Staff passes to all WREGALS auction events and previews.' },
    { icon: 'solar:calendar-linear', label: 'Generous Leave', desc: '30 days paid leave plus all national holidays.' },
];

const DEPTS = ['All', 'Auctions', 'Technology', 'Risk & Compliance', 'Business Development', 'Creative', 'Operations'];

interface CareersProps { user: any; onSignInClick: () => void; }

export default function Careers({ user, onSignInClick }: CareersProps) {
    const [dept, setDept] = useState('All');
    const [expanded, setExpanded] = useState<number | null>(null);

    const filtered = dept === 'All' ? ROLES : ROLES.filter(r => r.dept === dept);

    return (
        <div className="bg-[#080808] min-h-screen text-white">

            {/* Nav */}
            <nav className="fixed top-0 w-full z-50 bg-[#080808]/90 backdrop-blur-md border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link to="/"><img src="/wregals-logo-new.png" alt="WREGALS" className="h-12 w-auto object-contain" /></Link>
                    <div className="flex items-center gap-6 text-xs tracking-widest uppercase text-neutral-400">
                        <Link to="/about" className="hover:text-white transition-colors hidden md:block">Company</Link>
                        <span className="text-[#D4AF37]">Careers</span>
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
                        <span className="text-[#D4AF37]">Careers</span>
                    </div>
                    <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] block mb-4">{ROLES.length} Open Roles</span>
                    <h1 className="text-4xl md:text-6xl font-light tracking-tight mb-6">Build the future<br /><span className="text-neutral-500">of premium auctions.</span></h1>
                    <p className="text-neutral-400 text-base max-w-xl leading-relaxed">
                        We're a small, focused team redefining how high-value assets change hands in India. If you care about craft, integrity, and building things that last — we'd like to meet you.
                    </p>
                </div>
            </section>

            {/* Perks */}
            <section className="border-t border-white/5 py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-xl font-light tracking-tight mb-8 text-neutral-300">Why WREGALS</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {PERKS.map(p => (
                            <div key={p.label} className="flex gap-4 p-5 border border-white/5 bg-[#0C0C0C] hover:bg-[#111] hover:border-white/10 transition-all rounded-sm">
                                <div className="flex-shrink-0 w-9 h-9 border border-white/10 rounded-sm flex items-center justify-center">
                                    <iconify-icon icon={p.icon} width="16" class="text-[#D4AF37]" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-white mb-1">{p.label}</h3>
                                    <p className="text-xs text-neutral-500 leading-relaxed">{p.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Open Roles */}
            <section className="border-t border-white/5 py-16 bg-[#0A0A0A]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                        <h2 className="text-xl font-light tracking-tight text-neutral-300">Open Roles</h2>
                        <div className="flex flex-wrap gap-2">
                            {DEPTS.map(d => (
                                <button key={d} onClick={() => setDept(d)}
                                    className={`text-[10px] uppercase tracking-widest px-3 py-1.5 border rounded-sm transition-all ${dept === d ? 'border-[#D4AF37] text-[#D4AF37]' : 'border-white/10 text-neutral-500 hover:border-white/30 hover:text-white'}`}>
                                    {d}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        {filtered.length === 0 && <p className="text-neutral-500 text-sm py-12 text-center">No open roles in this department right now.</p>}
                        {filtered.map(role => (
                            <div key={role.id} className="border border-white/5 bg-[#0C0C0C] hover:border-white/10 transition-all rounded-sm overflow-hidden">
                                <button onClick={() => setExpanded(expanded === role.id ? null : role.id)}
                                    className="w-full flex items-center justify-between px-6 py-5 text-left">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-medium text-white mb-1">{role.title}</h3>
                                        <div className="flex flex-wrap gap-3 text-[10px] uppercase tracking-widest text-neutral-500">
                                            <span>{role.dept}</span>
                                            <span>·</span>
                                            <span>{role.location}</span>
                                            <span>·</span>
                                            <span className={role.type === 'Contract' ? 'text-amber-500' : 'text-emerald-500'}>{role.type}</span>
                                        </div>
                                    </div>
                                    <iconify-icon icon={expanded === role.id ? 'solar:alt-arrow-up-linear' : 'solar:alt-arrow-down-linear'} width="16" class="text-neutral-500 flex-shrink-0 ml-4" />
                                </button>
                                {expanded === role.id && (
                                    <div className="px-6 pb-6 border-t border-white/5 pt-4">
                                        <p className="text-sm text-neutral-400 leading-relaxed mb-5">{role.desc}</p>
                                        <a href={`mailto:careers@wregals.com?subject=Application — ${role.title}`}
                                            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest px-5 py-2.5 bg-[#D4AF37] text-black font-semibold hover:bg-[#c49f2e] transition-colors">
                                            Apply for This Role
                                            <iconify-icon icon="solar:arrow-right-linear" width="13" />
                                        </a>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 p-6 border border-white/5 rounded-sm text-center">
                        <p className="text-sm text-neutral-400 mb-3">Don't see a role that fits? We're always looking for exceptional people.</p>
                        <a href="mailto:careers@wregals.com?subject=General Application"
                            className="text-xs uppercase tracking-widest text-[#D4AF37] hover:underline underline-offset-2">
                            Send a general application →
                        </a>
                    </div>
                </div>
            </section>

            <footer className="py-8 border-t border-white/5 text-center">
                <p className="text-[10px] uppercase tracking-wider text-neutral-700">© 2025 Wregals Inc. · All Rights Reserved.</p>
            </footer>
        </div>
    );
}
