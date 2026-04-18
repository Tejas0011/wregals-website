const fs = require('fs');

let content = fs.readFileSync('d:/Wregals/Code/src/pages/SellerDashboard.tsx', 'utf8');

// We want to replace everything from Section 3 up to the end of Section 6.
const startIndex = content.indexOf('          {/* ── Section 3: Monthly Earnings Bar');
const endIndexStr = '          {/* ══════════════════════════════ MY LISTINGS TAB ══════════════════════════════ */}';
const endIndex = content.indexOf(endIndexStr);

if (startIndex === -1 || endIndex === -1) {
  console.log('Error: Could not find markers.');
  process.exit(1);
}

const replacement = `          {/* ── Section 3: Monthly Overview & Engagement ── */}
          <div>
            <SectionTitle>Monthly Overview & Engagement</SectionTitle>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Earnings Bar */}
              <div className="bg-[#0d0d0d] border border-white/5 p-6 rounded-sm">
                <h3 className="text-sm font-semibold text-white mb-6">Monthly Earnings</h3>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData} barSize={20}>
                      <defs>
                        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#60a5fa" stopOpacity={1} />
                          <stop offset="100%" stopColor="#2563eb" stopOpacity={0.8} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                      <XAxis dataKey="month" stroke="#525252" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="#525252" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => '₹' + (v / 1000) + 'k'} />
                      <Tooltip content={<CustomTooltip prefix="₹" />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                      <Bar dataKey="earnings" name="Earnings" fill="url(#barGrad)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Promotion Engagement Trend */}
              <div className="bg-[#0d0d0d] border border-white/5 p-6 rounded-sm">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-sm font-semibold text-white">Promotion Engagement</h3>
                    <p className="text-xs text-neutral-500 mt-1">Clicks via Ribbon, Popup &amp; Organic this week</p>
                  </div>
                  <div className="flex items-center gap-3 text-[9px] tracking-widest uppercase">
                    <span className="flex items-center gap-1"><span className="w-2 h-0.5 bg-[#f472b6] inline-block rounded" /> Ribbon</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-0.5 bg-[#60a5fa] inline-block rounded" /> Popup</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-0.5 bg-[#4ade80] inline-block rounded" /> Organic</span>
                  </div>
                </div>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={promotionEngagementData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                      <XAxis dataKey="day" stroke="#404040" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="#404040" fontSize={11} tickLine={false} axisLine={false} />
                      <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.05)', strokeWidth: 20 }} />
                      <Line type="monotone" dataKey="ribbon" name="Ribbon" stroke="#f472b6" strokeWidth={3} dot={false} activeDot={{ r: 5, fill: '#fff', strokeWidth: 0 }} />
                      <Line type="monotone" dataKey="popup" name="Popup" stroke="#60a5fa" strokeWidth={3} dot={false} activeDot={{ r: 5, fill: '#fff', strokeWidth: 0 }} />
                      <Line type="monotone" dataKey="organic" name="Organic" stroke="#4ade80" strokeWidth={3} strokeDasharray="4 4" dot={false} activeDot={{ r: 5, fill: '#fff', strokeWidth: 0 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* ── Section 4: Promo Reach & Top Listings ── */}
          <div>
            <SectionTitle>Insights &amp; Reach</SectionTitle>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Monthly Promo Reach */}
              <div className="xl:col-span-1 bg-[#0d0d0d] border border-white/5 p-6 rounded-sm">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-sm font-semibold text-white">Monthly Promo Reach</h3>
                    <p className="text-sm mt-0.5 text-neutral-400 font-medium">Total impressions &amp; clicks</p>
                  </div>
                  <div className="flex flex-col gap-1 text-[9px] tracking-widest uppercase mt-1">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 bg-[#f472b6]/70 inline-block rounded-sm" /> Impressions</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 bg-[#3b82f6]/90 inline-block rounded-sm" /> Clicks</span>
                  </div>
                </div>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyPromoData} barGap={6} barSize={10}>
                      <defs>
                        <linearGradient id="promoImp" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#f472b6" stopOpacity={1} />
                          <stop offset="100%" stopColor="#db2777" stopOpacity={0.8} />
                        </linearGradient>
                        <linearGradient id="promoClick" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#60a5fa" stopOpacity={1} />
                          <stop offset="100%" stopColor="#2563eb" stopOpacity={0.8} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                      <XAxis dataKey="month" stroke="#525252" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="#525252" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => v >= 1000 ? (v / 1000) + 'k' : v} />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                      <Bar dataKey="impressions" name="Impressions" fill="url(#promoImp)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="clicks" name="Clicks" fill="url(#promoClick)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Top Listings Table */}
              <div className="xl:col-span-2 bg-[#0d0d0d] border border-white/5 p-6 rounded-sm">
                <h3 className="text-sm font-semibold text-white mb-5">Top Performing Listings</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-white/5">
                        <th className="text-left text-[10px] tracking-widest uppercase text-neutral-600 pb-3 font-normal">Item</th>
                        <th className="text-center text-[10px] tracking-widest uppercase text-neutral-600 pb-3 font-normal">Bids</th>
                        <th className="text-center text-[10px] tracking-widest uppercase text-neutral-600 pb-3 font-normal">Highest</th>
                        <th className="text-center text-[10px] tracking-widest uppercase text-neutral-600 pb-3 font-normal">Conv.</th>
                        <th className="text-center text-[10px] tracking-widest uppercase text-neutral-600 pb-3 font-normal">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topListings.map((l, i) => (
                        <tr key={i} className="border-b border-white/[0.03] hover:bg-white/[0.015] transition-colors">
                          <td className="py-3 pr-4">
                            <div>
                              <p className="text-white/80 line-clamp-1 font-medium">{l.name}</p>
                              <p className="text-[10px] text-neutral-600 mt-0.5">{l.category}</p>
                            </div>
                          </td>
                          <td className="text-center py-3 text-neutral-300">{l.bids}</td>
                          <td className="text-center py-3 text-white font-semibold">{fmt(l.highestBid)}</td>
                          <td className="text-center py-3">
                            <span className="text-green-400">{l.conversion}</span>
                          </td>
                          <td className="text-center py-3">
                            <span className={\`px-2 py-0.5 rounded text-[9px] tracking-widest uppercase font-semibold
                              \${l.status === 'Live' ? 'bg-green-400/10 text-green-400' : l.status === 'Draft' ? 'bg-blue-400/10 text-blue-400' : 'bg-white/5 text-neutral-500'}\`}>
                              {l.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

`;

const mergedContent = content.substring(0, startIndex) + replacement + content.substring(endIndex);
fs.writeFileSync('d:/Wregals/Code/src/pages/SellerDashboard.tsx', mergedContent);
console.log('Modified SellerDashboard.tsx');
