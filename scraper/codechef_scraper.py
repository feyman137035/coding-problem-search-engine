from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import time
from utils import strip_html_tags, delay
from config import CODECHEF_BASE_URL, CODECHEF_TAGS


def init_driver():
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)
    driver.implicitly_wait(10)
    return driver


def fetch_codechef_problems_from_tag(driver, tag):
    url = f"{CODECHEF_BASE_URL}/tags/problems/{tag}"
    try:
        driver.get(url)
        time.sleep(5)
        page_source = driver.page_source
        soup = BeautifulSoup(page_source, "html.parser")
        problems = []
        problem_links = soup.select("a[href*='/problems/']")
        seen_urls = set()
        for link in problem_links:
            href = link.get("href", "")
            if href.startswith("/problems/") and len(href) > len("/problems/"):
                full_url = f"{CODECHEF_BASE_URL}{href}"
                if full_url not in seen_urls:
                    seen_urls.add(full_url)
                    title = link.get_text(strip=True)
                    if title:
                        problems.append({"title": title, "url": full_url})
        return problems
    except Exception as e:
        print(f"Error fetching CodeChef problems from tag {tag}: {e}")
        return []


def fetch_codechef_problem_content(driver, url):
    try:
        driver.get(url)
        time.sleep(5)
        page_source = driver.page_source
        soup = BeautifulSoup(page_source, "html.parser")
        problem_statement = soup.select_one(".problem-statement")
        if problem_statement:
            return strip_html_tags(str(problem_statement))
        else:
            print(f"Warning: Problem statement not found for {url}")
            return None
    except Exception as e:
        print(f"Error fetching CodeChef problem content for {url}: {e}")
        return None


def fetch_codechef_problems(driver, limit=1000):
    all_problems = []
    seen_urls = set()
    for tag in CODECHEF_TAGS:
        if len(all_problems) >= limit:
            break
        print(f"Fetching CodeChef problems for tag: {tag}")
        tag_problems = fetch_codechef_problems_from_tag(driver, tag)
        for p in tag_problems:
            if p["url"] not in seen_urls:
                seen_urls.add(p["url"])
                all_problems.append(p)
                if len(all_problems) >= limit:
                    break
        delay()
    return all_problems
