/**
 * Test helpers — shared setup / teardown for all test suites
 * Uses mongodb-memory-server so no real DB is touched
 */

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const { clearAllCache } = require('../../src/middleware/cache');
const { getIndex } = require('../../src/services/tfidfService');

let mongoServer;

/**
 * Start an in-memory MongoDB instance and connect Mongoose to it.
 * Call this in beforeAll().
 */
const connect = async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
};

/**
 * Drop the database and close connections.
 * Call this in afterAll().
 */
const disconnect = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
};

/**
 * Clear all collections between tests.
 * Also flushes the in-memory cache so cached responses don't leak between tests.
 * Call this in afterEach() if isolation between individual tests is needed.
 */
const clearCollections = async () => {
    // Flush in-memory response cache
    clearAllCache();

    // Reset TF-IDF index so stale document IDs don't pollute the next test
    getIndex().clear();

    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
};

module.exports = { connect, disconnect, clearCollections };
