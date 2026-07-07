# Coding Problem Scraper

This scraper collects coding problems from LeetCode and CodeChef and saves them in a structured format.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Ensure Chrome is installed on your system (required for Selenium).

## Usage

### Basic Usage
Scrape 2000 problems (default) with 60% LeetCode and 40% CodeChef:
```bash
python main.py
```

### Custom Target Count
Scrape a custom number of problems:
```bash
python main.py --target 1000
```

### Custom LeetCode Ratio
Change the ratio of LeetCode problems (0-1):
```bash
python main.py --target 1500 --leetcode-ratio 0.7
```

## Resuming After Interruption

If the scraper is interrupted (e.g., by Ctrl+C or crash), simply re-run the same command. The scraper will automatically resume from the last saved checkpoint.

## Output Structure

The scraper saves data in the `data/` directory at the project root:
```
data/
├── problemurls.txt       # One URL per line, in scrape order
├── problemtitles.txt     # One title per line, matching problemurls.txt
└── problems/
    ├── problemtext1.txt  # Plain text of problem 1's statement
    ├── problemtext2.txt
    └── ...
```

## Expected Runtime

Given the required delays between requests, scraping 2000 problems typically takes **2-4 hours**.

## Troubleshooting

If scraping fails:
1. Check if LeetCode or CodeChef have changed their website structure
2. Verify the GraphQL query for LeetCode is still valid
3. Check if the CSS selector for CodeChef's problem statement is still correct
