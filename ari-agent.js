/**
 * ARI AGENT - ASISTENTE IA DE INTELIGENCIA B2B & CAPTURA DE LEADS
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

  // BASE DE CONOCIMIENTO EMBEBIDA
  const KNOWLEDGE_BASE = [
    {
      keywords: ['precio', 'costo', 'planes', 'cuanto sale', 'tarifa', 'abono', 'mensualidad', 'pagar'],
      reply: 'Tenemos 3 planes mensuales adaptados a tu escala comercial:\n\n• **Plan Esencial ($500 USD/mes):** Hasta 5 competidores clave, 2 auditorías diarias y alertas a Telegram.\n• **Plan Pro Dinámico ($650 USD/mes):** Hasta 15 competidores, auditorías cada 2 horas, alertas inmediatas de quiebres de stock y Google Sheets vivo.\n• **Plan Enterprise ($750 USD/mes):** Monitoreo ilimitado, Webhooks a Shopify/WooCommerce y servidores dedicados.\n\n¿Querés que te active la **prueba gratuita de 48 horas** para 3 de tus competidores?'
    },
    {
      keywords: ['prueba', 'gratis', '48 horas', '48hs', 'test', 'demo', 'probar', 'empezar'],
      reply: '¡Exacto! Podés probar el Radar en **3 tiendas de tu competencia 100% gratis por 48 horas**.\n\nSin tarjetas de crédito, sin contratos y sin instalar nada en tu computadora. Te llegan las alertas a tu Telegram o WhatsApp. ¿Te gustaría dejar tus datos para que lo dejemos conectado hoy mismo?',
      showForm: true
    },
    {
      keywords: ['como funciona', 'que hace', 'sistema', 'radar', 'servicio', 'que es'],
      reply: 'El Radar B2B es una **cañería de datos automatizada** que vigila los precios, rebajas y stock de tus rivales todos los días.\n\n1. Nuestros centinelas extraen la data en tiempo real sin ser bloqueados.\n2. Si un rival baja un precio o se queda sin stock, te llega una alerta a Telegram en < 30 segundos.\n3. Tu planilla de Google Sheets se actualiza sola todas las mañanas antes de que abras tu negocio.'
    },
    {
      keywords: ['bloqueo', 'cloudflare', 'ban', 'anti-bot', 'seguridad', 'detectar'],
      reply: 'Utilizamos tecnología **Stealth de navegación indetectable** con rotación de huellas digitales de navegadores reales y proxys residenciales. Para el servidor del competidor, las visitas son indistinguibles del tráfico de un cliente normal.'
    },
    {
      keywords: ['contacto', 'hablar', 'humano', 'walter', 'whatsapp', 'telefono'],
      reply: 'Podés hablar directamente con **Walter**, nuestro Director de Operaciones B2B, a través de WhatsApp:\n\n👉 [Abrir chat directo con Walter](https://api.whatsapp.com/send?phone=5493544565656&text=Hola%20Walter!%20Estuve%20hablando%20con%20Ari%20en%20radarb2b.site%20y%20quiero%20hacerte%20una%20consulta.)'
    },
    {
      keywords: ['metodo de pago', 'como pago', 'paypal', 'tarjeta', 'transferencia', 'crypto', 'usdt'],
      reply: 'Aceptamos pagos internacionales de forma muy sencilla:\n• Tarjetas de crédito/débito vía Stripe y PayPal.\n• Transferencias bancarias directas de EE.UU. (ACH) y Europa (SEPA).\n• Criptomonedas estables (USDT / USDC).'
    }
  ];

  // INICIALIZACIÓN DE LA UI DE ARI
  function injectAriWidget() {
    if (document.getElementById('ari-widget-container')) return;

    const container = document.createElement('div');
    container.id = 'ari-widget-container';
    container.className = 'fixed bottom-5 right-5 z-50 font-sans text-slate-100 select-none';

    container.innerHTML = `
      <!-- BOTÓN FLOTANTE LAUNCHER -->
      <div id="ari-launcher" class="flex items-center gap-3 cursor-pointer group">
        <div class="hidden sm:flex items-center bg-[#090d16]/90 border border-emerald-500/30 px-3.5 py-1.5 rounded-full shadow-2xl backdrop-blur-md text-xs font-medium text-slate-200 group-hover:border-emerald-400 transition-all">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-2"></span>
          <span>¿Dudas? Hablá con <b>Ari</b></span>
        </div>
        <div class="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-2xl shadow-emerald-500/30 group-hover:scale-105 transition-transform">
          <img src="ari-avatar.png" alt="Ari Asistente IA" class="w-full h-full object-cover rounded-2xl bg-slate-950" onerror="this.src='ari-portrait.jpg'">
          <span class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#040608] flex items-center justify-center">
            <span class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
          </span>
        </div>
      </div>

      <!-- MODAL DE CHAT -->
      <div id="ari-chat-modal" class="hidden fixed bottom-5 right-5 sm:bottom-6 sm:right-6 w-[92vw] sm:w-[390px] h-[550px] max-h-[85vh] bg-[#070b12]/95 border border-emerald-500/30 rounded-3xl shadow-2xl shadow-emerald-950/60 backdrop-blur-2xl flex-col overflow-hidden z-50 transition-all duration-300 transform scale-95 opacity-0">
        
        <!-- HEADER -->
        <div class="px-5 py-4 bg-slate-900/90 border-b border-white/10 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-md">
              <img src="ari-avatar.png" class="w-full h-full object-cover rounded-[10px]" onerror="this.src='ari-portrait.jpg'">
            </div>
            <div>
              <div class="font-extrabold text-sm text-white flex items-center gap-1.5">
                <span>Ari</span>
                <span class="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[9px]">IA B2B</span>
              </div>
              <div class="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>En línea · Responde en < 1s</span>
              </div>
            </div>
          </div>
          <button id="ari-close-btn" class="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center text-sm transition-colors">
            ✕
          </button>
        </div>

        <!-- HISTORIAL DE MENSAJES -->
        <div id="ari-messages" class="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs font-sans text-slate-200">
          <!-- Mensaje Inicial de Bienvenida -->
          <div class="flex gap-2.5 items-start">
            <img src="ari-icon.png" class="w-7 h-7 rounded-lg mt-0.5 object-cover" onerror="this.src='ari-avatar.png'">
            <div class="bg-slate-800/80 border border-white/5 rounded-2xl rounded-tl-sm p-3 max-w-[85%] leading-relaxed">
              ¡Hola! 👋 Soy <b>Ari</b>, tu copiloto de inteligencia competitiva en <b>Radar B2B</b>.
              <br><br>
              ¿Tenés alguna consulta sobre cómo monitoreamos a tu competencia, o querés activar tu **prueba gratuita de 48 horas**?
            </div>
          </div>

          <!-- CHIPS RÁPIDOS -->
          <div id="ari-quick-chips" class="flex flex-wrap gap-1.5 pt-1">
            <button class="ari-chip px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 text-[11px] transition-colors">
              🚀 Pedir prueba 48hs gratis
            </button>
            <button class="ari-chip px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-[11px] transition-colors">
              💰 Planes y Precios
            </button>
            <button class="ari-chip px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-[11px] transition-colors">
              🛡️ ¿Cómo evitan bloqueos?
            </button>
          </div>
        </div>

        <!-- FORMULARIO DE CAPTURA EMBEBIDO (OCULTO POR DEFECTO) -->
        <div id="ari-lead-form-container" class="hidden p-4 bg-slate-950/90 border-t border-emerald-500/30 space-y-2.5 text-xs">
          <div class="font-bold text-white flex items-center justify-between">
            <span>🎯 Datos para tu Prueba Gratis de 48hs</span>
            <button id="ari-cancel-form" class="text-slate-400 hover:text-white text-[11px]">Cancelar</button>
          </div>
          <input id="lead-name" type="text" placeholder="Tu Nombre y/o Empresa" class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500">
          <input id="lead-contact" type="text" placeholder="WhatsApp o Email de contacto" class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500">
          <textarea id="lead-competitors" rows="2" placeholder="Links de 1 a 3 competidores a vigilar" class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500 resize-none"></textarea>
          <button id="lead-submit-btn" class="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all">
            ⚡ Enviar a Walter & Activar Alertas
          </button>
        </div>

        <!-- INPUT DE CHAT -->
        <div id="ari-input-container" class="p-3 bg-slate-900/90 border-t border-white/10 flex items-center gap-2">
          <input id="ari-user-input" type="text" placeholder="Escribí tu pregunta acá..." class="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500">
          <button id="ari-send-btn" class="w-9 h-9 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center justify-center transition-colors">
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
      modal.classList.remove('hidden');
      setTimeout(() => {
        modal.classList.remove('scale-95', 'opacity-0');
        modal.classList.add('flex', 'scale-100', 'opacity-100');
        userInput.focus();
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

    launcher.addEventListener('click', openChat);
    closeBtn.addEventListener('click', closeChat);

    // Eventos de Chips Rápidos
    document.querySelectorAll('.ari-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const text = chip.textContent.trim();
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
      submitLeadBtn.textContent = 'Enviando...';

      await dispatchLead({ name, contact, competitors });

      formContainer.classList.add('hidden');
      submitLeadBtn.disabled = false;
      submitLeadBtn.textContent = '⚡ Enviar a Walter & Activar Alertas';

      // Mensaje de éxito en el chat
      appendMessage('ari', `✅ **¡Datos recibidos con éxito, ${name}!**\n\nLe acabo de enviar la notificación directa al Telegram de Walter. En las próximas horas te estaremos contactando para dejar configuradas las alertas de tus 3 competidores.`);
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
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="text-emerald-400 underline">$1</a>')
      .replace(/\n/g, '<br>');

    if (sender === 'user') {
      div.innerHTML = `
        <div class="bg-emerald-600 text-slate-950 font-medium rounded-2xl rounded-tr-sm p-3 max-w-[85%] leading-relaxed">
          ${formatted}
        </div>
      `;
    } else {
      div.innerHTML = `
        <img src="ari-icon.png" class="w-7 h-7 rounded-lg mt-0.5 object-cover" onerror="this.src='ari-avatar.png'">
        <div class="bg-slate-800/80 border border-white/5 rounded-2xl rounded-tl-sm p-3 max-w-[85%] leading-relaxed">
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

    // Efecto de tipeo simulado
    setTimeout(() => {
      if (foundReply) {
        appendMessage('ari', foundReply.reply);
        if (foundReply.showForm) {
          const formContainer = document.getElementById('ari-lead-form-container');
          if (formContainer) formContainer.classList.remove('hidden');
        }
      } else {
        appendMessage('ari', '¡Excelente consulta! Nuestro sistema monitorea precios, descuentos y stock 24/7 sin que tengas que instalar nada.\n\n¿Te gustaría que te preparemos la **prueba gratuita de 48 horas** para tus 3 competidores más fuertes? Solo necesitamos tus enlaces y te activamos el bot hoy mismo.');
        const formContainer = document.getElementById('ari-lead-form-container');
        if (formContainer) formContainer.classList.remove('hidden');
      }
    }, 450);
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
            origen: 'ari_chat_widget',
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
