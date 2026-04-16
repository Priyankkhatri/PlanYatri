import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VelocityPulse from "@/components/VelocityPulse";

export default function WizardComfort() {
  return (
    <>
      <Header />
      <main className="flex-grow flex items-center justify-center pt-32 pb-20 px-6 min-h-screen bg-surface">
        <div className="max-w-5xl w-full grid md:grid-cols-12 gap-12 items-center">
          {/* Left Column: Context & Imagery */}
          <div className="md:col-span-5 space-y-10">
            <div className="space-y-4">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-tertiary">Step 04 / Final</span>
                <div className="editorial-line h-[1px] w-12"></div>
              </div>
              <h1 className="font-headline text-5xl md:text-7xl leading-none font-black text-on-surface tracking-tight">Define Your Comfort</h1>
            </div>
            <p className="text-on-surface-variant text-xl leading-relaxed font-light">
              Your preferences help us curate the perfect balance of heritage stays, premium transport, and local culinary experiences.
            </p>
            <div className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-2xl">
              <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwbPQLsfLNL7tWUrANfXQgGpDCgmdOzyei7-ptPtPIlaoQgB6zioI_YD6FkXgtp3XhJkPmJ18NAfLiJuJMaGkzBh3hKWUPQPrgqxaz-94OHWbKOlxkXysKqHm1CvPW9jR_QF8l1L26mAeXbTvCdqvVYWV5u0jz6V8Ee6GyGpZONTs5bHhtcsZjhh2GhJzPUrhFHXLWkyMOmEpiXCtymXnMmnQjsUWuwL2qsLBVq-eNpf0BvO9mglIcgJTfzqpkADN2HFTSDPms2qA" alt="Elegant luxury hotel suite" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent"></div>
              <div className="absolute bottom-10 left-10 text-white">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-80 mb-2 block">Curation Highlight</span>
                <p className="font-headline text-2xl font-bold">The Oberoi Udaivilas</p>
              </div>
            </div>
          </div>

          {/* Right Column: Interaction Canvas */}
          <div className="md:col-span-7 bg-surface-container-low rounded-[3rem] p-10 md:p-16 space-y-16 border border-outline-variant/10">
            <div className="space-y-10">
              <div className="flex justify-between items-end">
                <div className="space-y-2">
                  <h2 className="font-headline text-3xl font-bold text-on-surface tracking-tight">Pricing Style</h2>
                  <p className="text-lg text-on-surface-variant font-light">Slide to adjust your daily budget</p>
                </div>
                <div className="text-right">
                  <span className="block text-[10px] uppercase tracking-[0.2em] text-tertiary mb-2 font-bold opacity-60">Estimated Range</span>
                  <div className="text-3xl font-black font-headline text-primary tracking-tighter">
                    ₹4,000–₹8,000<span className="text-sm font-normal text-on-surface-variant ml-1">/pp</span>
                  </div>
                </div>
              </div>

              {/* Enhanced Range Slider */}
              <div className="relative pt-12 pb-6">
                <div className="bg-gradient-to-r from-surface-variant via-primary to-tertiary h-2 w-full rounded-full absolute top-14 opacity-20"></div>
                <input className="w-full h-2 bg-transparent appearance-none cursor-pointer relative z-10 editorial-slider" max="3" min="1" step="1" type="range" defaultValue="2"/>
                <div className="flex justify-between mt-10 px-2">
                  <div className="text-center group">
                    <div className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-outline">backpack</span>
                    </div>
                    <span className="block font-bold text-[10px] uppercase tracking-[0.2em] text-outline">Budget</span>
                  </div>
                  <div className="text-center group">
                    <div className="w-14 h-14 rounded-full bg-primary shadow-2xl flex items-center justify-center mb-4 mx-auto shadow-primary/30 group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-white">bed</span>
                    </div>
                    <span className="block font-bold text-[10px] uppercase tracking-[0.2em] text-primary">Standard</span>
                  </div>
                  <div className="text-center group">
                    <div className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-tertiary">diamond</span>
                    </div>
                    <span className="block font-bold text-[10px] uppercase tracking-[0.2em] text-tertiary">Luxury</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Insight Card */}
            <div className="bg-white p-8 rounded-3xl border border-outline-variant/10 flex items-start gap-6 shadow-sm">
              <div className="bg-primary/10 p-4 rounded-2xl text-primary shadow-inner">
                <span className="material-symbols-outlined text-3xl font-bold">verified</span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-xl text-on-surface mb-2 font-headline">Editorial Inclusions</h3>
                <p className="text-lg text-on-surface-variant leading-relaxed font-light">4-Star boutique heritage hotels, private AC sedan transfers, and breakfast at the best local cafes.</p>
              </div>
            </div>

            <div className="flex flex-col gap-6 pt-10 border-t border-outline-variant/20">
              <button className="w-full py-6 rounded-full bg-gradient-to-r from-primary to-primary-container text-white font-black text-xl shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all tracking-tight capitalize">
                Generate My Custom Plan
              </button>
              <button className="w-full py-4 text-on-surface-variant font-bold hover:text-primary transition-colors flex items-center justify-center gap-3 text-sm uppercase tracking-widest">
                <span className="material-symbols-outlined text-lg">arrow_back</span>
                Step 03: Travelers
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <VelocityPulse />
    </>
  );
}
