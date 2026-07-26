---
id: luogu-p5436
volume: lower
source_file: lower-volume
source_book_pages:
  - 387
  - 461
source_pdf_pages:
  - 17
  - 91
title: Luogu P5436 緣分
chapter: 6
section: '6.7'
kind: external-oj
difficulty: 1
topics:
  - 最大公因數
  - 數論建模
prerequisites:
  - 整除與同餘
statement: 兩人各選一個不超過 n 的正整數，求其最小公倍數的最大可能值。
constraints:
  - 1<=T<=100
  - 1<=n<=10^9
input_format: 依題目格式讀入測試組數與各組參數；多組至 EOF 或終止值者見敘述。
output_format: 依題目指定格式逐組輸出答案。
samples:
  - input: |
      3
      1
      2
      3
    output: |
      1
      2
      6
    explanation: 依定義計算或套用推導後的充要條件，可得上述結果。
core_knowledge:
  - gcd/lcm 性質
  - 等價轉換
judgment: n=1 特判；否則相鄰整數 n 與 n-1 互質，答案 n(n-1)。
hints:
  - 先確認哪些量在一次操作或遞推中保持不變。
  - 用 gcd、質因數或同餘式將候選集合縮小。
  - 證明轉換雙向成立後，再處理邊界、溢位及固定輸出格式。
solution_outline: n=1 特判；否則相鄰整數 n 與 n-1 互質，答案 n(n-1)。
proof_or_invariant: 任兩數 lcm 不超過其乘積；最大乘積由 n、n-1 取得，而兩者互質使 lcm 恰等於該上界。
complexity:
  time: 每組 O(1)
  space: O(1)
common_errors:
  - 只證明必要條件而未證明充分性
  - 中間乘積溢位或負餘數未正規化
  - 漏掉最小輸入與終止條件
cpp_skeleton: |
  // TODO：依證明自行重寫核心轉換。
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int T;cin>>T;while(T--){long long n;cin>>n;cout<<(n==1?1:n*(n-1))<<"\n";}}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int T;cin>>T;while(T--){long long n;cin>>n;cout<<(n==1?1:n*(n-1))<<"\n";}}
external_url: https://www.luogu.com.cn/problem/P5436
external_platform: Luogu
external_problem_id: P5436
external_title: 緣分
external_relation: original
review_status: verified
---

本題重點是把操作轉成可驗證的數論條件。
