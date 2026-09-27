/**
 * RADAR B2B - CLIENT ENGINE & DYNAMIC RENDERER
 * Architecture: Dark SaaS Analytics Platform + Landy JSON Pattern + Kokonut UI Micro-interactions
 * Authors: Walter & Luz (Antigravity Ops)
 */

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('content.json');
    if (!response.ok) throw new Error('No se pudo cargar content.json');
    const data = await response.json();
    initApp(data);
  } catch (error) {
    console.error('Error cargando content.json:', error);
  }
});

function initApp(data) {
  renderBrand(data.brand, data.contact);
  renderHero(data.hero, data.contact);
  renderStats(data.stats);
  renderTelegram(data.telegramDemo, data.contact);
  renderSheets(data.sheetsDemo);
  renderFrequency(data.frequencyModels);
  renderFeatures(data.features);
  renderServices(data.services, data.contact);
  renderAddons(data.addons);
  renderFaq(data.faq);
  initDashboardTabs();
  initChartPills();
  initKokonutGlow();
  initCalculator();
  initTelegramSimulator();
  initSecretBunkerTrigger();
}

function renderBrand(brand, contact) {
  const brandNameEls = document.querySelectorAll('[data-brand-name]');
  brandNameEls.forEach(el => el.textContent = brand.name);

  const brandTaglineEls = document.querySelectorAll('[data-brand-tagline]');
  brandTaglineEls.forEach(el => el.textContent = brand.tagline);

  const brandEmojiEls = document.querySelectorAll('[data-brand-emoji]');
  brandEmojiEls.forEach(el => el.textContent = brand.emoji);

  const waLinks = document.querySelectorAll('[data-wa-cta]');
  const waUrl = `https://api.whatsapp.com/send?phone=${contact.whatsappPhone}&text=${encodeURIComponent(contact.whatsappMessage)}`;
  waLinks.forEach(a => {
    a.href = waUrl;
  });
}

function renderHero(hero, contact) {
  const heroBadge = document.getElementById('hero-badge');
  if (heroBadge) heroBadge.textContent = hero.badge;

  const heroTitle1 = document.getElementById('hero-title-1');
  if (heroTitle1) heroTitle1.textContent = hero.titleLine1;

  const heroGradient = document.getElementById('hero-gradient');
  if (heroGradient) heroGradient.textContent = hero.titleGradient;

  const heroDesc = document.getElementById('hero-desc');
  if (heroDesc) heroDesc.textContent = hero.description;

  const badgesContainer = document.getElementById('hero-badges-container');
  if (badgesContainer && hero.badges) {
    badgesContainer.innerHTML = hero.badges.map(b => `
      <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-slate-300 font-mono">
        <span>${b.icon}</span>
        <span>${b.text}</span>
      </span>
    `).join(' ');
  }
}

function renderStats(stats) {
  const container = document.getElementById('stats-container');
  if (!container || !stats) return;

  container.innerHTML = stats.map(s => `
    <div class="dark-saas-card rounded-2xl p-5 text-center relative overflow-hidden group">
      <div class="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight bg-gradient-to-r from-cyan-400 to-indigo-300 bg-clip-text text-transparent mb-1">
        ${s.value}
      </div>
      <div class="text-xs text-slate-400 font-medium">
        ${s.label}
      </div>
    </div>
  `).join('');
}

function renderTelegram(tele, contact) {
  if (!tele) return;
  const botName = document.getElementById('tele-bot-name');
  if (botName) botName.textContent = tele.botName;

  const prod = document.getElementById('tele-product');
  if (prod) prod.textContent = tele.product;

  const store = document.getElementById('tele-store');
  if (store) store.textContent = tele.store;

  const mov = document.getElementById('tele-movement');
  if (mov) mov.textContent = tele.movement;

  const oldP = document.getElementById('tele-old-price');
  if (oldP) oldP.textContent = tele.oldPrice;

  const newP = document.getElementById('tele-new-price');
  if (newP) newP.textContent = tele.newPrice;

  const diff = document.getElementById('tele-diff');
  if (diff) diff.textContent = tele.diff;

  const stock = document.getElementById('tele-stock');
  if (stock) stock.innerHTML = tele.stock;

  const time = document.getElementById('tele-time');
  if (time) time.textContent = tele.timestamp;
}

function renderSheets(rows) {
  const tbody = document.getElementById('sheets-tbody');
  if (!tbody || !rows) return;

  tbody.innerHTML = rows.map(r => `
    <tr class="hover:bg-white/[0.04] transition-colors">
      <td class="p-3 text-slate-400 font-mono text-[11px]">${r.time}</td>
      <td class="p-3 font-semibold text-white text-xs">${r.product}</td>
      <td class="p-3 text-slate-300 text-xs">${r.competitor}</td>
      <td class="p-3 font-mono text-amber-300 font-bold text-xs">${r.price}</td>
      <td class="p-3 font-mono text-xs ${r.diffClass}">${r.diff}</td>
      <td class="p-3">
        <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold ${r.stockClass}">${r.stock}</span>
      </td>
    </tr>
  `).join('');
}

function renderFrequency(models) {
  const container = document.getElementById('frequency-container');
  if (!container || !models) return;

  const icons = {
    'PROGRAMADO': '⏱️',
    'EVENTOS': '⚡',
    'TIEMPO REAL': '🔄'
  };

  container.innerHTML = models.map(m => `
    <div class="dark-saas-card rounded-3xl p-7 flex flex-col justify-between hover:border-cyan-500/40 transition-all duration-300 group">
      <div>
        <div class="flex items-center justify-between mb-4">
          <div class="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
            ${icons[m.badge] || '📡'}
          </div>
          <span class="text-[10px] font-mono tracking-widest text-cyan-400 uppercase bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20 font-bold">
            ${m.badge}
          </span>
        </div>
        <h3 class="text-lg font-bold text-white mb-2 tracking-tight">${m.title}</h3>
        <p class="text-xs text-slate-300 leading-relaxed font-light">${m.desc}</p>
      </div>
    </div>
  `).join('');
}

function renderFeatures(features) {
  const container = document.getElementById('features-container');
  if (!container || !features) return;

  container.innerHTML = features.map(f => `
    <div class="dark-saas-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between group hover:border-cyan-500/40 transition-all duration-300">
      <div class="space-y-4">
        <div class="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
          ${f.icon}
        </div>
        <span class="inline-block text-[10px] font-mono tracking-widest text-cyan-400 uppercase bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
          ${f.badge}
        </span>
        <h3 class="text-lg font-bold text-white tracking-tight">${f.title}</h3>
        <p class="text-xs text-slate-400 leading-relaxed font-light">${f.description}</p>
      </div>
    </div>
  `).join('');
}

function renderServices(services, contact) {
  const container = document.getElementById('services-container');
  if (!container || !services) return;

  const waBase = `https://api.whatsapp.com/send?phone=${contact.whatsappPhone}&text=`;

  container.innerHTML = services.map(s => {
    const isPop = s.popular;
    const borderStyle = isPop 
      ? 'border-cyan-500/50 shadow-2xl shadow-cyan-500/15 relative scale-[1.02] bg-[#0E1328]/80' 
      : 'border-white/10 hover:border-white/20';
    const msg = encodeURIComponent(`Hola Walter! Me interesa contratar el ${s.title} (${s.price} ${s.period}).`);

    return `
      <div class="dark-saas-card rounded-3xl p-7 flex flex-col justify-between ${borderStyle} transition-all duration-300">
        <div>
          ${isPop ? `
            <div class="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 text-slate-950 font-bold font-mono text-[10px] tracking-wider uppercase shadow-lg shadow-cyan-500/30">
              ${s.badge}
            </div>
          ` : ''}

          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl">
              ${s.icon}
            </div>
            <div>
              <h3 class="font-bold text-base text-white">${s.title}</h3>
              <p class="text-[11px] text-slate-400">${s.period}</p>
            </div>
          </div>

          <p class="text-xs text-slate-300 mb-6 leading-relaxed">${s.description}</p>

          <div class="mb-6 p-4 rounded-2xl bg-black/40 border border-white/5">
            <div class="flex items-baseline gap-1">
              <span class="text-3xl font-black text-white font-mono">${s.price}</span>
              <span class="text-xs text-slate-400">${s.period}</span>
            </div>
            <div class="text-[11px] text-cyan-400/90 font-mono mt-1">${s.setup}</div>
          </div>

          <div class="space-y-2.5 mb-8">
            <div class="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Incluye:</div>
            ${s.features.map(feat => `
              <div class="flex items-start gap-2.5 text-xs text-slate-300">
                <span class="text-cyan-400 font-bold">✓</span>
                <span>${feat}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <a href="${waBase}${msg}" target="_blank" rel="noopener noreferrer" class="w-full py-3.5 px-4 rounded-xl text-center font-bold text-xs transition-all ${
          isPop 
            ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 shadow-lg shadow-cyan-500/20 transform hover:scale-[1.02]' 
            : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
        }">
          ${s.cta}
        </a>
      </div>
    `;
  }).join('');
}

function renderAddons(addons) {
  const container = document.getElementById('addons-container');
  if (!container || !addons) return;

  container.innerHTML = addons.map(a => `
    <div class="dark-saas-card p-4 rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-all flex items-center justify-between gap-4 group">
      <div>
        <div class="font-bold text-xs text-white">${a.title}</div>
        <div class="text-[11px] text-slate-400 mt-0.5">${a.desc}</div>
      </div>
      <span class="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 font-mono text-xs font-bold whitespace-nowrap border border-cyan-500/20">
        ${a.price}
      </span>
    </div>
  `).join('');
}

function renderFaq(faq) {
  const container = document.getElementById('faq-container');
  if (!container || !faq) return;

  container.innerHTML = faq.map((item, idx) => `
    <details class="dark-saas-card rounded-2xl group border border-white/5 hover:border-cyan-500/20 transition-all overflow-hidden" ${idx === 0 ? 'open' : ''}>
      <summary class="p-5 text-sm font-semibold text-white flex items-center justify-between cursor-pointer select-none">
        <span>${item.q}</span>
        <span class="text-cyan-400 transition-transform duration-300 group-open:rotate-180">↓</span>
      </summary>
      <div class="px-5 pb-5 text-xs text-slate-400 leading-relaxed font-light border-t border-white/5 pt-3">
        ${item.a}
      </div>
    </details>
  `).join('');
}

// DASHBOARD TABS SWITCHER (CHART / TELEGRAM / SHEETS)
function initDashboardTabs() {
  const tabs = [
    { btn: document.getElementById('tab-btn-chart'), view: document.getElementById('view-chart') },
    { btn: document.getElementById('tab-btn-telegram'), view: document.getElementById('view-telegram') },
    { btn: document.getElementById('tab-btn-sheets'), view: document.getElementById('view-sheets') }
  ];

  tabs.forEach(({ btn, view }) => {
    if (!btn || !view) return;
    btn.addEventListener('click', () => {
      tabs.forEach(t => {
        if (t.btn) t.btn.classList.remove('active');
        if (t.view) t.view.classList.add('hidden');
      });
      btn.classList.add('active');
      view.classList.remove('hidden');
    });
  });
}

// INTERACTIVE SVG CHART PRODUCT PILLS
const CHART_PRESETS = {
  lenovo: {
    title: 'Notebook Lenovo IdeaPad 15.6 FHD Core i5 16GB',
    competitorCurve: 'M 0,50 Q 150,55 300,52 T 450,60 T 550,150 T 600,155',
    competitorArea: 'M 0,50 Q 150,55 300,52 T 450,60 T 550,150 T 600,155 L 600,200 L 0,200 Z',
    ourCurve: 'M 0,90 Q 150,88 300,90 T 450,92 T 550,105 T 600,110',
    alertX: 550,
    alertY: 150,
    alertTitle: 'BAJA DETECTADA (-$99.00 USD)',
    alertDesc: 'Rival bajó de <b>$549.99</b> a <b class="text-amber-300">$450.99</b>',
    alertLatency: '⚡ Alerta enviada a Telegram en 24s'
  },
  tv: {
    title: 'Smart TV Samsung 50" Crystal UHD 4K HDR10',
    competitorCurve: 'M 0,70 Q 150,65 300,80 T 420,75 T 530,165 T 600,170',
    competitorArea: 'M 0,70 Q 150,65 300,80 T 420,75 T 530,165 T 600,170 L 600,200 L 0,200 Z',
    ourCurve: 'M 0,110 Q 150,115 300,110 T 420,112 T 530,130 T 600,135',
    alertX: 530,
    alertY: 165,
    alertTitle: 'QUIEBRE DE PRECIO FLASH (-$140.00 USD)',
    alertDesc: 'Rival bajó de <b>$489.00</b> a <b class="text-amber-300">$349.00</b>',
    alertLatency: '⚡ Alerta enviada a Telegram en 18s'
  },
  headphone: {
    title: 'Auriculares Sony WH-1000XM5 Noise Cancelling',
    competitorCurve: 'M 0,40 Q 140,45 280,42 T 440,50 T 540,140 T 600,145',
    competitorArea: 'M 0,40 Q 140,45 280,42 T 440,50 T 540,140 T 600,145 L 600,200 L 0,200 Z',
    ourCurve: 'M 0,75 Q 140,78 280,75 T 440,80 T 540,95 T 600,98',
    alertX: 540,
    alertY: 140,
    alertTitle: 'DESCUENTO NOCTURNO (-$70.00 USD)',
    alertDesc: 'Rival bajó de <b>$399.00</b> a <b class="text-amber-300">$329.00</b>',
    alertLatency: '⚡ Alerta enviada a Telegram en 31s'
  }
};

function initChartPills() {
  const pills = document.querySelectorAll('#chart-product-pills button');
  const titleEl = document.getElementById('chart-product-title');
  const compCurve = document.getElementById('curve-competitor');
  const compArea = document.getElementById('curve-competitor-area');
  const ourCurve = document.getElementById('curve-ours');
  const dot = document.getElementById('alert-dot');
  const dotPing = document.getElementById('alert-dot-ping');
  const tooltipTitle = document.getElementById('tooltip-alert-title');
  const tooltipDesc = document.getElementById('tooltip-alert-desc');
  const tooltipLatency = document.getElementById('tooltip-alert-latency');

  if (!pills.length) return;

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const sku = pill.getAttribute('data-sku') || 'lenovo';
      const preset = CHART_PRESETS[sku];
      if (!preset) return;

      if (titleEl) titleEl.textContent = preset.title;
      if (compCurve) compCurve.setAttribute('d', preset.competitorCurve);
      if (compArea) compArea.setAttribute('d', preset.competitorArea);
      if (ourCurve) ourCurve.setAttribute('d', preset.ourCurve);
      if (dot) {
        dot.setAttribute('cx', preset.alertX);
        dot.setAttribute('cy', preset.alertY);
      }
      if (dotPing) {
        dotPing.setAttribute('cx', preset.alertX);
        dotPing.setAttribute('cy', preset.alertY);
      }
      if (tooltipTitle) tooltipTitle.textContent = preset.alertTitle;
      if (tooltipDesc) tooltipDesc.innerHTML = preset.alertDesc;
      if (tooltipLatency) tooltipLatency.textContent = preset.alertLatency;
    });
  });
}

// KOKONUT UI: MOUSE MAGNETIC GLOW ON CARDS
function initKokonutGlow() {
  const cards = document.querySelectorAll('.glass-card, .dark-saas-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

// INTERACTIVE ROI / ESTIMATED REVENUE LOSS CALCULATOR
function initCalculator() {
  const slider = document.getElementById('calc-slider');
  const revenueVal = document.getElementById('calc-revenue-val');
  const lossVal = document.getElementById('calc-loss-val');
  const recoveryVal = document.getElementById('calc-recovery-val');

  if (!slider) return;

  function update() {
    const val = parseInt(slider.value, 10);
    if (revenueVal) revenueVal.textContent = `$${val.toLocaleString()} USD / mes`;

    // Estadísticamente, los e-commerce pierden un 3% a 6% de margen bruto por guerras de precios no detectadas
    const estimatedLoss = Math.round(val * 0.045);
    if (lossVal) lossVal.textContent = `-$${estimatedLoss.toLocaleString()} USD`;

    // Recuperación proyectada con monitoreo y repricing rápido
    const estimatedRecovery = Math.round(estimatedLoss * 0.85);
    if (recoveryVal) recoveryVal.textContent = `+$${estimatedRecovery.toLocaleString()} USD`;
  }

  slider.addEventListener('input', update);
  update();
}

// TELEGRAM ALERT SIMULATOR BUTTON
function initTelegramSimulator() {
  const btn = document.getElementById('simulate-alert-btn');
  const bubble = document.getElementById('telegram-live-bubble');
  if (!btn || !bubble) return;

  btn.addEventListener('click', () => {
    bubble.classList.add('ring-2', 'ring-cyan-400', 'scale-[1.02]');
    btn.textContent = '⚡ ¡Alerta Recibida!';
    setTimeout(() => {
      bubble.classList.remove('ring-2', 'ring-cyan-400', 'scale-[1.02]');
      btn.textContent = '⚡ Simular Otra Alerta';
    }, 1500);
  });
}

// SECRET BUNKER TRIGGER: 4 CLICKS ON LOGO TO WARP TO BUNKER
function initSecretBunkerTrigger() {
  const logo = document.getElementById('secret-bunker-logo');
  if (!logo) return;

  let clickCount = 0;
  let timer = null;

  logo.addEventListener('click', (e) => {
    e.preventDefault();
    clickCount++;

    // Efecto visual táctico en cada clic
    logo.style.transition = 'transform 0.15s ease, filter 0.15s ease';
    logo.style.transform = `scale(${1 + clickCount * 0.05})`;
    logo.style.filter = `brightness(${1 + clickCount * 0.3}) drop-shadow(0 0 ${clickCount * 6}px #00F2FE)`;

    clearTimeout(timer);
    timer = setTimeout(() => {
      clickCount = 0;
      logo.style.transform = 'scale(1)';
      logo.style.filter = 'none';
    }, 1400);

    if (clickCount >= 4) {
      clearTimeout(timer);
      clickCount = 0;
      logo.style.transform = 'scale(1.25)';
      logo.style.filter = 'brightness(2) drop-shadow(0 0 25px #00F2FE)';

      // Flash y teleport al Búnker
      setTimeout(() => {
        window.location.href = 'bunker.html';
      }, 150);
    }
  });
}
