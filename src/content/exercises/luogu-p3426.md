---
id: luogu-p3426
volume: lower
source_file: lower-volume
title: 洛谷 P3426 SZA-Template
chapter: 9
section: '9.5'
kind: external-oj
difficulty: 4
topics: [prefix-function, cover-dp, rightmost-coverage]
prerequisites: [kmp, string]
statement: '求最短印章長度，使若干次完整蓋印可覆蓋目標字串；蓋印可重疊但重疊字元必須相同。'
constraints:
  - '1 <= |S| <= 5*10^5'
  - 'S 只含小寫字母'
input_format: '一行目標字串。'
output_format: '輸出最短印章長度。'
samples:
  - input: "ababbababbabababbabababbababbaba\n"
    output: '8'
    explanation: '長度 8 的 ababbaba 可由多次相容重疊覆蓋整串。'
core_knowledge:
  - 'prefix-function'
  - 'cover-dp'
  - 'rightmost-coverage'
judgment: '輸出最短印章長度。'
hints:
  - '可行印章必同時是目前前綴的前綴與後綴。'
  - 'dp[i] 只需在整段長 i 與 dp[pi[i]] 之間選；後者須能跨過兩份覆蓋間缺口。'
  - 'last[len] 記此印章目前最右可覆蓋位置，若不早於 i-pi[i] 就能延續。'
solution_outline: '計算 pi；依序令 dp[i]=i，若 last[dp[pi[i]]] 足以銜接尾端 border 則沿用，並更新 last。'
proof_or_invariant: '任何最短印章若短於 i 必覆蓋首尾，故來自 pi[i] 前綴的最短解；覆蓋區間相交或相接時聯集仍可覆蓋，last 條件正是無空隙的充要條件。'
common_errors:
  - '只檢查週期整除'
  - '未更新同印章的最右覆蓋'
  - '把印章當可只蓋部分字元'
complexity:
  time: 'O(n)'
  space: 'O(n)'
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);/* TODO：依提示完成核心演算法。*/return 0;}
cpp_solution: |
  #include <iostream>
  #include <string>
  #include <vector>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);string s;cin>>s;int n=static_cast<int>(s.size());vector<int>pi(static_cast<size_t>(n+1)),dp(static_cast<size_t>(n+1)),last(static_cast<size_t>(n+1));for(int i=2,j=0;i<=n;++i){while(j>0&&s[static_cast<size_t>(i-1)]!=s[static_cast<size_t>(j)])j=pi[static_cast<size_t>(j)];if(s[static_cast<size_t>(i-1)]==s[static_cast<size_t>(j)])++j;pi[static_cast<size_t>(i)]=j;}for(int i=1;i<=n;++i){dp[static_cast<size_t>(i)]=i;int border=pi[static_cast<size_t>(i)],candidate=dp[static_cast<size_t>(border)];if(last[static_cast<size_t>(candidate)]>=i-border)dp[static_cast<size_t>(i)]=candidate;last[static_cast<size_t>(dp[static_cast<size_t>(i)])]=i;}cout<<dp[static_cast<size_t>(n)]<<'\n';}
external_url: https://www.luogu.com.cn/problem/P3426
external_platform: 洛谷
external_problem_id: 'P3426'
external_title: '[POI 2005] SZA-Template'
external_relation: original
source_book_pages: [575, 595]
source_pdf_pages: [205, 225]
review_status: verified
---

以線性字串結構重用已知前後綴資訊，避免重新比較。
