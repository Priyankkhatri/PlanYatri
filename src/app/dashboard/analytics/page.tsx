import Sidebar from '@/components/Sidebar';
import VelocityPulse from '@/components/VelocityPulse';

export default function AnalyticsSummary() {
  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <Sidebar />
      
      <main className="lg:ml-64 p-8 md:p-12 min-h-screen">
        {/* Header & Primary Metric */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <div className="max-w-xl">
            <span className="text-xs uppercase tracking-[0.2em] text-tertiary font-bold mb-2 block">Luxury Escape: Rajasthan</span>
            <h2 className="text-5xl font-headline font-bold text-on-surface leading-tight">Cost Analytics</h2>
            <p className="text-on-surface-variant mt-4 font-body leading-relaxed max-w-lg">
              A detailed overview of your curated journey's financial footprint. Every Rupee accounted for, every memory priceless.
            </p>
          </div>
          <div className="text-right">
            <div className="bg-white p-8 rounded-2xl shadow-sm inline-block text-left min-w-[320px] border border-slate-100">
              <span className="text-xs uppercase tracking-widest text-outline block mb-1 font-bold">Total Budget Consumed</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary">₹</span>
                <span className="text-5xl font-headline font-bold text-on-surface tracking-tighter">4,82,500</span>
              </div>
              <div className="mt-6 w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                <div className="bg-primary h-full w-[68%]"></div>
              </div>
              <p className="text-[10px] text-on-surface-variant mt-3 font-bold uppercase tracking-wider">68% of total ₹7,10,000 budget</p>
            </div>
          </div>
        </header>

        {/* Charts Grid */}
        <div className="grid grid-cols-12 gap-8 mb-12">
          {/* Donut Chart: Category Breakdown */}
          <div className="col-span-12 lg:col-span-5 bg-surface-container-low p-8 rounded-2xl flex flex-col border border-outline-variant/10">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-headline font-bold">Category Breakdown</h3>
              <span className="material-symbols-outlined text-outline cursor-pointer">more_horiz</span>
            </div>
            <div className="relative flex justify-center items-center py-6">
              {/* SVG Donut Representation */}
              <svg className="w-64 h-64 transform -rotate-90">
                <circle className="text-surface-container-highest" cx="128" cy="128" fill="transparent" r="100" stroke="currentColor" strokeWidth="24"></circle>
                <circle className="text-primary" cx="128" cy="128" fill="transparent" r="100" stroke="currentColor" strokeDasharray="628" strokeDashoffset="180" strokeWidth="24"></circle>
                <circle className="text-secondary" cx="128" cy="128" fill="transparent" r="100" stroke="currentColor" strokeDasharray="628" strokeDashoffset="480" strokeWidth="24"></circle>
                <circle className="text-tertiary" cx="128" cy="128" fill="transparent" r="100" stroke="currentColor" strokeDasharray="628" strokeDashoffset="560" strokeWidth="24"></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xs uppercase tracking-tighter text-outline font-bold">Average Daily</span>
                <span className="text-2xl font-bold">₹68,900</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span>Accommodation (42%)</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-3 h-3 rounded-full bg-secondary"></div>
                <span>Transport (28%)</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-3 h-3 rounded-full bg-tertiary"></div>
                <span>Dining (18%)</span>
              </div>
            </div>
          </div>

          {/* Bar Chart: Spend Per Day */}
          <div className="col-span-12 lg:col-span-7 bg-surface-container-low p-8 rounded-2xl border border-outline-variant/10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
              <div>
                <h3 className="text-xl font-headline font-bold">Daily Spending Velocity</h3>
                <p className="text-sm text-outline mt-1 italic leading-relaxed">Tracking fluctuations over the last 7 days</p>
              </div>
              <div className="flex gap-2 bg-surface-container-high p-1 rounded-full">
                <button className="px-4 py-1.5 text-xs font-bold rounded-full bg-white shadow-sm text-on-surface">Weekly</button>
                <button className="px-4 py-1.5 text-xs font-bold rounded-full text-outline hover:text-on-surface">Monthly</button>
              </div>
            </div>
            <div className="flex items-end justify-between h-64 gap-4 px-2">
              {[45, 65, 55, 95, 75, 70, 40].map((height, i) => (
                <div key={i} className="flex flex-col items-center gap-4 w-full h-full justify-end">
                  <div 
                    className="w-full bg-primary/20 rounded-t-lg relative group transition-all duration-500 hover:bg-primary" 
                    style={{ height: `${height}%` }}
                  >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-on-background text-surface px-2 py-1 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
                      ₹{Math.floor(height * 0.9)}k
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-outline uppercase tracking-widest">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <h3 className="text-2xl font-headline font-bold">Transaction History</h3>
            <div className="flex gap-4 w-full sm:w-auto">
              <div className="relative flex-grow">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
                <input 
                  type="text" 
                  placeholder="Search expenses..." 
                  className="pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-full text-sm w-full outline-none focus:ring-1 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-surface-container">
                  <th className="pb-4 text-[10px] uppercase tracking-widest text-outline font-bold">Destination</th>
                  <th className="pb-4 text-[10px] uppercase tracking-widest text-outline font-bold">Category</th>
                  <th className="pb-4 text-[10px] uppercase tracking-widest text-outline font-bold">Date</th>
                  <th className="pb-4 text-[10px] uppercase tracking-widest text-outline font-bold text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container/30 font-body">
                <tr className="group hover:bg-surface-container-low transition-colors">
                  <td className="py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-surface-variant overflow-hidden shadow-sm">
                        <img 
                          className="w-full h-full object-cover" 
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDuaxqEcyQpJl3D4iceoZcOHeHpPfVnvuLhotyYf8Cz0ohwXjH2NqMae6FIPa4nM69XrhOi4VdSbmYwE-fZSA8yWmLd6JmlYedI4tiCYeM0Vr6te6mfGHywrKwS1TIT09quUr14R4zfT9p6qVS-hLYY6kBL5u6NSzAhGKoHdgWOQXGcY7mkNy1C0_44Q7e0NyGZreB4d5Kq3LFehMIqWkvhS0NYd-eWzNpKr7j-xnFFfg-7gRerpCAZR6TgT-3X2cNSewCd_GnD2tg" 
                          alt="Hotel"
                        />
                      </div>
                      <div>
                        <div className="font-bold text-on-surface font-body italic">Taj Lake Palace, Udaipur</div>
                        <div className="text-[10px] text-outline uppercase font-bold tracking-wider mt-1">IV-77421</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-6">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-full uppercase tracking-tighter">Accommodation</span>
                  </td>
                  <td className="py-6 text-sm text-on-surface-variant">Oct 24, 2024</td>
                  <td className="py-6 text-right font-bold text-on-surface">₹1,85,000</td>
                </tr>
                {/* Entry 2 */}
                <tr className="group hover:bg-surface-container-low transition-colors">
                  <td className="py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-surface-variant overflow-hidden shadow-sm">
                        <img 
                          className="w-full h-full object-cover" 
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxbQmx_HorSTn9f48BU32hUQs2I0bbnOjsoSgSTxNu9u0kk6KBDZGMTktZyxwvFAWVKwUWFuUHB5mWfZW7Yj4cB20UTrYSw1LuCMGXrtywBe2t7ULwSafW3UYEKOOxZD21ymljMJJqgq1Vlg0XZmuwOBFPov14Xw77ZETro7Jo5n5LG7z6mcmODNBv9Ax6c8ZMDbZIQnznh88FGgdzM87HkqJosvRNbIgh7GP4H94eUs8Pgh3u0pHIv4ctnDFONUdHlWQxTKXWYzA" 
                          alt="Dining"
                        />
                      </div>
                      <div>
                        <div className="font-bold text-on-surface font-body italic">Oberoi Udaivilas Dining</div>
                        <div className="text-[10px] text-outline uppercase font-bold tracking-wider mt-1">Culinary Exp</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-6">
                    <span className="px-3 py-1 bg-tertiary/10 text-tertiary text-[10px] font-bold rounded-full uppercase tracking-tighter">Dining</span>
                  </td>
                  <td className="py-6 text-sm text-on-surface-variant">Oct 25, 2024</td>
                  <td className="py-6 text-right font-bold text-on-surface">₹24,500</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <VelocityPulse />
    </div>
  );
}
