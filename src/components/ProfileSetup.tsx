// @ts-nocheck
import { useState } from 'react';
import { supabase } from '../lib/supabase';

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

    const toggleSource = (src: string) =>
        setHeardSource(
            heardSource.includes(src)
                ? heardSource.filter(s => s !== src)
                : [...heardSource, src]
        );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!displayName.trim()) { setError('Please enter your name.'); return; }
        if (!phone.trim()) { setError('Please enter your phone number.'); return; }
        if (phone.length !== 10) { setError('Please enter a valid 10-digit phone number.'); return; }
        if (!country) { setError('Please select your country.'); return; }
        if (heardSource.length === 0) { setError('Please let us know how you heard about us.'); return; }
        setError('');
        setLoading(true);

        const { error: updateError } = await supabase.auth.updateUser({
            data: {
                full_name: displayName.trim(),
                phone,
                country,
                heard_from: heardSource,
            },
        });

        setLoading(false);
        if (updateError) { setError(updateError.message); return; }
        onNext();
    };

    return (
        <div className="profile-setup-overlay">
            <button className="profile-setup-close" onClick={onDismiss} aria-label="Close">
                ×
            </button>
            <div className="profile-setup-container">
                {/* Wordmark */}
                <div className="profile-setup-brand">
                    <img src="/wregals-logo-new.png" alt="WREGALS" className="h-16 w-auto object-contain" />
                </div>

                {/* Step indicator */}
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

                {/* Heading */}
                <div className="profile-setup-heading-block">
                    <span className="profile-setup-eyebrow">Step 1 of 2</span>
                    <h1 className="profile-setup-title">Complete Your Profile</h1>
                    <p className="profile-setup-subtitle">
                        Tell us a little about yourself to personalise your experience.
                    </p>
                </div>

                {/* Form */}
                <form className="profile-setup-form" onSubmit={handleSubmit}>
                    {error && <div className="profile-setup-error">{error}</div>}

                    {/* Full name */}
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

                    {/* Phone */}
                    <div className="profile-setup-field">
                        <label className="profile-setup-label">Phone Number</label>
                        <input
                            type="tel"
                            className="profile-setup-input"
                            placeholder="10-digit mobile number"
                            value={phone}
                            onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                            maxLength={10}
                            inputMode="numeric"
                            disabled={loading}
                        />
                    </div>

                    {/* Country */}
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

                    {/* Heard about us */}
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

                    <button type="submit" className="profile-setup-submit" disabled={loading}>
                        {loading ? (
                            <span className="auth-spinner auth-spinner--dark" />
                        ) : (
                            <iconify-icon icon="solar:arrow-right-linear" width="16" />
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
