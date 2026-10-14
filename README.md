# aicadbridge-web

AICADBridge'in resmi tanıtım sitesi. Statik, framework'süz, tek sayfa; TR varsayılan + EN.
Ürün repo'su: [Bicim/AICADBridge](https://github.com/Bicim/AICADBridge)

## Yapı

```
index.html              Tek sayfa: 8 perdelik editoryal akış, tek zirne (Perde 4: self-healing)
404.html                Kendine yeten 404 (iç stiller; kök dışı yollarda da çalışır)
css/
  scrollcraft.css       scroll-craft engine (DOKUNULMAZ - kopya)
  tokens.css            6 renk rolü + 1 aksan + 2 aile (design-dna birleşimi)
  base.css              Sıfırlama, tipografi, erişilebilirlik
  components.css        Bileşenler + imza hareketin CSS tarafı
js/
  scrollcraft.js        scroll-craft engine (DOKUNULMAZ - kopya)
  main.js               Engine mount, TR/EN sözlük, imza hareket sürücüsü
design-dna/             pear.dna.json + aicadbridge-ui.dna.json (Faz 1 teslimatları)
assets/images/          GERÇEK palet ekran görüntüleri + og.png (üretim: assets/og-src.html)
BRIEF.md                Orijinal brief (tek gerçek talimat)
PROPOSAL.md             Faz 2 yaratıcı yön (onaylı)
FINGERPRINTS.md         Yasak kalıp denetim günlüğü
DECISIONS.md            Karar günlüğü
tests/                  server.js (statik sunucu) + verify.js (Faz 5 doğrulama)
```

## Çalıştırma

```bash
npm install          # yalnızca doğrulama bağımlılığı: playwright
npm run serve        # http://localhost:8124 statik sunucu
npm run verify       # Faz 5: ölü kaydırma, opaklık sözleşmesi, kontrast, taşma,
                     # ekran görüntüleri + contact sheet, reduced-motion geçişi
```

Doğrulama çıktısı: `VALIDATION.md` + `tests/screenshots/`.

## Tasarım sistemi

- **Zemin**: sıcak kırık beyaz `#faf9f7`; sayfadaki TEK karanlık yüzeyler ürün figürleri ve demo sahnesi.
- **Aksan**: `#00b8d4` (ürün arayüzünün gerçek neon'u; açık zeminde metin için `#00748c`).
- **Durum renkleri**: `#f48771` / `#e5c07b` / `#4ec9b0` (ürün arayüzünden).
- **Yazı**: Instrument Serif (italik vurgu) + Inter (gövde); mono bilinçli istisna.
- **Hareket**: scroll-craft engine'i `--sc-p` yayınlar; imza hareket (komut yazımı, kod satırları,
  flanş çizimi, onarım dizisi, slider) bu değerden sürülür. Engine dosyaları değiştirilmez.

## Dağıtım

GitHub Pages (repo Ayarlar → Pages → main / root). Kanonik URL deseni
`https://bicim.github.io/aicadbridge-web/` — özel alan bağlanırsa DECISIONS.md D3'teki
bul-değiştir listesi uygulanır.

## Varlık kaynakları ve araç kullanımı (dürüstlük notu)

- Tüm palet görüntüleri **gerçek arayüzden** alındı; sahte dashboard çizilmedi.
- `og.png`, `assets/og-src.html` tipografik kartının headless ekran görüntüsüdür.
- pear.no yalnızca kalıp kaynağıdır (BRIEF §2.1); metin veya medya kopyalanmadı.
