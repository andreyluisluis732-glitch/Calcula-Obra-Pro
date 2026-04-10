'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'pt' | 'en' | 'es';

interface Translations {
  [key: string]: {
    [K in Language]: string;
  };
}

const translations: Translations = {
  // Navbar & Nav
  home: { pt: 'Início', en: 'Home', es: 'Inicio' },
  history: { pt: 'Histórico', en: 'History', es: 'Historial' },
  settings: { pt: 'Configurações', en: 'Settings', es: 'Ajustes' },
  newSimulation: { pt: 'Nova Simulação', en: 'New Simulation', es: 'Nueva Simulación' },
  
  // Hero
  professionalEstimator: { pt: 'Orçamentista Profissional', en: 'Professional Estimator', es: 'Presupuestador Profesional' },
  precisionEngineering: { pt: 'Engenharia de Precisão', en: 'Precision Engineering', es: 'Ingeniería de Precisión' },
  heroDescription: { 
    pt: 'Execute simulações complexas de custos de construção com precisão de nível arquitetônico.', 
    en: 'Execute complex construction cost simulations with architectural-grade accuracy.', 
    es: 'Ejecute simulaciones complejas de costos de construcción con precisión de nivel arquitectónico.' 
  },
  currentProjectLoad: { pt: 'Carga Atual do Projeto', en: 'Current Project Load', es: 'Carga Actual del Proyecto' },
  
  // Bento Grid
  historyDesc: { pt: 'Revise e refine suas estimativas passadas.', en: 'Review and refine your past estimations.', es: 'Revise y refine sus estimaciones pasadas.' },
  exportPdf: { pt: 'Exportar PDF', en: 'Export PDF', es: 'Exportar PDF' },
  exportPdfDesc: { pt: 'Gere relatórios técnicos de alta fidelidade.', en: 'Generate high-fidelity technical reports.', es: 'Genere informes técnicos de alta fidelidad.' },
  viewVault: { pt: 'Ver Cofre', en: 'View Vault', es: 'Ver Bóveda' },
  generateReport: { pt: 'Gerar Relatório', en: 'Generate Report', es: 'Generar Informe' },
  portfolioValue: { pt: 'Valor do Portfólio Global', en: 'Global Portfolio Value', es: 'Valor de la Cartera Global' },
  activeProjects: { pt: 'Projetos Ativos', en: 'Active Projects', es: 'Proyectos Activos' },
  avgMargin: { pt: 'Margem Média', en: 'Avg. Margin', es: 'Margen Promedio' },
  
  // Activity Log
  activityLog: { pt: 'Log de Atividade Técnica', en: 'Technical Activity Log', es: 'Registro de Actividad Técnica' },
  
  // Simulation Step 1
  projectSetup: { pt: 'Configuração do Projeto', en: 'Project Setup', es: 'Configuración del Proyecto' },
  stepOf: { pt: 'Passo {step} de 3', en: 'Step {step} of 3', es: 'Paso {step} de 3' },
  terrainDimensions: { pt: 'Dimensões do Terreno', en: 'Terrain Dimensions', es: 'Dimensiones del Terreno' },
  terrainDesc: { pt: 'Insira as medidas exatas para o cálculo preciso.', en: 'Enter exact measurements for precise calculation.', es: 'Ingrese las medidas exactas para un cálculo preciso.' },
  width: { pt: 'Largura', en: 'Width', es: 'Ancho' },
  length: { pt: 'Comprimento', en: 'Length', es: 'Longitud' },
  technicalTip: { pt: 'Dica Técnica', en: 'Technical Tip', es: 'Consejo Técnico' },
  tipDesc: { pt: 'Considere o recuo obrigatório da prefeitura.', en: 'Consider the mandatory city hall setback.', es: 'Considere el retroceso obligatorio del ayuntamiento.' },
  totalAreaCalc: { pt: 'Cálculo de Área Total', en: 'Total Area Calculation', es: 'Cálculo de Área Total' },
  totalPerimeter: { pt: 'Perímetro Total', en: 'Total Perimeter', es: 'Perímetro Total' },
  classification: { pt: 'Classificação', en: 'Classification', es: 'Clasificación' },
  technicalPreview: { pt: 'Preview Técnico', en: 'Technical Preview', es: 'Vista Previa Técnica' },
  
  // Simulation Step 2
  selectRooms: { pt: 'Selecione os Cômodos', en: 'Select Rooms', es: 'Seleccione las Habitaciones' },
  roomsDesc: { pt: 'Defina a quantidade de ambientes para o cálculo.', en: 'Define the quantity of environments for calculation.', es: 'Defina la cantidad de ambientes para el cálculo.' },
  bedrooms: { pt: 'Quartos', en: 'Bedrooms', es: 'Dormitorios' },
  bathrooms: { pt: 'Banheiros', en: 'Bathrooms', es: 'Baños' },
  kitchen: { pt: 'Cozinha', en: 'Kitchen', es: 'Cocina' },
  livingRoom: { pt: 'Sala', en: 'Living Room', es: 'Sala' },
  garage: { pt: 'Garagem', en: 'Garage', es: 'Garaje' },
  totalRooms: { pt: 'Total de Cômodos', en: 'Total Rooms', es: 'Total de Habitaciones' },
  environments: { pt: 'AMBIENTES', en: 'ENVIRONMENTS', es: 'AMBIENTES' },
  
  // Simulation Step 3
  finishStandard: { pt: 'Padrão de Acabamento', en: 'Finish Standard', es: 'Estándar de Acabado' },
  selectQuality: { pt: 'Selecionar Qualidade', en: 'Select Quality', es: 'Seleccionar Calidad' },
  economic: { pt: 'Econômico', en: 'Economic', es: 'Económico' },
  medium: { pt: 'Médio', en: 'Medium', es: 'Medio' },
  high: { pt: 'Alto', en: 'High', es: 'Alto' },
  luxury: { pt: 'Luxo', en: 'Luxury', es: 'Lujo' },
  totalInvestment: { pt: 'Investimento Total Estimado', en: 'Total Estimated Investment', es: 'Inversión Total Estimada' },
  foundation: { pt: 'Fundação', en: 'Foundation', es: 'Cimentación' },
  structure: { pt: 'Estrutura', en: 'Structure', es: 'Estructura' },
  roofing: { pt: 'Telhado', en: 'Roofing', es: 'Techo' },
  finishes: { pt: 'Acabamentos', en: 'Finishes', es: 'Acabados' },
  viewFloorPlan: { pt: 'Ver Planta Baixa', en: 'View Floor Plan', es: 'Ver Planta Baja' },
  timeline: { pt: 'Cronograma', en: 'Timeline', es: 'Cronograma' },
  builtArea: { pt: 'Área Construída', en: 'Built Area', es: 'Área Construida' },
  laborers: { pt: 'Mão de Obra', en: 'Laborers', es: 'Mano de Obra' },
  finalizeQuote: { pt: 'Finalizar e Gerar Orçamento', en: 'Finalize & Generate Quote', es: 'Finalizar y Generar Presupuesto' },
  saveDraft: { pt: 'Salvar Rascunho', en: 'Save Draft', es: 'Guardar Borrador' },
  
  // AR & 3D
  arProjection: { pt: 'Projeção AR', en: 'AR Projection', es: 'Proyección AR' },
  systemStatus: { pt: 'STATUS DO SISTEMA', en: 'SYSTEM STATUS', es: 'ESTADO DEL SISTEMA' },
  alignmentOk: { pt: 'ALINHAMENTO: OK', en: 'ALIGNMENT: OK', es: 'ALINEACIÓN: OK' },
  gpsCoordinates: { pt: 'COORDENADAS GPS', en: 'GPS COORDINATES', es: 'COORDENADAS GPS' },
  rotateModel: { pt: 'Rotacionar Modelo', en: 'Rotate Model', es: 'Rotar Modelo' },
  scaleProject: { pt: 'Escalar Projeto', en: 'Scale Project', es: 'Escalar Proyecto' },
  snapPhoto: { pt: 'Capturar Foto', en: 'Snap Photo', es: 'Capturar Foto' },
  virtualTour: { pt: 'Tour Virtual 3D', en: 'Virtual Tour 3D', es: 'Tour Virtual 3D' },
  activeRoom: { pt: 'Cômodo Ativo', en: 'Active Room', es: 'Habitación Activa' },
  toggleFurniture: { pt: 'Alternar Móveis', en: 'Toggle Furniture', es: 'Alternar Muebles' },
  estimativaBase: { pt: 'Estimativa Base', en: 'Base Estimate', es: 'Estimación Base' },
  
  // History & Settings
  searchProject: { pt: 'Buscar por projeto ou ID...', en: 'Search by project or ID...', es: 'Buscar por proyecto o ID...' },
  filter: { pt: 'Filtrar', en: 'Filter', es: 'Filtrar' },
  profile: { pt: 'Perfil', en: 'Profile', es: 'Perfil' },
  profileDesc: { pt: 'Gerencie suas informações pessoais', en: 'Manage your personal information', es: 'Gestione su información personal' },
  notifications: { pt: 'Notificações', en: 'Notifications', es: 'Notificaciones' },
  notificationsDesc: { pt: 'Configure alertas e avisos', en: 'Configure alerts and warnings', es: 'Configure alertas y avisos' },
  security: { pt: 'Segurança', en: 'Security', es: 'Seguridad' },
  securityDesc: { pt: 'Senha e autenticação em dois fatores', en: 'Password and two-factor authentication', es: 'Contraseña y autenticación de dos factores' },
  subscription: { pt: 'Assinatura', en: 'Subscription', es: 'Suscripción' },
  subscriptionDesc: { pt: 'Gerencie seu plano Pro', en: 'Manage your Pro plan', es: 'Gestione su plan Pro' },
  support: { pt: 'Suporte', en: 'Support', es: 'Soporte' },
  supportDesc: { pt: 'Central de ajuda e contato', en: 'Help center and contact', es: 'Centro de ayuda y contacto' },
  logout: { pt: 'Sair da Conta', en: 'Logout', es: 'Cerrar Sesión' },
  logoutDesc: { pt: 'Desconectar do dispositivo atual', en: 'Disconnect from current device', es: 'Desconectar del dispositivo actual' },

  simulationSuccess: { pt: 'Simulação Concluída!', en: 'Simulation Completed!', es: '¡Simulación Completada!' },
  simulationSuccessDesc: { pt: 'Seu orçamento técnico foi gerado com sucesso e salvo no seu histórico.', en: 'Your technical quote has been successfully generated and saved to your history.', es: 'Su presupuesto técnico ha sido generado con éxito y guardado en su historial.' },
  backToHome: { pt: 'Voltar para o Início', en: 'Back to Home', es: 'Volver al Inicio' },
  unlockFullProject: { pt: 'Desbloquear Projeto Completo', en: 'Unlock Full Project', es: 'Desbloquear Proyecto Completo' },
  getProVersion: { pt: 'Obter Versão Pro', en: 'Get Pro Version', es: 'Obtener Versión Pro' },
  paymentDesc: { pt: 'Acesse plantas detalhadas, lista de materiais e suporte técnico.', en: 'Access detailed plans, material lists, and technical support.', es: 'Acceda a planos detallados, listas de materiales y soporte técnico.' },
  downloadStarted: { pt: 'Download iniciado...', en: 'Download started...', es: 'Descarga iniciada...' },
  processing: { pt: 'Processando...', en: 'Processing...', es: 'Procesando...' },
  sharedSuccess: { pt: 'Link de compartilhamento copiado!', en: 'Sharing link copied!', es: '¡Enlace de compartir copiado!' },
  confirmLayout: { pt: 'Confirmar Layout', en: 'Confirm Layout', es: 'Confirmar Diseño' },
  salesHeadline: { pt: 'PARE DE PERDER DINHEIRO COM ORÇAMENTOS ERRADOS!', en: 'STOP LOSING MONEY WITH WRONG ESTIMATES!', es: '¡DEJE DE PERDER DINERO COM PRESUPUESTOS ERRÓNEOS!' },
  salesSubheadline: { pt: 'O aplicativo que transforma seu celular em uma ferramenta de engenharia de elite. Orçamentos precisos em segundos para pedreiros e engenheiros.', en: 'The app that turns your phone into an elite engineering tool. Precise estimates in seconds for bricklayers and engineers.', es: 'La aplicación que convierte tu celular en una ferramenta de ingeniería de élite. Presupuestos precisos en segundos para albañiles e ingenieros.' },
  salesOffer: { pt: 'OFERTA EXCLUSIVA POR TEMPO LIMITADO', en: 'EXCLUSIVE LIMITED TIME OFFER', es: 'OFERTA EXCLUSIVA POR TIEMPO LIMITADO' },
  salesPrice: { pt: 'Apenas R$ 19,00', en: 'Only $19.00', es: 'Solo $19.00' },
  salesPriceDesc: { pt: 'Pagamento único. Acesso vitalício.', en: 'One-time payment. Lifetime access.', es: 'Pago único. Acceso de por vida.' },
  salesCTA: { pt: 'QUERO MEU ACESSO AGORA', en: 'GET MY ACCESS NOW', es: 'QUIERO MI ACCESO AHORA' },
  salesFeature1: { pt: 'Orçamentos em 60 segundos', en: 'Estimates in 60 seconds', es: 'Presupuestos en 60 segundos' },
  salesFeature2: { pt: 'Planta baixa automática', en: 'Automatic floor plan', es: 'Planta baja automática' },
  salesFeature3: { pt: 'Lista de materiais detalhada', en: 'Detailed material list', es: 'Lista de materiales detalada' },
  salesFeature4: { pt: 'Projeção em Realidade Aumentada', en: 'AR Projection', es: 'Proyección en Realidad Aumentada' },
  salesTestimonial: { pt: 'Este app mudou minha produtividade no canteiro. Orçamentos que levavam horas agora saem em minutos.', en: 'This app changed my productivity on the construction site. Estimates that took hours now come out in minutes.', es: 'Esta aplicación cambió mi productividad en la obra. Presupuestos que tomaban horas ahora salen en minutos.' },
  salesTestimonialAuthor: { pt: 'Eng. Ricardo Silva', en: 'Eng. Ricardo Silva', es: 'Ing. Ricardo Silva' },
  salesBuiltFor: { pt: 'DESENVOLVIDO PARA QUEM', en: 'BUILT FOR THOSE WHO', es: 'DESARROLLADO PARA QUIENES' },
  salesBuildReal: { pt: 'CONSTRÓI DE VERDADE.', en: 'REALLY BUILD.', es: 'CONSTRUYEN DE VERDAD.' },
  salesDescription: { pt: 'Chega de planilhas complexas e erros de cálculo que comem seu lucro. O Calcula Obra Pro foi criado ouvindo as dores de quem está na linha de frente da construção civil.', en: 'No more complex spreadsheets and calculation errors that eat your profit. Calcula Obra Pro was created by listening to the pains of those on the front line of construction.', es: 'Basta de planillas complejas y errores de cálculo que se comen tu beneficio. Calcula Obra Pro fue creado escuchando los dolores de quienes están en la línea de frente de la construcción.' },
  salesBullet1: { pt: 'Interface intuitiva para uso em campo', en: 'Intuitive interface for field use', es: 'Interfaz intuitiva para uso en campo' },
  salesBullet2: { pt: 'Cálculos baseados em tabelas atualizadas', en: 'Calculations based on updated tables', es: 'Cálculos basados en tablas actualizadas' },
  salesBullet3: { pt: 'Exportação profissional em PDF para clientes', en: 'Professional PDF export for clients', es: 'Exportación profesional en PDF para clientes' },
  salesBullet4: { pt: 'Visualização AR para evitar erros de projeto', en: 'AR visualization to avoid project errors', es: 'Visualización AR para evitar errores de proyecto' },
  salesFinalHeadline: { pt: 'O SEU PRÓXIMO NÍVEL', en: 'YOUR NEXT LEVEL', es: 'TU PRÓXIMO NIVEL' },
  salesFinalPrice: { pt: 'COMEÇA POR R$ 19,00.', en: 'STARTS AT $19.00.', es: 'COMIENZA POR $19.00.' },
  salesFinalDesc: { pt: 'Menos que o preço de um almoço para ter uma ferramenta profissional no seu bolso para sempre.', en: 'Less than the price of a lunch to have a professional tool in your pocket forever.', es: 'Menos que el precio de un almuerzo para tener una herramienta profesional en tu bolsillo para siempre.' },
  sendWhatsApp: { pt: 'Enviar via WhatsApp', en: 'Send via WhatsApp', es: 'Enviar por WhatsApp' },
  whatsappMessage: { 
    pt: 'Olá! Acabei de gerar um orçamento no Calcula Obra Pro.\n\n*Resumo do Projeto:*\n- Área: {area}m²\n- Padrão: {tier}\n- Investimento Estimado: {cost}\n\n*Planta Baixa:*\n{rooms}\n\nGerado em: {date}',
    en: 'Hello! I just generated a quote on Calcula Obra Pro.\n\n*Project Summary:*\n- Area: {area}m²\n- Standard: {tier}\n- Estimated Investment: {cost}\n\n*Floor Plan:*\n{rooms}\n\nGenerated on: {date}',
    es: '¡Hola! Acabo de generar un presupuesto en Calcula Obra Pro.\n\n*Resumen del Proyecto:*\n- Área: {area}m²\n- Estándar: {tier}\n- Inversión Estimada: {cost}\n\n*Planta Baja:*\n{rooms}\n\nGenerado el: {date}'
  },
  // Common
  nextStep: { pt: 'PRÓXIMO PASSO', en: 'NEXT STEP', es: 'PRÓXIMO PASO' },
  back: { pt: 'Voltar', en: 'Back', es: 'Volver' },
  continue: { pt: 'Continuar', en: 'Continue', es: 'Continuar' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('pt');

  useEffect(() => {
    const savedLang = localStorage.getItem('app-language') as Language;
    if (savedLang && ['pt', 'en', 'es'].includes(savedLang) && savedLang !== language) {
      setLanguage(savedLang);
    }
  }, [language]);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('app-language', lang);
  };

  const t = (key: string, params?: Record<string, string>) => {
    let text = translations[key]?.[language] || key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, v);
      });
    }
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
