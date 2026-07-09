/**
 * Caching Middleware
 * Uses node-cache to cache GET requests
 */

const NodeCache = require('node-cache');

// Create cache instance with default TTL of 5 minutes (300 seconds)
const cache = new NodeCache({ stdTTL: 300, checkperiod: 120 });

/**
 * Cache middleware for GET requests
 * Caches responses based on the full URL (including query params)
 */
const cacheMiddleware = (duration = 300) => {
    return (req, res, next) => {
        // Only cache GET requests
       if (req.method !== 'GET') {
            return next();
        }

        const key = req.originalUrl || req.url;

        // Check if data exists in cache
        const cachedData = cache.get(key);
        if (cachedData) {
            return res.json(cachedData);
        }

        // Store original json method
        const originalJson = res.json.bind(res);

        // Override json method to cache response
        res.json = (data) => {
            // Cache the response
            cache.set(key, data, duration);
            return originalJson(data);
        };

        next();
    };
};

/**
 * Clear cache for specific key pattern
 * @param {string} pattern - URL pattern to clear
 */
const clearCache = (pattern) => {
    const keys = cache.keys();
    keys.forEach((key) => {
        if (key.includes(pattern)) {
            cache.del(key);
        }
    });
};

/**
 * Clear all cache
 */
const clearAllCache = () => {
    cache.flushAll();
};

/**
 * Get cache stats
 */
const getCacheStats = () => {
    return cache.getStats();
};

module.exports = {
    cacheMiddleware,
    clearCache,
    clearAllCache,
    getCacheStats,
    cache,
};
