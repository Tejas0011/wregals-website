// @ts-nocheck
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// Reusable eye-toggle password input
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
                    // Eye-off icon
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                ) : (
                    // Eye icon
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                    </svg>
                )}
            </button>
        </div>
    );
}

// Google SVG
const GoogleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
        <path d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6-6C34.6 5.1 29.6 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20-7.6 20-21 0-1.4-.1-2.7-.5-4z" fill="#FFC107" />
        <path d="M6.3 14.7l7 5.1C15.1 16.1 19.2 13 24 13c3.1 0 5.9 1.1 8.1 2.9l6-6C34.6 5.1 29.6 3 24 3 16.3 3 9.7 7.9 6.3 14.7z" fill="#FF3D00" />
        <path d="M24 45c5.5 0 10.4-1.9 14.2-5.1l-6.6-5.4C29.5 36.3 26.9 37 24 37c-6 0-10.6-3.1-11.8-7.5l-6.9 5.3C8.3 41.4 15.6 45 24 45z" fill="#4CAF50" />
        <path d="M44.5 20H24v8.5h11.8c-.8 2.3-2.3 4.2-4.3 5.6l6.6 5.4C42 35.8 45 30.4 45 24c0-1.4-.1-2.7-.5-4z" fill="#1976D2" />
    </svg>
);

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [signupConfirm, setSignupConfirm] = useState('');
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loading, setLoading] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) setMessage(null);
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

    const handleSignUp = async (e) => {
        e.preventDefault();
        if (!signupEmail || !signupPassword) return;
        if (signupPassword !== signupConfirm) {
            setMessage({ type: 'error', text: 'Passwords do not match.' });
            return;
        }
        setLoading('signup'); setMessage(null);
        const { error } = await supabase.auth.signUp({ email: signupEmail, password: signupPassword });
        setLoading(null);
        if (error) { setMessage({ type: 'error', text: error.message }); }
        else { setMessage({ type: 'success', text: 'Check your email to confirm your account.' }); setSignupEmail(''); setSignupPassword(''); setSignupConfirm(''); }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!loginEmail || !loginPassword) return;
        setLoading('login'); setMessage(null);
        const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPassword });
        setLoading(null);
        if (error) { setMessage({ type: 'error', text: error.message }); }
        else { onClose(); }
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

                    {/* ── COLUMN 1 : Create an account ──────────────────────── */}
                    <div className="auth-section auth-section-top">
                        <span className="auth-section-label">New to Wregals</span>
                        <h2 className="auth-heading">Create an Account</h2>
                        <p className="auth-subheading">Join the world's most exclusive auction house.</p>

                        <button className="auth-google-btn" onClick={handleGoogleSignIn} disabled={!!loading}>
                            {loading === 'google' ? <span className="auth-spinner" /> : <GoogleIcon />}
                            {loading === 'google' ? 'Redirecting…' : 'Continue with Google'}
                        </button>

                        <div className="auth-divider">
                            <span className="auth-divider-line" />
                            <span className="auth-divider-text">or sign up with email</span>
                            <span className="auth-divider-line" />
                        </div>

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
                                {loading === 'signup' ? 'Creating account…' : 'Create Account'}
                                {!loading && <iconify-icon icon="solar:arrow-right-linear" width="16" />}
                            </button>
                        </form>
                    </div>

                    {/* ── Vertical divider ──────────────────────────────────── */}
                    <div className="auth-vdivider" />

                    {/* ── COLUMN 2 : Log in ─────────────────────────────────── */}
                    <div className="auth-section auth-section-bottom">
                        <span className="auth-section-label">Welcome back</span>
                        <h2 className="auth-heading">Log In</h2>
                        {/* Invisible spacer to match the LHS subheading height perfectly */}
                        <p className="auth-subheading" style={{ visibility: 'hidden' }}>Spacer</p>

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
                            <button type="submit" className="auth-secondary-btn" disabled={!!loading}>
                                {loading === 'login' ? <span className="auth-spinner auth-spinner--light" /> : null}
                                {loading === 'login' ? 'Logging in…' : 'Log In'}
                                {!loading && <iconify-icon icon="solar:arrow-right-linear" width="16" />}
                            </button>
                        </form>
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
