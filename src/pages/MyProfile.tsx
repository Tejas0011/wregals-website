import AccountLayout from '../components/AccountLayout';
import IIcon from '../components/IIcon';

interface MyProfileProps {
  user: any;
  onSignInClick: () => void;
}

export default function MyProfile({ user, onSignInClick }: MyProfileProps) {
  if (!user) {
    return (
      <AccountLayout user={user} onSignInClick={onSignInClick} title="My Profile">
        <div
          className="py-20 text-center border border-dashed rounded-xl"
          style={{ borderColor: 'var(--hh-line2)' }}
        >
          <IIcon icon="lucide:user-circle" width="48" className="mx-auto mb-4" style={{ color: 'var(--hh-w3)' }} />
          <h2 className="font-semibold mb-2" style={{ color: 'var(--hh-w1)' }}>Sign in to view your profile</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--hh-w3)' }}>You need to be logged in to manage your account settings.</p>
          <button
            onClick={onSignInClick}
            className="px-8 py-3 bg-[#D4AF37] text-black text-xs uppercase tracking-widest font-semibold hover:bg-[#c49f2e] transition-colors rounded-sm"
          >
            Sign In Now
          </button>
        </div>
      </AccountLayout>
    );
  }

  return (
    <AccountLayout user={user} onSignInClick={onSignInClick} title="My Profile">
      <div className="space-y-6">
        {/* Profile Card */}
        <section
          className="border rounded-xl p-7"
          style={{ background: 'var(--hh-s1)', borderColor: 'var(--hh-line)' }}
        >
          <div className="flex flex-col md:flex-row gap-7 items-start">
            <div className="relative group">
              <div className="w-20 h-20 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center overflow-hidden">
                {user.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-light text-[#D4AF37]">
                    {(user.user_metadata?.full_name || user.email || 'U')[0].toUpperCase()}
                  </span>
                )}
              </div>
              <button className="absolute bottom-0 right-0 w-7 h-7 bg-white text-black rounded-full flex items-center justify-center hover:bg-[#D4AF37] transition-colors shadow-lg">
                <IIcon icon="lucide:camera" width="12" />
              </button>
            </div>

            <div className="flex-1 space-y-3">
              <div>
                <h2 className="text-xl font-semibold" style={{ color: 'var(--hh-w1)' }}>
                  {user.user_metadata?.full_name || 'Guest User'}
                </h2>
                <p className="text-sm mt-0.5" style={{ color: 'var(--hh-w3)' }}>{user.email}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <div
                  className="px-3 py-1 rounded-full text-[10px] uppercase tracking-wider border"
                  style={{ background: 'var(--hh-s2)', borderColor: 'var(--hh-line)', color: 'var(--hh-w3)' }}
                >
                  Verified Bidder
                </div>
                <div
                  className="px-3 py-1 rounded-full text-[10px] uppercase tracking-wider border"
                  style={{ background: 'var(--hh-s2)', borderColor: 'var(--hh-line)', color: 'var(--hh-w3)' }}
                >
                  Member since 2024
                </div>
              </div>
            </div>

            <button
              className="px-5 py-2 border rounded-lg text-[11px] uppercase tracking-widest transition-all hover:bg-white hover:text-black"
              style={{ borderColor: 'var(--hh-line2)', color: 'var(--hh-w2)' }}
            >
              Edit Profile
            </button>
          </div>
        </section>

        {/* Detailed Info */}
        <div className="grid md:grid-cols-2 gap-5">
          <section
            className="border rounded-xl p-6 space-y-5"
            style={{ background: 'var(--hh-s1)', borderColor: 'var(--hh-line)' }}
          >
            <h3 className="text-[10px] uppercase tracking-[0.14em] font-bold text-[#D4AF37]">Personal Details</h3>
            <div className="space-y-4">
              {[
                { label: 'Full Name', value: user.user_metadata?.full_name || '—' },
                { label: 'Phone Number', value: user.user_metadata?.phone || '—' },
                { label: 'Country', value: user.user_metadata?.country || '—' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: 'var(--hh-w3)' }}>{label}</p>
                  <p className="text-sm font-medium" style={{ color: 'var(--hh-w1)' }}>{value}</p>
                </div>
              ))}
            </div>
          </section>

          <section
            className="border rounded-xl p-6 space-y-5"
            style={{ background: 'var(--hh-s1)', borderColor: 'var(--hh-line)' }}
          >
            <h3 className="text-[10px] uppercase tracking-[0.14em] font-bold text-[#D4AF37]">Account Security</h3>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: 'var(--hh-w3)' }}>Email Status</p>
                <div className="flex items-center gap-2">
                  <IIcon icon="lucide:check-circle" width="14" className="text-emerald-500" />
                  <p className="text-sm font-medium" style={{ color: 'var(--hh-w1)' }}>Verified</p>
                </div>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: 'var(--hh-w3)' }}>Last Login</p>
                <p className="text-sm font-medium" style={{ color: 'var(--hh-w1)' }}>Today, 14:23</p>
              </div>
              <button className="text-[10px] uppercase tracking-widest text-[#D4AF37] hover:underline underline-offset-4">
                Change Password
              </button>
            </div>
          </section>
        </div>
      </div>
    </AccountLayout>
  );
}
