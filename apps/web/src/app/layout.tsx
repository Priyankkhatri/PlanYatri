import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PlanYatri — Enterprise AI Travel Orchestration',
  description: 'Next-generation intelligent travel planning & telemetry.'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans bg-[#FAF8F5] text-[#18181B]">
        {children}
      </body>
    </html>
  );
}
