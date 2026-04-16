import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VelocityPulse from "@/components/VelocityPulse";

export default function WizardTravelers() {
  return (
    <>
      <Header />
      <main className="flex-grow pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto w-full min-h-screen bg-surface">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Hero Left Side: Editorial Content */}
          <div className="lg:col-span-5 space-y-10">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-tertiary">Step 03</span>
                <div className="editorial-line h-[1px] w-12"></div>
              </div>
              <h1 className="text-5xl md:text-7xl font-headline font-black tracking-tight text-on-surface leading-none mb-6">Who is joining the voyage?</h1>
            </div>
            <p className="text-xl text-on-surface-variant leading-relaxed font-light">
              Whether it's a solitary retreat or a grand family reunion, we curate the pacing and privacy of your Indian itinerary to match your group size perfectly.
            </p>
            <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
              <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAK-uzk4S-wkH3rb7qvj-fw3Qc4Xiw8qjqf1sHx0sTGi-N9mYV8osunmFtIgc4HKeJI4nGilnsOdMB9RDehULi-q9AXCMCgeWINrCwWlSRHz2mu9W0Yer4uDZYQbvZN5MimVjqR1MtL6s3CFd4ijYXUI8hiKt5y_BrOk_4blAYj9Q7W-gFO8ZZAda-P15Mi-U75qbPN_5BZdGvoYhT9hDGYdnluXcguxOIndSugGnSnOBnVZh6pZT2Ypsb4Y-S0-uVC9pilO8yQ3Lk" alt="low angle shot of the taj mahal at sunrise" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent"></div>
              <div className="absolute bottom-10 left-10 text-white">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-80 mb-2 block">Live Inspiration</span>
                <h3 className="text-3xl font-headline font-bold italic">Agra, Uttar Pradesh</h3>
              </div>
            </div>
          </div>

          {/* Interaction Right Side: The Stepper */}
          <div className="lg:col-span-7 lg:pl-12 pt-8">
            <div className="bg-surface-container-low rounded-3xl p-10 md:p-16 space-y-16 border border-outline-variant/10">
              <div className="space-y-4">
                <h2 className="text-4xl font-headline font-bold text-on-surface tracking-tight">Select Travelers</h2>
                <p className="text-lg text-on-surface-variant font-light">For groups larger than 8, please contact our concierge service.</p>
              </div>

              {/* Single Row Stepper */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-4 bg-white rounded-full shadow-2xl shadow-primary/5 border border-outline-variant/10">
                <button className="w-16 h-16 rounded-full flex items-center justify-center bg-surface-container-high text-on-surface hover:bg-surface-variant transition-all active:scale-95 shadow-lg">
                  <span className="material-symbols-outlined text-3xl">remove</span>
                </button>
                {/* Number Display */}
                <div className="flex-grow flex justify-center items-baseline gap-4">
                  <span className="text-8xl font-headline text-primary font-black tracking-tighter">4</span>
                  <span className="text-xl font-bold text-on-surface-variant uppercase tracking-[0.2em] font-label">Travelers</span>
                </div>
                <button className="w-16 h-16 rounded-full flex items-center justify-center bg-primary text-white hover:bg-primary-container transition-all active:scale-95 shadow-2xl shadow-primary/30">
                  <span className="material-symbols-outlined text-3xl">add</span>
                </button>
              </div>

              {/* Quick Select / Bento Style Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-10 bg-white rounded-3xl border border-outline-variant/10 hover:border-primary/20 transition-all cursor-pointer shadow-sm hover:shadow-xl">
                  <span className="material-symbols-outlined text-primary text-4xl mb-6">group</span>
                  <h4 className="font-headline font-bold text-2xl mb-4 tracking-tight">Group Dynamic</h4>
                  <p className="text-on-surface-variant leading-relaxed font-light">Perfect for a double-date or a small family circle. Shared experiences await.</p>
                </div>
                <div className="p-10 bg-white rounded-3xl border border-outline-variant/10 hover:border-primary/20 transition-all cursor-pointer shadow-sm hover:shadow-xl">
                  <span className="material-symbols-outlined text-tertiary text-4xl mb-6">bed</span>
                  <h4 className="font-headline font-bold text-2xl mb-4 tracking-tight">Room Layout</h4>
                  <p className="text-on-surface-variant leading-relaxed font-light">We recommend 2 luxury suites or 1 interconnecting heritage villa.</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-12 border-t border-outline-variant/20">
                <button className="text-primary font-bold flex items-center gap-3 hover:translate-x-[-6px] transition-transform text-lg">
                  <span className="material-symbols-outlined">arrow_back</span>
                  Back to Dates
                </button>
                <button className="bg-gradient-to-r from-primary to-primary-container text-white px-12 py-5 rounded-full font-bold shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all text-lg tracking-tight">
                  Continue to Comfort
                </button>
              </div>
            </div>

            {/* Footer Hint */}
            <div className="mt-12 flex items-center gap-6 px-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                <span className="material-symbols-outlined text-3xl">auto_awesome</span>
              </div>
              <div>
                <p className="text-lg font-headline text-on-surface-variant italic leading-snug">"Four travelers is the sweet spot for private SUV transport through Rajasthan's golden triangle."</p>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mt-2">Powered by PlanYatri Engine</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <VelocityPulse />
    </>
  );
}
