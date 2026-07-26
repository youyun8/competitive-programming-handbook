---
id: luogu-p2422
volume: upper
source_file: upper-volume
title: 洛谷 P2422 良好的感覺：最小值乘區間和
chapter: 1
section: '1.2'
kind: external-oj
difficulty: 3
topics: ['單調棧', '前綴和', '貢獻法']
prerequisites: ['stack', '前綴和']
statement: 給定 n 個正整數。對任一非空連續區間，定義其權值為「區間元素總和乘上區間最小值」。求所有連續區間中的最大權值。
constraints:
  - '1 <= n <= 10^5'
  - '1 <= a_i <= 10^6'
input_format: 第一行為 n；接著輸入 n 個整數，空白與換行皆視為分隔。
output_format: 輸出最大區間權值。
samples:
  - input: |
      5
      3 1 6 4 5
    output: |
      60
    explanation: 自製範例。區間 [6,4,5] 的總和為 15、最小值為 4，權值 60；其他區間皆不更大。
core_knowledge:
  - 以每個元素作為區間最小值計算貢獻
  - 單調棧尋找左右第一個更小元素
judgment: 因元素皆為正數，固定最小值後，合法區間擴得越大總和越大；所以只需找每個元素能主導的最大邊界，而非枚舉所有區間。
hints:
  - 反過來枚舉「哪個位置是最小值」；固定 a[i] 後，區間應在不出現更小值的前提下盡量向兩側延伸。
  - 用遞增單調棧找 i 左右第一個嚴格小於 a[i] 的位置；相等元素可由同一側一致地合併處理。
  - 得到最大邊界 [left+1,right-1] 後，用前綴和 O(1) 求區間和，再以 long long 計算 a[i] 乘區間和。
solution_outline: 先計算前綴和。由左至右以單調棧求每個位置左側第一個嚴格更小值，再由右至左求右側第一個嚴格更小值；對每個位置計算其最大可延伸區間的總和與權值，取最大。
proof_or_invariant: |-
  單調棧給出的兩個邊界外元素嚴格小於 a[i]，邊界內元素皆不小於 a[i]，故 a[i] 是整段最小值。因所有元素為正，任何仍可向外延伸且不改變最小值的區間，其總和只會增加，所以固定 a[i] 時最大邊界必為最佳。每個區間至少有一個最小值位置；枚舉所有 i 因而涵蓋全域最佳解。
complexity:
  time: 'O(n)'
  space: 'O(n)'
common_errors:
  - 忽略元素皆為正數這項使「最大延伸」成立的條件
  - 左右兩次對相等值使用不一致的彈棧規則
  - 權值最高可超過 32 位整數範圍
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      if (!(cin >> n)) return 0;
      vector<long long> values(n), prefix(n + 1);
      for (int i = 0; i < n; ++i) {
          cin >> values[i];
          prefix[i + 1] = prefix[i] + values[i];
      }
      vector<int> left_smaller(n), right_smaller(n);
      // TODO：以單調棧求左右第一個嚴格更小的位置。
      // TODO：用前綴和計算每個位置作為最小值時的最大權值。
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      if (!(cin >> n)) return 0;
      vector<long long> values(n), prefix(n + 1);
      for (int i = 0; i < n; ++i) {
          cin >> values[i];
          prefix[i + 1] = prefix[i] + values[i];
      }
      vector<int> left_smaller(n), right_smaller(n);
      vector<int> increasing;
      for (int i = 0; i < n; ++i) {
          while (!increasing.empty() && values[increasing.back()] >= values[i]) {
              increasing.pop_back();
          }
          left_smaller[i] = increasing.empty() ? -1 : increasing.back();
          increasing.push_back(i);
      }
      increasing.clear();
      for (int i = n - 1; i >= 0; --i) {
          while (!increasing.empty() && values[increasing.back()] >= values[i]) {
              increasing.pop_back();
          }
          right_smaller[i] = increasing.empty() ? n : increasing.back();
          increasing.push_back(i);
      }
      long long answer = 0;
      for (int i = 0; i < n; ++i) {
          const long long range_sum =
              prefix[right_smaller[i]] - prefix[left_smaller[i] + 1];
          answer = max(answer, values[i] * range_sum);
      }
      cout << answer << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P2422
external_platform: 洛谷
external_problem_id: P2422
external_title: 良好的感覺
external_relation: original
source_book_pages: [16]
source_pdf_pages: [34]
review_status: verified
---

雖列在佇列題單，本題的直接核心是單調棧：固定區間最小值，再找它可支配的最大範圍。
