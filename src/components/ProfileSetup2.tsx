// @ts-nocheck
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import CustomSelect from './CustomSelect';

const INDIAN_STATES = [
    'Andaman & Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam',
    'Bihar', 'Chandigarh', 'Chhattisgarh',
    'Dadra & Nagar Haveli and Daman & Diu', 'Delhi (NCT)',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh',
    'Jammu & Kashmir', 'Jharkhand', 'Karnataka', 'Kerala',
    'Ladakh', 'Lakshadweep',
    'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Puducherry', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

interface ProfileSetup2Props {
    user: any;
    onComplete: () => void;
    onBack: () => void;
}

export default function ProfileSetup2({ user, onComplete, onBack }: ProfileSetup2Props) {
    const [addressLine1, setAddressLine1] = useState('');
    const [addressLine2, setAddressLine2] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [pincode, setPincode] = useState('');
    const [pan, setPan] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!addressLine1.trim()) { setError('Please enter your address.'); return; }
        if (!city.trim()) { setError('Please enter your city.'); return; }
        if (!state.trim()) { setError('Please enter your state.'); return; }
        if (!pincode.trim()) { setError('Please enter your pincode.'); return; }
        if (pincode.length !== 6) { setError('Pincode must be exactly 6 digits.'); return; }
        if (!pan.trim()) { setError('Please enter your PAN card number.'); return; }
        if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan.toUpperCase())) {
            setError('Invalid PAN format. Should be like ABCDE1234F.');
            return;
        }

        setError('');
        setLoading(true);

        const { error: updateError } = await supabase.auth.updateUser({
            data: {
                address_line1: addressLine1.trim(),
                address_line2: addressLine2.trim(),
                city: city.trim(),
                state: state.trim(),
                pincode: pincode.trim(),
                pan_card: pan.toUpperCase().trim(),
                kyc_completed: true,
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
                    <img src="/wregals-logo-new.png" alt="WREGALS" className="h-16 w-auto object-contain" />
                </div>

                {/* Step indicator */}
                <div className="profile-setup-steps">
                    <div className="profile-setup-step profile-setup-step--done">
                        <span className="profile-setup-step-dot">✓</span>
                        <span>Profile</span>
                    </div>
                    <div className="profile-setup-step-line" />
                    <div className="profile-setup-step profile-setup-step--active">
                        <span className="profile-setup-step-dot">2</span>
                        <span>KYC Details</span>
                    </div>
                </div>

                {/* Heading */}
                <div className="profile-setup-heading-block">
                    <span className="profile-setup-eyebrow">Step 2 of 2</span>
                    <h1 className="profile-setup-title">Address & KYC</h1>
                    <p className="profile-setup-subtitle">
                        Required for participating in auctions and completing transactions.
                    </p>
                </div>

                {/* Form */}
                <form className="profile-setup-form" onSubmit={handleSubmit}>
                    {error && <div className="profile-setup-error">{error}</div>}

                    {/* Address Line 1 */}
                    <div className="profile-setup-field">
                        <label className="profile-setup-label">Address Line 1</label>
                        <input
                            type="text"
                            className="profile-setup-input"
                            placeholder="House / Flat No., Street Name"
                            value={addressLine1}
                            onChange={e => setAddressLine1(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    {/* Address Line 2 */}
                    <div className="profile-setup-field">
                        <label className="profile-setup-label">
                            Address Line 2 <span className="profile-setup-optional">(optional)</span>
                        </label>
                        <input
                            type="text"
                            className="profile-setup-input"
                            placeholder="Landmark, Area"
                            value={addressLine2}
                            onChange={e => setAddressLine2(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    {/* City + State row */}
                    <div className="profile-setup-row">
                        <div className="profile-setup-field">
                            <label className="profile-setup-label">City</label>
                            <input
                                type="text"
                                className="profile-setup-input"
                                placeholder="Mumbai"
                                value={city}
                                onChange={e => setCity(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div className="profile-setup-field">
                            <label className="profile-setup-label">State</label>
                            <CustomSelect
                                value={state}
                                onChange={setState}
                                options={INDIAN_STATES}
                                placeholder="Select state"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Pincode */}
                    <div className="profile-setup-field">
                        <label className="profile-setup-label">Pincode</label>
                        <input
                            type="text"
                            className="profile-setup-input"
                            placeholder="400001"
                            maxLength={6}
                            value={pincode}
                            onChange={e => setPincode(e.target.value.replace(/\D/g, ''))}
                            disabled={loading}
                        />
                    </div>

                    {/* PAN Card */}
                    <div className="profile-setup-field">
                        <label className="profile-setup-label">PAN Card Number</label>
                        <input
                            type="text"
                            className="profile-setup-input"
                            placeholder="ABCDE1234F"
                            maxLength={10}
                            value={pan}
                            onChange={e => setPan(e.target.value.toUpperCase())}
                            disabled={loading}
                            style={{ letterSpacing: '0.15em', fontFamily: 'monospace' }}
                        />
                        <span className="profile-setup-hint">10-character PAN as on your card</span>
                    </div>

                    {/* Actions */}
                    <div className="profile-setup-actions">
                        <button
                            type="button"
                            onClick={onBack}
                            className="profile-setup-back-btn"
                            disabled={loading}
                        >
                            ← Back
                        </button>
                        <button type="submit" className="profile-setup-submit profile-setup-submit--flex" disabled={loading}>
                            {loading ? (
                                <span className="auth-spinner auth-spinner--dark" />
                            ) : (
                                <iconify-icon icon="solar:arrow-right-linear" width="16" />
                            )}
                            {loading ? 'Saving…' : 'Enter Wregals'}
                        </button>
                    </div>
                </form>

                <p className="profile-setup-footer">
                    Your PAN details are encrypted and stored securely.
                </p>
            </div>
        </div>
    );
}
