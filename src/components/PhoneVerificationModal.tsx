import { useState } from 'react';
import { supabase } from '../lib/supabase';
type Mode = 'loading' | 'prompt_phone' | 'verify_otp' | 'error';

interface PhoneVerificationModalProps {
    user: any;
    onVerified: () => void;
}

export default function PhoneVerificationModal({ user, onVerified }: PhoneVerificationModalProps) {
    const [mode, setMode] = useState<Mode>('prompt_phone');
    const [mobile, setMobile] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
    const [timer, setTimer] = useState(0);

    const handleSendOtp = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        
        let sendMobile = mobile.replace(/\D/g, '');
        if (sendMobile.length === 10) sendMobile = '91' + sendMobile;
        
        if (sendMobile.length < 10) {
            setMessage({ type: 'error', text: 'Please enter a valid mobile number.' });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            const res = await fetch('/api/msg91/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mobile: sendMobile }),
            });

            const data = await res.json();
            setLoading(false);

            if (res.ok) {
                setMode('verify_otp');
                setMessage({ type: 'success', text: `OTP sent to +${sendMobile}` });
                setTimer(45);
                const int = setInterval(() => {
                    setTimer(t => {
                        if (t <= 1) clearInterval(int);
                        return t - 1;
                    });
                }, 1000);
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to send OTP' });
            }
        } catch (err: any) {
            setLoading(false);
            setMessage({ type: 'error', text: err.message || 'Network error' });
        }
    };

    const handleVerifyOtp = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        
        const otpCode = otp.join('');
        if (otpCode.length !== 6) {
            setMessage({ type: 'error', text: 'Please enter all 6 digits.' });
            return;
        }

        let sendMobile = mobile.replace(/\D/g, '');
        if (sendMobile.length === 10) sendMobile = '91' + sendMobile;

        setLoading(true);
        setMessage(null);

        try {
            const res = await fetch('/api/msg91/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mobile: sendMobile, otp: otpCode, userId: user.id }),
            });

            const data = await res.json();
            setLoading(false);

            if (res.ok) {
                // Force a session refresh so we get the updated user_metadata.phone_verified
                await supabase.auth.refreshSession();
                onVerified();
            } else {
                setMessage({ type: 'error', text: data.error || 'Invalid OTP' });
            }
        } catch (err: any) {
            setLoading(false);
            setMessage({ type: 'error', text: err.message || 'Verification failed' });
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        if (!/^[0-9]?$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto focus next
        if (value && index < 5) {
            const next = document.getElementById(`pv-otp-${index + 1}`);
            next?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prev = document.getElementById(`pv-otp-${index - 1}`);
            prev?.focus();
        }
    };

    const handleSignOut = () => {
        supabase.auth.signOut();
    };

    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0C0C0D]/95 backdrop-blur-xl">
            <div className="w-full max-w-md p-8 md:p-10 border border-white/5 bg-[#141415] rounded-xl shadow-2xl flex flex-col items-center">
                
                <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mb-6">
                    <img src="/wregals-logo.png" alt="Wregals" className="w-8 h-auto object-contain" />
                </div>

                <h2 className="text-2xl font-semibold tracking-wide text-white mb-2 font-inter text-center">
                    Verify Your Mobile
                </h2>
                <p className="text-white/50 text-sm text-center mb-8 pr-4 pl-4 font-inter leading-relaxed">
                    To maintain the exclusivity of our platform, we require a verified phone number for all members.
                </p>

                {message && (
                    <div className={`w-full text-center p-3 mb-6 rounded text-sm ${message.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'}`}>
                        {message.text}
                    </div>
                )}

                {/* State: Enter Phone */}
                {mode === 'prompt_phone' && (
                    <form onSubmit={handleSendOtp} className="w-full space-y-4">
                        <div className="flex border border-white/10 rounded-lg overflow-hidden bg-white/5 focus-within:border-[#D4AF37]/50 transition-colors">
                            <div className="px-4 py-3 border-r border-white/10 text-white/50 text-sm font-inter flex items-center bg-black/20">
                                +91
                            </div>
                            <input
                                type="tel"
                                placeholder="Mobile Number"
                                className="flex-1 bg-transparent border-none px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:ring-0 font-inter"
                                value={mobile}
                                onChange={e => setMobile(e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || mobile.length < 10}
                            className="w-full py-3.5 bg-[#D4AF37] hover:bg-[#ebd074] text-black font-semibold text-sm uppercase tracking-wider transition-colors rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                        >
                            {loading ? <span className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : 'Send OTP'}
                        </button>
                    </form>
                )}

                {/* State: Enter OTP */}
                {mode === 'verify_otp' && (
                    <form onSubmit={handleVerifyOtp} className="w-full flex flex-col items-center">
                        <div className="flex gap-2 sm:gap-3 mb-8 justify-center w-full">
                            {otp.map((digit, i) => (
                                <input
                                    key={i}
                                    id={`pv-otp-${i}`}
                                    type="text"
                                    inputMode="numeric"
                                    className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                                    value={digit}
                                    onChange={e => handleOtpChange(i, e.target.value)}
                                    onKeyDown={e => handleOtpKeyDown(i, e)}
                                    disabled={loading}
                                />
                            ))}
                        </div>

                        <button
                            type="submit"
                            disabled={loading || otp.join('').length !== 6}
                            className="w-full py-3.5 bg-[#D4AF37] hover:bg-[#ebd074] text-black font-semibold text-sm uppercase tracking-wider transition-colors rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                        >
                            {loading ? <span className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : 'Verify Code'}
                        </button>

                        <div className="flex items-center justify-between w-full text-xs font-inter mt-2">
                            <button
                                type="button"
                                onClick={() => { setMode('prompt_phone'); setMessage(null); setOtp(['','','','','','']); }}
                                className="text-white/40 hover:text-white transition-colors"
                                disabled={loading}
                            >
                                Change Number
                            </button>
                            
                            <button
                                type="button"
                                onClick={() => handleSendOtp()}
                                disabled={timer > 0 || loading}
                                className={`transition-colors ${timer > 0 || loading ? 'text-white/20 cursor-not-allowed' : 'text-[#D4AF37] hover:text-[#ebd074]'}`}
                            >
                                {timer > 0 ? `Resend in ${timer}s` : 'Resend OTP'}
                            </button>
                        </div>
                    </form>
                )}

                {/* Global Sign out */}
                <div className="mt-8 pt-6 border-t border-white/10 w-full text-center">
                    <button
                        onClick={handleSignOut}
                        className="text-[10px] uppercase tracking-widest text-[#e57368]/70 hover:text-[#e57368] transition-colors font-semibold py-2"
                    >
                        Sign Out Instead
                    </button>
                </div>
            </div>
        </div>
    );
}
