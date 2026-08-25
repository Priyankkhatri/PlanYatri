import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen p-12 flex flex-col items-center justify-center text-center space-y-8 bg-gradient-to-b from-[#FAF8F5] to-[#F4F0E8]">
      <span className="px-4 py-1.5 rounded-full bg-[#18181B] text-[#D4A843] text-xs font-semibold uppercase tracking-widest">
        Enterprise Monorepo • PlanYatri v2.0
      </span>
      <h1 className="text-5xl md:text-7xl font-serif font-extrabold text-[#18181B] max-w-4xl leading-tight">
        PlanYatri Travel Orchestration Engine
      </h1>
      <p className="text-lg text-[#71717A] max-w-2xl font-sans">
        Frontend (`apps/web`) &amp; Express API (`apps/backend`) running inside a company-grade monorepo architecture.
      </p>
      
      <div className="flex flex-wrap gap-4 justify-center pt-4">
        <Link href="/dashboard" className="px-8 py-3.5 rounded-lg bg-[#18181B] text-white font-bold hover:bg-[#27272A] transition-all shadow-lg">
          Web App Dashboard
        </Link>
      </div>
    </div>
  );
}
