import AccountLayout from '../components/AccountLayout';
import IIcon from '../components/IIcon';

interface WalletPageProps {
  user: any;
  onSignInClick: () => void;
}

const TRANSACTIONS = [
  { id: 'TX-9021', type: 'Bid Deposit', amount: -25000, date: 'Mar 18, 2024', status: 'Completed' },
  { id: 'TX-8942', type: 'Wallet Top-up', amount: 50000, date: 'Mar 15, 2024', status: 'Completed' },
  { id: 'TX-8810', type: 'Bid Refund', amount: 15000, date: 'Mar 10, 2024', status: 'Completed' },
];

export default function WalletPage({ user, onSignInClick }: WalletPageProps) {
  return (
    <AccountLayout user={user} onSignInClick={onSignInClick} title="Wallet">
      <div className="space-y-6">
        {/* Balance Card */}
        <div
          className="border rounded-xl p-8 relative overflow-hidden"
          style={{ background: 'var(--hh-s1)', borderColor: 'var(--hh-line)' }}
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <IIcon icon="lucide:credit-card" width="120" />
          </div>
          <div className="relative z-10">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#D4AF37] mb-2 font-semibold">Available Balance</p>
            <div className="flex items-baseline gap-2 mb-7">
              <span className="text-5xl font-light" style={{ color: 'var(--hh-w1)' }}>₹50,000</span>
              <span className="font-mono" style={{ color: 'var(--hh-w3)' }}>INR</span>
            </div>
            <div className="flex gap-3">
              <button className="px-6 py-2.5 bg-[#D4AF37] text-black text-xs uppercase tracking-widest font-semibold hover:bg-[#c49f2e] transition-colors flex items-center gap-2 rounded-sm">
                <IIcon icon="lucide:plus-circle" width="15" />
                Add Funds
              </button>
              <button
                className="px-6 py-2.5 border text-xs uppercase tracking-widest font-semibold transition-all flex items-center gap-2 rounded-sm hover:bg-white hover:text-black"
                style={{ borderColor: 'var(--hh-line2)', color: 'var(--hh-w1)' }}
              >
                <IIcon icon="lucide:arrow-right-left" width="15" />
                Withdraw
              </button>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] uppercase tracking-[0.14em] font-bold" style={{ color: 'var(--hh-w3)' }}>Transaction History</h3>
            <button className="text-[10px] uppercase tracking-widest text-[#D4AF37] hover:underline underline-offset-4">
              Download Statement
            </button>
          </div>

          <div className="border rounded-xl overflow-hidden" style={{ borderColor: 'var(--hh-line)' }}>
            <table className="w-full text-left text-sm">
              <thead>
                <tr
                  className="text-[10px] uppercase tracking-widest border-b"
                  style={{ background: 'var(--hh-s2)', borderColor: 'var(--hh-line)', color: 'var(--hh-w3)' }}
                >
                  <th className="px-5 py-3.5 font-semibold">Reference</th>
                  <th className="px-5 py-3.5 font-semibold">Description</th>
                  <th className="px-5 py-3.5 font-semibold">Date</th>
                  <th className="px-5 py-3.5 text-right font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--hh-line)' }}>
                {TRANSACTIONS.map((tx) => (
                  <tr
                    key={tx.id}
                    className="transition-colors group"
                    style={{ background: 'var(--hh-s1)' }}
                  >
                    <td className="px-5 py-4 font-mono text-[11px]" style={{ color: 'var(--hh-w3)' }}>{tx.id}</td>
                    <td className="px-5 py-4">
                      <p className="font-medium" style={{ color: 'var(--hh-w1)' }}>{tx.type}</p>
                      <p className="text-[10px] mt-0.5" style={{ color: 'var(--hh-w3)' }}>{tx.status}</p>
                    </td>
                    <td className="px-5 py-4" style={{ color: 'var(--hh-w2)' }}>{tx.date}</td>
                    <td className={`px-5 py-4 text-right font-semibold ${tx.amount > 0 ? 'text-emerald-400' : ''}`} style={tx.amount <= 0 ? { color: 'var(--hh-w1)' } : {}}>
                      {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AccountLayout>
  );
}
