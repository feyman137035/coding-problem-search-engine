/**
 * Server Entry Point
 * Connects to MongoDB and starts the HTTP server
 */

require('dotenv').config();

const app = require('./src/app');
const connectDB = require('./src/config/db');
const { buildIndex } = require('./src/services/tfidfService');
const Problem = require('./src/models/Problem');

const PORT = process.env.PORT || 5000;

/**
 * Start the server:
 * 1. Connect to MongoDB
 * 2. Pre-build the TF-IDF index from existing problems
 * 3. Start listening
 */
const startServer = async () => {
    try {
        // 1. Connect to MongoDB
        await connectDB();

        // 2. Pre-build TF-IDF index on startup
        const problems = await Problem.find({ source: { $ne: 'algozenith' } });
        buildIndex(problems);
        console.log(`TF-IDF index pre-built with ${problems.length} problems`);

        // 3. Start HTTP server
        const server = app.listen(PORT, () => {
            console.log(
                `\n🚀  Algo Search API running in ${process.env.NODE_ENV || 'development'} mode`
            );
            console.log(`   Local:  http://localhost:${PORT}`);
            console.log(`   Health: http://localhost:${PORT}/health\n`);
        });

        // Handle unhandled promise rejections gracefully
        process.on('unhandledRejection', (err) => {
            console.error('Unhandled Promise Rejection:', err.message);
            server.close(() => process.exit(1));
        });

        // Handle uncaught exceptions
        process.on('uncaughtException', (err) => {
            console.error('Uncaught Exception:', err.message);
            server.close(() => process.exit(1));
        });

    } catch (error) {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    }
};

startServer();
