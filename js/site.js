/* AICADBridge tanıtım sitesi: uygulama bağlantıları, MCP adresi, TR/EN, fiyat dönemi. */
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
      toggles.forEach(function (x) { x.classList.toggle('on', x === b); });
      document.querySelectorAll('.amt [data-m]').forEach(function (s) { s.textContent = s.getAttribute('data-' + per); });
    });
  });

  /* dil: Türkçe metin HTML'den okunur, İngilizce sözlük burada */
  var EN = {
    'skip': 'Skip to content', 'nav.integrations': 'Integrations', 'nav.start': 'Get started', 'nav.pricing': 'Pricing', 'nav.faq': 'FAQ', 'nav.open': 'Open the app',
    'hero.title': 'Describe. Dimension. <em>Make.</em>',
    'hero.lead': 'Describe a part in plain words; AICADBridge builds the parametric 3D model, verifies it and sends it to your CAD program.',
    'hero.cta1': 'Try free', 'hero.cta2': 'Download the installer', 'hero.fine': 'No card required · 30 free credits a day', 'hero.google': 'AICADBridge lets you sign in with Google; it only uses your name, e-mail and profile picture to create your account. <a href="gizlilik.html">Privacy policy</a>',
    'hero.q': 'Flange, Ø100 mm, 10 mm thick; 6 M6 bolt holes, Ø35 hole in the center', 'hero.ans': 'Flange ready: Ø100 × 10 mm, 6 × Ø6.6 holes, volume 66.9 cm³. Verification passed.',
    'works.t': 'Works with',
    'how.title': 'How it works',
    'how.1': 'Describe', 'how.1d': 'Write the part and its sizes. The model builds a parametric plan, verifies it on its own kernel and fixes itself if needed.',
    'how.2': 'Adjust the dimensions', 'how.2d': 'Every dimension is a slider. Change it and the model rebuilds in seconds, no credits.',
    'how.3': 'Send to your program', 'how.3d': 'It opens as a new part in your connected CAD program. Or download STEP, STL, 3MF or GLB.',
    'int.title': 'Integrations', 'int.lead': 'The plugin pairs with your account using a device code and only makes outbound HTTPS calls; no ports are opened on your machine.',
    'st.ready': 'Ready', 'st.folder': 'STEP folder', 'int.more': 'And more coming soon: all integrations →',
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
    'faq.title': 'FAQ',
    'q.1': 'Can it edit my existing model?', 'a.1': 'Yes, as long as you continue in the same task. The model starts from the latest plan and changes only what you asked; the old version is kept.',
    'q.2': 'Can I use it without a CAD program?', 'a.2': 'Yes. Web Studio works on its own: view the model in the browser, tweak it with sliders and download STEP, STL, 3MF or GLB.',
    'q.3': 'What does the plugin do on my computer?', 'a.3': 'It pairs with your account using a code, receives the models you send over HTTPS and opens them as a new part. It opens no ports; you can disconnect it any time from Integrations.',
    'q.4': 'How are credits spent?', 'a.4': 'Each generation or automatic fix round is 1 credit. Slider rebuilds, downloads and sending to a program are free; with your own API key no credits are used.',
    'q.5': 'Can I use it from Claude, Cursor or VS Code?', 'a.5': 'Yes, through MCP. Create a personal key on the Integrations page and add the config to your assistant. Credits come from your account; revoke the key any time.',
    'q.6': 'Where is my data stored?', 'a.6': 'Your account details (name, email, profile photo), tasks and model files are stored on the AICADBridge server, tied only to your account. Deleting a task also deletes its models and messages.',
    'cta.title': 'Describe your <em>next part</em>', 'cta.try': 'Try free', 'cta.connect': 'Connect your CAD',
    'foot.tm': 'Product names and logos are trademarks of their respective owners; they are used only to indicate compatibility and do not imply affiliation or endorsement.'
  };
  var TR = {};
  document.querySelectorAll('[data-i18n]').forEach(function (el) { TR[el.getAttribute('data-i18n')] = el.textContent; });
  document.querySelectorAll('[data-i18n-html]').forEach(function (el) { TR[el.getAttribute('data-i18n-html')] = el.innerHTML; });

  var langBtn = document.getElementById('lang');
  function setLang(lang) {
    var dict = lang === 'en' ? EN : TR;
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(function (el) { var k = el.getAttribute('data-i18n'); if (dict[k] != null) el.textContent = dict[k]; });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) { var k = el.getAttribute('data-i18n-html'); if (dict[k] != null) el.innerHTML = dict[k]; });
    langBtn.textContent = lang === 'en' ? 'TR' : 'EN';
    try { localStorage.setItem('aicad.lang', lang); } catch (e) { /* gizli pencere */ }
  }
  var initial = new URLSearchParams(location.search).get('lang');
  if (!initial) { try { initial = localStorage.getItem('aicad.lang'); } catch (e) { initial = null; } }
  if (initial === 'en') setLang('en');
  langBtn.addEventListener('click', function () { setLang(document.documentElement.lang === 'en' ? 'tr' : 'en'); });
})();
