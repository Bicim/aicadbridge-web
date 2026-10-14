/* tests/verify.js - Faz 5 dogrulama:
   1) olu kaydirma  2) opaklik sozlesmesi  3) kompozit kontrast
   4) yatay tasma  5) baslik kirpma  6) em-dash yasagi  7) gorsel yukleme
   8) i18n gecisi  9) reduced-motion gecisi  10) ekran goruntuleri + contact sheet
   Cikti: VALIDATION.md + tests/screenshots/ */
'use strict';

var path = require('path');
var fs = require('fs');
var http = require('http');
var { chromium } = require('playwright');

var server = require('./server.js');
var PORT = 8124;
var BASE = 'http://localhost:' + PORT + '/';
var SHOTS = path.join(__dirname, 'screenshots');
var REPORT = [];

function log(line) { console.log(line); REPORT.push(line); }
function pass(name) { log('PASS  ' + name); }
function fail(name, detail) { log('FAIL  ' + name + (detail ? '  -> ' + detail : '')); process.exitCode = 1; }
var checks = 0, failed = 0;
function ok(cond, name, detail) {
  checks++;
  if (cond) pass(name);
  else { fail(name, detail); failed++; }
}

/* --- WCAG kontrast --- */
function lum(r, g, b) {
  var f = function (c) { c /= 255; return c <= .03928 ? c / 12.92 : Math.pow((c + .055) / 1.055, 2.4); };
  return .2126 * f(r) + .7152 * f(g) + .0722 * f(b);
}
function ratio(fg, bg) {
  var l1 = lum(fg[0], fg[1], fg[2]), l2 = lum(bg[0], bg[1], bg[2]);
  var a = Math.max(l1, l2), b = Math.min(l1, l2);
  return (a + .05) / (b + .05);
}
function parseRGB(s) {
  var m = /rgba?\(([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/.exec(s || '');
  return m ? [+m[1], +m[2], +m[3]] : null;
}

/* Sayfa baglami: bir metin ogesinin efektif arka planini bul.
   Yari saydam katmanlari (rozet renkleri gibi) alttaki ilk dolu
   yuzey uzerinde komposit eder. */
var SAMPLE_BG = function (sel) {
  var el = document.querySelector(sel);
  if (!el) return null;
  var layers = [], base = null, node = el;
  function parse(c) {
    var m = /rgba?\(([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+))?\)/.exec(c || '');
    return m ? [+m[1], +m[2], +m[3], m[4] === undefined ? 1 : parseFloat(m[4])] : null;
  }
  while (node && node.nodeType === 1) {
    var p = parse(getComputedStyle(node).backgroundColor);
    if (p) {
      if (p[3] >= 0.999) { base = [p[0], p[1], p[2]]; break; }
      layers.push(p);
    }
    node = node.parentElement;
  }
  if (!base) {
    var cv = getComputedStyle(document.documentElement).getPropertyValue('--sc-canvas').trim();
    var cm = parse(cv);
    if (cm) base = [cm[0], cm[1], cm[2]];
    else base = [250, 249, 247];
  }
  for (var i = layers.length - 1; i >= 0; i--) {
    var L = layers[i];
    base = [L[3] * L[0] + (1 - L[3]) * base[0], L[3] * L[1] + (1 - L[3]) * base[1], L[3] * L[2] + (1 - L[3]) * base[2]];
  }
  var cs = getComputedStyle(el);
  return {
    fg: cs.color,
    bg: 'rgb(' + Math.round(base[0]) + ',' + Math.round(base[1]) + ',' + Math.round(base[2]) + ')',
    text: (el.innerText || '').trim().slice(0, 40)
  };
};

async function settle(page, ms) {
  await page.waitForTimeout(ms || 220);
}

/* Tarama anligi: cue/reveal opakliklari + olcuculer */
var SNAP = function () {
  var demo = document.getElementById('demo');
  var cues = {};
  document.querySelectorAll('[data-sc-cue]').forEach(function (el) {
    var k = el.dataset.vkey;
    var o = parseFloat(getComputedStyle(el).opacity);
    if (!(k in cues) || o > cues[k]) cues[k] = o;
  });
  var revs = {};
  document.querySelectorAll('[data-sc-in], [data-sc-stagger] > *').forEach(function (el) {
    var k = el.dataset.rkey;
    var o = parseFloat(getComputedStyle(el).opacity);
    if (!(k in revs) || o > revs[k]) revs[k] = o;
  });
  return {
    p: demo ? demo.style.getPropertyValue('--sc-p') : '',
    canvas: getComputedStyle(document.documentElement).getPropertyValue('--sc-canvas').trim(),
    cues: cues, revs: revs,
    y: scrollY
  };
};

async function main() {
  fs.mkdirSync(SHOTS, { recursive: true });
  await new Promise(function (res) { server.listen(PORT, res); });
  var browser = await chromium.launch();

  /* =================== MASAUSTU: ana tarama =================== */
  var page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  var errors = [];
  page.on('pageerror', function (e) { errors.push('pageerror: ' + e.message); });
  page.on('console', function (m) { if (m.type() === 'error') errors.push('console: ' + m.text()); });

  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: 'html{scroll-behavior:auto!important}' }); /* olcumler ani kaydirmada alinir */
  await page.evaluate(function () { return document.fonts.ready; });
  await settle(page, 600);

  /* --- 1+2: yavas tarama: cue maksimumlari + olcuculer --- */
  var maxH = await page.evaluate(function () { return document.body.scrollHeight - innerHeight; });
  var steps = 44;
  var cueKeys = await page.evaluate(function () {
    return Array.from(document.querySelectorAll('[data-sc-cue]')).map(function (el, i) {
      el.dataset.vkey = 'c' + i;
      return { key: 'c' + i, label: (el.textContent || '').trim().slice(0, 32) };
    });
  });
  var revealKeys = await page.evaluate(function () {
    var els = Array.from(document.querySelectorAll('[data-sc-in], [data-sc-stagger] > *'));
    return els.map(function (el, i) {
      el.dataset.rkey = 'r' + i;
      return { key: 'r' + i, label: (el.textContent || '').trim().slice(0, 32) };
    });
  });

  var cueMax = {}, revealMax = {}, probeStates = [], demoPseq = [];
  var mergeSnap = function (snap) {
    Object.keys(snap.cues).forEach(function (k) { if (!(k in cueMax) || snap.cues[k] > cueMax[k]) cueMax[k] = snap.cues[k]; });
    Object.keys(snap.revs).forEach(function (k) { if (!(k in revealMax) || snap.revs[k] > revealMax[k]) revealMax[k] = snap.revs[k]; });
    probeStates.push(snap.p + '|' + snap.canvas + '|' + snap.y);
    if (snap.p !== '') demoPseq.push({ y: snap.y, p: parseFloat(snap.p) });
  };
  for (var s = 0; s <= steps; s++) {
    var y = Math.round(maxH * s / steps);
    await page.evaluate(function (yy) { scrollTo(0, yy); }, y);
    await settle(page, 150);
    mergeSnap(await page.evaluate(SNAP));
  }
  /* Tarama sonu: son gecisler otursun diye bekleyip yeniden ornekle,
     sonra sayfa basina donup hero tarafini da tazele */
  await settle(page, 900);
  mergeSnap(await page.evaluate(SNAP));
  await page.evaluate(function () { scrollTo(0, 0); });
  await settle(page, 900);
  mergeSnap(await page.evaluate(SNAP));

  /* 1) olu kaydirma: surekli degisen olculer */
  var distinct = new Set(probeStates).size;
  ok(distinct >= steps * 0.8, 'olu kaydirma yok: ' + distinct + '/' + (steps + 1) + ' adim benzersiz');

  /* Demo pin araliginda --sc-p asagi kaydirista her adimda artmali
     (geri sarma ornekleri bilinclu olarak haric: imza hareketin kendisi) */
  var pinOk = true, pinSamples = 0;
  for (var i = 1; i < demoPseq.length; i++) {
    var a = demoPseq[i - 1], b = demoPseq[i];
    if (b.y >= a.y && a.p > 0.02 && b.p < 0.98 && b.p <= a.p) { pinOk = false; break; }
    if (a.p > 0 && a.p < 1) pinSamples++;
  }
  ok(pinOk && pinSamples > 8, 'demo pini canli: --sc-p monoton artiyor (' + pinSamples + ' ornek)');

  /* 2) opaklik sozlesmesi */
  var dimCues = cueKeys.filter(function (c) { return (cueMax[c.key] || 0) < 0.95; });
  ok(dimCues.length === 0, 'cue opaklik sozlesmesi: ' + (cueKeys.length - dimCues) + '/' + cueKeys.length +
    (dimCues.length ? '  soluk: ' + dimCues.map(function (c) { return c.label; }).join(' | ') : ''));
  var dimReveals = revealKeys.filter(function (r) { return (revealMax[r.key] || 0) < 0.95; });
  ok(dimReveals.length === 0, 'giris gorunurlugu (data-sc-in): ' + (revealKeys.length - dimReveals.length) + '/' + revealKeys.length +
    (dimReveals.length ? '  soluk: ' + dimReveals.map(function (r) { return r.label + ' (' + (revealMax[r.key] || 0).toFixed(2) + ')'; }).join(' | ') : ''));

  /* --- 3) kompozit kontrast --- */
  var demoMidY = await page.evaluate(function () {
    var d = document.getElementById('demo');
    return d.offsetTop + (d.offsetHeight - innerHeight) * 0.55;
  });
  var anchors = [
    { y: 0, sels: ['h1', '.tagline', '.step p', '.product-shot figcaption'] },
    { y: demoMidY, sels: ['.demo h2', '.badge--success', '.verify-line', '.schematic-note'] },
    { y: maxH, sels: ['.faq p', '.footer__legal', '.footer__meta'] }
  ];
  var worst = 99, worstTxt = '', worstPair = '';
  for (var an = 0; an < anchors.length; an++) {
    var A = anchors[an];
    await page.evaluate(function (o) { scrollTo(0, o.y); }, { y: A.y });
    await settle(page, 600);
    for (var si = 0; si < A.sels.length; si++) {
      var r = await page.evaluate(SAMPLE_BG, A.sels[si]);
      if (!r || !r.text) continue;
      var fg = parseRGB(r.fg), bg = parseRGB(r.bg);
      if (!fg || !bg) continue;
      var rr = ratio(fg, bg);
      if (rr < worst) { worst = rr; worstTxt = r.text; worstPair = r.fg + ' on ' + r.bg; }
    }
  }
  ok(worst >= 4.5, 'WCAG AA govde kontrasti: en dusuk ' + worst.toFixed(2) + ':1 ("' + worstTxt + '" ' + worstPair + ')');

  /* --- 4) em-dash yasagi --- */
  var emdash = await page.evaluate(function () { return document.body.innerText.includes('\u2014'); });
  ok(!emdash, 'gorunur metinde em dash yok');

  /* --- 5) gorseller yuklendi + boyut bildirildi --- */
  var imgStat = await page.evaluate(function () {
    return Array.from(document.images).map(function (im) {
      return { ok: im.complete && im.naturalWidth > 0, wh: !!(im.getAttribute('width') && im.getAttribute('height')) };
    });
  });
  ok(imgStat.every(function (x) { return x.ok; }), 'tum gorseller yuklendi (' + imgStat.length + ')');
  ok(imgStat.every(function (x) { return x.wh; }), 'CLS icin width/height bildirildi');

  /* --- 6) baslik kirpma (<= 3 satir) --- */
  var wraps = await page.evaluate(function () {
    return Array.from(document.querySelectorAll('h1, h2')).map(function (el) {
      var lh = parseFloat(getComputedStyle(el).lineHeight) || 1;
      return Math.round(el.offsetHeight / lh);
    }).filter(function (n) { return n > 3; }).length;
  });
  ok(wraps === 0, 'basliklar 3 satiri asmıyor');

  /* --- 7) i18n gecisi --- */
  var trH1 = await page.evaluate(function () { return document.querySelector('h1').innerHTML; });
  await page.evaluate(function () { scrollTo(0, 0); });  // nav gorunur olsun
  await settle(page, 500);
  await page.click('#langToggle');
  await settle(page, 500);
  var enLang = await page.evaluate(function () { return document.documentElement.lang; });
  var enH1 = await page.evaluate(function () { return document.querySelector('h1').innerHTML; });
  ok(enLang === 'en' && enH1 !== trH1, 'dil gecisi TR->EN (h1 degisti)');
  await page.click('#langToggle');
  await settle(page, 500);
  var backLang = await page.evaluate(function () { return document.documentElement.lang; });
  ok(backLang === 'tr', 'dil gecisi EN->TR');
  var enUrl = await page.evaluate(function () { return location.search; });
  await page.goto(BASE + '?lang=en', { waitUntil: 'networkidle' });
  var qLang = await page.evaluate(function () { return document.documentElement.lang; });
  ok(qLang === 'en', '?lang=en dogrudan acilis');
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.evaluate(function () { try { localStorage.clear(); } catch (e) {} });
  await page.reload({ waitUntil: 'networkidle' });
  await page.evaluate(function () { return document.fonts.ready; });
  await settle(page, 500);

  /* --- 8) ekran goruntuleri (1280) --- */
  async function shot(name, sel, frac) {
    if (sel) {
      await page.evaluate(function (s) {
        var el = document.querySelector(s);
        if (el) scrollTo(0, el.getBoundingClientRect().top + scrollY - 60);
      }, sel);
    } else if (frac !== undefined) {
      await page.evaluate(function (o) { scrollTo(0, Math.round(o.maxH * o.frac)); }, { frac: frac, maxH: maxH });
    }
    await settle(page, 500);
    await page.screenshot({ path: path.join(SHOTS, name + '.png') });
  }
  await shot('1280-01-hero', '#top');
  await shot('1280-02-nasil', '#nasil');
  await shot('1280-03-demo-typing', '#demo');
  await page.evaluate(function () {
    var d = document.getElementById('demo');
    scrollTo(0, d.offsetTop + (d.offsetHeight - innerHeight) * 0.5);
  });
  await settle(page, 500);
  await page.screenshot({ path: path.join(SHOTS, '1280-04-demo-mid.png') });
  await page.evaluate(function () {
    var d = document.getElementById('demo');
    scrollTo(0, d.offsetTop + (d.offsetHeight - innerHeight) * 0.82);
  });
  await settle(page, 500);
  await page.screenshot({ path: path.join(SHOTS, '1280-05-demo-peak.png') });
  await shot('1280-06-parametre', '#parametre');
  await shot('1280-07-modlar', '#modlar');
  await shot('1280-08-aciknot', '#aciknot');
  await shot('1280-09-kurulum', '#kurulum');
  await shot('1280-10-sss', '#sss');
  await shot('1280-11-footer', null, 1);

  /* --- 9) goreceli tasma matrisi --- */
  for (var wv of [[360, 740], [375, 667], [768, 1024], [1280, 800], [1920, 1080]]) {
    await page.setViewportSize({ width: wv[0], height: wv[1] });
    await page.reload({ waitUntil: 'networkidle' });
    await settle(page, 500);
    var over = await page.evaluate(function () { return document.documentElement.scrollWidth - document.documentElement.clientWidth; });
    ok(over <= 1, 'yatay tasma yok @' + wv[0] + 'px (fark ' + over + 'px)');
    if (wv[0] === 375) {
      await shot('375-hero', '#top');
      await page.evaluate(function () {
        var d = document.getElementById('demo');
        scrollTo(0, d.offsetTop + (d.offsetHeight - innerHeight) * 0.5);
      });
      await settle(page, 500);
      await page.screenshot({ path: path.join(SHOTS, '375-demo-mid.png') });
    }
    if (wv[0] === 768) {
      await shot('768-hero', '#top');
      await page.evaluate(function () {
        var d = document.getElementById('demo');
        scrollTo(0, d.offsetTop + (d.offsetHeight - innerHeight) * 0.5);
      });
      await settle(page, 500);
      await page.screenshot({ path: path.join(SHOTS, '768-demo-mid.png') });
    }
    if (wv[0] === 1920) {
      await shot('1920-hero', '#top');
      await page.evaluate(function () {
        var d = document.getElementById('demo');
        scrollTo(0, d.offsetTop + (d.offsetHeight - innerHeight) * 0.5);
      });
      await settle(page, 500);
      await page.screenshot({ path: path.join(SHOTS, '1920-demo-mid.png') });
    }
  }

  /* --- 10) reduced-motion gecisi --- */
  var rmPage = await browser.newPage({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' });
  var rmErrors = [];
  rmPage.on('pageerror', function (e) { rmErrors.push(e.message); });
  await rmPage.goto(BASE, { waitUntil: 'networkidle' });
  await settle(page, 400);
  var rmMax = 0, flangeDrawn = false;
  for (var rs = 0; rs <= 30; rs++) {
    await rmPage.evaluate(function (o) { scrollTo(0, Math.round(o.maxH * o.frac)); }, { frac: rs / 30, maxH: maxH });
    await settle(rmPage, 120);
    var st = await rmPage.evaluate(function () {
      var cues = Array.from(document.querySelectorAll('[data-sc-cue]')).map(function (el) { return parseFloat(getComputedStyle(el).opacity); });
      var max = Math.max.apply(null, cues.concat([0]));
      var p = document.getElementById('flange');
      var off = p ? Array.from(p.querySelectorAll('.draw')).map(function (el) { return parseFloat(el.style.strokeDashoffset || '1'); }) : [];
      return { max: max, flangeMin: off.length ? Math.min.apply(null, off) : 1 };
    });
    rmMax = Math.max(rmMax, st.max);
    flangeDrawn = flangeDrawn || st.flangeMin <= 0.01;
  }
  ok(rmErrors.length === 0, 'reduced-motion: sayfa hatasiz');
  ok(rmMax >= 0.9, 'reduced-motion: ipuclari gorunur (maks ' + rmMax.toFixed(2) + ')');
  ok(flangeDrawn, 'reduced-motion: sema tam cizili (statik alternatif)');
  await rmPage.close();

  /* --- konsol hatalari --- */
  ok(errors.length === 0, 'konsol/sayfa hatasi yok' + (errors.length ? '  -> ' + errors.slice(0, 3).join(' ; ') : ''));
  await page.close();

  /* --- contact sheet --- */
  var files = fs.readdirSync(SHOTS).filter(function (f) { return f.endsWith('.png'); }).sort();
  var sheet = ['<!DOCTYPE html><html lang="tr"><head><meta charset="UTF-8"><title>Contact sheet</title>',
    '<style>body{background:#111;color:#ddd;font:13px/1.5 ui-monospace,monospace;padding:24px}',
    'h1{font:400 20px Georgia} .g{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:14px}',
    'figure{margin:0}img{width:100%;border:1px solid #333}figcaption{padding:4px 0}</style></head><body>',
    '<h1>AICADBridge contact sheet</h1><div class="g>'].join('');
  files.forEach(function (f) {
    sheet += '<figure><img src="' + f + '" alt=""><figcaption>' + f + '</figcaption></figure>';
  });
  sheet += '</div></body></html>';
  fs.writeFileSync(path.join(SHOTS, 'contact-sheet.html'), sheet, 'utf8');
  log('INFO  contact sheet: tests/screenshots/contact-sheet.html (' + files.length + ' kare)');

  await browser.close();
  server.close();

  /* --- rapor --- */
  var md = ['# VALIDATION.md', '',
    'Faz 5 dogrulama raporu. Uretim: `node tests/verify.js` (Playwright/Chromium, headless).',
    'Tarih: ' + new Date().toISOString().slice(0, 19).replace('T', ' '), '', '## Sonuclar', ''];
  REPORT.forEach(function (l) { md.push(l.replace(/PASS  /, '- [x] ').replace(/FAIL  /, '- [ ] ').replace(/INFO  /, '- ')); });
  md.push('', '## Ekran goruntuleri', '',
    '`tests/screenshots/` (contact sheet: `contact-sheet.html`). Goruntuler Dogrulama anindan alinmistir;', '',
    'Toplam denetim: ' + checks + ' · Basarisiz: ' + failed, '');
  fs.writeFileSync(path.join(__dirname, '..', 'VALIDATION.md'), md.join('\n'), 'utf8');
  log('INFO  rapor: VALIDATION.md');
  log(failed === 0 ? 'SONUC: ' + checks + '/' + checks + ' denetim gecti' : 'SONUC: ' + failed + ' denetim basarisiz');
  process.exit(failed === 0 ? 0 : 1);
}

main().catch(function (e) {
  console.error('verify crash:', e);
  process.exit(1);
});
