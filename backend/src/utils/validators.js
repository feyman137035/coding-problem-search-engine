/**
 * Input Validators
 * Validation rules for API endpoints using express-validator
 */

const { body, param, query } = require('express-validator');

/**
 * Problem validators
 */
const problemValidators = {
    // Validate problem creation/update
    createProblem: [
        body('title')
            .trim()
            .notEmpty()
            .withMessage('Title is required')
            .isLength({ min: 3, max: 200 })
            .withMessage('Title must be between 3 and 200 characters'),
        
        body('platform')
            .trim()
            .notEmpty()
            .withMessage('Platform is required')
            .isIn(['LeetCode', 'CodeChef', 'Codeforces'])
            .withMessage('Platform must be LeetCode, CodeChef, or Codeforces'),
        
        body('difficulty')
            .trim()
            .notEmpty()
            .withMessage('Difficulty is required')
            .isIn(['Easy', 'Medium', 'Hard'])
            .withMessage('Difficulty must be Easy, Medium, or Hard'),
        
        body('tags')
            .isArray({ min: 1 })
            .withMessage('At least one tag is required')
            .custom((tags) => {
                if (!tags.every(tag => typeof tag === 'string')) {
                    throw new Error('All tags must be strings');
                }
                return true;
            }),
        
        body('url')
            .trim()
            .notEmpty()
            .withMessage('URL is required')
            .isURL()
            .withMessage('URL must be a valid URL'),
        
        body('description')
            .trim()
            .notEmpty()
            .withMessage('Description is required')
            .isLength({ min: 10 })
            .withMessage('Description must be at least 10 characters'),
        
        body('constraints')
            .trim()
            .notEmpty()
            .withMessage('Constraints are required'),
        
        body('examples')
            .isArray({ min: 1 })
            .withMessage('At least one example is required')
            .custom((examples) => {
                if (!examples.every(ex => ex.input && ex.output)) {
                    throw new Error('Each example must have input and output');
                }
                return true;
            }),
        
        body('source')
            .optional()
            .isIn(['scraped', 'algozenith'])
            .withMessage('Source must be scraped or algozenith'),
    ],

    // Validate problem ID parameter
    problemId: [
        param('id')
            .notEmpty()
            .withMessage('Problem ID is required')
            .isMongoId()
            .withMessage('Invalid problem ID format'),
    ],

    // Validate search query
    searchQuery: [
        query('q')
            .optional()
            .trim()
            .isLength({ min: 1, max: 100 })
            .withMessage('Query must be between 1 and 100 characters'),
        
        query('difficulty')
            .optional()
            .custom((value) => {
                // Accept string (single) or array (multiple via ?difficulty[]=...)
                const validDifficulties = ['Easy', 'Medium', 'Hard'];
                const vals = Array.isArray(value) ? value : [value];
                if (!vals.every(d => validDifficulties.includes(d))) {
                    throw new Error('difficulty must be Easy, Medium, or Hard');
                }
                return true;
            }),
        
        query('platform')
            .optional()
            .custom((value) => {
                const validPlatforms = ['LeetCode', 'CodeChef', 'Codeforces'];
                const vals = Array.isArray(value) ? value : [value];
                if (!vals.every(p => validPlatforms.includes(p))) {
                    throw new Error('platform must be LeetCode, CodeChef, or Codeforces');
                }
                return true;
            }),
        
        query('tags')
            .optional(),
        
        query('page')
            .optional()
            .isInt({ min: 1 })
            .withMessage('Page must be a positive integer')
            .toInt(),
        
        query('limit')
            .optional()
            .isInt({ min: 1, max: 100 })
            .withMessage('Limit must be between 1 and 100')
            .toInt(),
    ],

    // Validate pagination parameters
    pagination: [
        query('page')
            .optional()
            .isInt({ min: 1 })
            .withMessage('Page must be a positive integer')
            .toInt(),
        
        query('limit')
            .optional()
            .isInt({ min: 1, max: 100 })
            .withMessage('Limit must be between 1 and 100')
            .toInt(),
    ],
};

/**
 * Auth validators
 */
const authValidators = {
    // Validate user registration
    register: [
        body('name')
            .trim()
            .notEmpty()
            .withMessage('Name is required')
            .isLength({ min: 2, max: 50 })
            .withMessage('Name must be between 2 and 50 characters'),
        
        body('email')
            .trim()
            .notEmpty()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Invalid email address')
            .normalizeEmail(),
        
        body('password')
            .notEmpty()
            .withMessage('Password is required')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
            .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    ],

    // Validate user login
    login: [
        body('email')
            .trim()
            .notEmpty()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Invalid email address')
            .normalizeEmail(),
        
        body('password')
            .notEmpty()
            .withMessage('Password is required'),
    ],
};

/**
 * Validation result handler
 * Returns formatted validation errors
 */
const handleValidationErrors = (req, res, next) => {
    const { validationErrors } = req;
    
    if (validationErrors && validationErrors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: validationErrors.map(err => ({
                field: err.path,
                message: err.msg,
            })),
        });
    }
    
    next();
};

module.exports = {
    problemValidators,
    authValidators,
    handleValidationErrors,
};
