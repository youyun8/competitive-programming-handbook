---
id: luogu-p4151
volume: lower
source_file: lower-volume
source_book_pages:
  - 387
  - 461
source_pdf_pages:
  - 17
  - 91
title: Luogu P4151 最大 XOR 和路徑
chapter: 6
section: '6.5'
kind: external-oj
difficulty: 4
topics:
  - 線性基
  - 分數規劃
prerequisites:
  - GF(2) 與二分答案
statement: 給定帶非負 XOR 邊權的連通無向圖，求從 1 到 n 任意路徑可得到的最大邊權 XOR。
constraints:
  - n<=50000，m<=100000
  - 邊權<2^63
input_format: 依題意讀入測試組、陣列或圖資料。
output_format: 逐組輸出指定答案。
samples:
  - input: |
      3 3
      1 2 1
      2 3 2
      1 3 4
    output: |
      4
    explanation: 直接列舉小型案例或依判定式計算可得。
core_knowledge:
  - 等價判定
  - 線性獨立或負環
judgment: 固定一棵生成樹得到基準 XOR 路徑；每條非樹邊產生一個環 XOR，所有路徑差值由環空間張成。用線性基最大化。
hints:
  - 先把目標改寫成線性獨立或「答案至少為 x」的判定。
  - 找出判定中需要最大化的加總量。
  - 使用線性基、背包或負環檢測完成判定，並處理精度。
solution_outline: 固定一棵生成樹得到基準 XOR 路徑；每條非樹邊產生一個環 XOR，所有路徑差值由環空間張成。用線性基最大化。
proof_or_invariant: 任一路徑與基準路徑的對稱差是若干環；反之插入環繞行可加入該環 XOR，因此可達值恰為 d[n] 加上環 XOR 空間。
complexity:
  time: O((n+m)·64)
  space: O(n+m)
common_errors:
  - 線性基主元方向錯誤
  - 二分可行方向顛倒
  - 64 位元或浮點精度不足
cpp_skeleton: |
  // TODO：依提示重寫核心資料結構。
  #include <bits/stdc++.h>
  using namespace std;
  struct E{int v;unsigned long long w;};array<unsigned long long,64>b{};void ins(unsigned long long x){for(int i=63;i>=0;--i)if(x>>i&1ULL){if(b[i])x^=b[i];else{b[i]=x;break;}}}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;cin>>n>>m;vector<vector<E>>g(n+1);while(m--){int u,v;unsigned long long w;cin>>u>>v>>w;g[u].push_back({v,w});g[v].push_back({u,w});}vector<unsigned long long>d(n+1);vector<char>vis(n+1);stack<int>s;s.push(1);vis[1]=1;while(!s.empty()){int u=s.top();s.pop();for(auto e:g[u])if(!vis[e.v])vis[e.v]=1,d[e.v]=d[u]^e.w,s.push(e.v);else ins(d[u]^d[e.v]^e.w);}unsigned long long ans=d[n];for(int i=63;i>=0;--i)ans=max(ans,ans^b[i]);cout<<ans<<"\n";}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  struct E{int v;unsigned long long w;};array<unsigned long long,64>b{};void ins(unsigned long long x){for(int i=63;i>=0;--i)if(x>>i&1ULL){if(b[i])x^=b[i];else{b[i]=x;break;}}}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;cin>>n>>m;vector<vector<E>>g(n+1);while(m--){int u,v;unsigned long long w;cin>>u>>v>>w;g[u].push_back({v,w});g[v].push_back({u,w});}vector<unsigned long long>d(n+1);vector<char>vis(n+1);stack<int>s;s.push(1);vis[1]=1;while(!s.empty()){int u=s.top();s.pop();for(auto e:g[u])if(!vis[e.v])vis[e.v]=1,d[e.v]=d[u]^e.w,s.push(e.v);else ins(d[u]^d[e.v]^e.w);}unsigned long long ans=d[n];for(int i=63;i>=0;--i)ans=max(ans,ans^b[i]);cout<<ans<<"\n";}
external_url: https://www.luogu.com.cn/problem/P4151
external_platform: Luogu
external_problem_id: P4151
external_title: 最大 XOR 和路徑
external_relation: original
review_status: verified
---

以代數結構或單調判定取代直接枚舉。
