'use client';

import { Construction, UserCircle, Globe } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const { t, language, setLanguage } = useLanguage();
  const [showLangMenu, setShowLangMenu] = useState(false);

  const languages = [
    { code: 'pt', label: 'Português', flag: '🇧🇷' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
  ] as const;

  return (
    <header className="fixed top-0 w-full z-50 flex items-center justify-between px-6 h-16 bg-white/80 backdrop-blur-xl shadow-sm border-b border-slate-100">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-slate-900 flex items-center justify-center rounded-lg">
          <Construction className="text-white w-6 h-6" />
        </div>
        <h1 className="text-xl font-black uppercase tracking-tighter text-slate-900 font-headline">
          Calcula Obra Pro
        </h1>
      </div>
      
      <nav className="hidden md:flex items-center gap-8">
        <Link href="/" className="text-orange-600 font-headline font-bold tracking-tight text-sm uppercase transition-all">
          {t('home')}
        </Link>
        <Link href="/history" className="text-slate-500 font-headline font-bold tracking-tight text-sm uppercase hover:text-slate-900 transition-all">
          {t('history')}
        </Link>
        <Link href="/settings" className="text-slate-500 font-headline font-bold tracking-tight text-sm uppercase hover:text-slate-900 transition-all">
          {t('settings')}
        </Link>
      </nav>

      <div className="flex items-center gap-2">
        <div className="relative">
          <button 
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="flex items-center gap-2 text-slate-500 hover:bg-slate-100 p-2 rounded-lg transition-all"
          >
            <Globe className="w-5 h-5" />
            <span className="text-xs font-bold uppercase">{language}</span>
          </button>

          <AnimatePresence>
            {showLangMenu && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-40 bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden z-50"
              >
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setShowLangMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-slate-50 transition-all"
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Link 
          href="/settings"
          className="text-slate-500 hover:bg-slate-100 p-2 rounded-full transition-all"
        >
          <UserCircle className="w-6 h-6" />
        </Link>
      </div>
    </header>
  );
}
