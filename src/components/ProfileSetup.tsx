// @ts-nocheck
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { RecaptchaVerifier, signInWithPhoneNumber, type ConfirmationResult } from 'firebase/auth';
import { auth } from '../lib/firebase';
import IIcon from './IIcon';

declare global {
    interface Window {
        recaptchaVerifier: RecaptchaVerifier;
        grecaptcha: any;
    }
}

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
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

    useEffect(() => {
        if (!auth) return;
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'ps-recaptcha-container', {
                'size': 'invisible',
            });
        }
    }, []);

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
            if (!auth) throw new Error("Firebase not initialized. Add config to .env");
            const appVerifier = window.recaptchaVerifier;
            const confirmation = await signInWithPhoneNumber(auth, '+' + sendMobile, appVerifier);
            setConfirmationResult(confirmation);

            setOtpLoading(false);
            setOtpSent(true);
            setOtpError('');
            setTimer(45);
            const int = setInterval(() => {
                setTimer(t => {
                    if (t <= 1) clearInterval(int);
                    return t - 1;
                });
            }, 1000);
        } catch (err: any) {
            setOtpLoading(false);
            setOtpError(err.message || 'Failed to send OTP (Network or reCAPTCHA error)');
            if (window.recaptchaVerifier) {
                window.recaptchaVerifier.render().then(widgetId => window.grecaptcha?.reset(widgetId));
            }
        }
    };

    const handleVerifyOtp = async (eOrOtp?: React.FormEvent | string) => {
        if (eOrOtp && typeof (eOrOtp as React.FormEvent).preventDefault === 'function') {
            (eOrOtp as React.FormEvent).preventDefault();
        }
        const otpCode = typeof eOrOtp === 'string' ? eOrOtp : otp.join('');
        if (otpCode.length !== 6) {
            setOtpError('Please enter all 6 digits.');
            return;
        }

        setOtpLoading(true);
        setOtpError('');

        try {
            if (!confirmationResult) throw new Error("Session expired, please resend OTP");
            await confirmationResult.confirm(otpCode);
            
            setOtpLoading(false);
            setIsPhoneVerified(true);
            setOtpError('');
        } catch (err: any) {
            setOtpLoading(false);
            if (err?.code === 'auth/invalid-verification-code' || (err?.message && err.message.includes('invalid-verification-code'))) {
                setOtpError('Incorrect OTP. Please try again.');
            } else {
                setOtpError(err.message || 'Invalid OTP code');
            }
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
            <div className="ps-particles">
                {[...Array(13)].map((_, i) => <div key={i} className={`ps-particle ps-particle-${i}`} />)}
            </div>
            
            <button className="profile-setup-close" onClick={onDismiss} aria-label="Close">
                ×
            </button>
            <div className="profile-setup-layout">
                {/* Left decorative panel */}
                <div className="profile-setup-side profile-setup-side--left">
                    <div className="ps-side-accent" />
                    <div className="ps-side-ornament" />
                    <div className="ps-side-dots">
                        {[...Array(5)].map((_, i) => <div key={i} className="ps-side-dot" />)}
                    </div>
                </div>

                {/* Center form panel */}
                <div className="profile-setup-container">
                    <form className="profile-setup-form" onSubmit={handleSubmit}>
                        <div className="profile-setup-brand">
                            <img src="/wregals-text-logo.png" alt="WREGALS" className="w-48 md:w-56 h-auto object-contain mx-auto" />
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
                        <div id="ps-recaptcha-container"></div>
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
                            <div className="flex gap-2 w-full">
                                <input
                                    type="tel"
                                    className={`profile-setup-input flex-1 min-w-0 ${isPhoneVerified ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    placeholder="10-digit mobile number"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                    maxLength={10}
                                    inputMode="numeric"
                                    disabled={loading || otpLoading || otpSent || isPhoneVerified}
                                />
                                {!isPhoneVerified && !otpSent && (
                                    <button
                                        type="button"
                                        onClick={handleSendOtp}
                                        disabled={phone.length !== 10 || loading || otpLoading}
                                        className="flex-1 min-w-0 flex justify-center items-center py-3 px-2 bg-white hover:bg-neutral-200 text-[#0C0C0D] text-[13px] font-bold uppercase tracking-[0.14em] disabled:opacity-50 transition-colors rounded-md"
                                    >
                                        <span className="truncate">{otpLoading ? 'Sending...' : 'Send OTP'}</span>
                                    </button>
                                )}
                                {!isPhoneVerified && otpSent && (
                                    <div className="flex-1 min-w-0 flex gap-1 items-stretch justify-between">
                                        {otp.map((digit, i) => (
                                            <input
                                                key={i}
                                                id={`ps-otp-${i}`}
                                                type="text"
                                                inputMode="numeric"
                                                className="w-full text-center text-sm bg-[#0C0C0D] border border-white/10 text-white rounded-md focus:outline-none focus:border-[#D4AF37]/40 focus:ring-1 focus:ring-[#D4AF37]/20 transition-all font-medium shadow-inner disabled:opacity-50"
                                                value={digit}
                                                onChange={e => {
                                                    handleOtpChange(i, e.target.value);
                                                    if (i === 5 && e.target.value) {
                                                        const newOtp = [...otp];
                                                        newOtp[i] = e.target.value;
                                                        if (newOtp.join('').length === 6) {
                                                            setTimeout(() => handleVerifyOtp(newOtp.join('')), 0);
                                                        }
                                                    }
                                                }}
                                                onKeyDown={e => handleOtpKeyDown(i, e)}
                                                disabled={otpLoading}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                            
                            {!isPhoneVerified && otpSent && (
                                <div className="flex items-center justify-between mt-2 px-1">
                                    <button
                                        type="button"
                                        onClick={() => { setOtpSent(false); setOtp(['','','','','','']); setOtpError(''); }}
                                        className="text-white/40 hover:text-white transition-colors text-[10px] font-medium tracking-wide uppercase"
                                        disabled={otpLoading}
                                    >
                                        Change Number
                                    </button>
                                    <div className="flex items-center gap-3">
                                        {otpLoading && <span className="text-[#D4AF37] text-[10px] font-medium tracking-wide uppercase animate-pulse">Verifying...</span>}
                                        {timer > 0 ? (
                                            <span className="text-white/40 text-[10px] font-medium tracking-wide uppercase">Resend in {timer}s</span>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={handleSendOtp}
                                                disabled={loading || otpLoading}
                                                className="text-[#D4AF37] hover:text-[#b5952f] transition-colors text-[10px] font-bold tracking-wide uppercase disabled:opacity-50"
                                            >
                                                Resend OTP
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                            {otpError && <div className="text-red-400 text-xs mt-2 font-medium">{otpError}</div>}
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

                        <p className="profile-setup-footer">
                            You can update these details anytime from your profile.
                        </p>
                    </form>
                </div>

                {/* Right decorative panel */}
                <div className="profile-setup-side profile-setup-side--right">
                    <div className="ps-side-accent" />
                    <div className="ps-side-ornament" />
                    <div className="ps-side-dots">
                        {[...Array(5)].map((_, i) => <div key={i} className="ps-side-dot" />)}
                    </div>
                </div>
            </div>
        </div>
    );
}
