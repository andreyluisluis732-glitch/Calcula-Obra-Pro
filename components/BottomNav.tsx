'use client';

import { Home, History, Settings, Plus } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = [
    { icon: Home, label: t('home'), href: '/' },
    { icon: History, label: t('history'), href: '/history' },
    { icon: Settings, label: t('settings'), href: '/settings' },
  ];

  return (
    <>
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-20 px-4 pb-safe bg-white/80 backdrop-blur-xl md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.05)] border-t border-slate-100">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center transition-all duration-200 ease-out active:scale-90",
                isActive ? "text-orange-600 scale-110" : "text-slate-400"
              )}
            >
              <item.icon className="w-6 h-6" />
              <span className="mt-1 text-[10px] font-bold uppercase tracking-widest font-headline">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Contextual FAB for mobile */}
      <Link 
        href="/simulation"
        className="md:hidden fixed bottom-24 right-6 w-14 h-14 bg-orange-600 text-white rounded-full shadow-2xl flex items-center justify-center active:scale-95 transition-all z-50"
      >
        <Plus className="w-8 h-8" />
      </Link>
    </>
  );
}
