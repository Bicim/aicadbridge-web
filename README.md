# aicadbridge-web

AICADBridge'in tanıtım sitesi. Statik, framework'süz tek sayfa; koyu teknik tasarım; TR varsayılan + EN.
Ürün: [Web Studio](https://github.com/Bicim/aicadbridge-studio) · [Fusion eklentisi](https://github.com/Bicim/AICADBridge) · [Bağlayıcı eklentiler](https://github.com/Bicim/aicadbridge-connectors)

## Yapı

```
index.html        Tek sayfa: hero (patlatılmış görünüş SVG) · 01 yetenekler · 02 entegrasyonlar ·
                  03 nasıl çalışır · 04 veri güvenliği · 05 fiyatlar · 06 SSS · 07 indirmeler
css/site.css      Token'lar (:root) + tüm bileşenler; tek aksan #00b8d4
js/site.js        Studio bağlantıları (data-app), TR/EN sözlüğü, sekmeler, fiyat dönemi, figür animasyonu
downloads/        Eklenti zip'leri (aicadbridge-connectors/tools/bundle.py üretir)
404.html          Kendine yeten 404
tests/            server.js (statik sunucu) + verify.js (playwright doğrulama)
```

## Çalıştırma

```bash
npm install          # yalnızca doğrulama bağımlılığı: playwright
npm run serve        # http://localhost:8124
npm run verify       # 24 kontrol: hata, 390/768/1440 taşma, bağlantılar, fiyat/dil geçişi,
                     # indirmeler, kontrast, em-dash yasağı; ekran görüntüleri tests/screenshots/
```

## Kurallar

- Fiyatlar ve plan maddeleri bulut API'sindeki `billing.PLANS` ile aynı tutulur.
- Em-dash kullanılmaz (verify kontrol eder).
- Kaydırmaya bağlı gizleme/belirme animasyonu yok: içerik her koşulda görünür.
- `data-app` bağlantıları yerelde `localhost:5173`, yayında `bicim.github.io/aicadbridge-studio` adresine gider.

## Dağıtım

GitHub Pages (main / root). Eski açık temalı tasarımın süreç belgeleri (BRIEF, PROPOSAL, DECISIONS,
FINGERPRINTS, VALIDATION, design-dna) tarihsel kayıt olarak duruyor; yeni tasarımda kullanılmıyor.
