---
id: luogu-p3370
volume: lower
source_file: lower-volume
title: 洛谷 P3370 字串雜湊：統計不同字串個數
chapter: 9
section: '9.1'
kind: external-oj
difficulty: 2
topics: ['字串雜湊', '進制雜湊', '雙模數']
prerequisites: ['string-hash']
statement: |-
  給定 N 個字串，求其中互不相同的字串有多少個。
constraints:
  - '1 <= N <= 10000'
  - '每個字串長度不超過 1500'
  - '字串只含數字、大小寫英文字母，且大小寫有別'
input_format: '第一行一個整數 N；接下來 N 行，每行一個字串。'
output_format: '一行一個整數，表示不同字串的個數。'
samples:
  - input: |
      5
      abc
      aaaa
      abc
      abcc
      12345
    output: |
      4
    explanation: |-
      五個字串中 abc 出現兩次，其餘各一次，因此不同的有 abc、aaaa、abcc、12345 共 4 個。
core_knowledge:
  - 集合只保留互不相同的鍵，集合大小就是不同字串數
  - 直接以完整字串為鍵可得到確定正確的判定，不承擔雜湊碰撞風險
  - 排序後計算相鄰值的變化次數也是等價作法
judgment: 只輸出一個整數；字串比較區分大小寫，重複出現任意次仍只計一次。
hints:
  - 想一個容器，使同一個值插入多次後仍只保留一份。
  - 將每個完整字串插入集合；無須逐對比較，也不要只用可能碰撞的單一雜湊值代表字串。
  - 全部讀完後，集合中的元素恰與不同字串一一對應，因此輸出集合大小。
solution_outline: |-
  逐一讀入字串並插入 `set<string>`。集合以完整字串比較鍵值，重複字串不會新增元素；最後輸出集合大小。
proof_or_invariant: |-
  處理前 k 個輸入後，集合恰好包含這 k 個字串中每一種不同值各一份：初始空集合成立；插入第 k+1
  個字串時，若它已出現，集合不變，否則恰新增此值，所以不變量維持。全部處理後，集合元素數正是答案。
common_errors:
  - 使用單一模數雜湊後直接把雜湊值當字串，碰撞時會少算
  - 忽略大小寫有別，先把字串轉成同一種大小寫
  - 用 O(N^2) 的逐對完整比較，在長字串資料上做大量重複工作
complexity:
  time: O(L log N)，L 為所有輸入字串的總長度
  space: O(L)，集合保存不同字串
cpp_skeleton: |
  #include <iostream>
  #include <set>
  #include <string>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      if (!(cin >> n)) { return 0; }

      set<string> distinct;
      for (int i = 0; i < n; ++i) {
          string text;
          cin >> text;
          // TODO：將完整字串加入集合。
      }
      cout << distinct.size() << '\n';
      return 0;
  }
cpp_solution: |
  #include <iostream>
  #include <set>
  #include <string>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      if (!(cin >> n)) { return 0; }
      set<string> distinct;
      for (int i = 0; i < n; ++i) {
          string text;
          cin >> text;
          distinct.insert(text);
      }
      cout << distinct.size() << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P3370
external_platform: 洛谷
external_problem_id: P3370
external_title: '【模板】字串雜湊'
external_relation: original
source_book_pages: [549, 599]
source_pdf_pages: [179, 229]
review_status: verified
---

雜湊是用極小的碰撞機率換取極大的便利。記住雙模數這個習慣，能擋掉大部分針對性的卡雜湊測資。
