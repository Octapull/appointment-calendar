const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// KULLANICI KAYIT
exports.register = async (req, res) => {
  const { email, password, fullName } = req.body;

  try {
    // 1. Şifreyi şifrele 
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // 2. Veritabanına ekle
    const newUser = await db.query(
      "INSERT INTO users (email, password_hash, full_name, provider) VALUES ($1, $2, $3, 'local') RETURNING id, email, full_name",
      [email, hash, fullName]
    );

    // 3. Token oluştur (JWT)
    const token = jwt.sign({ id: newUser.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({
      msg: "Kullanıcı başarıyla oluşturuldu",
      token,
      user: newUser.rows[0]
    });

  } catch (err) {
    console.error(err.message);
    if (err.code === '23505') { 
      return res.status(400).json({ msg: "Bu e-posta adresi zaten kayıtlı." });
    }
    res.status(500).send("Sunucu Hatası");
  }
};

// KULLANICI GİRİŞ
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Kullanıcıyı bul
    const userResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);

    if (userResult.rows.length === 0) {
      return res.status(401).json({ msg: "Geçersiz e-posta veya şifre" });
    }

    const user = userResult.rows[0];

    // 2. GÜVENLİK KONTROLÜ
    if (!user.password_hash) {
      return res.status(400).json({ msg: "Lütfen Octapull SSO ile giriş yapınız." });
    }

    // 3. Şifre kontrol
    const validPass = await bcrypt.compare(password, user.password_hash);
    if (!validPass) {
      return res.status(401).json({ msg: "Geçersiz e-posta veya şifre" });
    }

    // 4. Token 
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      msg: "Giriş başarılı",
      token,
      user: { id: user.id, email: user.email, full_name: user.full_name }
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Sunucu Hatası");
  }
};