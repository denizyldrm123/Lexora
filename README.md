Bu proje, Lexora kelime öğrenme uygulamasının backend kısmını içerir ve Flask tabanlı bir API kullanır.
Proje OpenAI modelleriyle entegre çalışır ve kelime anlamı, eş anlamlı gibi işlemleri API üzerinden sağlar.

Projeyi kullanmak için önce GitHub deposu klonlanmalı ve terminal üzerinden Lexora/backend dizinine girilmelidir.
Temiz bir çalışma ortamı için Python sanal ortamı oluşturulması önerilir.
Sanal ortam macOS/Linux için source venv/bin/activate
Windows için venv\Scripts\activate komutlarıyla aktifleştirilir
Backend klasörü içinde bir .env dosyası oluşturulmalı ve içine OPENAI_API_KEY=YOUR_KEY_HERE satırı eklenmelidir.
OpenAI API anahtarı yalnızca .env içinde tutulmalı ve kesinlikle GitHub’a yüklenmemelidir.
Eğer test için özel bir API anahtarı gerekiyorsa biz bunu hocamıza bireysel olarak iletebiliriz.
Gerekli Python paketleri pip install -r requirements.txt komutuyla yüklenmelidir.
Tüm kurulum tamamlandıktan sonra backend, terminalde python app.py komutuyla çalıştırılabilir.
Sunucu local olarak http://127.0.0.1:5000 adresinde çalışır ve API uç noktaları buradan test edilebilir.
Örnek API isteği: /api/synonyms adresine POST isteğiyle { "text": "learn" } gönderildiğinde eş anlamlı kelimeler JSON olarak döner.
API’nin doğru çalışması için .env dosyasının ve paket kurulumlarının yapılmış olması yeterlidir.

git clone https://github.com/denizyldrm123/Lexora.git
cd Lexora/backend
python3 -m venv venv
source venv/bin/activate   # macOS/Linux
backend içinde .env dosyası oluşturulur
OPENAI_API_KEY=YOUR_KEY
pip install -r requirements.txt
python app.py
http://127.0.0.1:5000
