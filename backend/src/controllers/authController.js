const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


exports.register = async (req, res) => {
  const { email, password, fullName } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const newUser = await db.query(
      "INSERT INTO users (email, password_hash, full_name, provider) VALUES ($1, $2, $3, 'local') RETURNING id, email, full_name",
      [email, hash, fullName]
    );

    
    const token = jwt.sign(
      { 
        id: newUser.rows[0].id, 
        fullName: newUser.rows[0].full_name, 
        email: newUser.rows[0].email 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    res.status(201).json({
      msg: "Kullanıcı başarıyla oluşturuldu",
      token,
      user: { 
        id: newUser.rows[0].id,
        fullName: newUser.rows[0].full_name,
        email: newUser.rows[0].email
      }
    });

  } catch (err) {
    console.error(err.message);
    if (err.code === '23505') {
      return res.status(400).json({ msg: "Bu e-posta adresi zaten kayıtlı." });
    }
    res.status(500).send("Sunucu Hatası");
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);

    if (userResult.rows.length === 0) {
      return res.status(401).json({ msg: "Geçersiz e-posta veya şifre" });
    }

    const user = userResult.rows[0];

    if (!user.password_hash) {
      return res.status(400).json({ msg: "Lütfen Octapull SSO ile giriş yapınız." });
    }

    const validPass = await bcrypt.compare(password, user.password_hash);
    if (!validPass) {
      return res.status(401).json({ msg: "Geçersiz e-posta veya şifre" });
    }

    
    const token = jwt.sign(
      { 
        id: user.id, 
        fullName: user.full_name, 
        email: user.email 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    res.json({
      msg: "Giriş başarılı",
      token,
      user: { 
        id: user.id, 
        email: user.email, 
        fullName: user.full_name 
      }
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Sunucu Hatası");
  }
};