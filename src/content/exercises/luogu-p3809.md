---
id: luogu-p3809
volume: lower
source_file: lower-volume
title: 洛谷 P3809 後綴排序：倍增法建後綴陣列
chapter: 9
section: '9.7'
kind: external-oj
difficulty: 4
topics: ['後綴陣列', '倍增法', '計數排序', '基數排序']
prerequisites: ['suffix-array']
statement: |-
  給定一個字串，求它所有後綴按字典序排序後的起始位置序列（後綴陣列）。
constraints:
  - '字串由大小寫英文字母或數字組成'
  - '後綴按 ASCII 值的字典序比較，位置採 1-based'
input_format: '一行一個字串。'
output_format: '一行 n 個整數，表示排序後每個後綴的起始位置（1-based），以空格分隔。'
samples:
  - input: |
      ababa
    output: |
      5 3 1 4 2
    explanation: |-
      官方範例。五個後綴排序後依序是 a(5)、aba(3)、ababa(1)、ba(4)、baba(2)；另以直接排序短字串後綴交叉驗證。
core_knowledge:
  - 倍增把後綴比較化為兩個排名比較
  - 基數排序使每輪保持線性
  - 排名兩兩不同時後綴順序已確定
judgment: 輸出全部後綴按字典序排列的 1-based 起點，短後綴是長後綴前綴時短者較小。
hints:
  - 已知長度 k 子串排名後，長度 2k 的排名由 (rank[i],rank[i+k]) 決定。
  - 先依第二關鍵字排列，再對第一關鍵字做穩定計數排序，可讓每輪 O(n)。
  - 比較相鄰雙關鍵字重編排名；所有排名不同即可停止，最後把起點加一輸出。
solution_outline: |-
  第 0 輪以單字元用計數排序得到初始排名與 sa。之後每輪把長度翻倍：先依第二關鍵字排列（超出尾端者最小、其餘按上輪 sa 順序），再對第一關鍵字做穩定計數排序，最後依雙關鍵字是否相同重新編號。排名兩兩不同時提前結束。
proof_or_invariant: |-
  每輪結束時的不變量是「sa 依長度 2^k 的子串字典序排好，rank 是對應的排名且相等當且僅當該長度的子串相同」。歸納成立的關鍵是雙關鍵字表示法：長度 2^(k+1) 的子串由前後兩段長度 2^k 的子串唯一決定，故按 (rank[i], rank[i+2^k]) 排序等價於按實際子串排序。
common_errors:
  - 越界的第二排名沒有視為最小
  - 計數排序不穩定而破壞第二關鍵字順序
  - 輸出 0-based 起點
complexity:
  time: 'O(n log n)'
  space: 'O(n)'
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      string text;
      if (!(cin >> text)) { return 0; }
      const int n = static_cast<int>(text.size());
      vector<int> sa(static_cast<size_t>(n));
      for (int i = 0; i < n; ++i) { sa[static_cast<size_t>(i)] = i; }

      // 目前是直接對所有後綴做字串比較排序：比較一次就 O(n)，總共 O(n^2 log n)。
      // TODO：換成倍增法。
      //   第 k 輪已知所有長度 2^k 的子串排名 rank[]，把後綴 i 看成雙關鍵字
      //   (rank[i], rank[i + 2^k])，排序後即得長度 2^(k+1) 的排名。
      //   1. 第二關鍵字：i + 2^k 超出尾端的後綴第二關鍵字最小，排最前；
      //      其餘依上一輪的 sa 順序取出即已排好。
      //   2. 第一關鍵字：對上一步的結果做穩定的計數排序。
      //   3. 重新編號：相鄰兩個後綴的兩個關鍵字都相同才共用排名。
      //   共 O(log n) 輪、每輪 O(n)，總計 O(n log n)。
      //   排名兩兩不同時可以提早結束。
      sort(sa.begin(), sa.end(), [&](int a, int b) {
          return text.compare(static_cast<size_t>(a), string::npos, text, static_cast<size_t>(b),
                              string::npos) < 0;
      });

      string out;
      for (int i = 0; i < n; ++i) {
          out += to_string(sa[static_cast<size_t>(i)] + 1);
          out += " \n"[i + 1 == n];
      }
      cout << out;
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  // 後綴排序（倍增 + 計數排序）：第 k 輪已知所有長度 2^k 的子串排名，
  // 把 (rank[i], rank[i + 2^k]) 當成雙關鍵字再排一次，得到長度 2^(k+1) 的排名。
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      string text;
      if (!(cin >> text)) { return 0; }
      const int n = static_cast<int>(text.size());
      int alphabet = 128;

      vector<int> sa(static_cast<size_t>(n));
      vector<int> rank_of(static_cast<size_t>(n));
      vector<int> tmp(static_cast<size_t>(n));
      vector<int> count(static_cast<size_t>(max(alphabet, n)) + 1, 0);

      for (int i = 0; i < n; ++i) { rank_of[static_cast<size_t>(i)] = static_cast<unsigned char>(text[static_cast<size_t>(i)]); }
      for (int i = 0; i < n; ++i) { ++count[static_cast<size_t>(rank_of[static_cast<size_t>(i)])]; }
      for (int i = 1; i <= alphabet; ++i) { count[static_cast<size_t>(i)] += count[static_cast<size_t>(i - 1)]; }
      for (int i = n - 1; i >= 0; --i) {
          sa[static_cast<size_t>(--count[static_cast<size_t>(rank_of[static_cast<size_t>(i)])])] = i;
      }

      for (int length = 1; length < n; length <<= 1) {
          // 先依第二關鍵字排好：超出尾端的後綴第二關鍵字最小，排在最前。
          vector<int> by_second;
          by_second.reserve(static_cast<size_t>(n));
          for (int i = n - length; i < n; ++i) { by_second.push_back(i); }
          for (int i = 0; i < n; ++i) {
              if (sa[static_cast<size_t>(i)] >= length) { by_second.push_back(sa[static_cast<size_t>(i)] - length); }
          }

          // 再依第一關鍵字做穩定的計數排序。
          fill(count.begin(), count.end(), 0);
          for (int i = 0; i < n; ++i) { ++count[static_cast<size_t>(rank_of[static_cast<size_t>(i)])]; }
          for (int i = 1; i <= alphabet; ++i) { count[static_cast<size_t>(i)] += count[static_cast<size_t>(i - 1)]; }
          for (int i = n - 1; i >= 0; --i) {
              const int index = by_second[static_cast<size_t>(i)];
              sa[static_cast<size_t>(--count[static_cast<size_t>(rank_of[static_cast<size_t>(index)])])] = index;
          }

          tmp[static_cast<size_t>(sa[0])] = 0;
          int classes = 1;
          for (int i = 1; i < n; ++i) {
              const int a = sa[static_cast<size_t>(i)];
              const int b = sa[static_cast<size_t>(i - 1)];
              const int a2 = a + length < n ? rank_of[static_cast<size_t>(a + length)] : -1;
              const int b2 = b + length < n ? rank_of[static_cast<size_t>(b + length)] : -1;
              if (rank_of[static_cast<size_t>(a)] != rank_of[static_cast<size_t>(b)] || a2 != b2) { ++classes; }
              tmp[static_cast<size_t>(a)] = classes - 1;
          }
          rank_of = tmp;
          alphabet = classes;
          if (classes == n) { break; }  // 排名已兩兩不同，可以提早結束
      }

      string out;
      for (int i = 0; i < n; ++i) {
          out += to_string(sa[static_cast<size_t>(i)] + 1);
          out += " \n"[i + 1 == n];
      }
      cout << out;
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P3809
external_platform: 洛谷
external_problem_id: P3809
external_title: '【模板】後綴排序'
external_relation: original
source_book_pages: [587, 595]
source_pdf_pages: [217, 225]
review_status: verified
---

後綴陣列的實作細節多，但每一步都有明確理由。先把「雙關鍵字」與「第二關鍵字免排序」想通，程式碼就不再是天書。
