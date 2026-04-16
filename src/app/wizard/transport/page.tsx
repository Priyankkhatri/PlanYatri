import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VelocityPulse from '@/components/VelocityPulse';

export default function TransportSelection() {
  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen">
      <Header />
      
      <main className="max-w-screen-xl mx-auto px-6 py-12 md:py-20 pt-32">
        {/* Editorial Header */}
        <div className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="font-label text-[11px] uppercase tracking-[0.2em] font-bold text-primary mb-4 block">Route Curation</span>
            <h1 className="text-5xl md:text-7xl font-headline font-bold text-on-surface tracking-tight leading-none">Delhi to Udaipur</h1>
            <p className="mt-6 text-on-surface-variant text-lg leading-relaxed max-w-lg">
              Traversing the heart of Rajasthan. From the modern velocity of the capital to the serene lakeside luxury of the City of Lakes.
            </p>
          </div>
          <div className="flex gap-4">
            <button className="bg-surface-container-high px-6 py-3 rounded-full font-label text-sm font-semibold hover:bg-surface-container-highest transition-all">Filter</button>
            <button className="bg-primary text-white px-6 py-3 rounded-full font-label text-sm font-semibold shadow-lg shadow-primary/20 hover:scale-105 transition-transform">Edit Route</button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main List Column */}
          <div className="lg:col-span-8 space-y-16">
            {/* Section: Recommended */}
            <section>
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-2xl font-headline font-bold">Recommended</h2>
                <div className="h-px flex-grow bg-outline-variant opacity-20"></div>
              </div>
              <div className="space-y-4">
                {/* Vande Bharat Card */}
                <div className="group relative bg-surface-container-lowest p-6 rounded-xl flex flex-col md:flex-row md:items-center gap-6 transition-all hover:bg-white hover:shadow-xl hover:shadow-black/5">
                  <div className="w-16 h-16 flex items-center justify-center bg-primary/5 rounded-full text-primary">
                    <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>train</span>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold">Vande Bharat Express</h3>
                        <p className="text-on-surface-variant text-sm mt-1">High-Speed Rail • 06h 15m</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-primary font-body">₹3,450</p>
                        <p className="text-[10px] uppercase tracking-wider font-bold text-on-surface-variant">per seat</p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="bg-primary/10 text-primary text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-tighter">Fastest Surface Option</span>
                      <span className="bg-surface-container-low text-on-surface-variant text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-tighter">Meals Included</span>
                    </div>
                  </div>
                </div>

                {/* Boutique Flight */}
                <div className="group relative bg-surface-container-lowest p-6 rounded-xl flex flex-col md:flex-row md:items-center gap-6 transition-all hover:bg-white hover:shadow-xl hover:shadow-black/5">
                  <div className="w-16 h-16 flex items-center justify-center bg-primary/5 rounded-full text-primary">
                    <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>flight</span>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold">Indigo Premiere</h3>
                        <p className="text-on-surface-variant text-sm mt-1">Direct Flight • 01h 25m</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-primary font-body">₹5,800</p>
                        <p className="text-[10px] uppercase tracking-wider font-bold text-on-surface-variant">per person</p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="bg-primary/10 text-primary text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-tighter">Time Saver</span>
                      <span className="bg-surface-container-low text-on-surface-variant text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-tighter">Priority Boarding</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section: Affordable */}
            <section>
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-2xl font-headline font-bold text-on-surface-variant">Affordable</h2>
                <div className="h-px flex-grow bg-outline-variant opacity-20"></div>
              </div>
              <div className="space-y-4">
                {/* Sleeper Bus */}
                <div className="group relative bg-surface-container-lowest p-6 rounded-xl flex flex-col md:flex-row md:items-center gap-6 transition-all border-l-4 border-transparent hover:border-primary/20">
                  <div className="w-16 h-16 flex items-center justify-center bg-surface-container-low rounded-full text-on-surface-variant">
                    <span className="material-symbols-outlined text-3xl">directions_bus</span>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-bold">Volvo Multi-Axle Sleeper</h3>
                        <p className="text-on-surface-variant text-sm mt-1">Overnight Journey • 12h 45m</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold">₹1,250</p>
                        <p className="text-[10px] uppercase tracking-wider font-bold text-on-surface-variant">per berth</p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="bg-tertiary/10 text-tertiary text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-tighter">Value Pick</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar Column: Contextual AI / Route Map */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="bg-primary/5 p-8 rounded-3xl border border-primary/10 backdrop-blur-sm sticky top-28">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                </div>
                <div>
                  <h4 className="font-headline font-bold text-primary">Curator's Insight</h4>
                  <p className="text-[10px] uppercase tracking-tighter font-bold text-primary/60">AI Recommendations</p>
                </div>
              </div>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-6 italic">
                "For a balanced experience, take the **Vande Bharat** early morning. You'll witness the changing landscapes of Haryana and Rajasthan while arriving in Udaipur just in time for a lakeside sunset dinner."
              </p>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
                  <span className="text-xs font-bold text-on-surface-variant">Weather at Arrival</span>
                  <span className="text-xs font-black text-primary">24°C Sunny</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
                  <span className="text-xs font-bold text-on-surface-variant">Route Congestion</span>
                  <span className="text-xs font-black text-secondary">Low</span>
                </div>
              </div>
            </div>

            {/* Subtle Route Indicator */}
            <div className="bg-surface-container-low rounded-3xl p-8 overflow-hidden relative min-h-[300px] flex flex-col justify-between">
              <div className="relative z-10">
                <h4 className="font-headline font-bold text-on-surface mb-2">Route Summary</h4>
                <div className="space-y-4 mt-6">
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <div className="w-0.5 h-12 bg-outline-variant/30 border-dashed border-l"></div>
                    </div>
                    <div className="pt-0">
                      <p className="text-[10px] uppercase font-bold text-on-surface-variant">Origin</p>
                      <p className="text-sm font-bold">New Delhi (NDLS)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 rounded-full border-2 border-primary"></div>
                    <div className="pt-0">
                      <p className="text-[10px] uppercase font-bold text-on-surface-variant">Destination</p>
                      <p className="text-sm font-bold">Udaipur City (UDZ)</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Decorative Map Texture Placeholder */}
              <div 
                className="absolute inset-0 opacity-10 pointer-events-none grayscale" 
                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDoTCJqr5qljy06VmnI2Zy8LGB5LBCZmnt6kmutH90tTQMxfkJQnpLMHTimBoH8UwKwdsNe39L_Re2hpY8rC0n3n8dKCyrCqQQK0YAY9-i9MnfHEztsHT3IsY6tozovZ9NbM9guDo3nwluR2B0dFHbQhF39TjxOB3yKoFTErUwRc6YiqGHMiIFnBU2WeSxR-5BIBdFbGVUKhEtiT9WseMgToBOWA1vg6abQXuOHwGhFlqqPo2SypAQy1po4lzQlS8JBX2nFGuugp3k')", backgroundSize: "cover" }}
              />
            </div>
          </aside>
        </div>
      </main>

      <VelocityPulse />
      <Footer />
    </div>
  );
}
