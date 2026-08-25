import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VelocityPulse from "@/components/VelocityPulse";

export default function WizardDestination() {
  return (
    <>
      <Header />
      <main className="pt-32 pb-20 px-6 max-w-5xl mx-auto min-h-screen">
        {/* Wizard Header */}
        <header className="mb-16">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Step 01</span>
            <div className="h-[1px] w-12 bg-outline-variant/30"></div>
          </div>
          <h1 className="text-5xl md:text-7xl font-headline tracking-tight text-on-surface mb-6 leading-tight">
            Where does your <span className="italic">story</span> begin?
          </h1>
          <p className="text-on-surface-variant text-lg max-w-xl font-light leading-relaxed">
            Enter a city in India or choose from our curated recommendations to start planning your bespoke journey.
          </p>
        </header>

        {/* Search Experience */}
        <section className="space-y-12">
          <div className="relative">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-primary text-3xl">location_on</span>
            </div>
            <input className="w-full h-24 pl-20 pr-8 rounded-xl bg-surface-container-lowest border-none ring-1 ring-outline-variant/20 focus:ring-2 focus:ring-primary/40 text-2xl font-headline placeholder:text-outline/40 transition-all shadow-sm" placeholder="Search Indian cities (e.g. Varanasi, Kochi, Leh...)" type="text"/>
          </div>

          {/* Popular Suggestions (Chips) */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase tracking-widest font-bold text-on-surface-variant">Recommended Destinations</span>
            </div>
            <div className="flex flex-wrap gap-4">
              <button className="group relative overflow-hidden px-8 py-4 rounded-full bg-surface-container-low hover:bg-primary transition-all duration-300">
                <span className="relative z-10 text-on-surface group-hover:text-white font-medium">Goa</span>
              </button>
              <button className="group relative overflow-hidden px-8 py-4 rounded-full bg-surface-container-low hover:bg-primary transition-all duration-300">
                <span className="relative z-10 text-on-surface group-hover:text-white font-medium">Manali</span>
              </button>
              <button className="group relative overflow-hidden px-8 py-4 rounded-full bg-surface-container-low hover:bg-primary transition-all duration-300">
                <span className="relative z-10 text-on-surface group-hover:text-white font-medium">Udaipur</span>
              </button>
              <button className="group relative overflow-hidden px-8 py-4 rounded-full bg-surface-container-low hover:bg-primary transition-all duration-300">
                <span className="relative z-10 text-on-surface group-hover:text-white font-medium">Jaipur</span>
              </button>
            </div>
          </div>

          {/* Visual Inspiration Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-12">
            <div className="md:col-span-8 group relative aspect-[16/9] overflow-hidden rounded-xl bg-surface-container-high">
              <img alt="Agra" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrq6cNe7kuFvsIVDwkWEozECschXnQ6FKCt3D2_Zy6TGZqa9sGJsHr9BTLhrPiJjKHxrQF-89fZzAFzvbbv_o8NW8B_TJNsg7lYRoQnm4dP-bgDSEeBGz-BvU3BUw-bMhz-KrvAMbMXGPtW0ve7eOq66fn8r7F8VnCKz8VjodP-8NiPaM9WmR96lSTwX7r252s2tEbaB7G7EmYrHNVmq_RsSaCikJ_pMxXgo7oRBVy5PNk4zJPZ-zzy45SaFknqxxmDeUy_VMBtA0"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-8 left-8">
                <h3 className="text-white text-3xl font-headline mb-1">Agra</h3>
                <p className="text-white/80 text-sm font-label uppercase tracking-widest">Heritage &amp; Romance</p>
              </div>
            </div>
            <div className="md:col-span-4 group relative aspect-square md:aspect-auto overflow-hidden rounded-xl bg-surface-container-high">
              <img alt="Jodhpur" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCEUoosl3vuFAMKCm0Q6L8wPMiAj95FLsh3XjWNUkFXulIq0uI0WMgzoROHeXvdARVob98MzM7A9OFxprT_AM-4hDezRxQMgp2Cq8SQYLyHAX9m4rxiTqs57LphgxA1LOyREtmC63wJ8mcq5QzlkMyz-9PI1rv2VO0Niy4A25BE4Nx5lLttpIvNZ8Va01QlSgCraISILMoWZ8KiRgwFLy7jNPTQR_fjReC43IBGUXux2fudvt5MTXq4KNJssBUnNNHZ39btmGGQQB8"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-8 left-8">
                <h3 className="text-white text-3xl font-headline mb-1">Jodhpur</h3>
                <p className="text-white/80 text-sm font-label uppercase tracking-widest">The Blue City</p>
              </div>
            </div>
            <div className="md:col-span-4 group relative aspect-square md:aspect-auto overflow-hidden rounded-xl bg-surface-container-high">
              <img alt="Alleppey" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPnQANrzSpsAztGLpaUVXv4raignZMh5G5GxyfB3K83iv648D8zSEVK64XQO2s7BU0eIHkNMAXPdc0tRVupvv-hAlsMRrQZ0lrwBgXoGyP5XvzKUeJlwkfS6mOUBb-k_fog0CZJCwfc3PJrrh_UNqd92Czwu6pvDwglGuUWUbIfx4erRqe1UkfYUh_FOei9V2UPjgbH_T80PSRC11ReJNq0YGRKDOrD2OSj4vFR7oQ7qe5-KDXJHKz4F08zB3QH8nPNGIRZUVglLQ"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-8 left-8">
                <h3 className="text-white text-3xl font-headline mb-1">Alleppey</h3>
                <p className="text-white/80 text-sm font-label uppercase tracking-widest">Tranquil Waters</p>
              </div>
            </div>
            <div className="md:col-span-8 group relative aspect-[16/9] overflow-hidden rounded-xl bg-surface-container-high">
              <img alt="Ladakh" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAL8t3YvERFA8wntBzeVGTOonBc6g37x03OQqKS9GIFMcYuj7uxshcwqvdutQSRv7xSxtVdUsjHBmy8jr3AhQ0iQrKQicvM60_FaM2H7pSlU1TBYT9vtGyRNrOgmvoxALkL74-Yvqs5Hv9dcyhmrteACnprOsEjhnm0qDXE2EViK1nGfNKT3xserUJehPummBc7ecq17ngpq4tcy7gN79dDjwuYimcosBEeQXVQeG7Lp1evhAyqzxx0gjy7RRehDzksQJdchpfPuE0"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-8 left-8">
                <h3 className="text-white text-3xl font-headline mb-1">Leh-Ladakh</h3>
                <p className="text-white/80 text-sm font-label uppercase tracking-widest">High Altitude Magic</p>
              </div>
            </div>
          </div>
        </section>

        {/* Progress Indicator */}
        <div className="mt-20 flex justify-between items-center py-8 border-t border-outline-variant/20">
          <div className="flex gap-3">
            <div className="h-2 w-16 rounded-full bg-primary shadow-sm shadow-primary/20"></div>
            <div className="h-2 w-2 rounded-full bg-surface-container-highest"></div>
            <div className="h-2 w-2 rounded-full bg-surface-container-highest"></div>
            <div className="h-2 w-2 rounded-full bg-surface-container-highest"></div>
          </div>
          <Link href="/wizard/dates" className="group flex items-center gap-4 bg-gradient-to-r from-primary to-primary-container text-white px-10 py-5 rounded-full font-bold shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
            <span className="text-lg">Continue Journey</span>
            <span className="material-symbols-outlined text-xl transition-transform group-hover:translate-x-1">arrow_forward</span>
          </Link>
        </div>
      </main>
      <Footer />
      <VelocityPulse />
    </>
  );
}
