# VALIDATION.md

Faz 5 dogrulama raporu. Uretim: `node tests/verify.js` (Playwright/Chromium, headless).
Tarih: 2026-10-14 14:27:48

## Sonuclar

- [x] olu kaydirma yok: 45/45 adim benzersiz
- [x] demo pini canli: --sc-p monoton artiyor (10 ornek)
- [x] cue opaklik sozlesmesi: 15/15
- [x] giris gorunurlugu (data-sc-in): 43/43
- [x] WCAG AA govde kontrasti: en dusuk 5.46:1 ("Sen niyeti yazarsın. Model, koddan değil" rgb(109, 101, 88) on rgb(250,249,247))
- [x] gorunur metinde em dash yok
- [x] tum gorseller yuklendi (5)
- [x] CLS icin width/height bildirildi
- [x] basliklar 3 satiri asmıyor
- [x] dil gecisi TR->EN (h1 degisti)
- [x] dil gecisi EN->TR
- [x] ?lang=en dogrudan acilis
- [x] yatay tasma yok @360px (fark 0px)
- [x] yatay tasma yok @375px (fark 0px)
- [x] yatay tasma yok @768px (fark 0px)
- [x] yatay tasma yok @1280px (fark 0px)
- [x] yatay tasma yok @1920px (fark 0px)
- [x] reduced-motion: sayfa hatasiz
- [x] reduced-motion: ipuclari gorunur (maks 1.00)
- [x] reduced-motion: sema tam cizili (statik alternatif)
- [x] konsol/sayfa hatasi yok
- contact sheet: tests/screenshots/contact-sheet.html (17 kare)

## Ekran goruntuleri

`tests/screenshots/` (contact sheet: `contact-sheet.html`). Kareler doğrulama anından,
headless Chromium'dan alınmıştır; görsel son onay insan gözünde kalır.

Toplam denetim: 21 · Başarısız: 0
