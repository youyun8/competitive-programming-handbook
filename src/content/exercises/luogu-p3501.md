---
id: luogu-p3501
volume: lower
source_file: lower-volume
title: 洛谷 P3501 ANT-Antisymmetry
chapter: 9
section: '9.1'
kind: external-oj
difficulty: 4
topics: [manacher, antisymmetric-string]
prerequisites: [palindrome, amortized-analysis]
statement: 給定只含 0、1 的字串，統計所有偶數長度子串中，關於中心對稱的每一對字元都互不相同者有多少個。
constraints: ['1 <= n <= 5 * 10^5', 字串長度恰為 n 且只含 0 與 1]
input_format: 第一行 n，第二行二進位字串。
output_format: 輸出反對稱子串數量。
samples:
  - input: "4\n0110\n"
    output: '2'
    explanation: 位置 1..2 的 `01` 與 3..4 的 `10` 反對稱；整段 `0110` 的外側同為 0，不合條件。
core_knowledge: [反對稱串必為偶數長, 偶中心 Manacher, 半徑總和即子串數]
judgment: 相同內容位於不同區間要分別計數；答案可能超過 32 位整數。
hints:
  - 每個合格子串都有一個字元間的中心，向兩側第 k 對字元必須不同。
  - 仿照偶長 Manacher，維護目前反對稱區間最右端；鏡射半徑仍可借用，因兩次取反恢復原關係。
  - 中心 i 的最大半徑 d[i] 代表以它為中心共有 d[i] 個合格子串，答案為所有半徑總和。
solution_outline: 使用偶中心 Manacher，只把擴張判斷由相等改成不等。借用鏡射半徑後向外擴張，更新最右區間並累加每個中心半徑。
proof_or_invariant: 維護 [l,r] 為最靠右的已知反對稱區間。區間內左右字元互為補值，把某中心鏡射兩次會保留「兩端不同」關係，故可借用不越過 r 的鏡射半徑；越界部分逐對驗證。每個半徑 k 唯一對應該中心長度 2k 的區間，因此半徑和不漏不重。
common_errors: [把比較條件仍寫成相等, 計入奇數長度子串, 答案使用 int 溢位]
complexity: { time: O(n), space: O(n) }
cpp_skeleton: |
  #include <iostream>
  #include <string>
  #include <vector>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n=0;string s;cin>>n>>s;vector<int> radius(static_cast<size_t>(n),0);
      // TODO：偶中心 Manacher，擴張條件為兩端字元不同。
      (void)radius;return 0;}
cpp_solution: |
  #include <algorithm>
  #include <iostream>
  #include <string>
  #include <vector>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n=0;string s;cin>>n>>s;vector<int> radius(static_cast<size_t>(n),0);int left=0,right=-1;long long answer=0;
      for(int i=0;i<n;++i){int k=i>right?0:min(radius[static_cast<size_t>(left+right-i+1)],right-i+1);while(i-k-1>=0&&i+k<n&&s[static_cast<size_t>(i-k-1)]!=s[static_cast<size_t>(i+k)])++k;radius[static_cast<size_t>(i)]=k;answer+=k;if(i+k-1>right){left=i-k;right=i+k-1;}}cout<<answer<<'\n';
  }
external_url: https://www.luogu.com.cn/problem/P3501
external_platform: 洛谷
external_problem_id: P3501
external_title: '[POI 2010] ANT-Antisymmetry'
external_relation: original
source_book_pages: [554, 574]
source_pdf_pages: [184, 204]
review_status: verified
---

反對稱 Manacher 與迴文版只差擴張關係，但鏡射借用成立的理由要改用「補值兩次恢復」理解。
