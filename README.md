# Appointment Calendar
Appointment Calendar, kullanıcıların kolayca randevu oluşturup yönetmelerini sağlayan, modern ve esnek bir takvim uygulamasıdır. Temel özellikleri şunlardır:

Randevu Oluşturma ve Yönetim: Kullanıcılar, diledikleri tarih ve saat aralığında hızlıca yeni randevular ekleyebilir, düzenleyebilir veya silebilir.

Takvim Görünümü: Günlük, haftalık ve aylık görünümler arasında geçiş yaparak planlamanızı en rahat edecek şekilde görüntüleyebilirsiniz.

Çoklu Takvim Entegrasyonu: Google Takvim ve Microsoft Takvim (Outlook) entegrasyonları sayesinde, oluşturduğunuz tüm randevular otomatik olarak seçili takvim servisleriyle eşitlenir.

Çift Yönlü Senkronizasyon: Uygulama içinden eklediğiniz randevular, bağlı olduğunuz dış takvim servislerinde de görünür; aynı şekilde dış takvimde yaptığınız değişiklikler de uygulamaya anında yansır.

Bu sayede, tüm takvimlerinizi tek bir noktadan yönetebilir, randevularınızı kaçırmadan organize edebilirsiniz.

Her kullanıcı kendi takvimini oluşturacaktır.

## Özellikler ve Geliştirme Durumu
Proje şu anda MVP (Minimum Viable Product) aşamasındadır. Temel fonksiyonlar tamamlanmış, entegrasyon aşamasına hazır hale getirilmiştir.

- [x] Kullanıcı Kimlik Doğrulama (Auth): JWT (JSON Web Token) tabanlı güvenli kayıt olma ve giriş yapma sistemi.

- [x] Randevu Yönetimi (CRUD): Randevu ekleme, listeleme ve silme fonksiyonları.

- [x] Sürükle & Bırak (Drag & Drop): Takvim üzerindeki randevuların sürüklenerek gün ve saatlerinin güncellenmesi.

- [x] Kategori ve Renk Yönetimi: Randevuların kategorize edilmesi (İş, Özel, Okul vb.) ve seçilen kategoriye göre otomatik renklendirilmesi.

- [x] Responsive Tasarım: Mobil, tablet ve masaüstü cihazlarla tam uyumlu modern arayüz.

- [x] Modern UI: FullCalendar.js entegrasyonu ve özelleştirilmiş CSS tasarımı.

- [ ] SSO Entegrasyonu: Altyapısı "Hibrit" modelde hazırlanmıştır ancak OCTAPULL SSO entegrasyonu henüz tamamlanmamıştır.

- [ ] Dış Takvim Entegrasyonu: Google ve Outlook Takvim senkronizasyonu (Çift yönlü) geliştirme aşamasındadır.

## Gereksinimler
Veri tabanı kullanılması durumunda PostgreSQL kullanılacaktır.

SSO Olarak OCTAPULL SSO Kullanılacaktır.

## Teknolojiler
Bu proje Monorepo yapısında geliştirilmiştir.

Backend: Node.js, Express.js

Veritabanı: PostgreSQL

Frontend: React.js

Takvim Kütüphanesi: FullCalendar

HTTP İstemcisi: Axios

## Proje Hiyerarşisi

```
AppointmentCalendar/
│
├── backend/                # Node.js & Express API
│   ├── src/
│   │   ├── config/         # Veritabanı bağlantı ayarları
│   │   ├── controllers/    # İş mantığı (Auth, Appointment)
│   │   ├── middleware/     # JWT doğrulama katmanı
│   │   └── routes/         # API uç noktaları
│   ├── .env                # Çevresel değişkenler
│   └── package.json
│
├── frontend/               # React Arayüzü
│   ├── src/
│   │   ├── api/            # Axios yapılandırması
│   │   ├── context/        # Auth Context (Global State)
│   │   ├── pages/          # Sayfalar (Login, Register, Dashboard)
│   │   └── App.css         # Responsive stiller
│   └── package.json
│
└── README.md
```

## Kurulum
Projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları izleyin.

1. Ön Hazırlık (Veritabanı)
PostgreSQL'de appointment_calendar adında bir veritabanı oluşturun ve aşağıdaki SQL sorgusunu çalıştırarak tabloları hazırlayın:

```bash
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    full_name VARCHAR(100),
    provider VARCHAR(50) DEFAULT 'local',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE appointments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    color VARCHAR(20) DEFAULT '#3788d8',
    category VARCHAR(50)
);
```

2. Backend Kurulumu
Yeni bir terminal açın ve backend klasörüne gidin:

```bash
cd backend
npm install
```

.env dosyası oluşturun ve veritabanı bilgilerinizi girin:

```bash
PORT=5000
DB_USER=postgres
DB_PASSWORD=sifreniz
DB_HOST=localhost
DB_PORT=5432
DB_NAME=appointment_calendar
JWT_SECRET=gizli_anahtariniz
```

Sunucuyu başlatın:

```bash
npm run 
```

3. Frontend Kurulumu
Yeni bir terminal sekmesi açın ve frontend klasörüne gidin:

```bash
cd frontend
npm install
npm start
```

Tarayıcınızda http://localhost:3000 adresine giderek uygulamayı kullanmaya başlayabilirsiniz.

## Kullanım
Kayıt Ol: Sisteme isim, e-posta ve şifre ile kayıt olun.

Giriş Yap: Oluşturduğunuz hesap ile giriş yapın.

Randevu Ekle: Takvimde herhangi bir güne tıklayın. Başlık girin ve "İş, Özel, Okul" gibi bir kategori seçin.

Güncelle: Randevuları sürükleyip bırakarak gününü değiştirebilirsiniz.

Sil: Randevunun üzerine tıklayarak silebilirsiniz.