/**
 * Infinite scroll functionality for results page
 * Loads more results as user scrolls near the bottom
 */

let isLoading = false;
let scrollHandler = null;
const LOAD_THRESHOLD = 200; // Distance from bottom to trigger load (in pixels)
const SIMULATED_DELAY = 500; // Simulated loading delay in milliseconds

/**
 * Initialize infinite scroll
 */
function initializeInfiniteScroll() {
    // Remove existing handler if any
    if (scrollHandler) {
        window.removeEventListener('scroll', scrollHandler);
    }

    // Create new scroll handler
    scrollHandler = handleScroll;
    window.addEventListener('scroll', scrollHandler);
}

/**
 * Handle scroll event
 */
function handleScroll() {
    if (isLoading) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Check if we're near the bottom
    if (scrollTop + windowHeight >= documentHeight - LOAD_THRESHOLD) {
        loadMore();
    }
}

/**
 * Load more results
 */
function loadMore() {
    if (isLoading || !hasMoreResults()) {
        if (!hasMoreResults()) {
            showEndMessage();
        }
        return;
    }

    isLoading = true;
    showLoadingSpinner();

    // Simulate network delay
    setTimeout(() => {
        const loaded = loadMoreResults();
        
        hideLoadingSpinner();
        isLoading = false;

        if (!loaded) {
            showEndMessage();
        }
    }, SIMULATED_DELAY);
}

/**
 * Show loading spinner
 */
function showLoadingSpinner() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.style.display = 'flex';
    }
}

/**
 * Hide loading spinner
 */
function hideLoadingSpinner() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.style.display = 'none';
    }
}

/**
 * Show end of results message
 */
function showEndMessage() {
    const endMessage = document.getElementById('endMessage');
    if (endMessage) {
        endMessage.style.display = 'block';
    }
}

/**
 * Hide end of results message
 */
function hideEndMessage() {
    const endMessage = document.getElementById('endMessage');
    if (endMessage) {
        endMessage.style.display = 'none';
    }
}

/**
 * Reset infinite scroll state
 * Call this when search/filter changes
 */
function resetInfiniteScroll() {
    isLoading = false;
    hideLoadingSpinner();
    hideEndMessage();
    
    // Re-initialize scroll handler
    initializeInfiniteScroll();
}

/**
 * Check if more results are available
 * This function is defined in search.js but we need to ensure it's accessible
 */
function hasMoreResults() {
    // This will be overridden by the function in search.js
    // We define it here as a fallback
    const shownResults = (typeof currentPage !== 'undefined') ? (currentPage + 1) * 10 : 0;
    const totalResults = typeof filteredResults !== 'undefined' ? filteredResults.length : 0;
    return shownResults < totalResults;
}

/**
 * Load more results
 * This function is defined in search.js but we need to ensure it's accessible
 */
function loadMoreResults() {
    // This will be overridden by the function in search.js
    // We define it here as a fallback
    if (typeof currentPage !== 'undefined' && typeof filteredResults !== 'undefined') {
        const RESULTS_PER_PAGE = 10;
        const totalResults = filteredResults.length;
        const shownResults = (currentPage + 1) * RESULTS_PER_PAGE;
        
        if (shownResults >= totalResults) {
            return false;
        }
        
        currentPage++;
        if (typeof renderCurrentPage === 'function') {
            renderCurrentPage();
        }
        return true;
    }
    return false;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeInfiniteScroll);
} else {
    initializeInfiniteScroll();
}
