/**
 * Tests: Protected routes reject requests without valid JWT (401)
 *        Rate limiter triggers 429 after exceeding limit
 */

const request = require('supertest');
const express = require('express');
const rateLimit = require('express-rate-limit');
const app = require('../src/app');
const Problem = require('../src/models/Problem');
const { connect, disconnect, clearCollections } = require('./helpers/dbHelper');

// ─── Setup / Teardown ─────────────────────────────────────────────────────────

beforeAll(async () => {
    process.env.JWT_SECRET = 'test-secret';
    process.env.JWT_EXPIRES_IN = '1h';
    process.env.NODE_ENV = 'test';
    await connect();
});

afterAll(async () => {
    await disconnect();
});

afterEach(async () => {
    await clearCollections();
});

// ─── Protected Route Rejection ────────────────────────────────────────────────

describe('Protected route access control', () => {
    test('POST /api/problems returns 401 without token', async () => {
        const res = await request(app).post('/api/problems').send({
            title: 'Unauthorized Problem',
            platform: 'LeetCode',
            difficulty: 'Easy',
            tags: ['array'],
            url: 'https://leetcode.com/problems/two-sum/',
            description: 'Should not be created',
            constraints: 'N/A',
            examples: [{ input: '1', output: '2' }],
        });

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
    });

    test('PUT /api/problems/:id returns 401 without token', async () => {
        const problem = await Problem.create({
            title: 'Existing Problem',
            platform: 'LeetCode',
            difficulty: 'Easy',
            tags: ['array'],
            url: 'https://leetcode.com/problems/two-sum/',
            description: 'A problem to attempt updating',
            constraints: 'N/A',
            examples: [{ input: '1', output: '1' }],
            source: 'scraped',
        });

        const res = await request(app)
            .put(`/api/problems/${problem._id}`)
            .send({ title: 'Modified' });

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
    });

    test('DELETE /api/problems/:id returns 401 without token', async () => {
        const problem = await Problem.create({
            title: 'Problem To Delete',
            platform: 'LeetCode',
            difficulty: 'Easy',
            tags: ['array'],
            url: 'https://leetcode.com/problems/two-sum/',
            description: 'Should not be deleted without auth',
            constraints: 'N/A',
            examples: [{ input: '1', output: '1' }],
            source: 'scraped',
        });

        const res = await request(app).delete(`/api/problems/${problem._id}`);

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
    });

    test('GET /api/auth/me returns 401 without token', async () => {
        const res = await request(app).get('/api/auth/me');
        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
    });

    test('GET /api/auth/me returns 401 with bad token', async () => {
        const res = await request(app)
            .get('/api/auth/me')
            .set('Authorization', 'Bearer totally.invalid.token');
        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
    });
});

// ─── Rate Limiter ─────────────────────────────────────────────────────────────

describe('Rate limiter', () => {
    test('returns 429 after exceeding limit on a dedicated test endpoint', async () => {
        // Build a tiny express app with a very low rate limit (max 2/window)
        const testApp = express();
        testApp.use(express.json());

        const strictLimiter = rateLimit({
            windowMs: 60 * 1000,
            max: 2,
            standardHeaders: false,
            legacyHeaders: false,
            message: {
                success: false,
                message: 'Too many requests',
                error: 'Rate limit exceeded',
            },
        });

        testApp.get('/test', strictLimiter, (req, res) => {
            res.json({ success: true });
        });

        // First two requests should succeed
        await request(testApp).get('/test');
        await request(testApp).get('/test');

        // Third request should be rate-limited
        const res = await request(testApp).get('/test');
        expect(res.status).toBe(429);
    });
});
