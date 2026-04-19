import { useState, useEffect, useRef } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber, type ConfirmationResult } from 'firebase/auth';
import { auth } from '../lib/firebase';
import IIcon from './IIcon';

declare global {
    interface Window {
        recaptchaVerifier: RecaptchaVerifier;
    }
}

interface PhoneVerificationProps {
    onComplete: (phone: string) => void;
    onBack?: () => void;
}

export default function PhoneVerification({ onComplete, onBack }: PhoneVerificationProps) {
    const [phone, setPhone] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [countdown, setCountdown] = useState(0);
    const [loading, setLoading] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

    // Initialize reCAPTCHA
    useEffect(() => {
        if (!auth) {
            setError("Firebase is not configured. Please add your config to .env");
            return;
        }
        
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                'size': 'invisible',
            });
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const startCountdown = () => {
        setCountdown(45);
        timerRef.current = setInterval(() => {
            setCountdown(c => {
                if (c <= 1) { clearInterval(timerRef.current!); return 0; }
                return c - 1;
            });
        }, 1000);
    };

    const formatMobile = (raw: string) => {
        const digits = raw.replace(/\D/g, '');
        if (digits.length === 10) return `+91${digits}`; // Assume India if exactly 10 digits
        if (!digits.startsWith('+')) return `+${digits}`; // Ensure starts with +
        return digits; 
    };

    const handleSendOtp = async () => {
        if (!auth) return;
        setError(null);
        setSuccess(null);
        
        const mobile = formatMobile(phone);
        if (mobile.length < 11) {
            setError('Please enter a valid mobile number with country code (e.g. 9876543210).');
            return;
        }

        setLoading('send');
        try {
            const appVerifier = window.recaptchaVerifier;
            const confirmation = await signInWithPhoneNumber(auth, mobile, appVerifier);
            setConfirmationResult(confirmation);
            
            setOtpSent(true);
            setSuccess('OTP sent! Check your SMS.');
            startCountdown();
        } catch (err: any) {
            console.error("SMS Error:", err);
            setError(err.message || 'Failed to send OTP. Please try again.');
            // Reset reCAPTCHA so they can try again if it failed
            if (window.recaptchaVerifier) window.recaptchaVerifier.render().then(widgetId => window.grecaptcha?.reset(widgetId));
        } finally {
            setLoading(null);
        }
    };

    const handleVerifyOtp = async () => {
        setError(null);
        setSuccess(null);
        
        if (otp.length !== 6) {
            setError('Please enter the 6-digit OTP.');
            return;
        }

        if (!confirmationResult) {
            setError('Please request a new OTP.');
            return;
        }

        setLoading('verify');
        try {
            const result = await confirmationResult.confirm(otp);
            // Phone is verified in Firebase identity
            const verifiedPhone = result.user.phoneNumber || phone;
            setSuccess("Phone verified successfully!");
            onComplete(verifiedPhone);
        } catch (err: any) {
            setError(err.message || 'OTP verification failed. Incorrect code.');
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="auth-form w-full max-w-sm mx-auto">
            {/* hidden container for invisible recaptcha */}
            <div id="recaptcha-container"></div>
            
            {error && <div className="auth-message auth-message--error mb-3">{error}</div>}
            {success && !error && <div className="auth-message auth-message--success mb-3">{success}</div>}

            <div className="auth-input-group">
                <label className="auth-label">Mobile Number</label>
                <div className="auth-phone-wrap relative flex items-center">
                    <span className="auth-phone-prefix absolute left-3 top-1/2 -translate-y-1/2 text-white/40">+91</span>
                    <input
                        type="tel"
                        className="auth-input auth-input--phone pl-10"
                        placeholder="98765 43210"
                        value={phone}
                        onChange={(e) => {
                            setPhone(e.target.value);
                            setOtpSent(false);
                            setOtp('');
                            setError(null);
                            setSuccess(null);
                        }}
                        disabled={!!loading}
                        maxLength={15}
                    />
                    <button
                        type="button"
                        className="auth-send-otp-btn absolute right-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white text-[11px] px-3 py-1.5 rounded"
                        onClick={handleSendOtp}
                        disabled={!!loading || countdown > 0}
                    >
                        {loading === 'send' ? (
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
                <div className="auth-input-group auth-otp-group mt-4">
                    <label className="auth-label">Enter OTP</label>
                    <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        className="auth-input auth-otp-input tracking-[0.5em] text-center"
                        placeholder="●●●●●●"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        disabled={!!loading}
                        maxLength={6}
                        autoComplete="one-time-code"
                    />
                    <button
                        type="button"
                        className="auth-primary-btn w-full mt-4 flex items-center justify-center gap-2"
                        onClick={handleVerifyOtp}
                        disabled={!!loading || otp.length !== 6}
                    >
                        {loading === 'verify' ? <span className="auth-spinner auth-spinner--dark relative inline-block w-4 h-4 ml-0" /> : null}
                        {loading === 'verify' ? 'Verifying…' : 'Verify Phone'}
                        {!loading && <IIcon icon="solar:arrow-right-linear" width="16" />}
                    </button>
                </div>
            )}

            {onBack && (
                <div className="mt-8 text-center text-[11px]">
                    <button
                        type="button"
                        onClick={onBack}
                        className="text-white/60 hover:text-white transition-colors"
                        disabled={!!loading}
                    >
                        ← Go back
                    </button>
                </div>
            )}
        </div>
    );
}
