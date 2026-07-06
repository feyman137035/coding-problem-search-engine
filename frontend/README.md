# Algo Search - Frontend

A fully functional, responsive frontend for a coding problem search engine. This is Phase 1 — frontend only, using mock/dummy data.

## Features

- **Homepage**: Clean, centered layout with a prominent search bar
- **Search Results**: Filterable results with difficulty, platform, and tag filters
- **Infinite Scroll**: Loads more results as you scroll
- **Problem Details**: Detailed view of each problem with examples and constraints
- **Related Problems**: Shows related problems based on shared tags
- **Responsive Design**: Mobile-first design that works on all screen sizes

## File Structure

```
frontend/
├── index.html          # Homepage with search bar
├── results.html        # Search results page
├── problem.html        # Single problem detail page
├── css/
│   └── style.css       # All styles with responsive design
├── js/
│   ├── data.js         # Mock dataset of 50 coding problems
│   ├── search.js       # Search + filter logic
│   ├── infinite-scroll.js  # Infinite scroll implementation
│   └── problem-detail.js    # Problem detail page logic
└── README.md           # This file
```

## How to Run

1. Open the `frontend` folder in your file explorer
2. Double-click `index.html` to open it in your default web browser
3. Alternatively, right-click `index.html` and select "Open with" → your preferred browser

**Note**: This is a static frontend that runs entirely in the browser. No server or backend is required for Phase 1.

## Usage

### Searching
- Enter a search term in the search bar (e.g., "binary search", "dynamic programming", "array")
- Press Enter or click the Search button
- Click on quick tags for common searches

### Filtering Results
- Use the sidebar filters to narrow down results by:
  - **Difficulty**: Easy, Medium, Hard
  - **Platform**: LeetCode, CodeChef, Codeforces
  - **Tags**: Various algorithm and data structure tags
- Filters update results instantly without page reload
- Click "Clear All Filters" to reset

### Viewing Problem Details
- Click on any problem card to view full details
- See description, constraints, and example inputs/outputs
- Click "Solve on [Platform]" to open the original problem
- View related problems that share tags

### Infinite Scroll
- Results load 10 at a time
- Scroll down to load more results automatically
- A loading spinner appears while fetching more results
- "You've reached the end" message appears when all results are shown

## Mock Data

The `js/data.js` file contains 50 mock coding problems from:
- **LeetCode**: 30 problems
- **CodeChef**: 7 problems
- **Codeforces**: 13 problems

Each problem includes:
- Title, platform, difficulty
- Tags (e.g., Array, DP, Graph, String, Tree)
- URL to the original problem
- Description and constraints
- Example inputs and outputs

## Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Custom properties, Flexbox, Grid, responsive design
- **Vanilla JavaScript**: No frameworks or libraries

## Browser Compatibility

Works on all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Phases

- **Phase 2**: Backend API with real TF-IDF search
- **Phase 3**: Real-time scraping from platforms
- **Phase 4**: User accounts and saved problems
- **Phase 5**: Problem discussion and solutions

## Design Notes

- Mobile-first responsive design
- CSS custom properties for easy theming
- Clean, modern minimal design
- Smooth hover states and transitions
- Accessible color contrast
- Semantic HTML5 elements
