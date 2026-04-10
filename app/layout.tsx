import type {Metadata} from 'next';
import { Inter, Manrope, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import { LanguageProvider } from '@/context/LanguageContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-headline',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Calcula Obra Pro',
  description: 'Professional construction cost estimator',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${manrope.variable} ${jetbrainsMono.variable}`}>
      <body suppressHydrationWarning className="bg-slate-50 text-slate-900 antialiased">
        <LanguageProvider>
          <Navbar />
          {children}
          <BottomNav />
        </LanguageProvider>
      </body>
    </html>
  );
}
