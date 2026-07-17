---
id: kmp-pattern-match
volume: lower
source_file: lower-volume
title: KMP 模式匹配
chapter: 9
section: '9.5'
kind: practice
difficulty: 2
topics:
  - kmp
  - prefix-function
  - pattern-matching
prerequisites:
  - strings
statement: 給定字串 text 與 pattern，求 pattern 在 text 中所有出現位置的開始索引（1-based）。
constraints:
  - 1 <= |text|, |pattern| <= 1000000
input_format: 兩行，第一行為 text，第二行為 pattern。
output_format: 第一行為出現次數，第二行為所有開始位置（1-based），以空白分隔。
samples:
  - input: |
      ABABABCABA
      ABA
    output: |
      3
      1 3 8
    explanation: ABA 出現在位置 1、3（ABAB...）、8。
hints:
  - 先計算 pattern 的 prefix function，再用 prefix function 值加速匹配。
  - 匹配過程中利用已匹配的 prefix 資訊避免 text 指標回退。
solution_outline: 計算 pattern 的 prefix function pi，然後以雙指標掃描 text。當不匹配時根據 pi 回退 pattern 指標。
proof_or_invariant: pi[i] 表示 pattern[0..i] 最長的真前綴也是後綴的長度。失配時 j = pi[j-1] 確保 pattern[0..j-1] 與 text 已匹配部分完全重合。
complexity:
  time: O(|text| + |pattern|)
  space: O(|pattern|)
cpp_solution: |
  #include <iostream>
  #include <string>
  #include <vector>

  std::vector<int> compute_prefix(const std::string& pattern) {
      int m = static_cast<int>(pattern.size());
      std::vector<int> pi(m, 0);
      for (int i = 1; i < m; ++i) {
          int j = pi[i - 1];
          while (j > 0 && pattern[i] != pattern[j]) { j = pi[j - 1]; }
          if (pattern[i] == pattern[j]) { ++j; }
          pi[i] = j;
      }
      return pi;
  }

  int main() {
      std::ios::sync_with_stdio(false);
      std::cin.tie(nullptr);
      std::string text, pattern;
      std::cin >> text >> pattern;
      auto pi = compute_prefix(pattern);
      int n = static_cast<int>(text.size());
      int m = static_cast<int>(pattern.size());
      std::vector<int> matches;
      int j = 0;
      for (int i = 0; i < n; ++i) {
          while (j > 0 && text[i] != pattern[j]) { j = pi[j - 1]; }
          if (text[i] == pattern[j]) { ++j; }
          if (j == m) {
              matches.push_back(i - m + 2);
              j = pi[j - 1];
          }
      }
      std::cout << matches.size() << "\n";
      for (size_t i = 0; i < matches.size(); ++i) {
          if (i) { std::cout << " "; }
          std::cout << matches[i];
      }
      if (!matches.empty()) { std::cout << "\n"; }
  }
source_book_pages:
  - 549
  - 599
source_pdf_pages:
  - 179
  - 229
review_status: verified
external_url: https://www.luogu.com.cn/problem/P3375
external_platform: 洛谷
external_problem_id: P3375
external_title: 【模板】KMP字串匹配
external_relation: related
---
