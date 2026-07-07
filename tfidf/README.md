# TF-IDF Matrix Generator

This module generates the TF-IDF representation of scraped coding problems, which will be used by the search app in Phase C.

## Prerequisites
- Node.js installed
- Scraper has been run and produced data in `../data/` directory

## How to Run
1. Generate TF-IDF files:
   ```bash
   node generate.js
   ```
2. Validate the pipeline (MANDATORY before Phase C):
   ```bash
   node validate.js
   ```
   - This will show top 5 matches for sample queries ("binary search", "shortest path graph", "dynamic programming")
   - Visually verify that the top results are relevant to the queries

## Preprocessing Choices
- **Tokenizer**: See `tokenizer.js` for the exact `tokenize(text)` function (MUST reuse this EXACT function in Phase C)
- **Preprocessing steps**:
  1. Lowercase all text
  2. Strip HTML tags and entities
  3. Remove punctuation (keep only alphanumeric and spaces)
  4. Split on whitespace into tokens
  5. Remove stopwords (100+ common English words, hardcoded in `tokenizer.js`)
  6. Remove tokens shorter than 2 characters
- **TF Normalization**: Raw term count divided by total number of terms in document
- **Stemming/Lemmatization**: NOT applied
- **IDF Formula**: 1 + log10(N / nt), where N = total docs, nt = number of docs containing term

## Indexing Conventions
- **doc_index**: 1-indexed (matches problemtextN.txt numbering)
- **keyword_index**: 0-indexed (position in keywords.txt)

## Output Files (in tfidf/output/)
1. **keywords.txt**: All unique keywords sorted alphabetically
2. **IDF.txt**: IDF values for each keyword in same order as keywords.txt
3. **TFIDF.txt**: Sparse TF-IDF entries in format: `<doc_index> <keyword_index> <tfidf_value>`
4. **Magnitude.txt**: Magnitude of each document's TF-IDF vector in document order
5. **documents.json**: Helper file with document titles for validation

## Expected File Sizes (for ~2000 documents)
- keywords.txt: ~15,000-40,000 lines
- IDF.txt: Same number of lines as keywords.txt
- TFIDF.txt: ~500,000-1,000,000 lines (sparse, only non-zero entries)
- Magnitude.txt: Same number of lines as total documents

## Re-running
`generate.js` will automatically clean the `output/` directory before writing new files, so it's safe to re-run.
