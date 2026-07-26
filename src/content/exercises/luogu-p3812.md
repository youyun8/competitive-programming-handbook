---
id: luogu-p3812
volume: lower
source_file: lower-volume
title: 洛谷 P3812 線性基：子集最大異或和
chapter: 6
section: '6.5'
kind: external-oj
difficulty: 3
topics:
  - 線性基
  - XOR
  - 貪心
  - 線性代數
prerequisites:
  - xor-basis
statement: |-
  給定 n 個非負整數，從中選出任意個（可以不選）做異或，求能得到的最大值。
  本卡片的題意為本站依題目主題重新敘述；完整原文敘述與資料範圍請以外部題目頁面為準。
constraints:
  - n 可達 10^5，不可能枚舉 2^n 個子集
  - 數值可達 2^50 以上，需用 unsigned long long
  - 完整限制條件請參閱外部題目頁面
input_format: 第一行一個整數 n；第二行 n 個非負整數。
output_format: 一行一個整數，表示能得到的最大異或和。
samples:
  - input: |
      4
      8 5 3 6
    output: |
      14
    explanation:
      最佳解是隻選 8 與 6：1000 xor 0110 = 1110，也就是 14。全選反而是 8，可見「選越多越好」的直覺並不成立。 本站自製測資（本次工作環境的網路政策封鎖了所有 OJ
      網域，無法取得官方範例）。解法本身已與獨立撰寫的暴力參考解在數千組隨機測資上對拍一致。
hints:
  - 把每個數看成 GF(2) 上的 64 維向量，異或就是向量加法。「某些數異或起來能得到什麼」問的正是這組向量張成的**線性空間**。線性基就是這個空間的一組基底。
  - 維護 basis[bit]＝最高位恰為 bit 的基向量。插入一個數時由高位往低位掃它的最高位：若該位的 basis 是空的就佔位並結束；否則異或掉那個基向量（最高位被消掉），繼續往更低位找。若一路被消成
    0，代表這個數能被已有的基表示，不提供新資訊。
  - 插入 n 個數、每個最多掃 64 位，所以建基是 O(64n)，與 2^n 的暴力天差地遠。
solution_outline: 用長度 64 的陣列當線性基，basis[bit] 存最高位為 bit 的基向量。逐一插入每個數：找最高位，該位空就佔位，否則異或掉再往下找。建基完成後，由高位到低位貪心，若異或 basis[bit] 能讓答案變大就異或進去。
proof_or_invariant:
  插入過程維持「basis 中非零向量的最高位兩兩不同」，因此它們線性獨立，且張成的空間與原始向量組相同（每次異或都是初等行變換，不改變張成空間）。貪心的正確性來自二進位的性質：第 b 位的權重 2^b
  大於所有低位之和，所以只要能讓第 b 位變成 1 就一定要做，且該選擇不會被後續決策推翻。
complexity:
  time: O(64n)
  space: O(64)
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      if (!(cin >> n)) { return 0; }
      vector<unsigned long long> values(static_cast<size_t>(n));
      for (unsigned long long& value : values) { cin >> value; }

      // TODO 1：建線性基。basis[bit] 存「最高位恰為 bit」的基向量。
      //   逐一插入每個數：由高位往低位找它的最高位 bit，
      //   若 basis[bit] 為空就佔位並結束；否則異或掉 basis[bit] 再繼續往下找。
      //   插入 n 個數共 O(n·64)。
      array<unsigned long long, 64> basis{};
      (void)basis;

      // TODO 2：由高位到低位貪心求最大異或和：
      //   若把 basis[bit] 異或進答案會讓答案變大，就異或進去。
      unsigned long long best = 0;

      cout << best << '\n';
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      if (!(cin >> n)) { return 0; }
      // basis[i] 是最高位恰為第 i 位的基向量；同一個最高位最多留一個。
      array<unsigned long long, 64> basis{};
      for (int i = 0; i < n; ++i) {
          unsigned long long value;
          cin >> value;
          for (int bit = 63; bit >= 0; --bit) {
              if (((value >> bit) & 1ULL) == 0) { continue; }
              if (basis[static_cast<size_t>(bit)] == 0) {
                  basis[static_cast<size_t>(bit)] = value;
                  break;
              }
              value ^= basis[static_cast<size_t>(bit)];
          }
      }
      // 由高位到低位貪心：能讓答案變大就異或進去。
      unsigned long long best = 0;
      for (int bit = 63; bit >= 0; --bit) {
          const unsigned long long candidate = best ^ basis[static_cast<size_t>(bit)];
          if (candidate > best) { best = candidate; }
      }
      cout << best << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P3812
external_platform: 洛谷
external_problem_id: P3812
external_title: 【模板】線性基
external_relation: original
source_book_pages:
  - 402
  - 406
source_pdf_pages:
  - 32
  - 36
review_status: verified
core_knowledge:
  - 異或線性基
  - 最高位消元
  - 最大子集異或和
judgment: 子集數量為 2^n，不能枚舉；異或可視為 GF(2) 向量加法，用每個最高位至多一個基向量的線性基壓縮所有可達結果。
common_errors:
  - 從低位往高位插入，破壞求最大值所需的最高位代表
  - 使用有號位移處理高位數值
  - 插入時遇到已有主元便停止，而非繼續消去
---

線性基把「異或子集」問題從指數級壓到線性，還能回答「第 k 小異或和」「某數是否可表示」等一系列問題。
