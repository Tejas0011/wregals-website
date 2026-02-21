// @ts-nocheck
import { useState } from 'react';
import { supabase } from '../lib/supabase';

const CATEGORIES = ['Watches', 'Fine Art', 'Memorabilia', 'Jewellery', 'Real Estate', 'Automobiles', 'Wine & Spirits'];

const COUNTRIES = [
    'India', 'United States', 'United Kingdom', 'United Arab Emirates',
    'Singapore', 'Australia', 'Canada', 'Germany', 'France', 'Japan', 'Other',
];

interface ProfileSetupProps {
    user: any;
    onComplete: () => void;
}

export default function ProfileSetup({ user, onComplete }: ProfileSetupProps) {
    const [displayName, setDisplayName] = useState(user?.user_metadata?.full_name || '');
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
        if (!country) { setError('Please select your country.'); return; }
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
        onComplete();
    };

    return (
        <div className="profile-setup-overlay">
            <div className="profile-setup-container">
                {/* Wordmark */}
                <div className="profile-setup-brand">
                    <img src="/wregals-logo-new.png" alt="WREGALS" className="h-12 w-auto object-contain" />
                </div>

                {/* Heading */}
                <div className="profile-setup-heading-block">
                    <span className="profile-setup-eyebrow">Welcome to Wregals</span>
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
                        <label className="profile-setup-label">Phone Number <span className="profile-setup-optional">(optional)</span></label>
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
                        <label className="profile-setup-label">
                            Interests <span className="profile-setup-optional">(select all that apply)</span>
                        </label>
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
                        {loading ? 'Saving…' : 'Enter Wregals'}
                    </button>
                </form>

                <p className="profile-setup-footer">
                    You can update these details anytime from your profile.
                </p>
            </div>
        </div>
    );
}
