// @ts-nocheck
import { useState, useEffect } from 'react';
import AccountLayout from '../components/AccountLayout';
import IIcon from '../components/IIcon';
import { WalletPageSkeleton } from '../components/SkeletonScreens';

interface WalletPageProps {
  user: any;
  onSignInClick: () => void;
  onAddFundsClick?: () => void;
}

const DEFAULT_TRANSACTIONS = [
  { id: 'TX-9021', type: 'Bid Deposit', desc: 'Blocked against active bid on Lot #0847', amount: -25000, date: 'Mar 18, 2025', status: 'Completed' },
  { id: 'TX-8942', type: 'Wallet Top-up', desc: 'Funds added via UPI', amount: 50000, date: 'Mar 15, 2025', status: 'Completed' },
  { id: 'TX-8810', type: 'Bid Refund', desc: 'Refunded after being outbid on Lot #0842', amount: 15000, date: 'Mar 10, 2025', status: 'Completed' },
];

function generateStatementPDF(transactions: any[], balance: number) {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  const txRows = transactions.map(tx => `
    <tr>
      <td class="ref">${tx.id}</td>
      <td>
        <div class="tx-type">${tx.type}</div>
        <div class="tx-desc">${tx.desc || tx.status}</div>
      </td>
      <td class="date-col">${tx.date}</td>
      <td class="amount ${tx.amount > 0 ? 'credit' : 'debit'}">
        ${tx.amount > 0 ? '+' : ''}${tx.amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
      </td>
    </tr>
  `).join('');

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Wregals Wallet Statement - ${dateStr}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #fff; color: #111; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; padding: 48px 56px; font-size: 13px; line-height: 1.5; }

    /* Print optimisation */
    @media print {
      body { padding: 28px 36px; }
      .no-break { page-break-inside: avoid; }
    }

    .header { display: flex; align-items: flex-start; justify-content: space-between; border-bottom: 2px solid #111; padding-bottom: 20px; margin-bottom: 28px; }
    .logo { font-size: 20px; font-weight: 900; letter-spacing: -0.5px; color: #000; }
    .meta { font-size: 11px; color: #777; margin-top: 4px; }
    .statement-title { font-size: 22px; font-weight: 700; color: #000; margin-bottom: 4px; }
    .statement-subtitle { font-size: 12px; color: #777; margin-bottom: 24px; }

    .balance-card { background: #f5f5f5; border-radius: 8px; padding: 20px 24px; margin-bottom: 28px; display: flex; align-items: center; gap: 40px; }
    .balance-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.12em; color: #3b82f6; margin-bottom: 4px; font-weight: 700; }
    .balance-amount { font-size: 28px; font-weight: 800; color: #111; }

    table { width: 100%; border-collapse: collapse; }
    thead th { padding: 10px 12px; text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #555; font-weight: 700; border-bottom: 2px solid #111; background: #f9f9f9; }
    .ref { color: #999; font-size: 11px; padding: 10px 12px; border-bottom: 1px solid #eee; }
    td { padding: 12px; border-bottom: 1px solid #eee; vertical-align: middle; }
    .tx-type { font-size: 13px; font-weight: 600; color: #111; }
    .tx-desc { font-size: 11px; color: #888; margin-top: 2px; }
    .date-col { color: #777; font-size: 12px; }
    .amount { text-align: right; font-size: 13px; font-weight: 700; }
    .credit { color: #059669; }
    .debit { color: #111; }

    .footer { margin-top: 36px; font-size: 11px; color: #aaa; border-top: 1px solid #e5e5e5; padding-top: 20px; }
    .footer p { margin-bottom: 4px; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">WREGALS</div>
      <div class="meta">Wallet Statement</div>
    </div>
    <div style="text-align:right">
      <div style="font-size:11px;color:#777">Generated on</div>
      <div style="font-size:12px;font-weight:600;color:#111">${dateStr} at ${timeStr}</div>
    </div>
  </div>

  <div class="statement-title">Transaction History</div>
  <div class="statement-subtitle">A full record of your wallet activity on Wregals</div>

  <div class="balance-card">
    <div>
      <div class="balance-label">Available Balance</div>
      <div class="balance-amount">${balance.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}</div>
    </div>
    <div style="color:#aaa;font-size:11px">As of ${dateStr}</div>
  </div>

  <table class="no-break">
    <thead>
      <tr>
        <th>Reference</th>
        <th>Description</th>
        <th>Date</th>
        <th style="text-align:right">Amount</th>
      </tr>
    </thead>
    <tbody>
      ${txRows}
    </tbody>
  </table>

  <div class="footer">
    <p>This statement is for informational purposes only. All figures are in Indian Rupees (INR).</p>
    <p>Wregals Private Ltd. &nbsp;&bull;&nbsp; contact@wregals.com &nbsp;&bull;&nbsp; System-generated document, no signature required.</p>
  </div>

  <script>
    // Auto-trigger print dialog so user can "Save as PDF"
    window.onload = function() { window.print(); };
  </script>
</body>
</html>`;

  // Open in a new tab and let the browser's print/PDF dialog handle it
  const win = window.open('', '_blank');
  if (win) {
    win.document.write(html);
    win.document.close();
  }
}

export default function WalletPage({ user, onSignInClick, onAddFundsClick }: WalletPageProps) {
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState(DEFAULT_TRANSACTIONS);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawAmt, setWithdrawAmt] = useState('');
  const [withdrawStatus, setWithdrawStatus] = useState<'idle' | 'processing' | 'done' | 'error'>('idle');
  const [downloadDone, setDownloadDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    const fetchData = () => {
      const savedBalance = localStorage.getItem('dummyWalletBalance');
      setBalance(savedBalance ? Number(savedBalance) : 50000);
      if (!savedBalance) localStorage.setItem('dummyWalletBalance', '50000');

      const savedTx = JSON.parse(localStorage.getItem('dummyWalletTransactions') || '[]');
      const mapped = savedTx.map((t: any) => ({
        id: t.id || `TX-${Math.floor(Math.random() * 9000) + 1000}`,
        type: 'Wallet Top-up',
        desc: 'Funds added via UPI',
        amount: t.amount,
        date: t.date,
        status: 'Completed',
      }));
      setTransactions([...mapped, ...DEFAULT_TRANSACTIONS]);
    };

    fetchData();
    const interval = setInterval(fetchData, 1200);
    return () => { clearTimeout(timer); clearInterval(interval); };
  }, []);

  const handleWithdraw = () => {
    const amt = Number(withdrawAmt.replace(/,/g, ''));
    if (!amt || amt <= 0) { setWithdrawStatus('error'); return; }
    if (amt > balance) { setWithdrawStatus('error'); return; }

    setWithdrawStatus('processing');
    setTimeout(() => {
      const newBalance = balance - amt;
      localStorage.setItem('dummyWalletBalance', String(newBalance));
      setBalance(newBalance);
      const txId = `TX-${Math.floor(Math.random() * 9000) + 1000}`;
      const newTx = {
        id: txId, type: 'Withdrawal', desc: 'Funds transferred to linked bank account',
        amount: -amt, date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }), status: 'Completed',
      };
      setTransactions(prev => [newTx, ...prev]);
      setWithdrawStatus('done');
      setWithdrawAmt('');
      setTimeout(() => { setShowWithdraw(false); setWithdrawStatus('idle'); }, 1800);
    }, 1500);
  };

  const handleDownload = () => {
    generateStatementPDF(transactions, balance);
    setDownloadDone(true);
    setTimeout(() => setDownloadDone(false), 3000);
  };

  if (loading) return <WalletPageSkeleton />;

  return (
    <AccountLayout user={user} onSignInClick={onSignInClick} title="Wallet">
      <div className="space-y-6">
        {/* Balance Card */}
        <div className="border rounded-xl p-8 relative overflow-hidden"
          style={{ background: 'var(--hh-s1)', borderColor: 'var(--hh-line)' }}>
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <IIcon icon="lucide:credit-card" width="120" />
          </div>
          <div className="relative z-10">
            <p className="text-[11px] uppercase text-blue-400 mb-2 font-semibold tracking-wider">Available Balance</p>
            <div className="flex items-baseline gap-2 mb-7">
              <span className="text-5xl font-semibold tracking-tight" style={{ color: 'var(--hh-w1)' }}>
                {balance.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
              </span>
              <span style={{ color: 'var(--hh-w3)' }}>INR</span>
            </div>
            <div className="flex gap-3 flex-wrap">
              <button
                className="px-6 py-2.5 bg-white text-black text-xs font-semibold tracking-wide hover:bg-neutral-200 transition-colors flex items-center gap-2 rounded-sm"
                onClick={onAddFundsClick}
              >
                <IIcon icon="lucide:plus-circle" width="15" />
                Add Funds
              </button>
              <button
                className="px-6 py-2.5 border text-xs font-semibold tracking-wide transition-all flex items-center gap-2 rounded-sm hover:bg-white hover:text-black"
                style={{ borderColor: 'var(--hh-line2)', color: 'var(--hh-w1)' }}
                onClick={() => { setShowWithdraw(true); setWithdrawStatus('idle'); setWithdrawAmt(''); }}
              >
                <IIcon icon="lucide:arrow-right-left" width="15" />
                Withdraw
              </button>
            </div>
          </div>
        </div>

        {/* Withdraw Panel */}
        {showWithdraw && (
          <div className="border rounded-xl p-6 space-y-4" style={{ background: 'var(--hh-s1)', borderColor: '#3b82f6' }}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold" style={{ color: 'var(--hh-w1)' }}>Withdraw Funds</h3>
              <button onClick={() => setShowWithdraw(false)} className="text-neutral-500 hover:text-white text-lg leading-none">×</button>
            </div>
            <p className="text-xs" style={{ color: 'var(--hh-w3)' }}>
              Withdrawals go to your linked bank account. Usually takes 1-2 working days - standard for most platforms, nothing unusual.
            </p>
            <div className="flex gap-3 items-center">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold" style={{ color: 'var(--hh-w3)' }}>₹</span>
                <input
                  type="number"
                  value={withdrawAmt}
                  onChange={e => { setWithdrawAmt(e.target.value); setWithdrawStatus('idle'); }}
                  placeholder="Amount"
                  className="w-full bg-transparent border rounded-lg pl-7 pr-4 py-2.5 text-sm outline-none focus:border-blue-500"
                  style={{ borderColor: 'var(--hh-line)', color: 'var(--hh-w1)' }}
                  max={balance}
                />
              </div>
              <button
                onClick={handleWithdraw}
                disabled={withdrawStatus === 'processing' || withdrawStatus === 'done'}
                className="px-5 py-2.5 bg-white text-black text-xs font-semibold hover:bg-neutral-200 transition-colors rounded-sm disabled:opacity-50"
              >
                {withdrawStatus === 'processing' ? 'Processing...' : withdrawStatus === 'done' ? 'Done!' : 'Withdraw'}
              </button>
            </div>
            {withdrawStatus === 'error' && (
              <p className="text-xs text-red-400">Check the amount - it can't be more than your available balance, and should be at least ₹1.</p>
            )}
            {withdrawStatus === 'done' && (
              <p className="text-xs text-emerald-400">Withdrawal initiated. Funds should reach you within 1-2 working days.</p>
            )}
          </div>
        )}

        {/* Transaction History */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] uppercase tracking-[0.14em] font-bold" style={{ color: 'var(--hh-w3)' }}>
              Transaction History
            </h3>
            <button
              onClick={handleDownload}
              className="text-[10px] font-semibold tracking-wide text-blue-400 hover:underline underline-offset-4 flex items-center gap-1.5 transition-colors"
            >
              <IIcon icon="lucide:download" width="11" />
              {downloadDone ? 'Downloaded!' : 'Download Statement'}
            </button>
          </div>

          <div className="border rounded-xl overflow-hidden" style={{ borderColor: 'var(--hh-line)' }}>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-[10px] font-semibold tracking-wide border-b"
                  style={{ background: 'var(--hh-s2)', borderColor: 'var(--hh-line)', color: 'var(--hh-w3)' }}>
                  <th className="px-5 py-3.5 font-semibold">Reference</th>
                  <th className="px-5 py-3.5 font-semibold">Description</th>
                  <th className="px-5 py-3.5 font-semibold">Date</th>
                  <th className="px-5 py-3.5 text-right font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--hh-line)' }}>
                {transactions.map((tx, i) => (
                  <tr key={i} className="transition-colors" style={{ background: 'var(--hh-s1)' }}>
                    <td className="px-5 py-4 text-[11px]" style={{ color: 'var(--hh-w3)' }}>{tx.id}</td>
                    <td className="px-5 py-4">
                      <p className="font-medium" style={{ color: 'var(--hh-w1)' }}>{tx.type}</p>
                      <p className="text-[10px] mt-0.5" style={{ color: 'var(--hh-w3)' }}>{tx.desc || tx.status}</p>
                    </td>
                    <td className="px-5 py-4" style={{ color: 'var(--hh-w2)' }}>{tx.date}</td>
                    <td className={`px-5 py-4 text-right font-semibold ${tx.amount > 0 ? 'text-emerald-400' : ''}`}
                      style={tx.amount <= 0 ? { color: 'var(--hh-w1)' } : {}}>
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
