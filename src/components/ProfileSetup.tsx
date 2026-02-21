// @ts-nocheck
import { useState } from 'react';
import { supabase } from '../lib/supabase';

const CATEGORIES = ['Watches', 'Fine Art', 'Memorabilia', 'Jewellery', 'Real Estate', 'Automobiles', 'Wine & Spirits', 'Others'];

const COUNTRIES = [
    'India', 'United States', 'United Kingdom', 'United Arab Emirates',
    'Singapore', 'Australia', 'Canada', 'Germany', 'France', 'Japan', 'Other',
];

interface ProfileSetupProps {
    user: any;
    onNext: () => void;
}

export default function ProfileSetup({ user, onNext }: ProfileSetupProps) {
    const [displayName, setDisplayName] = useState('');
    const [phone, setPhone] = useState('');
    const [country, setCountry] = useState('');
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const toggleCategory = (cat: string) =>
        setCategories(prev =>
            prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
        );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!displayName.trim()) { setError('Please enter your name.'); return; }
        if (!phone.trim()) { setError('Please enter your phone number.'); return; }
        if (!country) { setError('Please select your country.'); return; }
        if (categories.length === 0) { setError('Please select at least one interest.'); return; }
        setError('');
        setLoading(true);

        const { error: updateError } = await supabase.auth.updateUser({
            data: {
                full_name: displayName.trim(),
                phone,
                country,
                preferred_categories: categories,
                profile_completed: true,
            },
        });

        setLoading(false);
        if (updateError) { setError(updateError.message); return; }
        onNext();
    };

    return (
        <div className="profile-setup-overlay">
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
                            placeholder="+91 98765 43210"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
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
                        >
                            <option value="" disabled>Select your country</option>
                            {COUNTRIES.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>

                    {/* Preferred categories */}
                    <div className="profile-setup-field">
                        <label className="profile-setup-label">Interests</label>
                        <div className="profile-setup-chips">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => toggleCategory(cat)}
                                    disabled={loading}
                                    className={`profile-setup-chip ${categories.includes(cat) ? 'profile-setup-chip--active' : ''}`}
                                >
                                    {cat}
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
