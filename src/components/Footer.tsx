export default function Footer() {
  return (
    <footer className="w-full py-12 px-8 mt-20 border-t border-slate-200 dark:border-slate-800 bg-[#F9F9F9] dark:bg-slate-950 text-on-background">
      <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        <div className="font-serif text-lg text-slate-900 dark:text-white font-bold tracking-tight">PlanYatri</div>
        <div className="flex justify-center gap-8 font-sans text-[10px] uppercase tracking-widest font-bold">
          <a className="text-slate-400 dark:text-slate-500 hover:text-primary transition-colors opacity-80 hover:opacity-100" href="#">About</a>
          <a className="text-slate-400 dark:text-slate-500 hover:text-primary transition-colors opacity-80 hover:opacity-100" href="#">Privacy</a>
          <a className="text-slate-400 dark:text-slate-500 hover:text-primary transition-colors opacity-80 hover:opacity-100" href="#">Contact</a>
          <a className="text-slate-400 dark:text-slate-500 hover:text-primary transition-colors opacity-80 hover:opacity-100" href="#">Terms</a>
        </div>
        <div className="text-right font-sans text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold">
          © 2024 PlanYatri. Curating the Indian Landscape.
        </div>
      </div>
    </footer>
  );
}
