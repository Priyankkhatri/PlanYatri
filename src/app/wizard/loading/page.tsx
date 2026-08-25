import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VelocityPulse from '@/components/VelocityPulse';

export default function WizardLoading() {
  return (
    <div className="bg-background min-h-screen font-body">
      <Header />
      
      <main className="pt-32 pb-20 px-8">
        <div className="max-w-6xl mx-auto mb-12">
          {/* Progress Header */}
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
            <div className="flex-1">
              <span className="text-xs font-bold uppercase tracking-widest text-tertiary mb-2 block">
                Curating Your Experience
              </span>
              <h1 className="font-headline text-5xl md:text-6xl text-on-background tracking-tight mb-4 font-bold">
                Crafting Your Indian Odyssey
              </h1>
              <div className="flex items-center gap-4 text-on-surface-variant italic">
                <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                <span className="text-lg">Finding transport options...</span>
              </div>
            </div>
            
            <div className="w-full md:w-72">
              <div className="flex justify-between mb-2">
                <span className="text-xs font-semibold text-primary">64% Complete</span>
                <span className="text-xs text-outline italic">Almost there</span>
              </div>
              <div className="w-full bg-surface-container-high h-1 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-primary-container w-[64%]"></div>
              </div>
            </div>
          </div>

          {/* Bento Grid Layout Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Main Map Skeleton */}
            <div className="md:col-span-8 bg-surface-container-low rounded-xl overflow-hidden min-h-[400px] relative">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdQl8pt77woKixK8bDGrd0Omv8kJNhWvI8rnUl9xMJaHHdqKE4dDVIY_qrcwrGb78OHA3MdHeYM3kHLjMVXuzcfEjn7WjPic3RMWU8YAFt1DzgrWHDojGF8G-putuFVVlm8XeHfJIRjQaSuCA7sdm4C6MPVcQ_jEaZHjDWzeqNp7DeENckT5nGA9yQJT-Cg5WS_CCDh3xqK8U064I0ykZ5WRXsbNkGoHhpaOhgBUYROzEXQibTcW6bmjO7pbvKa3-FVkyqq5A1ymk" 
                alt="Map Preview"
                className="w-full h-full object-cover opacity-60 grayscale"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 p-4 bg-white/90 backdrop-blur-md rounded-xl shadow-sm max-w-xs">
                <div className="flex items-center gap-3 mb-2">
                  <span className="material-symbols-outlined text-primary">explore</span>
                  <span className="text-sm font-semibold">Route Optimization</span>
                </div>
                <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-2/3 skeleton-shimmer"></div>
                </div>
              </div>
            </div>

            {/* Price/Context Skeleton Sidebar */}
            <div className="md:col-span-4 flex flex-col gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-outline-variant/10">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-headline text-xl font-bold">Budget Estimate</h3>
                  <span className="material-symbols-outlined text-tertiary">payments</span>
                </div>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex justify-between items-center">
                      <div className="h-4 w-24 bg-surface-container-high rounded skeleton-shimmer"></div>
                      <div className="h-4 w-16 bg-surface-container-high rounded skeleton-shimmer"></div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between">
                  <div className="h-6 w-20 bg-surface-container-high rounded skeleton-shimmer"></div>
                  <div className="h-6 w-24 bg-primary/20 rounded skeleton-shimmer"></div>
                </div>
              </div>

              <div className="bg-surface-container-high/30 p-6 rounded-xl border border-dashed border-outline-variant/30 flex-grow">
                <div className="flex items-center gap-3 mb-4">
                  <span className="material-symbols-outlined text-primary">auto_awesome</span>
                  <span className="text-xs font-bold uppercase tracking-widest text-primary">AI Insight</span>
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-full bg-surface-container-high rounded skeleton-shimmer"></div>
                  <div className="h-3 w-5/6 bg-surface-container-high rounded skeleton-shimmer"></div>
                  <div className="h-3 w-4/6 bg-surface-container-high rounded skeleton-shimmer"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <VelocityPulse />
    </div>
  );
}
