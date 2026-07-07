import requests
from utils import strip_html_tags, delay
from config import LEETCODE_GRAPHQL_URL


def fetch_leetcode_free_problems(limit=2000):
    all_problems = []
    skip = 0
    has_more = True

    while has_more and len(all_problems) < limit:
        query = """
        query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
            problemsetQuestionList: questionList(
                categorySlug: $categorySlug
                limit: $limit
                skip: $skip
                filters: $filters
            ) {
                total: totalNum
                questions: data {
                    questionFrontendId
                    title
                    titleSlug
                    isPaidOnly
                    difficulty
                }
            }
        }
        """
        variables = {
            "categorySlug": "",
            "limit": 100,
            "skip": skip,
            "filters": {}
        }
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
            question_list = data["data"]["problemsetQuestionList"]
            total = question_list["total"]
            questions = question_list["questions"]

            if not questions:
                has_more = False
                break

            for q in questions:
                if not q["isPaidOnly"]:
                    all_problems.append({
                        "id": q["questionFrontendId"],
                        "title": q["title"],
                        "slug": q["titleSlug"],
                        "url": f"https://leetcode.com/problems/{q['titleSlug']}/"
                    })
                    if len(all_problems) >= limit:
                        break

            skip += 100
            has_more = skip < total
            delay()
        except Exception as e:
            print(f"Error fetching LeetCode problem list: {e}")
            break

    return all_problems


def fetch_leetcode_problem_content(slug):
    query = """
    query questionContent($titleSlug: String!) {
        question(titleSlug: $titleSlug) {
            content
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
        content = data["data"]["question"]["content"]
        return strip_html_tags(content) if content else ""
    except Exception as e:
        print(f"Error fetching LeetCode problem content for {slug}: {e}")
        return None
