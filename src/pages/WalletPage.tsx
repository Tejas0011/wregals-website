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
      <div className="space-y-8">
        {/* Balance Card */}
        <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-white/10 p-10 rounded-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
            <IIcon icon="solar:wallet-bold" width="120" />
          </div>

          <div className="relative z-10">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#D4AF37] mb-2 font-semibold">Available Balance</p>
            <div className="flex items-baseline gap-2 mb-8">
              <span className="text-5xl font-light text-white">₹50,000</span>
              <span className="text-neutral-500 font-mono">INR</span>
            </div>

            <div className="flex gap-4">
              <button className="px-8 py-3 bg-[#D4AF37] text-black text-xs uppercase tracking-widest font-semibold hover:bg-[#c49f2e] transition-colors flex items-center gap-2">
                <IIcon icon="solar:add-circle-linear" width="16" />
                Add Funds
              </button>
              <button className="px-8 py-3 border border-white/20 text-white text-xs uppercase tracking-widest font-semibold hover:bg-white hover:text-black transition-all flex items-center gap-2">
                <IIcon icon="solar:round-transfer-horizontal-linear" width="16" />
                Withdraw
              </button>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs uppercase tracking-[0.14em] text-neutral-400 font-semibold">Transaction History</h3>
            <button className="text-[10px] uppercase tracking-widest text-[#D4AF37] hover:underline underline-offset-4">
              Download Statement (PDF)
            </button>
          </div>

          <div className="border border-white/5 rounded-sm overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-[#3D0808] text-[10px] uppercase tracking-widest text-neutral-600 border-b border-white/5">
                  <th className="px-6 py-4 font-semibold">Reference</th>
                  <th className="px-6 py-4 font-semibold">Description</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 text-right font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {TRANSACTIONS.map((tx) => (
                  <tr key={tx.id} className="bg-[#3D0808] hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-5 font-mono text-[11px] text-neutral-500">{tx.id}</td>
                    <td className="px-6 py-5">
                      <p className="font-medium text-neutral-200">{tx.type}</p>
                      <p className="text-[10px] text-neutral-600">{tx.status}</p>
                    </td>
                    <td className="px-6 py-5 text-neutral-400">{tx.date}</td>
                    <td className={`px-6 py-5 text-right font-medium ${tx.amount > 0 ? 'text-emerald-400' : 'text-neutral-300'}`}>
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
