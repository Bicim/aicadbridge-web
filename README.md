# aicadbridge-web

AICADBridge tanıtım sitesi. Statik, framework'süz tek sayfa; sakin, minimal koyu tasarım (açık tema `prefers-color-scheme` ile); TR varsayılan + EN.
Ürün: [Web Studio](https://github.com/Bicim/aicadbridge-studio) · [Bağlayıcı eklentiler](https://github.com/Bicim/aicadbridge-connectors)

## Yapı

```
index.html        Hero · nasıl çalışır · entegrasyonlar · MCP · başlarken · fiyat · SSS · altbilgi
css/site.css      Token'lar (:root, tasarım sistemi) + bileşenler; sistem fontları, dış istek yok
js/site.js        data-app (Studio bağlantıları), data-api (MCP adresi), TR/EN sözlüğü, fiyat dönemi
assets/logos/     Uygulama logoları (<anahtar>.svg); yoksa baş harf karosu görünür
assets/images/    og.png (paylaşım görseli); assets/og-src.html kaynağı
404.html          Kendine yeten 404
```

## Çalıştırma

```bash
python -m http.server 8130    # http://localhost:8130  (EN: ?lang=en)
```

## Kurallar

- Fiyatlar ve plan maddeleri bulut API'sindeki `billing.PLANS` ile aynı tutulur.
- Elle kurulum zip'leri GitHub Release'te (`aicadbridge-connectors/releases/latest/download/...`); bu repoda tutulmaz.
- `data-app` bağlantıları yerelde `localhost:5173`, yayında `bicim.github.io/aicadbridge-studio` adresine gider.
- Logolar yalnızca uyumluluğu belirtmek içindir; altbilgideki ticari marka notu kalmalıdır.

## Dağıtım

GitHub Pages (main / root).
