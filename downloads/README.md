# AICADBridge Link — host plugins

Web'de (AICADBridge Studio) üretilen parametrik modelleri CAD programlarına aktaran ince eklentiler.
Tüm iş mantığı bulutta; eklentiler yalnızca **dışarı doğru HTTPS** kullanır (port açmaz).

| Program | Klasör | Biçim | Kurulum |
|---|---|---|---|
| Fusion 360 | `fusion/AICADBridgeLink` | STEP → yeni bileşen | Zip'i aç → Fusion: Yardımcı Programlar › Eklentiler › **+** › klasörü seç › Çalıştır. Araç çubuğu: **AICADBridge Bağlan** |
| Blender 4.2+ | `blender/aicadbridge_link` | GLB → yeni koleksiyon | Düzen › Tercihler › Eklentiler › **Diskten yükle** › zip. N paneli › AICADBridge › Bağlan |
| SolidWorks 2021+ | `solidworks` | STEP → LoadFile4 | Zip'i aç → `run.bat` (pywin32'yi kurar, kodu gösterir) |
| Diğer | `solidworks` | STEP klasörü | SolidWorks yoksa aynı köprü STEP'leri `~/AICADBridge/inbox` klasörüne kaydeder |

Akış: eklenti `POST /v1/connect/start` ile kod alır → kullanıcı web'de **Entegrasyonlar** sayfasında onaylar →
eklenti cihaz anahtarını alır (`~/.aicadbridge/<host>.json`) → `GET /v1/host/jobs/next` uzun yoklama → içe aktar → sonuç bildir.
Web'den bağlantı kaldırılınca anahtar bir sonraki çağrıda geçersizleşir ve silinir.

Sunucu adresi: varsayılan `http://127.0.0.1:8000` (geliştirme). Fusion bağlanırken sorar, Blender eklenti tercihlerinde,
SolidWorks `--server` ile; ya da `AICAD_API_URL` ortam değişkeni.

```
python tools/bundle.py          # ../aicadbridge-web/downloads/*.zip üretir
python -m pytest -q tests       # canlı API + yerel Supabase ile uçtan uca
```

Lisans: Blender eklentisi GPL-3.0-or-later (bpy kullanır); diğerleri projenin lisansı.
