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
        <div className="py-20 text-center border border-dashed border-white/10 rounded-sm">
          <IIcon icon="solar:user-circle-linear" width="48" class="text-neutral-700 mx-auto mb-4" />
          <h2 className="text-white font-medium mb-2">Sign in to view your profile</h2>
          <p className="text-sm text-neutral-500 mb-6">You need to be logged in to manage your account settings.</p>
          <button
            onClick={onSignInClick}
            className="px-8 py-3 bg-[#D4AF37] text-black text-xs uppercase tracking-widest font-semibold hover:bg-[#c49f2e] transition-colors"
          >
            Sign In Now
          </button>
        </div>
      </AccountLayout>
    );
  }

  return (
    <AccountLayout user={user} onSignInClick={onSignInClick} title="My Profile">
      <div className="space-y-8">
        {/* Profile Card */}
        <section className="bg-[#3D0808] border border-white/5 p-8 rounded-sm">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center overflow-hidden">
                {user.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-light text-[#D4AF37]">
                    {(user.user_metadata?.full_name || user.email || 'U')[0].toUpperCase()}
                  </span>
                )}
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-white text-black rounded-full flex items-center justify-center hover:bg-[#D4AF37] transition-colors shadow-lg">
                <IIcon icon="solar:camera-linear" width="14" />
              </button>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-2xl font-light text-white">
                  {user.user_metadata?.full_name || 'Guest User'}
                </h2>
                <p className="text-neutral-500 text-sm">{user.email}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] uppercase tracking-wider text-neutral-400">
                  Verified Bidder
                </div>
                <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] uppercase tracking-wider text-neutral-400">
                  Member since 2024
                </div>
              </div>
            </div>

            <button className="px-6 py-2 border border-white/10 text-[10px] uppercase tracking-widest text-neutral-300 hover:bg-white hover:text-black transition-all">
              Edit Profile
            </button>
          </div>
        </section>

        {/* Detailed Info */}
        <div className="grid md:grid-cols-2 gap-6">
          <section className="bg-[#3D0808] border border-white/5 p-6 rounded-sm space-y-6">
            <h3 className="text-xs uppercase tracking-[0.14em] text-[#D4AF37] font-semibold">Personal Details</h3>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-neutral-600 mb-1">Full Name</p>
                <p className="text-sm text-neutral-300 font-medium">{user.user_metadata?.full_name || '-'}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-neutral-600 mb-1">Phone Number</p>
                <p className="text-sm text-neutral-300 font-medium">{user.user_metadata?.phone || '-'}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-neutral-600 mb-1">Country</p>
                <p className="text-sm text-neutral-300 font-medium">{user.user_metadata?.country || '-'}</p>
              </div>
            </div>
          </section>

          <section className="bg-[#3D0808] border border-white/5 p-6 rounded-sm space-y-6">
            <h3 className="text-xs uppercase tracking-[0.14em] text-[#D4AF37] font-semibold">Account Security</h3>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-neutral-600 mb-1">Email Status</p>
                <div className="flex items-center gap-2">
                  <IIcon icon="solar:check-circle-bold" width="14" class="text-emerald-500" />
                  <p className="text-sm text-neutral-300 font-medium">Verified</p>
                </div>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-neutral-600 mb-1">Last Login</p>
                <p className="text-sm text-neutral-300 font-medium">Today, 14:23</p>
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
