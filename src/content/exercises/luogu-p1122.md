---
id: luogu-p1122
volume: upper
source_file: upper-volume
title: 洛谷 P1122 最大子樹和
chapter: 5
section: '5.6'
kind: external-oj
difficulty: 3
topics: ['tree-dp', 'maximum-connected-subgraph']
prerequisites: ['depth-first-search', 'dynamic-programming']
statement: >-
  給一棵 n 點樹與每點權值，選一個非空連通點集，求權值總和最大值。
constraints:
  - 1 <= n <= 16000
  - -100000 <= 權值 <= 100000
  - 答案需 64 位
input_format: 第一行 n，第二行點權，接著 n-1 行無向邊。
output_format: 輸出最大連通子樹權值和。
samples:
  - input: |-
      5
      -1 1 3 1 -1
      1 2
      2 3
      3 4
      4 5
    output: |-
      5
    explanation: 選節點 2、3、4，連通且權值和為 5。
core_knowledge: ['樹形 DP', '連通子圖', '負貢獻剪除']
judgment: 固定最高點 u 後，每個兒子子樹要麼不取，要麼取一個包含兒子的正貢獻連通塊。
hints:
  - 令 dp[u] 為必選 u 且限制在 u 子樹內的最大連通和。
  - 每個兒子 v 只有 dp[v]>0 時才值得接到 u。
  - 每算完一個 u 就用 dp[u] 更新全域答案，最高點可為任意節點。
solution_outline: >-
  任取根後後序 DFS，初始化 dp[u]=weight[u]，再累加所有 max(0,dp[v])，並維護所有 dp[u] 的最大值。
proof_or_invariant: >-
  含 u 的連通集合在每個兒子子樹中的交集若非空，必是含 v 的連通集合；不同兒子互相獨立。負或零貢獻可安全捨棄，正貢獻全部加入最佳。任一非空連通集合有唯一最高點，故枚舉 dp[u] 完整。
common_errors: ['答案初始化為 0 導致全負樹錯誤', '累加負的兒子貢獻', '只輸出 dp[1]']
complexity:
  time: 'O(n)'
  space: 'O(n)'
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
  #include <vector>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;cin>>n;vector<long long>w(n+1),dp(n+1);for(int i=1;i<=n;i++)cin>>w[i];vector<vector<int>>g(n+1);for(int i=1,u,v;i<n;i++){cin>>u>>v;g[u].push_back(v);g[v].push_back(u);}long long ans=numeric_limits<long long>::min();auto dfs=[&](auto&&s,int u,int p)->void{dp[u]=w[u];for(int v:g[u])if(v!=p){s(s,v,u);dp[u]+=max(0LL,dp[v]);}ans=max(ans,dp[u]);};dfs(dfs,1,0);cout<<ans<<'\n';}
external_url: https://www.luogu.com.cn/problem/P1122
external_platform: 洛谷
external_problem_id: 'P1122'
external_title: 最大子樹和
external_relation: original
source_book_pages: [364]
source_pdf_pages: [382]
review_status: verified
---

樹上連通集合以最高點分解，負的兒子分支永遠不應加入。
