/**
 * BÚNKER B2B - CENTRO DE CÓMPUTOS ENGINE
 * Autenticación Supabase Auth + Gestión de Leads & Telemetría Telegram
 * Desarrollado por Walter & Luz
 */

const SUPABASE_URL = 'https://osdduwjsicoaeojfhokm.supabase.co';
const SUPABASE_KEY = 'sb_publishable_eVJfo1_bTqFQ0hmcXVA47A_kEdvMM0K';
const TELEGRAM_BOT_TOKEN = '8807784008:AAEVA1uYDLg9SXKgZD4BN8tEC9pd6aKqFbk';
const TELEGRAM_CHAT_ID = '8665151538';

let supabaseClient = null;

document.addEventListener('DOMContentLoaded', () => {
  initClock();
  initSupabase();
  attachEvents();
});

function initClock() {
  const clockEl = document.getElementById('bunker-clock');
  function update() {
    const now = new Date();
    if (clockEl) {
      clockEl.textContent = now.toLocaleTimeString('es-AR', {
        timeZone: 'America/Argentina/Cordoba',
        hour12: false
      }) + ' ART';
    }
  }
  update();
  setInterval(update, 1000);
}

function initSupabase() {
  if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
    try {
      supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
      checkAuthSession();
    } catch (err) {
      console.warn('[Búnker] Supabase fallback a modo offline:', err);
      showDashboardOffline();
    }
  } else {
    showDashboardOffline();
  }
}

async function checkAuthSession() {
  if (!supabaseClient) return;

  const { data: { session } } = await supabaseClient.auth.getSession();
  if (session && session.user) {
    onUserAuthenticated(session.user);
  } else {
    // Escuchar cambios de estado (cuando vuelve del redirect de Google)
    supabaseClient.auth.onAuthStateChange((event, session) => {
      if (session && session.user) {
        onUserAuthenticated(session.user);
      }
    });
  }
}

function onUserAuthenticated(user) {
  document.getElementById('bunker-login-screen').classList.add('hidden');
  document.getElementById('bunker-dashboard').classList.remove('hidden');

  const profileHeader = document.getElementById('user-header-profile');
  const avatarImg = document.getElementById('user-avatar');
  if (profileHeader) profileHeader.classList.remove('hidden');
  if (avatarImg) avatarImg.src = user.user_metadata?.avatar_url || 'ari-icon.png';

  loadLeads();
}

function showDashboardOffline() {
  document.getElementById('bunker-login-screen').classList.add('hidden');
  document.getElementById('bunker-dashboard').classList.remove('hidden');
  loadLeads();
}

function attachEvents() {
  const googleLoginBtn = document.getElementById('google-login-btn');
  const directBypassBtn = document.getElementById('direct-bypass-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const refreshBtn = document.getElementById('refresh-leads-btn');
  const addLeadBtn = document.getElementById('add-manual-lead-btn');
  const testTelegramBtn = document.getElementById('test-telegram-btn');

  if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', async () => {
      if (!supabaseClient) return;
      try {
        const { error } = await supabaseClient.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin + '/bunker.html'
          }
        });
        if (error) alert('Error iniciando sesión con Google: ' + error.message);
      } catch (err) {
        alert('Error conectando con Supabase Auth.');
      }
    });
  }

  if (directBypassBtn) {
    directBypassBtn.addEventListener('click', showDashboardOffline);
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      if (supabaseClient) await supabaseClient.auth.signOut();
      window.location.reload();
    });
  }

  if (refreshBtn) {
    refreshBtn.addEventListener('click', loadLeads);
  }

  if (addLeadBtn) {
    addLeadBtn.addEventListener('click', promptManualLead);
  }

  if (testTelegramBtn) {
    testTelegramBtn.addEventListener('click', sendTestTelegramAlert);
  }
}

async function loadLeads() {
  let leads = [];

  // 1. Intentar cargar desde Supabase
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('leads_radar_b2b')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        leads = data;
      }
    } catch (e) {
      console.warn('[Búnker] No se pudo leer de Supabase, usando local.');
    }
  }

  // 2. Si no hay en Supabase o está vacío, cargar del localStorage
  if (leads.length === 0) {
    try {
      leads = JSON.parse(localStorage.getItem('radar_b2b_leads') || '[]');
    } catch (e) {}
  }

  // 3. Si no hay ninguno todavía, sembrar uno de muestra para que Walter vea la interfaz activa
  if (leads.length === 0) {
    leads = [
      {
        id: 'sample_1',
        nombre: 'Matías Rodríguez (ElectroTech E-com)',
        contacto: '+54 9 11 5544-3322',
        competidores: 'Amazon, Frávega, Mercado Libre Tienda Oficial',
        created_at: new Date().toISOString(),
        estado: 'Auditoría 48hs Activa'
      }
    ];
  }

  renderLeads(leads);
}

function renderLeads(leads) {
  const tbody = document.getElementById('bunker-leads-tbody');
  const countEl = document.getElementById('stat-total-leads');
  if (countEl) countEl.textContent = leads.length;

  if (!tbody) return;

  if (leads.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="p-6 text-center text-slate-500 font-mono text-xs">
          No hay prospectos registrados aún. Ari está en línea esperando el primer contacto en radarb2b.site.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = leads.map(l => {
    const rawDate = l.created_at || l.timestamp || new Date().toISOString();
    const formattedDate = new Date(rawDate).toLocaleDateString('es-AR', {
      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
    });

    const isPhone = l.contacto && (l.contacto.startsWith('+') || l.contacto.replace(/\D/g, '').length >= 8);
    const cleanPhone = l.contacto ? l.contacto.replace(/\D/g, '') : '';
    const waUrl = cleanPhone 
      ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(`Hola ${l.nombre || ''}! Soy Walter de Radar B2B. Recibí tu solicitud para la prueba gratuita de 48 horas en tus competidores.`)}`
      : '#';

    return `
      <tr class="hover:bg-white/[0.04] transition-colors">
        <td class="p-3 text-slate-400 font-mono text-[11px] whitespace-nowrap">${formattedDate}</td>
        <td class="p-3 font-bold text-white text-xs">${l.nombre || 'Anónimo'}</td>
        <td class="p-3 text-emerald-300 font-mono text-xs">${l.contacto || 'Sin contacto'}</td>
        <td class="p-3 text-slate-300 text-xs max-w-xs truncate" title="${l.competidores || ''}">${l.competidores || 'No especificó'}</td>
        <td class="p-3 whitespace-nowrap">
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
            ${l.estado || 'Nuevo'}
          </span>
        </td>
        <td class="p-3 text-right whitespace-nowrap">
          ${isPhone ? `
            <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all">
              <span>💬 Abrir WhatsApp</span>
            </a>
          ` : `
            <button onclick="navigator.clipboard.writeText('${l.contacto || ''}'); alert('Contacto copiado');" class="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-xs transition-colors">
              Copiar Contacto
            </button>
          `}
        </td>
      </tr>
    `;
  }).join('');
}

async function promptManualLead() {
  const nombre = prompt('Nombre o Empresa del Cliente:');
  if (!nombre) return;
  const contacto = prompt('WhatsApp o Email de contacto:');
  if (!contacto) return;
  const competidores = prompt('Enlaces o nombres de competidores:');

  const newLead = {
    id: 'lead_' + Date.now(),
    nombre,
    contacto,
    competidores,
    created_at: new Date().toISOString(),
    estado: 'Nuevo'
  };

  // Guardar en Supabase
  if (supabaseClient) {
    try {
      await supabaseClient.from('leads_radar_b2b').insert([newLead]);
    } catch (e) {}
  }

  // Guardar en local
  try {
    const stored = JSON.parse(localStorage.getItem('radar_b2b_leads') || '[]');
    stored.unshift(newLead);
    localStorage.setItem('radar_b2b_leads', JSON.stringify(stored));
  } catch (e) {}

  loadLeads();
}

async function sendTestTelegramAlert() {
  const statusEl = document.getElementById('test-telegram-status');
  if (statusEl) statusEl.textContent = 'Enviando alerta a Telegram...';

  const now = new Date().toLocaleTimeString('es-AR', { timeZone: 'America/Argentina/Cordoba' });
  const msg = `⚡ *PING DE TELEMETRÍA DESDE EL BÚNKER B2B*\n\n` +
    `📡 *Sistema:* radarb2b.site\n` +
    `🛡️ *Origen:* Centro de Cómputos Búnker\n` +
    `⏰ *Hora:* ${now} ART\n\n` +
    `✅ La cañería push a tu celular está 100% OPERATIVA.`;

  try {
    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: msg,
        parse_mode: 'Markdown'
      })
    });
    if (res.ok) {
      if (statusEl) statusEl.textContent = '✅ ¡Recibido en tu celular!';
      setTimeout(() => { if (statusEl) statusEl.textContent = ''; }, 3000);
    } else {
      if (statusEl) statusEl.textContent = '⚠️ Error en respuesta Telegram';
    }
  } catch (err) {
    if (statusEl) statusEl.textContent = '❌ Error de red';
  }
}
