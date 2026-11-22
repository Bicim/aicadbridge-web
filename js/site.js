/* AICADBridge tanıtım sitesi: uygulama bağlantıları, dil (TR/EN), sekmeler, fiyat dönemi, figür animasyonu. */
(function () {
  'use strict';

  var local = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
  var APP_URL = local ? 'http://localhost:5173/aicadbridge-studio/' : 'https://bicim.github.io/aicadbridge-studio/';
  var API_URL = local ? 'http://127.0.0.1:8000' : 'https://aicad.92-5-107-17.sslip.io';
  document.querySelectorAll('[data-app]').forEach(function (a) {
    a.href = APP_URL + a.getAttribute('data-app');
  });
  document.querySelectorAll('[data-api]').forEach(function (el) { el.textContent = API_URL; });

  /* mobil menü */
  var nav = document.querySelector('.nav');
  var burger = document.getElementById('burger');
  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('.nav-links a').forEach(function (a) {
    a.addEventListener('click', function () { nav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); });
  });

  /* dişli dişleri (SVG) */
  var teeth = document.querySelector('.teeth');
  if (teeth) {
    var d = '';
    for (var i = 0; i < 24; i++) {
      var a = (i / 24) * Math.PI * 2;
      var x1 = 210 + Math.cos(a) * 92, y1 = 70 + Math.sin(a) * 24;
      var x2 = 210 + Math.cos(a) * 100, y2 = 70 + Math.sin(a) * 26;
      if (Math.sin(a) > -0.2) d += 'M' + x1.toFixed(1) + ' ' + y1.toFixed(1) + 'L' + x2.toFixed(1) + ' ' + y2.toFixed(1) + 'v8';
    }
    var p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p.setAttribute('d', d);
    teeth.appendChild(p);
  }

  /* hero figürü: adımlar sırayla vurgulanır */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var steps = document.querySelectorAll('#figSteps li');
  var parts = document.querySelectorAll('.explode .part');
  var map = [3, 3, 1, 0, 2]; // adım → parça
  var step = 0, paused = reduce, timer = null;
  function show(n) {
    steps.forEach(function (s, i) { s.classList.toggle('on', i === n); });
    parts.forEach(function (p, i) { p.classList.toggle('hl', i === map[n]); });
  }
  function run() {
    clearInterval(timer);
    if (!paused) timer = setInterval(function () { step = (step + 1) % steps.length; show(step); }, 2200);
  }
  show(0); run();
  var pauseBtn = document.getElementById('figPause');
  var fig = document.querySelector('.hero-fig');
  function setPaused(v) {
    paused = v; fig.classList.toggle('paused', v);
    pauseBtn.textContent = v ? '▶' : '❚❚';
    pauseBtn.setAttribute('aria-label', v ? 'Animasyonu oynat' : 'Animasyonu duraklat');
    run();
  }
  pauseBtn.addEventListener('click', function () { setPaused(!paused); });
  if (reduce) setPaused(true);

  /* yetenek sekmeleri */
  var tabs = document.querySelectorAll('.cap-tabs button');
  var panels = document.querySelectorAll('.cap-panel');
  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      var n = t.getAttribute('data-tab');
      tabs.forEach(function (x) { x.setAttribute('aria-selected', String(x === t)); });
      panels.forEach(function (p) { p.classList.toggle('on', p.getAttribute('data-cap') === n); });
    });
  });
  document.querySelectorAll('.sliders input').forEach(function (r) {
    var out = document.getElementById(r.getAttribute('data-out'));
    var unit = r.getAttribute('data-unit') || 'mm';
    r.addEventListener('input', function () { out.textContent = r.value + ' ' + unit; });
  });

  /* fiyat dönemi */
  var toggles = document.querySelectorAll('.toggle button');
  toggles.forEach(function (b) {
    b.addEventListener('click', function () {
      var per = b.getAttribute('data-period');
      toggles.forEach(function (x) { x.classList.toggle('on', x === b); });
      document.querySelectorAll('.amt [data-m]').forEach(function (s) { s.textContent = s.getAttribute('data-' + per); });
    });
  });

  /* dil */
  var EN = {
    'skip': 'Skip to content', 'nav.product': 'Product', 'nav.integrations': 'Integrations', 'nav.pricing': 'Pricing', 'nav.faq': 'FAQ',
    'nav.download': 'Download', 'nav.start': 'Get started', 'nav.login': 'Sign in', 'nav.try': 'Try free ↗',
    'hero.eyebrow': 'TEXT-TO-CAD · PARAMETRIC · VERIFIED', 'hero.title': 'Describe.<br>Dimension.<br><em>Make.</em>',
    'hero.lead': 'Describe a part in plain words. AICADBridge builds a parametric 3D model, verifies it on its own kernel and hands you a STEP file, or sends it straight to Fusion 360, Blender or SolidWorks.',
    'hero.cta1': 'Start free ↗', 'hero.cta2': 'How it works', 'hero.fine': 'No card required · 30 free credits a day',
    'facts.1': 'Runs on the web and in 3 CAD programs', 'facts.2': 'STEP, STL, 3MF, GLB export', 'facts.3': 'Every dimension is a slider: update without asking the AI', 'facts.4': 'Self-healing verification loop',
    'prod.title': 'Built for real engineering,<br><em>with real dimensions</em>',
    'cap.0': 'Text to model', 'cap.0d': 'Describe the part, its sizes and constraints; get a parametric feature tree.',
    'cap.1': 'Edit with sliders', 'cap.1d': 'Every dimension is a parameter. Change it and the model rebuilds in seconds, no credits.',
    'cap.2': 'Self-healing checks', 'cap.2d': 'Failed features, bounding-box or volume deviations go back to the model and get fixed.',
    'cap.3': 'Real B-rep, real files', 'cap.3d': 'OCCT kernel: STEP, STL, 3MF and GLB. Solids, not meshes.',
    'cap.4': 'Send to your CAD', 'cap.4d': 'Opens as a new component in your connected Fusion 360, Blender or SolidWorks.',
    'int.title': 'Inside the program<br><em>you already use</em>', 'int.other': 'Everything else',
    'int.lead': 'Design on the web, import with a plugin. The plugin pairs with a device code and only makes outbound HTTPS calls; no ports are opened on your machine.',
    'how.title': 'From prompt to program,<br><em>in five steps</em>', 'how.1': 'Prompt', 'how.3': 'Kernel', 'how.4': 'Verify', 'how.5': 'Deliver',
    'how.1d': 'Write the part, the sizes and the intent. Keep going to edit the previous model.',
    'how.2d': 'The model writes a versioned, host-neutral feature plan: parameters, features, expectations.',
    'how.3d': 'An OCCT-based kernel turns the plan into a solid; a failing step is reported and leaves the model intact.',
    'how.4d': 'Bounding box, volume and body count are checked against the plan; deviations trigger a fix round.',
    'how.5d': 'Preview, sliders, STEP/STL/3MF downloads and delivery to your connected program.',
    'start.title': 'Up and running<br><em>in five minutes</em>',
    'start.lead': 'Create your account, describe your first part, then connect the model to the program or AI assistant you use. Every step links to the right page.',
    'start.1': 'Sign in with Google', 'start.1b': 'Open the app ↗',
    'start.1d': 'Click "Continue with Google" in the app. Your name, email and profile photo are saved to your account; your tasks, models and files are stored there and available on every device.',
    'start.2': 'Describe your first model', 'start.2b': 'New task ↗',
    'start.2d': 'Type the part and its sizes into "New task", e.g. "flange 100 mm, 10 mm thick, 6 holes". Change dimensions with sliders, download STEP/STL.',
    'start.3': 'Connect your CAD program', 'start.3b': 'Download plugin', 'start.3c': 'Enter the code ↗',
    'start.3d': 'Download and install the Fusion 360, Blender or SolidWorks plugin. "AICADBridge Connect" shows a code; enter it on the Integrations page. "Send" now opens the model in your program.',
    'start.4': 'Model from your assistant (MCP)', 'start.4b': 'Create an MCP key ↗',
    'start.4d': 'Using Claude, Cursor or VS Code? Create an MCP key on the Integrations page and add the given config to your assistant. Then just say "draw an 80 mm flange and send it to Fusion".',
    'start.5': 'Send and edit', 'start.5b': 'My files ↗',
    'start.5d': 'The model opens as a new component in your program. To change it, continue in the same task or tell your assistant "make the wall 3 mm"; only that dimension changes.',
    'data.title': 'Your data stays<br><em>in your control</em>', 'data.1': 'No open ports', 'data.2': 'Per-account storage', 'data.3': 'Your own key', 'data.4': 'Delete any time',
    'data.1d': 'Plugins only connect outbound. No local server, no open port, no remote code execution.',
    'data.2d': 'Files are kept per user and downloaded only through short-lived signed links.',
    'data.3d': 'On Pro and Team, use your own model-provider key; it is stored only in your browser.',
    'data.4d': 'Deleting a task removes its models, messages and jobs. Disconnect devices with one click.',
    'price.title': 'Plans for the way<br><em>you work</em>', 'price.m': 'Monthly', 'price.y': 'Yearly −20%', 'price.per': '/mo', 'price.seat': '/seat/mo',
    'price.note': '1 credit = 1 model generation or fix round. Slider rebuilds are free. Prices exclude VAT.',
    'plan.free': 'FREE', 'plan.team': 'TEAM', 'plan.popular': 'Most popular', 'plan.freed': 'For trying things out and small jobs', 'plan.prod': 'For engineers who design every week',
    'plan.teamd': 'For teams sharing projects', 'plan.start': 'Get started', 'plan.pro': 'Go Pro', 'plan.contact': 'Choose Team',
    'pf.1': '30 credits a day', 'pf.2': 'Web Studio and parametric sliders', 'pf.3': 'STEP / STL / GLB downloads', 'pf.4': '1 connected plugin',
    'pp.1': '1000 credits a month', 'pp.2': 'Unlimited plugins: Fusion, Blender, SolidWorks', 'pp.3': 'Bring your own API key, no credits', 'pp.4': 'Priority queue',
    'pt.1': '3000 credits per seat a month', 'pt.2': 'Shared projects and team members', 'pt.3': 'Audit log · SSO coming soon', 'pt.4': 'Priority support',
    'q.1': 'Can AICADBridge edit my existing model?', 'a.1': 'Yes, as long as you continue in the same task. The model starts from the latest plan, keeps ids and parameters, and changes only what you asked. Editing a message branches the conversation; the old version stays.',
    'q.2': 'Which file formats do I get?', 'a.2': 'STEP (AP214), binary STL, 3MF and GLB. STEP opens in almost every CAD program; the plugins do it automatically.',
    'q.3': 'Can I use it without Fusion 360, Blender or SolidWorks?', 'a.3': 'Yes. Web Studio works on its own: view the model in the browser, tweak it with sliders and download it. Plugins are optional.',
    'q.4': 'What does the plugin do on my computer?', 'a.4': 'It pairs with your account using a code, receives the models you send over HTTPS and opens them as a new component. It opens no ports, runs no arbitrary code, and you can disconnect it any time from Integrations.',
    'q.5': 'How are credits spent?', 'a.5': 'Each generation or automatic fix round is 1 credit. Slider rebuilds, downloads and sending to a program are free. With your own API key no credits are used.',
    'q.6': 'Which plan should I pick?', 'a.6': 'Free is enough to try it. Pro if you design a few parts a week or use more than one program; Team if you share projects.',
    'q.7': 'Can I use it from Claude, Cursor or VS Code?', 'a.7': 'Yes, through MCP. Create a personal key on the Integrations page and add the config to your assistant. It generates the model, checks the dimensions and sends it to your connected program. Credits come from your account; revoke the key any time.',
    'q.8': 'Where is my data stored?', 'a.8': 'Your account details (name, email, profile photo), tasks and model files are stored on the AICADBridge server, tied only to your account. Deleting a task also deletes its models and messages.',
    'cta.title': 'Describe your<br><em>next part</em>', 'cta.try': 'Try free ↗', 'cta.connect': 'Connect your CAD ↗',
    'dl.fusion': 'Download plugin', 'dl.blender': 'Download add-on', 'dl.sw': 'Download bridge',
    'foot.tag': 'Parametric CAD from plain language.', 'foot.product': 'PRODUCT', 'foot.res': 'RESOURCES', 'foot.co': 'COMPANY', 'foot.sec': 'Security', 'foot.contact': 'Support'
  };
  var TR = {};
  document.querySelectorAll('[data-i18n]').forEach(function (el) { TR[el.getAttribute('data-i18n')] = el.textContent; });
  document.querySelectorAll('[data-i18n-html]').forEach(function (el) { TR[el.getAttribute('data-i18n-html')] = el.innerHTML; });

  function setLang(lang) {
    var dict = lang === 'en' ? EN : TR;
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(function (el) { var k = el.getAttribute('data-i18n'); if (dict[k] != null) el.textContent = dict[k]; });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) { var k = el.getAttribute('data-i18n-html'); if (dict[k] != null) el.innerHTML = dict[k]; });
    document.getElementById('lang').textContent = lang === 'en' ? 'TR' : 'EN';
    try { localStorage.setItem('aicad.lang', lang); } catch (e) { /* gizli pencere */ }
  }
  var initial = new URLSearchParams(location.search).get('lang');
  if (!initial) { try { initial = localStorage.getItem('aicad.lang'); } catch (e) { initial = null; } }
  if (initial === 'en') setLang('en');
  document.getElementById('lang').addEventListener('click', function () {
    setLang(document.documentElement.lang === 'en' ? 'tr' : 'en');
  });
})();
