/* Kaydırmayla oynayan hikâye (#hikaye) + CTA ortam döngüsü. vault/video-plani.md §A3–A6. Bağımlılıksız.
   Kaydırma modu yalnız geniş ekran + hareket azaltma kapalı + veri tasarrufu kapalı + hızlı ağda açılır;
   aksi halde HTML'deki statik düzen kalır ve video hiç indirilmez. */
(function () {
  'use strict';
  var SRC = 'assets/video/story-1280.mp4';
  var sec = document.getElementById('hikaye');
  var wide = matchMedia('(min-width: 900px)');
  var still = matchMedia('(prefers-reduced-motion: reduce)');
  function allowed() {
    var c = navigator.connection || {};
    return wide.matches && !still.matches && !c.saveData && ['slow-2g', '2g', '3g'].indexOf(c.effectiveType) < 0;
  }
  function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function idle(fn) { (window.requestIdleCallback || function (f) { setTimeout(f, 1200); })(fn); }
  function afterLoad(fn) { if (document.readyState === 'complete') idle(fn); else addEventListener('load', function () { idle(fn); }); }

  /* ---- CTA arka plan döngüsü (mobil / rm / saveData: yalnız poster) ---- */
  var cta = document.querySelector('.cta-bg');
  if (cta && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      var vis = es[0].isIntersecting;
      if (vis && allowed()) {
        if (!cta.src) cta.src = cta.getAttribute('data-src');
        var pr = cta.play(); if (pr && pr.catch) pr.catch(function () {});
      } else if (cta.src) cta.pause();
    }).observe(cta);
  }

  if (!sec) return;
  var video = sec.querySelector('.story-video');
  var steps = [].slice.call(sec.querySelectorAll('.story-step')).map(function (el) {
    return { el: el, a: +el.getAttribute('data-in'), b: +el.getAttribute('data-out') };
  });
  var dims = sec.querySelector('.story-dims');
  [].forEach.call(sec.querySelectorAll('.story-labels [data-x]'), function (el) {
    el.style.left = el.getAttribute('data-x') / 16 + '%';
    el.style.top = el.getAttribute('data-y') / 9 + '%';
  });

  var on = false, ready = false, loading = false, visible = false, raf = 0;
  var top = 0, range = 1, cur = 0, lastP = -1;

  function measure() {
    var r = sec.getBoundingClientRect();
    top = r.top + scrollY;
    range = Math.max(1, sec.offsetHeight - innerHeight);
  }
  function progress() { return clamp((scrollY - top) / range); }

  function paint(p) {
    sec.style.setProperty('--p', p.toFixed(4));
    sec.style.setProperty('--e', clamp(p / 0.08).toFixed(3));
    steps.forEach(function (s) {
      var live = p >= s.a && (p < s.b || s.b >= 1);
      s.el.style.setProperty('--sp', clamp((p - s.a) / (s.b - s.a)).toFixed(3));
      s.el.classList.toggle('live', live);
      s.el.classList.toggle('done', p >= s.b && s.b < 1);
    });
    if (dims) {
      var dp = Math.min(clamp((p - 0.72) / 0.02), clamp((0.86 - p) / 0.02));
      sec.style.setProperty('--dimo', dp.toFixed(3));
      sec.style.setProperty('--dd', (1 - clamp((p - 0.72) / 0.06)).toFixed(3));
    }
  }

  function tick() {
    raf = 0;
    if (!on || !visible || document.hidden) return;
    var p = progress();
    if (p !== lastP) { paint(p); lastP = p; }
    if (ready && video.duration) {
      var target = p * (video.duration - 1 / 24);
      cur += (target - cur) * 0.18;
      if (Math.abs(target - cur) < 0.002) cur = target;
      if (!video.seeking && Math.abs(video.currentTime - cur) > 1 / 48) video.currentTime = cur;
    }
    raf = requestAnimationFrame(tick);
  }
  function loop() { if (!raf && on && visible && !document.hidden) raf = requestAnimationFrame(tick); }

  function load() {
    if (loading) return;
    loading = true;
    fetch(SRC).then(function (res) {
      if (!res.ok) throw new Error(res.status);
      var total = +res.headers.get('Content-Length') || 0;
      if (!total || !res.body || !window.Response) return res.blob();
      var reader = res.body.getReader(), got = 0, parts = [];
      return (function pump() {
        return reader.read().then(function (r) {
          if (r.done) return new Blob(parts, { type: 'video/mp4' });
          parts.push(r.value); got += r.value.length;
          sec.style.setProperty('--lp', (got / total).toFixed(3));
          return pump();
        });
      })();
    }).then(function (blob) {
      video.addEventListener('loadeddata', function () {
        video.pause();
        ready = true;
        cur = progress() * (video.duration - 1 / 24);
        video.currentTime = cur;
        sec.classList.add('story--ready');
      }, { once: true });
      video.src = URL.createObjectURL(blob);
      video.load();
    }).catch(function () { /* sessizce poster kalır; başlıklar yine çalışır */ });
  }

  function setMode() {
    var want = allowed();
    if (want === on) return;
    on = want;
    sec.classList.toggle('story--scrub', on);
    sec.classList.toggle('story--static', !on);
    if (on) { measure(); lastP = -1; loop(); afterLoad(load); }
    else { steps.forEach(function (s) { s.el.classList.remove('live', 'done'); s.el.style.removeProperty('--sp'); }); sec.style.removeProperty('--e'); }
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { visible = es[0].isIntersecting; loop(); }).observe(sec);
  } else visible = true;
  document.addEventListener('visibilitychange', loop);
  addEventListener('resize', function () { if (on) { measure(); lastP = -1; loop(); } });
  if (window.ResizeObserver) new ResizeObserver(function () { if (on) measure(); }).observe(document.body);
  [wide, still].forEach(function (m) { if (m.addEventListener) m.addEventListener('change', setMode); });

  /* klavye: görünmeyen bir adımdaki bağlantıya odak gelirse o adıma kaydır */
  sec.addEventListener('focusin', function (e) {
    if (!on) return;
    steps.forEach(function (s) {
      if (s.el.contains(e.target) && !s.el.classList.contains('live')) {
        var mid = (s.a + s.b) / 2;
        scrollTo({ top: top + mid * range, behavior: 'auto' });
      }
    });
  });

  setMode();
})();
