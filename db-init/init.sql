CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    full_name VARCHAR(100),
    provider VARCHAR(50) DEFAULT 'local',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS appointments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    color VARCHAR(20) DEFAULT '#3788d8',
    category VARCHAR(50)
);

-- Seed Data (Örnek Veriler)
-- Sadece daha önce eklenmemişse kullanıcıyı ekler.
INSERT INTO users (id, email, password_hash, full_name, provider) 
VALUES (
    '11111111-1111-1111-1111-111111111111',
    'test@example.com', 
    '--hash-gerekmiyor-simdilik--', 
    'Test Kullanıcısı', 
    'local'
) ON CONFLICT (email) DO NOTHING;

INSERT INTO appointments (user_id, title, description, start_time, end_time, color, category)
VALUES (
    '11111111-1111-1111-1111-111111111111', 
    'Proje Toplantısı', 
    'Docker ve veritabanı hakkında toplantı.', 
    CURRENT_TIMESTAMP + INTERVAL '1 day', 
    CURRENT_TIMESTAMP + INTERVAL '1 day 2 hours', 
    '#3788d8', 
    'is'
);

INSERT INTO appointments (user_id, title, description, start_time, end_time, color, category)
VALUES (
    '11111111-1111-1111-1111-111111111111', 
    'Doktor Randevusu', 
    'Göz muayenesi', 
    CURRENT_TIMESTAMP + INTERVAL '2 days', 
    CURRENT_TIMESTAMP + INTERVAL '2 days 1 hours', 
    '#28a745', 
    'kisisel'
);
