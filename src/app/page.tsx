import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-full p-12 flex flex-col items-center justify-center text-center space-y-8 bg-gradient-to-b from-[#FAF8F5] to-[#F4F0E8]">
      <span className="px-4 py-1.5 rounded-full bg-[#18181B] text-[#D4A843] text-xs font-semibold uppercase tracking-widest">
        Unified Migration Complete • PlanYatri v2.0
      </span>
      <h1 className="text-5xl md:text-7xl font-serif font-extrabold text-[#18181B] max-w-4xl leading-tight">
        Next-Generation Intelligent Travel Orchestration
      </h1>
      <p className="text-lg text-[#71717A] max-w-2xl font-sans">
        Seamlessly combining PlanYatri's rich telemetry &amp; emergency SOS services with Next.js 16 AI wizard &amp; itinerary engine.
      </p>
      
      <div className="flex flex-wrap gap-4 justify-center pt-4">
        <Link href="/dashboard" className="px-8 py-3.5 rounded-lg bg-[#18181B] text-white font-bold hover:bg-[#27272A] transition-all shadow-lg">
          Launch Dashboard
        </Link>
        <Link href="/wizard/destination" className="px-8 py-3.5 rounded-lg bg-white border border-[#EFEAE2] text-[#18181B] font-bold hover:bg-[#FAF8F5] transition-all">
          Start Travel Wizard
        </Link>
        <Link href="/emergency" className="px-8 py-3.5 rounded-lg bg-[#EF4444] text-white font-bold hover:bg-[#DC2626] transition-all">
          Emergency SOS
        </Link>
      </div>
    </div>
  );
}
