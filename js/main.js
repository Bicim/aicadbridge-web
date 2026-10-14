/* ============================================================
   main.js - sayfa davranislari
   Kural: engine dosyalarina (scrollcraft.js/.css) dokunulmaz.
   Ozel her sey burada, engine'in act uzerinde yayinladigi
   --sc-p degerinden surulur.
   ============================================================ */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----------------------------------------------------------
     i18n: TR varsayilan (HTML icerigi), EN sozlukte.
     Kopya pear.no'dan degil; urunun gercek ozelliklerinden.
     ---------------------------------------------------------- */
  var I18N_EN = {
    'meta.title': 'AICADBridge | AI CAD Studio for Fusion 360',
    'meta.desc': 'AICADBridge is an open-source AI add-in that lets you command Fusion 360 in plain language. Planning, code generation, verification and self-healing in one flow.',

    'nav.how': 'How it works', 'nav.demo': 'Demo', 'nav.install': 'Install', 'nav.faq': 'FAQ',
    'nav.cta': 'Get it on GitHub',

    'hero.kicker': 'AICADBridge · AI-powered CAD studio for Fusion 360',
    'hero.h1': 'Talk to Fusion 360 <em>in sentences.</em>',
    'hero.tagline': 'You write the intent. <em>The model starts from words, not code.</em>',
    'hero.triad1': 'You type a command.', 'hero.triad2': 'Code is generated.', 'hero.triad3': 'Fusion draws it.',
    'hero.cmd': 'draw a cylinder 50mm across, 80mm tall, with a 20mm hole in the center',
    'hero.cta1': 'Install from GitHub', 'hero.cta2': 'How it works',
    'hero.caption': 'Real interface: the AI CAD Studio palette inside Fusion 360.',

    'how.kicker': 'How it works',
    'how.h2': 'One sentence in, <em>a model out.</em>',
    'how.s1t': 'The command', 'how.s1p': 'You describe the part in natural language, Turkish or English. No syntax to learn: the command is a sentence, the way you would say it out loud.',
    'how.s2t': 'Plan and code', 'how.s2p': 'A planner model turns the sentence into a step plan; a coder model writes real Fusion 360 Python for each step, drawing on a built-in snippet library. Plan and code stay visible at all times.',
    'how.s3t': 'Runs in Fusion, verified', 'how.s3p': 'The code executes in your Fusion session in seconds. A verification loop compares the result with the plan, geometric checks plus a rendered viewport check, and repairs what does not match.',
    'how.caption': 'Real interface: plan steps, verification and viewport-check lines.',

    'demo.kicker': 'Demo',
    'demo.h2': 'Say it, <em>let Fusion draw it.</em>',
    'demo.cmd': 'add 4 evenly spaced M6 bolt holes to the flange model',
    'demo.badge-error': '<b>Error</b> No target body found to cut or intersect',
    'demo.badge-healing': '<b>Repair</b> Error read, corrected code retried (1/3)',
    'demo.badge-success': '<b>Done</b> Model created and verified',
    'demo.verify': '<b>Verification</b>&nbsp;·&nbsp;body 0→1&nbsp;·&nbsp;cylindrical faces 0→4&nbsp;·&nbsp;matches plan',
    'demo.note': 'Schematic top view: 100 mm flange, 4 × M6 on a bolt circle.',
    'demo.slider-label': 'Outer Ø',
    'demo.slider-note': 'Parametric sliders update the model live.',

    'par.kicker': 'Parametric',
    'par.h2': 'Slide the number, <em>the model follows.</em>',
    'par.p1': 'Generated models are built on user parameters. Drag a slider in the palette and the code re-runs: the body updates live, in seconds.',
    'par.p2': 'Change the diameter, the height, the hole count, the way you wrote the sentence.',
    'par.caption': 'Real interface: parametric sliders and user parameters.',

    'modes.kicker': 'Two modes',
    'modes.h2': 'From the palette, <em>or the browser.</em>',
    'modes.c1tag': 'Inside Fusion', 'modes.c1t': 'The palette', 'modes.c1p': 'A docked panel inside Fusion 360. Commands, the plan list, code and status flow in one place, right next to your model.',
    'modes.c2tag': 'External', 'modes.c2t': 'The browser', 'modes.c2p': 'Open index.html in any browser and use the same interface over a local bridge on localhost:49876. Traffic never leaves your machine.',
    'modes.providers': 'Claude <em>·</em> GPT <em>·</em> Gemini <em>·</em> DeepSeek <em>·</em> Ollama <em>·</em> LM Studio',
    'modes.providers-p': 'Bring your own provider and API key; local models work fully offline. Planner and coder can use different models, configured from the interface or a .env file.',

    'note.statement': 'Not a magic box, <em>a pipeline you can see.</em>',
    'note.b1label': 'Full disclosure', 'note.b1t': 'What it is not',
    'note.b1l1': '<b>Fusion 360 required.</b> This is an add-in, not a standalone CAD tool.',
    'note.b1l2': '<b>Your own AI key.</b> Cloud providers bill their own API; Ollama and LM Studio run free and local.',
    'note.b1l3': '<b>AI code runs in your session.</b> Save important designs before generating.',
    'note.b1l4': '<b>Version 1.0.0.</b> A young, fast-moving project.',
    'note.b2label': 'Not for you if', 'note.b2t': 'Who should skip it',
    'note.b2l1': 'You do not use Fusion 360.',
    'note.b2l2': 'You expect flawless models in one click.',
    'note.b2l3': 'You never want to set up an API key or a local model.',

    'install.kicker': 'Install',
    'install.h2': 'Four steps, <em>five minutes.</em>',
    'install.s1t': 'Clone', 'install.s1p': 'Clone the repository from GitHub.', 'install.s1c': 'git clone https://github.com/Bicim/AICADBridge.git',
    'install.s2t': 'Copy to AddIns', 'install.s2p': 'Move the folder into Fusion\'s AddIns directory.',
    'install.s3t': 'Add your key', 'install.s3p': 'Copy .env.example to .env and paste your provider key. Ollama needs none.',
    'install.s4t': 'Run', 'install.s4p': 'In Fusion: Utilities tab, ADD-INS, run AICADBridge. The palette opens.',
    'install.cta': 'Install from GitHub',
    'install.caption': 'Real interface: provider settings in the palette.',

    'faq.kicker': 'FAQ', 'faq.h2': 'Asked <em>before.</em>',
    'faq.q1': 'Is it free?', 'faq.a1': 'The code is open source under MIT. You only pay the API cost of the AI provider you choose; with Ollama or LM Studio everything runs local and free.',
    'faq.q2': 'Which AI models does it use?', 'faq.a2': 'It works with the Claude, GPT, Gemini and DeepSeek APIs, and with local models through Ollama or LM Studio. You type in the exact model name from your own provider; planner and coder can be different models.',
    'faq.q3': 'Which operating systems?', 'faq.a3': 'Windows and macOS, anywhere Fusion 360 runs.',
    'faq.q4': 'Where does my data go?', 'faq.a4': 'Commands go only to the provider you configured. With Ollama or LM Studio nothing leaves your computer. The browser mode bridge listens on localhost only.',
    'faq.q5': 'How does the browser mode work?', 'faq.a5': 'The add-in starts a tiny local server on localhost:49876. You open the bundled index.html in a browser and get the same interface; the traffic stays on your machine.',
    'faq.q6': 'What if the generated code fails?', 'faq.a6': 'The self-healing loop reads the error, sends it back to the model and re-runs the corrected code, up to three attempts. Verification rounds compare the result with the plan. A repair loop, not a guarantee.',

    'footer.close': 'Say it, <em>Fusion draws it.</em>',
    'footer.issues': 'Questions and issues', 'footer.legal': 'AICADBridge is an independent project, not affiliated with or endorsed by Autodesk. Fusion 360 is a trademark of Autodesk.'
  };

  function applyLang(code) {
    var dict = code === 'en' ? I18N_EN : null;
    document.documentElement.lang = code === 'en' ? 'en' : 'tr';
    document.title = code === 'en' ? I18N_EN['meta.title'] : document.documentElement.dataset.titleTr;
    var mdesc = document.querySelector('meta[name="description"]');
    if (mdesc) mdesc.setAttribute('content', code === 'en' ? I18N_EN['meta.desc'] : document.documentElement.dataset.descTr);
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (dict && dict[key]) el.innerHTML = dict[key];
      else if (el.dataset.orig !== undefined) el.innerHTML = el.dataset.orig;
    });
    var btn = document.getElementById('langToggle');
    if (btn) btn.textContent = code === 'en' ? 'TR' : 'EN';
    try { localStorage.setItem('aicad-lang', code); } catch (e) {}
  }

  function rebuildEngine() {
    // Dil degisince engine'in bolunmus metinleri bayat kalir:
    // yok et, bolukleri temizle, yeniden mount et.
    if (window.ScrollCraft) {
      window.ScrollCraft.instances.slice().forEach(function (api) { api.destroy(); });
    }
    document.querySelectorAll('.sc-is-split').forEach(function (el) {
      el.__scSplit = null;
      el.classList.remove('sc-is-split');
    });
    document.querySelectorAll('[data-sc-cue]').forEach(function (el) {
      el.style.opacity = '';
      el.style.transform = '';
      el.style.pointerEvents = '';
    });
    document.querySelectorAll('[data-sc-in], [data-sc-stagger] > *').forEach(function (el) {
      el.classList.remove('sc-in');
      el.style.transitionDelay = '';
    });
    if (window.ScrollCraft) window.ScrollCraft.mount(document);
    typeHeroCommand();
    // Anlık --sc-p'den türet: dil değişimi durumun son karesine atlamasın
    var cur = parseFloat(demoAct && demoAct.style.getPropertyValue('--sc-p'));
    driveDemo(isNaN(cur) ? 0 : cur, true);
  }

  /* ----------------------------------------------------------
     Hero komut satiri: yuklenince bir kez yazar (imza tohumu).
     Demo aktinde ayni komut scroll ile yeniden yazilir (engine).
     ---------------------------------------------------------- */
  var heroCmdEl, heroCmdText;

  function typeHeroCommand() {
    if (!heroCmdEl) return;
    heroCmdText = heroCmdEl.querySelector('.cmdline__text');
    // Metin kaynağı her zaman span'in güncel hali (i18n sonrası taze olur)
    var text = heroCmdText.textContent.trim();
    if (reduce) { heroCmdText.textContent = text; return; }
    heroCmdText.textContent = '';
    var i = 0;
    setTimeout(function step() {
      if (i <= text.length) {
        heroCmdText.textContent = text.slice(0, i);
        i += 1;
        setTimeout(step, 26 + Math.random() * 34);
      }
    }, 700);
  }

  /* ----------------------------------------------------------
     IMZA HAREKET surucusu: demo aktinin --sc-p degerini okur,
     alt araliklara haritalar. Engine'e dokunmaz.
     p: 0.40-0.68 flans semasi cizilir (sirali vurus)
     p: 0.66-0.76 duzeltilen kod satiri yanar
     p: 0.80-1.00 slider surunur, cap degeri akar
     Geri sarildiginda ayni hesap tersine isler: onarim yeniden
     oynar. Bu hareketin ta kendisi.
     ---------------------------------------------------------- */
  var demoAct, flangePaths, fixedLine, sliderFill, sliderThumb, sliderVal;
  var lastP = -1;

  function ramp(p, a, b) {
    var t = (p - a) / (b - a);
    if (t < 0) t = 0; if (t > 1) t = 1;
    return t * t * (3 - 2 * t);
  }

  function driveDemo(p, force) {
    if (!flangePaths || !flangePaths.length) return;
    if (!force && Math.abs(p - lastP) < 0.0005) return;
    lastP = p;

    var d = reduce ? 1 : ramp(p, 0.40, 0.68);
    var n = flangePaths.length;
    for (var i = 0; i < n; i++) {
      var local = d * n - i;
      var off = 1 - (local < 0 ? 0 : local > 1 ? 1 : local);
      flangePaths[i].style.strokeDashoffset = off.toFixed(3);
    }

    if (fixedLine) fixedLine.classList.toggle('is-fixed', reduce || p > 0.70);

    if (sliderFill) {
      var t = reduce ? 1 : ramp(p, 0.80, 1);
      var pct = 30 + t * 70;
      sliderFill.style.width = pct.toFixed(1) + '%';
      sliderThumb.style.left = pct.toFixed(1) + '%';
      sliderVal.textContent = '\u00d8 ' + Math.round(40 + t * 40) + ' mm';
    }
  }

  function demoLoop() {
    if (demoAct) {
      var v = parseFloat(demoAct.style.getPropertyValue('--sc-p'));
      if (!isNaN(v)) driveDemo(v, false);
      // Geri sicrama korumasi: demo ustune aninda atlanyldiginda (reduced-motion
      // hash ziplayislari, tarayici geri tusu) engine drift'i son koyu degeri
      // birakir ve hero koyu-ustu-koyu kalir. Demo eyleminin ustundeysek kokteki
      // satici ici degeri kaldir: :root varsayiani (kagit) geri doner.
      if (window.scrollY + window.innerHeight < demoAct.offsetTop &&
          document.documentElement.style.getPropertyValue('--sc-canvas') !== '') {
        document.documentElement.style.removeProperty('--sc-canvas');
      }
    }
    requestAnimationFrame(demoLoop);
  }

  /* ----------------------------------------------------------
     Nav: asagi kaydirinca cekilir, yukari kaydirinca doner.
     ---------------------------------------------------------- */
  function navBehavior() {
    var nav = document.querySelector('.nav');
    if (!nav) return;
    var lastY = window.scrollY;
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      if (y < 240 || y < lastY) nav.classList.remove('is-hidden');
      else if (y - lastY > 6) nav.classList.add('is-hidden');
      lastY = y;
    }, { passive: true });
  }

  /* ----------------------------------------------------------
     Baslangic
     ---------------------------------------------------------- */
  function init() {
    var de = document.documentElement;
    de.dataset.titleTr = document.title;
    var md = document.querySelector('meta[name="description"]');
    if (md) de.dataset.descTr = md.getAttribute('content');

    // Orijinal TR metinleri sakla (dil geri donusleri icin)
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      el.dataset.orig = el.innerHTML;
    });

    heroCmdEl = document.getElementById('heroCmd');
    demoAct = document.getElementById('demo');
    flangePaths = document.querySelectorAll('#flange .draw');
    fixedLine = document.getElementById('fixedLine');
    sliderFill = document.querySelector('.slider-demo .fill');
    sliderThumb = document.querySelector('.slider-demo .thumb');
    sliderVal = document.getElementById('sliderVal');

    if (window.ScrollCraft) window.ScrollCraft.mount(document);

    typeHeroCommand();
    navBehavior();
    demoLoop();

    var params = new URLSearchParams(location.search);
    var lang = params.get('lang');
    if (!lang) { try { lang = localStorage.getItem('aicad-lang'); } catch (e) {} }
    if (lang === 'en') applyLang('en');

    var btn = document.getElementById('langToggle');
    if (btn) btn.addEventListener('click', function () {
      var next = (document.documentElement.lang === 'en') ? 'tr' : 'en';
      applyLang(next);
      rebuildEngine();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
