const db = require('../config/db');

// add
exports.createAppointment = async (req, res) => {
  const { title, description, start_time, end_time } = req.body;

  try {
    const newAppointment = await db.query(
      "INSERT INTO appointments (user_id, title, description, start_time, end_time) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [req.user.id, title, description, start_time, end_time]
    );

    res.json(newAppointment.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Sunucu Hatası");
  }
};

// get
exports.getAppointments = async (req, res) => {
  try {
    // loged users only
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

// delete
exports.deleteAppointment = async (req, res) => {
  const { id } = req.params;

  try {
    // Only the owner can delete their appointment (user_id check required)
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



// update for drag and drop
exports.updateAppointment = async (req, res) => {
  const { id } = req.params;
  const { start_time, end_time } = req.body;

  try {
    const updateOp = await db.query(
      "UPDATE appointments SET start_time = $1, end_time = $2 WHERE id = $3 AND user_id = $4 RETURNING *",
      [start_time, end_time, id, req.user.id]
    );

    if (updateOp.rows.length === 0) {
      return res.status(403).json({ msg: "Yetkisiz işlem veya randevu bulunamadı." });
    }

    res.json(updateOp.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Sunucu Hatası");
  }
};