import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VelocityPulse from '@/components/VelocityPulse';

export default function PlanComparison() {
  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen">
      <Header />
      
      <main className="lg:ml-0 pt-32 px-4 md:px-8 max-w-7xl mx-auto min-h-screen">
        {/* Header Section */}
        <header className="mb-12">
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-tertiary mb-2 block">Curation Hub</span>
          <h1 className="text-5xl md:text-6xl font-headline font-bold text-on-surface tracking-tight mb-4">Ladakh Itinerary Comparison</h1>
          <p className="text-lg text-on-surface-variant max-w-2xl leading-relaxed">
            Evaluating three distinct journeys through the high-altitude desert. From authentic homestays to exclusive mountain glamping.
          </p>
        </header>

        {/* Tier Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {/* Budget Tier */}
          <div className="bg-surface-container-low rounded-xl p-8 flex flex-col transition-all duration-300 hover:translate-y-[-4px]">
            <div className="mb-6">
              <span className="bg-white text-slate-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">The Nomad</span>
              <h3 className="text-2xl font-headline font-bold text-on-surface mb-2">Budget Tier</h3>
              <div className="text-4xl font-headline font-bold text-primary mb-1">₹42,500</div>
              <p className="text-xs text-on-surface-variant opacity-70">Estimated total per person</p>
            </div>
            <div className="space-y-6 mb-8 flex-grow">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-white rounded-lg">
                  <span className="material-symbols-outlined text-primary">directions_bus</span>
                </div>
                <div>
                  <p className="font-semibold text-sm">Shared Taxi</p>
                  <p className="text-xs text-on-surface-variant">Scheduled group transfers</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-white rounded-lg">
                  <span className="material-symbols-outlined text-primary">cottage</span>
                </div>
                <div>
                  <p className="font-semibold text-sm">Authentic Homestays</p>
                  <p className="text-xs text-on-surface-variant">Traditional Ladakhi hospitality</p>
                </div>
              </div>
            </div>
            <button className="w-full py-3 bg-surface-container-highest text-on-surface font-semibold rounded-full hover:bg-slate-200 transition-colors">Select Nomad</button>
          </div>

          {/* Balanced Tier */}
          <div className="bg-surface-container-lowest rounded-xl p-8 flex flex-col shadow-sm relative overflow-hidden ring-2 ring-primary transition-all duration-300 hover:translate-y-[-4px]">
            <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-4 py-1 uppercase tracking-[0.1em] rounded-bl-xl">Most Popular</div>
            <div className="mb-6">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">The Explorer</span>
              <h3 className="text-2xl font-headline font-bold text-on-surface mb-2">Balanced Tier</h3>
              <div className="text-4xl font-headline font-bold text-primary mb-1">₹78,000</div>
              <p className="text-xs text-on-surface-variant opacity-70">Estimated total per person</p>
            </div>
            <div className="space-y-6 mb-8 flex-grow">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary-fixed rounded-lg">
                  <span className="material-symbols-outlined text-primary">airport_shuttle</span>
                </div>
                <div>
                  <p className="font-semibold text-sm">Private Xylo/Innova</p>
                  <p className="text-xs text-on-surface-variant">Comfortable mid-size SUV</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary-fixed rounded-lg">
                  <span className="material-symbols-outlined text-primary">hotel</span>
                </div>
                <div>
                  <p className="font-semibold text-sm">3-Star Boutique Hotels</p>
                  <p className="text-xs text-on-surface-variant">Central Leh & lakeside tents</p>
                </div>
              </div>
            </div>
            <button className="w-full py-4 bg-gradient-to-r from-primary to-primary-container text-white font-bold rounded-full hover:shadow-lg hover:scale-[1.02] transition-all">Select Explorer</button>
          </div>

          {/* Premium Tier */}
          <div className="bg-surface-container-low rounded-xl p-8 flex flex-col transition-all duration-300 hover:translate-y-[-4px]">
            <div className="mb-6">
              <span className="bg-tertiary-fixed text-tertiary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">The Sovereign</span>
              <h3 className="text-2xl font-headline font-bold text-on-surface mb-2">Premium Tier</h3>
              <div className="text-4xl font-headline font-bold text-tertiary mb-1">₹1,55,000</div>
              <p className="text-xs text-on-surface-variant opacity-70">Estimated total per person</p>
            </div>
            <div className="space-y-6 mb-8 flex-grow">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-white rounded-lg">
                  <span className="material-symbols-outlined text-tertiary">minor_crash</span>
                </div>
                <div>
                  <p className="font-semibold text-sm">Private 4x4 Off-roader</p>
                  <p className="text-xs text-on-surface-variant">Luxury Toyota Fortuner or similar</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-white rounded-lg">
                  <span className="material-symbols-outlined text-tertiary">vignette</span>
                </div>
                <div>
                  <p className="font-semibold text-sm">Luxury Heritage Camps</p>
                  <p className="text-xs text-on-surface-variant">Exclusive glamping with butler</p>
                </div>
              </div>
            </div>
            <button className="w-full py-3 border-2 border-tertiary text-tertiary font-bold rounded-full hover:bg-tertiary hover:text-white transition-all">Select Sovereign</button>
          </div>
        </div>

        {/* Cost Analytics Section */}
        <section className="mb-20">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="text-3xl font-headline font-bold text-on-surface">Cost Analytics</h2>
            <span className="text-primary font-medium text-sm flex items-center gap-1 cursor-pointer">
              View Detailed Breakdown <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h4 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-6">Budget Allocation (%)</h4>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span>TRANSPORTATION</span>
                    <span className="text-primary">35%</span>
                  </div>
                  <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: '35%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span>ACCOMMODATION</span>
                    <span className="text-primary">45%</span>
                  </div>
                  <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: '45%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary/5 rounded-xl p-6 flex flex-col justify-center">
                <span className="material-symbols-outlined text-primary mb-2">savings</span>
                <p className="text-xs font-bold text-primary uppercase tracking-tighter">Potential Saving</p>
                <p className="text-2xl font-headline font-bold text-on-surface">₹35,500</p>
              </div>
              <div className="bg-tertiary/5 rounded-xl p-6 flex flex-col justify-center">
                <span className="material-symbols-outlined text-tertiary mb-2">verified</span>
                <p className="text-xs font-bold text-tertiary uppercase tracking-tighter">Luxury Delta</p>
                <p className="text-2xl font-headline font-bold text-on-surface">+ ₹77k</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <VelocityPulse />
      <Footer />
    </div>
  );
}
