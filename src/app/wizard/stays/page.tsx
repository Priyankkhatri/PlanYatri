import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VelocityPulse from '@/components/VelocityPulse';

export default function StaySelection() {
  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen">
      <Header />
      
      <main className="max-w-4xl mx-auto px-6 py-12 md:py-20 pt-32 pb-32">
        {/* Header Section */}
        <header className="mb-16">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-tertiary">Curated Destinations</span>
            <h1 className="text-5xl md:text-6xl font-headline font-bold text-on-surface tracking-tight">Udaipur Stays</h1>
            <p className="text-slate-500 font-light mt-4 max-w-xl leading-relaxed">
              A hand-selected portfolio of the City of Lakes' most evocative residences, from historic island palaces to hidden boutique gems.
            </p>
          </div>
        </header>

        {/* Sorting/Filters */}
        <div className="flex gap-4 mb-12 overflow-x-auto pb-4 scrollbar-hide">
          <button className="bg-primary text-white px-6 py-2 rounded-full text-xs font-bold tracking-widest uppercase">All Stays</button>
          <button className="bg-surface-container-lowest text-slate-600 px-6 py-2 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-surface-container-high transition-all">Heritage</button>
          <button className="bg-surface-container-lowest text-slate-600 px-6 py-2 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-surface-container-high transition-all">Lake View</button>
          <button className="bg-surface-container-lowest text-slate-600 px-6 py-2 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-surface-container-high transition-all">Modern Luxury</button>
        </div>

        {/* Section: Recommended */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold italic font-headline">Recommended</h2>
            <div className="editorial-line flex-grow ml-6 opacity-30"></div>
          </div>
          <div className="space-y-1">
            {/* Recommended Item 1 */}
            <div className="group flex items-center gap-6 p-4 -mx-4 hover:bg-white rounded-xl transition-all duration-500 cursor-pointer">
              <div className="h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden bg-surface-container shadow-sm">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrlbefqbBlLWuKL9gkGKt07vu06QP9o3RNpDFUK-FPdheFZxiqVQiQuvXqjj_y_w-59Tn5J-RJAF1p10U68huPFeukYwAiNqP8Rwm2rtopmsbjVZWwxyJglLGgqk4sjyCmVxWk_TObfoGHX_WOnEexzOX55PB5ADB1tLAUi848emOqfJ3UUcitBtVJu6_i6o78Rhf1CmI6VZBLc-G-vVXnNdyvDcRtprGVabS21_8sBRa2SaoSr8l5Val_Vl43CxMjYi36bVr3SPs" 
                  alt="Taj Lake Palace"
                  className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-lg font-bold text-on-surface group-hover:text-primary transition-colors">Taj Lake Palace</h3>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="text-xs font-bold tracking-tighter">4.9</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 italic mb-2">"Floating like a dream on Lake Pichola, this is the ultimate romantic icon."</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-primary font-bold text-lg leading-none">₹52,000</span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest">per night</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">chevron_right</span>
            </div>

            {/* Recommended Item 2 */}
            <div className="group flex items-center gap-6 p-4 -mx-4 hover:bg-white rounded-xl transition-all duration-500 cursor-pointer">
              <div className="h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden bg-surface-container shadow-sm">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3IP6LQFj51ylm9OnTdzBfN6E9QBNqYfQvPyNB7xreNpV4mHIu2UTB5YkkL4rT9iNj3A80SP9x2zWjWGbrJ4kvi_ymZzNnDrvp52-wEL5ji9KRE0moMsnErBMGorUn07yRC6Tak-5LP6mQXjYK-nOlpoLIO02JBxhdRUhZqPrNfSlhlJSDnpcXEjW_W89fVmtSg8fJ3Ms0MXuFr5DW-bcHLeX1eEVZZqxGtwOe1Ycpx80DCTA5LCkUwqs5TVmI2450m0oEn6lDGhI" 
                  alt="RAAS Devigarh"
                  className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-lg font-bold text-on-surface group-hover:text-primary transition-colors">RAAS Devigarh</h3>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="text-xs font-bold tracking-tighter">4.8</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 italic mb-2">"Modern minimalism meets Rajput grandeur in this hilltop 18th-century palace."</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-primary font-bold text-lg leading-none">₹28,500</span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest">per night</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">chevron_right</span>
            </div>
          </div>
        </section>

        {/* Section: Premium Selection */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold italic font-headline">Premium Selection</h2>
            <div className="editorial-line flex-grow ml-6 opacity-30"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Premium Item 1 */}
            <div className="group bg-surface-container-lowest p-5 rounded-2xl border border-transparent hover:border-primary/10 transition-all cursor-pointer">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[9px] uppercase tracking-[0.2em] px-2 py-1 bg-tertiary/10 text-tertiary rounded font-bold">Signature</span>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="text-xs font-bold tracking-tighter">5.0</span>
                </div>
              </div>
              <div className="aspect-[4/3] rounded-xl overflow-hidden mb-4 bg-slate-200">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOESh_O4IUkHEyNoqDmwYh_reP6cQSnnyLAn9PCSNvmLQJvMm_9oKqL4dvtvb7BD41aYJ53FfNpQB9ITbI0Kw8X2Ics6qFaB2r6s0PFbvF3Km9CE9ocdhWzIJ-HzWcThRxfZCHyx2yTczvlQzeZokwRHNgOAMmi2_JWJQCde7DJH5g9w7AGtt7ewW8YhuK9BOQZalaNb_Bnlu1OzvxgPuxURQYG-evVVUDE2vALgiXTHwR8k3T0nIrpvVf3YCGmbxD3LAmLGuZaUY" 
                  alt="The Oberoi Udaivilas"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
              </div>
              <h3 className="text-xl font-bold font-headline mb-1">The Oberoi Udaivilas</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">A sprawling masterpiece of domes and corridors, offering unparalleled personalized service.</p>
              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <span className="text-primary font-bold">₹75,000<span className="text-[10px] font-normal text-slate-400 ml-1">/ night</span></span>
                <button className="text-[10px] font-bold uppercase tracking-widest text-primary hover:tracking-[0.25em] transition-all">Book Now</button>
              </div>
            </div>

            {/* Premium Item 2 */}
            <div className="group bg-surface-container-lowest p-5 rounded-2xl border border-transparent hover:border-primary/10 transition-all cursor-pointer">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[9px] uppercase tracking-[0.2em] px-2 py-1 bg-primary/10 text-primary rounded font-bold">New Arrival</span>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="text-xs font-bold tracking-tighter">4.7</span>
                </div>
              </div>
              <div className="aspect-[4/3] rounded-xl overflow-hidden mb-4 bg-slate-200">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBlhpOMJtoorSEZ7V_0_KXLbDpTdU4WvC3mcjB1W0uwbFOkpB2zgU69qMRSmtHIPxrB_KTtke65LhLAWdxUs9MykpvJ7a7OEwdfSk-zK-tiBSDLbneY2grPfa_uB42a_D2DeVfD2TS_joZfeyPhlTn-E-EYd7FFMm2L2DVA8ppa9leR_cIgpHFX_AWgnTXb44FYWUeBrWwAsiMGkr_vA9qTeNX9FY-ZpHrWRDMgnB4Qff3svUItB0dYWknxTs92zZ_F8V1wLhhTq64" 
                  alt="Raffles Udaipur"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
              </div>
              <h3 className="text-xl font-bold font-headline mb-1">Raffles Udaipur</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">Nestled on its own private island, this estate offers a serene escape with Mediterranean flair.</p>
              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <span className="text-primary font-bold">₹45,500<span className="text-[10px] font-normal text-slate-400 ml-1">/ night</span></span>
                <button className="text-[10px] font-bold uppercase tracking-widest text-primary hover:tracking-[0.25em] transition-all">Book Now</button>
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
