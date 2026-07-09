const express = require('express');
const path = require('path');
const loadIndex = require('./src/loadIndex');
const { setIndex, search } = require('./src/search');

const app = express();
const PORT = process.env.PORT || 3001; // Use 3001 to avoid conflicts with backend

// Set up EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Load index before starting server
console.log('Loading search index...\n');
const index = loadIndex();
setIndex(index);
console.log('Index loaded, starting server...\n');

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/search', (req, res) => {
  try {
    const query = req.query.query;

    if (!query || !query.trim()) {
      return res.redirect('/');
    }

    const startTime = Date.now();
    const results = search(query, 10);
    const searchTime = Date.now() - startTime;

    res.render('results', {
      query,
      results,
      searchTime
    });
  } catch (error) {
    console.error('Search error:', error);
    res.render('index', { error: 'An unexpected error occurred during search. Please try again.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
