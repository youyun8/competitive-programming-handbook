---
volume: lower
source_file: lower-volume
chapter: 6
section: '6.3'
kind: external-oj
review_status: verified
external_relation: original
source_book_pages:
  - 387
  - 461
source_pdf_pages:
  - 17
  - 91
id: luogu-p5337
title: 洛谷 P5337 甲苯先生的字符串
difficulty: 4
topics:
  - 禁用相鄰對
  - 矩陣加速 DP
prerequisites:
  - 矩陣快速冪
statement: 給定小寫字串 s_1 與長度 n，計算長度 n 的小寫字串 s_2 數量，使 s_1 中每個有向相鄰字母對都不在 s_2 中相鄰出現；答案模 1000000007。
constraints:
  - 1 <= n <= 10^15
  - '|s_1| <= 100000'
input_format: 第一行 n；第二行小寫字串 s_1。
output_format: 輸出合法 s_2 數量的模值。
samples:
  - input: |
      2
      ab
    output: |
      675
    explanation: 全部 26²=676 個長度二字串中，只有 ab 被禁止，因此剩 675。
core_knowledge:
  - 以末字母為狀態
  - 26 階轉移矩陣
judgment: 只有相鄰字母影響合法性；26 個末字母狀態固定，但 n 極大，適合矩陣快速冪。
hints:
  - 令 dp[len][c] 表示長度 len 且末字母為 c 的方案數。
  - 若有向字母對 (x,y) 出現在 s_1，相應轉移矩陣 x→y 設為 0，其餘為 1。
  - 長度 1 的每個末字母各有一種；矩陣取 n-1 次方後加總所有起終字母。
solution_outline: 先標記 s_1 所有相鄰有向對，建立 26×26 允許矩陣；快速冪 n-1 並加總全部元素。
proof_or_invariant: 轉移矩陣元素恰表示能否接上一個字母。矩陣乘法逐位置合併合法選擇，因此其 n-1 次方每個元素計數指定首末字母的合法字串；總和即答案。
complexity:
  time: O(|s_1|+26^3 log n)
  space: O(26^2)
common_errors:
  - 把禁止對當成無向而同時禁 ba
  - 冪次誤用 n
  - n=1 時未回傳 26
cpp_skeleton: >-
  #include <bits/stdc++.h>

  using namespace std;static const long long MOD=1000000007;struct Mat{long long a[26][26]{};};static Mat mul(const
  Mat&x,const Mat&y){Mat z;for(int i=0;i<26;i++)for(int k=0;k<26;k++)for(int
  j=0;j<26;j++)z.a[i][j]=(z.a[i][j]+x.a[i][k]*y.a[k][j])%MOD;return z;}static Mat power(Mat b,unsigned long long e){Mat
  r;for(int i=0;i<26;i++)r.a[i][i]=1;while(e){if(e&1ULL)r=mul(r,b);b=mul(b,b);e>>=1;}return r;}int
  main(){ios::sync_with_stdio(false);cin.tie(nullptr);unsigned long long n;string s;cin>>n>>s;Mat t;for(int
  i=0;i<26;i++)for(int j=0;j<26;j++)t.a[i][j]=1;for(size_t i=1;i<s.size();i++)t.a[s[i-1]-'a'][s[i]-'a']=0;Mat
  r=power(t,n-1);long long ans=0;for(int i=0;i<26;i++)for(int
  j=0;j<26;j++)ans=(ans+r.a[i][j])%MOD;cout<<ans<<'\n';return 0;}
cpp_solution: >-
  #include <bits/stdc++.h>

  using namespace std;static const long long MOD=1000000007;struct Mat{long long a[26][26]{};};static Mat mul(const
  Mat&x,const Mat&y){Mat z;for(int i=0;i<26;i++)for(int k=0;k<26;k++)for(int
  j=0;j<26;j++)z.a[i][j]=(z.a[i][j]+x.a[i][k]*y.a[k][j])%MOD;return z;}static Mat power(Mat b,unsigned long long e){Mat
  r;for(int i=0;i<26;i++)r.a[i][i]=1;while(e){if(e&1ULL)r=mul(r,b);b=mul(b,b);e>>=1;}return r;}int
  main(){ios::sync_with_stdio(false);cin.tie(nullptr);unsigned long long n;string s;cin>>n>>s;Mat t;for(int
  i=0;i<26;i++)for(int j=0;j<26;j++)t.a[i][j]=1;for(size_t i=1;i<s.size();i++)t.a[s[i-1]-'a'][s[i]-'a']=0;Mat
  r=power(t,n-1);long long ans=0;for(int i=0;i<26;i++)for(int
  j=0;j<26;j++)ans=(ans+r.a[i][j])%MOD;cout<<ans<<'\n';return 0;}
external_url: https://www.luogu.com.cn/problem/P5337
external_platform: Luogu
external_problem_id: P5337
external_title: '[TJOI2019] 甲苯先生的字符串'
---

限制只作用於相鄰兩字母，因此狀態不必保存整個前綴。
