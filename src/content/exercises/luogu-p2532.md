---
id: luogu-p2532
volume: lower
source_file: lower-volume
title: 洛谷 P2532 樹屋階梯與 Catalan 數
chapter: 7
section: '7.6'
kind: external-oj
difficulty: 3
topics: [catalan-number, arbitrary-precision]
prerequisites: [catalan-stirling]
statement: 給定樹屋階梯高度 n，依題目所示的合法支撐方式搭建，求不同搭建方法總數。
constraints:
  - 1 <= n <= 10000
  - 答案可能非常大，必須使用任意精度整數
input_format: 一個正整數 n。
output_format: 輸出高度 n 的搭建方法數，不取模。
samples:
  - input: '3'
    output: '5'
    explanation: 此結構的方案數是第 n 個 Catalan 數，C_3=5。
core_knowledge:
  - 階梯的合法結構與 Catalan 對象一一對應
  - Catalan 相鄰項比例可用整數精確遞推並配合大整數
judgment: 輸出完整十進位整數，不得取模或使用浮點近似。
hints:
  - 依最外層支撐的分割點，可得到標準 Catalan 遞推。
  - 避免 O(n²) 大整數卷積，使用 C_(i+1)=C_i·2(2i+1)/(i+2)。
  - 每一步除法都整除；用 cpp_int 保存乘積後再做整數除法。
solution_outline: 從 C_0=1 出發，對 i=0..n-1 依相鄰項公式更新任意精度整數，輸出 C_n。
proof_or_invariant: >-
  依第一個分割位置，左右兩側是獨立合法子結構，故方案滿足 Catalan 遞推。
  相鄰項公式由 C_n=(2n)!/(n!(n+1)!) 化簡而得；迴圈第 i 次後保存 C_(i+1)，
  因此最後恰為題目方案數。
common_errors:
  - 使用 long long，Catalan 數很快溢位
  - 先做除法再乘法，造成非整除的截斷
  - 輸出 C_(n-1) 或把高度 1 對應成 C_0
complexity:
  time: O(n) 次大整數乘除
  space: O(d)，d 為答案位數
cpp_skeleton: |
  #include <boost/multiprecision/cpp_int.hpp>
  #include <iostream>
  using namespace std;
  using boost::multiprecision::cpp_int;
  int main() {
      int n;
      cin >> n;
      cpp_int catalan = 1;
      // TODO：以相鄰項公式遞推到 C_n。
      cout << catalan << '\n';
      return 0;
  }
cpp_solution: |
  #include <boost/multiprecision/cpp_int.hpp>
  #include <iostream>
  using namespace std;
  using boost::multiprecision::cpp_int;
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      cin >> n;
      cpp_int catalan = 1;
      for (int i = 0; i < n; ++i) {
          catalan = catalan * (2 * (2 * i + 1)) / (i + 2);
      }
      cout << catalan << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P2532
external_platform: 洛谷
external_problem_id: P2532
external_title: '[AHOI2012] 樹屋階梯'
external_relation: original
source_book_pages: [486, 491]
source_pdf_pages: [116, 121]
review_status: verified
---

辨認出 Catalan 後，使用相鄰項公式能把一萬層的大整數計算從平方次卷積降為線性次更新。
