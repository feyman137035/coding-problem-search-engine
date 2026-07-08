const stopwords = new Set([
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "i",
  "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
  "this", "but", "his", "by", "from", "they", "we", "say", "her", "she",
  "or", "an", "will", "my", "one", "all", "would", "there", "their", "what",
  "so", "up", "out", "if", "about", "who", "get", "which", "go", "me",
  "when", "make", "can", "like", "time", "no", "just", "him", "know", "take",
  "people", "into", "year", "your", "good", "some", "could", "them", "see", "other",
  "than", "then", "now", "look", "only", "come", "its", "over", "think", "also",
  "back", "after", "use", "two", "how", "our", "work", "first", "well", "way",
  "even", "new", "want", "because", "any", "these", "give", "day", "most", "us"
]);

function tokenize(text) {
  if (!text) return [];
  
  // Step 0: Remove tags marker but keep tags content
  let processed = text.replace(/---TAGS---/g, " ");
  
  // Step 1: Lowercase everything
  processed = processed.toLowerCase();
  
  // Step 2: Strip HTML tags/entities
  processed = processed.replace(/<[^>]*>/g, " "); // Remove tags
  processed = processed.replace(/&[a-zA-Z0-9#]+;/g, " "); // Remove entities
  
  // Step 3: Remove punctuation (keep alphanumeric and spaces)
  processed = processed.replace(/[^a-zA-Z0-9\s]/g, " ");
  
  // Step 4: Split on whitespace
  let tokens = processed.split(/\s+/);
  
  // Step 5: Filter stopwords and short tokens (length < 2)
  tokens = tokens.filter(token => {
    return token.length >= 2 && !stopwords.has(token);
  });
  
  return tokens;
}

module.exports = { tokenize };
