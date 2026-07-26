---
id: luogu-p1886
volume: upper
source_file: upper-volume
title: 洛谷 P1886 滑動窗口：單調佇列求區間最值
chapter: 1
section: '1.2'
kind: external-oj
difficulty: 2
topics: ['單調佇列', '雙端佇列', '滑動窗口']
prerequisites: ['queue']
statement: |-
  給定長度為 n 的序列與窗口大小 k，窗口從左端滑到右端，依序輸出每個窗口內的最小值，再輸出每個窗口內的最大值。
constraints:
  - '1 <= k <= n <= 10^6'
  - '序列元素在 32 位有號整數範圍內'
input_format: '第一行兩個整數 n 與 k；第二行 n 個整數。'
output_format: '第一行輸出各窗口的最小值，第二行輸出各窗口的最大值，同行以空格分隔。'
samples:
  - input: |
      8 3
      1 3 -1 -3 5 3 6 7
    output: |
      -1 -3 -3 -3 3 3
      3 3 5 5 6 7
    explanation: |-
      核實官方範例。第一個窗口是 [1,3,-1]，最小值 -1、最大值 3；逐格右移後得到其餘結果。
core_knowledge:
  - 遞增與遞減單調佇列
  - 以索引處理窗口過期
judgment: 每個窗口重掃需 O(nk)，在 n 達一百萬時不可行；單調佇列讓每個索引至多進出一次。
hints:
  - 每個窗口重掃太慢。想想當較晚元素不大於較早元素時，在求最小值的未來窗口中，較早元素是否還有保留價值。
  - 用雙端佇列存索引：求最小值時讓對應值遞增，求最大值時遞減；隊首便是答案，索引則可判斷是否過期。
  - 每步先移除 `front() <= i-k` 的過期索引，再從隊尾移除被 a[i] 支配者，最後推入 i；從 i>=k-1 起輸出。改變比較方向即可求另一種極值。
solution_outline: |-
  用 `deque<int>` 存索引。掃描時先彈掉隊首過期索引，再彈掉隊尾「比新元素差」的索引，然後推入當前索引；當 i >= k-1 時隊首即為該窗口答案。求最小與求最大隻差一個比較方向，抽成布林參數跑兩趟即可。
proof_or_invariant: |-
  不變量是「佇列中的索引遞增，且對應值單調」。因為隊首永遠是窗口內的最優值，而任何被彈出的元素都被一個更晚出現且更優的元素支配，所以不會遺漏答案。每個索引進出各一次，總時間 O(n)。
complexity:
  time: 'O(n)'
  space: 'O(k)'
common_errors:
  - 只存值而無法辨認滑出窗口的元素
  - 把過期條件寫成小於 i-k，留下恰好已離窗的索引
  - 在 i 小於 k-1、窗口尚未完整時就輸出
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  // TODO：把這個 O(nk) 的掃描換成單調佇列。
  //   佇列存索引，對應的值單調（求最小值時遞增）。每步先從隊首丟掉離開窗口的索引，
  //   再從隊尾丟掉「不可能再成為答案」的索引，最後推入 i；隊首就是答案。
  static void sweep(const vector<int>& a, int k, bool want_min, vector<int>& out) {
      const int n = static_cast<int>(a.size());
      out.clear();
      for (int i = k - 1; i < n; ++i) {
          int best = a[static_cast<size_t>(i)];
          for (int j = i - k + 1; j <= i; ++j) {
              const int value = a[static_cast<size_t>(j)];
              best = want_min ? min(best, value) : max(best, value);
          }
          out.push_back(best);
      }
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, k;
      if (!(cin >> n >> k)) { return 0; }
      vector<int> a(static_cast<size_t>(n));
      for (int& value : a) { cin >> value; }
      vector<int> result;
      sweep(a, k, true, result);
      for (size_t i = 0; i < result.size(); ++i) { cout << result[i] << " \n"[i + 1 == result.size()]; }
      sweep(a, k, false, result);
      for (size_t i = 0; i < result.size(); ++i) { cout << result[i] << " \n"[i + 1 == result.size()]; }
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  // 單調佇列：佇列存索引，值單調。求最小值時保持遞增，隊首即為窗口最小。
  static void sweep(const vector<int>& a, int k, bool want_min, vector<int>& out) {
      const int n = static_cast<int>(a.size());
      deque<int> window;
      out.clear();
      for (int i = 0; i < n; ++i) {
          while (!window.empty() && window.front() <= i - k) { window.pop_front(); }
          while (!window.empty() &&
                 (want_min ? a[static_cast<size_t>(window.back())] >= a[static_cast<size_t>(i)]
                           : a[static_cast<size_t>(window.back())] <= a[static_cast<size_t>(i)])) {
              window.pop_back();
          }
          window.push_back(i);
          if (i >= k - 1) { out.push_back(a[static_cast<size_t>(window.front())]); }
      }
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, k;
      if (!(cin >> n >> k)) { return 0; }
      vector<int> a(static_cast<size_t>(n));
      for (int& value : a) { cin >> value; }
      vector<int> result;
      sweep(a, k, true, result);
      for (size_t i = 0; i < result.size(); ++i) { cout << result[i] << " \n"[i + 1 == result.size()]; }
      sweep(a, k, false, result);
      for (size_t i = 0; i < result.size(); ++i) { cout << result[i] << " \n"[i + 1 == result.size()]; }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P1886
external_platform: 洛谷
external_problem_id: P1886
external_title: '【模板】滑動窗口 / 單調佇列'
external_relation: original
source_book_pages: [1, 31]
source_pdf_pages: [19, 49]
review_status: verified
---

單調佇列是滑動窗口類問題的標準解，也是單調佇列優化 DP 的基礎；先把這題的三步順序寫熟。
