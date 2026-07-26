---
id: luogu-p3177
volume: upper
source_file: upper-volume
title: 洛谷 P3177 樹上染色
chapter: 5
section: '5.6'
kind: external-oj
difficulty: 4
topics: ['tree-dp', 'tree-knapsack']
prerequisites: ['depth-first-search', 'dynamic-programming']
statement: >-
  帶權樹上把恰好 k 個節點染黑，其餘染白；所有黑白異色點對的距離總和稱為收益，求最大收益。
constraints:
  - 1 <= n <= 2000
  - 0 <= k <= n
  - 邊權為非負整數
input_format: 第一行 n、k，接著 n-1 行給邊兩端與權重。
output_format: 輸出最大收益。
samples:
  - input: |-
      2 1
      1 2 5
    output: |-
      5
    explanation: 兩點異色，唯一黑白點對距離為 5。
core_knowledge: ['邊貢獻', '黑白計數', '樹形揹包']
judgment: 一條邊的總貢獻等於跨過該邊的異色點對數乘邊權，只需知道子樹大小與其中黑點數。
hints:
  - 令 dp[u][j] 為 u 子樹染 j 黑時，已合併邊的最大貢獻。
  - 兒子 v 大小 s、取 x 黑時，跨父子邊的異色對數為 x*((n-k)-(s-x))+(s-x)*(k-x)。
  - 逐兒子做分組揹包，使用 64 位並把不可達狀態設為負無窮。
solution_outline: >-
  根樹後序求子樹大小。合併兒子時枚舉目前黑數與兒子黑數，加入兒子最優值及父子邊的全局黑白跨邊貢獻。
proof_or_invariant: >-
  任意點對距離是其路徑各邊權之和，因此可交換求和順序，逐邊計數跨邊異色對。固定兒子側大小 s 與黑數 x 後，兩方向異色配對數由公式唯一決定；揹包枚舉所有黑數分配，故得到全局最優。
common_errors: ['只計子樹內點對而漏掉外側', '把同色點對算入邊貢獻', '黑白總數 k 與 n-k 用反']
complexity:
  time: 'O(nk^2)'
  space: 'O(nk)'
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：依狀態定義完成初始化、子問題合併與邊界處理。
      return 0;
  }
cpp_solution: |
  #include <algorithm>
  #include <iostream>
  #include <limits>
  #include <tuple>
  #include <vector>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,k;cin>>n>>k;vector<vector<pair<int,int>>>g(n+1);for(int i=1,u,v,w;i<n;i++){cin>>u>>v>>w;g[u].push_back({v,w});g[v].push_back({u,w});}const long long neg=numeric_limits<long long>::min()/4;vector<vector<long long>>dp(n+1,vector<long long>(k+1,neg));vector<int>sz(n+1);auto dfs=[&](auto&&f,int u,int p)->void{sz[u]=1;dp[u][0]=0;if(k)dp[u][1]=0;for(auto [v,w]:g[u])if(v!=p){f(f,v,u);vector<long long>next(k+1,neg);for(int have=0;have<=min(k,sz[u]);have++)if(dp[u][have]>neg)for(int x=0;x<=min(k-have,sz[v]);x++)if(dp[v][x]>neg){long long white=sz[v]-x;long long pairs=1LL*x*((n-k)-white)+white*(k-x);next[have+x]=max(next[have+x],dp[u][have]+dp[v][x]+pairs*w);}sz[u]+=sz[v];dp[u].swap(next);}};dfs(dfs,1,0);cout<<dp[1][k]<<'\n';}
external_url: https://www.luogu.com.cn/problem/P3177
external_platform: 洛谷
external_problem_id: 'P3177'
external_title: 樹上染色
external_relation: original
source_book_pages: [364]
source_pdf_pages: [382]
review_status: verified
---

把距離總和改按邊計算後，跨邊異色點對數只依賴子樹黑點數。
