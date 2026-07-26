---
id: luogu-p2000
volume: lower
source_file: lower-volume
title: 洛谷 P2000 五行石陣法計數
chapter: 7
section: '7.8'
kind: external-oj
difficulty: 5
topics: [generating-function, generalized-binomial, big-integer]
prerequisites: [generating-functions]
statement: 兩座陣法分別對五類石頭施加「數量為某數倍數」或「數量不超過某上限」的十項限制。把 n 塊石頭全部分配後，求可同時擺出的陣法組合總數。
constraints: [樣例外 10^99999 <= n < 10^100000]
input_format: 一行十進位正整數 n。
output_format: 輸出使用 n 塊石頭的陣法種數，需精確整數。
samples:
  - input: '2'
    output: '15'
    explanation: 化簡後答案為 C(n+4,4)，故 C(6,4)=15。
core_knowledge: [普通生成函數, 有限等比級數, 廣義二項式定理, 高精度整數]
judgment: 題目求兩座陣法選法的組合，十個限制的生成函數要相乘，而不是把兩座陣法方案數相加。
hints:
  - 「k 的倍數」對應 1/(1-x^k)；「至多 r」對應 (1-x^(r+1))/(1-x)。
  - 十個因子中的高次項分子與分母會完全約掉。
  - 最終生成函數是 (1-x)^(-5)，取 x^n 係數。
solution_outline: 逐項列出十個等比級數並約分，得到 (1-x)^-5。廣義二項式定理給答案 C(n+4,4)=(n+1)(n+2)(n+3)(n+4)/24。用任意精度整數讀入十萬位 n，做四次小偏移、三次大數乘法及一次除 24。
proof_or_invariant: 每個因子的 x^s 係數恰表示該類石頭可否使用 s 塊；乘法卷積把十類用量加總，因此 x^n 係數就是方案數。約分是形式冪級數恆等變換，不改係數。負整數次二項式展開中 [x^n](1-x)^-5=C(n+4,4)，故公式正確。
common_errors: [把兩陣法方案相加, 誤寫成 C(n+5, 5), 使用固定寬度整數, 先除因子造成非整除]
complexity: { time: 'O(M(|n|))', space: 'O(|n|)' }
cpp_skeleton: |
  #include <iostream>
  #include <string>
  using namespace std;
  int main() { string n; cin >> n; /* TODO: 計算 C(n+4,4)。 */ return 0; }
cpp_solution: |
  #include <boost/multiprecision/cpp_int.hpp>
  #include <iostream>
  #include <string>
  using namespace std;
  using boost::multiprecision::cpp_int;
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      string text;
      cin >> text;
      cpp_int n = 0;
      for (char digit : text) n = n * 10 + static_cast<unsigned int>(digit - '0');
      const cpp_int answer = (n + 1) * (n + 2) * (n + 3) * (n + 4) / 24;
      cout << answer << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P2000
external_platform: 洛谷
external_problem_id: P2000
external_title: 拯救世界
external_relation: original
source_book_pages: [500]
source_pdf_pages: [130]
review_status: verified
---

十個看似不同的限制在生成函數中完全約消，只留下單一四次組合數。
