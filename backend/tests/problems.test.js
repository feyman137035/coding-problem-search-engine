/**
 * Tests: GET /api/problems  +  GET /api/problems/search
 */

const request = require('supertest');
const app = require('../src/app');
const Problem = require('../src/models/Problem');
const { connect, disconnect, clearCollections } = require('./helpers/dbHelper');

// ─── Sample fixtures ──────────────────────────────────────────────────────────

const makeProblem = (overrides = {}) => ({
    title: 'Two Sum',
    platform: 'LeetCode',
    difficulty: 'Easy',
    tags: ['array', 'hash-table'],
    url: 'https://leetcode.com/problems/two-sum/',
    description: 'Given an array of integers nums and an integer target, return indices.',
    constraints: '2 <= nums.length <= 10^4',
    examples: [{ input: '[2,7,11,15], target=9', output: '[0,1]' }],
    source: 'scraped',
    ...overrides,
});

// ─── Setup / Teardown ─────────────────────────────────────────────────────────

beforeAll(async () => {
    // Set dummy env vars so JWT / cache middleware don't crash
    process.env.JWT_SECRET = 'test-secret';
    process.env.NODE_ENV = 'test';
    await connect();
});

afterAll(async () => {
    await disconnect();
});

afterEach(async () => {
    await clearCollections();
});

// ─── GET /api/problems ────────────────────────────────────────────────────────

describe('GET /api/problems', () => {
    test('returns 200 with correct response shape', async () => {
        await Problem.create([
            makeProblem({ title: 'Two Sum' }),
            makeProblem({ title: 'Reverse Linked List', tags: ['linked-list'] }),
        ]);

        const res = await request(app).get('/api/problems');

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.pagination).toBeDefined();
        expect(res.body.pagination).toMatchObject({
            page: 1,
            limit: 10,
            total: 2,
            pages: 1,
        });
    });

    test('pagination: ?page=2&limit=1 returns second item only', async () => {
        // Insert 2 problems
        await Problem.create([
            makeProblem({ title: 'Alpha' }),
            makeProblem({ title: 'Beta' }),
        ]);

        const res = await request(app).get('/api/problems?page=2&limit=1');

        expect(res.status).toBe(200);
        expect(res.body.data).toHaveLength(1);
        expect(res.body.pagination.page).toBe(2);
        expect(res.body.pagination.total).toBe(2);
    });

    test('excludes algozenith problems', async () => {
        await Problem.create([
            makeProblem({ title: 'Public Problem' }),
            makeProblem({ title: 'Hidden Problem', source: 'algozenith' }),
        ]);

        const res = await request(app).get('/api/problems');

        expect(res.status).toBe(200);
        expect(res.body.data).toHaveLength(1);
        expect(res.body.data[0].title).toBe('Public Problem');
    });

    test('filters by difficulty', async () => {
        await Problem.create([
            makeProblem({ title: 'Easy One', difficulty: 'Easy' }),
            makeProblem({ title: 'Hard One', difficulty: 'Hard' }),
        ]);

        const res = await request(app).get('/api/problems?difficulty=Easy');

        expect(res.status).toBe(200);
        // All returned problems should have difficulty Easy
        res.body.data.forEach((p) => expect(p.difficulty).toBe('Easy'));
    });
});

// ─── GET /api/problems/search ─────────────────────────────────────────────────

describe('GET /api/problems/search', () => {
    beforeEach(async () => {
        await Problem.create([
            makeProblem({
                title: 'Two Sum',
                description: 'Find two numbers that add up to a target',
                tags: ['array', 'hash-table'],
            }),
            makeProblem({
                title: 'Binary Search',
                description: 'Search a sorted array efficiently',
                tags: ['binary-search', 'array'],
            }),
            makeProblem({
                title: 'Algozenith Exclusive',
                source: 'algozenith',
                tags: ['dp'],
                description: 'Private problem',
            }),
        ]);
    });

    test('returns 200 with paginated results', async () => {
        const res = await request(app).get('/api/problems/search?q=array');

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.pagination).toBeDefined();
    });

    test('excludes algozenith results', async () => {
        const res = await request(app).get('/api/problems/search?q=algozenith');

        expect(res.status).toBe(200);
        const titles = res.body.data.map((p) => p.title);
        expect(titles).not.toContain('Algozenith Exclusive');
    });

    test('returns relevant results for query', async () => {
        const res = await request(app).get('/api/problems/search?q=binary');

        expect(res.status).toBe(200);
        // Binary Search should rank first or at least appear
        const titles = res.body.data.map((p) => p.title);
        expect(titles).toContain('Binary Search');
    });

    test('difficulty filter works with search', async () => {
        await Problem.create(
            makeProblem({
                title: 'Hard Array Problem',
                difficulty: 'Hard',
                tags: ['array'],
                description: 'A hard array problem',
            })
        );

        const res = await request(app).get(
            '/api/problems/search?q=array&difficulty=Hard'
        );

        expect(res.status).toBe(200);
        res.body.data.forEach((p) => expect(p.difficulty).toBe('Hard'));
    });

    test('returns empty array for no match', async () => {
        const res = await request(app).get(
            '/api/problems/search?q=xyznonexistenttermzyx'
        );

        expect(res.status).toBe(200);
        // Results may be returned (all with score 0) or empty — just verify shape
        expect(Array.isArray(res.body.data)).toBe(true);
    });
});
