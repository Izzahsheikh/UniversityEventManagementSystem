const express = require('express');
const router = express.Router();
const adminController = require('../controller/adminControllers');
const auth = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');

router.get('/admin/users', auth, requireRole('admin'), adminController.getUsers);
router.delete('/admin/users/:id', auth, requireRole('admin'), adminController.deleteUser);
router.get('/admin/stats', auth, requireRole('admin'), adminController.getStats);

module.exports = router;