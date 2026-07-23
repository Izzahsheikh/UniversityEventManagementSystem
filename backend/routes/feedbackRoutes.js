const express = require('express');
const router = express.Router();
const feedbackController = require('../controller/feedbackControllers.js');
const auth = require('../middleware/authMiddleware.js');
const requireRole = require('../middleware/roleMiddleware.js');

router.post('/feedback', auth, requireRole('student'), feedbackController.submitFeedback);
router.get('/feedback', auth, requireRole('admin', 'organizer'), feedbackController.getAllFeedback);
router.get('/feedback/mine', auth, requireRole('student'), feedbackController.getMyFeedback);

module.exports = router;