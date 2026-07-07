const fs = require("fs");
const path = require("path");
const { tokenize } = require("./tokenizer");

const OUTPUT_DIR = path.join(__dirname, "output");

function loadData() {
  // Load keywords
  const keywords = fs.readFileSync(path.join(OUTPUT_DIR, "keywords.txt"), "utf-8")
    .split("\n")
    .filter(line => line.trim());
  const keywordToIndex = new Map();
  keywords.forEach((kw, idx) => keywordToIndex.set(kw, idx));
  
  // Load IDF
  const idf = fs.readFileSync(path.join(OUTPUT_DIR, "IDF.txt"), "utf-8")
    .split("\n")
    .filter(line => line.trim())
    .map(parseFloat);
  
  // Load TF-IDF entries
  const tfidfLines = fs.readFileSync(path.join(OUTPUT_DIR, "TFIDF.txt"), "utf-8")
    .split("\n")
    .filter(line => line.trim());
  const docTfidf = new Map(); // docIndex -> Map(keywordIndex -> tfidf)
  for (const line of tfidfLines) {
    const [docIndexStr, keywordIndexStr, tfidfStr] = line.split(" ");
    const docIndex = parseInt(docIndexStr);
    const keywordIndex = parseInt(keywordIndexStr);
    const tfidf = parseFloat(tfidfStr);
    
    if (!docTfidf.has(docIndex)) {
      docTfidf.set(docIndex, new Map());
    }
    docTfidf.get(docIndex).set(keywordIndex, tfidf);
  }
  
  // Load magnitudes
  const magnitudes = fs.readFileSync(path.join(OUTPUT_DIR, "Magnitude.txt"), "utf-8")
    .split("\n")
    .filter(line => line.trim())
    .map(parseFloat);
  
  // Load documents
  const documents = JSON.parse(fs.readFileSync(path.join(OUTPUT_DIR, "documents.json"), "utf-8"));
  
  return {
    keywords,
    keywordToIndex,
    idf,
    docTfidf,
    magnitudes,
    documents
  };
}

function computeQueryTfidf(query, keywordToIndex, idf) {
  const tokens = tokenize(query);
  const termCounts = new Map();
  
  for (const token of tokens) {
    termCounts.set(token, (termCounts.get(token) || 0) + 1);
  }
  
  const totalTerms = tokens.length;
  const queryTfidf = new Map(); // keywordIndex -> tfidf
  let magnitudeSq = 0;
  
  for (const [term, count] of termCounts.entries()) {
    const keywordIndex = keywordToIndex.get(term);
    if (keywordIndex === undefined) continue; // Skip terms not in vocabulary
    
    const tf = count / totalTerms;
    const tfidf = tf * idf[keywordIndex];
    queryTfidf.set(keywordIndex, tfidf);
    magnitudeSq += tfidf * tfidf;
  }
  
  const magnitude = Math.sqrt(magnitudeSq);
  return { queryTfidf, magnitude };
}

function computeCosineSimilarity(queryTfidf, queryMagnitude, docTfidfMap, docMagnitude) {
  if (queryMagnitude === 0 || docMagnitude === 0) return 0;
  
  let dotProduct = 0;
  for (const [keywordIndex, qTfidf] of queryTfidf.entries()) {
    const dTfidf = docTfidfMap.get(keywordIndex) || 0;
    dotProduct += qTfidf * dTfidf;
  }
  
  return dotProduct / (queryMagnitude * docMagnitude);
}

function validateQuery(query, data) {
  const { keywordToIndex, idf, docTfidf, magnitudes, documents } = data;
  
  console.log(`\n=== Query: "${query}" ==`);
  
  const { queryTfidf, magnitude: queryMagnitude } = computeQueryTfidf(query, keywordToIndex, idf);
  
  // Compute similarity for all docs
  const similarities = [];
  for (let docIdx = 0; docIdx < documents.length; docIdx++) {
    const doc = documents[docIdx];
    const docTfidfMap = docTfidf.get(doc.index) || new Map();
    const docMagnitude = magnitudes[docIdx] || 0;
    const similarity = computeCosineSimilarity(queryTfidf, queryMagnitude, docTfidfMap, docMagnitude);
    
    if (similarity > 0) {
      similarities.push({ doc, similarity });
    }
  }
  
  // Sort by similarity descending
  similarities.sort((a, b) => b.similarity - a.similarity);
  
  // Check if we have any relevant matches
  if (similarities.length === 0) {
    console.log("No relevant matches found for this query — corpus may be too small or lack this topic");
  } else {
    // Print top 5
    console.log("Top 5 matching documents:");
    for (let i = 0; i < Math.min(5, similarities.length); i++) {
      const { doc, similarity } = similarities[i];
      console.log(`${i + 1}. [Score: ${similarity.toFixed(6)}] ${doc.title}`);
    }
  }
}

function main() {
  console.log("Loading TF-IDF data...");
  const data = loadData();
  console.log("Data loaded successfully!");
  
  // Test queries
  const testQueries = [
    "binary search",
    "shortest path graph",
    "dynamic programming"
  ];
  
  for (const query of testQueries) {
    validateQuery(query, data);
  }
}

main();
