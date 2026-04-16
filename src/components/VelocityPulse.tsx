'use client';

export default function VelocityPulse() {
  return (
    <div className="fixed bottom-12 right-12 flex flex-col items-end gap-4 z-50 group">
      <div className="glass-panel px-6 py-4 rounded-2xl shadow-2xl border border-white/40 max-w-xs text-sm mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <p className="text-on-surface font-medium italic">
          "Curator, the monsoon schedule for Kerala is shifting. Shall I optimize your December booking?"
        </p>
      </div>
      <button className="h-16 w-16 rounded-full bg-gradient-to-tr from-primary to-primary-container flex items-center justify-center text-white shadow-2xl transition-all hover:scale-110 active:scale-95 group relative overflow-hidden">
        <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
          auto_awesome
        </span>
        {/* Ambient Glow */}
        <div className="absolute inset-0 rounded-full bg-primary blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
        {/* Pulse Effect */}
        <div className="absolute inset-0 rounded-full border-4 border-primary animate-ping opacity-20" />
      </button>
    </div>
  );
}
