import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VelocityPulse from "@/components/VelocityPulse";

export default function Home() {
  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative min-h-[921px] flex items-center px-8 overflow-hidden bg-surface">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 z-10">
              <span className="inline-block text-xs uppercase tracking-[0.2em] text-tertiary font-bold mb-4">India Reimagined</span>
              <h1 className="text-6xl md:text-8xl font-black text-primary leading-none tracking-tighter mb-8">
                Generate your perfect Indian journey.
              </h1>
              <p className="text-xl text-on-surface-variant max-w-lg mb-12 leading-relaxed font-light">
                Expertly curated itineraries blending AI precision with local heritage soul. Experience the real India, exactly your way.
              </p>
              <div className="flex flex-col sm:flex-row gap-6">
                <Link href="/wizard/destination" className="px-12 py-5 rounded-full bg-gradient-to-r from-primary to-primary-container text-white text-lg font-bold hover:opacity-90 transition-all shadow-2xl shadow-primary/20 text-center">
                  Plan My Trip Free
                </Link>
                <Link href="/dashboard" className="px-12 py-5 rounded-full bg-white text-on-surface text-lg font-bold hover:bg-surface-container-low transition-all border border-outline-variant/20 text-center">
                  View Curated Maps
                </Link>
              </div>
            </div>
            {/* ... (rest of hero images remain the same) */}
            <div className="lg:col-span-6 relative">
              <div className="relative grid grid-cols-2 gap-4">
                <div className="space-y-4 pt-12">
                  <div className="rounded-xl overflow-hidden aspect-[3/4] editorial-shadow">
                    <img className="w-full h-full object-cover" alt="high-saturation photography of an orange sunrise over the marble domes of the Taj Mahal with soft morning mist" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFesdsc1q2nVNcvqaPpkSzJoKoJcg349lMbWPwc2cUElSALL3R5nEk8LUr1WArtWsZtxuplWsqkj5166ySx4LnY_4b2j9QC2ixmWX0j_zowsYGNpVKD6DQGdNGAySkzHi5jEw32fexLaOwAuJJRoZ-mxV-ArTAlYtOH36TCguKUWhIww7wKgl-ony2FEaBRp772S9YMjqRIkcNMbliPp6raLosrh9LM12pQ65_1x4LCPMAQIaB3dT1COqLPumuNgU6lxfYpXBMYmY"/>
                  </div>
                  <div className="rounded-xl overflow-hidden aspect-square editorial-shadow">
                    <img className="w-full h-full object-cover" alt="vibrant marigold garlands hanging in a traditional Jaipur market with warm terracotta walls and soft sunlight" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGc1KI_2UkPdfFcnh_0Y2ki--fP2G9S8W_HTvtBW7022ftzq0elkDKMGuPW0N_ETOZnaeHC-1iCN4lHsa38drj7JNazsa3ebwac65rjpnzRN4j3WDBwoUDzJznGU418IE_ktusHYYMnUhgGN2oz_ZWlQ-XHXSKIGMdLcc3dEDUUASJWYWlEPIej9UtTvHzaFirKwgI-vRdh1NMv7k59jsr5eDKYr5kOiYGitZ6YcSrecQotKsQtxga5ZzoljYqaQTv3LOBYJQyZ5I"/>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="rounded-xl overflow-hidden aspect-square editorial-shadow">
                    <img className="w-full h-full object-cover" alt="serene Kerala backwaters with a luxury wooden houseboat gliding through lush green palm-fringed canals at dusk" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB290EaTTqJkBqYZjjPjLmXaL4EZxIdXtLrMtmvNx0bmxDKNEZ5SRr2LICQDV9MuEN1EvJOq0oSfoyBGlhe-qdY5LP_clbm9MjmqDXzQmXSgrAOmFVyJHbU0IJuiZBAF-dCPRW1rEbMeRzya__gZDDu6feaOS6oDxblalbXSGuKC-ehxTdTIh3j6hXSljJbtg1XtQxVf1K7QEmbSQxWLbLINBHNmrgVXEILk6n-Fk4husQLBsS_KjG1gqdeJfN3Ank_7uFSWIm6ET8"/>
                  </div>
                  <div className="rounded-xl overflow-hidden aspect-[3/4] editorial-shadow">
                    <img className="w-full h-full object-cover" alt="dramatic aerial view of Himalayan peaks with snow-capped ridges and a deep blue sky during blue hour" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4-7q8GbJLrgWPIlhJWa2GSWwZJ5Nthpo2Dp6wMq-HlTRFBe_rbQ7nt7J_AMAY2E7wSDA7DB-jagS-HjDG-Ol8mZJi00aU1uZxqEgzFYatPxCpSrkPE1f0j7lI18pC6fjV43uWpTMRep29AZItBhbSsPCGE45LDQE3fIVSjgOYvbvLrohJFG2sUZEfNPdrYyR-lIpqzRAhoG_JKNXkUTU0am5QG6i4yqp6DIRxSYDDZynxLC9L8FGeLNXe0vqEIqmcOqyTTApJ3Hg"/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section className="py-32 px-8 max-w-7xl mx-auto">
          <div className="mb-20">
            <span className="text-xs uppercase tracking-widest text-tertiary font-bold mb-2 block font-label">Our Capabilities</span>
            <h2 className="text-5xl md:text-6xl font-headline font-bold tracking-tight">The Art of Travel, <br/>Quantified.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1: Hyper-Local Curation */}
            <div className="md:col-span-2 bg-surface-container-low rounded-3xl p-12 flex flex-col justify-between min-h-[450px] border border-transparent hover:border-outline-variant/20 transition-all">
              <div className="max-w-md">
                <span className="material-symbols-outlined text-primary text-5xl mb-8">distance</span>
                <h3 className="text-4xl font-headline font-bold mb-6">Hyper-Local Curation</h3>
                <p className="text-on-surface-variant text-lg font-light leading-relaxed">
                  Our proprietary engine doesn't just find hotels; it maps the soul of a destination. From hidden spice markets in Old Delhi to private ashrams in Rishikesh.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <span className="px-6 py-2 bg-white rounded-full text-xs font-bold uppercase tracking-widest shadow-sm">Heritage Sites</span>
                <span className="px-6 py-2 bg-white rounded-full text-xs font-bold uppercase tracking-widest shadow-sm">Secret Dining</span>
                <span className="px-6 py-2 bg-white rounded-full text-xs font-bold uppercase tracking-widest shadow-sm">Artisan Trails</span>
              </div>
            </div>

            {/* Feature 2: Rupee Precision */}
            <div className="bg-primary text-white rounded-3xl p-12 flex flex-col justify-between border border-transparent hover:shadow-2xl hover:shadow-primary/20 transition-all">
              <div>
                <span className="material-symbols-outlined text-white text-5xl mb-8">payments</span>
                <h3 className="text-4xl font-headline font-bold mb-6">Rupee Precision</h3>
                <p className="text-primary-fixed-dim text-lg font-light leading-relaxed opacity-90">
                  Transparent budgeting down to the last Rupee. Real-time pricing for trains, private cars, and luxury stays.
                </p>
              </div>
              <div className="pt-8">
                <div className="text-5xl font-headline font-bold tracking-tighter">₹ 0.00 <span className="text-sm font-sans tracking-widest uppercase opacity-60">Variance</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* Signature AI Section */}
        <section className="bg-surface-container-high/30 py-40 px-8">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white shadow-xl mb-12">
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-on-surface font-label">Intelligence Stack</span>
            </div>
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-12 text-primary leading-none">Where Heritage meets Velocity.</h2>
            <p className="text-2xl text-on-surface-variant font-light mb-16 max-w-2xl mx-auto leading-relaxed italic">
              PlanYatri uses a custom neural network trained on over 50,000 professional travel logs to ensure your itinerary isn't just possible—it's poetic.
            </p>
            <div className="flex justify-center">
              <div className="p-3 bg-white rounded-full shadow-2xl flex items-center gap-4 pl-10 max-w-lg w-full">
                <span className="text-on-surface-variant italic font-headline text-lg opacity-60 flex-grow text-left">Explore the textiles of Gujarat...</span>
                <button className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white shadow-lg">
                  <span className="material-symbols-outlined">send</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <VelocityPulse />
    </>
  );
}
