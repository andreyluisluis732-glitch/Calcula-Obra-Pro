'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import html2canvas from 'html2canvas';
import { 
  ArrowLeft, 
  ArrowRight, 
  Info, 
  Bed, 
  ShowerHead, 
  ChefHat, 
  Sofa, 
  Car, 
  Minus, 
  Plus,
  CheckCircle2,
  MapPin,
  Calendar,
  Ruler,
  Construction,
  Layers,
  Download,
  Maximize,
  RotateCw,
  Camera,
  MessageCircle,
  CreditCard
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

import { useLanguage } from '@/context/LanguageContext';
import { generateProjectPDF } from '@/lib/pdf-generator';
import { getSupabase } from '@/lib/supabase';

type Step = 1 | 2 | 3 | 'ar' | 'floorplan';

export default function SimulationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SimulationContent />
    </Suspense>
  );
}

function SimulationContent() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isViewOnly = searchParams.get('view') === 'true';
  const projectId = searchParams.get('id');

  const [step, setStep] = useState<Step>(isViewOnly ? 'floorplan' : 1);
  const [dimensions, setDimensions] = useState({ width: 0, length: 0 });
  const [rooms, setRooms] = useState({
    bedrooms: 2,
    bathrooms: 1,
    kitchen: 1,
    living: 1,
    garage: 1,
  });
  const [tier, setTier] = useState<'economic' | 'medium' | 'high' | 'luxury'>('medium');
  const floorPlanRef = useRef<HTMLDivElement>(null);
  const [arRotation, setArRotation] = useState(0);
  const [arScale, setArScale] = useState(1);
  const [showFlash, setShowFlash] = useState(false);
  const [isSuccess, setIsSuccess] = useState(isViewOnly);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [capturedFloorPlan, setCapturedFloorPlan] = useState<string | undefined>(undefined);

  // Load data from Supabase if projectId is present
  useEffect(() => {
    const fetchProject = async () => {
      if (projectId) {
        const sb = getSupabase();
        if (!sb) {
          // Fallback to mock data if Supabase not configured
          if (projectId === '88291-L') {
            setDimensions({ width: 12, length: 15 });
            setRooms({ bedrooms: 3, bathrooms: 2, kitchen: 1, living: 1, garage: 1 });
            setTier('luxury');
          } else if (projectId === '44012-W') {
            setDimensions({ width: 20, length: 30 });
            setRooms({ bedrooms: 0, bathrooms: 2, kitchen: 0, living: 0, garage: 4 });
            setTier('medium');
          }
          return;
        }

        const { data, error } = await sb
          .from('projects')
          .select('*')
          .eq('project_id', `#${projectId}`)
          .single();

        if (error) {
          console.error('Error fetching project:', error);
          // Fallback to mock data if not found in Supabase (for backward compatibility)
          if (projectId === '88291-L') {
            setDimensions({ width: 12, length: 15 });
            setRooms({ bedrooms: 3, bathrooms: 2, kitchen: 1, living: 1, garage: 1 });
            setTier('luxury');
          } else if (projectId === '44012-W') {
            setDimensions({ width: 20, length: 30 });
            setRooms({ bedrooms: 0, bathrooms: 2, kitchen: 0, living: 0, garage: 4 });
            setTier('medium');
          }
        } else if (data) {
          if (data.width && data.length) {
            setDimensions({ width: Number(data.width), length: Number(data.length) });
          } else {
            const areaVal = data.area;
            const side = Math.sqrt(areaVal);
            setDimensions({ width: Math.round(side), length: Math.round(side) });
          }
          setRooms(data.rooms);
          setTier(data.tier);
        }
      }
    };

    fetchProject();
  }, [projectId]);

  const area = useMemo(() => dimensions.width * dimensions.length, [dimensions]);
  const perimeter = useMemo(() => (dimensions.width + dimensions.length) * 2, [dimensions]);

  const isStepValid = useMemo(() => {
    if (step === 1) return dimensions.width > 0 && dimensions.length > 0;
    return true;
  }, [step, dimensions]);

  const totalRooms = useMemo(() => Object.values(rooms).reduce((a, b) => a + b, 0), [rooms]);

  const estimatedCost = useMemo(() => {
    const baseRate = {
      economic: 1500,
      medium: 2500,
      high: 4000,
      luxury: 6500,
    }[tier];
    
    // Simple calculation logic
    const roomCost = totalRooms * 15000;
    const areaCost = area * baseRate;
    return areaCost + roomCost;
  }, [area, totalRooms, tier]);

  const formatCurrency = (val: number) => {
    const locale = language === 'pt' ? 'pt-BR' : language === 'es' ? 'es-ES' : 'en-US';
    const currency = language === 'pt' ? 'BRL' : language === 'es' ? 'EUR' : 'USD';
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(val);
  };

  const updateRoom = (key: keyof typeof rooms, delta: number) => {
    setRooms(prev => ({ ...prev, [key]: Math.max(0, prev[key] + delta) }));
  };

  const handleSnapPhoto = () => {
    setShowFlash(true);
    setTimeout(() => setShowFlash(false), 150);
  };

  const handleWhatsAppShare = () => {
    const date = new Date().toLocaleDateString(language === 'pt' ? 'pt-BR' : language === 'es' ? 'es-ES' : 'en-US');
    
    const roomsList = [
      rooms.bedrooms > 0 ? `- ${rooms.bedrooms}x ${t('bedrooms')}` : null,
      rooms.bathrooms > 0 ? `- ${rooms.bathrooms}x ${t('bathrooms')}` : null,
      rooms.kitchen > 0 ? `- ${rooms.kitchen}x ${t('kitchen')}` : null,
      rooms.living > 0 ? `- ${rooms.living}x ${t('livingRoom')}` : null,
      rooms.garage > 0 ? `- ${rooms.garage}x ${t('garage')}` : null,
    ].filter(Boolean).join('\n');

    const message = t('whatsappMessage', {
      area: area.toString(),
      rooms: roomsList,
      tier: t(tier),
      cost: formatCurrency(estimatedCost),
      date: date
    });
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  };

  const handleDownloadPDF = async () => {
    setStatusMessage(t('downloadStarted'));
    console.log('Starting PDF generation...');
    
    let floorPlanImage = capturedFloorPlan;
    
    // If not captured yet (e.g. from the floor plan view directly), try to capture now
    if (!floorPlanImage && floorPlanRef.current) {
      try {
        console.log('Capturing floor plan on demand...');
        const canvas = await html2canvas(floorPlanRef.current, {
          scale: 2,
          backgroundColor: '#f8fafc',
          logging: true,
          useCORS: true,
          allowTaint: true
        });
        floorPlanImage = canvas.toDataURL('image/png');
      } catch (error) {
        console.error('Error capturing floor plan on demand:', error);
      }
    }

    const roomsList = [
      rooms.bedrooms > 0 ? `- ${rooms.bedrooms}x ${t('bedrooms')}` : null,
      rooms.bathrooms > 0 ? `- ${rooms.bathrooms}x ${t('bathrooms')}` : null,
      rooms.kitchen > 0 ? `- ${rooms.kitchen}x ${t('kitchen')}` : null,
      rooms.living > 0 ? `- ${rooms.living}x ${t('livingRoom')}` : null,
      rooms.garage > 0 ? `- ${rooms.garage}x ${t('garage')}` : null,
    ].filter(Boolean).join('\n');

    generateProjectPDF({
      title: 'Novo Projeto Residencial',
      area: area,
      rooms: totalRooms,
      roomsList: roomsList,
      floorPlanImage: floorPlanImage,
      tier: t(tier),
      cost: formatCurrency(estimatedCost),
      date: new Date().toLocaleDateString(),
      id: `#${Math.floor(Math.random() * 90000) + 10000}-S`
    });

    // Auto-clear message after 5 seconds
    setTimeout(() => setStatusMessage(null), 5000);
  };

  const handleConfirmLayout = async () => {
    // Capture the floor plan before hiding it
    if (floorPlanRef.current) {
      try {
        setStatusMessage(t('processing'));
        const canvas = await html2canvas(floorPlanRef.current, {
          scale: 2,
          backgroundColor: '#f8fafc',
          logging: false,
          useCORS: true,
          allowTaint: true
        });
        setCapturedFloorPlan(canvas.toDataURL('image/png'));

        // Save to Supabase
        const sb = getSupabase();
        if (sb) {
          const projectId = `#${Math.floor(Math.random() * 90000) + 10000}-S`;
          const { data: { user } } = await sb.auth.getUser();
          
          const { error } = await sb
            .from('projects')
            .insert([
              {
                project_id: projectId,
                title: 'Novo Projeto Residencial',
                area: area,
                width: dimensions.width,
                length: dimensions.length,
                rooms: rooms,
                tier: tier,
                estimated_cost: estimatedCost,
                user_id: user?.id || null
              }
            ]);

          if (error) {
            console.error('Error saving project to Supabase:', error);
          }
        }
      } catch (error) {
        console.error('Error pre-capturing floor plan:', error);
      }
    }
    setIsSuccess(true);
    setStatusMessage(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-16 pb-32">
      {/* Simulation Header */}
      <header className="fixed top-0 w-full z-50 flex items-center justify-between px-6 h-16 bg-white/80 backdrop-blur-xl shadow-sm border-b border-slate-100">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => step === 1 ? window.history.back() : setStep(prev => (typeof prev === 'number' ? (prev - 1) as Step : 3))}
            className="p-2 hover:bg-slate-100 rounded-full transition-all text-orange-600"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-black uppercase tracking-tighter text-slate-900 font-headline">
            Calcula Obra Pro
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {typeof step === 'number' && (
            <div className="px-3 py-1 bg-slate-100 rounded-full">
              <span className="font-headline text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
                {t('stepOf', { step: step.toString() })}
              </span>
            </div>
          )}
          {step === 'ar' && <span className="text-xs font-bold text-orange-600">{t('arProjection')}</span>}
          {step === 'floorplan' && <span className="text-xs font-bold text-orange-600">{t('viewFloorPlan')}</span>}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 pt-8">
        <AnimatePresence mode="wait">
          {!isSuccess && (
            <>
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
              <div className="mb-8">
                <span className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400 font-headline">{t('projectSetup')}</span>
                <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 mt-2">{t('terrainDimensions')}</h2>
                <p className="text-slate-500 mt-2">{t('terrainDesc')}</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="group">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">{t('width')} (m)</label>
                      <div className="relative">
                        <input 
                          type="number"
                          value={dimensions.width || ''}
                          onChange={(e) => setDimensions(prev => ({ ...prev, width: Number(e.target.value) }))}
                          className="w-full h-14 md:h-16 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-600 focus:border-transparent text-xl md:text-2xl font-bold px-4 transition-all"
                          placeholder="0.00"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 font-bold">M</span>
                      </div>
                    </div>
                    <div className="group">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">{t('length')} (m)</label>
                      <div className="relative">
                        <input 
                          type="number"
                          value={dimensions.length || ''}
                          onChange={(e) => setDimensions(prev => ({ ...prev, length: Number(e.target.value) }))}
                          className="w-full h-14 md:h-16 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-600 focus:border-transparent text-xl md:text-2xl font-bold px-4 transition-all"
                          placeholder="0.00"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 font-bold">M</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-50 p-6 rounded-2xl flex items-start gap-4 border border-orange-100">
                    <Info className="text-orange-600 w-5 h-5 mt-1 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900 mb-1">{t('technicalTip')}</p>
                      <p className="text-xs text-slate-600 leading-relaxed">{t('tipDesc')}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
                  <div className="relative z-10 space-y-8">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-4">{t('totalAreaCalc')}</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-6xl font-black tracking-tighter text-slate-900 font-headline">{area.toFixed(2)}</span>
                        <span className="text-2xl font-bold text-orange-600">m²</span>
                      </div>
                    </div>
                    <div className="space-y-4 pt-8 border-t border-slate-100">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-slate-500">{t('totalPerimeter')}</span>
                        <span className="text-sm font-bold text-slate-900">{perimeter.toFixed(2)} m</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-slate-500">{t('classification')}</span>
                        <span className="text-[10px] font-black uppercase bg-orange-100 text-orange-700 px-2 py-1 rounded">Residencial R1</span>
                      </div>
                    </div>
                    <div className="h-48 w-full bg-slate-50 rounded-xl flex items-center justify-center relative overflow-hidden">
                      <Image
                        src="https://picsum.photos/seed/blueprint/400/300"
                        alt="Technical preview"
                        fill
                        className="object-cover opacity-20 grayscale"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex flex-col items-center relative z-10">
                        <Layers className="text-slate-300 w-10 h-10" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-2">{t('technicalPreview')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="mb-8">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 mb-2 block">{t('projectSetup')}</span>
                <h2 className="text-4xl font-headline font-extrabold tracking-tight text-slate-900 leading-none mb-4">{t('selectRooms')}</h2>
                <p className="text-slate-500 text-lg leading-relaxed">{t('roomsDesc')}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { key: 'bedrooms', label: t('bedrooms'), sub: 'Dormitórios', icon: Bed },
                  { key: 'bathrooms', label: t('bathrooms'), sub: 'W.C. / Suítes', icon: ShowerHead },
                  { key: 'kitchen', label: t('kitchen'), sub: 'Área Gourmet', icon: ChefHat },
                  { key: 'living', label: t('livingRoom'), sub: 'Estar / Jantar', icon: Sofa },
                  { key: 'garage', label: t('garage'), sub: 'Vagas Cobertas', icon: Car, full: true },
                ].map((item) => (
                  <div 
                    key={item.key}
                    className={cn(
                      "bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between h-48 transition-all hover:bg-slate-50",
                      item.full && "md:col-span-2"
                    )}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <item.icon className="text-orange-600 w-8 h-8 mb-2" />
                        <h3 className="font-headline font-bold text-xl tracking-tight">{item.label}</h3>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{item.sub}</p>
                      </div>
                    </div>
                    <div className={cn("flex items-center justify-between bg-slate-50 rounded-xl p-2", item.full ? "max-w-xs ml-auto w-full" : "w-full")}>
                      <button 
                        onClick={() => updateRoom(item.key as keyof typeof rooms, -1)}
                        className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-orange-600 transition-all active:scale-90"
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                      <span className="font-headline font-extrabold text-2xl">{rooms[item.key as keyof typeof rooms].toString().padStart(2, '0')}</span>
                      <button 
                        onClick={() => updateRoom(item.key as keyof typeof rooms, 1)}
                        className="w-10 h-10 flex items-center justify-center bg-orange-600 text-white rounded-lg transition-all active:scale-90"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="flex items-baseline justify-between">
                <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">{t('finishStandard')}</h2>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{t('selectQuality')}</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(['economic', 'medium', 'high', 'luxury'] as const).map((tKey, i) => (
                  <button 
                    key={tKey}
                    onClick={() => setTier(tKey)}
                    className={cn(
                      "p-5 rounded-2xl text-left border-2 transition-all group relative overflow-hidden",
                      tier === tKey 
                        ? "bg-white border-orange-600 shadow-md ring-4 ring-orange-50" 
                        : "bg-white border-slate-100 hover:border-orange-200"
                    )}
                  >
                    <div className="flex justify-between items-start">
                      <span className={cn("text-[10px] font-bold uppercase tracking-tighter", tier === tKey ? "text-orange-600" : "text-slate-400")}>
                        Tier 0{i + 1}
                      </span>
                      {tier === tKey && <CheckCircle2 className="w-4 h-4 text-orange-600" />}
                    </div>
                    <p className="text-lg font-headline font-bold text-slate-900 mt-1 capitalize">{t(tKey)}</p>
                  </button>
                ))}
              </div>

              <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-xl">
                <div className="p-8 text-white flex flex-col md:flex-row md:items-end justify-between gap-4 bg-gradient-to-br from-slate-800 to-slate-900">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">{t('totalInvestment')}</label>
                    <div className="text-5xl md:text-6xl font-headline font-extrabold tracking-tighter mt-1">
                      {formatCurrency(estimatedCost).split(',')[0]}
                      <span className="text-2xl font-light opacity-50 ml-2">,00</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10">
                    <MapPin className="text-orange-400 w-4 h-4" />
                    <span className="text-sm font-bold tracking-tight">São Paulo, SP</span>
                  </div>
                </div>
                
                <div className="p-8 bg-white space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
                    {[
                      { label: `01 ${t('foundation')}`, title: 'Excavation & Concrete', value: estimatedCost * 0.17, progress: 17 },
                      { label: `02 ${t('structure')}`, title: 'Walls & Framing', value: estimatedCost * 0.34, progress: 34 },
                      { label: `03 ${t('roofing')}`, title: 'Tiling & Insulation', value: estimatedCost * 0.13, progress: 13 },
                      { label: `04 ${t('finishes')}`, title: 'Interior & External', value: estimatedCost * 0.36, progress: 36 },
                    ].map((item, i) => (
                      <div key={i} className="space-y-3">
                        <div className="flex justify-between items-end">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{item.label}</span>
                            <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                          </div>
                          <span className="text-sm font-headline font-bold">{formatCurrency(item.value)}</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${item.progress}%` }}
                            transition={{ duration: 1, delay: i * 0.2 }}
                            className="h-full bg-orange-600" 
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div 
                    onClick={() => setStep('floorplan')}
                    className="relative group cursor-pointer overflow-hidden rounded-2xl h-48 flex items-center justify-center shadow-inner bg-slate-100"
                  >
                    <Image
                      src="https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&w=800&q=80"
                      alt="Floor Plan"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-40 grayscale"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px] group-hover:backdrop-blur-0 transition-all"></div>
                    <button className="relative z-10 flex items-center gap-3 bg-white px-8 py-4 rounded-xl shadow-2xl hover:bg-orange-600 hover:text-white transition-all font-headline font-extrabold uppercase tracking-widest text-sm">
                      <Layers className="w-5 h-5" />
                      {t('viewFloorPlan')}
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { icon: Calendar, label: t('timeline'), value: '14 Months' },
                  { icon: Ruler, label: t('builtArea'), value: `${area} m²` },
                  { icon: Construction, label: t('laborers'), value: 'Est. 12 Pax' },
                ].map((item, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl flex items-center gap-4 border border-slate-100 shadow-sm">
                    <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{item.label}</p>
                      <p className="font-headline font-bold text-slate-900">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col md:flex-row gap-4 pt-8">
                <button 
                  onClick={() => setStep('ar')}
                  className="flex-1 flex items-center justify-center gap-3 bg-slate-900 text-white py-5 rounded-2xl font-headline font-bold uppercase tracking-widest text-sm shadow-xl transition-all hover:bg-slate-800 active:scale-95"
                >
                  <Maximize className="w-5 h-5" />
                  {t('arProjection')}
                </button>
                <button 
                  onClick={() => setStep('floorplan')}
                  className="flex-1 flex items-center justify-center gap-3 bg-white border-2 border-slate-900 text-slate-900 py-5 rounded-2xl font-headline font-bold uppercase tracking-widest text-sm transition-all hover:bg-slate-50 active:scale-95"
                >
                  <Layers className="w-5 h-5" />
                  {t('viewFloorPlan')}
                </button>
              </div>
            </motion.div>
          )}

          {step === 'ar' && (
            <motion.div
              key="ar"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black flex flex-col"
            >
              <AnimatePresence>
                {showFlash && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] bg-white"
                  />
                )}
              </AnimatePresence>

              <div className="absolute inset-0 z-0">
                <Image
                  src="https://images.unsplash.com/photo-1503387762-592dee58292b?auto=format&fit=crop&w=1920&q=80"
                  alt="Terrain"
                  fill
                  className="object-cover opacity-60"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-[radial-gradient(rgba(230,126,34,0.1)_1px,transparent_1px)] bg-[length:40px_40px] opacity-20"></div>
                <motion.div 
                  animate={{ y: [0, 1000] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                  className="absolute top-0 left-0 w-full h-1 bg-orange-500/50 shadow-[0_0_20px_rgba(230,126,34,0.8)] z-10"
                />
              </div>

              <div className="relative z-10 flex-1 flex flex-col p-6">
                <div className="flex justify-between items-start">
                  <div className="bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl border-l-4 border-orange-600 text-white">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-orange-400">{t('systemStatus')}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="font-headline text-lg font-bold">{t('alignmentOk')}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setStep(3)}
                    className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all"
                  >
                    <Plus className="w-6 h-6 rotate-45" />
                  </button>
                </div>

                <div className="flex-1 flex items-center justify-center relative">
                  <motion.div 
                    animate={{ rotate: arRotation, scale: arScale }}
                    className="w-80 h-64 border-2 border-orange-500/50 shadow-[0_0_50px_rgba(230,126,34,0.3)] flex items-center justify-center relative bg-orange-500/10 backdrop-blur-[1px]"
                  >
                    <div className="absolute inset-0 border-t-4 border-orange-500/80 -translate-y-8 scale-x-110"></div>
                    <div className="grid grid-cols-3 grid-rows-2 w-full h-full opacity-40">
                      <div className="border border-orange-500/40"></div>
                      <div className="border border-orange-500/40"></div>
                      <div className="border border-orange-500/40"></div>
                      <div className="border border-orange-500/40"></div>
                      <div className="border border-orange-500/40"></div>
                      <div className="border border-orange-500/40"></div>
                    </div>
                    <div className="absolute flex flex-col items-center">
                      <Construction className="w-12 h-12 text-orange-600 mb-2" />
                      <span className="text-[10px] text-orange-400 font-bold tracking-widest uppercase">Modelo: Monolith_V2.obj</span>
                    </div>
                  </motion.div>
                </div>

                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto w-full mb-8">
                  <button 
                    onClick={() => setArRotation(prev => prev + 45)}
                    className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-xl text-white py-4 rounded-2xl transition-all border border-white/10 active:scale-95"
                  >
                    <RotateCw className="w-5 h-5" />
                    <span className="font-headline font-bold text-sm tracking-tight uppercase">{t('rotateModel')}</span>
                  </button>
                  <button 
                    onClick={() => setArScale(prev => prev === 1 ? 1.5 : prev === 1.5 ? 0.75 : 1)}
                    className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-xl text-white py-4 rounded-2xl transition-all border border-white/10 active:scale-95"
                  >
                    <Maximize className="w-5 h-5" />
                    <span className="font-headline font-bold text-sm tracking-tight uppercase">{t('scaleProject')}</span>
                  </button>
                </div>
              </div>

              <footer className="relative z-10 bg-slate-900 text-white p-8 pb-12 shadow-2xl">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-6 items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black font-headline tracking-tighter leading-tight">{t('arProjection')} - TERRENO</h2>
                    <p className="text-slate-400 text-sm">Posicione o modelo antes de capturar a estimativa volumétrica.</p>
                  </div>
                  <div className="flex gap-4 w-full md:w-auto">
                    <button 
                      onClick={() => { setArRotation(0); setArScale(1); }}
                      className="flex-1 md:flex-none px-8 py-4 bg-slate-800 text-slate-200 font-bold uppercase tracking-widest text-xs rounded-xl"
                    >
                      Reset View
                    </button>
                    <button 
                      onClick={handleSnapPhoto}
                      className="flex-1 md:flex-none px-12 py-4 bg-orange-600 text-white font-black uppercase tracking-tighter text-lg rounded-xl flex items-center justify-center gap-3 shadow-lg shadow-orange-600/20 active:scale-95"
                    >
                      <Camera className="w-6 h-6" />
                      {t('snapPhoto')}
                    </button>
                  </div>
                </div>
              </footer>
            </motion.div>
          )}

            {step === 'floorplan' && (
              <motion.div
                key="floorplan"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] bg-slate-50 flex flex-col pt-16"
              >
                <div className="flex-1 overflow-auto p-6 md:p-12">
                  <div className="max-w-5xl mx-auto">
                    <div className="flex justify-between items-center mb-12">
                      <div>
                        <h2 className="text-4xl font-headline font-black tracking-tighter text-slate-900 uppercase">{t('viewFloorPlan')}</h2>
                        <p className="text-slate-500 font-medium">{dimensions.width}m x {dimensions.length}m | {area}m²</p>
                      </div>
                      <div className="flex gap-4">
                        <button 
                          onClick={handleDownloadPDF}
                          className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 transition-all"
                        >
                          <Download className="w-6 h-6 text-slate-600" />
                        </button>
                      </div>
                    </div>

                  <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-8 md:p-16 relative overflow-hidden">
                    {/* Grid Background */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                    
                    <div 
                      ref={floorPlanRef}
                      className="relative z-10 aspect-square lg:aspect-video w-full border-4 border-slate-900 rounded-sm flex flex-wrap content-start p-1 gap-1 bg-slate-50 overflow-auto"
                    >
                      {/* Dynamic Floor Plan Generation */}
                      {Array.from({ length: rooms.bedrooms }).map((_, i) => (
                        <div key={`bed-${i}`} className="flex-grow min-w-[120px] md:min-w-[150px] h-24 md:h-32 border-2 border-slate-900 bg-white flex flex-col items-center justify-center relative group">
                          <Bed className="w-5 h-5 md:w-6 md:h-6 text-slate-400 mb-1" />
                          <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-900">{t('bedrooms')} {i + 1}</span>
                        </div>
                      ))}
                      
                      <div className="flex-grow min-w-[150px] md:min-w-[200px] h-32 md:h-48 border-2 border-slate-900 bg-white flex flex-col items-center justify-center relative">
                        <Sofa className="w-6 h-6 md:w-8 md:h-8 text-slate-400 mb-2" />
                        <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-900">{t('livingRoom')}</span>
                      </div>

                      <div className="flex-grow min-w-[140px] md:min-w-[180px] h-32 md:h-48 border-2 border-slate-900 bg-white flex flex-col items-center justify-center relative">
                        <ChefHat className="w-6 h-6 md:w-8 md:h-8 text-slate-400 mb-2" />
                        <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-900">{t('kitchen')}</span>
                      </div>

                      {Array.from({ length: rooms.bathrooms }).map((_, i) => (
                        <div key={`bath-${i}`} className="w-20 md:w-24 h-24 md:h-32 border-2 border-slate-900 bg-white flex flex-col items-center justify-center relative">
                          <ShowerHead className="w-4 h-4 md:w-5 md:h-5 text-slate-400 mb-1" />
                          <span className="text-[7px] md:text-[8px] font-black uppercase tracking-widest text-slate-900">WC {i + 1}</span>
                        </div>
                      ))}

                      <div className="w-full h-20 md:h-24 border-2 border-slate-900 bg-slate-100 flex flex-col items-center justify-center relative mt-auto">
                        <Car className="w-5 h-5 md:w-6 md:h-6 text-slate-400 mb-1" />
                        <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-900">{t('garage')}</span>
                      </div>
                    </div>

                    <div className="mt-12 flex flex-wrap gap-8 justify-center">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 border-2 border-slate-900 bg-white"></div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Área Útil</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 border-2 border-slate-900 bg-slate-100"></div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Área Comum</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-1 h-4 bg-slate-900"></div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Alvenaria 15cm</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <footer className="bg-white border-t border-slate-100 p-8">
                <div className="max-w-5xl mx-auto flex justify-between items-center">
                  <button 
                    onClick={() => setStep(3)}
                    className="px-8 py-4 bg-slate-100 text-slate-900 font-headline font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-slate-200 transition-all"
                  >
                    {t('back')}
                  </button>
                  <button 
                    onClick={handleConfirmLayout}
                    className="px-12 py-4 bg-orange-600 text-white font-headline font-black uppercase tracking-widest text-sm rounded-xl shadow-xl shadow-orange-600/20 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    {t('confirmLayout')}
                  </button>
                </div>
              </footer>
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>

        <AnimatePresence>
          {isSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-6 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
                className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-8"
              >
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </motion.div>
              <h2 className="text-4xl font-headline font-black tracking-tighter text-slate-900 mb-4">
                {t('simulationSuccess')}
              </h2>
              <p className="text-slate-500 max-w-md mb-12 text-lg">
                {t('simulationSuccessDesc')}
              </p>
              <div className="flex flex-col w-full max-w-xs gap-4">
                <Link 
                  href="https://pay.cakto.com.br/viy6pcw_844596"
                  target="_blank"
                  className="w-full py-5 bg-orange-600 text-white rounded-2xl font-headline font-bold uppercase tracking-widest text-sm shadow-xl hover:bg-orange-700 transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                  <CreditCard className="w-5 h-5" />
                  {t('unlockFullProject')}
                </Link>
                <button 
                  onClick={handleWhatsAppShare}
                  className="w-full py-5 bg-[#25D366] text-white rounded-2xl font-headline font-bold uppercase tracking-widest text-sm shadow-xl hover:bg-[#128C7E] transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                  <MessageCircle className="w-5 h-5" />
                  {t('sendWhatsApp')}
                </button>
                <button 
                  onClick={handleDownloadPDF}
                  className="w-full py-5 bg-slate-900 text-white rounded-2xl font-headline font-bold uppercase tracking-widest text-sm shadow-xl hover:bg-slate-800 transition-all active:scale-95"
                >
                  {t('exportPdf')}
                </button>
                <button 
                  onClick={() => router.push('/')}
                  className="w-full py-5 bg-white border-2 border-slate-200 text-slate-600 rounded-2xl font-headline font-bold uppercase tracking-widest text-sm hover:bg-slate-50 transition-all active:scale-95"
                >
                  {t('backToHome')}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {statusMessage && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[200] bg-slate-900 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3"
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

      {/* Footer Action Bar */}
      {typeof step === 'number' && !isSuccess && (
        <footer className="fixed bottom-0 left-0 w-full z-50">
          <div className="bg-slate-900 text-white p-6 flex items-center justify-between shadow-2xl">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">
                {step === 2 ? t('totalRooms') : t('estimativaBase')}
              </span>
              <span className="text-xl font-extrabold tracking-tight">
                {step === 2 ? `${totalRooms.toString().padStart(2, '0')} ${t('environments')}` : formatCurrency(estimatedCost)}
              </span>
            </div>
            <button 
              disabled={!isStepValid}
              onClick={() => {
                if (step === 3) {
                  setIsSuccess(true);
                } else if (typeof step === 'number') {
                  setStep((step + 1) as Step);
                }
              }}
              className={cn(
                "bg-gradient-to-br from-orange-600 to-orange-700 text-white font-headline font-bold py-4 px-10 rounded-xl transition-all duration-300 ease-in-out active:scale-95 shadow-lg flex items-center gap-3",
                !isStepValid && "opacity-50 cursor-not-allowed grayscale"
              )}
            >
              {step === 3 ? t('finalizeQuote') : t('nextStep')}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </footer>
      )}
    </div>
  );
}
