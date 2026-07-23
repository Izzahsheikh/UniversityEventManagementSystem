const express = require('express');
const router = express.Router();
const eventController = require('../controller/eventControllers.js');
const auth = require('../middleware/authMiddleware.js');
const requireRole = require('../middleware/roleMiddleware.js');

router.get('/events', eventController.getEvents); // public list of approved events
router.get('/events/all', auth, requireRole('admin'), eventController.getAllEventsAdmin);
router.get('/events/pending', auth, requireRole('admin'), eventController.getPendingEvents);
router.get('/events/mine', auth, requireRole('organizer'), eventController.getMyEvents);

router.post('/events', auth, requireRole('organizer'), eventController.createEvent);
router.put('/events/:id', auth, requireRole('organizer'), eventController.updateEvent);
router.delete('/events/:id', auth, requireRole('organizer', 'admin'), eventController.deleteEvent);

router.patch('/events/:id/approve', auth, requireRole('admin'), eventController.approveEvent);
router.patch('/events/:id/reject', auth, requireRole('admin'), eventController.rejectEvent);

module.exports = router;