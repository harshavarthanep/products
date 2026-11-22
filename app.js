/* H24 Creationz products site: shared logic for index.html and index-bold.html.
   You normally do not need to edit this file; change config.js instead. */
(() => {
'use strict';
const C = window.H24, T = C.timing;

/* ---------------- utils ---------------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const ic = (n, cls = '') => `<svg class="ic ${cls}" aria-hidden="true"><use href="#i-${n}"/></svg>`;
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = n => Math.max(0, Math.round(n || 0)).toLocaleString('en-IN');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const canHover = matchMedia('(hover: hover)').matches;
const mk = k => ({ get(key) { try { return window[k].getItem(key); } catch (e) { return null; } }, set(key, v) { try { window[k].setItem(key, v); } catch (e) {} } });
const local = mk('localStorage'), session = mk('sessionStorage');
const frag = html => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
const all = [...C.extensions.map(p => ({ ...p, kind: 'extension' })), ...C.apps.map(p => ({ ...p, kind: 'app' }))];
const ready = all.filter(p => p.ready !== false);
const listed = ready.filter(p => p.dock !== false);   // one entry per product (dock, loader, footer)
const isBold = document.documentElement.classList.contains('theme-bold');
const mailto = (subject, body) => `mailto:${C.brand.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
const openMail = (subject, body) => { window.location.href = mailto(subject, body); };
const today = () => new Date().toISOString().slice(0, 10);
const onAccent = hex => { const h = String(hex || '').replace('#', ''); if (h.length !== 6) return '#fff'; const [r, g, b] = [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16) / 255).map(c => c <= .03928 ? c / 12.92 : Math.pow((c + .055) / 1.055, 2.4)); return (.2126 * r + .7152 * g + .0722 * b) > .32 ? '#14110A' : '#FFFFFF'; };
async function copyText(text) {
  try { await navigator.clipboard.writeText(text); return true; }
  catch (e) {
    const ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(ta); ta.select(); let ok = false; try { ok = document.execCommand('copy'); } catch (_) {} ta.remove(); return ok;
  }
}
function animateNum(el, to) {
  const from = el._v == null ? to : el._v; el._v = to;
  if (reduced || from === to) { el.textContent = fmt(to); return; }
  const t0 = performance.now(), d = 1000;
  const step = now => { const k = Math.min(1, (now - t0) / d), e = 1 - Math.pow(1 - k, 3); el.textContent = fmt(from + (to - from) * e); if (k < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}
let locks = 0;
function lock(on) {
  const h = document.documentElement;
  locks = Math.max(0, locks + (on ? 1 : -1));
  if (locks) { h.style.setProperty('--sbw', (innerWidth - h.clientWidth) + 'px'); h.classList.add('locked'); }
  else h.classList.remove('locked');
}
function trapTab(e, scope) {
  const f = $$('button, [href], input, [tabindex="0"]', scope).filter(el => !el.disabled && !el.hidden && el.offsetParent !== null);
  if (!f.length) return;
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  else if (!scope.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
}

/* ---------------- toasts + confetti ---------------- */
function toast(title, msg = '', { icon = '✨', action = null, duration = 6500 } = {}) {
  const box = $('#toasts');
  const t = frag(`<div class="toast" role="status"><span class="t-ic">${icon}</span><div class="t-msg"><strong>${title}</strong>${msg}${action ? `<br><button class="t-act" type="button">${esc(action.label)}</button>` : ''}</div><button class="t-x" type="button" aria-label="Dismiss">${ic('close')}</button></div>`);
  const kill = () => { if (t._dead) return; t._dead = true; t.classList.add('out'); setTimeout(() => t.remove(), 300); };
  $('.t-x', t).onclick = kill;
  if (action) $('.t-act', t).onclick = () => { kill(); action.run(); };
  box.appendChild(t);
  while (box.children.length > 3) box.firstElementChild.remove();
  let timer = setTimeout(kill, duration);
  t.addEventListener('pointerenter', () => clearTimeout(timer));
  t.addEventListener('pointerleave', () => { timer = setTimeout(kill, 2500); });
}
function confetti() {
  if (reduced) return;
  const cv = document.createElement('canvas'); cv.className = 'confetti'; document.body.appendChild(cv);
  const ctx = cv.getContext('2d'), dpr = Math.min(2, devicePixelRatio || 1);
  const W = cv.width = innerWidth * dpr, H = cv.height = innerHeight * dpr;
  const cols = ['#F0532D', '#2F8CFF', '#F2B000', '#22B985', '#7C5CFA', '#FFFFFF'];
  const ps = Array.from({ length: 150 }, () => ({ x: W / 2 + (Math.random() - .5) * W * .35, y: H * .42, vx: (Math.random() - .5) * 18 * dpr, vy: (-Math.random() * 15 - 6) * dpr, s: (5 + Math.random() * 6) * dpr, r: Math.random() * 6, vr: (Math.random() - .5) * .35, c: cols[Math.random() * cols.length | 0] }));
  let f = 0;
  (function draw() {
    f++; ctx.clearRect(0, 0, W, H);
    ps.forEach(p => { p.vy += .38 * dpr; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.r += p.vr; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c; ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); ctx.restore(); });
    if (f < 200) requestAnimationFrame(draw); else cv.remove();
  })();
}

/* ---------------- loading screen ---------------- */
(function loader() {
  const el = $('#loader'); if (!el) return;
  const icons = $('#ldIcons');
  if (icons) icons.innerHTML = listed.map((p, i) => `<img src="${esc(p.logo)}" alt="" style="--i:${i}" width="44" height="44">`).join('');
  const verbs = ['Warming up', 'Polishing', 'Charging', 'Tuning', 'Waking up', 'Unboxing'];
  const msgs = listed.map((p, i) => `${verbs[i % verbs.length]} ${p.name}`).concat(['Brewing the coffee', 'Almost there']);
  const repeat = session.get('h24_seen');
  if (repeat || reduced) el.classList.add('fast');
  const minMs = reduced ? 300 : repeat ? 900 : (T.loaderMinMs || 2300);
  const bar = $('#ldBar'), pctEl = $('#ldPct'), msgEl = $('#ldMsg');
  const t0 = performance.now(); let pct = 0, isReady = false, mi = 0;
  const msgTimer = msgEl ? setInterval(() => { mi = (mi + 1) % msgs.length; msgEl.innerHTML = `<span>${esc(msgs[mi])}</span>`; }, Math.max(240, minMs / (msgs.length + 1))) : 0;
  const tick = () => {
    const elapsed = performance.now() - t0;
    const target = Math.min(isReady ? 100 : 90, (elapsed / minMs) * 100);
    pct += (target - pct) * .2; if (target === 100 && 100 - pct < .8) pct = 100;
    if (bar) bar.style.transform = `scaleX(${pct / 100})`;
    if (pctEl) pctEl.textContent = Math.round(pct) + '%';
    if (pct >= 100) return finish();
    requestAnimationFrame(tick);
  };
  const finish = () => {
    clearInterval(msgTimer); session.set('h24_seen', '1');
    el.classList.add('done'); document.documentElement.classList.remove('loading');
    document.documentElement.classList.add('ready');
    document.dispatchEvent(new Event('h24:ready'));
    setTimeout(() => el.remove(), 1000);
  };
  const loaded = new Promise(r => document.readyState === 'complete' ? r() : addEventListener('load', r, { once: true }));
  Promise.race([Promise.all([loaded, document.fonts ? document.fonts.ready : 0]), new Promise(r => setTimeout(r, 4000))]).then(() => { isReady = true; });
  requestAnimationFrame(tick);
})();

/* ---------------- detection ---------------- */
function detectOS() {
  const ua = navigator.userAgent, p = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || '';
  if (/android/i.test(ua)) return 'Android';
  if (/iPhone|iPad|iPod/.test(ua) || (/Mac/.test(p) && navigator.maxTouchPoints > 1)) return 'iPhone';
  if (/Win/i.test(p) || /Windows/.test(ua)) return 'Windows';
  if (/Mac/i.test(p)) return 'macOS';
  if (/Linux|CrOS/i.test(p + ua)) return 'Linux';
  return '';
}
const OS = detectOS(), isMobile = OS === 'Android' || OS === 'iPhone';
async function detectBrowser() {
  const ua = navigator.userAgent;
  try { if (navigator.brave && await navigator.brave.isBrave()) return 'brave'; } catch (e) {}
  if (/Edg(A|iOS)?\//.test(ua)) return 'edge';
  if (/OPR\/|Opera|OPT\//.test(ua)) return 'opera';
  if (/Vivaldi/.test(ua)) return 'vivaldi';
  if (/Firefox\/|FxiOS/.test(ua)) return 'firefox';
  if (/Chrome\/|CriOS/.test(ua)) return 'chrome';
  if (/Safari\//.test(ua)) return 'safari';
  return 'chrome';
}
let BROWSER = 'chrome';

/* ---------------- counters (views + downloads + visitors) ---------------- */
const Counter = {
  async call(type, key, keepalive = false) {
    if (!C.counter.enabled || !C.counter.provider) return null;
    const ctl = 'AbortController' in window ? new AbortController() : null;
    const t = setTimeout(() => ctl && ctl.abort(), 6000);
    try {
      const url = `${C.counter.provider.replace(/\/$/, '')}/${type}/${encodeURIComponent(C.counter.namespace)}/${encodeURIComponent(key)}`;
      const r = await fetch(url, { signal: ctl && ctl.signal, cache: 'no-store', keepalive });
      if (r.status === 404) return 0;
      if (!r.ok) return null;
      const j = await r.json();
      return typeof j.value === 'number' ? j.value : null;
    } catch (e) { return null; } finally { clearTimeout(t); }
  },
  hit(k) { return this.call('hit', k, true); },
  get(k) { return this.call('get', k); }
};
const real = { dl: {}, views: {} };
const byId = id => all.find(x => x.id === id) || {};
const val = (kind, id) => (kind === 'dl' ? byId(id).baseDownloads : byId(id).baseViews) + (real[kind][id] || 0);
function paint(id) {
  $$(`[data-dl="${id}"]`).forEach(el => animateNum(el, val('dl', id)));
  $$(`[data-views="${id}"]`).forEach(el => animateNum(el, val('views', id)));
  $$('[data-total-dl]').forEach(el => animateNum(el, ready.reduce((s, p) => s + val('dl', p.id), 0)));
  $$('[data-total-views]').forEach(el => animateNum(el, ready.reduce((s, p) => s + val('views', p.id), 0)));
}
function countDownload(id) {
  const k = 'h24_dl_' + id;
  if (local.get(k)) return;
  local.set(k, '1');
  real.dl[id] = (real.dl[id] || 0) + 1; paint(id);
  Counter.hit('dl-' + id).then(v => { if (v != null) { real.dl[id] = v; paint(id); } });
}
function countView(id) {
  const k = 'h24_view_' + id;
  if (local.get(k) === today()) return;
  local.set(k, today());
  real.views[id] = (real.views[id] || 0) + 1; paint(id);
  Counter.hit('views-' + id).then(v => { if (v != null) { real.views[id] = v; paint(id); } });
}
async function initCounts() {
  ready.forEach(p => paint(p.id));
  ready.forEach(p => {
    Counter.get('dl-' + p.id).then(v => { if (v != null) { real.dl[p.id] = Math.max(v, real.dl[p.id] || 0); paint(p.id); } });
    Counter.get('views-' + p.id).then(v => { if (v != null) { real.views[p.id] = Math.max(v, real.views[p.id] || 0); paint(p.id); } });
  });
  const base = C.counter.baseVisitors || 0, paintV = n => $$('[data-visitors]').forEach(el => animateNum(el, n));
  paintV(base);
  const key = 'h24_visitor_v1';
  let v;
  if (!C.counter.uniquePerBrowser || !local.get(key)) { v = await Counter.hit('visitors'); if (v != null) local.set(key, '1'); }
  else v = await Counter.get('visitors');
  if (v != null) paintV(base + v);
}
function watchViews() {
  if (!('IntersectionObserver' in window)) return;
  const timers = new Map();
  const io = new IntersectionObserver(es => es.forEach(en => {
    const id = en.target.dataset.id;
    if (en.isIntersecting) timers.set(id, setTimeout(() => { countView(id); io.unobserve(en.target); }, (C.counter.viewSecondsVisible || 1.2) * 1000));
    else { clearTimeout(timers.get(id)); timers.delete(id); }
  }), { threshold: .45 });
  $$('.product').forEach(el => io.observe(el));
}

/* ---------------- product rendering ---------------- */
function slidesOf(p) {
  const m = p.media || {}, s = [];
  if (m.video) s.push({ type: 'video', src: m.video, full: m.fullVideo || '', poster: m.poster || '', label: 'Demo video' });
  (m.shots || []).forEach((src, i) => s.push({ type: 'image', src, label: (m.captions && m.captions[i]) || `Screenshot ${i + 1}` }));
  if (!s.length) s.push({ type: 'ph', label: 'Preview' });
  return s;
}
const phHTML = (p, note = 'Preview coming soon') => `<div class="ph" style="--accent:${esc(p.accent)}"><img src="${esc(p.logo)}" alt="" width="72" height="72"><b>${esc(p.name)}</b><small>${esc(note)}</small></div>`;
const blogoSrc = b => (C.browsers[b] && C.browsers[b].logo) || `${C.browserLogoBase}${b}/${b}_64x64.png`;
const blogo = (b, size = 24) => `<img class="blogo" src="${esc(blogoSrc(b))}" alt="" width="${size}" height="${size}" loading="lazy" data-l="${esc((C.browsers[b] || { name: '?' }).name[0])}">`;
function storeFor(p, b) {
  const s = p.stores || {}, B = C.browsers[b];
  if (!B) return null;
  if (s[b]) return { url: s[b], via: B.storeName, native: true };
  if (B.chromium && s.chrome) return { url: s.chrome, via: 'Chrome Web Store', native: b === 'chrome' };
  return null;
}
const worksIn = p => Object.keys(C.browsers).filter(b => storeFor(p, b));
function extCTA(p) {
  const ok = worksIn(p);
  return `<div class="getit">
      <a class="btn primary g-main" href="#" target="_blank" rel="noopener">${blogo('chrome')}<span class="g-label">Add to Chrome</span></a>
      <button class="btn primary g-caret" type="button" aria-haspopup="menu" aria-expanded="false" aria-label="Choose your browser">${ic('down')}</button>
    </div>
    <p class="g-note"></p>
    <div class="works"><span>Works in</span>${ok.map(b => `<span class="works-b" title="${esc(C.browsers[b].name)}">${blogo(b, 20)}</span>`).join('')}</div>`;
}
function menuHTML(p) {
  const row = b => {
    const B = C.browsers[b], s = storeFor(p, b);
    return s
      ? `<a class="b-item" role="menuitem" href="${esc(s.url)}" target="_blank" rel="noopener" data-b="${b}">${blogo(b)}<span class="b-txt"><b>${esc(B.name)}</b><small>${s.native ? esc(s.via) : 'via ' + esc(s.via)}</small></span>${ic('ext', 'b-go')}</a>`
      : `<button class="b-item soon" type="button" role="menuitem" data-b="${b}" data-soon>${blogo(b)}<span class="b-txt"><b>${esc(B.name)}</b><small>Coming soon. Get notified</small></span>${ic('bell', 'b-go')}</button>`;
  };
  const keys = Object.keys(C.browsers), now = keys.filter(b => storeFor(p, b)), soon = keys.filter(b => !storeFor(p, b));
  return `<div class="b-menu" role="menu" aria-label="${esc(p.name)} browser stores" hidden>
      <p class="b-h">Install now</p>${now.map(row).join('')}
      ${soon.length ? `<p class="b-h">Coming soon</p>${soon.map(row).join('')}` : ''}
    </div>`;
}
function appCTA(p) {
  if (p.downloadReady === false) return `<div class="app-cta">
      <button class="btn primary" type="button" data-notify>${ic('bell')}Notify me when the apps launch</button>
      ${p.web ? `<a class="btn ghost" href="${esc(p.web)}" target="_blank" rel="noopener">${ic('globe')}Use it online</a>` : ''}
    </div>
    <p class="g-note">Desktop and mobile apps are almost ready. Use it in your browser today.</p>
    <div class="plats">${(p.platforms || []).map(x => `<span class="plat${x === 'Web' ? ' you' : ' soon'}"${x === 'Web' ? '' : ' title="Coming soon"'}>${esc(x)}</span>`).join('')}</div>`;
  const dlLabel = OS && (p.platforms || []).includes(OS) ? `Download for ${OS}` : 'Download';
  return `<div class="app-cta">
      ${p.download ? `<a class="btn primary" href="${esc(p.download)}" target="_blank" rel="noopener" data-dlclick>${ic('download')}${esc(dlLabel)}</a>` : ''}
      ${p.web ? `<a class="btn ghost" href="${esc(p.web)}" target="_blank" rel="noopener">${ic('globe')}Try it online</a>` : ''}
    </div>
    <div class="plats">${(p.platforms || []).map(x => `<span class="plat${x === OS ? ' you' : ''}">${esc(x)}</span>`).join('')}</div>`;
}
function productHTML(p, idx) {
  const isExt = p.kind === 'extension';
  return `<article class="product${idx % 2 ? ' flip' : ''}" id="p-${esc(p.id)}" data-id="${esc(p.id)}" style="--accent:${esc(p.accent)};--on-accent:${onAccent(p.accent)}" data-reveal>
    <div class="p-media">
      <div class="carousel" tabindex="0" role="region" aria-roledescription="carousel" aria-label="${esc(p.name)} previews">
        <div class="track"></div>
        <button class="c-nav prev" type="button" aria-label="Previous slide">${ic('left')}</button>
        <button class="c-nav next" type="button" aria-label="Next slide">${ic('right')}</button>
        <button class="c-open" type="button">${ic('expand')}<span>Open player</span></button>
        <div class="dots"></div>
        <div class="c-timer"><i></i></div>
      </div>
    </div>
    <div class="p-info">
      <div class="p-head">
        <img class="p-logo" src="${esc(p.logo)}" alt="${esc(p.name)} logo" width="60" height="60">
        <div><h4 class="p-name" data-echo="${esc(p.name)}">${esc(p.name)}</h4><p class="p-tag">${esc(p.tagline)}</p></div>
      </div>
      <div class="p-cta">${isExt ? extCTA(p) : appCTA(p)}</div>
      <div class="p-meta">
        <span class="p-stat" title="Views">${ic('eye')}<b data-views="${esc(p.id)}">${fmt(p.baseViews)}</b> views</span>
        ${p.downloadReady === false ? `<span class="p-stat">${ic('bell')}Apps coming soon</span>` : `<span class="p-stat" title="${isExt ? 'Installs' : 'Downloads'}">${ic('download')}<b data-dl="${esc(p.id)}">${fmt(p.baseDownloads)}</b> ${isExt ? 'installs' : 'downloads'}</span>`}
        <span class="p-links">
          ${p.site ? `<a href="${esc(p.site)}" target="_blank" rel="noopener">${ic('ext')}Website</a>` : ''}
          ${isExt && p.web ? `<a href="${esc(p.web)}" target="_blank" rel="noopener">${ic('globe')}Web app</a>` : ''}
          <a href="#p-${esc(p.id)}" data-share>${ic('share')}Share</a>
        </span>
      </div>
    </div>
    <div class="p-why"><h5>Why you'll want it</h5><p>${esc(p.why)}</p></div>
    <ul class="p-feat">${(p.features || []).map(f => `<li>${ic('check')}<span>${esc(f)}</span></li>`).join('')}</ul>
  </article>`;
}

/* ---------------- extension buttons + browser menu ---------------- */
const menus = [];
function setMain(el, p) {
  const main = $('.g-main', el), note = $('.g-note', el), B = C.browsers[BROWSER] || C.browsers.chrome, s = storeFor(p, BROWSER);
  const old = $('.blogo, .blogo-fb', main); if (old) old.replaceWith(frag(blogo(BROWSER in C.browsers ? BROWSER : 'chrome')));
  const label = $('.g-label', main);
  const names = worksIn(p).map(b => C.browsers[b].name);
  const list = names.length > 1 ? names.slice(0, -1).join(', ') + ' and ' + names[names.length - 1] : names.join('');
  if (isMobile) {
    main.dataset.act = 'share'; main.href = '#'; main.removeAttribute('target');
    label.textContent = 'Send it to my computer';
    note.textContent = 'Browser extensions install on a computer. Send yourself the link, or pick a store from the arrow.';
  } else if (s) {
    main.dataset.act = 'store'; main.href = s.url; main.target = '_blank';
    label.textContent = `Add to ${B.name}`;
    note.textContent = s.native ? `Free on the ${s.via}.` : `Free on the ${s.via}. Works great in ${B.name}.`;
  } else {
    main.dataset.act = 'soon'; main.href = '#'; main.removeAttribute('target');
    label.textContent = `${B.name} version coming soon`;
    note.textContent = `Works today in ${list}. Tap the arrow to pick one.`;
  }
  const menu = el._menu;
  if (menu) $$('.b-item', menu).forEach(it => { const y = $('.you', it); if (y) y.remove(); if (it.dataset.b === BROWSER) $('.b-txt', it).insertAdjacentHTML('beforeend', '<span class="you">Your browser</span>'); });
}
function notifySoon(p, b) {
  const name = (C.browsers[b] || {}).name || 'your browser';
  toast(`${p.name} for ${name} is on the way 🚀`, 'Want a message the day it lands?', {
    icon: '🔔', action: { label: 'Notify me', run: () => openMail(`Notify me: ${p.name} for ${name}`, `Hi H24 Creationz,\n\nPlease let me know when ${p.name} is available for ${name}.\n\nThanks!`) }
  });
}
async function shareProduct(p) {
  const url = location.href.split('#')[0] + '#p-' + p.id;
  if (navigator.share) { try { await navigator.share({ title: p.name, text: `${p.name}: ${p.tagline}`, url }); return; } catch (e) { if (e && e.name === 'AbortError') return; } }
  if (await copyText(url)) toast('Link copied', `Paste it anywhere to share ${esc(p.name)}.`, { icon: '🔗' });
}
function bindCTA(el, p) {
  $('[data-share]', el).addEventListener('click', e => { e.preventDefault(); shareProduct(p); });
  if (p.kind === 'app') {
    const d = $('[data-dlclick]', el); if (d) d.addEventListener('click', () => countDownload(p.id));
    const n = $('[data-notify]', el);
    if (n) n.addEventListener('click', () => toast(`${p.name} apps are almost here 🚀`, 'Get a message the day the desktop and mobile apps go live.', {
      icon: '🔔', action: { label: 'Notify me', run: () => openMail(`Notify me: ${p.name} apps`, `Hi H24 Creationz,\n\nPlease let me know when the ${p.name} desktop and mobile apps are available.\n\nThanks!`) }
    }));
    return;
  }
  const getit = $('.getit', el), main = $('.g-main', el), caret = $('.g-caret', el);
  const menu = frag(menuHTML(p)); document.body.appendChild(menu); el._menu = menu;
  setMain(el, p);
  main.addEventListener('click', e => {
    const act = main.dataset.act;
    if (act === 'store') countDownload(p.id);
    else { e.preventDefault(); act === 'share' ? shareProduct(p) : notifySoon(p, BROWSER); }
  });
  const place = () => {
    const r = getit.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) return toggle(false);
    const w = Math.min(320, innerWidth - 24); menu.style.width = w + 'px';
    menu.style.left = Math.min(Math.max(12, r.left), innerWidth - w - 12) + 'px';
    const below = innerHeight - r.bottom - 16, above = r.top - 16, need = Math.min(menu.scrollHeight, 420);
    if (below >= need || below >= above) { menu.style.top = (r.bottom + 8) + 'px'; menu.style.bottom = 'auto'; menu.style.maxHeight = Math.max(180, below) + 'px'; menu.classList.remove('up'); }
    else { menu.style.top = 'auto'; menu.style.bottom = (innerHeight - r.top + 8) + 'px'; menu.style.maxHeight = Math.max(180, above) + 'px'; menu.classList.add('up'); }
  };
  const onMove = () => { if (!menu.hidden) place(); };
  function toggle(open) {
    if (open === !menu.hidden) return;
    menu.hidden = !open; caret.setAttribute('aria-expanded', String(open));
    if (open) {
      menus.forEach(m => m !== toggle && m(false));
      place(); addEventListener('scroll', onMove, { passive: true }); addEventListener('resize', onMove);
      const f = $('.b-item', menu); if (f) f.focus({ preventScroll: true });
    } else { removeEventListener('scroll', onMove); removeEventListener('resize', onMove); }
  }
  menus.push(toggle);
  caret.addEventListener('click', e => { e.stopPropagation(); toggle(menu.hidden); });
  menu.addEventListener('click', e => {
    const it = e.target.closest('.b-item'); if (!it) return;
    if (it.hasAttribute('data-soon')) { e.preventDefault(); notifySoon(p, it.dataset.b); } else countDownload(p.id);
    toggle(false);
  });
  menu.addEventListener('keydown', e => {
    const items = $$('.b-item', menu), i = items.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') { e.preventDefault(); items[(i + 1) % items.length].focus(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
    else if (e.key === 'Escape') { e.stopPropagation(); toggle(false); caret.focus(); }
    else if (e.key === 'Tab') toggle(false);
  });
  document.addEventListener('click', e => { if (!menu.hidden && !menu.contains(e.target) && !getit.contains(e.target)) toggle(false); });
}

/* ---------------- carousel ---------------- */
const carousels = [];
const carIO = 'IntersectionObserver' in window ? new IntersectionObserver(entries => entries.forEach(en => {
  const c = en.target._car; if (!c) return;
  if (en.isIntersecting) { c.prime(); c.resume('off'); } else { c.pause('off'); c.stopPreview(); }
}), { rootMargin: '120px 0px', threshold: .01 }) : null;

class Carousel {
  constructor(root, p) {
    this.root = root; this.p = p; root._car = this;
    this.slides = slidesOf(p); this.i = 0; this.reasons = new Set(['off']); this.primed = false;
    this.track = $('.track', root); this.dotsEl = $('.dots', root); this.bar = $('.c-timer i', root);
    this.render(); this.bind(); this.go(0);
    if (carIO) carIO.observe(root); else { this.prime(); this.resume('off'); }
  }
  render() {
    const p = this.p, n = this.slides.length;
    this.track.innerHTML = this.slides.map((s, i) => {
      let inner;
      if (s.type === 'video') inner = `<video muted playsinline loop preload="none" data-src="${esc(s.src)}"${s.poster ? ` data-poster="${esc(s.poster)}"` : ''} aria-label="${esc(p.name)} demo video"></video><span class="chip">${ic('play')}Demo</span>`;
      else if (s.type === 'image') inner = `<img class="bg" src="${esc(s.src)}" alt="" aria-hidden="true" loading="lazy" decoding="async"><img class="fg" src="${esc(s.src)}" alt="${esc(p.name)}: ${esc(s.label)}" loading="lazy" decoding="async" draggable="false"><span class="cap">${esc(s.label)}</span>`;
      else inner = phHTML(p);
      return `<div class="slide is-${s.type}" data-i="${i}" role="group" aria-roledescription="slide" aria-label="${i + 1} of ${n}: ${esc(s.label)}">${inner}</div>`;
    }).join('');
    this.dotsEl.innerHTML = n > 1 ? this.slides.map((s, i) => `<button class="dot" type="button" data-i="${i}" aria-label="Show ${esc(s.label)}"></button>`).join('') : '';
    this.root.classList.toggle('single', n < 2);
    this.els = $$('.slide', this.track);
  }
  bind() {
    const r = this.root;
    $('.prev', r).addEventListener('click', e => { e.stopPropagation(); this.go(this.i - 1); });
    $('.next', r).addEventListener('click', e => { e.stopPropagation(); this.go(this.i + 1); });
    $('.c-open', r).addEventListener('click', e => { e.stopPropagation(); this.open(); });
    this.dotsEl.addEventListener('click', e => { const d = e.target.closest('.dot'); if (d) { e.stopPropagation(); this.go(+d.dataset.i); } });
    r.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') { this.pause('hover'); this.preview(); } });
    r.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') { this.stopPreview(); this.resume('hover'); } });
    r.addEventListener('touchstart', e => {
      const t = e.touches[0]; this.tx = t.clientX; this.ty = t.clientY; this.swiped = false;
      this.wasRevealed = r.classList.contains('touched'); this.lastTouch = Date.now();
      clearTimeout(this.resumeT); r.classList.add('touched'); this.pause('touch'); this.preview();
    }, { passive: true });
    r.addEventListener('touchmove', e => {
      const t = e.touches[0], dx = t.clientX - this.tx, dy = t.clientY - this.ty;
      if (!this.swiped && Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) { this.swiped = true; this.go(this.i + (dx < 0 ? 1 : -1)); }
    }, { passive: true });
    const end = () => { clearTimeout(this.resumeT); this.resumeT = setTimeout(() => { r.classList.remove('touched'); this.stopPreview(); this.resume('touch'); }, T.touchResumeDelay); };
    r.addEventListener('touchend', end, { passive: true });
    r.addEventListener('touchcancel', end, { passive: true });
    this.track.addEventListener('click', () => {
      if (Date.now() - (this.lastTouch || 0) < 900 && (this.swiped || !this.wasRevealed)) return;
      this.open();
    });
    r.addEventListener('keydown', e => {
      if (e.target !== r) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); this.go(this.i + 1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); this.go(this.i - 1); }
      else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.open(); }
    });
    r.addEventListener('focusin', e => { if (e.target.matches(':focus-visible')) this.pause('focus'); });
    r.addEventListener('focusout', e => { if (!r.contains(e.relatedTarget)) this.resume('focus'); });
  }
  go(n) {
    const len = this.slides.length; this.i = ((n % len) + len) % len;
    this.track.style.transform = `translate3d(${-this.i * 100}%,0,0)`;
    this.els.forEach((el, k) => {
      el.setAttribute('aria-hidden', k === this.i ? 'false' : 'true');
      if (k !== this.i) { const v = $('video', el); if (v && !v.paused) v.pause(); }
    });
    $$('.dot', this.dotsEl).forEach((d, k) => d.classList.toggle('on', k === this.i));
    const nx = this.els[(this.i + 1) % len]; if (nx) $$('img', nx).forEach(im => { im.loading = 'eager'; });
    if (this.reasons.has('hover') || this.reasons.has('touch')) this.preview();
    this.schedule();
  }
  schedule() {
    clearTimeout(this.timer);
    const auto = this.slides.length > 1 && !this.reasons.size && !reduced;
    this.root.classList.toggle('paused', !auto);
    this.bar.style.animation = 'none';
    if (!auto) return;
    const d = this.slides[this.i].type === 'video' ? T.videoSlideInterval : T.slideInterval;
    void this.bar.offsetWidth;
    this.bar.style.animation = `h24fill ${d}ms linear forwards`;
    this.timer = setTimeout(() => this.go(this.i + 1), d);
  }
  pause(r) { this.reasons.add(r); this.schedule(); }
  resume(r) { if (this.reasons.delete(r)) this.schedule(); }
  loadVideo(v) { if (!v.getAttribute('src') && v.dataset.src) { v.preload = 'auto'; v.src = v.dataset.src; } }
  prime() {
    if (this.primed) return; this.primed = true;
    this.els.forEach(el => {
      const v = $('video', el); if (!v) return;
      const firstFrame = () => { if (!v.getAttribute('src')) { v.preload = 'metadata'; v.src = v.dataset.src + '#t=0.1'; } };
      if (v.dataset.poster) { const im = new Image(); im.onload = () => { v.poster = v.dataset.poster; }; im.onerror = firstFrame; im.src = v.dataset.poster; }
      else firstFrame();
    });
  }
  preview() {
    const el = this.els[this.i], v = el && $('video', el); if (!v) return;
    this.loadVideo(v); v.muted = true; const pr = v.play(); if (pr) pr.catch(() => {});
  }
  stopPreview() { this.els.forEach(el => { const v = $('video', el); if (v && !v.paused) v.pause(); }); }
  fail(i) {
    const s = this.slides[i]; if (!s || s.type === 'ph') return;
    s.type = 'ph'; const el = this.els[i];
    el.className = 'slide is-ph'; el.innerHTML = phHTML(this.p, s.label === 'Demo video' ? 'Demo video coming soon' : 'Screenshot coming soon');
    if (i === this.i) this.schedule();
    Viewer.refresh(this, i);
  }
  open() { countView(this.p.id); Viewer.open(this, this.i); }
}

/* missing files never break the layout */
document.addEventListener('error', e => {
  const t = e.target; if (!(t instanceof Element)) return;
  if (t.matches('img.blogo')) { const s = document.createElement('span'); s.className = 'blogo-fb'; s.textContent = t.dataset.l || '?'; t.replaceWith(s); }
  else if (t.matches('.slide img.fg, .slide video')) { const sl = t.closest('.slide'), car = sl && sl.closest('.carousel'); if (car && car._car) car._car.fail(+sl.dataset.i); }
  else if (t.matches('.slide img.bg')) t.remove();
}, true);

/* ---------------- media viewer ---------------- */
const Viewer = (() => {
  const root = $('#viewer'), box = $('#vBox'), stage = $('#vStage'), v = $('#vVideo'), img = $('#vImg'), ph = $('#vPh');
  const els = { title: $('#vTitle'), count: $('#vCount'), logo: $('#vLogo'), prev: $('#vPrev'), next: $('#vNext'), big: $('#vBig'), play: $('#vPlay'), back: $('#vBack'), fwd: $('#vFwd'),
    mute: $('#vMute'), vol: $('#vVol'), cur: $('#vCur'), dur: $('#vDur'), speed: $('#vSpeed'), pip: $('#vPip'), fs: $('#vFs'), fsTop: $('#vFsTop'),
    seek: $('#vSeek'), buf: $('#vBuf'), played: $('#vPlayed'), thumb: $('#vThumb'), tip: $('#vTip'), spin: $('#vSpin'), flash: $('#vFlash'), show: $('#vShow'), zoom: $('#vZoom') };
  let car = null, slides = [], i = 0, lastFocus = null, hideT = null, showT = null, showing = false, pseudo = false, zoomed = false, lastPointer = 'mouse', clickT = null, swipedAt = 0, dragging = false;
  const prefs = (() => { try { return Object.assign({ muted: false, volume: 1 }, JSON.parse(local.get('h24_player') || '{}')); } catch (e) { return { muted: false, volume: 1 }; } })();
  const savePrefs = () => local.set('h24_player', JSON.stringify({ muted: v.muted, volume: v.volume }));
  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
  const isVid = () => slides[i] && slides[i].type === 'video';
  const fsEl = () => document.fullscreenElement || document.webkitFullscreenElement;
  const isFs = () => !!fsEl() || pseudo;
  const fmtTime = s => { if (!isFinite(s)) return '0:00'; s = Math.max(0, Math.floor(s)); const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), sec = String(s % 60).padStart(2, '0'); return h ? `${h}:${String(m).padStart(2, '0')}:${sec}` : `${m}:${sec}`; };
  const setIcon = (btn, name) => { const u = $('use', btn); if (u) u.setAttribute('href', '#i-' + name); };
  if (document.pictureInPictureEnabled) els.pip.hidden = false;

  function open(c, idx) {
    car = c; slides = c.slides; lastFocus = document.activeElement;
    c.pause('viewer'); c.stopPreview();
    box.style.setProperty('--accent', c.p.accent); box.style.setProperty('--on-accent', onAccent(c.p.accent));
    if (els.logo) els.logo.src = c.p.logo;
    root.hidden = false; lock(true);
    requestAnimationFrame(() => root.classList.add('open'));
    show(idx);
    $('#vClose').focus({ preventScroll: true });
  }
  function close() {
    if (root.hidden) return;
    exitFs(); stopShow(); v.pause();
    if (document.pictureInPictureElement === v) document.exitPictureInPicture().catch(() => {});
    root.classList.remove('open'); lock(false);
    setTimeout(() => { if (root.classList.contains('open')) return; root.hidden = true; v.removeAttribute('src'); v.dataset.cur = ''; v.load(); img.removeAttribute('src'); }, 260);
    if (car) { car.go(i); car.resume('viewer'); }
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    car = null;
  }
  function show(idx) {
    const n = slides.length; i = ((idx % n) + n) % n;
    const s = slides[i];
    v.pause(); setZoom(false); els.spin.hidden = true;
    box.dataset.type = s.type;
    els.title.textContent = car.p.name;
    els.count.textContent = n > 1 ? `${s.label} (${i + 1} of ${n})` : s.label;
    els.prev.hidden = els.next.hidden = n < 2;
    els.zoom.hidden = s.type !== 'image';
    els.show.hidden = !(n > 1 && slides.some(x => x.type === 'image'));
    if (s.type === 'video') {
      img.hidden = true; ph.hidden = true; v.hidden = false;
      const src = s.full || s.src;
      if (v.dataset.cur !== src) { v.src = src; v.dataset.cur = src; }
      if (s.poster) v.poster = s.poster; else v.removeAttribute('poster');
      v.muted = prefs.muted; v.volume = prefs.volume; v.playbackRate = 1; els.speed.textContent = '1x';
      const pr = v.play(); if (pr) pr.catch(() => { v.muted = true; v.play().catch(() => {}); });
    } else if (s.type === 'image') {
      v.hidden = true; ph.hidden = true; img.hidden = false;
      img.src = s.src; img.alt = `${car.p.name}: ${s.label}`;
    } else {
      v.hidden = true; img.hidden = true; ph.hidden = false; ph.innerHTML = phHTML(car.p, s.label === 'Demo video' ? 'Demo video coming soon' : 'Screenshot coming soon');
    }
    syncPlay(); paintProgress(); showControls(); runShow();
  }
  function refresh(c, idx) { if (car === c && idx === i && !root.hidden) show(i); }
  const go = d => show(i + d);

  function togglePlay(flashIt) { if (!isVid()) return; if (v.paused || v.ended) { v.play().catch(() => {}); if (flashIt) flash('play'); } else { v.pause(); if (flashIt) flash('pause'); } }
  function seekBy(sec) { if (!isFinite(v.duration)) return; v.currentTime = Math.min(v.duration, Math.max(0, v.currentTime + sec)); flash(sec < 0 ? 'back10' : 'fwd10'); }
  function setVol(x) { v.volume = Math.min(1, Math.max(0, x)); v.muted = v.volume === 0; savePrefs(); flash(v.muted ? 'mute' : 'vol'); }
  function toggleMute() { v.muted = !v.muted; if (!v.muted && v.volume === 0) v.volume = .6; savePrefs(); flash(v.muted ? 'mute' : 'vol'); }
  function flash(name) { els.flash.innerHTML = ic(name); els.flash.classList.remove('go'); void els.flash.offsetWidth; els.flash.classList.add('go'); }
  function syncPlay() {
    const playing = isVid() && !v.paused && !v.ended;
    box.classList.toggle('playing', playing);
    setIcon(els.play, playing ? 'pause' : 'play');
    els.play.setAttribute('aria-label', playing ? 'Pause (K)' : 'Play (K)');
    els.big.setAttribute('aria-label', playing ? 'Pause' : 'Play');
  }
  function syncVol() { setIcon(els.mute, v.muted || v.volume === 0 ? 'mute' : 'vol'); els.mute.setAttribute('aria-label', v.muted ? 'Unmute (M)' : 'Mute (M)'); els.vol.value = v.muted ? 0 : v.volume; prefs.muted = v.muted; prefs.volume = v.volume; }
  function paintProgress() {
    const d = v.duration, p = isFinite(d) && d > 0 ? v.currentTime / d : 0;
    els.played.style.width = p * 100 + '%'; els.thumb.style.left = p * 100 + '%';
    els.cur.textContent = fmtTime(v.currentTime); els.dur.textContent = fmtTime(d);
    els.seek.setAttribute('aria-valuenow', Math.round(p * 100)); els.seek.setAttribute('aria-valuetext', `${fmtTime(v.currentTime)} of ${fmtTime(d)}`);
    if (v.buffered && v.buffered.length && isFinite(d)) els.buf.style.width = (v.buffered.end(v.buffered.length - 1) / d) * 100 + '%'; else els.buf.style.width = '0';
  }
  v.addEventListener('play', syncPlay); v.addEventListener('pause', () => { syncPlay(); showControls(); });
  v.addEventListener('ended', () => { syncPlay(); showControls(); if (showing) go(1); });
  ['timeupdate', 'progress', 'loadedmetadata', 'durationchange'].forEach(ev => v.addEventListener(ev, paintProgress));
  v.addEventListener('waiting', () => { els.spin.hidden = false; });
  ['playing', 'canplay', 'pause'].forEach(ev => v.addEventListener(ev, () => { els.spin.hidden = true; }));
  v.addEventListener('volumechange', syncVol);
  v.addEventListener('error', () => { if (!root.hidden && v.getAttribute('src') && car && isVid()) car.fail(i); });
  img.addEventListener('error', () => { if (!root.hidden && img.getAttribute('src') && car && slides[i].type === 'image') car.fail(i); });

  const ratioAt = e => { const r = els.seek.getBoundingClientRect(); return Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)); };
  const tipAt = x => { els.tip.style.left = Math.min(96, Math.max(4, x * 100)) + '%'; els.tip.textContent = fmtTime(isFinite(v.duration) ? x * v.duration : 0); };
  const scrub = e => { const x = ratioAt(e); if (isFinite(v.duration)) v.currentTime = x * v.duration; tipAt(x); paintProgress(); showControls(); };
  els.seek.addEventListener('pointerdown', e => { dragging = true; els.seek.setPointerCapture(e.pointerId); els.seek.classList.add('drag'); scrub(e); });
  els.seek.addEventListener('pointermove', e => { tipAt(ratioAt(e)); if (dragging) scrub(e); });
  const stopDrag = e => { if (!dragging) return; dragging = false; els.seek.classList.remove('drag'); try { els.seek.releasePointerCapture(e.pointerId); } catch (_) {} };
  els.seek.addEventListener('pointerup', stopDrag); els.seek.addEventListener('pointercancel', stopDrag);

  els.big.addEventListener('click', e => { e.stopPropagation(); togglePlay(false); });
  els.play.addEventListener('click', () => togglePlay(false));
  els.back.addEventListener('click', () => seekBy(-10));
  els.fwd.addEventListener('click', () => seekBy(10));
  els.mute.addEventListener('click', toggleMute);
  els.vol.addEventListener('input', () => { v.volume = +els.vol.value; v.muted = v.volume === 0; savePrefs(); });
  els.speed.addEventListener('click', () => { const k = (speeds.indexOf(v.playbackRate) + 1) % speeds.length; v.playbackRate = speeds[k]; els.speed.textContent = speeds[k] + 'x'; });
  els.pip.addEventListener('click', async () => { try { if (document.pictureInPictureElement) await document.exitPictureInPicture(); else if (isVid()) await v.requestPictureInPicture(); } catch (e) {} });
  els.fs.addEventListener('click', toggleFs); els.fsTop.addEventListener('click', toggleFs);
  els.prev.addEventListener('click', e => { e.stopPropagation(); go(-1); });
  els.next.addEventListener('click', e => { e.stopPropagation(); go(1); });
  els.zoom.addEventListener('click', () => setZoom(!zoomed));
  els.show.addEventListener('click', () => { if (showing) stopShow(); else { showing = true; setIcon(els.show, 'pause'); els.show.setAttribute('aria-label', 'Pause slideshow'); runShow(); } });
  $$('[data-vclose]', root).forEach(b => b.addEventListener('click', close));

  function runShow() { clearTimeout(showT); if (!showing || isVid()) return; showT = setTimeout(() => go(1), T.slideInterval); }
  function stopShow() { showing = false; clearTimeout(showT); setIcon(els.show, 'play'); els.show.setAttribute('aria-label', 'Play slideshow'); }
  function setZoom(on, e) {
    zoomed = !!on && slides[i] && slides[i].type === 'image';
    stage.classList.toggle('zoomed', zoomed);
    if (zoomed && e) originAt(e); else if (!zoomed) img.style.transformOrigin = '50% 50%';
  }
  function originAt(e) { const r = stage.getBoundingClientRect(); img.style.transformOrigin = `${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`; }
  stage.addEventListener('mousemove', e => { if (zoomed) originAt(e); });

  function enterFs() {
    if (box.requestFullscreen) box.requestFullscreen({ navigationUI: 'hide' }).catch(() => setPseudo(true));
    else if (box.webkitRequestFullscreen) box.webkitRequestFullscreen();
    else if (isVid() && v.webkitEnterFullscreen) v.webkitEnterFullscreen();
    else setPseudo(true);
  }
  function exitFs() {
    if (fsEl()) { const f = document.exitFullscreen || document.webkitExitFullscreen; if (f) { const r = f.call(document); if (r && r.catch) r.catch(() => {}); } }
    if (pseudo) setPseudo(false);
  }
  function toggleFs() { if (isFs()) exitFs(); else enterFs(); showControls(); }
  function setPseudo(on) { pseudo = on; root.classList.toggle('pseudo', on); syncFs(); }
  function syncFs() {
    const on = isFs(); box.classList.toggle('is-fs', on);
    [els.fs, els.fsTop].forEach(b => { setIcon(b, on ? 'fs-exit' : 'fs-enter'); b.setAttribute('aria-label', on ? 'Exit full screen (Esc)' : 'Full screen (F)'); b.title = on ? 'Exit full screen (Esc)' : 'Full screen (F)'; });
  }
  document.addEventListener('fullscreenchange', syncFs); document.addEventListener('webkitfullscreenchange', syncFs);

  function showControls() {
    box.classList.remove('idle'); clearTimeout(hideT);
    if (isVid() && !v.paused && !dragging) hideT = setTimeout(() => box.classList.add('idle'), 2600);
  }
  box.addEventListener('mousemove', showControls);
  box.addEventListener('mouseleave', () => { if (isVid() && !v.paused) box.classList.add('idle'); });

  stage.addEventListener('pointerdown', e => { lastPointer = e.pointerType; });
  stage.addEventListener('click', e => {
    if (e.target.closest('button, .v-controls')) return;
    if (Date.now() - swipedAt < 400) return;
    if (clickT) { clearTimeout(clickT); clickT = null; return doubleAct(e); }
    clickT = setTimeout(() => { clickT = null; singleAct(); }, 240);
  });
  function singleAct() {
    if (lastPointer === 'touch' && box.classList.contains('idle')) return showControls();
    if (isVid()) togglePlay(true);
    showControls();
  }
  function doubleAct(e) {
    if (isVid()) {
      if (lastPointer === 'touch') { const r = stage.getBoundingClientRect(); seekBy(e.clientX - r.left < r.width / 2 ? -10 : 10); }
      else toggleFs();
    } else if (slides[i].type === 'image') setZoom(!zoomed, e);
  }
  let sx = 0, sy = 0;
  stage.addEventListener('touchstart', e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  stage.addEventListener('touchmove', e => { if (zoomed) originAt(e.touches[0]); }, { passive: true });
  stage.addEventListener('touchend', e => {
    if (zoomed || slides.length < 2) return;
    const t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.3 && !e.target.closest('.v-controls')) { swipedAt = Date.now(); go(dx < 0 ? 1 : -1); }
  }, { passive: true });

  document.addEventListener('keydown', e => {
    if (root.hidden) return;
    const k = e.key, vid = isVid();
    if (k === 'Escape') { e.preventDefault(); if (pseudo) setPseudo(false); else if (fsEl()) exitFs(); else close(); return; }
    if (k === 'Tab') return trapTab(e, box);
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.target.type === 'range' && k.startsWith('Arrow')) return;
    if ((k === ' ' || k === 'Enter') && e.target.closest('button')) return;
    let done = true;
    switch (k) {
      case ' ': case 'k': case 'K': if (vid) togglePlay(true); else done = false; break;
      case 'ArrowLeft': if (vid && !e.shiftKey) seekBy(-5); else go(-1); break;
      case 'ArrowRight': if (vid && !e.shiftKey) seekBy(5); else go(1); break;
      case 'j': case 'J': if (vid) seekBy(-10); else go(-1); break;
      case 'l': case 'L': if (vid) seekBy(10); else go(1); break;
      case 'PageUp': case ',': go(-1); break;
      case 'PageDown': case '.': go(1); break;
      case 'ArrowUp': if (vid) setVol(v.volume + .1); else done = false; break;
      case 'ArrowDown': if (vid) setVol(v.volume - .1); else done = false; break;
      case 'm': case 'M': if (vid) toggleMute(); else done = false; break;
      case 'f': case 'F': toggleFs(); break;
      case 'z': case 'Z': if (slides[i].type === 'image') setZoom(!zoomed); else done = false; break;
      case 'Home': if (vid) v.currentTime = 0; else go(-i); break;
      case 'End': if (vid && isFinite(v.duration)) v.currentTime = v.duration - .1; else go(slides.length - 1 - i); break;
      default:
        if (vid && /^[0-9]$/.test(k) && isFinite(v.duration)) v.currentTime = v.duration * (+k / 10);
        else done = false;
    }
    if (done) { e.preventDefault(); showControls(); }
  });
  return { open, close, refresh, isOpen: () => !root.hidden };
})();

/* ---------------- coffee ---------------- */
const Coffee = (() => {
  const root = $('#coffee'), card = $('.sheet-card', root), qrBox = $('#cfQr'), cfg = C.coffee, btn = $('#coffeeBtn');
  let opened = 0, amount = cfg.defaultAmount, upi = cfg.upiIds[0], engaged = false, lastFocus = null, qrLib = null;
  if (local.get('h24_coffee_love')) btn.classList.add('loved');
  const upiLink = () => `upi://pay?pa=${upi}&pn=${encodeURIComponent(cfg.payeeName)}${amount ? `&am=${amount}` : ''}&cu=INR&tn=${encodeURIComponent(cfg.note)}`;

  const ids = $('#cfIds');
  ids.innerHTML = cfg.upiIds.map((id, k) => `<button class="upi-opt" type="button" role="radio" aria-checked="${k === 0}" data-upi="${esc(id)}"><code>${esc(id)}</code></button>`).join('');
  ids.addEventListener('click', e => { const b = e.target.closest('.upi-opt'); if (!b) return; upi = b.dataset.upi; $$('.upi-opt', ids).forEach(x => x.setAttribute('aria-checked', String(x === b))); renderQR(); });
  const amts = $('#cfAmounts');
  amts.innerHTML = cfg.amounts.map(a => `<button class="amt" type="button" role="radio" data-amt="${a.amt}" aria-checked="${a.amt === amount}"><b>₹${a.amt}</b><small>${esc(a.label)}</small></button>`).join('')
    + `<button class="amt" type="button" role="radio" data-amt="0" aria-checked="false"><b>Any</b><small>you choose</small></button>`;
  amts.addEventListener('click', e => { const b = e.target.closest('.amt'); if (!b) return; amount = +b.dataset.amt; $$('.amt', amts).forEach(x => x.setAttribute('aria-checked', String(x === b))); renderQR(); });

  function loadQRLib() {
    if (window.QRCode) return Promise.resolve();
    if (!qrLib) qrLib = new Promise((res, rej) => { const s = document.createElement('script'); s.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js'; s.onload = res; s.onerror = rej; document.head.appendChild(s); });
    return qrLib;
  }
  function renderQR() {
    const pay = $('#cfPay'); pay.href = upiLink(); pay.hidden = !isMobile;
    loadQRLib().then(() => {
      qrBox.innerHTML = '';
      new window.QRCode(qrBox, { text: upiLink(), width: 200, height: 200, colorDark: '#111318', colorLight: '#FFFFFF', correctLevel: window.QRCode.CorrectLevel.M });
      const im = $('img', qrBox); if (im) im.alt = `UPI QR code for ${upi}`;
    }).catch(() => {
      const im = new Image(); im.width = im.height = 200; im.alt = `UPI QR code for ${upi}`;
      im.onerror = () => { qrBox.innerHTML = '<p>The QR code could not load. Use a UPI ID below in any UPI app.</p>'; };
      im.src = 'https://api.qrserver.com/v1/create-qr-code/?size=400x400&margin=0&data=' + encodeURIComponent(upiLink());
      qrBox.innerHTML = ''; qrBox.appendChild(im);
    });
  }
  function open() {
    if (!root.hidden) return;
    opened = performance.now(); engaged = false; lastFocus = document.activeElement;
    const n = $('.nudge'); if (n) n.remove();
    session.set('h24_nudged', '1');
    root.hidden = false; lock(true); renderQR();
    requestAnimationFrame(() => root.classList.add('open'));
    $('.sheet-x', root).focus({ preventScroll: true });
  }
  function close() {
    if (root.hidden) return;
    const secs = (performance.now() - opened) / 1000;
    root.classList.remove('open'); lock(false);
    setTimeout(() => { if (!root.classList.contains('open')) root.hidden = true; }, 320);
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    react(secs);
  }
  const pick = a => a[Math.random() * a.length | 0];
  function react(secs) {
    const s = Math.max(1, Math.round(secs));
    if (secs >= cfg.thankYouSeconds || (engaged && secs >= 10)) {
      const m = pick([
        ['Thank you, truly 🧡', 'If you just bought me a coffee, you made my whole day. Every rupee goes straight into building more free tools, and I am so excited to show you what comes next.<br><em>Harsha, H24 Creationz</em>'],
        ['You are the reason this keeps going 🙏', 'From the bottom of my heart, thank you. Your support turns late-night ideas into tools everyone can use. Bigger things are coming, and you will be the first to know.<br><em>Harsha, H24 Creationz</em>']
      ]);
      local.set('h24_coffee_love', '1'); btn.classList.add('loved');
      confetti();
      toast(m[0], m[1], { icon: '☕', duration: 11000, action: { label: 'Get updates', run: Insiders.join } });
    } else if (secs < cfg.fastCloseSeconds) {
      const m = pick([
        [`Closed in ${s} second${s > 1 ? 's' : ''}? 👀`, 'I saw that. The QR code did not even get a chance to say hi. Everything here is free and open source, and one ₹49 chai genuinely keeps it alive.'],
        ['Speedrun complete 🏃💨', `${s}s. A new record! No hard feelings, but these tools have probably saved you more than a coffee's worth of time already 😉`],
        ['Ah, the classic "I\'ll pay later" 😄', 'Totally fine. The coffee machine up there will keep brewing for you. Every few seconds. Forever.'],
        ['That QR was this close 🥲', 'No ads, no paywalls, no subscriptions. Just one developer solving real problems for free. A coffee says "keep going".']
      ]);
      toast(m[0], m[1], { icon: '😏', duration: 9000, action: { label: 'Okay, one coffee ☕', run: open } });
    } else {
      const m = pick([
        ['Thinking it over? ☕', 'Totally fair. The coffee stays warm. Come back whenever one of these tools saves your day.'],
        ['Almost had it! 😄', 'If you were halfway through scanning, the QR is right where you left it.']
      ]);
      toast(m[0], m[1], { icon: '🤔', duration: 8000, action: { label: 'Take me back', run: open } });
    }
  }
  $('#cfCopy').addEventListener('click', async e => {
    engaged = true;
    const b = e.currentTarget;
    if (await copyText(upi)) { b.innerHTML = `${ic('check')}Copied`; setTimeout(() => { b.innerHTML = `${ic('copy')}Copy ID`; }, 1800); }
  });
  $('#cfPay').addEventListener('click', () => { engaged = true; });
  $$('[data-cfclose]', root).forEach(b => b.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (root.hidden) return; if (e.key === 'Escape') { e.preventDefault(); close(); } else if (e.key === 'Tab') trapTab(e, card); });
  btn.addEventListener('click', open);
  $$('[data-coffee]').forEach(b => b.addEventListener('click', open));
  document.addEventListener('h24:ready', () => {
    if (session.get('h24_nudged') || local.get('h24_coffee_love')) return;
    setTimeout(() => {
      if (session.get('h24_nudged') || Viewer.isOpen() || !root.hidden) return;
      session.set('h24_nudged', '1');
      const n = frag(`<div class="nudge" role="note"><span>Everything here is free. This site runs on coffee ☕</span><button type="button" aria-label="Dismiss">${ic('close')}</button></div>`);
      n.addEventListener('click', e => { if (e.target.closest('button')) { n.remove(); return; } open(); });
      document.body.appendChild(n);
      setTimeout(() => n.remove(), 9000);
    }, (cfg.nudgeAfterSeconds || 40) * 1000);
  });
  return { open };
})();

/* ---------------- insiders (email) ---------------- */
const Insiders = {
  join() {
    openMail('Count me in! Add me to the H24 insiders 🚀',
      `Hi H24 Creationz,\n\nI'd love to be first in line for new apps, extensions and updates. Please add me to the insiders list!\n\nThe tool I'm most excited about: \nSomething I wish existed: \n\nCheers,\n`);
    setTimeout(() => toast('Your email app should be open ✉️', `Just hit send and you're in. No mail app? Write to <strong style="display:inline;font:inherit;color:inherit">${esc(C.brand.email)}</strong>.`, { icon: '🎉' }), 600);
  }
};

/* ---------------- page wiring ---------------- */
function renderProducts() {
  const ext = ready.filter(p => p.kind === 'extension'), apps = ready.filter(p => p.kind === 'app');
  $('#extList').innerHTML = ext.map(productHTML).join('');
  $('#appList').innerHTML = apps.map(productHTML).join('');
  if (!ext.length) $('#extensions').hidden = true;
  if (!apps.length) $('#apps').hidden = true;
  ready.forEach(p => { const el = $('#p-' + p.id); carousels.push(new Carousel($('.carousel', el), p)); bindCTA(el, p); });
  $$('[data-ready-count]').forEach(el => { el.textContent = listed.length; });
  const fp = $('#footProducts'); if (fp) fp.innerHTML = listed.map(p => `<li><a href="#p-${esc(p.id)}">${esc(p.name)}</a></li>`).join('');
  const cooking = all.filter(p => p.ready === false), ck = $('#cooking');
  if (ck) ck.innerHTML = cooking.map(p => `<span><i></i>${esc(p.name)} is cooking</span>`).join('');
}
function setTab(f) {
  $$('.tab').forEach(t => t.setAttribute('aria-selected', String(t.dataset.f === f)));
  $('#extensions').hidden = f === 'app' || !ready.some(p => p.kind === 'extension');
  $('#apps').hidden = f === 'extension' || !ready.some(p => p.kind === 'app');
}
function initDock() {
  const d = $('#dock'); if (!d) return;
  d.innerHTML = listed.map((p, k) => `<a class="dock-item" href="#p-${esc(p.id)}" style="--i:${k};--accent:${esc(p.accent)}" aria-label="${esc(p.name)}"><img src="${esc(p.logo)}" alt="" width="64" height="64"><span class="dock-tip">${esc(p.name)}</span></a>`).join('');
  if (!canHover || reduced) return;
  const items = $$('.dock-item', d);
  d.addEventListener('mousemove', e => items.forEach(it => {
    const r = it.getBoundingClientRect(), dist = Math.abs(e.clientX - (r.left + r.width / 2));
    it.style.setProperty('--s', (1 + Math.max(0, 1 - dist / 150) * .42).toFixed(3));
  }));
  d.addEventListener('mouseleave', () => items.forEach(it => it.style.setProperty('--s', 1)));
}
function initRotator() {
  const el = $('#rot'); if (!el || !ready.length) return;
  const icon = $('#rotIcon'); let k = 0;
  const set = p => { el.textContent = p.name; el.dataset.echo = p.name; el.style.setProperty('--accent', p.accent); el.href = '#p-' + p.id; if (icon) icon.src = p.logo; };
  set(listed[0]);
  if (reduced || listed.length < 2) return;
  setInterval(() => {
    if (document.hidden) return;
    k = (k + 1) % listed.length; el.parentNode.classList.add('swap');
    setTimeout(() => { set(listed[k]); el.parentNode.classList.remove('swap'); }, 320);
  }, 2800);
}
function initTerminal() {
  const body = $('#termBody'); if (!body) return;
  const lines = [['$', 'cd h24-lab'], ['$', 'ls experiments/'], ['>', 'apps in progress, half-tested, wildly fun'], ['$', 'status --honest'], ['>', 'might break. might blow your mind. probably both.'], ['$', 'open --you-first']];
  const draw = () => {
    if (reduced) { body.innerHTML = lines.map(([p, t]) => p === '$' ? `<span class="pr">$</span> ${esc(t)}` : `<span class="out">  ${esc(t)}</span>`).join('\n') + '\n<span class="pr">$</span> <span class="cursor"></span>'; return; }
    let li = 0, ci = 0, out = '';
    const tick = () => {
      if (li >= lines.length) { body.innerHTML = out + '<span class="pr">$</span> <span class="cursor"></span>'; return; }
      const [p, t] = lines[li];
      if (p === '>') { out += `<span class="out">  ${esc(t)}</span>\n`; li++; body.innerHTML = out + '<span class="cursor"></span>'; return setTimeout(tick, 380); }
      ci++;
      body.innerHTML = out + `<span class="pr">$</span> ${esc(t.slice(0, ci))}<span class="cursor"></span>`;
      if (ci >= t.length) { out += `<span class="pr">$</span> ${esc(t)}\n`; li++; ci = 0; return setTimeout(tick, 420); }
      setTimeout(tick, 38 + Math.random() * 50);
    };
    tick();
  };
  if ('IntersectionObserver' in window) { const io = new IntersectionObserver(es => { if (es[0].isIntersecting) { io.disconnect(); draw(); } }, { threshold: .3 }); io.observe(body); }
  else draw();
}
function initReveal() {
  const items = $$('[data-reveal]');
  if (!('IntersectionObserver' in window) || reduced) { items.forEach(el => el.classList.add('in')); return; }
  const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -6% 0px', threshold: .05 });
  items.forEach(el => io.observe(el));
}
function initChrome() {
  const top = $('#top'); let raf = 0;
  const onScroll = () => { raf = 0; top.classList.toggle('scrolled', scrollY > 10); };
  addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(onScroll); }, { passive: true }); onScroll();
  const nav = $('#nav'), mb = $('#menuBtn');
  mb.addEventListener('click', e => { e.stopPropagation(); const o = !nav.classList.contains('open'); nav.classList.toggle('open', o); mb.setAttribute('aria-expanded', String(o)); });
  document.addEventListener('click', e => { if (nav.classList.contains('open') && !nav.contains(e.target)) { nav.classList.remove('open'); mb.setAttribute('aria-expanded', 'false'); } });
  $$('a', nav).forEach(a => a.addEventListener('click', () => { if (a.dataset.tab) setTab(a.dataset.tab); nav.classList.remove('open'); mb.setAttribute('aria-expanded', 'false'); }));
  $$('.tab').forEach(t => t.addEventListener('click', () => setTab(t.dataset.f)));
  $$('[data-join]').forEach(b => b.addEventListener('click', Insiders.join));
  const cm = $('#copyMail');
  if (cm) cm.addEventListener('click', async e => { const b = e.currentTarget; if (await copyText(C.brand.email)) { b.innerHTML = `${ic('check')}Copied`; setTimeout(() => { b.innerHTML = `${ic('copy')}Copy`; }, 1800); } });
  $$('[data-email]').forEach(el => { el.textContent = C.brand.email; });
  $$('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
  $$('[data-lab-hub]').forEach(a => { a.href = C.lab.hub; });
  $$('[data-lab-repo]').forEach(a => { a.href = C.lab.repo; });
  $$('[data-studio]').forEach(a => { a.href = C.brand.studio; });
  $$('[data-brand-logo]').forEach(im => { im.src = C.brand.logo; });
  document.addEventListener('visibilitychange', () => carousels.forEach(c => document.hidden ? c.pause('tab') : c.resume('tab')));
}

/* ---------------- bold version: immersive effects ---------------- */
function initBoldFx() {
  if (!isBold) return;
  const root = document.documentElement;
  // headline words rise in after the loader
  $$('[data-split]').forEach(h => {
    h.innerHTML = h.textContent.trim().split(/\s+/).map((w, i) => `<span class="w" style="--i:${i}">${esc(w)}</span>`).join(' ');
  });
  // scroll progress
  const bar = $('#scrollBar');
  if (bar) { let raf = 0; const upd = () => { raf = 0; const h = document.documentElement.scrollHeight - innerHeight; bar.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`; }; addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(upd); }, { passive: true }); upd(); }
  // floating app icons in the hero
  const fl = $('#heroFloat');
  if (fl) {
    const spots = [[8, 14, 1.15, 0], [62, 4, .8, 1.3], [34, 40, 1.35, .6], [78, 44, .95, 2.1], [12, 70, .85, 1.7], [56, 76, 1.05, .9]];
    fl.innerHTML = listed.map((p, i) => { const [x, y, z, d] = spots[i % spots.length]; return `<a class="fl" href="#p-${esc(p.id)}" style="left:${x}%;top:${y}%;--z:${z};--d:${d}s;--accent:${esc(p.accent)}" aria-label="${esc(p.name)}" tabindex="-1"><img src="${esc(p.logo)}" alt="" width="84" height="84"></a>`; }).join('');
  }
  if (reduced || !canHover) return;
  // cursor spotlight + hero parallax
  let mx = innerWidth / 2, my = innerHeight / 3, raf = 0;
  addEventListener('pointermove', e => {
    mx = e.clientX; my = e.clientY;
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      root.style.setProperty('--mx', mx + 'px'); root.style.setProperty('--my', my + 'px');
      if (fl) { const dx = (mx / innerWidth - .5), dy = (my / innerHeight - .5); fl.style.setProperty('--px', dx.toFixed(3)); fl.style.setProperty('--py', dy.toFixed(3)); }
    });
  }, { passive: true });
  // product cards: glow follows the cursor, preview tilts slightly
  $$('.product').forEach(card => {
    const car = $('.carousel', card);
    card.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      const r = card.getBoundingClientRect();
      card.style.setProperty('--gx', (e.clientX - r.left) + 'px'); card.style.setProperty('--gy', (e.clientY - r.top) + 'px');
      const c = car.getBoundingClientRect();
      if (e.clientX >= c.left && e.clientX <= c.right && e.clientY >= c.top && e.clientY <= c.bottom) {
        car.style.setProperty('--ry', (((e.clientX - c.left) / c.width - .5) * 6).toFixed(2) + 'deg');
        car.style.setProperty('--rx', (((e.clientY - c.top) / c.height - .5) * -6).toFixed(2) + 'deg');
      } else { car.style.setProperty('--rx', '0deg'); car.style.setProperty('--ry', '0deg'); }
    });
    card.addEventListener('pointerleave', () => { car.style.setProperty('--rx', '0deg'); car.style.setProperty('--ry', '0deg'); });
  });
}

renderProducts();
initBoldFx();
initChrome();
initDock();
initRotator();
initTerminal();
initReveal();
initCounts();
watchViews();
detectBrowser().then(b => { BROWSER = b; ready.filter(p => p.kind === 'extension').forEach(p => setMain($('#p-' + p.id), p)); });
if (location.hash && location.hash.startsWith('#p-')) document.addEventListener('h24:ready', () => { const t = $(location.hash); if (t) t.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }); });
})();
