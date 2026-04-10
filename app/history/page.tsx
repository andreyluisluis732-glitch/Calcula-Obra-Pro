'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, ChevronRight, BarChart3, Construction, Plus, MessageCircle, Download } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { generateProjectPDF } from '@/lib/pdf-generator';

export default function HistoryPage() {
  const { t } = useLanguage();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const items = [
    { title: 'Luxury Residence - Sector A', id: '#88291-L', date: '10 Abr, 2026', value: 'R$ 1.452.000,00', icon: BarChart3 },
    { title: 'Commercial Warehouse Foundation', id: '#44012-W', date: '08 Abr, 2026', value: 'R$ 342.800,00', icon: Construction },
    { title: 'Modern Duplex - Downtown', id: '#12345-D', date: '05 Abr, 2026', value: 'R$ 890.000,00', icon: BarChart3 },
    { title: 'Beach House Renovation', id: '#67890-R', date: '01 Abr, 2026', value: 'R$ 150.000,00', icon: Construction },
  ];

  const handleWhatsAppShare = (item: { title: string; value: string; date: string }) => {
    const message = t('whatsappMessage', {
      area: '---', // Mocked as we don't store full data in this simple list
      rooms: '---',
      tier: '---',
      cost: item.value,
      date: item.date
    }).replace('- Área: ---m²\n', '').replace('- Cômodos: ---\n', '').replace('- Padrão: ---\n', '');
    
    const encodedMessage = encodeURIComponent(`*${item.title}*\n${message}`);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  };

  const handleDownloadPDF = (item: { title: string; value: string; date: string; id: string }) => {
    setStatusMessage(t('downloadStarted'));
    generateProjectPDF({
      title: item.title,
      area: 0, // Not stored in simple list
      rooms: 0,
      roomsList: '---',
      tier: '---',
      cost: item.value,
      date: item.date,
      id: item.id
    });
  };

  return (
    <main className="pt-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen pb-24 md:pb-12">
      <div className="mb-12">
        <h2 className="text-4xl font-headline font-extrabold tracking-tight text-slate-900">{t('history')}</h2>
        <p className="text-slate-500 mt-2">{t('historyDesc')}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder={t('searchProject')} 
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-600 focus:border-transparent"
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-4 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-all">
          <Filter className="w-5 h-5" />
          {t('filter')}
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => setStatusMessage(`${item.title}`)}
            className="grid grid-cols-12 items-center p-6 bg-white rounded-2xl group hover:shadow-md transition-all border border-slate-100 cursor-pointer"
          >
            <div className="col-span-1 flex justify-center">
              <item.icon className="text-orange-600 w-6 h-6" />
            </div>
            <div className="col-span-11 md:col-span-5">
              <span className="block text-lg font-bold text-slate-900">{item.title}</span>
              <span className="text-xs uppercase text-slate-400 tracking-wider">Project ID: {item.id}</span>
            </div>
            <div className="col-span-6 md:col-span-3 text-left mt-4 md:mt-0">
              <span className="text-sm font-mono text-slate-500">{item.date}</span>
            </div>
            <div className="col-span-6 md:col-span-2 text-right md:text-left mt-4 md:mt-0">
              <span className="text-lg font-black text-slate-900">{item.value}</span>
            </div>
            <div className="col-span-12 md:col-span-1 flex justify-end gap-2 mt-4 md:mt-0">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleWhatsAppShare(item);
                }}
                className="p-2 hover:bg-green-50 rounded-lg text-slate-300 hover:text-green-600 transition-all"
              >
                <MessageCircle className="w-5 h-5" />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownloadPDF(item);
                }}
                className="p-2 hover:bg-slate-100 rounded-lg text-slate-300 hover:text-slate-900 transition-all"
              >
                <Download className="w-5 h-5" />
              </button>
              <ChevronRight className="text-slate-300 group-hover:text-orange-600 transition-colors hidden md:block" />
            </div>
          </motion.div>
        ))}
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
    </main>
  );
}
