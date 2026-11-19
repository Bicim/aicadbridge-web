/* tests/verify.js - koyu teknik site doğrulaması (playwright).
   1) sayfa/konsol hatası  2) yatay taşma 390/768/1440  3) iç bağlantı hedefleri
   4) uygulama bağlantıları  5) fiyat dönemi  6) TR/EN geçişi  7) indirme dosyaları
   8) temel kontrast  9) em-dash yasağı  10) ekran görüntüleri
   Çıktı: konsol + tests/screenshots/  (çıkış kodu 1 = başarısız) */
'use strict';

var path = require('path');
var fs = require('fs');
var { chromium } = require('playwright');
var server = require('./server.js');

var PORT = 8125;
var BASE = 'http://localhost:' + PORT + '/';
var SHOTS = path.join(__dirname, 'screenshots');
var failed = 0, checks = 0;
function ok(cond, name, detail) {
  checks++;
  if (cond) console.log('PASS  ' + name);
  else { failed++; console.log('FAIL  ' + name + (detail ? '  -> ' + detail : '')); }
}

function lum(c) {
  var f = function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
}
function ratio(a, b) { var x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }

async function main() {
  await new Promise(function (res) { server.listen(PORT, res); });
  fs.mkdirSync(SHOTS, { recursive: true });
  var browser = await chromium.launch();
  try {
    for (var w of [390, 768, 1440]) {
      var page = await browser.newPage({ viewport: { width: w, height: 900 } });
      var errors = [];
      page.on('pageerror', function (e) { errors.push(e.message); });
      page.on('console', function (m) { if (m.type() === 'error') errors.push(m.text()); });
      await page.goto(BASE, { waitUntil: 'networkidle' });
      ok(errors.length === 0, w + 'px hata yok', errors.join(' | '));
      var over = await page.evaluate(function () {
        var W = document.documentElement.clientWidth;
        return Array.from(document.querySelectorAll('body *')).filter(function (e) {
          var r = e.getBoundingClientRect(); return r.width && r.right > W + 1 && getComputedStyle(e).position !== 'fixed';
        }).slice(0, 5).map(function (e) { return e.tagName + '.' + e.className; });
      });
      ok(over.length === 0, w + 'px yatay taşma yok', over.join(', '));
      await page.screenshot({ path: path.join(SHOTS, 'site-' + w + '.png'), fullPage: true });
      if (w !== 1440) { await page.close(); continue; }

      var anchors = await page.evaluate(function () {
        return Array.from(document.querySelectorAll('a[href^="#"]')).map(function (a) { return a.getAttribute('href'); })
          .filter(function (h) { return h.length > 1 && !document.getElementById(h.slice(1)); });
      });
      ok(anchors.length === 0, 'iç bağlantıların hedefi var', anchors.join(', '));

      var appLinks = await page.evaluate(function () {
        return Array.from(document.querySelectorAll('[data-app]')).filter(function (a) { return !/aicadbridge-studio\/#\//.test(a.href); }).length;
      });
      ok(appLinks === 0, 'uygulama bağlantıları Studio\'ya gidiyor');

      await page.click('.toggle button[data-period="y"]');
      var pro = await page.textContent('.plan.hot .amt [data-m]');
      ok(pro === '16', 'yıllık fiyat Pro = 16', pro);
      await page.click('.toggle button[data-period="m"]');

      await page.click('#lang');
      var h1 = await page.textContent('.hero h1');
      ok(/Describe/.test(h1) && (await page.getAttribute('html', 'lang')) === 'en', 'EN geçişi', h1);
      await page.click('#lang');
      ok(/Anlat/.test(await page.textContent('.hero h1')), 'TR geri dönüşü');

      await page.click('.cap-tabs button[data-tab="2"]');
      ok(await page.isVisible('.cap-panel[data-cap="2"]'), 'yetenek sekmesi değişiyor');

      var dls = await page.evaluate(function () { return Array.from(document.querySelectorAll('.dl a')).map(function (a) { return a.href; }); });
      for (var u of dls) {
        var r = await page.request.get(u);
        ok(r.status() === 200 && (await r.body()).slice(0, 2).toString() === 'PK', 'indirme ' + u.split('/').pop());
      }

      var pairs = await page.evaluate(function () {
        function rgb(s) { var m = s.match(/\d+(\.\d+)?/g); return m ? m.slice(0, 3).map(Number) : [0, 0, 0]; }
        function bg(el) {
          while (el) { var c = getComputedStyle(el).backgroundColor; if (c && !/rgba\(0, 0, 0, 0\)|transparent/.test(c)) return rgb(c); el = el.parentElement; }
          return [11, 11, 10];
        }
        return ['.lead', '.fine', '.facts p', '.cap-tabs small', '.plan ul li', '.faq p', '.foot nav a', '.btn.primary'].map(function (s) {
          var el = document.querySelector(s); if (!el) return { s: s, fg: [0, 0, 0], bg: [0, 0, 0] };
          return { s: s, fg: rgb(getComputedStyle(el).color), bg: bg(el) };
        });
      });
      pairs.forEach(function (p) {
        var cr = ratio(p.fg, p.bg);
        ok(cr >= 4.5 || (p.s === '.fine' && cr >= 3), 'kontrast ' + p.s + ' ' + cr.toFixed(2));
      });
      await page.close();
    }
    var html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8') + fs.readFileSync(path.join(__dirname, '..', 'js', 'site.js'), 'utf8');
    ok(html.indexOf('—') < 0, 'em-dash yok');
  } finally {
    await browser.close();
    server.close();
  }
  console.log('\n' + (checks - failed) + '/' + checks + ' geçti');
  process.exitCode = failed ? 1 : 0;
}

main().catch(function (e) { console.error(e); process.exitCode = 1; });
