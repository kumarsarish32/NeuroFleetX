// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { isAuthenticated } = require('../middleware/authMiddleware');
const { hasRole } = require('../middleware/roleMiddleware');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Authenticated routes
router.get('/me', isAuthenticated, authController.me);

// Admin-only: set user role
router.post('/users/role', isAuthenticated, hasRole('admin'), authController.setRole);

module.exports = router;