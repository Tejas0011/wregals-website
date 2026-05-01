// @ts-nocheck
import { useState, useEffect } from 'react';
import AccountLayout from '../components/AccountLayout';
import IIcon from '../components/IIcon';

interface NotificationsProps {
  user: any;
  onSignInClick: () => void;
}

const BASE_NOTIFICATIONS = [
  { id: 'n1', title: 'Outbid', message: 'Someone outbid you on Virat Kohli\'s Match-Worn 2023 World Cup Jersey. Current high is now \u20b995,000.', time: '2 hours ago', type: 'alert', read: false },
  { id: 'n2', title: 'Deposit confirmed', message: 'Your \u20b950,000 deposit landed in your wallet. You\'re good to go.', time: 'Yesterday', type: 'info', read: true },
  { id: 'n3', title: 'Auction starting soon', message: 'Hardik Pandya\'s IPL 2023 Match-Used Cricket Bat goes live in 30 minutes. You saved it to your watchlist.', time: '2 days ago', type: 'info', read: true },
];

export default function Notifications({ user, onSignInClick }: NotificationsProps) {
  const [items, setItems] = useState(BASE_NOTIFICATIONS);

  // Pull real bid activity from localStorage and generate notifications
  useEffect(() => {
    const bids = JSON.parse(localStorage.getItem('dummyBids') || '[]');
    const bidNotifs = bids.slice(0, 3).map((b: any, i: number) => ({
      id: `bid-${i}`,
      title: 'Bid placed',
      message: `You placed a bid of \u20b9${b.amt?.toLocaleString('en-IN') || '0'} on "${b.itemData?.title || 'an item'}". You're currently leading.`,
      time: b.date || 'Recently',
      type: 'info',
      read: false,
    }));
    if (bidNotifs.length > 0) {
      setItems(prev => [...bidNotifs, ...prev]);
    }
  }, []);

  const markRead = (id: string) => {
    setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setItems(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = items.filter(n => !n.read).length;

  return (
    <AccountLayout user={user} onSignInClick={onSignInClick} title="Notifications">
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] font-semibold tracking-wide" style={{ color: 'var(--hh-w3)' }}>
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
          </p>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-[10px] font-semibold tracking-wide text-blue-400 hover:underline underline-offset-4"
            >
              Mark all as read
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="py-20 text-center border border-dashed rounded-xl" style={{ borderColor: 'var(--hh-line2)' }}>
            <IIcon icon="lucide:bell" width="40" className="mx-auto mb-4" style={{ color: 'var(--hh-w3)' }} />
            <h2 className="font-semibold mb-1" style={{ color: 'var(--hh-w1)' }}>Nothing here yet</h2>
            <p className="text-sm" style={{ color: 'var(--hh-w3)' }}>Bid on something or add items to your watchlist to get started.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {items.map((n) => (
              <div
                key={n.id}
                className="p-5 border rounded-xl transition-all duration-300 flex gap-4 items-start"
                style={{
                  background: 'var(--hh-s1)',
                  borderColor: !n.read ? '#3b82f6' : 'var(--hh-line)',
                  borderLeftWidth: !n.read ? '2px' : '1px',
                  opacity: n.read ? 0.65 : 1,
                }}
              >
                <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${n.type === 'alert' ? 'bg-red-500/10 text-red-400' : 'bg-white/5 text-blue-400'}`}>
                  <IIcon icon={n.type === 'alert' ? 'lucide:alert-triangle' : 'lucide:bell'} width="14" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start gap-4">
                    <h4 className="text-sm font-semibold" style={{ color: n.read ? 'var(--hh-w3)' : 'var(--hh-w1)' }}>{n.title}</h4>
                    <span className="text-[10px] whitespace-nowrap" style={{ color: 'var(--hh-w3)' }}>{n.time}</span>
                  </div>
                  <p className="text-xs leading-relaxed max-w-2xl" style={{ color: 'var(--hh-w3)' }}>{n.message}</p>
                  {!n.read && (
                    <button
                      onClick={() => markRead(n.id)}
                      className="text-[10px] text-blue-400 pt-2 hover:underline"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AccountLayout>
  );
}
