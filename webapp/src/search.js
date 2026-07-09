const { tokenize } = require('./tokenizer');

let index = null;

function setIndex(loadedIndex) {
  index = loadedIndex;
}

function search(queryString, topN = 10) {
  if (!index) {
    throw new Error('Index not loaded. Call setIndex first!');
  }

  // Step 1: Tokenize the query using the shared tokenizer
  const queryTokens = tokenize(queryString);
  if (queryTokens.length === 0) {
    return [];
  }

  // Step 2: Count query term frequencies
  const queryTermCounts = new Map();
  const queryTermsInVocab = [];
  for (const token of queryTokens) {
    if (index.keywordToIndex.has(token)) {
      queryTermsInVocab.push(token);
      queryTermCounts.set(token, (queryTermCounts.get(token) || 0) + 1);
    } else {
      console.log(`Ignoring query term not in vocabulary: "${token}"`);
    }
  }

  if (queryTermsInVocab.length === 0) {
    return [];
  }

  // Step 3: Compute query TF-IDF vector
  const queryTfidf = new Map();
  const queryTotalTerms = queryTermsInVocab.length;
  let queryMagnitudeSq = 0;

  for (const token of queryTermsInVocab) {
    const keywordIndex = index.keywordToIndex.get(token);
    const tf = queryTermCounts.get(token) / queryTotalTerms; // Normalized TF (same as index)
    const idf = index.idf[keywordIndex];
    const tfidf = tf * idf;

    queryTfidf.set(keywordIndex, tfidf);
    queryMagnitudeSq += tfidf * tfidf;
  }

  const queryMagnitude = Math.sqrt(queryMagnitudeSq);
  if (queryMagnitude === 0) {
    return [];
  }

  // Step 4: Compute cosine similarity for every document
  const scores = [];

  // Iterate over all documents (index.documents[1..n])
  for (let docIndex = 1; docIndex < index.documents.length; docIndex++) {
    const doc = index.documents[docIndex];
    const docVector = index.docVectors.get(docIndex) || new Map();
    let dotProduct = 0;

    // Only iterate over the terms present in the query (not the entire vocabulary!)
    for (const [keywordIndex, queryValue] of queryTfidf.entries()) {
      const docValue = docVector.get(keywordIndex) || 0;
      dotProduct += queryValue * docValue;
    }

    if (doc.magnitude === 0) {
      continue;
    }

    const similarity = dotProduct / (queryMagnitude * doc.magnitude);

    if (similarity > 0) {
      scores.push({
        doc,
        score: similarity
      });
    }
  }

  // Step 5: Sort by score descending, take top N
  scores.sort((a, b) => b.score - a.score);
  return scores.slice(0, topN);
}

module.exports = { setIndex, search };
