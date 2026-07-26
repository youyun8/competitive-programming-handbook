---
id: luogu-p4516
volume: upper
source_file: upper-volume
title: 洛谷 P4516 潛入行動
chapter: 5
section: '5.6'
kind: external-oj
difficulty: 5
topics: ['tree-dp', 'tree-knapsack']
prerequisites: ['dynamic-programming']
statement: >-
  在 n 點樹上恰放 k 個監聽器。監聽器只能監聽所在點的直接鄰點，不能監聽自身；求使每個節點都被監聽的放置方案數模 1000000007。
constraints:
  - 1 <= n <= 100000
  - 1 <= k <= min(n,100)
  - 每點至多一個監聽器
input_format: 第一行 n、k；接著 n-1 行無向邊。
output_format: 輸出合法方案數模 1000000007。
samples:
  - input: |-
      5 3
      1 2
      2 3
      3 4
      4 5
    output: |-
      1
    explanation: 鏈的端點迫使 2、4 放置，第三個必須放在 3 才能讓所有監聽器所在點也被鄰點監聽。
core_knowledge: ['全支配集計數', '四狀態 DP', '子樹合併']
judgment: 合併兒子時只需知道目前根是否放置、是否已被兒子監聽；兒子則必須被其孩子或父節點監聽。
hints:
  - dp[u][j][covered][placed] 計數 u 子樹放 j 個，covered 表示 u 是否已被兒子監聽。
  - 合併兒子 v 時，v 合法當且僅當 child_covered 或 u_placed；新 covered 是原 covered 或 v_placed。
  - 按子樹容量限制 j<=k 做樹形揹包；根沒有父親，答案只取 covered=1 的兩個 placed 狀態。
solution_outline: >-
  先迭代建立父節點與後序，避免深鏈遞迴。每點初始化不放與放置兩方案；逆序逐兒子合併四種狀態和設備數，依監聽合法條件累加乘積。
proof_or_invariant: >-
  四狀態完整記錄子樹外仍可能影響合法性的唯一資訊：父節點能否監聽 u 取決於父是否放置。合併邊 u-v 時立即確認 v 已由孩子或 u 監聽，且 v 放置會監聽 u。各兒子獨立，揹包枚舉設備分配；根 covered=1 恰保證全樹皆合法。
common_errors: ['誤認監聽器能監聽自身', '合併後未要求兒子被監聽', '根仍允許等待不存在的父節點']
complexity:
  time: 'O(nk^2)（以子樹大小截斷後均攤 O(nk)）'
  space: 'O(nk)'
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：依狀態定義完成初始化、轉移與答案輸出。
      return 0;
  }
cpp_solution: |
  #include <algorithm>
  #include <array>
  #include <iostream>
  #include <vector>
  using namespace std;
  constexpr int mod=1000000007;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,k;cin>>n>>k;vector<vector<int>>g(n+1);for(int i=1,u,v;i<n;i++){cin>>u>>v;g[u].push_back(v);g[v].push_back(u);}vector<int>parent(n+1),order{1};for(size_t i=0;i<order.size();i++){int u=order[i];for(int v:g[u])if(v!=parent[u])parent[v]=u,order.push_back(v);}vector<vector<array<int,4>>>dp(n+1,vector<array<int,4>>(k+1));vector<int>size(n+1);for(auto it=order.rbegin();it!=order.rend();++it){int u=*it;size[u]=1;dp[u][0][0]=1;if(k)dp[u][1][1]=1;for(int v:g[u])if(parent[v]==u){vector<array<int,4>>next(k+1);for(int have=0;have<=min(k,size[u]);have++)for(int take=0;take<=min(k-have,size[v]);take++)for(int state=0;state<4;state++)if(dp[u][have][state])for(int child=0;child<4;child++)if(dp[v][take][child]){int covered=state/2,placed=state%2,child_covered=child/2,child_placed=child%2;if(!placed&&!child_covered)continue;int ns=(covered|child_placed)*2+placed;next[have+take][ns]=(next[have+take][ns]+1LL*dp[u][have][state]*dp[v][take][child])%mod;}size[u]=min(k,size[u]+size[v]);dp[u].swap(next);}}cout<<(dp[1][k][2]+dp[1][k][3])%mod<<'\n';}
external_url: https://www.luogu.com.cn/problem/P4516
external_platform: 洛谷
external_problem_id: 'P4516'
external_title: 潛入行動
external_relation: original
source_book_pages: [364]
source_pdf_pages: [382]
review_status: verified
---

是否放置與是否已被兒子監聽是跨父子邊所需的全部資訊，四狀態即可完成精確計數。
