/**
 * Search and filter logic for coding problems
 * This handles ranking results based on query and applying filters
 */

// Global state for filtered results
let filteredResults = [];
let currentPage = 0;
const RESULTS_PER_PAGE = 10;

/**
 * Rank results based on query relevance
 * This function can be easily replaced with real TF-IDF from backend in Phase 2
 * @param {string} query - Search query
 * @param {Array} data - Array of problem objects
 * @returns {Array} - Ranked and sorted results
 */
function rankResults(query, data) {
    if (!query || query.trim() === '') {
        return data.map(problem => ({ problem, score: 0 }));
    }

    const queryLower = query.toLowerCase();
    const queryTerms = queryLower.split(/\s+/).filter(term => term.length > 0);

    return data.map(problem => {
        let score = 0;
        const titleLower = problem.title.toLowerCase();
        const tagsLower = problem.tags.map(tag => tag.toLowerCase());

        // Exact match in title gets highest score
        if (titleLower === queryLower) {
            score += 100;
        }
        // Title contains query
        else if (titleLower.includes(queryLower)) {
            score += 50;
        }

        // Match individual terms in title
        queryTerms.forEach(term => {
            if (titleLower.includes(term)) {
                score += 20;
            }
        });

        // Match in tags
        tagsLower.forEach(tag => {
            if (tag.includes(queryLower)) {
                score += 15;
            }
            queryTerms.forEach(term => {
                if (tag.includes(term)) {
                    score += 10;
                }
            });
        });

        // Platform match
        if (problem.platform.toLowerCase() === queryLower) {
            score += 5;
        }

        // Difficulty match
        if (problem.difficulty.toLowerCase() === queryLower) {
            score += 5;
        }

        return { problem, score };
    }).sort((a, b) => b.score - a.score);
}

/**
 * Apply filters to results
 * @param {Array} results - Array of ranked result objects
 * @param {Object} filters - Filter object with difficulty, platform, and tags
 * @returns {Array} - Filtered results
 */
function applyFilters(results, filters) {
    return results.filter(result => {
        const problem = result.problem;

        // Difficulty filter
        if (filters.difficulty.length > 0 && !filters.difficulty.includes(problem.difficulty)) {
            return false;
        }

        // Platform filter
        if (filters.platform.length > 0 && !filters.platform.includes(problem.platform)) {
            return false;
        }

        // Tags filter
        if (filters.tags.length > 0) {
            const hasMatchingTag = problem.tags.some(tag => filters.tags.includes(tag));
            if (!hasMatchingTag) {
                return false;
            }
        }

        return true;
    });
}

/**
 * Get all unique tags from the dataset
 * @returns {Array} - Array of unique tag names
 */
function getAllTags() {
    const tagSet = new Set();
    problems.forEach(problem => {
        problem.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
}

/**
 * Create problem card HTML
 * @param {Object} problem - Problem object
 * @returns {string} - HTML string for the card
 */
function createProblemCard(problem) {
    const difficultyClass = problem.difficulty.toLowerCase();
    const tagsHtml = problem.tags.map(tag => 
        `<span class="tag">${tag}</span>`
    ).join('');

    return `
        <div class="problem-card" onclick="window.location.href='problem.html?id=${problem.id}'">
            <div class="card-header">
                <h3 class="card-title">${problem.title}</h3>
                <span class="platform-badge platform-${problem.platform.toLowerCase()}">${problem.platform}</span>
            </div>
            <div class="card-body">
                <span class="difficulty-badge difficulty-${difficultyClass}">${problem.difficulty}</span>
                <div class="card-tags">
                    ${tagsHtml}
                </div>
            </div>
        </div>
    `;
}

/**
 * Render results to the grid
 * @param {Array} results - Array of problem objects to render
 */
function renderResults(results) {
    const grid = document.getElementById('resultsGrid');
    if (!grid) return;

    if (results.length === 0) {
        grid.innerHTML = '';
        return;
    }

    const html = results.map(result => createProblemCard(result.problem)).join('');
    grid.innerHTML = html;
}

/**
 * Update results count display
 * @param {number} shown - Number of results shown
 * @param {number} total - Total number of results
 */
function updateResultsCount(shown, total) {
    const countEl = document.getElementById('resultsCount');
    if (countEl) {
        countEl.textContent = `Showing ${shown} of ${total} problems`;
    }
}

/**
 * Show/hide no results message
 * @param {boolean} show - Whether to show the message
 */
function toggleNoResults(show) {
    const noResultsEl = document.getElementById('noResults');
    if (noResultsEl) {
        noResultsEl.style.display = show ? 'flex' : 'none';
    }
}

/**
 * Get current filters from checkboxes
 * @returns {Object} - Filter object
 */
function getCurrentFilters() {
    const difficultyCheckboxes = document.querySelectorAll('.filter-difficulty:checked');
    const platformCheckboxes = document.querySelectorAll('.filter-platform:checked');
    const tagCheckboxes = document.querySelectorAll('.filter-tag:checked');

    return {
        difficulty: Array.from(difficultyCheckboxes).map(cb => cb.value),
        platform: Array.from(platformCheckboxes).map(cb => cb.value),
        tags: Array.from(tagCheckboxes).map(cb => cb.value)
    };
}

/**
 * Initialize search functionality
 */
function initializeSearch() {
    // Get query from URL
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q') || '';

    // Set search input value
    const searchInput = document.getElementById('navSearchInput');
    if (searchInput) {
        searchInput.value = query;
    }

    // Generate and populate tags filters
    const allTags = getAllTags();
    const tagsFiltersContainer = document.getElementById('tagsFilters');
    if (tagsFiltersContainer) {
        tagsFiltersContainer.innerHTML = allTags.map(tag => `
            <label class="filter-checkbox">
                <input type="checkbox" value="${tag}" class="filter-tag">
                <span>${tag}</span>
            </label>
        `).join('');
    }

    // Initial search and filter
    performSearch(query);

    // Add event listeners for filters
    const filterInputs = document.querySelectorAll('.filter-difficulty, .filter-platform, .filter-tag');
    filterInputs.forEach(input => {
        input.addEventListener('change', () => {
            performSearch(query);
        });
    });

    // Clear filters button
    const clearFiltersBtn = document.getElementById('clearFilters');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', () => {
            document.querySelectorAll('.filter-difficulty, .filter-platform, .filter-tag').forEach(cb => {
                cb.checked = false;
            });
            performSearch(query);
        });
    }

    // Nav search form
    const navSearchForm = document.getElementById('navSearchForm');
    if (navSearchForm) {
        navSearchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newQuery = document.getElementById('navSearchInput').value.trim();
            window.location.href = `results.html?q=${encodeURIComponent(newQuery)}`;
        });
    }

    // Mobile filters toggle
    const filtersToggleMobile = document.getElementById('filtersToggleMobile');
    const filtersToggleDesktop = document.getElementById('filtersToggleDesktop');
    const filtersSidebar = document.getElementById('filtersSidebar');

    if (filtersToggleMobile && filtersSidebar) {
        filtersToggleMobile.addEventListener('click', () => {
            filtersSidebar.classList.remove('open');
        });
    }

    if (filtersToggleDesktop && filtersSidebar) {
        filtersToggleDesktop.addEventListener('click', () => {
            filtersSidebar.classList.toggle('open');
        });
    }
}

/**
 * Perform search with current query and filters
 * @param {string} query - Search query
 */
function performSearch(query) {
    const filters = getCurrentFilters();
    
    // Rank results
    const rankedResults = rankResults(query, problems);
    
    // Apply filters
    filteredResults = applyFilters(rankedResults, filters);
    
    // Reset pagination
    currentPage = 0;
    
    // Render first page
    renderCurrentPage();
    
    // Update count
    updateResultsCount(Math.min(RESULTS_PER_PAGE, filteredResults.length), filteredResults.length);
    
    // Show/hide no results
    toggleNoResults(filteredResults.length === 0);
    
    // Reset infinite scroll state
    resetInfiniteScroll();
}

/**
 * Render current page of results
 */
function renderCurrentPage() {
    const start = currentPage * RESULTS_PER_PAGE;
    const end = start + RESULTS_PER_PAGE;
    const pageResults = filteredResults.slice(start, end);
    
    const grid = document.getElementById('resultsGrid');
    if (!grid) return;

    if (currentPage === 0) {
        grid.innerHTML = '';
    }

    const html = pageResults.map(result => createProblemCard(result.problem)).join('');
    grid.innerHTML += html;
    
    // Update count
    const shown = Math.min(end, filteredResults.length);
    updateResultsCount(shown, filteredResults.length);
}

/**
 * Load more results (for infinite scroll)
 * @returns {boolean} - Whether more results were loaded
 */
function loadMoreResults() {
    const totalResults = filteredResults.length;
    const shownResults = (currentPage + 1) * RESULTS_PER_PAGE;
    
    if (shownResults >= totalResults) {
        return false;
    }
    
    currentPage++;
    renderCurrentPage();
    return true;
}

/**
 * Check if more results are available
 * @returns {boolean} - Whether more results are available
 */
function hasMoreResults() {
    const shownResults = (currentPage + 1) * RESULTS_PER_PAGE;
    return shownResults < filteredResults.length;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSearch);
} else {
    initializeSearch();
}
