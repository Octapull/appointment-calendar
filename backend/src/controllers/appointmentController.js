const db = require('../config/db');

// RANDEVU EKLE (Renk Desteği ile)
exports.createAppointment = async (req, res) => {
  // category bilgisini de alıyoruz
  const { title, description, start_time, end_time, color, category } = req.body;

  try {
    const eventColor = color || '#3788d8';

    const newAppointment = await db.query(
      "INSERT INTO appointments (user_id, title, description, start_time, end_time, color, category) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [req.user.id, title, description, start_time, end_time, eventColor, category]
    );

    res.json(newAppointment.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Sunucu Hatası");
  }
};

// RANDEVULARI GETİR
exports.getAppointments = async (req, res) => {
  try {
    const appointments = await db.query(
      "SELECT * FROM appointments WHERE user_id = $1 ORDER BY start_time ASC",
      [req.user.id]
    );

    res.json(appointments.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Sunucu Hatası");
  }
};

// RANDEVU GÜNCELLE (Sürükle Bırak + Renk/Detay Güncelleme)
exports.updateAppointment = async (req, res) => {
  const { id } = req.params;
  const { title, description, start_time, end_time, color, category } = req.body;

  try {
    const oldEvent = await db.query("SELECT * FROM appointments WHERE id = $1 AND user_id = $2", [id, req.user.id]);

    if (oldEvent.rows.length === 0) return res.status(403).json({ msg: "Yetkisiz" });

    const newTitle = title || oldEvent.rows[0].title;
    const newDesc = description || oldEvent.rows[0].description;
    const newStart = start_time || oldEvent.rows[0].start_time;
    const newEnd = end_time || oldEvent.rows[0].end_time;
    const newColor = color || oldEvent.rows[0].color;
    const newCategory = category || oldEvent.rows[0].category; // <-- YENİ

    const updateOp = await db.query(
      "UPDATE appointments SET title=$1, description=$2, start_time=$3, end_time=$4, color=$5, category=$6 WHERE id=$7 AND user_id=$8 RETURNING *",
      [newTitle, newDesc, newStart, newEnd, newColor, newCategory, id, req.user.id]
    );

    res.json(updateOp.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Sunucu Hatası");
  }
};

// RANDEVU SİL
exports.deleteAppointment = async (req, res) => {
  const { id } = req.params;

  try {
    const deleteOp = await db.query(
      "DELETE FROM appointments WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, req.user.id]
    );

    if (deleteOp.rows.length === 0) {
      return res.status(403).json({ msg: "Bu işlem için yetkiniz yok veya randevu bulunamadı." });
    }

    res.json({ msg: "Randevu silindi" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Sunucu Hatası");
  }
};