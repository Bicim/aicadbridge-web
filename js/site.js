/* AICADBridge tanıtım sitesi: uygulama bağlantıları, MCP adresi, TR/EN, fiyat dönemi, üst menü, kopyala, tema, parça seçici, çizici hareketi (vault/site-v4-kimlik.md §5-6). */
(function () {
  'use strict';
  var d = document, de = d.documentElement, $$ = function (s, r) { return [].slice.call((r || d).querySelectorAll(s)); };

  var local = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
  var APP_URL = local ? 'http://localhost:5173/aicadbridge-studio/' : 'https://bicim.github.io/aicadbridge-studio/';
  var API_URL = local ? 'http://127.0.0.1:8000' : 'https://aicad.92-5-107-17.sslip.io';
  $$('[data-app]').forEach(function (a) { a.href = APP_URL + a.getAttribute('data-app'); });
  $$('[data-api]').forEach(function (el) { el.textContent = API_URL; });

  /* fiyat dönemi (para birimi değişiminde sayaç yok, anında) */
  var toggles = $$('.toggle button');
  toggles.forEach(function (b) {
    b.addEventListener('click', function () {
      var per = b.getAttribute('data-period') === 'y' ? 'py' : 'pm';
      toggles.forEach(function (x) { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', String(x === b)); });
      $$('.amt .num').forEach(function (s) { s.textContent = s.getAttribute('data-' + per); });
    });
  });

  /* dil: Türkçe metin HTML'den okunur, İngilizce sözlük burada */
  var EN = {
    'skip': 'Skip to content', 'nav.integrations': 'Integrations', 'nav.start': 'Get started', 'nav.pricing': 'Pricing', 'nav.faq': 'FAQ', 'nav.open': 'Open the app', 'nav.menu': 'Menu', 'nav.main': 'Main menu', 'price.bill': 'Billing period',
    'theme.label': 'Theme', 'theme.system': 'System', 'theme.light': 'Light', 'theme.dark': 'Dark',
    'hero.title': 'Describe. Dimension. <em>Make.</em>',
    'hero.lead': 'Describe a part in plain words; AICADBridge builds the parametric 3D model, verifies it and sends it to your CAD program.',
    'hero.cta1': 'Try free', 'hero.cta2': 'Download the installer', 'hero.fine': 'No card required · 30 free credits a day', 'hero.google': 'AICADBridge lets you sign in with Google; it only uses your name, e-mail and profile picture to create your account. <a href="gizlilik.html">Privacy policy</a>',
    'hero.q': '40×30×20 mm box, 2 mm rounded edges', 'hero.p2': 'Ø100 mm flange, 10 mm thick, 6 bolt holes', 'hero.p3': 'Ø25 × 60 mm tube, 3 mm wall',
    'hero.c1': 'Box', 'hero.c2': 'Flange', 'hero.c3': 'Tube', 'hero.run': 'Generate', 'hero.parts': 'Example part',
    'hero.alt1': 'Dimensioned front and side view of the box', 'hero.alt2': 'Dimensioned front and side view of the flange', 'hero.alt3': 'Dimensioned side and end view of the tube',
    'hero.works': 'Fusion, SolidWorks, Blender and 13 more programs', 'tb.part': 'Part', 'tb.unit': 'Unit', 'tb.out': 'Output', 'tb.progs': 'Programs', 'tb.credit': 'Free', 'tb.creditv': '30 / day',
    'hero.ans': 'Flange ready: Ø100 × 10 mm, 6 × Ø6.6 holes, volume 66.9 cm³. Verification passed.',
    'vid.title': 'AICADBridge in 21 seconds', 'vid.lead': 'From one sentence to an exact, dimensioned CAD model: a short launch video.', 'vid.label': 'AICADBridge launch video (21 seconds)',
    'story.t': 'From one sentence to a STEP file',
    'story.1t': 'Start with a sentence', 'story.1d': 'Describe the part with its dimensions: Ø100 mm flange, 6 × M6 holes, Ø35 bore.',
    'story.2t': 'Not a mesh, a real solid', 'story.2d': 'Every model is built as B-rep, so the STEP file keeps its exact dimensions.',
    'story.3t': 'Dimensions are verified', 'story.3d': 'Volume, wall thickness and hole positions are checked; if something is off, the model repairs itself.',
    'story.4t': 'Send it to your CAD app', 'story.4d': 'Opens as a new part in Fusion, SolidWorks, Blender and more.', 'story.4l': 'See integrations',
    'story.note': 'Illustrative footage', 'copy': 'Copy', 'copied': 'Copied',
    'how.title': 'Real CAD, first try', 'how.dl': 'Outer diameter', 'b.s2': 'Thickness', 'b.s3': 'Hole count',
    'b.1t': 'Change it by dimension', 'b.1d': 'The model is parametric: change diameter, thickness or hole count with a slider, without regenerating.',
    'b.2t': 'A real CAD file', 'b.2d': 'Output is a B-rep solid: STEP keeps exact dimensions; GLB and STL too.',
    'b.3t': 'Dimensions are checked', 'b.3a': '6 × Ø6.6 holes', 'b.3b': 'Volume 66.9 cm³', 'b.4t': 'Opens in your CAD app',
    'int.title': 'Integrations', 'int.lead': 'The plugin pairs with your account using a device code and only makes outbound HTTPS calls; no ports are opened on your machine.',
    'st.ready': 'Ready', 'st.folder': 'STEP folder', 'int.more': 'And more coming soon: all integrations', 'int.tiles': 'Programs',
    'int.g1d': 'The installer sets up the plugin; the model opens as a new part in your program.',
    'int.g2d': "Works through the installer's plugin (Onshape: through a cloud link); in testing, feedback welcome.",
    'int.g3d': 'The model is saved as STEP into a folder; open it with Import in your program.',
    'bom.prog': 'Program', 'bom.via': 'Connection', 'bom.addin': 'Add-in', 'bom.cloud': 'Cloud link', 'bom.folder': 'STEP folder',
    'mcp.title': 'Use it from your assistant', 'mcp.lead': 'Build models from Claude, Cursor or VS Code through MCP. The assistant checks the dimensions and sends the result to your connected program.', 'mcp.cta': 'Create an MCP key',
    'start.title': 'Get started',
    'start.1': 'Sign in with Google', 'start.1d': 'Your tasks, models and files are stored in your account, available on every device.', 'start.1b': 'Open the app',
    'start.2': 'Describe your first part', 'start.2d': 'Type the part and its sizes into "New task". Tweak with sliders, download STEP.', 'start.2b': 'New task',
    'start.3': 'Connect your CAD program', 'start.3d': 'The installer finds your programs and installs the plugin; press "Connect" and approve on the page that opens. If Windows shows a warning, see the note below.', 'start.warn': 'Blocked by Windows or your browser?', 'start.warnd': 'The installer is not digitally signed yet, so it looks like a new, unknown file and a warning may appear. Windows: "Windows protected your PC" → <b>More info</b> → <b>Run anyway</b>. Chrome/Edge: choose <b>Keep</b> next to the file in the downloads list. To verify it, compare the <a href="https://github.com/Bicim/aicadbridge-connectors/releases/latest/download/SHA256SUMS.txt">SHA-256 checksum</a>.', 'start.3b': 'Download the installer', 'start.man': 'Manual install (zip)',
    'start.4': 'Send and edit', 'start.4d': 'The model opens as a new part in your program. To change it, continue in the same task; only that dimension changes.', 'start.4b': 'My files',
    'price.title': 'Pricing', 'price.m': 'Monthly', 'price.y': 'Yearly −20%', 'price.per': '/mo', 'price.seat': '/seat/mo',
    'price.note': '1 credit = 1 model generation or fix round. Slider rebuilds are free. Prices exclude VAT.',
    'plan.free': 'Free', 'plan.team': 'Team', 'plan.popular': 'Most popular', 'plan.freed': 'For trying things out and small jobs', 'plan.prod': 'For engineers who design every week',
    'plan.teamd': 'For teams sharing projects', 'plan.start': 'Get started', 'plan.pro': 'Go Pro', 'plan.contact': 'Choose Team',
    'pf.1': '30 credits a day', 'pf.2': 'Web Studio and parametric sliders', 'pf.3': 'STEP / STL / GLB downloads', 'pf.4': '1 connected plugin',
    'pp.1': '1000 credits a month', 'pp.2': 'Unlimited plugins: Fusion, Blender, SolidWorks', 'pp.3': 'Bring your own API key, no credits', 'pp.4': 'Priority queue',
    'pt.1': '3000 credits per seat a month', 'pt.2': 'Shared projects and team members', 'pt.3': 'Audit log · SSO coming soon', 'pt.4': 'Priority support',
    'faq.title': 'FAQ', 'faq.lead': 'Anything else? <a href="https://github.com/Bicim/aicadbridge-web/issues/new" rel="noopener">Ask on GitHub</a>.',
    'q.1': 'Can it edit my existing model?', 'a.1': 'Yes, as long as you continue in the same task. The model starts from the latest plan and changes only what you asked; the old version is kept.',
    'q.2': 'Can I use it without a CAD program?', 'a.2': 'Yes. Web Studio works on its own: view the model in the browser, tweak it with sliders and download STEP, STL, 3MF or GLB.',
    'q.3': 'What does the plugin do on my computer?', 'a.3': 'It pairs with your account using a code, receives the models you send over HTTPS and opens them as a new part. It opens no ports; you can disconnect it any time from Integrations.',
    'q.4': 'How are credits spent?', 'a.4': 'Each generation or automatic fix round is 1 credit. Slider rebuilds, downloads and sending to a program are free; with your own API key no credits are used.',
    'q.5': 'Can I use it from Claude, Cursor or VS Code?', 'a.5': 'Yes, through MCP. Create a personal key on the Integrations page and add the config to your assistant. Credits come from your account; revoke the key any time.',
    'q.6': 'Where is my data stored?', 'a.6': 'Your account details (name, email, profile photo), tasks and model files are stored on the AICADBridge server, tied only to your account. Deleting a task also deletes its models and messages.',
    'q.7': 'Windows or my browser warns about the installer. Is it safe?', 'a.7': 'The file is not digitally signed yet; Windows SmartScreen and Chrome/Edge warn about new, rarely downloaded unsigned files. On Windows choose <b>More info → Run anyway</b>, in Chrome choose <b>Keep</b>. The code is public (<a href="https://github.com/Bicim/aicadbridge-connectors" rel="noopener">GitHub</a>) and you can verify the file with the <a href="https://github.com/Bicim/aicadbridge-connectors/releases/latest/download/SHA256SUMS.txt">SHA-256 checksum</a>. The installer does not need administrator rights.',
    'cta.title': 'Describe your <em>next part</em>', 'cta.try': 'Try free', 'cta.connect': 'Connect your CAD',
    'foot.tag': 'Parametric CAD from plain language.', 'foot.prod': 'Product', 'foot.res': 'Resources', 'foot.legal': 'Legal',
    'foot.setup': 'Installer', 'foot.privacy': 'Privacy', 'foot.terms': 'Terms',
    'foot.tm': 'Product names and logos are trademarks of their respective owners; they are used only to indicate compatibility and do not imply affiliation or endorsement.'
  };
  var TR = { 'copy': 'Kopyala', 'copied': 'Kopyalandı', 'hero.alt1': 'Kutunun ölçülendirilmiş ön ve yan görünüşü', 'hero.alt3': 'Borunun ölçülendirilmiş yan ve uç görünüşü' };
  $$('[data-tr]').forEach(function (c) { TR[c.getAttribute('data-k')] = c.getAttribute('data-tr'); });
  $$('[data-i18n]').forEach(function (el) { TR[el.getAttribute('data-i18n')] = el.textContent; });
  $$('[data-i18n-html]').forEach(function (el) { TR[el.getAttribute('data-i18n-html')] = el.innerHTML; });
  $$('[data-i18n-aria]').forEach(function (el) { var k = el.getAttribute('data-i18n-aria'); if (!TR[k]) TR[k] = el.getAttribute('aria-label'); });
  function dict() { return de.lang === 'en' ? EN : TR; }
  function tx(el) { var v = dict()[el.getAttribute('data-i18n')]; if (v != null) el.textContent = v; }

  var langBtns = $$('.lang');
  function setLang(lang) {
    de.lang = lang;
    $$('[data-i18n]').forEach(tx);
    $$('[data-i18n-html]').forEach(function (el) { var v = dict()[el.getAttribute('data-i18n-html')]; if (v != null) el.innerHTML = v; });
    $$('[data-i18n-aria]').forEach(function (el) { var v = dict()[el.getAttribute('data-i18n-aria')]; if (v != null) { el.setAttribute('aria-label', v); if (el.hasAttribute('title')) el.title = v; } });
    langBtns.forEach(function (b) { b.textContent = lang === 'en' ? 'TR' : 'EN'; });
    try { localStorage.setItem('aicad.lang', lang); } catch (e) { /* gizli pencere */ }
  }
  var initial = new URLSearchParams(location.search).get('lang');
  if (!initial) { try { initial = localStorage.getItem('aicad.lang'); } catch (e) { initial = null; } }
  if (initial === 'en') setLang('en');
  langBtns.forEach(function (b) { b.addEventListener('click', function () { setLang(de.lang === 'en' ? 'tr' : 'en'); }); });

  /* tema: Sistem / Açık / Koyu; anahtar aicb-theme (ön boyama betiği <head>'de) */
  var groups = $$('.theme'), metas = $$('meta[name=theme-color]'), orig = metas.map(function (m) { return m.content; });
  function metaSync() { var v = de.getAttribute('data-theme'); metas.forEach(function (m, i) { m.content = v ? (v === 'dark' ? '#07090c' : '#f5f7fa') : orig[i]; }); }
  function setTheme(v, save) {
    if (v === 'light' || v === 'dark') de.setAttribute('data-theme', v); else de.removeAttribute('data-theme');
    groups.forEach(function (g) { $$('button', g).forEach(function (b) { var on = b.getAttribute('data-t') === v; b.setAttribute('aria-checked', String(on)); b.tabIndex = on ? 0 : -1; }); });
    metaSync();
    if (save) { try { localStorage.setItem('aicb-theme', v); } catch (e) { /* gizli pencere */ } }
  }
  var saved; try { saved = localStorage.getItem('aicb-theme'); } catch (e) { saved = null; }
  setTheme(saved === 'light' || saved === 'dark' ? saved : 'system');
  try { matchMedia('(prefers-color-scheme: dark)').addEventListener('change', metaSync); } catch (e) { /* eski Safari */ }
  groups.forEach(function (g) {
    g.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) setTheme(b.getAttribute('data-t'), 1); });
    g.addEventListener('keydown', function (e) { arrows(e, $$('button', g), function (b) { setTheme(b.getAttribute('data-t'), 1); }); });
  });
  function arrows(e, bs, pick) {
    var k = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!k) return;
    var i = bs.indexOf(d.activeElement), b = bs[(i + k + bs.length) % bs.length];
    e.preventDefault(); b.focus(); pick(b);
  }

  /* üst menü: 8px kaydırınca .solid; mobil menü bağlantısına basınca kapanır */
  var nav = d.querySelector('.nav'), ticking = false;
  function onScroll() { ticking = false; nav.classList.toggle('solid', window.scrollY > 8); }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();
  var menu = d.querySelector('.nav-menu');
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) menu.open = false; });

  /* hareket "Çizici" (§5): yalnız html.m-ready (JS + hareket azaltma kapalı) iken; aksi halde HTML bitmiş hâlde kalır */
  var M = de.classList.contains('m-ready'), draw = d.getElementById('draw'), RX = /\d+(\.\d+)?(?!.*\d)/;
  function count(root, k) {
    if (d.hidden) return;
    $$('[data-n]', root).forEach(function (el) {
      var s = el.getAttribute('data-n'), dec = (s.split('.')[1] || '').length, tpl = el.textContent, w = (+el.getAttribute('data-d') || 0) * (k || 1), t0 = performance.now(), id = el._c = (el._c || 0) + 1;
      if (!RX.test(tpl)) return;
      (function f(now) {
        if (el._c !== id) return;
        var p = Math.min(1, Math.max(0, (now - t0 - w) / 600));
        el.textContent = tpl.replace(RX, (+s * (1 - Math.pow(1 - p, 3))).toFixed(dec));
        if (p < 1) requestAnimationFrame(f);
      })(t0);
    });
  }
  function go(el, k) { el.classList.add('on'); count(el, k); }
  if (M) {
    try {
      var T = { h: .6, snap: .25, chain: .35, tb: .35, n: .35, r: .15 };
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          var el = e.target;
          if (e.isIntersecting && (e.intersectionRatio >= T[el.getAttribute('data-m')] || e.intersectionRect.height > innerHeight * .5)) { go(el); io.unobserve(el); }
        });
      }, { threshold: [.15, .25, .35, .6], rootMargin: '0px 0px -10% 0px' });
      $$('[data-m]').forEach(function (el) { if (el !== draw && T[el.getAttribute('data-m')]) io.observe(el); });
      addEventListener('load', function () { requestAnimationFrame(function () { go(draw); }); });
    } catch (e) { de.classList.remove('m-ready'); M = false; }
  }

  /* hero parça seçici (radiogroup, ←/→) + M8 parça değiştirme */
  var parts = $$('.parts button'), cur = 0, swt, cmdT = d.getElementById('cmd-t'), tbP = d.getElementById('tb-part'), title = d.getElementById('draw-t');
  function pick(i) {
    if (i === cur) return;
    cur = i;
    parts.forEach(function (b, j) { b.setAttribute('aria-checked', String(j === i)); b.tabIndex = j === i ? 0 : -1; });
    var b = parts[i];
    cmdT.setAttribute('data-i18n', b.getAttribute('data-k')); tbP.setAttribute('data-i18n', b.getAttribute('data-i18n')); title.setAttribute('data-i18n', b.getAttribute('data-a'));
    tx(cmdT); tx(tbP); tx(title);
    function swap() {
      $$('.part', draw).forEach(function (g) { g.classList.toggle('cur', g.getAttribute('data-p') === b.getAttribute('data-p')); });
      if (M) { draw.classList.remove('on', 'sw'); draw.classList.add('quick'); void draw.getBoundingClientRect(); go(draw, .55); }
    }
    clearTimeout(swt);
    if (M) { draw.classList.add('sw'); swt = setTimeout(swap, 120); } else swap();
  }
  parts.forEach(function (b, i) { b.addEventListener('click', function () { pick(i); }); });
  d.querySelector('.parts').addEventListener('keydown', function (e) { arrows(e, parts, function (b) { pick(parts.indexOf(b)); }); });

  /* MCP komutunu kopyala */
  var copyBtn = d.getElementById('copy-mcp');
  if (copyBtn && navigator.clipboard) {
    copyBtn.addEventListener('click', function () {
      navigator.clipboard.writeText(d.getElementById('mcp-cmd').textContent).then(function () {
        copyBtn.setAttribute('aria-label', dict().copied);
        copyBtn.querySelector('use').setAttribute('href', 'assets/icons.svg#check');
        setTimeout(function () { copyBtn.setAttribute('aria-label', dict().copy); copyBtn.querySelector('use').setAttribute('href', 'assets/icons.svg#copy'); }, 1600);
      });
    });
  }
})();
