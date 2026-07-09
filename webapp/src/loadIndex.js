const fs = require('fs');
const path = require('path');

function loadIndex() {
  const tfidfOutputDir = path.join(__dirname, '../../tfidf/output');
  const dataDir = path.join(__dirname, '../../data');

  // Read keywords.txt
  const keywords = fs.readFileSync(path.join(tfidfOutputDir, 'keywords.txt'), 'utf-8')
    .split('\n')
    .filter(line => line.trim());
  console.log(`Loaded ${keywords.length} keywords`);

  // Read IDF.txt
  const idf = fs.readFileSync(path.join(tfidfOutputDir, 'IDF.txt'), 'utf-8')
    .split('\n')
    .filter(line => line.trim())
    .map(parseFloat);
  console.log(`Loaded ${idf.length} IDF values`);

  // Read Magnitude.txt
  const magnitudes = fs.readFileSync(path.join(tfidfOutputDir, 'Magnitude.txt'), 'utf-8')
    .split('\n')
    .filter(line => line.trim())
    .map(parseFloat);
  console.log(`Loaded ${magnitudes.length} document magnitudes`);

  // Read problemtitles.txt and problemurls.txt
  const problemTitles = fs.readFileSync(path.join(dataDir, 'problemtitles.txt'), 'utf-8')
    .split('\n')
    .filter(line => line.trim());
  const problemUrls = fs.readFileSync(path.join(dataDir, 'problemurls.txt'), 'utf-8')
    .split('\n')
    .filter(line => line.trim());
  console.log(`Loaded ${problemTitles.length} problem titles and URLs`);

  // Validate row counts
  if (keywords.length !== idf.length) {
    throw new Error(`Mismatched row count: keywords.txt (${keywords.length}) vs IDF.txt (${idf.length})`);
  }
  if (problemTitles.length !== problemUrls.length || problemTitles.length !== magnitudes.length) {
    throw new Error(`Mismatched document count: titles (${problemTitles.length}), URLs (${problemUrls.length}), magnitudes (${magnitudes.length})`);
  }

  // Build keyword index map (keyword -> index)
  const keywordToIndex = new Map();
  keywords.forEach((keyword, index) => {
    keywordToIndex.set(keyword, index);
  });

  // Build document TF-IDF vectors (docIndex is 1-based)
  const docVectors = new Map();
  const tfidfLines = fs.readFileSync(path.join(tfidfOutputDir, 'TFIDF.txt'), 'utf-8')
    .split('\n')
    .filter(line => line.trim());

  for (const line of tfidfLines) {
    const parts = line.split(' ');
    if (parts.length !== 3) {
      console.warn(`Skipping invalid TF-IDF line: ${line}`);
      continue;
    }
    const docIndex = parseInt(parts[0]);
    const keywordIndex = parseInt(parts[1]);
    const value = parseFloat(parts[2]);

    if (!docVectors.has(docIndex)) {
      docVectors.set(docIndex, new Map());
    }
    docVectors.get(docIndex).set(keywordIndex, value);
  }
  console.log(`Loaded TF-IDF vectors for ${docVectors.size} documents`);

  // Build documents array (index 0 unused, index 1 is doc 1)
  const documents = [];
  documents[0] = null; // unused
  for (let i = 0; i < problemTitles.length; i++) {
    documents.push({
      index: i + 1,
      title: problemTitles[i],
      url: problemUrls[i],
      magnitude: magnitudes[i]
    });
  }

  console.log('\n=== Index Load Summary ===');
  console.log(`- Total documents: ${problemTitles.length}`);
  console.log(`- Vocabulary size: ${keywords.length}`);
  console.log('- All files loaded successfully!');
  console.log('==========================\n');

  return {
    keywords,
    idf,
    keywordToIndex,
    docVectors,
    documents
  };
}

module.exports = loadIndex;
