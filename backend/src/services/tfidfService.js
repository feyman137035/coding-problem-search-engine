/**
 * TF-IDF Search Service
 * Implements TF-IDF (Term Frequency-Inverse Document Frequency) for ranking search results
 */

/**
 * Tokenize text into terms
 * Converts to lowercase, removes special characters, splits into words
 * @param {string} text - Text to tokenize
 * @returns {Array} - Array of tokens
 */
function tokenize(text) {
    if (!text) return [];
    
    return text
        .toLowerCase()
        .replace(/[^\w\s]/g, ' ') // Replace special chars with space
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .trim()
        .split(' ')
        .filter(token => token.length > 0); // Remove empty tokens
}

/**
 * Build document text from problem fields
 * Combines title, description, and tags for search indexing
 * @param {Object} problem - Problem object
 * @returns {string} - Combined text
 */
function buildDocumentText(problem) {
    const parts = [
        problem.title || '',
        problem.description || '',
        problem.tags ? problem.tags.join(' ') : '',
    ];
    return parts.join(' ');
}

/**
 * Calculate term frequency for a document
 * @param {Array} tokens - Document tokens
 * @returns {Object} - Term frequency map { term: frequency }
 */
function calculateTermFrequency(tokens) {
    const tf = {};
    tokens.forEach(token => {
        tf[token] = (tf[token] || 0) + 1;
    });
    return tf;
}

/**
 * Calculate inverse document frequency
 * @param {Array} documents - Array of document token arrays
 * @returns {Object} - IDF map { term: idf }
 */
function calculateInverseDocumentFrequency(documents) {
    const N = documents.length;
    const idf = {};
    const docCount = {};

    // Count documents containing each term
    documents.forEach(tokens => {
        const uniqueTokens = [...new Set(tokens)];
        uniqueTokens.forEach(token => {
            docCount[token] = (docCount[token] || 0) + 1;
        });
    });

    // Calculate IDF for each term
    Object.keys(docCount).forEach(term => {
        // Add 1 to avoid division by zero
        idf[term] = Math.log(N / (1 + docCount[term]));
    });

    return idf;
}

/**
 * Calculate TF-IDF vector for a document
 * @param {Object} tf - Term frequency map
 * @param {Object} idf - IDF map
 * @returns {Object} - TF-IDF vector { term: tfidf }
 */
function calculateTFIDF(tf, idf) {
    const tfidf = {};
    Object.keys(tf).forEach(term => {
        tfidf[term] = tf[term] * (idf[term] || 0);
    });
    return tfidf;
}

/**
 * Calculate cosine similarity between two vectors
 * @param {Object} vec1 - First vector { term: value }
 * @param {Object} vec2 - Second vector { term: value }
 * @returns {number} - Cosine similarity score
 */
function cosineSimilarity(vec1, vec2) {
    const terms = new Set([...Object.keys(vec1), ...Object.keys(vec2)]);
    
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    terms.forEach(term => {
        const v1 = vec1[term] || 0;
        const v2 = vec2[term] || 0;
        dotProduct += v1 * v2;
        norm1 += v1 * v1;
        norm2 += v2 * v2;
    });

    if (norm1 === 0 || norm2 === 0) return 0;
    
    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
}

/**
 * TF-IDF Index
 * Stores the index for fast search
 */
class TFIDFIndex {
    constructor() {
        this.documents = []; // Array of { id, tfidf, problem }
        this.idf = {};
        this.built = false;
    }

    /**
     * Build the TF-IDF index from problems
     * @param {Array} problems - Array of problem objects
     */
    buildIndex(problems) {
        // Filter out algozenith problems from search index
        const searchableProblems = problems.filter(p => p.source !== 'algozenith');
        
        if (searchableProblems.length === 0) {
            console.log('No searchable problems to index');
            this.built = true;
            return;
        }

        // Tokenize all documents
        const documents = searchableProblems.map(problem => ({
            id: problem._id || problem.id,
            problem,
            text: buildDocumentText(problem),
            tokens: tokenize(buildDocumentText(problem)),
        }));

        // Calculate IDF across all documents
        const tokenArrays = documents.map(doc => doc.tokens);
        this.idf = calculateInverseDocumentFrequency(tokenArrays);

        // Calculate TF-IDF for each document
        this.documents = documents.map(doc => {
            const tf = calculateTermFrequency(doc.tokens);
            const tfidf = calculateTFIDF(tf, this.idf);
            return {
                id: doc.id,
                problem: doc.problem,
                tfidf,
            };
        });

        this.built = true;
        console.log(`TF-IDF index built with ${this.documents.length} documents`);
    }

    /**
     * Search for problems using TF-IDF
     * @param {string} query - Search query
     * @param {Array} problems - All problems (for filtering)
     * @returns {Array} - Ranked problems with scores
     */
    search(query, problems) {
        if (!this.built) {
            console.warn('Index not built, returning unfiltered results');
            return problems.map(p => ({ problem: p, score: 0 }));
        }

        // Build a set of allowed IDs from the pre-filtered problems array
        // so that DB-level filters (difficulty, platform, tags) are respected.
        const allowedIds = new Set(
            problems.map(p => (p._id || p.id).toString())
        );

        // Tokenize query
        const queryTokens = tokenize(query);
        if (queryTokens.length === 0) {
            return this.documents
                .filter(doc => allowedIds.has(doc.id.toString()))
                .map(doc => ({ problem: doc.problem, score: 0 }));
        }

        // Calculate query TF-IDF
        const queryTF = calculateTermFrequency(queryTokens);
        const queryTFIDF = calculateTFIDF(queryTF, this.idf);

        // Calculate similarity only for allowed documents (those matching DB filters)
        const results = this.documents
            .filter(doc => allowedIds.has(doc.id.toString()))
            .map(doc => {
                const similarity = cosineSimilarity(queryTFIDF, doc.tfidf);
                return {
                    problem: doc.problem,
                    score: similarity,
                };
            });

        // Sort by score (descending)
        results.sort((a, b) => b.score - a.score);

        return results;
    }

    /**
     * Check if index is built
     * @returns {boolean}
     */
    isBuilt() {
        return this.built;
    }

    /**
     * Clear the index
     */
    clear() {
        this.documents = [];
        this.idf = {};
        this.built = false;
    }
}

// Global index instance
const tfidfIndex = new TFIDFIndex();

/**
 * Build index from problems (wrapper function)
 * @param {Array} problems - Array of problem objects
 */
function buildIndex(problems) {
    tfidfIndex.buildIndex(problems);
}

/**
 * Rank problems based on query (wrapper function)
 * @param {string} query - Search query
 * @param {Array} problems - Array of problem objects
 * @returns {Array} - Ranked problems with scores
 */
function rankProblems(query, problems) {
    return tfidfIndex.search(query, problems);
}

/**
 * Get the index instance (for testing/cache management)
 * @returns {TFIDFIndex}
 */
function getIndex() {
    return tfidfIndex;
}

module.exports = {
    TFIDFIndex,
    buildIndex,
    rankProblems,
    getIndex,
    tokenize,
    buildDocumentText,
};
