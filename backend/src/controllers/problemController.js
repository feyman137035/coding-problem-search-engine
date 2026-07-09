/**
 * Problem Controller
 * Handles all problem-related operations
 */

const Problem = require('../models/Problem');
const { buildIndex, rankProblems, getIndex } = require('../services/tfidfService');
const { ApiError, asyncHandler } = require('../middleware/errorHandler');
const { clearCache } = require('../middleware/cache');

/**
 * @desc    Get all problems with pagination
 * @route   GET /api/problems
 * @access  Public
 */
const getAllProblems = asyncHandler(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query
    const query = { source: { $ne: 'algozenith' } }; // Exclude algozenith problems

    // Normalise filters — can come as a string ('Easy') or array (['Easy','Hard'])
    const toArray = (val) => (val ? (Array.isArray(val) ? val : [val]) : null);

    const difficulties = toArray(req.query.difficulty);
    const platforms = toArray(req.query.platform);
    const tags = toArray(req.query.tags);

    if (difficulties) query.difficulty = { $in: difficulties };
    if (platforms)   query.platform   = { $in: platforms };
    if (tags)        query.tags       = { $in: tags };

    const problems = await Problem.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

    const total = await Problem.countDocuments(query);

    res.json({
        success: true,
        data: problems,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
        },
    });
});

/**
 * @desc    Search problems with TF-IDF ranking
 * @route   GET /api/problems/search
 * @access  Public
 */
const searchProblems = asyncHandler(async (req, res, next) => {
    const { q } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build base query (exclude algozenith)
    let query = { source: { $ne: 'algozenith' } };

    // Normalise filters — can come as string or array
    const toArray = (val) => (val ? (Array.isArray(val) ? val : [val]) : null);

    const difficulties = toArray(req.query.difficulty);
    const platforms = toArray(req.query.platform);
    const tags = toArray(req.query.tags);

    if (difficulties) query.difficulty = { $in: difficulties };
    if (platforms)   query.platform   = { $in: platforms };
    if (tags)        query.tags       = { $in: tags };

    // Fetch all matching problems
    let problems = await Problem.find(query);

    // Apply TF-IDF ranking if query is provided
    if (q && q.trim()) {
        const index = getIndex();
        
        // Rebuild index if not built or if data has changed
        if (!index.isBuilt()) {
            const allProblems = await Problem.find({ source: { $ne: 'algozenith' } });
            buildIndex(allProblems);
        }

        // Rank problems using TF-IDF
        const rankedResults = rankProblems(q, problems);
        
        // Extract problems from ranked results
        problems = rankedResults.map(r => r.problem);
    } else {
        // Sort by creation date if no query
        problems.sort((a, b) => b.createdAt - a.createdAt);
    }

    // Apply pagination
    const total = problems.length;
    const paginatedProblems = problems.slice(skip, skip + limit);

    res.json({
        success: true,
        data: paginatedProblems,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
        },
    });
});

/**
 * @desc    Get single problem by ID
 * @route   GET /api/problems/:id
 * @access  Public
 */
const getProblemById = asyncHandler(async (req, res, next) => {
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
        throw new ApiError(404, 'Problem not found');
    }

    // Find related problems (share at least one tag, limit to 4)
    const relatedProblems = await Problem.find({
        _id: { $ne: problem._id },
        tags: { $in: problem.tags },
        source: { $ne: 'algozenith' },
    })
        .limit(4)
        .sort({ createdAt: -1 });

    res.json({
        success: true,
        data: {
            problem,
            relatedProblems,
        },
    });
});

/**
 * @desc    Create a new problem
 * @route   POST /api/problems
 * @access  Admin
 */
const createProblem = asyncHandler(async (req, res, next) => {
    const problem = await Problem.create(req.body);

    // Clear cache and rebuild TF-IDF index
    clearCache('/problems');
    const allProblems = await Problem.find({ source: { $ne: 'algozenith' } });
    buildIndex(allProblems);

    res.status(201).json({
        success: true,
        data: problem,
        message: 'Problem created successfully',
    });
});

/**
 * @desc    Update a problem
 * @route   PUT /api/problems/:id
 * @access  Admin
 */
const updateProblem = asyncHandler(async (req, res, next) => {
    let problem = await Problem.findById(req.params.id);

    if (!problem) {
        throw new ApiError(404, 'Problem not found');
    }

    problem = await Problem.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    // Clear cache and rebuild TF-IDF index
    clearCache('/problems');
    const allProblems = await Problem.find({ source: { $ne: 'algozenith' } });
    buildIndex(allProblems);

    res.json({
        success: true,
        data: problem,
        message: 'Problem updated successfully',
    });
});

/**
 * @desc    Delete a problem
 * @route   DELETE /api/problems/:id
 * @access  Admin
 */
const deleteProblem = asyncHandler(async (req, res, next) => {
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
        throw new ApiError(404, 'Problem not found');
    }

    await problem.deleteOne();

    // Clear cache and rebuild TF-IDF index
    clearCache('/problems');
    const allProblems = await Problem.find({ source: { $ne: 'algozenith' } });
    buildIndex(allProblems);

    res.json({
        success: true,
        data: {},
        message: 'Problem deleted successfully',
    });
});

/**
 * @desc    Get all distinct tags
 * @route   GET /api/problems/tags
 * @access  Public
 */
const getAllTags = asyncHandler(async (req, res, next) => {
    const tags = await Problem.distinct('tags', {
        source: { $ne: 'algozenith' },
    });

    // Sort tags alphabetically
    tags.sort();

    res.json({
        success: true,
        data: tags,
    });
});

module.exports = {
    getAllProblems,
    searchProblems,
    getProblemById,
    createProblem,
    updateProblem,
    deleteProblem,
    getAllTags,
};
