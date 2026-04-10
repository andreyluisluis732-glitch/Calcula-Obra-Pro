'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Bell, Shield, CreditCard, HelpCircle, LogOut, Plus } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function SettingsPage() {
  const { t } = useLanguage();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const sections = [
    { icon: User, label: t('profile'), sub: t('profileDesc'), action: () => setStatusMessage(t('profile')) },
    { icon: Bell, label: t('notifications'), sub: t('notificationsDesc'), action: () => setStatusMessage(t('notifications')) },
    { icon: Shield, label: t('security'), sub: t('securityDesc'), action: () => setStatusMessage(t('security')) },
    { icon: CreditCard, label: t('subscription'), sub: t('subscriptionDesc'), action: () => window.open('https://pay.cakto.com.br/viy6pcw_844596', '_blank') },
    { icon: HelpCircle, label: t('support'), sub: t('supportDesc'), action: () => setStatusMessage(t('support')) },
  ];

  return (
    <main className="pt-24 px-6 md:px-12 max-w-3xl mx-auto min-h-screen pb-24 md:pb-12">
      <div className="mb-12">
        <h2 className="text-4xl font-headline font-extrabold tracking-tight text-slate-900">{t('settings')}</h2>
        <p className="text-slate-500 mt-2">{t('settingsDesc') || 'Configure suas preferências'}</p>
      </div>

      <div className="space-y-4">
        {sections.map((item, i) => (
          <motion.button 
            key={i}
            whileHover={{ x: 5 }}
            onClick={item.action}
            className="w-full flex items-center gap-6 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:bg-slate-50 transition-all text-left"
          >
            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600">
              <item.icon className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-lg font-bold text-slate-900">{item.label}</span>
              <span className="text-sm text-slate-500">{item.sub}</span>
            </div>
          </motion.button>
        ))}

        <button 
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full flex items-center gap-6 p-6 bg-white rounded-2xl border border-red-100 shadow-sm hover:bg-red-50 transition-all text-left mt-12 group"
        >
          <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-600 group-hover:bg-red-100 transition-colors">
            <LogOut className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-lg font-bold text-red-600">{t('logout')}</span>
            <span className="text-sm text-red-400">{t('logoutDesc')}</span>
          </div>
        </button>
      </div>

      <AnimatePresence>
        {statusMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[200] bg-slate-900 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3"
          >
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-bold uppercase tracking-widest">{statusMessage}</span>
            <button 
              onClick={() => setStatusMessage(null)}
              className="ml-4 text-slate-400 hover:text-white"
            >
              <Plus className="w-4 h-4 rotate-45" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-8 rounded-[2rem] max-w-sm w-full shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-600 mx-auto mb-6">
                <LogOut className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-headline font-black text-slate-900 mb-2 uppercase tracking-tighter">{t('logout')}</h3>
              <p className="text-slate-500 mb-8">{t('logoutDesc')}</p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => window.location.href = '/'}
                  className="w-full py-4 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all"
                >
                  {t('logout')}
                </button>
                <button 
                  onClick={() => setShowLogoutConfirm(false)}
                  className="w-full py-4 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
                >
                  {t('back')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
