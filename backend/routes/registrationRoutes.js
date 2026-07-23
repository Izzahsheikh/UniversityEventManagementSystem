const express = require('express');
const router = express.Router();
const registrationController = require('../controller/registrationControllers.js');
const auth = require('../middleware/authMiddleware.js');
const requireRole = require('../middleware/roleMiddleware.js');

router.post('/registrations', auth, requireRole('student'), registrationController.register);
router.get('/registrations/mine', auth, requireRole('student'), registrationController.getMine);
router.get('/registrations/event/:id', auth, requireRole('organizer', 'admin'), registrationController.getForEvent);
router.delete('/registrations/:eventId', auth, requireRole('student'), registrationController.cancel);

module.exports = router;