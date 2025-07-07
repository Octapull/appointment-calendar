# Appointment Calendar

**Appointment Calendar**, kullanıcıların kolayca randevu oluşturup yönetmelerini sağlayan, modern ve esnek bir takvim uygulamasıdır. Temel özellikleri şunlardır:

- **Randevu Oluşturma ve Yönetim:** Kullanıcılar, diledikleri tarih ve saat aralığında hızlıca yeni randevular ekleyebilir, düzenleyebilir veya silebilir.  
- **Takvim Görünümü:** Günlük, haftalık ve aylık görünümler arasında geçiş yaparak planlamanızı en rahat edecek şekilde görüntüleyebilirsiniz.  
- **Çoklu Takvim Entegrasyonu:** Google Takvim ve Microsoft Takvim (Outlook) entegrasyonları sayesinde, oluşturduğunuz tüm randevular otomatik olarak seçili takvim servisleriyle eşitlenir.  
- **Çift Yönlü Senkronizasyon:** Uygulama içinden eklediğiniz randevular, bağlı olduğunuz dış takvim servislerinde de görünür; aynı şekilde dış takvimde yaptığınız değişiklikler de uygulamaya anında yansır.  

Bu sayede, tüm takvimlerinizi tek bir noktadan yönetebilir, randevularınızı kaçırmadan organize edebilirsiniz.

Her kullanıcı kendi takvimini oluşturacaktır

## Özellikler

## Gereksinimler
- Veri tabanı kullanılması durumunda Postgresql kullanılcaktır
- SSO Olarak OCTAPULL SSO Kullanılacaktır

## Kurulum

## Kullanım

## Proje Hiyerarşisi

```md
Örnek;

proje-adi/
│
├── src/
│   ├── services/         # API veya iş mantığı
│   ├── pages/            # Sayfa bileşenleri
│   └── utils/            # Yardımcı fonksiyonlar
│
├── tests/                # Test dosyaları
├── public/               # Statik dosyalar
├── .env.example          # Örnek ortam değişkenleri
└── README.md
```

## Contributing
Fork the repository

Create a feature branch
git checkout -b feature/amazing-feature

Make your changes

Add tests for new functionality

Commit your changes
git commit -m 'Add amazing feature'

Push to the branch
git push origin feature/amazing-feature

Open a Pull Request
