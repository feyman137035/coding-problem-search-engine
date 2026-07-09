# Coding Problem Search Engine - Web App

This is the course-specified web application for the coding problem search engine, built with Express.js and EJS server-side templating.

## Prerequisites

1. **TF-IDF index must be generated first:
   - Navigate to the `../tfidf` directory
   - Run `node generate.js` to generate the index files
2. Node.js installed

## Installation

```bash
cd webapp
npm install
```

## Running the Application

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server runs on http://localhost:3001 by default.

## Example Queries to Try

- `binary search`
- `graph shortest path`
- `dynamic programming`
- `linked list`
- `greedy algorithm`

## Important Notes

- This web application is completely separate from the `backend/` and `frontend/` directories from earlier phases. It is a standalone, server-rendered app that uses the precomputed TF-IDF index files.

- **Critical**: If you modify the tokenizer in `../tfidf/tokenizer.js`, you must also update the copy in `src/tokenizer.js` and re-generate the index, otherwise search results will be incorrect!
