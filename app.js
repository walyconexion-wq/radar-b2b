/**
 * RADAR B2B - CLIENT ENGINE & DYNAMIC RENDERER
 * Architecture: Landy JSON Pattern + Kokonut UI Micro-interactions
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
    <div class="glass-card rounded-2xl p-5 text-center relative overflow-hidden group">
      <div class="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent mb-1">
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
    <div class="glass-card rounded-3xl p-7 flex flex-col justify-between hover:border-emerald-500/40 transition-all duration-300 group">
      <div>
        <div class="flex items-center justify-between mb-4">
          <div class="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
            ${icons[m.badge] || '📡'}
          </div>
          <span class="text-[10px] font-mono tracking-widest text-emerald-400 uppercase bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-bold">
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
    <div class="glass-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between group hover:border-emerald-500/40 transition-all duration-300">
      <div class="space-y-4">
        <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
          ${f.icon}
        </div>
        <span class="inline-block text-[10px] font-mono tracking-widest text-emerald-400 uppercase bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
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
      ? 'border-emerald-500/50 shadow-2xl shadow-emerald-500/10 relative scale-[1.02]' 
      : 'border-white/10 hover:border-white/20';
    const msg = encodeURIComponent(`Hola Walter! Me interesa contratar el ${s.title} (${s.price} ${s.period}).`);

    return `
      <div class="glass-card rounded-3xl p-7 flex flex-col justify-between ${borderStyle} transition-all duration-300">
        <div>
          ${isPop ? `
            <div class="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-emerald-500 text-slate-950 font-bold font-mono text-[10px] tracking-wider uppercase shadow-lg shadow-emerald-500/40">
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
            <div class="text-[11px] text-emerald-400/90 font-mono mt-1">${s.setup}</div>
          </div>

          <div class="space-y-2.5 mb-8">
            <div class="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Incluye:</div>
            ${s.features.map(feat => `
              <div class="flex items-start gap-2.5 text-xs text-slate-300">
                <span class="text-emerald-400 font-bold">✓</span>
                <span>${feat}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <a href="${waBase}${msg}" target="_blank" rel="noopener noreferrer" class="w-full py-3.5 px-4 rounded-xl text-center font-bold text-xs transition-all ${
          isPop 
            ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 transform hover:scale-[1.02]' 
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
    <div class="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-emerald-500/20 transition-colors flex items-center justify-between gap-4">
      <div>
        <div class="font-bold text-xs text-white">${a.title}</div>
        <div class="text-[11px] text-slate-400 mt-0.5">${a.desc}</div>
      </div>
      <span class="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 font-mono text-xs font-bold whitespace-nowrap border border-emerald-500/20">
        ${a.price}
      </span>
    </div>
  `).join('');
}

function renderFaq(faq) {
  const container = document.getElementById('faq-container');
  if (!container || !faq) return;

  container.innerHTML = faq.map((item, idx) => `
    <details class="glass-card rounded-2xl group border border-white/5 hover:border-white/10 transition-all overflow-hidden" ${idx === 0 ? 'open' : ''}>
      <summary class="p-5 text-sm font-semibold text-white flex items-center justify-between cursor-pointer select-none">
        <span>${item.q}</span>
        <span class="text-emerald-400 transition-transform duration-300 group-open:rotate-180">↓</span>
      </summary>
      <div class="px-5 pb-5 text-xs text-slate-400 leading-relaxed font-light border-t border-white/5 pt-3">
        ${item.a}
      </div>
    </details>
  `).join('');
}

// KOKONUT UI: MOUSE MAGNETIC GLOW ON CARDS
function initKokonutGlow() {
  const cards = document.querySelectorAll('.glass-card');
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
    bubble.classList.add('ring-2', 'ring-emerald-400', 'scale-[1.02]');
    btn.textContent = '⚡ ¡Alerta Recibida!';
    setTimeout(() => {
      bubble.classList.remove('ring-2', 'ring-emerald-400', 'scale-[1.02]');
      btn.textContent = 'Simular Otra Alerta';
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
    logo.style.filter = `brightness(${1 + clickCount * 0.3}) drop-shadow(0 0 ${clickCount * 6}px #10b981)`;

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
      logo.style.filter = 'brightness(2) drop-shadow(0 0 25px #10b981)';

      // Flash y teleport al Búnker
      setTimeout(() => {
        window.location.href = 'bunker.html';
      }, 150);
    }
  });
}

