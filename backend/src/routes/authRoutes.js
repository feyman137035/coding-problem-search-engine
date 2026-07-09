/**
 * Auth Routes
 * All routes for /api/auth
 */

const express = require('express');
const router = express.Router();

const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const { authValidators } = require('../utils/validators');
const { validationResult } = require('express-validator');

// Helper to run express-validator and short-circuit with 400 on errors
const validate = (validations) => async (req, res, next) => {
    await Promise.all(validations.map((v) => v.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
        });
    }
    next();
};

// POST /api/auth/register
router.post('/register', validate(authValidators.register), register);

// POST /api/auth/login  — stricter rate limit to prevent brute-force
router.post('/login', authLimiter, validate(authValidators.login), login);

// GET /api/auth/me  — requires valid JWT
router.get('/me', protect, getMe);

module.exports = router;
