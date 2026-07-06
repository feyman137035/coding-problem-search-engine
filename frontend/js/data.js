/**
 * Mock dataset of coding problems
 * This will be replaced with real backend API in Phase 2
 */

const problems = [
    {
        id: 1,
        title: "Two Sum",
        platform: "LeetCode",
        difficulty: "Easy",
        tags: ["Array", "Hash Table"],
        url: "https://leetcode.com/problems/two-sum/",
        description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution.",
        constraints: "2 <= nums.length <= 10^4, -10^9 <= nums[i] <= 10^9, -10^9 <= target <= 10^9",
        examples: [
            { input: "nums = [2,7,11,15], target = 9", output: "[0,1]" },
            { input: "nums = [3,2,4], target = 6", output: "[1,2]" }
        ]
    },
    {
        id: 2,
        title: "Add Two Numbers",
        platform: "LeetCode",
        difficulty: "Medium",
        tags: ["Linked List", "Math"],
        url: "https://leetcode.com/problems/add-two-numbers/",
        description: "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.",
        constraints: "The number of nodes in each linked list is in the range [1, 100]. 0 <= Node.val <= 9",
        examples: [
            { input: "l1 = [2,4,3], l2 = [5,6,4]", output: "[7,0,8]" },
            { input: "l1 = [0], l2 = [0]", output: "[0]" }
        ]
    },
    {
        id: 3,
        title: "Longest Substring Without Repeating Characters",
        platform: "LeetCode",
        difficulty: "Medium",
        tags: ["String", "Sliding Window"],
        url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
        description: "Given a string s, find the length of the longest substring without repeating characters.",
        constraints: "0 <= s.length <= 5 * 10^4, s consists of English letters, digits, symbols and spaces",
        examples: [
            { input: "s = \"abcabcbb\"", output: "3" },
            { input: "s = \"bbbbb\"", output: "1" }
        ]
    },
    {
        id: 4,
        title: "Median of Two Sorted Arrays",
        platform: "LeetCode",
        difficulty: "Hard",
        tags: ["Array", "Binary Search", "Divide and Conquer"],
        url: "https://leetcode.com/problems/median-of-two-sorted-arrays/",
        description: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).",
        constraints: "nums1.length == m, nums2.length == n, 0 <= m <= 1000, 0 <= n <= 1000",
        examples: [
            { input: "nums1 = [1,3], nums2 = [2]", output: "2.00000" },
            { input: "nums1 = [1,2], nums2 = [3,4]", output: "2.50000" }
        ]
    },
    {
        id: 5,
        title: "Longest Palindromic Substring",
        platform: "LeetCode",
        difficulty: "Medium",
        tags: ["String", "Dynamic Programming"],
        url: "https://leetcode.com/problems/longest-palindromic-substring/",
        description: "Given a string s, return the longest palindromic substring in s.",
        constraints: "1 <= s.length <= 1000, s consists of only digits and English letters",
        examples: [
            { input: "s = \"babad\"", output: "\"bab\" or \"aba\"" },
            { input: "s = \"cbbd\"", output: "\"bb\"" }
        ]
    },
    {
        id: 6,
        title: "Container With Most Water",
        platform: "LeetCode",
        difficulty: "Medium",
        tags: ["Array", "Two Pointers"],
        url: "https://leetcode.com/problems/container-with-most-water/",
        description: "You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]). Find two lines that together with the x-axis form a container, such that the container contains the most water.",
        constraints: "n == height.length, 2 <= n <= 10^5, 0 <= height[i] <= 10^4",
        examples: [
            { input: "height = [1,8,6,2,5,4,8,3,7]", output: "49" },
            { input: "height = [1,1]", output: "1" }
        ]
    },
    {
        id: 7,
        title: "3Sum",
        platform: "LeetCode",
        difficulty: "Medium",
        tags: ["Array", "Two Pointers"],
        url: "https://leetcode.com/problems/3sum/",
        description: "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.",
        constraints: "3 <= nums.length <= 3000, -10^5 <= nums[i] <= 10^5",
        examples: [
            { input: "nums = [-1,0,1,2,-1,-4]", output: "[[-1,-1,2],[-1,0,1]]" },
            { input: "nums = [0,1,1]", output: "[]" }
        ]
    },
    {
        id: 8,
        title: "Merge K Sorted Lists",
        platform: "LeetCode",
        difficulty: "Hard",
        tags: ["Linked List", "Heap", "Divide and Conquer"],
        url: "https://leetcode.com/problems/merge-k-sorted-lists/",
        description: "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
        constraints: "k == lists.length, 0 <= k <= 10^4, 0 <= lists[i].length <= 500",
        examples: [
            { input: "lists = [[1,4,5],[1,3,4],[2,6]]", output: "[1,1,2,3,4,4,5,6]" },
            { input: "lists = []", output: "[]" }
        ]
    },
    {
        id: 9,
        title: "Subsets",
        platform: "LeetCode",
        difficulty: "Medium",
        tags: ["Array", "Backtracking", "Bit Manipulation"],
        url: "https://leetcode.com/problems/subsets/",
        description: "Given an integer array nums of unique elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets.",
        constraints: "1 <= nums.length <= 10, -10 <= nums[i] <= 10, All elements are unique",
        examples: [
            { input: "nums = [1,2,3]", output: "[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]" },
            { input: "nums = [0]", output: "[[],[0]]" }
        ]
    },
    {
        id: 10,
        title: "Word Search",
        platform: "LeetCode",
        difficulty: "Medium",
        tags: ["Array", "Backtracking", "Matrix"],
        url: "https://leetcode.com/problems/word-search/",
        description: "Given an m x n grid of characters board and a string word, return true if word exists in the grid. The word can be constructed from letters of sequentially adjacent cells.",
        constraints: "m == board.length, n == board[i].length, 1 <= m, n <= 6",
        examples: [
            { input: "board = [[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], word = \"ABCCED\"", output: "true" },
            { input: "board = [[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], word = \"ABCB\"", output: "false" }
        ]
    },
    {
        id: 11,
        title: "Validate Binary Search Tree",
        platform: "LeetCode",
        difficulty: "Medium",
        tags: ["Tree", "Depth-First Search", "Binary Search Tree"],
        url: "https://leetcode.com/problems/validate-binary-search-tree/",
        description: "Given the root of a binary tree, determine if it is a valid binary search tree (BST). A valid BST is defined as: The left subtree of a node contains only nodes with keys less than the node's key.",
        constraints: "The number of nodes in the tree is in the range [1, 10^4]. -2^31 <= Node.val <= 2^31 - 1",
        examples: [
            { input: "root = [2,1,3]", output: "true" },
            { input: "root = [5,1,4,null,null,3,6]", output: "false" }
        ]
    },
    {
        id: 12,
        title: "Binary Tree Level Order Traversal",
        platform: "LeetCode",
        difficulty: "Medium",
        tags: ["Tree", "Breadth-First Search", "Binary Tree"],
        url: "https://leetcode.com/problems/binary-tree-level-order-traversal/",
        description: "Given the root of a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level).",
        constraints: "The number of nodes in the tree is in the range [0, 2000]. -1000 <= Node.val <= 1000",
        examples: [
            { input: "root = [3,9,20,null,null,15,7]", output: "[[3],[9,20],[15,7]]" },
            { input: "root = [1]", output: "[[1]]" }
        ]
    },
    {
        id: 13,
        title: "Maximum Depth of Binary Tree",
        platform: "LeetCode",
        difficulty: "Easy",
        tags: ["Tree", "Depth-First Search", "Binary Tree"],
        url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
        description: "Given the root of a binary tree, return its maximum depth. A binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.",
        constraints: "The number of nodes in the tree is in the range [0, 10^4]. -100 <= Node.val <= 100",
        examples: [
            { input: "root = [3,9,20,null,null,15,7]", output: "3" },
            { input: "root = [1,null,2]", output: "2" }
        ]
    },
    {
        id: 14,
        title: "Coin Change",
        platform: "LeetCode",
        difficulty: "Medium",
        tags: ["Array", "Dynamic Programming", "Breadth-First Search"],
        url: "https://leetcode.com/problems/coin-change/",
        description: "You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money. Return the fewest number of coins that you need to make up that amount.",
        constraints: "1 <= coins.length <= 12, 1 <= coins[i] <= 2^31 - 1, 0 <= amount <= 10^4",
        examples: [
            { input: "coins = [1,2,5], amount = 11", output: "3" },
            { input: "coins = [2], amount = 3", output: "-1" }
        ]
    },
    {
        id: 15,
        title: "House Robber",
        platform: "LeetCode",
        difficulty: "Medium",
        tags: ["Array", "Dynamic Programming"],
        url: "https://leetcode.com/problems/house-robber/",
        description: "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected.",
        constraints: "1 <= nums.length <= 100, 0 <= nums[i] <= 400",
        examples: [
            { input: "nums = [1,2,3,1]", output: "4" },
            { input: "nums = [2,7,9,3,1]", output: "12" }
        ]
    },
    {
        id: 16,
        title: "Climbing Stairs",
        platform: "LeetCode",
        difficulty: "Easy",
        tags: ["Dynamic Programming", "Math", "Memoization"],
        url: "https://leetcode.com/problems/climbing-stairs/",
        description: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
        constraints: "1 <= n <= 45",
        examples: [
            { input: "n = 2", output: "2" },
            { input: "n = 3", output: "3" }
        ]
    },
    {
        id: 17,
        title: "Best Time to Buy and Sell Stock",
        platform: "LeetCode",
        difficulty: "Easy",
        tags: ["Array", "Dynamic Programming"],
        url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
        description: "You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.",
        constraints: "1 <= prices.length <= 10^5, 0 <= prices[i] <= 10^4",
        examples: [
            { input: "prices = [7,1,5,3,6,4]", output: "5" },
            { input: "prices = [7,6,4,3,1]", output: "0" }
        ]
    },
    {
        id: 18,
        title: "Maximum Subarray",
        platform: "LeetCode",
        difficulty: "Medium",
        tags: ["Array", "Divide and Conquer", "Dynamic Programming"],
        url: "https://leetcode.com/problems/maximum-subarray/",
        description: "Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.",
        constraints: "1 <= nums.length <= 10^5, -10^4 <= nums[i] <= 10^4",
        examples: [
            { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6" },
            { input: "nums = [1]", output: "1" }
        ]
    },
    {
        id: 19,
        title: "Merge Intervals",
        platform: "LeetCode",
        difficulty: "Medium",
        tags: ["Array", "Sorting"],
        url: "https://leetcode.com/problems/merge-intervals/",
        description: "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
        constraints: "1 <= intervals.length <= 10^4, intervals[i].length == 2, 0 <= starti <= endi <= 10^4",
        examples: [
            { input: "intervals = [[1,3],[2,6],[8,10],[15,18]]", output: "[[1,6],[8,10],[15,18]]" },
            { input: "intervals = [[1,4],[4,5]]", output: "[[1,5]]" }
        ]
    },
    {
        id: 20,
        title: "Unique Paths",
        platform: "LeetCode",
        difficulty: "Medium",
        tags: ["Dynamic Programming", "Math", "Combinatorics"],
        url: "https://leetcode.com/problems/unique-paths/",
        description: "There is a robot on an m x n grid. The robot is initially located at the top-left corner. The robot tries to move to the bottom-right corner. The robot can only move either down or right at any point in time.",
        constraints: "1 <= m, n <= 100, It's guaranteed that the answer will be less than or equal to 2 * 10^9",
        examples: [
            { input: "m = 3, n = 7", output: "28" },
            { input: "m = 3, n = 2", output: "3" }
        ]
    },
    {
        id: 21,
        title: "Rotate Image",
        platform: "LeetCode",
        difficulty: "Medium",
        tags: ["Array", "Math", "Matrix"],
        url: "https://leetcode.com/problems/rotate-image/",
        description: "You are given an n x n 2D matrix representing an image, rotate the image by 90 degrees (clockwise). You have to rotate the image in-place, which means you have to modify the input 2D matrix directly.",
        constraints: "matrix.length == n, 1 <= n <= 20, -1000 <= matrix[i][j] <= 1000",
        examples: [
            { input: "matrix = [[1,2,3],[4,5,6],[7,8,9]]", output: "[[7,4,1],[8,5,2],[9,6,3]]" },
            { input: "matrix = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]", output: "[[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]" }
        ]
    },
    {
        id: 22,
        title: "Search in Rotated Sorted Array",
        platform: "LeetCode",
        difficulty: "Medium",
        tags: ["Array", "Binary Search"],
        url: "https://leetcode.com/problems/search-in-rotated-sorted-array/",
        description: "There is an integer array nums sorted in ascending order (with distinct values). Prior to being passed to your function, nums is possibly rotated at an unknown pivot index k. Given the array nums after the possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums.",
        constraints: "1 <= nums.length <= 5000, -10^4 <= nums[i] <= 10^4, All values of nums are unique",
        examples: [
            { input: "nums = [4,5,6,7,0,1,2], target = 0", output: "4" },
            { input: "nums = [4,5,6,7,0,1,2], target = 3", output: "-1" }
        ]
    },
    {
        id: 23,
        title: "Combination Sum",
        platform: "LeetCode",
        difficulty: "Medium",
        tags: ["Array", "Backtracking"],
        url: "https://leetcode.com/problems/combination-sum/",
        description: "Given an array of distinct integers candidates and a target integer target, return a list of all unique combinations of candidates where the chosen numbers sum to target. You may return the combinations in any order.",
        constraints: "1 <= candidates.length <= 30, 1 <= candidates[i] <= 200, All elements are unique",
        examples: [
            { input: "candidates = [2,3,6,7], target = 7", output: "[[2,2,3],[7]]" },
            { input: "candidates = [2,3,5], target = 8", output: "[[2,2,2,2],[2,3,3],[3,5]]" }
        ]
    },
    {
        id: 24,
        title: "Permutations",
        platform: "LeetCode",
        difficulty: "Medium",
        tags: ["Array", "Backtracking"],
        url: "https://leetcode.com/problems/permutations/",
        description: "Given an array nums of distinct integers, return all the possible permutations. You can return the answer in any order.",
        constraints: "1 <= nums.length <= 6, -10 <= nums[i] <= 10, All elements are unique",
        examples: [
            { input: "nums = [1,2,3]", output: "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]" },
            { input: "nums = [0,1]", output: "[[0,1],[1,0]]" }
        ]
    },
    {
        id: 25,
        title: "Word Ladder",
        platform: "LeetCode",
        difficulty: "Hard",
        tags: ["String", "Breadth-First Search", "Graph"],
        url: "https://leetcode.com/problems/word-ladder/",
        description: "A transformation sequence from word beginWord to word endWord using a dictionary wordList is a sequence of words beginWord -> s1 -> s2 -> ... -> sk such that every adjacent pair differs by a single letter. Given two words, beginWord and endWord, and a dictionary wordList, return the number of words in the shortest transformation sequence from beginWord to endWord, or 0 if no such sequence exists.",
        constraints: "1 <= beginWord.length <= 10, endWord.length == beginWord.length, 1 <= wordList.length <= 5000",
        examples: [
            { input: "beginWord = \"hit\", endWord = \"cog\", wordList = [\"hot\",\"dot\",\"dog\",\"lot\",\"log\",\"cog\"]", output: "5" },
            { input: "beginWord = \"hit\", endWord = \"cog\", wordList = [\"hot\",\"dot\",\"dog\",\"lot\",\"log\"]", output: "0" }
        ]
    },
    {
        id: 26,
        title: "Gas Station",
        platform: "LeetCode",
        difficulty: "Medium",
        tags: ["Array", "Greedy"],
        url: "https://leetcode.com/problems/gas-station/",
        description: "There are n gas stations along a circular route. Given the integer array gas and integer array cost, return the starting gas station's index if you can travel around the circuit once in the clockwise direction, otherwise return -1.",
        constraints: "gas.length == n, cost.length == n, 1 <= n <= 10^5, 0 <= gas[i], cost[i] <= 10^4",
        examples: [
            { input: "gas = [1,2,3,4,5], cost = [3,4,5,1,2]", output: "3" },
            { input: "gas = [2,3,4], cost = [3,4,3]", output: "-1" }
        ]
    },
    {
        id: 27,
        title: "Candy",
        platform: "LeetCode",
        difficulty: "Hard",
        tags: ["Array", "Greedy"],
        url: "https://leetcode.com/problems/candy/",
        description: "There are n children standing in a line. Each child is assigned a rating value given in the integer array ratings. You are giving candies to these children subjected to the following requirements: Each child must have at least one candy. Children with a higher rating get more candies than their neighbors.",
        constraints: "n == ratings.length, 1 <= n <= 2 * 10^4, 0 <= ratings[i] <= 2 * 10^4",
        examples: [
            { input: "ratings = [1,0,2]", output: "5" },
            { input: "ratings = [1,2,2]", output: "4" }
        ]
    },
    {
        id: 28,
        title: "Trapping Rain Water",
        platform: "LeetCode",
        difficulty: "Hard",
        tags: ["Array", "Two Pointers", "Dynamic Programming", "Stack"],
        url: "https://leetcode.com/problems/trapping-rain-water/",
        description: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
        constraints: "n == height.length, 1 <= n <= 2 * 10^4, 0 <= height[i] <= 10^5",
        examples: [
            { input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]", output: "6" },
            { input: "height = [4,2,0,3,2,5]", output: "9" }
        ]
    },
    {
        id: 29,
        title: "Minimum Window Substring",
        platform: "LeetCode",
        difficulty: "Hard",
        tags: ["String", "Hash Table", "Sliding Window"],
        url: "https://leetcode.com/problems/minimum-window-substring/",
        description: "Given two strings s and t of lengths m and n respectively, return the minimum window substring of s such that every character in t (including duplicates) is included in the window. If there is no such substring, return the empty string.",
        constraints: "m == s.length, n == t.length, 1 <= m, n <= 10^5, s and t consist of English letters",
        examples: [
            { input: "s = \"ADOBECODEBANC\", t = \"ABC\"", output: "\"BANC\"" },
            { input: "s = \"a\", t = \"a\"", output: "\"a\"" }
        ]
    },
    {
        id: 30,
        title: "LRU Cache",
        platform: "LeetCode",
        difficulty: "Medium",
        tags: ["Hash Table", "Linked List", "Design"],
        url: "https://leetcode.com/problems/lru-cache/",
        description: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement the LRUCache class with get and put methods.",
        constraints: "1 <= capacity <= 3000, 0 <= key <= 10^4, 0 <= value <= 10^5, At most 2 * 10^5 calls will be made to get and put",
        examples: [
            { input: "LRUCache lRUCache = new LRUCache(2); lRUCache.put(1, 1); lRUCache.put(2, 2); lRUCache.get(1); lRUCache.put(3, 3); lRUCache.get(2); lRUCache.put(4, 4); lRUCache.get(1); lRUCache.get(3); lRUCache.get(4)", output: "[1,-1,-1,3,4]" }
        ]
    },
    {
        id: 31,
        title: "Practice Makes Perfect",
        platform: "CodeChef",
        difficulty: "Easy",
        tags: ["Math", "Basic"],
        url: "https://www.codechef.com/problems/PRACTICEPERF",
        description: "You are given a problem set containing N problems. The difficulty of the i-th problem is represented by Ai. A problem set is called good if there are at least 3 problems with difficulty >= 10 and at least 3 problems with difficulty <= 10.",
        constraints: "1 <= N <= 100, 1 <= Ai <= 100",
        examples: [
            { input: "N = 4, A = [10, 2, 7, 5]", output: "No" },
            { input: "N = 6, A = [12, 13, 14, 10, 9, 8]", output: "Yes" }
        ]
    },
    {
        id: 32,
        title: "Find the Problem Code",
        platform: "CodeChef",
        difficulty: "Easy",
        tags: ["String", "Basic"],
        url: "https://www.codechef.com/problems/PROBLEMCODE",
        description: "You are given a problem code in the format of a string. The problem code consists of uppercase letters. Your task is to determine if the given string is a valid problem code according to CodeChef's naming convention.",
        constraints: "1 <= length of string <= 10",
        examples: [
            { input: "S = \"TEST\"", output: "Valid" },
            { input: "S = \"Test\"", output: "Invalid" }
        ]
    },
    {
        id: 33,
        title: "Smallest KMP",
        platform: "CodeChef",
        difficulty: "Medium",
        tags: ["String", "Greedy"],
        url: "https://www.codechef.com/problems/SKMP",
        description: "Given a string S and a string P, find the lexicographically smallest string that contains P as a subsequence. If there are multiple such strings, output the one that is lexicographically smallest.",
        constraints: "1 <= |S|, |P| <= 10^5, S and P consist of lowercase English letters",
        examples: [
            { input: "S = \"abdc\", P = \"abc\"", output: "\"abdc\"" },
            { input: "S = \"abdc\", P = \"ac\"", output: "\"abdc\"" }
        ]
    },
    {
        id: 34,
        title: "Chef and Strings",
        platform: "CodeChef",
        difficulty: "Medium",
        tags: ["String", "Hash Table"],
        url: "https://www.codechef.com/problems/CHEFSTR1",
        description: "Given a string S of length N, you need to answer Q queries. Each query consists of two integers L and R. For each query, you need to find the number of distinct characters in the substring S[L...R].",
        constraints: "1 <= N, Q <= 10^5, S consists of lowercase English letters",
        examples: [
            { input: "S = \"abcabc\", Q = 2, queries = [[1,3],[2,5]]", output: "[3,3]" },
            { input: "S = \"aaaaa\", Q = 1, queries = [[1,5]]", output: "[1]" }
        ]
    },
    {
        id: 35,
        title: "Maximum Score",
        platform: "CodeChef",
        difficulty: "Hard",
        tags: ["Dynamic Programming", "Graph"],
        url: "https://www.codechef.com/problems/MAXSCORE",
        description: "You are given a directed acyclic graph with N nodes and M edges. Each node has a value. You need to find the maximum sum of values along any path from node 1 to node N.",
        constraints: "1 <= N <= 10^5, 0 <= M <= 2*10^5, 1 <= value of each node <= 10^9",
        examples: [
            { input: "N = 4, M = 4, edges = [(1,2),(2,3),(1,3),(3,4)], values = [1,2,3,4]", output: "10" },
            { input: "N = 3, M = 2, edges = [(1,2),(2,3)], values = [5,1,2]", output: "8" }
        ]
    },
    {
        id: 36,
        title: "Chef and Party",
        platform: "CodeChef",
        difficulty: "Medium",
        tags: ["Array", "Sorting"],
        url: "https://www.codechef.com/problems/CHEFPARTY",
        description: "Chef is organizing a party. He has invited N friends. Each friend has a certain number of candies. Chef wants to arrange them in a circle such that the sum of candies of any two adjacent friends is even.",
        constraints: "1 <= N <= 10^5, 1 <= candies[i] <= 10^9",
        examples: [
            { input: "N = 4, candies = [2, 4, 6, 8]", output: "YES" },
            { input: "N = 3, candies = [1, 2, 3]", output: "NO" }
        ]
    },
    {
        id: 37,
        title: "Binary Subsequence",
        platform: "CodeChef",
        difficulty: "Hard",
        tags: ["String", "Dynamic Programming"],
        url: "https://www.codechef.com/problems/BINSUBSEQ",
        description: "Given a binary string S of length N, find the number of subsequences that are palindromes. Since the answer can be large, output it modulo 10^9 + 7.",
        constraints: "1 <= N <= 10^5, S consists of only '0' and '1'",
        examples: [
            { input: "S = \"010\"", output: "4" },
            { input: "S = \"000\"", output: "7" }
        ]
    },
    {
        id: 38,
        title: "Two Numbers",
        platform: "Codeforces",
        difficulty: "Easy",
        tags: ["Math", "Basic"],
        url: "https://codeforces.com/problemset/problem/1647/A",
        description: "You are given two integers n and m. Find two numbers a and b such that a + b = n and a XOR b = m. If no such numbers exist, output -1.",
        constraints: "1 <= n, m <= 10^9",
        examples: [
            { input: "n = 9, m = 5", output: "2 7" },
            { input: "n = 5, m = 2", output: "-1" }
        ]
    },
    {
        id: 39,
        title: "Array Operations",
        platform: "Codeforces",
        difficulty: "Easy",
        tags: ["Array", "Greedy"],
        url: "https://codeforces.com/problemset/problem/1692/B",
        description: "You are given an array of N integers. You can perform the following operation any number of times: choose any element and replace it with its absolute value. Find the minimum possible sum of the array after performing operations.",
        constraints: "1 <= N <= 10^5, -10^9 <= arr[i] <= 10^9",
        examples: [
            { input: "arr = [1, -2, -3, 4]", output: "10" },
            { input: "arr = [-1, -2, -3]", output: "6" }
        ]
    },
    {
        id: 40,
        title: "String Game",
        platform: "Codeforces",
        difficulty: "Medium",
        tags: ["String", "Game Theory"],
        url: "https://codeforces.com/problemset/problem/1730/A",
        description: "Two players are playing a game with a string. They take turns removing characters from the string. The player who removes the last character wins. Determine the winner if both play optimally.",
        constraints: "1 <= |S| <= 10^5, S consists of lowercase English letters",
        examples: [
            { input: "S = \"abc\"", output: "First" },
            { input: "S = \"ab\"", output: "Second" }
        ]
    },
    {
        id: 41,
        title: "Tree Queries",
        platform: "Codeforces",
        difficulty: "Hard",
        tags: ["Tree", "Depth-First Search", "Binary Lifting"],
        url: "https://codeforces.com/problemset/problem/1702/E",
        description: "You are given a tree with N nodes rooted at node 1. You need to answer Q queries. Each query consists of a node u. For each query, you need to find the number of nodes in the subtree of u that have at most one child.",
        constraints: "1 <= N, Q <= 2*10^5",
        examples: [
            { input: "N = 5, edges = [(1,2),(1,3),(2,4),(2,5)], Q = 2, queries = [1,2]", output: "[3,2]" },
            { input: "N = 3, edges = [(1,2),(1,3)], Q = 1, queries = [1]", output: "[2]" }
        ]
    },
    {
        id: 42,
        title: "Divide and Conquer",
        platform: "Codeforces",
        difficulty: "Medium",
        tags: ["Array", "Divide and Conquer", "Segment Tree"],
        url: "https://codeforces.com/problemset/problem/1691/C",
        description: "You are given an array of N integers. You need to process Q queries. Each query is of two types: 1) Update a single element, 2) Find the sum of elements in a given range.",
        constraints: "1 <= N, Q <= 2*10^5, 1 <= arr[i] <= 10^9",
        examples: [
            { input: "N = 5, arr = [1,2,3,4,5], Q = 3, queries = [(2,1,3),(1,2,10),(2,1,3)]", output: "[6,14]" },
            { input: "N = 3, arr = [5,5,5], Q = 2, queries = [(2,1,3),(1,1,0)]", output: "[15]" }
        ]
    },
    {
        id: 43,
        title: "Graph Coloring",
        platform: "Codeforces",
        difficulty: "Hard",
        tags: ["Graph", "Bipartite Graph", "Breadth-First Search"],
        url: "https://codeforces.com/problemset/problem/1715/D",
        description: "You are given an undirected graph with N nodes and M edges. Determine if the graph is bipartite. If it is, output one valid 2-coloring of the graph. If not, output -1.",
        constraints: "1 <= N, M <= 2*10^5",
        examples: [
            { input: "N = 3, M = 2, edges = [(1,2),(2,3)]", output: "[1,2,1]" },
            { input: "N = 3, M = 3, edges = [(1,2),(2,3),(1,3)]", output: "-1" }
        ]
    },
    {
        id: 44,
        title: "Matrix Rotation",
        platform: "Codeforces",
        difficulty: "Medium",
        tags: ["Matrix", "Simulation"],
        url: "https://codeforces.com/problemset/problem/1703/B",
        description: "You are given an N x N matrix. You need to rotate the matrix 90 degrees clockwise K times. After each rotation, you need to find the sum of elements in the main diagonal.",
        constraints: "1 <= N <= 100, 0 <= K <= 10^9, 1 <= matrix[i][j] <= 10^9",
        examples: [
            { input: "N = 2, matrix = [[1,2],[3,4]], K = 1", output: "5" },
            { input: "N = 3, matrix = [[1,2,3],[4,5,6],[7,8,9]], K = 2", output: "15" }
        ]
    },
    {
        id: 45,
        title: "Number Theory",
        platform: "Codeforces",
        difficulty: "Hard",
        tags: ["Number Theory", "Math", "Prime Numbers"],
        url: "https://codeforces.com/problemset/problem/1744/D",
        description: "You are given an integer N. Find the maximum value of K such that N! is divisible by 2^K. Also find the maximum value of K such that N! is divisible by 5^K.",
        constraints: "1 <= N <= 10^18",
        examples: [
            { input: "N = 5", output: "3 1" },
            { input: "N = 10", output: "8 2" }
        ]
    },
    {
        id: 46,
        title: "Dynamic Programming on Trees",
        platform: "Codeforces",
        difficulty: "Hard",
        tags: ["Tree", "Dynamic Programming", "Depth-First Search"],
        url: "https://codeforces.com/problemset/problem/1728/C",
        description: "You are given a tree with N nodes. Each node has a value. You need to find the maximum sum of values you can obtain by selecting a subset of nodes such that no two selected nodes are adjacent.",
        constraints: "1 <= N <= 2*10^5, 1 <= value[i] <= 10^9",
        examples: [
            { input: "N = 4, edges = [(1,2),(2,3),(2,3)], values = [1,2,3,4]", output: "6" },
            { input: "N = 3, edges = [(1,2),(2,3)], values = [5,1,2]", output: "7" }
        ]
    },
    {
        id: 47,
        title: "Palindrome Partitioning",
        platform: "LeetCode",
        difficulty: "Medium",
        tags: ["String", "Dynamic Programming", "Backtracking"],
        url: "https://leetcode.com/problems/palindrome-partitioning/",
        description: "Given a string s, partition s such that every substring of the partition is a palindrome. Return all possible palindrome partitionings of s.",
        constraints: "1 <= s.length <= 16, s consists of only lowercase English letters",
        examples: [
            { input: "s = \"aab\"", output: "[[\"a\",\"a\",\"b\"],[\"aa\",\"b\"]]" },
            { input: "s = \"a\"", output: "[[\"a\"]]" }
        ]
    },
    {
        id: 48,
        title: "Edit Distance",
        platform: "LeetCode",
        difficulty: "Medium",
        tags: ["String", "Dynamic Programming"],
        url: "https://leetcode.com/problems/edit-distance/",
        description: "Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2. You have the following three operations: insert a character, delete a character, or replace a character.",
        constraints: "0 <= word1.length, word2.length <= 500, word1 and word2 consist of lowercase English letters",
        examples: [
            { input: "word1 = \"horse\", word2 = \"ros\"", output: "3" },
            { input: "word1 = \"intention\", word2 = \"execution\"", output: "5" }
        ]
    },
    {
        id: 49,
        title: "Sudoku Solver",
        platform: "LeetCode",
        difficulty: "Hard",
        tags: ["Array", "Backtracking", "Matrix"],
        url: "https://leetcode.com/problems/sudoku-solver/",
        description: "Write a program to solve a Sudoku puzzle by filling the empty cells. A sudoku solution must satisfy all of the following rules: Each of the digits 1-9 must occur exactly once in each row, each column, and each 3x3 sub-box.",
        constraints: "board.length == 9, board[i].length == 9, board[i][j] is a digit or '.'",
        examples: [
            { input: "board = [[\"5\",\"3\",\".\",\".\",\"7\",\".\",\".\",\".\",\".\"],[\"6\",\".\",\".\",\"1\",\"9\",\"5\",\".\",\".\",\".\"],[\".\",\"9\",\"8\",\".\",\".\",\".\",\".\",\"6\",\".\"],[\"8\",\".\",\".\",\".\",\"6\",\".\",\".\",\".\",\"3\"],[\"4\",\".\",\".\",\"8\",\".\",\"3\",\".\",\".\",\"1\"],[\"7\",\".\",\".\",\".\",\"2\",\".\",\".\",\".\",\"6\"],[\".\",\"6\",\".\",\".\",\".\",\".\",\"2\",\"8\",\".\"],[\".\",\".\",\".\",\"4\",\"1\",\"9\",\".\",\".\",\"5\"],[\".\",\".\",\".\",\".\",\"8\",\".\",\".\",\"7\",\"9\"]]", output: "Solved board" }
        ]
    },
    {
        id: 50,
        title: "N-Queens",
        platform: "LeetCode",
        difficulty: "Hard",
        tags: ["Array", "Backtracking"],
        url: "https://leetcode.com/problems/n-queens/",
        description: "The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other. Given an integer n, return all distinct solutions to the n-queens puzzle.",
        constraints: "1 <= n <= 9",
        examples: [
            { input: "n = 4", output: "[[\".Q..\",\"...Q\",\"Q...\",\"..Q.\"],[\"..Q.\",\"Q...\",\"...Q\",\".Q..\"]]" },
            { input: "n = 1", output: "[[\"Q\"]]" }
        ]
    }
];

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = problems;
}
