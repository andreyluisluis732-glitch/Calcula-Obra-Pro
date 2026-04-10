'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, 
  History, 
  FileText, 
  ChevronRight, 
  ArrowRight, 
  BarChart3, 
  Plus,
  CreditCard,
  Zap
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { generateProjectPDF } from '@/lib/pdf-generator';
import { getSupabase } from '@/lib/supabase';

interface Project {
  project_id: string;
  title: string;
  created_at: string;
  estimated_cost: number;
}

export default function Home() {
  const { t } = useLanguage();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const sb = getSupabase();
      if (!sb) {
        console.warn('Supabase not configured');
        return;
      }

      const { data, error } = await sb
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching projects:', error);
      } else {
        setProjects(data || []);
      }
    };

    fetchProjects();
  }, []);

  const handleQuickExport = () => {
    try {
      setStatusMessage(t('downloadStarted'));
      generateProjectPDF({
        title: 'Residência Luxo - Setor A',
        area: 180,
        rooms: 6,
        roomsList: '- 3x Quartos\n- 2x Banheiros\n- 1x Cozinha\n- 1x Sala de Estar\n- 1x Garagem',
        tier: 'Alto Padrão',
        cost: 'R$ 1.452.000,00',
        date: '10 Abr, 2026',
        id: '#88291-L'
      });
      
      // Auto-clear message after 5 seconds
      setTimeout(() => setStatusMessage(null), 5000);
    } catch (error) {
      console.error('Error in handleQuickExport:', error);
      setStatusMessage('Erro ao gerar PDF');
      setTimeout(() => setStatusMessage(null), 5000);
    }
  };

  return (
    <main className="pt-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen pb-24 md:pb-12">
      {/* Special Offer Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Link 
          href="/sales"
          className="group flex items-center justify-between bg-slate-900 text-white p-4 rounded-2xl shadow-xl hover:bg-slate-800 transition-all border border-white/10"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center animate-pulse">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-orange-500">{t('salesOffer')}</p>
              <p className="text-sm font-bold">{t('salesHeadline').split('!')[0]}!</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-orange-500 font-black text-xs uppercase tracking-widest group-hover:translate-x-1 transition-transform">
            {t('continue')} <ArrowRight className="w-4 h-4" />
          </div>
        </Link>
      </motion.div>

      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 relative overflow-hidden rounded-2xl bg-white p-8 md:p-12 shadow-sm border border-slate-100"
      >
        <div className="relative z-10 grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="text-center lg:text-left">
            <span className="inline-block px-3 py-1 rounded bg-orange-100 text-orange-700 font-headline text-[10px] font-bold uppercase tracking-[0.2em] mb-4 md:mb-6">
              {t('professionalEstimator')}
            </span>
            <h2 className="font-headline text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-4 md:mb-6 leading-[1.1] md:leading-[0.9]">
              {t('precisionEngineering').split(' ')[0]} <br /> <span className="text-orange-600">{t('precisionEngineering').split(' ')[1]}</span>
            </h2>
            <p className="text-slate-500 text-base md:text-lg max-w-md mx-auto lg:mx-0 mb-8 md:mb-10 leading-relaxed font-sans">
              {t('heroDescription')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/simulation"
                className="group flex items-center justify-center gap-3 bg-gradient-to-br from-orange-600 to-orange-700 text-white px-8 py-5 rounded-xl font-headline font-bold uppercase tracking-widest text-sm shadow-xl transition-all hover:scale-[1.02] active:scale-95"
              >
                <Cpu className="w-5 h-5" />
                {t('newSimulation')}
              </Link>
            </div>
          </div>
          <div className="relative h-full min-h-[300px]">
            <div className="absolute inset-0 bg-slate-100 rounded-2xl overflow-hidden shadow-inner">
              <Image
                src="https://picsum.photos/seed/architecture/800/600"
                alt="Modern architectural structure"
                fill
                className="object-cover mix-blend-multiply opacity-60"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border-l-4 border-orange-600">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{t('currentProjectLoad')}</span>
                  <span className="text-xs font-mono font-bold text-orange-600">82%</span>
                </div>
                <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '82%' }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="bg-orange-600 h-full" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Bento Action Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-12">
        <Link href="/history" className="block">
          <motion.button 
            whileHover={{ y: -5 }}
            className="w-full h-full group flex flex-col items-start p-6 md:p-8 bg-white rounded-2xl transition-all duration-300 hover:bg-orange-50 hover:shadow-lg text-left border border-slate-100"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-4 md:mb-6 group-hover:bg-orange-100 transition-colors">
              <History className="text-orange-600 w-5 h-5 md:w-6 md:h-6" />
            </div>
            <h3 className="font-headline font-bold text-lg md:text-xl mb-2">{t('history')}</h3>
            <p className="text-xs md:text-sm text-slate-500 font-sans mb-4 md:mb-6">{t('historyDesc')}</p>
            <span className="text-[10px] md:text-[11px] font-bold text-orange-600 uppercase tracking-widest mt-auto flex items-center gap-2">
              {t('viewVault')} <ArrowRight className="w-3 h-3" />
            </span>
          </motion.button>
        </Link>

        <motion.button 
          whileHover={{ y: -5 }}
          onClick={handleQuickExport}
          className="group flex flex-col items-start p-6 md:p-8 bg-white rounded-2xl transition-all duration-300 hover:bg-slate-50 hover:shadow-lg text-left border border-slate-100"
        >
          <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-4 md:mb-6 group-hover:bg-slate-200 transition-colors">
            <FileText className="text-slate-600 w-5 h-5 md:w-6 md:h-6" />
          </div>
          <h3 className="font-headline font-bold text-lg md:text-xl mb-2">{t('exportPdf')}</h3>
          <p className="text-xs md:text-sm text-slate-500 font-sans mb-4 md:mb-6">{t('exportPdfDesc')}</p>
          <span className="text-[10px] md:text-[11px] font-bold text-slate-600 uppercase tracking-widest mt-auto flex items-center gap-2">
            {t('generateReport')} <ArrowRight className="w-3 h-3" />
          </span>
        </motion.button>

        <div className="bg-slate-900 text-white p-6 md:p-8 rounded-2xl flex flex-col justify-between shadow-xl sm:col-span-2 lg:col-span-1">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">{t('portfolioValue')}</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-headline font-black tracking-tighter">$2.4M</span>
              <span className="text-xs text-orange-400 font-bold">+12.5%</span>
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-3">
            <div className="flex justify-between items-center text-xs opacity-70">
              <span>{t('activeProjects')}</span>
              <span className="font-bold">14</span>
            </div>
            <div className="flex justify-between items-center text-xs opacity-70">
              <span>{t('avgMargin')}</span>
              <span className="font-bold">22.4%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <section className="mb-12">
        <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32 blur-3xl"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl text-center md:text-left">
              <h3 className="text-3xl md:text-4xl font-headline font-black tracking-tighter mb-4">
                {t('getProVersion')}
              </h3>
              <p className="text-orange-100 text-lg mb-0">
                {t('paymentDesc')}
              </p>
            </div>
            <Link 
              href="https://pay.cakto.com.br/viy6pcw_844596"
              target="_blank"
              className="bg-white text-orange-600 px-10 py-5 rounded-2xl font-headline font-bold uppercase tracking-widest text-sm shadow-xl hover:bg-slate-50 transition-all active:scale-95 flex items-center gap-3 shrink-0"
            >
              <CreditCard className="w-5 h-5" />
              {t('unlockFullProject')}
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="mb-20">
        <div className="flex items-center justify-between mb-8">
          <h4 className="font-headline font-bold text-sm uppercase tracking-widest text-slate-500">{t('activityLog')}</h4>
          <div className="h-px bg-slate-200 flex-grow mx-6"></div>
        </div>
        <div className="space-y-4">
          {projects.length > 0 ? (
            projects.map((item, i) => (
              <Link 
                key={i}
                href={`/simulation?id=${item.project_id.replace('#', '')}&view=true`}
                className="grid grid-cols-12 items-center p-4 md:p-5 bg-white rounded-xl group hover:translate-x-2 transition-transform shadow-sm border border-slate-100 cursor-pointer"
              >
                <div className="col-span-2 md:col-span-1 flex justify-center">
                  <BarChart3 className="text-orange-600 w-5 h-5" />
                </div>
                <div className="col-span-8 md:col-span-4">
                  <span className="block text-sm font-bold text-slate-900 truncate">{item.title}</span>
                  <span className="text-[10px] uppercase text-slate-400 tracking-wider">Project ID: {item.project_id}</span>
                </div>
                <div className="hidden md:col-span-3 md:flex items-center">
                  <span className="text-xs font-mono text-slate-500">{new Date(item.created_at).toLocaleDateString()}</span>
                </div>
                <div className="col-span-2 md:col-span-3 text-right md:text-left">
                  <span className="text-sm font-black text-slate-900 block md:inline">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.estimated_cost).split(',')[0]}
                  </span>
                  <span className="text-[10px] text-slate-400 md:hidden">{new Date(item.created_at).toLocaleDateString()}</span>
                </div>
                <div className="hidden md:col-span-1 md:flex justify-end">
                  <ChevronRight className="text-slate-300 group-hover:text-orange-600 transition-colors" />
                </div>
              </Link>
            ))
          ) : (
            <div className="p-12 text-center bg-white rounded-xl border border-dashed border-slate-200">
              <History className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Nenhuma atividade recente</p>
            </div>
          )}
        </div>
      </section>

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
