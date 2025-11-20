const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware'); 
const appointmentController = require('../controllers/appointmentController');

//auth added

// GET /api/appointments 
router.get('/', auth, appointmentController.getAppointments);

// POST /api/appointments 
router.post('/', auth, appointmentController.createAppointment);

// DELETE /api/appointments/:id 
router.delete('/:id', auth, appointmentController.deleteAppointment);

// PUT /api/appointments/:id
router.put('/:id', auth, appointmentController.updateAppointment);

module.exports = router;