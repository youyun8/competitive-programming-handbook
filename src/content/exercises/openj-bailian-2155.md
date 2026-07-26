---
id: openj-bailian-2155
volume: upper
source_file: upper-volume
title: OpenJudge 百練 2155 Matrix
chapter: 4
section: '4.3'
kind: external-oj
difficulty: 3
topics: &id001
  - 2d-fenwick-tree
  - difference-array
  - xor
prerequisites:
  - segment-tree
statement: 初始全零方陣，支援矩形內所有位元翻轉與單點查詢。
constraints:
  - T <= 10
  - N <= 1000
  - 操作 <= 50000
input_format: C x1 y1 x2 y2 翻轉；Q x y 查詢。
output_format: 查詢逐行輸出，測例間空行。
samples:
  - input: |
      1
      2 3
      C 1 1 2 2
      Q 1 2
      Q 2 2
    output: |
      1
      1
    explanation: 整個二乘二矩陣被翻成一。
core_knowledge: *id001
judgment: 二維 BIT 執行四角差分與前綴查詢。
hints:
  - 矩形翻轉可用二維差分的四個角表示。
  - 加法改成 XOR，重複翻轉自然抵銷。
  - 點值是二維差分前綴 XOR。
solution_outline: 二維 BIT 執行四角差分與前綴查詢。
proof_or_invariant: 四角差分只讓矩形內點前綴多一個 XOR 1；矩形外四項成對抵銷。
common_errors:
  - 同座標事件順序或開閉邊界處理錯誤
  - 區間為空時仍遞迴更新
  - 合併時忘記保留跨左右區間候選
complexity:
  time: O(M log²N)
  space: O(N²)
cpp_skeleton: |
  // TODO：依三階段提示自行完成核心。
  #include <bits/stdc++.h>
  using namespace std;int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int T;cin>>T;while(T--){int n,m;cin>>n>>m;vector<vector<int>>bit(static_cast<size_t>(n+2),vector<int>(static_cast<size_t>(n+2)));auto add=[&](int x,int y){for(int i=x;i<=n;i+=i&-i)for(int j=y;j<=n;j+=j&-j)bit[static_cast<size_t>(i)][static_cast<size_t>(j)]^=1;};auto get=[&](int x,int y){int s=0;for(int i=x;i>0;i-=i&-i)for(int j=y;j>0;j-=j&-j)s^=bit[static_cast<size_t>(i)][static_cast<size_t>(j)];return s;};while(m--){char op;cin>>op;if(op=='C'){int x1,y1,x2,y2;cin>>x1>>y1>>x2>>y2;add(x1,y1);if(x2<n)add(x2+1,y1);if(y2<n)add(x1,y2+1);if(x2<n&&y2<n)add(x2+1,y2+1);}else{int x,y;cin>>x>>y;cout<<get(x,y)<<'\n';}}if(T)cout<<'\n';}}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int T;cin>>T;while(T--){int n,m;cin>>n>>m;vector<vector<int>>bit(static_cast<size_t>(n+2),vector<int>(static_cast<size_t>(n+2)));auto add=[&](int x,int y){for(int i=x;i<=n;i+=i&-i)for(int j=y;j<=n;j+=j&-j)bit[static_cast<size_t>(i)][static_cast<size_t>(j)]^=1;};auto get=[&](int x,int y){int s=0;for(int i=x;i>0;i-=i&-i)for(int j=y;j>0;j-=j&-j)s^=bit[static_cast<size_t>(i)][static_cast<size_t>(j)];return s;};while(m--){char op;cin>>op;if(op=='C'){int x1,y1,x2,y2;cin>>x1>>y1>>x2>>y2;add(x1,y1);if(x2<n)add(x2+1,y1);if(y2<n)add(x1,y2+1);if(x2<n&&y2<n)add(x2+1,y2+1);}else{int x,y;cin>>x>>y;cout<<get(x,y)<<'\n';}}if(T)cout<<'\n';}}
external_url: http://bailian.openjudge.cn/practice/2155/
external_platform: OpenJ_Bailian
external_problem_id: '2155'
external_title: OpenJudge 百練 2155 Matrix
external_relation: original
source_book_pages:
  - 202
source_pdf_pages:
  - 220
review_status: verified
---

本卡片依外部題面與限制獨立整理。
