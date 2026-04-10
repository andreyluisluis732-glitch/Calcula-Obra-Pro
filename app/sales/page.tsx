'use client';

import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Clock, 
  HardHat,
  Calculator,
  Layers,
  Maximize
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import Image from 'next/image';

export default function SalesPage() {
  const { t } = useLanguage();
  const checkoutUrl = "https://pay.cakto.com.br/viy6pcw_844596";

  const features = [
    { icon: Clock, text: t('salesFeature1') },
    { icon: Layers, text: t('salesFeature2') },
    { icon: Calculator, text: t('salesFeature3') },
    { icon: Maximize, text: t('salesFeature4') },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-orange-100 selection:text-orange-900">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden border-b border-slate-100">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-50 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block px-4 py-1.5 rounded-full bg-orange-100 text-orange-700 text-[10px] font-black uppercase tracking-[0.2em] mb-8"
            >
              {t('salesOffer')}
            </motion.span>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-headline text-4xl md:text-7xl font-black tracking-tighter leading-[0.9] mb-8 text-slate-900"
            >
              {t('salesHeadline')}
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              {t('salesSubheadline')}
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <Link 
                href={checkoutUrl}
                target="_blank"
                className="group relative flex items-center gap-4 bg-orange-600 text-white px-10 py-6 rounded-2xl font-headline font-black uppercase tracking-widest text-sm shadow-2xl shadow-orange-600/20 transition-all hover:scale-[1.02] active:scale-95"
              >
                {t('salesCTA')}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <div className="text-left">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-slate-400 line-through text-sm">R$ 97,00</span>
                  <span className="text-2xl font-black text-slate-900">{t('salesPrice')}</span>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('salesPriceDesc')}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-600 group-hover:text-white transition-all">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 leading-tight">
                  {feature.text}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / Trust */}
      <section className="py-24 border-t border-slate-100">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl">
              <Image 
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80"
                alt="Construction site"
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
              <div className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Zap key={i} className="w-4 h-4 text-orange-400 fill-orange-400" />
                  ))}
                </div>
                <p className="text-white font-medium italic">&quot;{t('salesTestimonial')}&quot;</p>
                <p className="text-orange-300 text-xs font-bold uppercase tracking-widest mt-4">— {t('salesTestimonialAuthor')}</p>
              </div>
            </div>

            <div className="space-y-8">
              <h2 className="text-4xl font-headline font-black tracking-tighter text-slate-900 leading-none">
                {t('salesBuiltFor')} <span className="text-orange-600">{t('salesBuildReal')}</span>
              </h2>
              <p className="text-slate-500 text-lg leading-relaxed">
                {t('salesDescription')}
              </p>
              
              <ul className="space-y-4">
                {[
                  t('salesBullet1'),
                  t('salesBullet2'),
                  t('salesBullet3'),
                  t('salesBullet4')
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                    <span className="font-bold text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>

              <Link 
                href={checkoutUrl}
                target="_blank"
                className="inline-flex items-center gap-4 bg-slate-900 text-white px-10 py-6 rounded-2xl font-headline font-bold uppercase tracking-widest text-sm shadow-xl hover:bg-slate-800 transition-all active:scale-95"
              >
                {t('salesCTA')}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#fff_1px,transparent_1px)] bg-[length:40px_40px]"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h2 className="text-5xl md:text-7xl font-headline font-black tracking-tighter mb-8 leading-none">
            {t('salesFinalHeadline')} <br /> <span className="text-orange-500">{t('salesFinalPrice')}</span>
          </h2>
          <p className="text-slate-400 text-xl mb-12 max-w-2xl mx-auto">
            {t('salesFinalDesc')}
          </p>
          
          <Link 
            href={checkoutUrl}
            target="_blank"
            className="group inline-flex items-center gap-4 bg-orange-600 text-white px-12 py-8 rounded-3xl font-headline font-black uppercase tracking-widest text-lg shadow-2xl shadow-orange-600/40 transition-all hover:scale-[1.05] active:scale-95"
          >
            {t('salesCTA')}
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </Link>
          
          <div className="mt-12 flex items-center justify-center gap-8 opacity-50 grayscale">
            <ShieldCheck className="w-12 h-12" />
            <Zap className="w-12 h-12" />
            <HardHat className="w-12 h-12" />
            <Calculator className="w-12 h-12" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100 text-center">
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
          © 2026 Calcula Obra Pro. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}
