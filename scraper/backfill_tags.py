import os
import time
import requests
import json
from config import LEETCODE_GRAPHQL_URL, OUTPUT_DIR, PROBLEMS_DIR
from utils import delay


def fetch_leetcode_topic_tags(slug):
    query = """
    query questionContent($titleSlug: String!) {
        question(titleSlug: $titleSlug) {
            topicTags {
                name
            }
        }
    }
    """
    variables = {"titleSlug": slug}
    try:
        response = requests.post(
            LEETCODE_GRAPHQL_URL,
            json={"query": query, "variables": variables},
            headers={
                "Content-Type": "application/json",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            }
        )
        data = response.json()
        question = data["data"]["question"]
        tags = [tag["name"] for tag in question.get("topicTags", [])]
        return tags
    except Exception as e:
        print(f"Error fetching tags for {slug}: {e}")
        return None


def has_tags_marker(file_path):
    if not os.path.exists(file_path):
        return False
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
        return "---TAGS---" in content


def main():
    print("Starting LeetCode tag backfill...")
    start_time = time.time()

    # Load checkpoint
    checkpoint_path = os.path.join(os.path.dirname(__file__), "backfill_checkpoint.json")
    checkpoint = {}
    if os.path.exists(checkpoint_path):
        with open(checkpoint_path, "r", encoding="utf-8") as f:
            checkpoint = json.load(f)

    last_processed_index = checkpoint.get("last_processed_index", 0)
    backfilled_count = checkpoint.get("backfilled_count", 0)
    skipped_count = checkpoint.get("skipped_count", 0)
    failed_count = checkpoint.get("failed_count", 0)

    # Load problem URLs
    problem_urls_path = os.path.join(OUTPUT_DIR, "problemurls.txt")
    problem_urls = []
    with open(problem_urls_path, "r", encoding="utf-8") as f:
        problem_urls = [line.strip() for line in f if line.strip()]

    # Process each problem
    for i, url in enumerate(problem_urls):
        if i < last_processed_index:
            continue

        print(f"Processing problem {i+1}/{len(problem_urls)}: {url}")

        problem_number = i + 1
        file_path = os.path.join(PROBLEMS_DIR, f"problemtext{problem_number}.txt")

        if "leetcode.com" not in url:
            # Skip CodeChef
            skipped_count += 1
            last_processed_index = i + 1
            continue

        # Check if already has tags
        if has_tags_marker(file_path):
            skipped_count += 1
            last_processed_index = i + 1
            continue

        # Extract slug
        try:
            slug = url.split("/problems/")[1].rstrip("/")
            tags = fetch_leetcode_topic_tags(slug)
            if tags:
                # Append tags
                tags_str = ", ".join(tags)
                with open(file_path, "a", encoding="utf-8") as f:
                    f.write(f"\n\n---TAGS---\n{tags_str}")
                backfilled_count += 1
            else:
                failed_count += 1

            # Update checkpoint
            checkpoint = {
                "last_processed_index": i + 1,
                "backfilled_count": backfilled_count,
                "skipped_count": skipped_count,
                "failed_count": failed_count
            }
            with open(checkpoint_path, "w", encoding="utf-8") as f:
                json.dump(checkpoint, f, ensure_ascii=False, indent=2)

            # Progress log
            if (i + 1) % 25 == 0:
                print(f"Progress: {i+1}/{len(problem_urls)}, Backfilled: {backfilled_count}, Skipped: {skipped_count}, Failed: {failed_count}")

            delay()
        except Exception as e:
            print(f"Error processing {url}: {e}")
            failed_count += 1
            # Update checkpoint even if failed
            checkpoint = {
                "last_processed_index": i + 1,
                "backfilled_count": backfilled_count,
                "skipped_count": skipped_count,
                "failed_count": failed_count
            }
            with open(checkpoint_path, "w", encoding="utf-8") as f:
                json.dump(checkpoint, f, ensure_ascii=False, indent=2)
            delay()

    # Summary
    end_time = time.time()
    total_time = end_time - start_time
    print("\n" + "="*50)
    print("Backfill Summary")
    print("="*50)
    print(f"Total problems processed: {len(problem_urls)}")
    print(f"Backfilled tags: {backfilled_count}")
    print(f"Skipped (CodeChef or already tagged): {skipped_count}")
    print(f"Failed: {failed_count}")
    print(f"Total time taken: {total_time:.2f} seconds ({total_time/60:.2f} minutes)")
    print("="*50)


if __name__ == "__main__":
    main()
