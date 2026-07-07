const fs = require("fs");
const path = require("path");
const { tokenize } = require("./tokenizer");

// Paths
const DATA_DIR = path.join(__dirname, "..", "data");
const PROBLEMS_DIR = path.join(DATA_DIR, "problems");
const OUTPUT_DIR = path.join(__dirname, "output");

// Ensure output directory exists, clean it if it does
function setupOutputDir() {
  if (fs.existsSync(OUTPUT_DIR)) {
    // Remove all files in output dir
    const files = fs.readdirSync(OUTPUT_DIR);
    for (const file of files) {
      fs.unlinkSync(path.join(OUTPUT_DIR, file));
    }
  } else {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
}

// Read input files
function readInputFiles() {
  const problemUrls = fs.readFileSync(path.join(DATA_DIR, "problemurls.txt"), "utf-8")
    .split("\n")
    .filter(line => line.trim());
  
  const problemTitles = fs.readFileSync(path.join(DATA_DIR, "problemtitles.txt"), "utf-8")
    .split("\n")
    .filter(line => line.trim());
  
  const documents = [];
  for (let i = 0; i < problemUrls.length; i++) {
    const problemNumber = i + 1;
    const problemPath = path.join(PROBLEMS_DIR, `problemtext${problemNumber}.txt`);
    if (!fs.existsSync(problemPath)) {
      console.warn(`Warning: problemtext${problemNumber}.txt not found, skipping`);
      continue;
    }
    const problemText = fs.readFileSync(problemPath, "utf-8");
    const fullText = `${problemTitles[i]} ${problemText}`; // Combine title + body
    documents.push({
      index: problemNumber,
      title: problemTitles[i],
      url: problemUrls[i],
      text: fullText,
      tokens: tokenize(fullText)
    });
  }
  
  return documents;
}

function main() {
  console.log("Starting TF-IDF generation...");
  const startTime = Date.now();
  
  setupOutputDir();
  const documents = readInputFiles();
  const N = documents.length;
  console.log(`Read ${N} documents`);
  
  // Step 1: Build vocabulary and document frequency
  const vocabulary = new Set();
  const docFreq = new Map(); // term -> number of docs containing term
  const docTermCounts = []; // array of Map(term -> count) for each doc
  
  for (const doc of documents) {
    const termCounts = new Map();
    const uniqueTermsInDoc = new Set();
    
    for (const token of doc.tokens) {
      vocabulary.add(token);
      termCounts.set(token, (termCounts.get(token) || 0) + 1);
      uniqueTermsInDoc.add(token);
    }
    
    docTermCounts.push(termCounts);
    
    for (const term of uniqueTermsInDoc) {
      docFreq.set(term, (docFreq.get(term) || 0) + 1);
    }
  }
  
  // Step 2: Sort vocabulary alphabetically and create keyword index
  const keywords = Array.from(vocabulary).sort();
  const keywordToIndex = new Map();
  keywords.forEach((keyword, idx) => {
    keywordToIndex.set(keyword, idx);
  });
  console.log(`Vocabulary size: ${keywords.length}`);
  
  // Step 3: Compute IDF
  const idfValues = keywords.map(keyword => {
    const nt = docFreq.get(keyword) || 0;
    return 1 + Math.log10(N / (nt || 1)); // Avoid division by zero
  });
  
  // Step 4: Compute TF-IDF for each document
  const tfidfEntries = [];
  const magnitudes = [];
  
  for (let docIdx = 0; docIdx < N; docIdx++) {
    const termCounts = docTermCounts[docIdx];
    const doc = documents[docIdx];
    const totalTerms = doc.tokens.length;
    const docTfidf = new Map(); // term -> tfidf value
    let magnitudeSq = 0;
    
    // Calculate normalized TF * IDF for each term in doc
    for (const [term, count] of termCounts.entries()) {
      const tf = count / totalTerms; // Normalized TF (raw count / total terms)
      const keywordIdx = keywordToIndex.get(term);
      const idf = idfValues[keywordIdx];
      const tfidf = tf * idf;
      
      docTfidf.set(term, tfidf);
      magnitudeSq += tfidf * tfidf;
    }
    
    // Add entries to tfidfEntries
    for (const [term, tfidf] of docTfidf.entries()) {
      const keywordIdx = keywordToIndex.get(term);
      tfidfEntries.push(`${doc.index} ${keywordIdx} ${tfidf.toFixed(6)}`);
    }
    
    // Compute magnitude
    const magnitude = Math.sqrt(magnitudeSq);
    magnitudes.push(magnitude.toFixed(6));
    
    // Progress log every 100 docs
    if ((docIdx + 1) % 100 === 0) {
      console.log(`Processed ${docIdx + 1}/${N} documents`);
    }
  }
  
  console.log(`Total non-zero TF-IDF entries: ${tfidfEntries.length}`);
  
  // Step 5: Write output files
  fs.writeFileSync(path.join(OUTPUT_DIR, "keywords.txt"), keywords.join("\n"));
  fs.writeFileSync(path.join(OUTPUT_DIR, "IDF.txt"), idfValues.map(v => v.toFixed(6)).join("\n"));
  fs.writeFileSync(path.join(OUTPUT_DIR, "TFIDF.txt"), tfidfEntries.join("\n"));
  fs.writeFileSync(path.join(OUTPUT_DIR, "Magnitude.txt"), magnitudes.join("\n"));
  
  // Write document list (for validate.js to use titles)
  const docList = documents.map(doc => JSON.stringify({ index: doc.index, title: doc.title }));
  fs.writeFileSync(path.join(OUTPUT_DIR, "documents.json"), `[${docList.join(",")}]`);
  
  const endTime = Date.now();
  const totalTime = (endTime - startTime) / 1000;
  
  console.log("\n" + "=".repeat(50));
  console.log("TF-IDF Generation Complete");
  console.log("=".repeat(50));
  console.log(`Total documents: ${N}`);
  console.log(`Vocabulary size: ${keywords.length}`);
  console.log(`Non-zero TF-IDF entries: ${tfidfEntries.length}`);
  console.log(`Time taken: ${totalTime.toFixed(2)} seconds`);
  console.log("=".repeat(50));
}

main();
