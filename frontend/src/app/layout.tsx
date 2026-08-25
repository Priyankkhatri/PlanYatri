import type { Metadata } from 'next';
import { AppProviders } from '@/components/providers/AppProviders';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: 'PlanYatri — Enterprise Travel Architecture',
  description: 'Full-stack Next.js & Express Travel Platform.'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans bg-[#FAF8F5] text-[#18181B]">
        <AppProviders>
          <div className="flex h-screen w-screen overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
              <Header />
              <main className="flex-1 overflow-y-auto">
                {children}
              </main>
              <Footer />
            </div>
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
