Bu proje, Lexora kelime öğrenme uygulamasının backend kısmını içerir ve Flask tabanlı bir API kullanır. Proje, OpenAI modelleriyle entegre çalışarak kelime anlamı, eş anlamlı kelimeler gibi işlemleri API üzerinden sunmaktadır.
Projeyi kullanmak için önce GitHub deposu klonlanmalı ve terminal üzerinden `Lexora/backend` dizinine girilmelidir.
Temiz bir çalışma ortamı için Python sanal ortamı oluşturulması önerilir. Sanal ortam macOS/Linux için `source venv/bin/activate`, Windows için `venv\Scripts\activate` komutlarıyla aktifleştirilebilir.

Backend klasörü içinde bir `.env` dosyası oluşturulmalı ve içine `OPENAI_API_KEY=YOUR_KEY_HERE` satırı eklenmelidir. OpenAI API anahtarı yalnızca bu dosyada tutulmalı ve kesinlikle GitHub’a yüklenmemelidir. Eğer test için özel bir API anahtarı gerekiyorsa, ekibimiz bunu hocamıza bireysel olarak iletebilir.

Gerekli Python paketleri `pip install -r requirements.txt` komutuyla yüklenmelidir.
Kurulum tamamlandıktan sonra backend `python app.py` komutuyla çalıştırılabilir. Sunucu lokal olarak `http://127.0.0.1:5000` adresinde çalışır ve API uç noktaları buradan test edilebilir.

Örnek API kullanımında `/api/synonyms` adresine `{ "text": "learn" }` içeren bir POST isteği gönderildiğinde kelimenin eş anlamlıları JSON formatında döner. API’nin doğru çalışması için `.env` dosyasının ve tüm paket kurulumlarının yapılmış olması yeterlidir.

---

### Kurulum

```bash
# Projeyi klonlayın
git clone https://github.com/denizyldrm123/Lexora.git

# Backend klasörüne girin
cd Lexora/backend

# Sanal ortam oluşturun
python3 -m venv venv

# macOS / Linux için aktive edin
source venv/bin/activate

# Windows için:
# venv\Scripts\activate

# .env dosyasını oluşturun ve içine ekleyin:
# OPENAI_API_KEY=YOUR_KEY

# Gerekli paketleri yükleyin
pip install -r requirements.txt

# Backend'i çalıştırın
python app.py

# Çalışma adresi
# http://127.0.0.1:5000
```
