import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VelocityPulse from "@/components/VelocityPulse";

export default function WizardDates() {
  return (
    <>
      <Header />
      <main className="pt-32 pb-20 px-4 md:px-8 max-w-6xl mx-auto min-h-screen bg-surface">
        {/* Step Indicator */}
        <div className="mb-12 flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-xs font-bold uppercase tracking-widest text-tertiary mb-1">Step 02</span>
            <h1 className="text-4xl md:text-5xl font-headline font-bold text-on-surface tracking-tight leading-tight">Select your window.</h1>
          </div>
          <div className="ml-auto flex gap-3">
            <div className="h-1.5 w-16 bg-primary/20 rounded-full"></div>
            <div className="h-1.5 w-16 bg-primary rounded-full shadow-sm shadow-primary/20"></div>
            <div className="h-1.5 w-16 bg-surface-container-highest rounded-full"></div>
            <div className="h-1.5 w-16 bg-surface-container-highest rounded-full"></div>
          </div>
        </div>
        {/* ... (calendar and image sections) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left: Hero Imagery */}
          <div className="lg:col-span-4 relative">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
              <img alt="Taj Mahal" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBv24RK4OHdvxnt8j770Mx90np9EKu93XjEyJLPetdGfKh7dh8S7qc_ZCj0nBfKT1SYmpdLP45Ssx9zh2Qfy_5qQGkzqNOmOHceJpf3u1AhVR4uWSY_-I8jcDtv8taTC-vsbjPsnNPxr_xBk_07cp0ZeHpy97BwVxj94r5U7rgK-zD8CrGGMcViV1LPiJs0WunWxr6scdtYdGrsQKemhT14aPr0CMlCaUbHvGqPFl1ORjmvDO3dpqIXAgi0YUBKbrwsuBS5TTp4sQQ"/>
            </div>
            <div className="absolute -bottom-6 -right-6 p-8 glass-panel rounded-2xl shadow-2xl max-w-[280px] border border-white/40">
              <p className="text-sm font-headline italic text-on-surface animate-pulse">"The best time to visit Rajasthan is between October and March when the sun is gentle."</p>
            </div>
          </div>

          {/* Right: Calendar Selection */}
          <div className="lg:col-span-8 bg-surface-container-low rounded-3xl p-8 md:p-12 border border-outline-variant/10">
            {/* Duration Pill */}
            <div className="flex justify-center mb-10">
              <div className="inline-flex items-center gap-3 px-8 py-3 bg-primary text-white rounded-full shadow-xl shadow-primary/20">
                <span className="material-symbols-outlined text-sm">calendar_today</span>
                <span className="text-sm font-bold tracking-widest uppercase">5 Nights Duration</span>
              </div>
            </div>

            {/* Calendar Grid Representation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              {/* Simplified Month representation for consistency */}
              <div className="space-y-8">
                <div className="flex justify-between items-center px-4">
                  <h3 className="font-headline font-bold text-2xl text-on-surface leading-tight tracking-tight uppercase">October <span className="text-primary">2024</span></h3>
                </div>
                {/* Visual indicator of the calendar grid could go here */}
                <div className="h-64 bg-white/50 rounded-2xl border border-dashed border-outline-variant/30 flex items-center justify-center p-8">
                  <p className="text-xs text-outline font-bold uppercase tracking-widest text-center leading-relaxed">Editorial Calendar Widget<br/><span className="text-[10px] font-normal italic">Iterative selection logic enabled</span></p>
                </div>
              </div>
              <div className="space-y-8">
                <div className="flex justify-between items-center px-4">
                  <h3 className="font-headline font-bold text-2xl text-on-surface opacity-40 uppercase">November <span className="opacity-40">2024</span></h3>
                </div>
                <div className="h-64 bg-surface-container rounded-2xl opacity-40"></div>
              </div>
            </div>

            {/* Range Summary */}
            <div className="mt-16 flex flex-col md:flex-row items-center gap-12 border-t border-outline-variant/20 pt-10">
              <div className="flex-1 flex gap-12 items-center justify-center md:justify-start">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-outline mb-2 font-bold opacity-60">Departure</p>
                  <p className="text-2xl font-headline font-bold tracking-tight">Oct 12, Sat</p>
                </div>
                <div className="h-px w-12 bg-primary/30"></div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-outline mb-2 font-bold opacity-60">Return</p>
                  <p className="text-2xl font-headline font-bold tracking-tight">Oct 17, Thu</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Link href="/wizard/destination" className="text-primary font-bold flex items-center gap-2 hover:translate-x-[-4px] transition-transform">
                  <span className="material-symbols-outlined">arrow_back</span>
                  Back
                </Link>
                <Link href="/wizard/travelers" className="w-full md:w-auto px-12 py-5 bg-gradient-to-r from-primary to-primary-container text-white rounded-full font-bold shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all text-center">
                  Confirm Dates
                </Link>
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
