---
id: luogu-p2158
volume: lower
source_file: lower-volume
title: 洛谷 P2158 儀仗隊
chapter: 6
section: '6.13'
kind: external-oj
difficulty: 3
topics:
  - 歐拉函數
  - 互質計數
  - 線性篩
prerequisites:
  - euler-totient
statement: >-
  N*N 方陣前方有觀察者；沿同一視線只看得到最近的人，求可見學生數。
constraints:
  - 1 <= N <= 40000
input_format: >-
  一行一個 N。
output_format: >-
  輸出可見學生數。
samples:
  - input: |
      4
    output: |
      9
    explanation: >-
      把觀察者平移到原點後，可見方向對應互質座標；N=4 時共有 9 個，為官方樣例。
hints:
  - >-
    座標 (x,y) 可見當且僅當 gcd(x,y)=1。
  - >-
    按 x 分組，1<=y<x 且互質的數量是 phi(x)，上下對稱。
  - >-
    N=1 要特判；其餘答案為 3+2*sum_{i=2}^{N-1}phi(i)。
core_knowledge:
  - 歐拉函數
  - 可見格點
judgment: >-
  視線遮擋等價於座標是否互質，故是 phi 前綴和而非幾何模擬。
solution_outline: >-
  線性篩求 1..N-1 的 phi，累加後套公式；N=1 輸出 0。
proof_or_invariant: >-
  若 gcd(x,y)>1，線段上有更近的整點遮擋；若 gcd=1，線段內無整點。斜線兩側對稱，每個 i 貢獻 2phi(i)，另加兩軸與主對角線三個最近點。
common_errors:
  - 忘記 N=1 特判
  - phi 累加到 N 而非 N-1
  - 漏加座標軸與對角線三點
complexity:
  time: O(N)
  space: O(N)
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：依照三個提示完成演算法；先保留可編譯的輸入輸出骨架。
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int n; cin >> n;
      if (n == 1) { cout << "0\n"; return 0; }
      vector<int> phi(static_cast<size_t>(n), 0), primes;
      vector<char> composite(static_cast<size_t>(n), false);
      phi[1] = 1;
      for (int i = 2; i < n; ++i) {
          if (!composite[static_cast<size_t>(i)]) { primes.push_back(i); phi[static_cast<size_t>(i)] = i - 1; }
          for (int p : primes) {
              if (p > (n - 1) / i) break;
              const int next = i * p; composite[static_cast<size_t>(next)] = true;
              if (i % p == 0) { phi[static_cast<size_t>(next)] = phi[static_cast<size_t>(i)] * p; break; }
              phi[static_cast<size_t>(next)] = phi[static_cast<size_t>(i)] * (p - 1);
          }
      }
      long long answer = 3;
      for (int i = 2; i < n; ++i) answer += 2LL * phi[static_cast<size_t>(i)];
      cout << answer << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P2158
external_platform: 洛谷
external_problem_id: 'P2158'
external_title: '[SDOI2008] 儀仗隊'
external_relation: original
original_label: '洛谷 P2158'
source_book_pages: [437, 442]
source_pdf_pages: [67, 72]
review_status: verified
---

歐拉函數在格點可見性中的經典應用。

原始題單中本題位於第 6.13 節、例題 第 1 題；競賽來源記為「SDOI2008」。可用小範圍直接枚舉作為對拍程式，逐一比較最佳化版本。
