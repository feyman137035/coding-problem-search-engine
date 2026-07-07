import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUTPUT_DIR = os.path.join(BASE_DIR, "data")
PROBLEMS_DIR = os.path.join(OUTPUT_DIR, "problems")
CHECKPOINT_FILE = os.path.join(BASE_DIR, "scraper", "checkpoint.json")
FAILED_URLS_FILE = os.path.join(BASE_DIR, "scraper", "failed_urls.txt")
DELAY_SECONDS_MIN = 3
DELAY_SECONDS_MAX = 5

LEETCODE_GRAPHQL_URL = "https://leetcode.com/graphql"
CODECHEF_BASE_URL = "https://www.codechef.com"
CODECHEF_TAGS = [
    "array",
    "dynamic-programming",
    "graph-theory",
    "greedy",
    "math",
    "strings",
    "bit-manipulation",
    "sorting",
    "searching",
    "tree",
    "linked-list",
    "stack",
    "queue",
    "hash-table",
    "two-pointers",
    "sliding-window",
    "backtracking",
    "divide-and-conquer",
    "heap",
    "trie"
]
