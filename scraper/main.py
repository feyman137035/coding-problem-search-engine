import argparse
import os
import time
import sys
from config import OUTPUT_DIR, CHECKPOINT_FILE, FAILED_URLS_FILE
from utils import (
    ensure_dirs,
    append_to_file,
    save_problem,
    load_checkpoint,
    save_checkpoint,
    save_failed_urls,
    delay
)
from leetcode_scraper import fetch_leetcode_free_problems, fetch_leetcode_problem_content
from codechef_scraper import init_driver, fetch_codechef_problems, fetch_codechef_problem_content


def main():
    parser = argparse.ArgumentParser(description="Scrape coding problems from LeetCode and CodeChef")
    parser.add_argument("--target", type=int, default=2000, help="Total number of problems to scrape")
    parser.add_argument("--leetcode-ratio", type=float, default=0.6, help="Ratio of LeetCode problems (0-1)")
    args = parser.parse_args()

    target_total = args.target
    leetcode_ratio = args.leetcode_ratio
    leetcode_target = int(target_total * leetcode_ratio)
    codechef_target = target_total - leetcode_target

    ensure_dirs()
    checkpoint = load_checkpoint()

    start_time = time.time()
    leetcode_count = 0
    codechef_count = 0
    failed_urls = checkpoint.get("failed_urls", [])
    problem_urls_path = os.path.join(OUTPUT_DIR, "problemurls.txt")
    problem_titles_path = os.path.join(OUTPUT_DIR, "problemtitles.txt")

    driver = None
    try:
        leetcode_problems = []
        if leetcode_target > 0:
            print(f"Fetching LeetCode free problem list (target: {leetcode_target})...")
            leetcode_problems = fetch_leetcode_free_problems(limit=leetcode_target)
            print(f"Fetched {len(leetcode_problems)} LeetCode free problems")

        codechef_problems = []
        if codechef_target > 0:
            print(f"Initializing Chrome driver for CodeChef...")
            driver = init_driver()
            print(f"Fetching CodeChef problem list (target: {codechef_target})...")
            codechef_problems = fetch_codechef_problems(driver, limit=codechef_target)
            print(f"Fetched {len(codechef_problems)} CodeChef problems")

        total_to_scrape = len(leetcode_problems) + len(codechef_problems)
        print(f"Total problems to scrape: {total_to_scrape}")

        start_index = checkpoint.get("total_scraped", 0)
        current_index = start_index

        # Process LeetCode
        for i, problem in enumerate(leetcode_problems):
            if i < checkpoint.get("last_leetcode_index", 0):
                continue
            if current_index >= target_total:
                break
            try:
                print(f"Scraping LeetCode problem {i+1}/{len(leetcode_problems)}: {problem['title']}")
                result = fetch_leetcode_problem_content(problem["slug"])
                if result:
                    content = result["content"]
                    tags = result["tags"]
                    current_index += 1
                    leetcode_count += 1
                    append_to_file(problem_urls_path, problem["url"])
                    append_to_file(problem_titles_path, problem["title"])
                    save_problem(current_index, content, tags)
                    checkpoint["last_leetcode_index"] = i + 1
                    checkpoint["total_scraped"] = current_index
                    save_checkpoint(checkpoint)
                    if current_index % 25 == 0:
                        print(f"Scraped {current_index}/{target_total} problems (LeetCode: {leetcode_count}, CodeChef: {codechef_count})")
                else:
                    failed_urls.append(problem["url"])
                    checkpoint["failed_urls"] = failed_urls
                    save_checkpoint(checkpoint)
                delay()
            except Exception as e:
                print(f"Error processing LeetCode problem {problem['url']}: {e}")
                failed_urls.append(problem["url"])
                checkpoint["failed_urls"] = failed_urls
                save_checkpoint(checkpoint)

        # Process CodeChef
        if driver and codechef_problems:
            for i, problem in enumerate(codechef_problems):
                if i < checkpoint.get("last_codechef_index", 0):
                    continue
                if current_index >= target_total:
                    break
                try:
                    print(f"Scraping CodeChef problem {i+1}/{len(codechef_problems)}: {problem['title']}")
                    content = fetch_codechef_problem_content(driver, problem["url"])
                    if content:
                        current_index += 1
                        codechef_count += 1
                        append_to_file(problem_urls_path, problem["url"])
                        append_to_file(problem_titles_path, problem["title"])
                        save_problem(current_index, content)
                        checkpoint["last_codechef_index"] = i + 1
                        checkpoint["total_scraped"] = current_index
                        save_checkpoint(checkpoint)
                        if current_index % 25 == 0:
                            print(f"Scraped {current_index}/{target_total} problems (LeetCode: {leetcode_count}, CodeChef: {codechef_count})")
                    else:
                        failed_urls.append(problem["url"])
                        checkpoint["failed_urls"] = failed_urls
                        save_checkpoint(checkpoint)
                    delay()
                except Exception as e:
                    print(f"Error processing CodeChef problem {problem['url']}: {e}")
                    failed_urls.append(problem["url"])
                    checkpoint["failed_urls"] = failed_urls
                    save_checkpoint(checkpoint)

        # Retry failed URLs once
        print("Retrying failed URLs...")
        for url in failed_urls.copy():
            if current_index >= target_total:
                break
            try:
                print(f"Retrying {url}...")
                content = None
                title = None
                if "leetcode.com" in url:
                    slug = url.split("/problems/")[1].rstrip("/")
                    title = slug.replace("-", " ").title()
                    result = fetch_leetcode_problem_content(slug)
                    content = result["content"] if result else None
                    tags = result["tags"] if result else None
                elif "codechef.com" in url and driver:
                    title = "CodeChef Problem"
                    content = fetch_codechef_problem_content(driver, url)
                    tags = None
                if content:
                    current_index += 1
                    if "leetcode.com" in url:
                        leetcode_count += 1
                    else:
                        codechef_count += 1
                    append_to_file(problem_urls_path, url)
                    append_to_file(problem_titles_path, title)
                    save_problem(current_index, content, tags)
                    failed_urls.remove(url)
                    checkpoint["total_scraped"] = current_index
                    checkpoint["failed_urls"] = failed_urls
                    save_checkpoint(checkpoint)
                    if current_index % 25 == 0:
                        print(f"Scraped {current_index}/{target_total} problems (LeetCode: {leetcode_count}, CodeChef: {codechef_count})")
                delay()
            except Exception as e:
                print(f"Error retrying {url}: {e}")

    except KeyboardInterrupt:
        print("\nScraping interrupted by user. Saving checkpoint...")
    finally:
        if driver:
            driver.quit()
        save_failed_urls(failed_urls)
        end_time = time.time()
        total_time = end_time - start_time
        print("\n" + "="*50)
        print("Scraping Summary")
        print("="*50)
        print(f"Total problems scraped: {checkpoint.get('total_scraped', 0)}")
        print(f"LeetCode: {leetcode_count}")
        print(f"CodeChef: {codechef_count}")
        print(f"Failed URLs: {len(failed_urls)}")
        print(f"Total time taken: {total_time:.2f} seconds ({total_time/60:.2f} minutes)")
        print("="*50)


if __name__ == "__main__":
    main()
