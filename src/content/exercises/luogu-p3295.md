---
id: luogu-p3295
volume: upper
source_file: upper-volume
title: 洛谷 P3295 萌萌噠：倍增並查集
chapter: 2
section: '2.5'
kind: external-oj
difficulty: 5
topics: ['並查集', '倍增法', '區間相等']
prerequisites: ['disjoint-set', 'sparse-table']
statement: |-
  一個 n 位十進位大數記為 S_1...S_n，S_1 不能是 0。給定 m 個限制；每個限制指定兩個等長區間，要求兩段數字逐位完全相同。求滿足所有限制的 n 位大數數量，答案對 1000000007 取模。
constraints:
  - '1 <= n, m <= 100000'
  - '所有端點介於 1 與 n，且每對區間長度相同'
input_format: '第一行輸入 n、m；接著 m 行輸入 l1、r1、l2、r2。'
output_format: '輸出合法大數數量模 1000000007。'
samples:
  - input: |
      4 2
      1 2 3 4
      3 3 3 3
    output: |
      90
    explanation: '第一個限制令第 1、3 位相等且第 2、4 位相等；第二個限制不增加條件，共兩個獨立位置類別，因此有 9×10=90 種。'
core_knowledge:
  - '把長度 2^k、起點 i 的區間視為一個並查集節點。'
  - '高層區間相等可向下傳成兩對半區間相等。'
judgment: '逐位合併最壞達 O(nm)；等長區間關係可用二進位分塊與倍增並查集壓縮。'
hints:
  - '一個限制可依長度的二進位展開，拆成 O(log n) 對同長二次冪區間。'
  - '先在各倍增層合併；再由大到小，把每個區間與其代表區間的左右兩半分別合併。'
  - '最底層連通分量數為 c；含第 1 位的類別有 9 種，其餘各有 10 種，答案是 9×10^(c-1)。'
solution_outline: |-
  為每層 k、每個起點建立 DSU 節點。把每項限制二進位分割並合併同層節點。由最高層往下，將每個有效區間與其 DSU 代表的兩個半區間合併。最後數第 0 層的連通分量。
proof_or_invariant: |-
  每個輸入限制拆出的片段恰好無重疊覆蓋原區間，故同層合併等價於逐位相等。若兩個長 2^k 區間相等，左右半段必分別相等；自頂向下傳遞後，第 0 層恰保存所有且僅有由限制推出的位置相等關係。每個分量可獨立選數字，只有含最高位的分量不可選 0。
common_errors:
  - '只合併高層而沒有向第 0 層下傳。'
  - '把最高位限制誤套到每個分量。'
  - '區間二進位分割後忘記同步推進兩個左端點。'
complexity:
  time: 'O((n+m) log n · α(n log n))'
  space: 'O(n log n)'
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main() {
      // TODO：建立倍增層 DSU、加入限制、向下傳遞，最後計算分量數。
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  class Dsu {
   public:
      explicit Dsu(int size) : parent_(static_cast<size_t>(size)), rank_(static_cast<size_t>(size), 0) {
          iota(parent_.begin(), parent_.end(), 0);
      }
      int find(int node) {
          if (parent_[static_cast<size_t>(node)] != node) {
              parent_[static_cast<size_t>(node)] = find(parent_[static_cast<size_t>(node)]);
          }
          return parent_[static_cast<size_t>(node)];
      }
      void unite(int first, int second) {
          first = find(first);
          second = find(second);
          if (first == second) { return; }
          if (rank_[static_cast<size_t>(first)] < rank_[static_cast<size_t>(second)]) {
              swap(first, second);
          }
          parent_[static_cast<size_t>(second)] = first;
          if (rank_[static_cast<size_t>(first)] == rank_[static_cast<size_t>(second)]) {
              ++rank_[static_cast<size_t>(first)];
          }
      }
   private:
      vector<int> parent_;
      vector<int> rank_;
  };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, m;
      if (!(cin >> n >> m)) { return 0; }
      int levels = 1;
      while ((1 << levels) <= n) { ++levels; }
      const auto id = [n](int level, int start) { return level * n + start; };
      Dsu dsu(levels * n);
      for (int constraint = 0; constraint < m; ++constraint) {
          int l1, r1, l2, r2;
          cin >> l1 >> r1 >> l2 >> r2;
          --l1;
          --l2;
          int length = r1 - l1;
          for (int level = levels - 1; level >= 0; --level) {
              const int span = 1 << level;
              if (span <= length) {
                  dsu.unite(id(level, l1), id(level, l2));
                  l1 += span;
                  l2 += span;
                  length -= span;
              }
          }
      }
      for (int level = levels - 1; level > 0; --level) {
          const int span = 1 << level;
          const int half = span >> 1;
          for (int start = 0; start + span <= n; ++start) {
              const int representative = dsu.find(id(level, start)) - level * n;
              dsu.unite(id(level - 1, start), id(level - 1, representative));
              dsu.unite(id(level - 1, start + half),
                        id(level - 1, representative + half));
          }
      }
      int components = 0;
      for (int position = 0; position < n; ++position) {
          if (dsu.find(id(0, position)) == id(0, position)) { ++components; }
      }
      constexpr long long modulus = 1000000007LL;
      long long answer = 9;
      for (int component = 1; component < components; ++component) {
          answer = answer * 10 % modulus;
      }
      cout << answer << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P3295
external_platform: 洛谷
external_problem_id: P3295
external_title: '[SCOI2016] 萌萌噠'
external_relation: original
source_book_pages: [33, 95]
source_pdf_pages: [51, 113]
review_status: verified
---

倍增並查集把長區間的逐位相等限制壓縮到對數級操作。
