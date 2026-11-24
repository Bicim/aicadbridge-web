/* AICADBridge tanıtım sitesi: uygulama bağlantıları, MCP adresi, TR/EN, fiyat dönemi, üst menü, belirme, kopyala. */
(function () {
  'use strict';

  var local = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
  var APP_URL = local ? 'http://localhost:5173/aicadbridge-studio/' : 'https://bicim.github.io/aicadbridge-studio/';
  var API_URL = local ? 'http://127.0.0.1:8000' : 'https://aicad.92-5-107-17.sslip.io';
  document.querySelectorAll('[data-app]').forEach(function (a) { a.href = APP_URL + a.getAttribute('data-app'); });
  document.querySelectorAll('[data-api]').forEach(function (el) { el.textContent = API_URL; });

  /* fiyat dönemi */
  var toggles = document.querySelectorAll('.toggle button');
  toggles.forEach(function (b) {
    b.addEventListener('click', function () {
      var per = b.getAttribute('data-period');
      toggles.forEach(function (x) { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', String(x === b)); });
      document.querySelectorAll('.amt [data-m]').forEach(function (s) { s.textContent = s.getAttribute('data-' + per); });
    });
  });

  /* dil: Türkçe metin HTML'den okunur, İngilizce sözlük burada */
  var EN = {
    'skip': 'Skip to content', 'nav.integrations': 'Integrations', 'nav.start': 'Get started', 'nav.pricing': 'Pricing', 'nav.faq': 'FAQ', 'nav.open': 'Open the app', 'nav.menu': 'Menu',
    'hero.title': 'Describe. Dimension. <em>Make.</em>',
    'hero.lead': 'Describe a part in plain words; AICADBridge builds the parametric 3D model, verifies it and sends it to your CAD program.',
    'hero.cta1': 'Try free', 'hero.cta2': 'Download the installer', 'hero.fine': 'No card required · 30 free credits a day', 'hero.google': 'AICADBridge lets you sign in with Google; it only uses your name, e-mail and profile picture to create your account. <a href="gizlilik.html">Privacy policy</a>',
    'hero.q': '40×30×20 mm box, 2 mm rounded edges', 'hero.p2': 'Ø100 mm flange, 10 mm thick, 6 bolt holes', 'hero.p3': 'Ø25 × 60 mm tube, 3 mm wall',
    'hero.ex': 'Example prompt', 'hero.c1': 'Box', 'hero.c2': 'Flange', 'hero.c3': 'Tube',
    'hero.ans': 'Flange ready: Ø100 × 10 mm, 6 × Ø6.6 holes, volume 66.9 cm³. Verification passed.',
    'story.t': 'From one sentence to a STEP file',
    'story.1t': 'Start with a sentence', 'story.1d': 'Describe the part with its dimensions: Ø100 mm flange, 6 × M6 holes, Ø35 bore.',
    'story.2t': 'Not a mesh, a real solid', 'story.2d': 'Every model is built as B-rep, so the STEP file keeps its exact dimensions.',
    'story.3t': 'Dimensions are verified', 'story.3d': 'Volume, wall thickness and hole positions are checked; if something is off, the model repairs itself.',
    'story.4t': 'Send it to your CAD app', 'story.4d': 'Opens as a new part in Fusion, SolidWorks, Blender and more.', 'story.4l': 'See integrations',
    'story.note': 'Illustrative footage', 'copy': 'Copy', 'copied': 'Copied',
    'works.t': 'Sends models to 16 programs, from Fusion to HyperMesh.',
    'how.title': 'Real CAD, first try', 'how.dl': 'Outer diameter', 'b.s2': 'Thickness', 'b.s3': 'Hole count',
    'b.1t': 'Change it by dimension', 'b.1d': 'The model is parametric: change diameter, thickness or hole count with a slider, without regenerating.',
    'b.2t': 'A real CAD file', 'b.2d': 'Output is a B-rep solid: STEP keeps exact dimensions; GLB and STL too.',
    'b.3t': 'Dimensions are checked', 'b.3a': '6 × Ø6.6 holes', 'b.3b': 'Volume 66.9 cm³', 'b.4t': 'Opens in your CAD app',
    'int.title': 'Integrations', 'int.lead': 'The plugin pairs with your account using a device code and only makes outbound HTTPS calls; no ports are opened on your machine.',
    'st.ready': 'Ready', 'st.folder': 'STEP folder', 'int.more': 'And more coming soon: all integrations', 'int.tiles': 'Programs',
    'int.g1d': 'The installer sets up the plugin; the model opens as a new part in your program.',
    'int.g2d': "Works through the installer's plugin (Onshape: through a cloud link); in testing, feedback welcome.",
    'int.g3d': 'The model is saved as STEP into a folder; open it with Import in your program.',
    'mcp.title': 'Use it from your assistant', 'mcp.lead': 'Build models from Claude, Cursor or VS Code through MCP. The assistant checks the dimensions and sends the result to your connected program.', 'mcp.cta': 'Create an MCP key',
    'start.title': 'Get started',
    'start.1': 'Sign in with Google', 'start.1d': 'Your tasks, models and files are stored in your account, available on every device.', 'start.1b': 'Open the app',
    'start.2': 'Describe your first part', 'start.2d': 'Type the part and its sizes into "New task". Tweak with sliders, download STEP.', 'start.2b': 'New task',
    'start.3': 'Connect your CAD program', 'start.3d': 'The installer finds your programs and installs the plugin; press "Connect" and approve on the page that opens. On the SmartScreen prompt choose "More info" and "Run anyway".', 'start.3b': 'Download the installer', 'start.man': 'Manual install (zip)',
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
    'cta.title': 'Describe your <em>next part</em>', 'cta.try': 'Try free', 'cta.connect': 'Connect your CAD',
    'foot.tag': 'Parametric CAD from plain language.', 'foot.prod': 'Product', 'foot.res': 'Resources', 'foot.legal': 'Legal',
    'foot.setup': 'Installer', 'foot.privacy': 'Privacy', 'foot.terms': 'Terms',
    'foot.tm': 'Product names and logos are trademarks of their respective owners; they are used only to indicate compatibility and do not imply affiliation or endorsement.'
  };
  var TR = { 'copy': 'Kopyala', 'copied': 'Kopyalandı' };
  var chips = [].slice.call(document.querySelectorAll('.chip'));
  chips.forEach(function (c) { TR[c.getAttribute('data-k')] = c.getAttribute('data-tr'); });
  document.querySelectorAll('[data-i18n]').forEach(function (el) { TR[el.getAttribute('data-i18n')] = el.textContent; });
  document.querySelectorAll('[data-i18n-html]').forEach(function (el) { TR[el.getAttribute('data-i18n-html')] = el.innerHTML; });

  var langBtns = document.querySelectorAll('.lang'), type;
  function setLang(lang) {
    var dict = lang === 'en' ? EN : TR;
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(function (el) { var k = el.getAttribute('data-i18n'); if (dict[k] != null) el.textContent = dict[k]; });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) { var k = el.getAttribute('data-i18n-html'); if (dict[k] != null) el.innerHTML = dict[k]; });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) { var k = el.getAttribute('data-i18n-aria'); if (dict[k] != null) el.setAttribute('aria-label', dict[k]); });
    langBtns.forEach(function (b) { b.textContent = lang === 'en' ? 'TR' : 'EN'; });
    if (type) type(0, 1);
    try { localStorage.setItem('aicad.lang', lang); } catch (e) { /* gizli pencere */ }
  }
  var initial = new URLSearchParams(location.search).get('lang');
  if (!initial) { try { initial = localStorage.getItem('aicad.lang'); } catch (e) { initial = null; } }
  if (initial === 'en') setLang('en');
  langBtns.forEach(function (b) { b.addEventListener('click', function () { setLang(document.documentElement.lang === 'en' ? 'tr' : 'en'); }); });

  /* üst menü: 8px kaydırınca .solid; mobil menü bağlantısına basınca kapanır */
  var nav = document.querySelector('.nav'), ticking = false;
  function onScroll() { ticking = false; nav.classList.toggle('solid', window.scrollY > 8); }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();
  var menu = document.querySelector('.nav-menu');
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) menu.open = false; });

  /* hero daktilosu: 38 ms yaz, 2200 bekle, 18 ms sil, 400 ara; gizliyken durur, hareket azaltmada yok */
  var tw = document.getElementById('tw'), rm = matchMedia('(prefers-reduced-motion: reduce)').matches, cur = 0, tt, heroVis = true, again = true;
  function want(i) { return (document.documentElement.lang === 'en' ? EN : TR)[chips[i].getAttribute('data-k')] || ''; }
  type = function (i, auto) {
    clearTimeout(tt); cur = i; again = !!auto;
    chips.forEach(function (c, j) { c.setAttribute('aria-pressed', String(i === j)); });
    var s = want(i), n = 0, erasing = false;
    if (rm || !('IntersectionObserver' in window)) { tw.textContent = s; return; }
    tw.textContent = '';
    (function step() {
      if (!heroVis || document.hidden) { tt = setTimeout(step, 500); return; }
      if (!erasing) {
        tw.textContent = s.slice(0, ++n);
        if (n < s.length) tt = setTimeout(step, 38);
        else if (again) tt = setTimeout(function () { erasing = true; step(); }, 2200);
      } else {
        tw.textContent = s.slice(0, --n);
        tt = n > 0 ? setTimeout(step, 18) : setTimeout(function () { type((cur + 1) % chips.length, 1); }, 400);
      }
    })();
  };
  chips.forEach(function (c, i) { c.addEventListener('click', function () { type(i, 0); }); });
  tw.textContent = want(0);
  if (!rm && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { heroVis = es[0].isIntersecting; }).observe(document.querySelector('.hero'));
    addEventListener('load', function () { tt = setTimeout(function () { type(0, 1); }, 600); });
  }

  /* entegrasyon karoları: görünüme girince grup grup yanar; grup düğmesi o grubu öne çıkarır */
  var tiles = document.getElementById('int-tiles'), groups = [].slice.call(document.querySelectorAll('.int-g'));
  function lit(g) { [].forEach.call(tiles.querySelectorAll('[data-g="' + g + '"]'), function (t) { t.classList.add('lit'); }); }
  groups.forEach(function (b) {
    b.addEventListener('click', function () {
      var on = b.getAttribute('aria-pressed') !== 'true';
      groups.forEach(function (x) { x.setAttribute('aria-pressed', String(on && x === b)); });
      if (on) tiles.setAttribute('data-sel', b.getAttribute('data-g')); else tiles.removeAttribute('data-sel');
    });
  });
  if ('IntersectionObserver' in window) {
    var lio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { lit(e.target.getAttribute('data-g')); lio.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.6 });
    [].forEach.call(tiles.children, function (t) { lio.observe(t); });
  } else { lit(1); lit(2); lit(3); }

  /* bölüm belirmesi (§4): bir kez, threshold 0.15 */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.15 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* MCP komutunu kopyala */
  var copyBtn = document.getElementById('copy-mcp');
  if (copyBtn && navigator.clipboard) {
    copyBtn.addEventListener('click', function () {
      navigator.clipboard.writeText(document.getElementById('mcp-cmd').textContent).then(function () {
        var dict = document.documentElement.lang === 'en' ? EN : TR;
        copyBtn.setAttribute('aria-label', dict.copied);
        copyBtn.querySelector('use').setAttribute('href', 'assets/icons.svg#check');
        setTimeout(function () { copyBtn.setAttribute('aria-label', dict.copy); copyBtn.querySelector('use').setAttribute('href', 'assets/icons.svg#copy'); }, 1600);
      });
    });
  }
})();
