/**
 * Problem Routes
 * All routes for /api/problems
 */

const express = require('express');
const router = express.Router();

const {
    getAllProblems,
    searchProblems,
    getProblemById,
    createProblem,
    updateProblem,
    deleteProblem,
    getAllTags,
} = require('../controllers/problemController');

const { protect, admin } = require('../middleware/auth');
const { cacheMiddleware } = require('../middleware/cache');
const { searchLimiter } = require('../middleware/rateLimiter');
const { problemValidators, handleValidationErrors } = require('../utils/validators');
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

// ─── Public Routes ───────────────────────────────────────────────────────────

// GET /api/problems/tags — must be before /:id to avoid being caught by param
router.get('/tags', cacheMiddleware(300), getAllTags);

// GET /api/problems/search
router.get(
    '/search',
    searchLimiter,
    validate(problemValidators.searchQuery),
    cacheMiddleware(300),
    searchProblems
);

// GET /api/problems  (paginated list)
router.get('/', validate(problemValidators.pagination), cacheMiddleware(120), getAllProblems);

// GET /api/problems/:id
router.get('/:id', validate(problemValidators.problemId), getProblemById);

// ─── Protected Admin Routes ───────────────────────────────────────────────────

// POST /api/problems
router.post(
    '/',
    protect,
    admin,
    validate(problemValidators.createProblem),
    createProblem
);

// PUT /api/problems/:id
router.put(
    '/:id',
    protect,
    admin,
    validate([...problemValidators.problemId, ...problemValidators.createProblem]),
    updateProblem
);

// DELETE /api/problems/:id
router.delete('/:id', protect, admin, validate(problemValidators.problemId), deleteProblem);

module.exports = router;
