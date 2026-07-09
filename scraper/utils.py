import os
import json
import random
import time
import re
from bs4 import BeautifulSoup
from config import (
    PROBLEMS_DIR,
    CHECKPOINT_FILE,
    FAILED_URLS_FILE,
    OUTPUT_DIR,
    DELAY_SECONDS_MIN,
    DELAY_SECONDS_MAX
)


def ensure_dirs():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    os.makedirs(PROBLEMS_DIR, exist_ok=True)


def strip_html_tags(html_content):
    if not html_content:
        return ""
    soup = BeautifulSoup(html_content, "html.parser")
    return soup.get_text(separator="\n", strip=True)


def clean_text(text):
    text = re.sub(r"[\x00-\x1F\x7F]", "", text)
    return text


def append_to_file(file_path, text):
    with open(file_path, "a", encoding="utf-8") as f:
        f.write(text + "\n")


def save_problem(problem_number, problem_text, tags=None):
    problem_path = os.path.join(PROBLEMS_DIR, f"problemtext{problem_number}.txt")
    content = clean_text(problem_text)
    if tags:
        tags_str = ", ".join(tags)
        content += f"\n\n---TAGS---\n{tags_str}"
    with open(problem_path, "w", encoding="utf-8") as f:
        f.write(content)


def load_checkpoint():
    os.makedirs(os.path.dirname(CHECKPOINT_FILE), exist_ok=True)
    if os.path.exists(CHECKPOINT_FILE):
        with open(CHECKPOINT_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {
        "last_leetcode_index": 0,
        "last_codechef_index": 0,
        "total_scraped": 0,
        "failed_urls": []
    }


def save_checkpoint(checkpoint_data):
    os.makedirs(os.path.dirname(CHECKPOINT_FILE), exist_ok=True)
    with open(CHECKPOINT_FILE, "w", encoding="utf-8") as f:
        json.dump(checkpoint_data, f, ensure_ascii=False, indent=2)


def save_failed_urls(failed_urls):
    with open(FAILED_URLS_FILE, "w", encoding="utf-8") as f:
        for url in failed_urls:
            f.write(url + "\n")


def delay():
    time.sleep(random.uniform(DELAY_SECONDS_MIN, DELAY_SECONDS_MAX))
