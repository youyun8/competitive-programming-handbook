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
  本卡片的題意為本站依題目主題重新敘述；完整原文敘述與資料範圍請以外部題目頁面為準。
constraints:
  - 'n 可達 10^6 等級，必須是 O(n)'
  - '窗口大小 k 不超過 n'
  - '完整限制條件請參閱外部題目頁面'
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
      第一個窗口是 [1, 3, -1]，最小 -1、最大 3；窗口右移後依序得到後面的結果。 本站自製測資（本次工作環境的網路政策封鎖了所有 OJ 網域，無法取得官方範例）。解法本身已與獨立撰寫的暴力參考解在數千組隨機測資上對拍一致。
hints:
  - |-
    每個窗口重新掃一遍是 O(nk)。關鍵觀察與單調棧相同：若 i < j 且 a[i] >= a[j]（求最小值時），那麼只要 j 還在窗口內，a[i] 就永遠不可能是答案，可以直接丟掉。
  - |-
    用雙端佇列存**索引**而不是值，因為要判斷元素是否已經滑出窗口，必須知道它的位置。
  - |-
    每一步做三件事，順序不能亂：先從隊首丟掉所有已離開窗口的索引（`front() <= i - k`）；再從隊尾丟掉所有不可能成為答案的索引；最後把 i 推入隊尾。此時隊首就是答案。
  - |-
    求最小值時隊列內的值遞增，求最大值時遞減——把比較符號抽成參數就能一份程式碼跑兩次，不必複製貼上。
  - |-
    答案要從 i >= k - 1 才開始輸出，因為在那之前窗口還沒填滿。
solution_outline: |-
  用 `deque<int>` 存索引。掃描時先彈掉隊首過期索引，再彈掉隊尾「比新元素差」的索引，然後推入當前索引；當 i >= k-1 時隊首即為該窗口答案。求最小與求最大隻差一個比較方向，抽成布林參數跑兩趟即可。
proof_or_invariant: |-
  不變量是「佇列中的索引遞增，且對應值單調」。因為隊首永遠是窗口內的最優值，而任何被彈出的元素都被一個更晚出現且更優的元素支配，所以不會遺漏答案。每個索引進出各一次，總時間 O(n)。
complexity:
  time: 'O(n)'
  space: 'O(n)'
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
