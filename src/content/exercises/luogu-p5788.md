---
id: luogu-p5788
volume: upper
source_file: upper-volume
title: 洛谷 P5788 單調棧：每個元素右邊第一個更大的數
chapter: 1
section: '1.3'
kind: external-oj
difficulty: 2
topics: ['單調棧', '堆疊', '線性掃描']
prerequisites: ['stack']
statement: |-
  給定一個長度為 n 的序列，對每個位置 i 求出最小的 j > i 使得 a[j] > a[i]；若不存在則答案為 0。
constraints:
  - '1 <= n <= 3000000'
  - '1 <= a[i] <= 1000000000'
input_format: '第一行一個整數 n；第二行 n 個整數 a[1..n]。'
output_format: '一行 n 個整數，第 i 個是位置 i 的答案，不存在時輸出 0。'
samples:
  - input: |
      5
      1 4 2 3 5
    output: |
      2 5 4 5 0
    explanation: |-
      位置 1 的值 1 首先被位置 2 的值 4 超過；位置 2 的值 4 要到位置 5 的值 5 才被超過；位置 3、4 的答案分別是 4、5，最後一項沒有答案。
core_knowledge:
  - 單調堆疊保存尚未找到答案的索引
  - 新元素可一次結算所有較小的棧頂元素
  - 每個索引至多入棧、出棧各一次的攤還分析
judgment: 對每個位置找右側第一個嚴格更大元素；從左往右掃描時，當前值正好能結算棧頂所有較小且仍待答的位置。
hints:
  - 第一階段：若某個位置還沒遇到右側更大值，只需保留它等待後續元素；已找到答案的位置則不必再看。
  - 第二階段：用棧保存所有尚未得到答案的索引。為了讓新值能由頂端逐一結算，這些索引對應的值應由底到頂不遞增。
  - 第三階段：掃到 i 時，反覆彈出所有滿足 `a[stack.back()] < a[i]` 的索引並把答案設成 i，再推入 i；最後殘留者維持答案 0。
solution_outline: |-
  用一個 `vector<int>` 當棧存索引，維持對應值由底到頂遞減。從左到右掃描：當棧非空且棧頂值小於當前值時，彈出並把當前索引記為它的答案；然後推入當前索引。掃完後棧中殘留的索引答案為 0。
proof_or_invariant: |-
  不變量是「棧中索引由底到頂遞增，對應的值不遞增，且都尚未遇到右側更大值」。掃到 i 時，被彈出的每個位置 k 在 k 與 i 之間都未曾被更大值結算，而 a[i] > a[k]，故 i 正是最小可行索引。未彈出者不小於 a[i]，不能以 i 為答案。
complexity:
  time: 'O(n)'
  space: 'O(n)'
common_errors:
  - 把「嚴格大於」寫成大於等於，導致相等元素互相結算
  - 棧中存值而不是索引，最後無法回填答案位置
  - 將內層 while 誤判為 O(n²)；每個索引實際只會被彈出一次
  - n 很大卻未使用快速輸入或配置足夠陣列空間
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      if (!(cin >> n)) { return 0; }
      vector<int> a(static_cast<size_t>(n) + 1);
      for (int i = 1; i <= n; ++i) { cin >> a[static_cast<size_t>(i)]; }
      vector<int> answer(static_cast<size_t>(n) + 1, 0);

      // TODO：把這段 O(n^2) 換成單調棧。
      //   棧裡存「還沒找到答案」的索引，且對應的值由底到頂遞減。
      //   讀到新元素 i 時，所有棧頂值小於 a[i] 的索引，答案都是 i，逐一彈出。
      //   每個索引最多進棧一次、出棧一次，總計 O(n)。
      for (int i = 1; i <= n; ++i) {
          for (int j = i + 1; j <= n; ++j) {
              if (a[static_cast<size_t>(j)] > a[static_cast<size_t>(i)]) {
                  answer[static_cast<size_t>(i)] = j;
                  break;
              }
          }
      }

      for (int i = 1; i <= n; ++i) { cout << answer[static_cast<size_t>(i)] << " \n"[i == n]; }
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  // 單調棧：棧內索引對應的值嚴格遞減，新元素把所有比它小的都彈出，
  // 被彈出者的答案就是當前索引。
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      if (!(cin >> n)) { return 0; }
      vector<int> a(static_cast<size_t>(n) + 1);
      for (int i = 1; i <= n; ++i) { cin >> a[static_cast<size_t>(i)]; }
      vector<int> answer(static_cast<size_t>(n) + 1, 0);
      vector<int> stack_indices;
      for (int i = 1; i <= n; ++i) {
          while (!stack_indices.empty() && a[static_cast<size_t>(stack_indices.back())] < a[static_cast<size_t>(i)]) {
              answer[static_cast<size_t>(stack_indices.back())] = i;
              stack_indices.pop_back();
          }
          stack_indices.push_back(i);
      }
      for (int i = 1; i <= n; ++i) { cout << answer[static_cast<size_t>(i)] << " \n"[i == n]; }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P5788
external_platform: 洛谷
external_problem_id: P5788
external_title: '【模板】單調棧'
external_relation: original
source_book_pages: [1, 31]
source_pdf_pages: [19, 49]
review_status: verified
---

單調棧是把 O(n²) 的「往右找第一個滿足條件的元素」壓成 O(n) 的標準工具，接雨水、最大矩形、直方圖都靠它。
