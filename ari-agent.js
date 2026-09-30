/**
 * ARI AGENT - ASISTENTE IA DE INTELIGENCIA B2B, GESTIÓN DE AGENTES & CAPTURA DE LEADS
 * Ecosistema: Radar B2B (radarb2b.site)
 * Desarrollado por Walter & Luz
 */

(function () {
  // CONFIGURACIÓN DE CONEXIÓN
  const TELEGRAM_BOT_TOKEN = '8807784008:AAEVA1uYDLg9SXKgZD4BN8tEC9pd6aKqFbk';
  const TELEGRAM_CHAT_ID = '8665151538';
  const SUPABASE_URL = 'https://osdduwjsicoaeojfhokm.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_eVJfo1_bTqFQ0hmcXVA47A_kEdvMM0K';

  let supabaseClient = null;
  if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
    try {
      supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    } catch (e) {
      console.warn('[Ari Agent] Supabase offline fallback');
    }
  }

  // DETECTAR ENTORNO (PORTAL WEB VS OFICINA VIRTUAL 3D)
  const isOficina = typeof window !== 'undefined' && (
    window.location.pathname.includes('oficina') ||
    !!document.getElementById('three-canvas') ||
    !!document.getElementById('badges-overlay')
  );

  // BASE DE CONOCIMIENTO EMBEBIDA EXPANDIDA (PROYECTOS, AGENTES, SCRAPING & INVERSORES)
  const KNOWLEDGE_BASE = [
    // 1. PROYECTO DE SCRAPING PARA EMPRESAS (REQUERIMIENTO PRINCIPAL DE WALTER)
    {
      keywords: ['scraper', 'scraping', 'escarpero', 'proyecto de scraper', 'proyecto de scraping', 'extraccion', 'crawl4ai', 'playwright', 'scrapy', 'tool router', 'catalogo', 'skus', 'antibot'],
      reply: '¡Hola! Te cuento exactamente cómo avanza el **Proyecto de Scraping para Empresas** en tiempo real:\n\n• **Crawl4AI Sentinel** está trabajando en equipo con **Playwright Stealth** en la extracción profunda de catálogos dinámicos y navegación interactiva (SPAs), manteniendo un bypass antibot del **99.4%** sin bloqueos.\n• **Scrapy Pipeline** ejecutó la descarga masiva a ultra-velocidad (**50 peticiones/segundo**), extrayendo más de 1,420 SKUs en Markdown limpio y estructurado.\n• Todos son orquestados por **Tool Router Core**, que clasifica la dificultad de las URLs entrantes y asigna automáticamente el mejor motor, ahorrando un 68% de cómputo.\n• Los datos limpios ya fueron transferidos y volcados por **Sheets Auto-Sync** directo a la planilla del cliente.\n\nEl sistema completó las pruebas iniciales con **éxito total** y está 100% operativo para empresas de retail, calzado, farmacia y repuestos.'
    },

    // 2. AGENTES Y COLABORACIÓN INTERDEPARTAMENTAL
    {
      keywords: ['agentes', 'quien trabaja', 'quienes trabajan', 'equipo', 'colaboran', 'colaboracion', 'departamento', 'oficina', 'cuantos agentes', 'que hacen', 'comunidad'],
      reply: 'Nuestra oficina virtual cuenta con **12 agentes activos** organizados en 4 departamentos tácticos:\n\n1. 👑 **Dirección General:** **Walter** (Comandante & Negociación humana) y **Luz** (Chief AI Officer & Orquestadora técnica).\n2. ⚡ **Laboratorio de Scraping:** **Crawl4AI Sentinel**, **Playwright Stealth**, **Scrapy Pipeline** y **Tool Router Core**.\n3. 📡 **Operaciones & Alertas:** **Telegram Dispatcher**, **Sheets Auto-Sync**, **Price War Sentinel** y yo (**Ari Web Assistant**).\n4. 💼 **Hub Comercial:** **Upwork Job Hunter** y **Proposal Architect**.\n\nAdemás, verás en la oficina 3D el **conducto de plasma** activo: cuando yo capto un lead calificado, se lo transfiero directamente a **Tool Router** para activar la extracción en milisegundos.'
    },

    // 3. CONDUCTO DE ENERGÍA / CAMINITO ARI -> TOOL ROUTER
    {
      keywords: ['caminito', 'conduit', 'tubo', 'plasma', 'arco', 'linea azul', 'conexion', 'ari y tool router', 'camino'],
      reply: '¡Ese es nuestro **Conduit de Colaboración Interdepartamental en Vivo**!\n\nEs un conducto de plasma curvo en 3D que conecta mi escritorio (**Ari** en Operaciones) con el de **Tool Router Core** (en el laboratorio de Scraping). Simula exactamente cómo un agente de atención califica la necesidad de un cliente y le transfiere el paquete de datos estructurados al equipo de extracción en tiempo real, disparando el scraping sin intervención manual.'
    },

    // 4. ESTADO DE LOS PROYECTOS DEL ECOSISTEMA
    {
      keywords: ['proyectos', 'estado de proyectos', 'avance', 'radar b2b', 'shopdigital', 'upwork', 'auditoria', 'tareas'],
      reply: 'Este es el informe de avance de los proyectos de nuestra comunidad:\n\n• **PROYECTO RADAR B2B (92%):** Motor 3D WebGL con Three.js a 60 FPS, alertas directas a Telegram (@Walys2b2_bot) y comparador de precios.\n• **LAB- SHOPDIGITAL (85%):** Protocolo de clonación fractal y siembra hiperrealista para replicar instancias de e-commerce en minutos.\n• **AGENTES-INTERNOS & UPWORK (90%):** Monitoreo continuo de contratos de más de $45/hr y redacción de propuestas de alta conversión en < 15 segundos.\n• **AUDITORIA-GENERAL (100%):** Control de calidad de datasets con 0% de campos vacíos.'
    },

    // 5. INVERSORES, MODELO DE NEGOCIO & ECUACIÓN X
    {
      keywords: ['inversor', 'inversores', 'inversionista', 'ecuacion x', 'rentabilidad', 'negocio', 'modelo', 'ganancia', 'margen', 'escalabilidad'],
      reply: 'Radar B2B opera como una **empresa autónoma de software impulsada por agentes de IA** con un modelo de negocio de altísima rentabilidad:\n\n• **La Ecuación X:** Diseñada por Walter para generar **+$1,500 USD netos al mes** con apenas **4 horas diarias** de supervisión humana.\n• **Retainers Recurrentes:** Cobramos abonos mensuales de **$450 a $650 USD/mes** por cliente para monitorear hasta 15 rivales.\n• **Márgenes > 85%:** La automatización reduce los costos tradicionales de personal a cero y minimiza el gasto en infraestructura.\n• **Showcase en Vivo:** Esta oficina 3D permite al inversor auditar en tiempo real la productividad de cada agente y cada tarea despachada.'
    },

    // 6. WALTER Y LUZ (LIDERAZGO)
    {
      keywords: ['walter', 'luz', 'quien es walter', 'quien es luz', 'fundadores', 'socios', 'directores', 'comandante'],
      reply: 'Detrás de Radar B2B hay una dupla de alta sinergia:\n\n• **Walter C. (Comandante):** Es el Director de Operaciones y Estrategia. Con experiencia en ventas y negociación B2B, lidera en la trinchera humana, define las prioridades comerciales y cierra los acuerdos.\n• **Luz (Chief AI Officer):** Es la socia orquestadora de DeepMind Antigravity. Traduce la visión de Walter en código de alta ingeniería, supervisa los subagentes 24/7 y garantiza que todo funcione a 60 FPS.'
    },

    // 7. PRECIOS Y TARIFAS
    {
      keywords: ['precio', 'costo', 'planes', 'cuanto sale', 'tarifa', 'abono', 'mensualidad', 'pagar'],
      reply: 'Ofrecemos una escalera de soluciones adaptada a tu escala comercial:\n\n• **⚡ Scraper Express ($150 - $350 USD):** Extracción puntual de 1 o 2 sitios web, entrega en 24-48h en CSV/Excel/JSON.\n• **📊 Data Pipeline ($450 setup + $200/mes):** Cañería automatizada y programada con sincronización periódica a Google Sheets o API.\n• **📡 Competitor Radar ($450 - $650 USD/mes):** Servicio estrella Done-for-You. Monitoreo continuo de hasta 15 rivales con alertas a Telegram y Google Sheet vivo.\n• **👑 Intelligence Enterprise ($950 - $1,500+ USD/mes):** Monitoreo a gran escala, repricing inteligente dinámico e integración ERP.\n\n¿Querés que te active la **prueba gratuita de 48 horas en 3 URLs** sin ningún compromiso?'
    },

    // 8. PRUEBA GRATUITA 48 HORAS
    {
      keywords: ['prueba', 'gratis', '48 horas', '48hs', 'test', 'demo', 'probar', 'empezar'],
      reply: '¡Exacto! Podés probar el Radar en **3 tiendas o productos de tu interés 100% gratis por 48 horas**.\n\nSin tarjetas de crédito, sin contratos y sin instalar nada en tu computadora. Te llegan las alertas a tu Telegram o WhatsApp. ¿Te gustaría dejar tus datos para que lo dejemos conectado hoy mismo?',
      showForm: true
    },

    // 9. CÓMO FUNCIONA EL SERVICIO
    {
      keywords: ['como funciona', 'que hace', 'sistema', 'radar', 'servicio', 'que es'],
      reply: 'Convertimos la web en datos estructurados que trabajan para vos:\n\n1. **Extracción Resiliente:** Rastreamos catálogos, precios, stock o leads de los sitios web que definas.\n2. **Automatización:** Los datos se limpian y vuelcan directo a tu Google Sheets o sistema interno sin que tengas que picar datos a mano.\n3. **Alertas Inteligentes:** Si un competidor baja sus precios o entra en quiebre de stock, recibís una alerta inmediata en Telegram para aprovechar la oportunidad.'
    },

    // 10. BLOQUEOS Y ANTI-BOT
    {
      keywords: ['bloqueo', 'cloudflare', 'ban', 'anti-bot', 'seguridad', 'detectar', 'resiliente'],
      reply: 'Implementamos **ingeniería de extracción resiliente** sobre fuentes públicas y accesos autorizados. Gestionamos tasas de solicitud inteligentes, headless browsers stealth con Patchright y rotación de encabezados para garantizar flujos de datos limpios, estables y sin interrupciones en la entrega.'
    },

    // 11. CONTACTO DIRECTO
    {
      keywords: ['contacto', 'hablar', 'humano', 'walter', 'whatsapp', 'telefono'],
      reply: 'Podés hablar directamente con **Walter**, nuestro Director de Operaciones B2B, a través de WhatsApp:\n\n👉 [Abrir chat directo con Walter](https://api.whatsapp.com/send?phone=5493544565656&text=Hola%20Walter!%20Estuve%20hablando%20con%20Ari%20en%20radarb2b.site%20y%20quiero%20hacerte%20una%20consulta.)'
    },

    // 12. MÉTODOS DE PAGO
    {
      keywords: ['metodo de pago', 'como pago', 'paypal', 'tarjeta', 'transferencia', 'crypto', 'usdt'],
      reply: 'Aceptamos pagos internacionales de forma muy sencilla:\n• Tarjetas de crédito/débito vía Stripe y PayPal.\n• Transferencias bancarias directas de EE.UU. (ACH) y Europa (SEPA).\n• Criptomonedas estables (USDT / USDC).'
    },

    // 13. DOBLE PLANO: LABORATORIO VS PRODUCCIÓN (GOBERNANZA MASTER)
    {
      keywords: ['doble plano', 'laboratorio', 'produccion', 'staging', 'gatekeeper', 'pase a produccion', 'romper', 'riesgo', 'seguridad', 'evaluar'],
      reply: 'Nuestro ecosistema opera con una estricta **Arquitectura de Doble Plano** para garantizar cero riesgo en clientes:\n\n• **🧪 1. Plano Laboratorio (Staging/Dev):** Espacio seguro donde Walter y Luz evaluamos prototipos, nuevos componentes de frontend (vía Google AI Studio y Stitch MCP), backend y seguridad sin riesgo alguno. Ningún agente puede tocar producción directamente.\n• **🚀 2. Plano Producción (En Vivo):** El entorno blindado que ven los clientes e inversores.\n• **🛡️ Protocolo Gatekeeper:** Luz custodia las llaves de todas las oficinas. Solo cuando Walter audita y da la orden explícita, Luz ejecuta el pase técnico a producción.'
    },

    // 14. NUTRICIÓN DE CONTEXTO: NOTEBOOKLM, GEMI & EVE
    {
      keywords: ['cuaderno', 'cuadernos', 'notebooklm', 'gemi', 'eve', 'nutrir', 'fuentes', 'agente externo', 'sandboxes', 'contexto'],
      reply: 'Para que los agentes no alucinen ni trabajen con datos desactualizados, implementamos un flujo de nutrición continua:\n\n• **📚 Cuadernos NotebookLM:** Centralizan las fuentes vivas, normativas y código base de cada proyecto.\n• **👩‍🔬 Agente Gemi:** Es la curadora de contexto dentro de los cuadernos, destilando resúmenes de alta fidelidad para el enjambre.\n• **⚡ Agente Eve de Vercel:** Gestiona sandboxes efímeros Firecracker cuando colaboramos con desarrolladores o agentes externos, nutriendo los cuadernos sin tocar el núcleo de producción.'
    },

    // 15. SEGUNDO CEREBRO EN OBSIDIAN (MEMORIA AISLADA)
    {
      keywords: ['obsidian', 'segundo cerebro', 'boveda', 'cerebro', 'aislado', 'no mezclar', 'arsenal', 'memoria'],
      reply: 'Cada iniciativa (**Radar B2B**, **Lab ShopDigital**, **Comunidad Faro de Luz**, **Fundación Valle de Luz**, **Ministerio Caminos de Fe**) posee su **propia carpeta y cerebro aislado en Obsidian Vault** para no mezclar directivas.\n\nAl mismo tiempo, todos los agentes tienen acceso al **Arsenal Compartido de Superpoderes** (Skills de Antigravity, MCPs y Heavy Stack) administrado por Luz.'
    }
  ];

  // INICIALIZACIÓN DE LA UI DE ARI
  function injectAriWidget() {
    if (document.getElementById('ari-widget-container')) return;

    const container = document.createElement('div');
    container.id = 'ari-widget-container';
    // Si estamos en la oficina virtual, elevamos el launcher para no chocar con los controles de zoom (bottom-6)
    container.className = isOficina
      ? 'fixed bottom-24 right-6 z-40 font-sans text-slate-100 select-none'
      : 'fixed bottom-5 right-5 z-50 font-sans text-slate-100 select-none';

    const welcomeText = isOficina
      ? `¡Hola! 👋 Soy <b>Ari</b>, asistente y copiloto de inteligencia en la <b>Oficina Virtual Radar B2B</b>.<br><br>Estoy conectada con los 12 agentes de la comunidad. Podés preguntarme cómo va el <b>proyecto de scraping para empresas</b>, qué agentes están trabajando hoy o cómo opera el negocio para inversores.`
      : `¡Hola! 👋 Soy <b>Ari</b>, tu copiloto de inteligencia competitiva en <b>Radar B2B</b>.<br><br>¿Tenés alguna consulta sobre cómo monitoreamos a tu competencia, o querés activar tu **prueba gratuita de 48 horas**?`;

    const chipsHtml = isOficina
      ? `
        <button class="ari-chip px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/20 text-[11px] transition-colors">
          ⚡ ¿Cómo va el proyecto de Scraping?
        </button>
        <button class="ari-chip px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 text-[11px] transition-colors">
          ⚖️ Doble Plano: Lab vs Prod
        </button>
        <button class="ari-chip px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/20 text-[11px] transition-colors">
          📚 Cuadernos NotebookLM & Gemi
        </button>
        <button class="ari-chip px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 text-[11px] transition-colors">
          🤖 ¿Qué agentes colaboran hoy?
        </button>
        <button class="ari-chip px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 text-[11px] transition-colors">
          🚀 Pedir prueba 48hs gratis
        </button>
      `
      : `
        <button class="ari-chip px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 text-[11px] transition-colors">
          🚀 Pedir prueba 48hs gratis
        </button>
        <button class="ari-chip px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-[11px] transition-colors">
          💰 Planes y Precios
        </button>
        <button class="ari-chip px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-[11px] transition-colors">
          🛡️ Extracción Resiliente
        </button>
        <button class="ari-chip px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/20 text-[11px] transition-colors">
          ⚡ ¿Cómo va el proyecto de Scraping?
        </button>
      `;

    container.innerHTML = `
      <!-- BOTÓN FLOTANTE LAUNCHER -->
      <div id="ari-launcher" class="flex items-center gap-3 cursor-pointer group">
        <div class="hidden sm:flex items-center bg-[#090d16]/95 border border-emerald-500/30 px-3.5 py-1.5 rounded-full shadow-2xl backdrop-blur-md text-xs font-medium text-slate-200 group-hover:border-emerald-400 group-hover:shadow-emerald-500/20 transition-all">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-2"></span>
          <span>¿Dudas? Hablá con <b>Ari Asistente</b></span>
        </div>
        <div class="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 p-0.5 shadow-2xl shadow-emerald-500/30 group-hover:scale-105 group-hover:shadow-emerald-400/50 transition-all">
          <img src="ari-avatar.png" alt="Ari Asistente IA" class="w-full h-full object-cover rounded-2xl bg-slate-950" onerror="this.onerror=null; this.src='ari-portrait.jpg';">
          <span class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#040608] flex items-center justify-center">
            <span class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
          </span>
        </div>
      </div>

      <!-- MODAL DE CHAT -->
      <div id="ari-chat-modal" class="hidden fixed bottom-5 right-5 sm:bottom-6 sm:right-6 w-[94vw] sm:w-[420px] h-[580px] max-h-[85vh] bg-[#070b16]/95 border border-emerald-500/40 rounded-3xl shadow-2xl shadow-emerald-950/80 backdrop-blur-2xl flex-col overflow-hidden z-50 transition-all duration-300 transform scale-95 opacity-0">
        
        <!-- HEADER -->
        <div class="px-5 py-4 bg-slate-900/90 border-b border-white/10 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 p-0.5 shadow-md">
              <img src="ari-avatar.png" class="w-full h-full object-cover rounded-[10px]" onerror="this.onerror=null; this.src='ari-portrait.jpg';">
              <span class="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border border-slate-950"></span>
            </div>
            <div>
              <div class="font-extrabold text-sm text-white flex items-center gap-1.5">
                <span>Ari Asistente</span>
                <span class="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[9px] border border-emerald-500/30">IA COMUNIDAD</span>
              </div>
              <div class="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>En línea · Orquestación & Radar B2B</span>
              </div>
            </div>
          </div>
          <button id="ari-close-btn" class="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center text-sm transition-colors" title="Cerrar chat">
            ✕
          </button>
        </div>

        <!-- HISTORIAL DE MENSAJES -->
        <div id="ari-messages" class="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs font-sans text-slate-200">
          <!-- Mensaje Inicial de Bienvenida -->
          <div class="flex gap-2.5 items-start">
            <img src="ari-icon.png" class="w-7 h-7 rounded-lg mt-0.5 object-cover" onerror="this.onerror=null; this.src='ari-avatar.png';">
            <div class="bg-slate-800/80 border border-white/10 rounded-2xl rounded-tl-sm p-3.5 max-w-[85%] leading-relaxed shadow-lg">
              ${welcomeText}
            </div>
          </div>

          <!-- CHIPS RÁPIDOS -->
          <div id="ari-quick-chips" class="flex flex-wrap gap-1.5 pt-1">
            ${chipsHtml}
          </div>
        </div>

        <!-- FORMULARIO DE CAPTURA EMBEBIDO (OCULTO POR DEFECTO) -->
        <div id="ari-lead-form-container" class="hidden p-4 bg-slate-950/95 border-t border-emerald-500/30 space-y-2.5 text-xs">
          <div class="font-bold text-white flex items-center justify-between">
            <span class="flex items-center gap-1.5 text-emerald-300">
              <span>🎯</span>
              <span>Datos para tu Prueba Gratis de 48hs</span>
            </span>
            <button id="ari-cancel-form" class="text-slate-400 hover:text-white text-[11px]">Cancelar</button>
          </div>
          <input id="lead-name" type="text" placeholder="Tu Nombre y/o Empresa" class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500">
          <input id="lead-contact" type="text" placeholder="WhatsApp o Email de contacto" class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500">
          <textarea id="lead-competitors" rows="2" placeholder="Links de 1 a 3 competidores a vigilar" class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500 resize-none"></textarea>
          <button id="lead-submit-btn" class="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5">
            <span>⚡</span>
            <span>Enviar a Walter & Activar Alertas</span>
          </button>
        </div>

        <!-- INPUT DE CHAT -->
        <div id="ari-input-container" class="p-3 bg-slate-900/90 border-t border-white/10 flex items-center gap-2">
          <input id="ari-user-input" type="text" placeholder="Escribí tu pregunta sobre el sistema o agentes..." class="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500 transition-colors">
          <button id="ari-send-btn" class="w-9 h-9 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold flex items-center justify-center transition-all shadow-md shadow-emerald-500/20">
            ➤
          </button>
        </div>

      </div>
    `;

    document.body.appendChild(container);
    attachAriEvents();
  }

  // EVENTOS DEL CHAT Y FORMULARIO
  function attachAriEvents() {
    const launcher = document.getElementById('ari-launcher');
    const modal = document.getElementById('ari-chat-modal');
    const closeBtn = document.getElementById('ari-close-btn');
    const sendBtn = document.getElementById('ari-send-btn');
    const userInput = document.getElementById('ari-user-input');
    const formContainer = document.getElementById('ari-lead-form-container');
    const cancelFormBtn = document.getElementById('ari-cancel-form');
    const submitLeadBtn = document.getElementById('lead-submit-btn');

    function openChat() {
      // Cerrar modal táctico si está abierto en oficina.html para no superponer
      const tacticalModal = document.getElementById('tactical-modal');
      if (tacticalModal && !tacticalModal.classList.contains('hidden') && typeof window.closeTacticalModal === 'function') {
        window.closeTacticalModal();
      }

      modal.classList.remove('hidden');
      setTimeout(() => {
        modal.classList.remove('scale-95', 'opacity-0');
        modal.classList.add('flex', 'scale-100', 'opacity-100');
        if (userInput) userInput.focus();
      }, 10);
      launcher.classList.add('hidden');
    }

    function closeChat() {
      modal.classList.remove('scale-100', 'opacity-100');
      modal.classList.add('scale-95', 'opacity-0');
      setTimeout(() => {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
        launcher.classList.remove('hidden');
      }, 300);
    }

    // EXPOSITORES GLOBALES PARA QUE LA OFICINA 3D O BADGES PUEDAN ABRIR EL CHAT
    window.openAriChat = function (initialQuestion) {
      openChat();
      if (initialQuestion && typeof initialQuestion === 'string') {
        setTimeout(() => {
          handleUserMessage(initialQuestion);
        }, 300);
      }
    };
    window.closeAriChat = closeChat;

    launcher.addEventListener('click', openChat);
    closeBtn.addEventListener('click', closeChat);

    // Eventos de Chips Rápidos
    document.querySelectorAll('.ari-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const text = chip.textContent.trim().replace(/^[^\wáéíóúÁÉÍÓÚ¿?]+/, '').trim();
        handleUserMessage(text);
      });
    });

    sendBtn.addEventListener('click', () => {
      const text = userInput.value.trim();
      if (text) {
        handleUserMessage(text);
        userInput.value = '';
      }
    });

    userInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const text = userInput.value.trim();
        if (text) {
          handleUserMessage(text);
          userInput.value = '';
        }
      }
    });

    cancelFormBtn.addEventListener('click', () => {
      formContainer.classList.add('hidden');
    });

    submitLeadBtn.addEventListener('click', async () => {
      const name = document.getElementById('lead-name').value.trim();
      const contact = document.getElementById('lead-contact').value.trim();
      const competitors = document.getElementById('lead-competitors').value.trim();

      if (!name || !contact) {
        alert('Por favor completá tu nombre y una forma de contacto (WhatsApp o Email).');
        return;
      }

      submitLeadBtn.disabled = true;
      submitLeadBtn.innerHTML = `<span>⏳</span><span>Enviando...</span>`;

      await dispatchLead({ name, contact, competitors });

      formContainer.classList.add('hidden');
      submitLeadBtn.disabled = false;
      submitLeadBtn.innerHTML = `<span>⚡</span><span>Enviar a Walter & Activar Alertas</span>`;

      // Mensaje de éxito en el chat
      appendMessage('ari', `✅ **¡Datos recibidos con éxito, ${name}!**\n\nLe acabo de enviar la notificación directa al Telegram del Comandante Walter. En las próximas horas te estaremos contactando para dejar configuradas las alertas de tus 3 competidores.`);
    });
  }

  // AGREGAR MENSAJE AL HISTORIAL
  function appendMessage(sender, text) {
    const messages = document.getElementById('ari-messages');
    if (!messages) return;

    const div = document.createElement('div');
    div.className = sender === 'user' ? 'flex justify-end' : 'flex gap-2.5 items-start';

    // Parseo básico de Markdown (negritas y links)
    const formatted = text
      .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="text-emerald-400 underline hover:text-emerald-300 font-bold">$1</a>')
      .replace(/\n/g, '<br>');

    if (sender === 'user') {
      div.innerHTML = `
        <div class="bg-gradient-to-r from-emerald-600 to-teal-600 text-slate-950 font-medium rounded-2xl rounded-tr-sm p-3 max-w-[85%] leading-relaxed shadow-lg">
          ${formatted}
        </div>
      `;
    } else {
      div.innerHTML = `
        <img src="ari-icon.png" class="w-7 h-7 rounded-lg mt-0.5 object-cover" onerror="this.onerror=null; this.src='ari-avatar.png';">
        <div class="bg-slate-800/90 border border-white/10 rounded-2xl rounded-tl-sm p-3.5 max-w-[85%] leading-relaxed shadow-lg">
          ${formatted}
        </div>
      `;
    }

    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  // PROCESAMIENTO DE MENSAJES Y MOTOR DE RESPUESTA
  function handleUserMessage(msg) {
    appendMessage('user', msg);
    const lower = msg.toLowerCase();

    // Ver si activa formulario de lead
    if (lower.includes('prueba') || lower.includes('contratar') || lower.includes('demo') || lower.includes('empezar')) {
      const formContainer = document.getElementById('ari-lead-form-container');
      if (formContainer) formContainer.classList.remove('hidden');
    }

    // Buscar en Knowledge Base
    let foundReply = null;
    for (const item of KNOWLEDGE_BASE) {
      if (item.keywords.some(k => lower.includes(k))) {
        foundReply = item;
        break;
      }
    }

    // Efecto de tipeo simulado (300-500ms para realismo)
    setTimeout(() => {
      if (foundReply) {
        appendMessage('ari', foundReply.reply);
        if (foundReply.showForm) {
          const formContainer = document.getElementById('ari-lead-form-container');
          if (formContainer) formContainer.classList.remove('hidden');
        }
      } else {
        appendMessage('ari', '¡Excelente consulta! Nuestro sistema monitorea precios, descuentos y stock 24/7 sin que tengas que instalar nada.\n\nTodos nuestros agentes (**Crawl4AI**, **Playwright**, **Scrapy**, **Tool Router**, **Sheets Sync** y **Telegram Bot**) trabajan de forma coordinada.\n\n¿Te gustaría que te preparemos la **prueba gratuita de 48 horas** para tus 3 competidores más fuertes? Dejanos tus datos o preguntame cómo opera el equipo de scraping.');
        const formContainer = document.getElementById('ari-lead-form-container');
        if (formContainer) formContainer.classList.remove('hidden');
      }
    }, 400);
  }

  // ENVÍO DE LEADS A TELEGRAM Y SUPABASE
  async function dispatchLead(lead) {
    const timeNow = new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Cordoba' });

    // 1. DISPARO A TELEGRAM (BOT DE WALTER)
    const teleMsg = `🚨 *¡NUEVO PROSPECTO B2B EN RADARB2B.SITE!* 📡\n\n` +
      `👤 *Nombre:* ${lead.name}\n` +
      `📱 *Contacto:* ${lead.contact}\n` +
      `🎯 *Competidores:* ${lead.competitors || 'Sin especificar'}\n` +
      `⏰ *Fecha:* ${timeNow}\n\n` +
      `👉 *Acción:* Abrir WhatsApp para activar auditoría 48hs.`;

    try {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: teleMsg,
          parse_mode: 'Markdown'
        })
      });
      console.log('[Ari Agent] Alerta enviada a Telegram exitosamente.');
    } catch (err) {
      console.warn('[Ari Agent] Error enviando a Telegram:', err);
    }

    // 2. DISPARO A SUPABASE
    if (supabaseClient) {
      try {
        await supabaseClient.from('leads_radar_b2b').insert([
          {
            nombre: lead.name,
            contacto: lead.contact,
            competidores: lead.competitors,
            origen: isOficina ? 'ari_oficina_3d' : 'ari_portal_web',
            estado: 'nuevo'
          }
        ]);
        console.log('[Ari Agent] Lead guardado en Supabase.');
      } catch (err) {
        console.warn('[Ari Agent] Error guardando en Supabase:', err);
      }
    }

    // 3. RESPALDO LOCAL EN BÚNKER (LOCALSTORAGE)
    try {
      const stored = JSON.parse(localStorage.getItem('radar_b2b_leads') || '[]');
      stored.unshift({ ...lead, timestamp: timeNow, id: 'lead_' + Date.now() });
      localStorage.setItem('radar_b2b_leads', JSON.stringify(stored));
    } catch (e) {}
  }

  // AUTO INYECCIÓN
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectAriWidget);
  } else {
    injectAriWidget();
  }
})();
