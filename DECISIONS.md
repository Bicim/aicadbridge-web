# DECISIONS.md

Bu dosya, BRIEF.md'nin gerektirdiği karar günlüğüdür. Her karar tek satır gerekçeyle burada.

| # | Karar | Gerekçe |
|---|-------|---------|
| D1 | Site, ürün reposundan AYRI, `Bicim/aicadbridge-web` reposunda kuruldu. | Kullanıcı talimatı: "org içinde yeni repo aç, ona da web sitesini yap." Ürün repo'su ürünle kalır. |
| D2 | Faz 2 yaratıcı yön (PROPOSAL.md: 8 perde, tek zirne Perde 4 self-healing, imza hareket "scroll = komut satırı") **onaylı sayıldı**. | Kullanıcı "tamam şimdi org içinde yeni repo aç... web sitesini yap" diyerek build'e geçiş onayı verdi. |
| D3 | Kanonik URL `https://bicim.github.io/aicadbridge-web/` (GitHub Pages proje deseni). | Özel alan adı henüz yok. Alan bağlanırsa: canonical, hreflang, OG:url, sitemap.xml, robots.txt içindeki tüm URL'ler güncellenmelidir (tek bul-değiştir). |
| D4 | Ekran kayıtları (A/B/C/D) yerine açıkça etiketli statik içerik kullanıldı; tüm figürler **gerçek palet ekran görüntüleri**. | Kayıtlar kullanıcıdan bekleniyor (BRIEF §9). Gelince: hero/demoya `data-sc-scrub` video + poster olarak eklenir, yer tutucu metinleri kalkar. Sahte arayüz çizmek brief'in açık yasağı. |
| D5 | Flanş görseli **şematik SVG** olarak, "şematik gösterim" etiketiyle sunuldu. | Sahte dashboard yasağı: teknik şema içeriktir, arayüz taklidi değil. |
| D6 | Metinde model sürümü yok; yalnızca sağlayıcı adları (Claude, GPT, Gemini, DeepSeek, Ollama, LM Studio). | BRIEF §3.1 ve §8 kuralı. |
| D7 | Motor dosyaları (`js/scrollcraft.js`, `css/scrollcraft.css`) **hiç değiştirilmedi**; tüm özel davranış `--sc-p` üzerinden `js/main.js` + `css/components.css`'te. | scroll-craft engine kuralı; tema 6 renk rolü + 1 aksan + 2 aile ile kuruldu. |
| D8 | Dil: TR varsayılan, EN `data-i18n` sözlükle; `?lang=en` + localStorage; hreflang bildirimi statik. | BRIEF §4 ve §11. Dil değişiminde engine destroy/mount döngüsüyle bölünmüş metinler tazelenir. |
| D9 | Mono yazı ailesi bilinçli istisna: yalnızca komut satırı, kod paneli ve teknik etiketlerde. | BRIFF §10: "system mono ... bilinçli istisna olabilir." Görsel metin 2 ailede kalır. |
| D10 | Portre palet görüntüleri (460×900) "tek karanlık nesne" figürleri olarak dik panel sunumunda. | Gerçek ekran görüntüsü oranı korundu; kırpmadan sahte genişlik üretilmedi. |
| D11 | Aksan rengi `#00b8d4` ürün arayüzünün GERÇEK değeri; açık zeminde metin için koyulaştırılmış `#00748c` türevi kullanıldı. | Marka sürekliliği + WCAG AA (open zeminde #00b8d4 metin olarak ~2.2:1, geçmez). |
| D12 | OG görseli kendimiz üretildi: `assets/og-src.html` tipografik kartından headless tarayıcı ekran görüntüsü (`assets/images/og.png`). | BRIEF §11: kendi üretilmiş OG görseli. Sahte UI içermez, marka tipografisidir. |
| D13 | Demo bölümü (koyu akt) `data-sc-act="pin"` span 4.2; `#parametre` flow akt olarak zeminin açık renge dönmesini sağlıyor (`data-sc-drift="#faf9f7"`). | Engine'in drift mekanizması yalnızca akt öğelerde çalışır; dönüş perdesi bilinçli olarak parametrik bölümüne verildi. |

## Askıya alınmış / bekleyen

- **Ekran kayıtları A/B/C/D** (kullanıcı): hero ~20sn, peak ~15sn, slider ~10sn, harici tarayıcı modu. mp4 + mobil varyant.
- **Özel alan adı** (kullanıcı): bağlanınca D3'teki bul-değiştir yapılır, Search Console + Bing Webmaster gönderimi yapılır.
