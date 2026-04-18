// @ts-nocheck
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import IIcon from './IIcon';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// ── Supabase helpers ──────────────────────────────────────────────────────────

async function checkEmailExistsViaRPC(email: string): Promise<boolean> {
    try {
        const { data, error } = await supabase.rpc('check_email_exists', {
            p_email: email.trim().toLowerCase(),
        });
        if (error) return false;
        return !!data;
    } catch {
        return false;
    }
}

export async function upsertUserRecord(user: any) {
    if (!user?.id || !user?.email) return;
    await supabase.from('users').upsert(
        {
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name ?? null,
        },
        { onConflict: 'id', ignoreDuplicates: true }
    );
}

async function saveUserPhone(userId: string, phone: string) {
    await supabase.rpc('save_user_phone', { p_user_id: userId, p_phone: phone });
}

// ── MSG91 helpers (call our Vercel proxy) ─────────────────────────────────────

const API_BASE = typeof window !== 'undefined' && import.meta.env.PROD
    ? window.location.origin
    : 'http://localhost:5173';

async function sendOtp(mobile: string): Promise<{ success: boolean; error?: string }> {
    // DUMMY MVP Bypass
    return new Promise(r => setTimeout(() => r({ success: true }), 500));
}

async function verifyOtp(mobile: string, otp: string, userId?: string): Promise<{ success: boolean; error?: string }> {
    // DUMMY MVP Bypass
    return new Promise(r => setTimeout(() => r({ success: true }), 500));
}

// ── Sub-components ────────────────────────────────────────────────────────────

function PasswordInput({ id, placeholder, value, onChange, disabled }: {
    id?: string;
    placeholder: string;
    value: string;
    onChange: (v: string) => void;
    disabled: boolean;
}) {
    const [show, setShow] = useState(false);
    return (
        <div className="auth-pw-wrap">
            <input
                id={id}
                type={show ? 'text' : 'password'}
                className="auth-input auth-input--pw"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                required
            />
            <button
                type="button"
                className="auth-eye-btn"
                onClick={() => setShow(s => !s)}
                tabIndex={-1}
                aria-label={show ? 'Hide password' : 'Show password'}
            >
                {show ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                    </svg>
                )}
            </button>
        </div>
    );
}

const GoogleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
        <path d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6-6C34.6 5.1 29.6 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20-7.6 20-21 0-1.4-.1-2.7-.5-4z" fill="#FFC107" />
        <path d="M6.3 14.7l7 5.1C15.1 16.1 19.2 13 24 13c3.1 0 5.9 1.1 8.1 2.9l6-6C34.6 5.1 29.6 3 24 3 16.3 3 9.7 7.9 6.3 14.7z" fill="#FF3D00" />
        <path d="M24 45c5.5 0 10.4-1.9 14.2-5.1l-6.6-5.4C29.5 36.3 26.9 37 24 37c-6 0-10.6-3.1-11.8-7.5l-6.9 5.3C8.3 41.4 15.6 45 24 45z" fill="#4CAF50" />
        <path d="M44.5 20H24v8.5h11.8c-.8 2.3-2.3 4.2-4.3 5.6l6.6 5.4C42 35.8 45 30.4 45 24c0-1.4-.1-2.7-.5-4z" fill="#1976D2" />
    </svg>
);

// Phone input with inline "Send OTP" button
function PhoneOtpStep({
    loading,
    onBack,
    onComplete,
    userId,
}: {
    loading: string | null;
    onBack: () => void;
    onComplete: (phone: string) => void;
    userId?: string;
}) {
    const [phone, setPhone] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [countdown, setCountdown] = useState(0);
    const [localLoading, setLocalLoading] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const otpInputRef = useRef<HTMLInputElement>(null);

    const isLoading = !!(loading || localLoading);

    // Format phone to E.164 without + (MSG91 expects it as e.g. 919876543210)
    const formatMobile = (raw: string) => {
        const digits = raw.replace(/\D/g, '');
        // If user types 10-digit Indian number, prepend 91
        if (digits.length === 10) return `91${digits}`;
        return digits; // already includes country code
    };

    const startCountdown = () => {
        setCountdown(45);
        timerRef.current = setInterval(() => {
            setCountdown(c => {
                if (c <= 1) { clearInterval(timerRef.current!); return 0; }
                return c - 1;
            });
        }, 1000);
    };

    useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

    const handleSendOtp = async () => {
        setError(null);
        const mobile = formatMobile(phone);
        if (mobile.length < 10) {
            setError('Please enter a valid mobile number.');
            return;
        }
        setLocalLoading('send');
        const result = await sendOtp(mobile);
        setLocalLoading(null);
        if (!result.success) {
            setError(result.error || 'Failed to send OTP.');
            return;
        }
        setOtpSent(true);
        setSuccess('OTP sent! Check your SMS.');
        startCountdown();
        setTimeout(() => otpInputRef.current?.focus(), 100);
    };

    const handleVerifyOtp = async () => {
        setError(null);
        setSuccess(null);
        if (otp.length !== 6) {
            setError('Please enter the 6-digit OTP.');
            return;
        }
        const mobile = formatMobile(phone);
        setLocalLoading('verify');
        const result = await verifyOtp(mobile, otp, userId);
        setLocalLoading(null);
        if (!result.success) {
            setError(result.error || 'OTP verification failed.');
            return;
        }
        onComplete(mobile);
    };

    return (
        <>
            <span className="auth-section-label">One last step</span>
            <h2 className="auth-heading">Verify Your Phone</h2>
            <p className="auth-subheading">We'll send a 6-digit code to confirm your number.</p>

            {error && <div className="auth-message auth-message--error" style={{ marginBottom: 12 }}>{error}</div>}
            {success && !error && <div className="auth-message auth-message--success" style={{ marginBottom: 12 }}>{success}</div>}

            <div className="auth-form">
                {/* Phone + Send OTP row */}
                <div className="auth-input-group">
                    <label className="auth-label">Mobile Number</label>
                    <div className="auth-phone-wrap">
                        <span className="auth-phone-prefix">+91</span>
                        <input
                            type="tel"
                            className="auth-input auth-input--phone"
                            placeholder="98765 43210"
                            value={phone}
                            onChange={(e) => {
                                setPhone(e.target.value);
                                setOtpSent(false);
                                setOtp('');
                                setError(null);
                                setSuccess(null);
                            }}
                            disabled={isLoading}
                            maxLength={15}
                        />
                        <button
                            type="button"
                            className="auth-send-otp-btn"
                            onClick={handleSendOtp}
                            disabled={isLoading || countdown > 0}
                        >
                            {localLoading === 'send' ? (
                                <span className="auth-spinner auth-spinner--dark" />
                            ) : countdown > 0 ? (
                                `${countdown}s`
                            ) : otpSent ? (
                                'Resend'
                            ) : (
                                'Send OTP'
                            )}
                        </button>
                    </div>
                </div>

                {/* OTP input - appears after OTP is sent */}
                {otpSent && (
                    <div className="auth-input-group auth-otp-group">
                        <label className="auth-label">Enter OTP</label>
                        <input
                            ref={otpInputRef}
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            className="auth-input auth-otp-input"
                            placeholder="● ● ● ● ● ●"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            disabled={isLoading}
                            maxLength={6}
                            autoComplete="one-time-code"
                        />
                        <button
                            type="button"
                            className="auth-primary-btn"
                            style={{ marginTop: 8 }}
                            onClick={handleVerifyOtp}
                            disabled={isLoading || otp.length !== 6}
                        >
                            {localLoading === 'verify' ? <span className="auth-spinner auth-spinner--dark" /> : null}
                            {localLoading === 'verify' ? 'Verifying…' : 'Verify & Continue'}
                            {!localLoading && <IIcon icon="solar:arrow-right-linear" width="16" />}
                        </button>
                    </div>
                )}
            </div>

            <div className="mt-8 text-center text-[11px] text-white/40 font-inter">
                <button
                    type="button"
                    onClick={onBack}
                    className="text-white/60 hover:text-white transition-colors text-[10px]"
                    disabled={isLoading}
                >
                    ← Go back
                </button>
            </div>
        </>
    );
}

// ── Main Modal ────────────────────────────────────────────────────────────────

type AuthMode = 'signup_select' | 'signup_email' | 'login';

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [signupConfirm, setSignupConfirm] = useState('');
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loading, setLoading] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [mode, setMode] = useState<AuthMode>('signup_select');
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            setMessage(null);
            setSignupEmail('');
            setSignupPassword('');
            setSignupConfirm('');
            setLoginEmail('');
            setLoginPassword('');
            setLoading(null);
            setMode('signup_select');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleGoogleSignIn = async () => {
        setLoading('google');
        setMessage(null);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: window.location.origin },
        });
        if (error) { setMessage({ type: 'error', text: error.message }); setLoading(null); }
    };

    // Step 1 of sign-up: create the account, then move to phone verification
    const handleSignUp = async (e) => {
        e.preventDefault();
        if (!signupEmail || !signupPassword) return;
        if (signupPassword !== signupConfirm) {
            setMessage({ type: 'error', text: 'Passwords do not match.' });
            return;
        }

        setLoading('signup'); setMessage(null);

        const exists = await checkEmailExistsViaRPC(signupEmail);
        if (exists) {
            setMessage({
                type: 'error',
                text: 'An account already exists with this email. Please log in instead.',
            });
            setLoading(null);
            return;
        }

        const { data, error } = await supabase.auth.signUp({ email: signupEmail, password: signupPassword });
        setLoading(null);

        if (error) {
            setMessage({ type: 'error', text: error.message });
        } else if (data?.user && (data.user.identities?.length === 0)) {
            setMessage({
                type: 'error',
                text: 'An account already exists with this email. Please log in instead.',
            });
        } else if (data?.user) {
            // Upsert base record
            await upsertUserRecord(data.user);
            // Close modal - the global App.tsx Gatekeeper will prompt for phone verification if needed
            setMessage(null);
            onClose();
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!loginEmail || !loginPassword) return;

        setLoading('login'); setMessage(null);

        const exists = await checkEmailExistsViaRPC(loginEmail);
        if (!exists) {
            setMessage({
                type: 'error',
                text: 'No account found with this email. Please sign up first.',
            });
            setLoading(null);
            return;
        }

        const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPassword });
        setLoading(null);
        if (error) {
            setMessage({ type: 'error', text: error.message });
        } else {
            onClose();
        }
    };

    return (
        <div
            className="auth-modal-overlay"
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
        >
            <div className="auth-modal-container">
                <button className="auth-modal-close" onClick={onClose} aria-label="Close">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <line x1="1" y1="1" x2="15" y2="15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        <line x1="15" y1="1" x2="1" y2="15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                </button>

                {message && (
                    <div className={`auth-message auth-message--${message.type}`}>
                        {message.text}
                    </div>
                )}

                <div className="auth-columns">
                    <div className="auth-section">

                        {/* ── Sign Up: choose method ── */}
                        {mode === 'signup_select' && (
                            <>
                                <span className="auth-section-label">New to Wregals</span>
                                <h2 className="auth-heading">Create an Account</h2>
                                <p className="auth-subheading">Join the world's most exclusive auction house.</p>

                                <button className="auth-google-btn" onClick={handleGoogleSignIn} disabled={!!loading}>
                                    {loading === 'google' ? <span className="auth-spinner" /> : <GoogleIcon />}
                                    {loading === 'google' ? 'Redirecting…' : 'Continue with Google'}
                                </button>

                                <div className="auth-divider">
                                    <span className="auth-divider-line" />
                                    <span className="auth-divider-text">or</span>
                                    <span className="auth-divider-line" />
                                </div>

                                <button type="button" className="auth-primary-btn" onClick={() => setMode('signup_email')} disabled={!!loading}>
                                    Sign up with Email
                                </button>

                                <div className="mt-8 text-center text-[11px] text-white/40 font-inter">
                                    Already have an account?{' '}
                                    <button
                                        type="button"
                                        onClick={() => { setMode('login'); setMessage(null); }}
                                        className="text-blue-400 hover:text-white transition-colors uppercase tracking-wider font-semibold ml-1"
                                    >
                                        Log in
                                    </button>
                                </div>
                            </>
                        )}

                        {/* ── Sign Up: email & password ── */}
                        {mode === 'signup_email' && (
                            <>
                                <span className="auth-section-label">New to Wregals</span>
                                <h2 className="auth-heading">Sign Up with Email</h2>
                                <p className="auth-subheading">Create a secure login for your account.</p>

                                <form className="auth-form" onSubmit={handleSignUp}>
                                    <div className="auth-input-group">
                                        <label className="auth-label">Email Address</label>
                                        <input
                                            type="email"
                                            className="auth-input"
                                            placeholder="you@example.com"
                                            value={signupEmail}
                                            onChange={(e) => setSignupEmail(e.target.value)}
                                            disabled={!!loading}
                                            required
                                        />
                                    </div>
                                    <div className="auth-input-group">
                                        <label className="auth-label">Password</label>
                                        <PasswordInput
                                            placeholder="Create a strong password"
                                            value={signupPassword}
                                            onChange={setSignupPassword}
                                            disabled={!!loading}
                                        />
                                    </div>
                                    <div className="auth-input-group">
                                        <label className="auth-label">Confirm Password</label>
                                        <PasswordInput
                                            placeholder="Type your password again"
                                            value={signupConfirm}
                                            onChange={setSignupConfirm}
                                            disabled={!!loading}
                                        />
                                    </div>
                                    <button type="submit" className="auth-primary-btn" disabled={!!loading}>
                                        {loading === 'signup' ? <span className="auth-spinner auth-spinner--dark" /> : null}
                                        {loading === 'signup' ? 'Creating account…' : 'Continue'}
                                        {!loading && <IIcon icon="solar:arrow-right-linear" width="16" />}
                                    </button>
                                </form>

                                <div className="mt-8 text-center text-[11px] text-white/40 font-inter">
                                    Already have an account?{' '}
                                    <button
                                        type="button"
                                        onClick={() => { setMode('login'); setMessage(null); }}
                                        className="text-blue-400 hover:text-white transition-colors uppercase tracking-wider font-semibold ml-1"
                                    >
                                        Log in
                                    </button>
                                    <div className="mt-2">
                                        <button
                                            type="button"
                                            onClick={() => { setMode('signup_select'); setMessage(null); }}
                                            className="text-white/60 hover:text-white transition-colors text-[10px]"
                                        >
                                            Back to choices
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* ── Login ── */}
                        {mode === 'login' && (
                            <>
                                <span className="auth-section-label">Welcome back</span>
                                <h2 className="auth-heading">Log In</h2>
                                <p className="auth-subheading">Access your exclusive account.</p>

                                <button className="auth-google-btn" onClick={handleGoogleSignIn} disabled={!!loading}>
                                    {loading === 'google' ? <span className="auth-spinner" /> : <GoogleIcon />}
                                    {loading === 'google' ? 'Redirecting…' : 'Continue with Google'}
                                </button>

                                <div className="auth-divider">
                                    <span className="auth-divider-line" />
                                    <span className="auth-divider-text">or log in with email</span>
                                    <span className="auth-divider-line" />
                                </div>

                                <form className="auth-form auth-form--login" onSubmit={handleLogin}>
                                    <div className="auth-input-group">
                                        <label className="auth-label">Email Address</label>
                                        <input
                                            type="email"
                                            className="auth-input"
                                            placeholder="you@example.com"
                                            value={loginEmail}
                                            onChange={(e) => setLoginEmail(e.target.value)}
                                            disabled={!!loading}
                                            required
                                        />
                                    </div>
                                    <div className="auth-input-group">
                                        <label className="auth-label">Password</label>
                                        <PasswordInput
                                            placeholder="Your password"
                                            value={loginPassword}
                                            onChange={setLoginPassword}
                                            disabled={!!loading}
                                        />
                                    </div>
                                    <div className="auth-forgot-row">
                                        <a
                                            href="#"
                                            className="auth-forgot-link"
                                            onClick={async (e) => {
                                                e.preventDefault();
                                                if (!loginEmail) { setMessage({ type: 'error', text: 'Enter your email above first.' }); return; }
                                                const { error } = await supabase.auth.resetPasswordForEmail(loginEmail, {
                                                    redirectTo: `${window.location.origin}/reset-password`,
                                                });
                                                setMessage(error
                                                    ? { type: 'error', text: error.message }
                                                    : { type: 'success', text: 'Password reset email sent.' }
                                                );
                                            }}
                                        >
                                            Forgot password?
                                        </a>
                                    </div>
                                    <button type="submit" className="auth-primary-btn" disabled={!!loading}>
                                        {loading === 'login' ? <span className="auth-spinner auth-spinner--dark" /> : null}
                                        {loading === 'login' ? 'Logging in…' : 'Log In'}
                                        {!loading && <IIcon icon="solar:arrow-right-linear" width="16" />}
                                    </button>
                                </form>

                                <div className="mt-8 text-center text-[11px] text-white/40 font-inter">
                                    Don't have an account?{' '}
                                    <button
                                        type="button"
                                        onClick={() => { setMode('signup_select'); setMessage(null); }}
                                        className="text-blue-400 hover:text-white transition-colors uppercase tracking-wider font-semibold ml-1"
                                    >
                                        Sign up
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <p className="auth-fine-print">
                    By continuing, you agree to Wregals'{' '}
                    <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
                </p>
            </div>
        </div>
    );
}
