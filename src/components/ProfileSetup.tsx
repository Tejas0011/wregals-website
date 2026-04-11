// @ts-nocheck
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import IIcon from './IIcon';

const HEARD_SOURCES = ['Instagram', 'LinkedIn', 'Twitter / X', 'Facebook', 'Friend / Referral', 'Google Search', 'Press / Media', 'Event', 'Other'];

const COUNTRIES = [
    'India', 'United States', 'United Kingdom', 'United Arab Emirates',
    'Singapore', 'Australia', 'Canada', 'Germany', 'France', 'Japan', 'Other',
];

interface ProfileSetupProps {
    user: any;
    onNext: () => void;
    onDismiss: () => void;
    displayName: string;
    setDisplayName: (v: string) => void;
    phone: string;
    setPhone: (v: string) => void;
    country: string;
    setCountry: (v: string) => void;
    heardSource: string[];
    setHeardSource: (v: string[]) => void;
}

export default function ProfileSetup({ user, onNext, onDismiss, displayName, setDisplayName, phone, setPhone, country, setCountry, heardSource, setHeardSource }: ProfileSetupProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // OTP State
    const [otpLoading, setOtpLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [otpError, setOtpError] = useState('');
    const [isPhoneVerified, setIsPhoneVerified] = useState(user?.user_metadata?.phone_verified || false);
    const [timer, setTimer] = useState(0);

    const toggleSource = (src: string) =>
        setHeardSource(
            heardSource.includes(src)
                ? heardSource.filter(s => s !== src)
                : [...heardSource, src]
        );

    const handleSendOtp = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        let sendMobile = phone.replace(/\D/g, '');
        if (sendMobile.length === 10) sendMobile = '91' + sendMobile;
        
        if (sendMobile.length < 10) {
            setOtpError('Please enter a valid mobile number.');
            return;
        }

        setOtpLoading(true);
        setOtpError('');

        try {
            const res = await fetch('/api/msg91/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mobile: sendMobile }),
            });

            const data = await res.json();
            setOtpLoading(false);

            if (res.ok) {
                setOtpSent(true);
                setOtpError('');
                setTimer(45);
                const int = setInterval(() => {
                    setTimer(t => {
                        if (t <= 1) clearInterval(int);
                        return t - 1;
                    });
                }, 1000);
            } else {
                setOtpError(data.error || 'Failed to send OTP');
            }
        } catch (err: any) {
            setOtpLoading(false);
            setOtpError(err.message || 'Network error');
        }
    };

    const handleVerifyOtp = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const otpCode = otp.join('');
        if (otpCode.length !== 6) {
            setOtpError('Please enter all 6 digits.');
            return;
        }

        let sendMobile = phone.replace(/\D/g, '');
        if (sendMobile.length === 10) sendMobile = '91' + sendMobile;

        setOtpLoading(true);
        setOtpError('');

        try {
            const res = await fetch('/api/msg91/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mobile: sendMobile, otp: otpCode, userId: user.id }),
            });

            const data = await res.json();
            setOtpLoading(false);

            if (res.ok) {
                setIsPhoneVerified(true);
                setOtpError('');
                await supabase.auth.refreshSession();
            } else {
                setOtpError(data.error || 'Invalid OTP');
            }
        } catch (err: any) {
            setOtpLoading(false);
            setOtpError(err.message || 'Verification failed');
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        if (!/^[0-9]?$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            const next = document.getElementById(`ps-otp-${index + 1}`);
            next?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prev = document.getElementById(`ps-otp-${index - 1}`);
            prev?.focus();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!displayName.trim()) { setError('Please enter your name.'); return; }
        if (!phone.trim() || phone.length !== 10) { setError('Please enter a valid 10-digit phone number.'); return; }
        if (!isPhoneVerified) { setError('Please verify your phone number using the OTP before continuing.'); return; }
        if (!country) { setError('Please select your country.'); return; }
        if (heardSource.length === 0) { setError('Please let us know how you heard about us.'); return; }
        setError('');
        setLoading(true);

        const { data: userData, error: updateError } = await supabase.auth.updateUser({
            data: {
                full_name: displayName.trim(),
                phone,
                country,
                heard_from: heardSource,
            },
        });

        if (updateError) { setLoading(false); setError(updateError.message); return; }

        if (userData?.user) {
            await supabase.from('users').upsert(
                {
                    id: userData.user.id,
                    email: userData.user.email,
                    full_name: displayName.trim(),
                    phone,
                    country,
                    heard_source: heardSource,
                },
                { onConflict: 'id' }
            );
        }

        setLoading(false);
        onNext();
    };

    return (
        <div className="profile-setup-overlay">
            <button className="profile-setup-close" onClick={onDismiss} aria-label="Close">
                ×
            </button>
            <div className="profile-setup-container">
                <div className="profile-setup-brand">
                    <img src="/wregals-text-logo.png" alt="WREGALS" className="h-32 w-auto object-contain" />
                </div>

                <div className="profile-setup-steps">
                    <div className="profile-setup-step profile-setup-step--active">
                        <span className="profile-setup-step-dot">1</span>
                        <span>Profile</span>
                    </div>
                    <div className="profile-setup-step-line" />
                    <div className="profile-setup-step">
                        <span className="profile-setup-step-dot">2</span>
                        <span>KYC Details</span>
                    </div>
                </div>

                <div className="profile-setup-heading-block">
                    <span className="profile-setup-eyebrow">Step 1 of 2</span>
                    <h1 className="profile-setup-title">Complete Your Profile</h1>
                    <p className="profile-setup-subtitle">
                        Tell us a little about yourself to personalise your experience.
                    </p>
                </div>

                <form className="profile-setup-form" onSubmit={handleSubmit}>
                    {error && <div className="profile-setup-error">{error}</div>}

                    <div className="profile-setup-field">
                        <label className="profile-setup-label">Full Name</label>
                        <input
                            type="text"
                            className="profile-setup-input"
                            placeholder="Your full name"
                            value={displayName}
                            onChange={e => setDisplayName(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    <div className="profile-setup-field">
                        <label className="profile-setup-label flex items-center">
                            Phone Number
                            {isPhoneVerified && <span className="text-green-500 font-semibold ml-2 text-[10px] tracking-wide uppercase px-2 py-0.5 rounded bg-green-500/10 border border-green-500/20">✓ Verified</span>}
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="tel"
                                className={`profile-setup-input flex-1 ${isPhoneVerified ? 'opacity-70 cursor-not-allowed' : ''}`}
                                placeholder="10-digit mobile number"
                                value={phone}
                                onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                maxLength={10}
                                inputMode="numeric"
                                disabled={loading || otpLoading || otpSent || isPhoneVerified}
                            />
                            {!isPhoneVerified && (
                                <button
                                    type="button"
                                    onClick={handleSendOtp}
                                    disabled={phone.length !== 10 || loading || otpLoading || (otpSent && timer > 0)}
                                    className="px-4 py-3 bg-white hover:bg-neutral-200 text-[#0C0C0D] text-xs font-bold uppercase tracking-wider rounded-lg disabled:opacity-50 transition-colors whitespace-nowrap min-w-[120px]"
                                >
                                    {otpLoading && !otpSent ? 'Sending...' : (otpSent && timer > 0 ? `Resend ${timer}s` : 'Send OTP')}
                                </button>
                            )}
                        </div>
                        {otpError && <div className="text-red-400 text-xs mt-2 font-medium">{otpError}</div>}

                        {/* Inline OTP Verification Layout */}
                        {otpSent && !isPhoneVerified && (
                            <div className="mt-3 p-4 bg-white/5 border border-white/10 rounded-xl relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#3b82f6]/5 to-transparent pointer-events-none" />
                                <label className="block text-xs text-white/50 mb-3 uppercase tracking-wider font-semibold">Enter 6-Digit Code</label>
                                <div className="flex gap-2 mb-4 justify-between">
                                    {otp.map((digit, i) => (
                                        <input
                                            key={i}
                                            id={`ps-otp-${i}`}
                                            type="text"
                                            inputMode="numeric"
                                            className="w-full h-12 text-center text-lg bg-[#0C0C0D] border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-[#3b82f6]/30 transition-all font-medium shadow-inner"
                                            value={digit}
                                            onChange={e => handleOtpChange(i, e.target.value)}
                                            onKeyDown={e => handleOtpKeyDown(i, e)}
                                            disabled={otpLoading}
                                        />
                                    ))}
                                </div>
                                <div className="flex items-center justify-between">
                                    <button
                                        type="button"
                                        onClick={() => { setOtpSent(false); setOtp(['','','','','','']); setOtpError(''); }}
                                        className="text-white/40 hover:text-white transition-colors text-[11px] font-medium tracking-wide uppercase"
                                        disabled={otpLoading}
                                    >
                                        Change Number
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleVerifyOtp}
                                        disabled={otp.join('').length !== 6 || otpLoading}
                                        className="px-5 py-2.5 bg-white hover:bg-neutral-200 text-[#0C0C0D] text-xs font-bold uppercase tracking-wider rounded-lg shrink-0 disabled:opacity-50 shadow-lg shadow-white/10"
                                    >
                                        {otpLoading ? 'Verifying...' : 'Verify Code'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="profile-setup-field">
                        <label className="profile-setup-label">Country</label>
                        <select
                            className="profile-setup-input profile-setup-select"
                            value={country}
                            onChange={e => setCountry(e.target.value)}
                            disabled={loading}
                            required
                        >
                            <option value="" disabled>Select your country</option>
                            {COUNTRIES.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>

                    <div className="profile-setup-field">
                        <label className="profile-setup-label">Where did you hear about Wregals?</label>
                        <div className="profile-setup-chips">
                            {HEARD_SOURCES.map(src => (
                                <button
                                    key={src}
                                    type="button"
                                    onClick={() => toggleSource(src)}
                                    disabled={loading}
                                    className={`profile-setup-chip ${heardSource.includes(src) ? 'profile-setup-chip--active' : ''}`}
                                >
                                    {src}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button type="submit" className="profile-setup-submit" disabled={loading || !isPhoneVerified}>
                        {loading ? (
                            <span className="auth-spinner auth-spinner--dark" />
                        ) : (
                            <IIcon icon="solar:arrow-right-linear" width="16" />
                        )}
                        {loading ? 'Saving…' : 'Continue'}
                    </button>
                </form>

                <p className="profile-setup-footer">
                    You can update these details anytime from your profile.
                </p>
            </div>
        </div>
    );
}
