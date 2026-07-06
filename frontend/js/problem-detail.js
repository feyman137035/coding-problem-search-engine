/**
 * Problem detail page logic
 * Handles displaying problem details and related problems
 */

/**
 * Find problem by ID
 * @param {number} id - Problem ID
 * @returns {Object|null} - Problem object or null if not found
 */
function findProblemById(id) {
    return problems.find(problem => problem.id === parseInt(id)) || null;
}

/**
 * Find related problems that share at least one tag
 * @param {Object} currentProblem - Current problem object
 * @param {number} limit - Maximum number of related problems to return
 * @returns {Array} - Array of related problem objects
 */
function findRelatedProblems(currentProblem, limit = 4) {
    const related = problems.filter(problem => {
        if (problem.id === currentProblem.id) return false;
        
        // Check if they share at least one tag
        return currentProblem.tags.some(tag => problem.tags.includes(tag));
    });

    // Sort by number of shared tags (descending)
    related.sort((a, b) => {
        const aSharedTags = a.tags.filter(tag => currentProblem.tags.includes(tag)).length;
        const bSharedTags = b.tags.filter(tag => currentProblem.tags.includes(tag)).length;
        return bSharedTags - aSharedTags;
    });

    return related.slice(0, limit);
}

/**
 * Render problem details
 * @param {Object} problem - Problem object
 */
function renderProblemDetail(problem) {
    const detailContainer = document.getElementById('problemDetail');
    if (!detailContainer) return;

    const difficultyClass = problem.difficulty.toLowerCase();
    const tagsHtml = problem.tags.map(tag => 
        `<span class="tag">${tag}</span>`
    ).join('');

    const examplesHtml = problem.examples.map((example, index) => `
        <div class="example">
            <h4>Example ${index + 1}</h4>
            <div class="code-block">
                <div class="code-header">Input</div>
                <pre><code>${escapeHtml(example.input)}</code></pre>
            </div>
            <div class="code-block">
                <div class="code-header">Output</div>
                <pre><code>${escapeHtml(example.output)}</code></pre>
            </div>
        </div>
    `).join('');

    detailContainer.innerHTML = `
        <div class="problem-header">
            <div class="problem-meta">
                <span class="difficulty-badge difficulty-${difficultyClass}">${problem.difficulty}</span>
                <span class="platform-badge platform-${problem.platform.toLowerCase()}">${problem.platform}</span>
            </div>
            <h1 class="problem-title">${problem.title}</h1>
            <div class="problem-tags">
                ${tagsHtml}
            </div>
        </div>

        <div class="problem-content">
            <section class="problem-section">
                <h2>Description</h2>
                <p>${problem.description}</p>
            </section>

            <section class="problem-section">
                <h2>Constraints</h2>
                <p>${problem.constraints}</p>
            </section>

            <section class="problem-section">
                <h2>Examples</h2>
                ${examplesHtml}
            </section>

            <section class="problem-section">
                <a href="${problem.url}" target="_blank" rel="noopener noreferrer" class="solve-button">
                    Solve on ${problem.platform}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                </a>
                <a href="results.html" class="back-button">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    Back to Results
                </a>
            </section>
        </div>
    `;
}

/**
 * Render related problems
 * @param {Array} relatedProblems - Array of related problem objects
 */
function renderRelatedProblems(relatedProblems) {
    const relatedGrid = document.getElementById('relatedGrid');
    const relatedSection = document.getElementById('relatedProblems');
    
    if (!relatedGrid || !relatedSection) return;

    if (relatedProblems.length === 0) {
        relatedSection.style.display = 'none';
        return;
    }

    const html = relatedProblems.map(problem => {
        const difficultyClass = problem.difficulty.toLowerCase();
        const tagsHtml = problem.tags.slice(0, 2).map(tag => 
            `<span class="tag">${tag}</span>`
        ).join('');

        return `
            <div class="related-card" onclick="window.location.href='problem.html?id=${problem.id}'">
                <h4 class="related-title">${problem.title}</h4>
                <div class="related-meta">
                    <span class="difficulty-badge difficulty-${difficultyClass}">${problem.difficulty}</span>
                    <span class="platform-badge platform-${problem.platform.toLowerCase()}">${problem.platform}</span>
                </div>
                <div class="related-tags">
                    ${tagsHtml}
                </div>
            </div>
        `;
    }).join('');

    relatedGrid.innerHTML = html;
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Initialize problem detail page
 */
function initializeProblemDetail() {
    // Get problem ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const problemId = urlParams.get('id');

    if (!problemId) {
        // If no ID, redirect to home
        window.location.href = 'index.html';
        return;
    }

    // Find problem
    const problem = findProblemById(problemId);

    if (!problem) {
        // If problem not found, show error
        const detailContainer = document.getElementById('problemDetail');
        if (detailContainer) {
            detailContainer.innerHTML = `
                <div class="error-message">
                    <h2>Problem Not Found</h2>
                    <p>The problem you're looking for doesn't exist.</p>
                    <a href="index.html" class="back-button">Back to Home</a>
                </div>
            `;
        }
        return;
    }

    // Render problem details
    renderProblemDetail(problem);

    // Find and render related problems
    const relatedProblems = findRelatedProblems(problem);
    renderRelatedProblems(relatedProblems);

    // Nav search form
    const navSearchForm = document.getElementById('navSearchForm');
    if (navSearchForm) {
        navSearchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = document.getElementById('navSearchInput').value.trim();
            window.location.href = `results.html?q=${encodeURIComponent(query)}`;
        });
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeProblemDetail);
} else {
    initializeProblemDetail();
}
