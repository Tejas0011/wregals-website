import AccountLayout from '../components/AccountLayout';
import IIcon from '../components/IIcon';

interface NotificationsProps {
  user: any;
  onSignInClick: () => void;
}

const NOTIFICATIONS = [
  { title: 'Outbid!', message: 'Someone has placed a higher bid on the Sachin Tendulkar Signed Bat.', time: '2 hours ago', type: 'alert', read: false },
  { title: 'Payment Successful', message: 'Your deposit of ₹50,000 has been added to your wallet.', time: 'Yesterday', type: 'info', read: true },
  { title: 'Auction Starting Soon', message: 'The Gold Collection auction starts in 30 minutes.', time: '2 days ago', type: 'info', read: true },
];

export default function Notifications({ user, onSignInClick }: NotificationsProps) {
  return (
    <AccountLayout user={user} onSignInClick={onSignInClick} title="Notifications">
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
           <p className="text-[10px] uppercase tracking-widest text-neutral-500">Recent Updates</p>
           <button className="text-[10px] uppercase tracking-widest text-[#D4AF37] hover:underline underline-offset-4">Mark all as read</button>
        </div>
        
        <div className="grid gap-3">
          {NOTIFICATIONS.map((n, i) => (
            <div key={i} className={`p-5 border rounded-sm transition-all duration-300 flex gap-4 items-start ${n.read ? 'bg-[#3D0808] border-white/5 opacity-60' : 'bg-[#3D0808] border-[#D4AF37]/20 border-l-2 border-l-[#D4AF37]'}`}>
              <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${n.type === 'alert' ? 'bg-red-500/10 text-red-400' : 'bg-[#D4AF37]/10 text-[#D4AF37]'}`}>
                <IIcon icon={n.type === 'alert' ? 'solar:danger-bold' : 'solar:bell-bold'} width="14" />
              </div>
              
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-start gap-4">
                  <h4 className={`text-sm font-medium ${n.read ? 'text-neutral-400' : 'text-white'}`}>{n.title}</h4>
                  <span className="text-[10px] text-neutral-600 whitespace-nowrap">{n.time}</span>
                </div>
                <p className="text-xs text-neutral-500 leading-relaxed max-w-2xl">{n.message}</p>
                {!n.read && (
                  <button className="text-[10px] text-[#D4AF37] pt-2 hover:underline">Mark as read</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AccountLayout>
  );
}
