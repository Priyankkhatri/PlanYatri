import Sidebar from '@/components/Sidebar';
import VelocityPulse from '@/components/VelocityPulse';

export default function Dashboard() {
  return (
    <div className="bg-surface min-h-screen">
      <Sidebar />
      
      <main className="lg:ml-64 p-8 md:p-12 min-h-screen">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
          <div className="max-w-2xl">
            <span className="font-label text-xs uppercase tracking-[0.2em] text-tertiary mb-3 block font-bold">Member Status: Platinum</span>
            <h1 className="font-headline text-5xl font-bold tracking-tight text-on-background uppercase">Welcome back, Curator</h1>
            <p className="text-on-surface-variant mt-4 text-lg font-light max-w-lg leading-relaxed">
              Your curated Indian escapes are waiting. We've updated your logistics for Udaipur and synchronized your travel documents.
            </p>
          </div>
          <div className="flex items-center gap-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <div className="text-right">
              <p className="font-label text-[10px] uppercase tracking-widest text-outline font-bold">Active Budget</p>
              <p className="font-headline text-2xl font-bold text-primary">₹4,20,500</p>
            </div>
            <div className="h-14 w-14 rounded-full border-2 border-primary p-0.5 overflow-hidden">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWYmex30VbM9blehRRUHsfhp9V3OrkzZ7-UqnG8bIE4TSQEdlFd9aH_lJeF_cU8Dy9B-Wof6LIuIn2iNUIq69ZmDaowMYctWrBIH1-UaSWyr0AN-nfwL-t9Jy6hqp671nhtv20Mz4y8ZLnjLTV9xkbM9oceFJAI0DFAUgwAZzyGqelG7POb83OFzmNcxuAhx7r0EM7CC85tCqaH7KKwlxA-lKXyeFEcfyAixdu98UpvU4Dr9-UghA_DKQT62BIvFlY9N30Xgg_csE" 
                alt="User"
                className="h-full w-full rounded-full object-cover" 
              />
            </div>
          </div>
        </header>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-12 gap-8 items-start">
          {/* Spending Insights Card */}
          <section className="col-span-12 lg:col-span-4 bg-surface-container-low rounded-xl p-8 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="font-headline text-xl font-bold">Spending Insights</h2>
                  <p className="text-xs text-on-surface-variant uppercase tracking-widest mt-1 font-bold">Quarterly Overview</p>
                </div>
                <span className="material-symbols-outlined text-primary">monitoring</span>
              </div>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Luxury Heritage</span>
                    <span className="text-sm font-bold">₹2,45,000</span>
                  </div>
                  <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full w-[65%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Private Aviation</span>
                    <span className="text-sm font-bold">₹1,15,000</span>
                  </div>
                  <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                    <div className="h-full bg-tertiary rounded-full w-[35%]"></div>
                  </div>
                </div>
              </div>
              <div className="mt-10 pt-8 border-t border-outline-variant/20">
                <p className="text-sm italic text-on-surface-variant leading-relaxed">
                  "Your preference for heritage hotels has increased by 12% this season. Consider the Leela Palace Udaipur for your next trip."
                </p>
              </div>
            </div>
            {/* Decorative background glow */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
          </section>

          {/* Saved Trip Cards Grid */}
          <section className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Trip Card: Udaipur */}
            <div className="group bg-surface-container-lowest rounded-xl overflow-hidden transition-all duration-300 hover:translate-y-[-4px] shadow-sm hover:shadow-md cursor-pointer">
              <div className="h-64 relative overflow-hidden">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmQKq2aDfRjXrIDtzr3GSA4G-4LmBsoEzoRbm70wONQ4Civ0aPxd_FW-TNX5alBbTxsMpD1EDUmTxKW-_C5PMHn-Yha5yTpYxb0MxKe7-aYaM9HnJ_ttFq6ZA0WMy5QxNWEOLlNIbAJINDiNnbO2ETxUTMoX3rhgU9-f1IAPLXWIIbKUDFczWKMNeoG1pIb63qBAmhF-Xfy-qhj_5rPWDfIajUoS_olkxsHHv_pqKt7RoiXl6e77YHozs6Ay-D5VugT7iSBdRw5ak" 
                  alt="Udaipur"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-primary/90 backdrop-blur-md text-white text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full">Signature Elite</span>
                </div>
                <div className="absolute bottom-4 left-4">
                  <p className="text-white font-headline text-2xl font-bold drop-shadow-md">Udaipur</p>
                  <p className="text-white/80 text-xs flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">calendar_month</span> Oct 12 - Oct 18
                  </p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-outline uppercase tracking-wider mb-1 font-bold">Estimated Cost</p>
                    <p className="font-headline text-xl font-bold text-on-background">₹1,85,000 <span className="text-xs font-normal text-on-surface-variant">/person</span></p>
                  </div>
                  <button className="h-10 w-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>

            {/* New Trip Placeholder Card */}
            <div className="group border-2 border-dashed border-outline-variant/30 rounded-xl overflow-hidden flex flex-col items-center justify-center min-h-[340px] transition-colors hover:border-primary/50 hover:bg-primary/5 cursor-pointer">
              <div className="h-16 w-16 rounded-full bg-surface-container-high flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all mb-4">
                <span className="material-symbols-outlined text-3xl">add_location_alt</span>
              </div>
              <p className="font-headline text-xl font-bold text-on-surface-variant group-hover:text-primary transition-colors">Start a New Journey</p>
              <p className="text-sm text-outline mt-2">Let AI curate your next escape</p>
            </div>
          </section>
        </div>
      </main>

      <VelocityPulse />
    </div>
  );
}
