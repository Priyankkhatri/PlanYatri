export default function Header() {
  return (
    <header className="bg-[#F9F9F9]/80 backdrop-blur-xl w-full top-0 sticky z-50">
      <nav className="flex justify-between items-center w-full px-6 py-4 max-w-screen-2xl mx-auto">
        <div className="text-2xl font-black tracking-tighter text-primary">
          PlanYatri
        </div>
        <div className="hidden md:flex gap-8">
          <a className="text-primary font-bold border-b-2 border-primary transition-colors duration-300" href="#">Discover</a>
          <a className="text-slate-600 font-medium hover:text-primary transition-colors duration-300" href="#">Trips</a>
          <a className="text-slate-600 font-medium hover:text-primary transition-colors duration-300" href="#">Saved</a>
          <a className="text-slate-600 font-medium hover:text-primary transition-colors duration-300" href="#">Profile</a>
        </div>
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors">tune</span>
          <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors">notifications</span>
          <div className="w-8 h-8 rounded-full bg-surface-container-high overflow-hidden border-2 border-primary/20">
            <img 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBOuM-kpBenXVOSr-TuOOjvIeeDuiEQFfu6iPuYPmNK45jG1W_UySB-9ljbu9i56zPEaWygORfOGgcx5S642yrxyuCI-sb9_Hvwmj6XlsgKSkAUYqZYaQtFgcwT8Ic7wZGUxHz3TpqkIw4s9vnvc5cA0c5oy0JrrM_nlgUzyNhk8TS5bZFh_xmSQFSYektVrUuG2fS-xXXKpKjyAhnyU_xiopRjSqZAMCNV9zPnmn9dhjab1VNUS0mm5ewViaVHbQYBU0sbJ_a9EU" 
              alt="Profile"
            />
          </div>
        </div>
      </nav>
      <div className="bg-slate-100/50 h-[1px] w-full"></div>
    </header>
  );
}
