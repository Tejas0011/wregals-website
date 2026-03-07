// @ts-nocheck
import { useState } from 'react';
import { Link } from 'react-router-dom';
import IIcon from '../components/IIcon';

const TOPICS = [
    { icon: 'solar:tag-linear', label: 'Consign an Item', email: 'consign@wregals.com', desc: 'Sell your asset with WREGALS' },
    { icon: 'solar:wallet-linear', label: 'Wallet & Payments', email: 'support@wregals.com', desc: 'Deposits, withdrawals, and bids' },
    { icon: 'solar:shield-check-linear', label: 'KYC & Compliance', email: 'kyc@wregals.com', desc: 'Verification and account issues' },
    { icon: 'solar:star-linear', label: 'Press & Media', email: 'press@wregals.com', desc: 'Interviews and media requests' },
    { icon: 'solar:users-group-two-linear', label: 'Partnerships', email: 'partners@wregals.com', desc: 'Brand and commercial collaborations' },
    { icon: 'solar:chat-round-linear', label: 'General Enquiry', email: 'hello@wregals.com', desc: 'Anything else' },
];

interface ContactProps { user: any; onSignInClick: () => void; }

export default function Contact({ user, onSignInClick }: ContactProps) {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        // TODO: wire to backend / email service
        await new Promise(r => setTimeout(r, 1200));
        setLoading(false);
        setSent(true);
    };

    const set = (k: string) => (e: any) => setForm(f => ({ ...f, [k]: e.target.value }));

    return (
        <div className="bg-[#080808] min-h-screen text-white">

            {/* Nav */}
            <nav className="fixed top-0 w-full z-50 bg-[#080808]/90 backdrop-blur-md border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link to="/"><img src="/wregals-logo-new.png" alt="WREGALS" className="h-12 w-auto object-contain" /></Link>
                    <div className="flex items-center gap-6 text-xs tracking-widest uppercase text-neutral-400">
                        <Link to="/" className="hover:text-white transition-colors">Home</Link>
                        <Link to="/about" className="hover:text-white transition-colors hidden md:block">Company</Link>
                        <span className="text-[#D4AF37]">Contact</span>
                        {user ? <span className="text-neutral-300 hidden md:block">{user.email?.split('@')[0]}</span>
                            : <button onClick={onSignInClick} className="border px-4 py-1.5 rounded-sm border-white/20 hover:bg-white hover:text-black transition-all">Sign In</button>}
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="pt-16">
                <div className="max-w-7xl mx-auto px-6 py-24">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-neutral-600 mb-8">
                        <Link to="/" className="hover:text-neutral-400 transition-colors">Home</Link>
                        <span>/</span>
                        <Link to="/about" className="hover:text-neutral-400 transition-colors">Company</Link>
                        <span>/</span>
                        <span className="text-[#D4AF37]">Contact</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4">Get In Touch</h1>
                    <p className="text-neutral-400 text-base max-w-xl leading-relaxed">
                        Whether you're a potential seller, a bidder with a question, or a member of the press — we're here.
                    </p>
                </div>
            </section>

            {/* Department directory */}
            <section className="border-t border-white/5 py-12 bg-[#0A0A0A]">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-[10px] uppercase tracking-widest text-neutral-500 mb-6">Contact by Topic</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {TOPICS.map(t => (
                            <a key={t.label} href={`mailto:${t.email}`}
                                className="group flex items-center gap-4 p-4 border border-white/5 bg-[#0C0C0C] hover:bg-[#111] hover:border-white/10 transition-all rounded-sm">
                                <div className="flex-shrink-0 w-9 h-9 border border-white/10 rounded-sm flex items-center justify-center group-hover:border-[#D4AF37]/40 transition-colors">
                                    <IIcon icon={t.icon} width="16" class="text-neutral-500 group-hover:text-[#D4AF37] transition-colors" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-white font-medium group-hover:text-[#D4AF37] transition-colors">{t.label}</p>
                                    <p className="text-[10px] text-neutral-600 truncate">{t.email}</p>
                                </div>
                                <IIcon icon="solar:arrow-right-up-linear" width="14" class="text-neutral-700 group-hover:text-white transition-colors flex-shrink-0" />
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* Form + Office */}
            <section className="border-t border-white/5 py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-16">

                        {/* Form */}
                        <div>
                            <h2 className="text-xl font-light tracking-tight text-neutral-300 mb-8">Send us a message</h2>

                            {sent ? (
                                <div className="py-16 text-center">
                                    <IIcon icon="solar:check-circle-linear" width="40" class="text-emerald-400 block mx-auto mb-4" />
                                    <p className="text-white font-medium mb-2">Message Received</p>
                                    <p className="text-sm text-neutral-500">We'll get back to you within one business day.</p>
                                    <button onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                                        className="mt-6 text-xs uppercase tracking-widest text-[#D4AF37] hover:underline underline-offset-2">
                                        Send another message
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] uppercase tracking-widest text-neutral-500 block mb-2">Your Name</label>
                                            <input required value={form.name} onChange={set('name')} placeholder="Full name"
                                                className="w-full bg-[#0C0C0C] border border-white/10 focus:border-white/30 text-sm text-white px-4 py-3 focus:outline-none placeholder:text-neutral-700 transition-colors" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase tracking-widest text-neutral-500 block mb-2">Email</label>
                                            <input required type="email" value={form.email} onChange={set('email')} placeholder="you@example.com"
                                                className="w-full bg-[#0C0C0C] border border-white/10 focus:border-white/30 text-sm text-white px-4 py-3 focus:outline-none placeholder:text-neutral-700 transition-colors" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase tracking-widest text-neutral-500 block mb-2">Subject</label>
                                        <input required value={form.subject} onChange={set('subject')} placeholder="How can we help?"
                                            className="w-full bg-[#0C0C0C] border border-white/10 focus:border-white/30 text-sm text-white px-4 py-3 focus:outline-none placeholder:text-neutral-700 transition-colors" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase tracking-widest text-neutral-500 block mb-2">Message</label>
                                        <textarea required rows={6} value={form.message} onChange={set('message')} placeholder="Tell us more..."
                                            className="w-full bg-[#0C0C0C] border border-white/10 focus:border-white/30 text-sm text-white px-4 py-3 focus:outline-none placeholder:text-neutral-700 transition-colors resize-none" />
                                    </div>
                                    <button type="submit" disabled={loading}
                                        className="w-full py-3.5 text-xs uppercase tracking-widest font-semibold bg-[#D4AF37] text-black hover:bg-[#c49f2e] transition-colors disabled:opacity-60">
                                        {loading ? 'Sending…' : 'Send Message'}
                                    </button>
                                </form>
                            )}
                        </div>

                        {/* Office info */}
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-xl font-light tracking-tight text-neutral-300 mb-8">Office</h2>
                                <div className="space-y-6">
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 w-9 h-9 border border-white/10 rounded-sm flex items-center justify-center">
                                            <IIcon icon="solar:map-point-linear" width="16" class="text-[#D4AF37]" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white mb-0.5">Mumbai (HQ)</p>
                                            <p className="text-xs text-neutral-500 leading-relaxed">
                                                Level 14, One BKC Tower<br />
                                                Bandra Kurla Complex<br />
                                                Mumbai — 400 051, Maharashtra
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 w-9 h-9 border border-white/10 rounded-sm flex items-center justify-center">
                                            <IIcon icon="solar:clock-circle-linear" width="16" class="text-[#D4AF37]" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white mb-0.5">Office Hours</p>
                                            <p className="text-xs text-neutral-500 leading-relaxed">
                                                Mon – Fri: 10:00 AM – 6:30 PM IST<br />
                                                Sat: 10:00 AM – 2:00 PM IST<br />
                                                Sun: Closed
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 w-9 h-9 border border-white/10 rounded-sm flex items-center justify-center">
                                            <IIcon icon="solar:phone-linear" width="16" class="text-[#D4AF37]" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white mb-0.5">Phone</p>
                                            <p className="text-xs text-neutral-500">+91 22 6000 0000</p>
                                            <p className="text-[10px] text-neutral-700 mt-0.5">Mon – Fri, 10 AM – 6 PM IST</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Response time card */}
                            <div className="border border-white/5 bg-[#0C0C0C] rounded-sm p-5 space-y-3">
                                <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold">Response Times</p>
                                <div className="space-y-2 text-xs">
                                    {[
                                        ['General Enquiries', '1 business day'],
                                        ['Consignment', 'Same day'],
                                        ['Support / Wallet', '2–4 hours'],
                                        ['Press & Media', '1 business day'],
                                    ].map(([label, time]) => (
                                        <div key={label} className="flex justify-between text-neutral-500">
                                            <span>{label}</span>
                                            <span className="text-neutral-300 font-mono">{time}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="py-8 border-t border-white/5 text-center">
                <p className="text-[10px] uppercase tracking-wider text-neutral-700">© 2025 Wregals Inc. · All Rights Reserved.</p>
            </footer>
        </div>
    );
}
