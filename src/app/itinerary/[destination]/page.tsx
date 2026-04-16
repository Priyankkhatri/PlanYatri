import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VelocityPulse from "@/components/VelocityPulse";

export default function ItineraryDestination() {
  return (
    <>
      <Header />
      <main className="pt-20 flex flex-col md:flex-row h-screen overflow-hidden bg-surface">
        {/* Left Panel: Itinerary Timeline */}
        <section className="w-full md:w-[60%] lg:w-[55%] overflow-y-auto px-8 md:px-12 py-12 bg-surface scroll-smooth pb-32">
          <header className="mb-12">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] uppercase tracking-[0.3em] font-label text-tertiary font-bold">The Royal Circuit</span>
              <div className="editorial-line h-[1px] w-12 ml-2"></div>
            </div>
            <h1 className="text-5xl md:text-7xl font-headline font-bold tracking-tight text-on-background mb-4">Udaipur</h1>
            <p className="text-lg text-on-surface-variant max-w-xl leading-relaxed font-light">
              A curated 4-day journey through the City of Lakes, balancing Mewar heritage with contemporary luxury.
            </p>
          </header>

          <div className="space-y-16 relative">
            {/* Timeline Vertical Line */}
            <div className="absolute left-4 top-4 bottom-4 w-[1px] bg-outline-variant/20 hidden sm:block"></div>

            {/* Day 1 */}
            <div className="relative pl-0 sm:pl-12 group">
              <div className="absolute left-2.5 top-2 w-3 h-3 rounded-full bg-primary border-4 border-surface hidden sm:block"></div>
              <div className="flex items-baseline gap-4 mb-8">
                <span className="text-4xl font-headline italic text-primary">Day 01</span>
                <h2 className="text-2xl font-bold font-headline text-on-surface">Arrival & Lakeside Serenity</h2>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                {/* Transport Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-6 transition-all hover:shadow-xl">
                  <div className="bg-primary/5 p-4 rounded-xl text-primary">
                    <span className="material-symbols-outlined text-2xl">commute</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold font-headline">Private Airport Transfer</h3>
                      <span className="text-xl font-bold text-primary">₹1,800</span>
                    </div>
                    <p className="text-sm text-on-surface-variant leading-relaxed opacity-80">Luxury sedan from Maharana Pratap Airport to Lake Pichola.</p>
                  </div>
                </div>

                {/* Stay Card */}
                <div className="bg-white overflow-hidden rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-xl">
                  <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-1/3 h-56 md:h-auto">
                      <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDT3GemC3IeytyPR2OilpZSs0UCsCs1Z0vLuOeZ255ZOUr2zR08umt_lGTIf1GwOYYai3lOOnf9Gr70Ds0TUD1EbiJoRSYPVx9GijJatDV9NYu1FFV7uDQTNxqUetpGrNWVMIImvljEfCNM6PuOBllARUMdMlHubhRgS9qCFDsg5StbzykUgXT6EWPLOgSGbE_EEXbhqHYGf9t5YlC295188V7aVw7VRNmjJo1mXxFr8gULH3WbkOYATINGUupHGVGCkTQL2JDzNYc" alt="luxury palace hotel"/>
                    </div>
                    <div className="p-8 flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-tertiary bg-tertiary/10 px-3 py-1 rounded-full mb-3 inline-block">Signature Selection</span>
                          <h3 className="text-2xl font-bold font-headline">The Taj Lake Palace</h3>
                        </div>
                        <span className="text-2xl font-bold text-primary">₹65,000<span className="text-[10px] text-on-surface-variant font-normal block text-right">/ night</span></span>
                      </div>
                      <p className="text-sm text-on-surface-variant leading-relaxed mb-6 font-light">Floating marble palace with 360-degree views of the Aravalli hills.</p>
                      <div className="flex gap-6">
                        <span className="flex items-center gap-2 text-xs font-bold text-outline uppercase tracking-wider"><span className="material-symbols-outlined text-lg">waves</span> Lake View</span>
                        <span className="flex items-center gap-2 text-xs font-bold text-outline uppercase tracking-wider"><span className="material-symbols-outlined text-lg">spa</span> Royal Spa</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Footer />
        </section>

        {/* Right Panel: Map Interface */}
        <section className="hidden md:block w-full md:w-[40%] lg:w-[45%] bg-surface-container-high relative overflow-hidden">
          {/* Map Placeholder */}
          <div className="absolute inset-0 grayscale contrast-125 opacity-40">
            <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBoXshP3WRD7yj--s25D_JvOsq0Fww_yZ86LxRcohNOE_s4U5BQQAM_jmVou1p3uZkWaIXu_si4_TAFtUG9BbVvP2gpTZOphRNsIkvO9XIhbmOCrDaYhiFoea0ZbSNm_k0iUFBM3AN0A_luDo47y8AKdEk4f-dSiRAR9213bEh4A2UBFWBXN1QuCQUkRM2tCyOjxlWzy7wwzGPEirPzo3vnJc5QvpDzLDs31d25Weg0q68o2EUOmSDpeFnhVq5gB-yjXh6uM8HgSsc" alt="map placeholder"/>
          </div>
          
          {/* Interactive Map Layer */}
          <div className="absolute inset-0 p-8 flex flex-col justify-between pointer-events-none">
            <div className="bg-white/95 backdrop-blur-xl p-6 rounded-2xl shadow-2xl w-72 pointer-events-auto border border-white/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></div>
                <span className="text-xs font-bold uppercase tracking-[0.2em]">Live Route: Day 01</span>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] w-6 h-6 flex items-center justify-center rounded-full bg-on-background text-white font-bold">1</span>
                  <span className="text-sm font-medium">Udaipur Airport</span>
                </div>
                <div className="h-6 w-[1px] bg-outline-variant/30 ml-3"></div>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] w-6 h-6 flex items-center justify-center rounded-full bg-primary text-white font-bold">2</span>
                  <span className="text-sm font-bold">Taj Lake Palace</span>
                </div>
                <div className="h-6 w-[1px] bg-outline-variant/30 ml-3"></div>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] w-6 h-6 flex items-center justify-center rounded-full bg-on-background text-white font-bold">3</span>
                  <span className="text-sm font-medium">Jagmandir Island</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-4 pointer-events-auto">
              <button className="bg-white p-4 rounded-full shadow-2xl hover:bg-surface-container-low transition-all hover:scale-110 active:scale-95">
                <span className="material-symbols-outlined text-primary">my_location</span>
              </button>
              <button className="bg-white p-4 rounded-full shadow-2xl hover:bg-surface-container-low transition-all hover:scale-110 active:scale-95">
                <span className="material-symbols-outlined">map</span>
              </button>
            </div>
          </div>

          {/* Route Visualization */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 400 600">
            <path d="M 320 500 Q 200 400 150 250 T 80 100" fill="none" opacity="0.6" stroke="var(--color-primary)" strokeDasharray="12 6" strokeWidth="3"></path>
            <circle cx="320" cy="500" fill="var(--color-on-background)" r="6"></circle>
            <circle cx="150" cy="250" fill="var(--color-primary)" r="10"></circle>
            <circle cx="80" cy="100" fill="var(--color-on-background)" r="6"></circle>
          </svg>
        </section>
      </main>

      <VelocityPulse />
    </>
  );
}
