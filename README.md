# Lexora
AI-Powered Language Learning Dictionary


Bu backend’i test etmek için sadece bir OpenAI API key gerekiyor.
Eğer test için gerekli olursa, ben mail ile sağlayabilirim.


1. Gerekli Dosyalar
Backend klasörünün içinde bir `.env` dosyası oluşturun:

OPENAI_API_KEY=YOUR_KEY_HERE
`YOUR_KEY_HERE` kısmına kendi API anahtarınızı yazın.

2. Kurulum
Gerekli Python paketlerini yükleyin:
pip install -r requirements.txt

3. Çalıştırma

cd backend
python app.py

Ardından tarayıcıdan şu adrese gidin:
http://127.0.0.1:5000

Tüm API uç noktalarını buradan test edebilirsiniz.

4. API Kullanımı

Frontend üzerinden backend’e istek atarken:

API_BASE = "http://127.0.0.1:5000"


Test edecek kişilerin sadece `.env` dosyasını oluşturması yeterlidir.
Uygulama lokal çalışabilir ve HTTPS gerektirmez.
