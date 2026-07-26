---
id: luogu-p1976
volume: lower
source_file: lower-volume
title: 洛谷 P1976 圓周點的不交叉完美配對
chapter: 7
section: '7.6'
kind: external-oj
difficulty: 2
topics: [catalan-number, noncrossing-matching]
prerequisites: [catalan-stirling]
statement: 圓周上有 2n 個相異點，以 n 條弦使每點恰連一條且任兩弦不相交，求連線方案數模 100000007。
constraints:
  - 1 <= n <= 2999
input_format: 一個正整數 n。
output_format: 輸出不交叉完美配對數模 100000007。
samples:
  - input: '24'
    output: '4057031'
    explanation: 方案數是第 24 個 Catalan 數，取模 100000007 後為 4057031。
core_knowledge: [固定一點的配對弦會把圓切成兩個獨立子問題, Catalan 卷積]
judgment: 點的位置固定且可區分；旋轉或鏡射後不同的弦集合仍視為不同方案。
hints:
  - 固定一個圓周點，與它配對的另一點兩側都必須各含偶數個點。
  - 若兩側分別有 2j 與 2(n-1-j) 點，方案數相乘。
  - 設 dp[0]=1，使用 dp[n]=Σ dp[j]dp[n-1-j] 並逐步取模。
solution_outline: 以 Catalan 卷積從 0 預處理到 n，輸出 dp[n]。
proof_or_invariant: 固定首點的弦後，任何跨越該弦的配對都會相交，所以兩側必須獨立配對；反之兩側任意合法方案合併皆合法。枚舉 j 完整且不重複。
common_errors: [誤乘首點的選擇數, 使用錯誤模數 10007, 忘記空子問題 dp_0=1]
complexity: { time: 'O(n^2)', space: 'O(n)' }
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() { int n; cin >> n; /* TODO: Catalan 卷積。 */ (void)n; return 0; }
cpp_solution: |
  #include <iostream>
  #include <vector>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      constexpr int mod_value = 100000007;
      int n;
      cin >> n;
      vector<int> dp(static_cast<size_t>(n) + 1U);
      dp[0] = 1;
      for (int length = 1; length <= n; ++length) {
          long long value = 0;
          for (int left = 0; left < length; ++left) {
              value += static_cast<long long>(dp[static_cast<size_t>(left)]) *
                       dp[static_cast<size_t>(length - 1 - left)];
              value %= mod_value;
          }
          dp[static_cast<size_t>(length)] = static_cast<int>(value);
      }
      cout << dp[static_cast<size_t>(n)] << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P1976
external_platform: 洛谷
external_problem_id: P1976
external_title: 雞蛋餅
external_relation: original
source_book_pages: [486, 491]
source_pdf_pages: [116, 121]
review_status: verified
---

圓周不交叉配對是 Catalan 數最直觀的幾何模型之一。
