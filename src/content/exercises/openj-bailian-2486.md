---
id: openj-bailian-2486
volume: upper
source_file: upper-volume
title: OpenJudge 百練 2486 Apple Tree
chapter: 5
section: '5.6'
kind: external-oj
difficulty: 3
topics: ['tree-dp', 'tree-knapsack']
prerequisites: ['depth-first-search', 'dynamic-programming']
statement: >-
  一棵 n 點樹，每點有蘋果數。從節點 1 出發走不超過 k 條邊，每個節點的蘋果至多採一次，終點不限，求最多蘋果。
constraints:
  - 1 <= n <= 100
  - 0 <= k <= 200
  - 蘋果數為非負整數
input_format: 第一行 n、k，第二行各點蘋果數，接著 n-1 行無向邊。
output_format: 輸出最多可採蘋果數。
samples:
  - input: |-
      5 4
      1 2 3 4 5
      1 2
      1 3
      2 4
      2 5
    output: |-
      12
    explanation: 走 1→2→4→2→5，四步採到節點 1、2、4、5，共 12。
core_knowledge: ['樹上行走 DP', '回程狀態', '子樹揹包']
judgment: 路線在兒子子樹間切換必須回到父節點；只需區分是否回到目前子樹根。
hints:
  - 設 back[u][s] 與 open[u][s] 表示走 s 步後回到 u／可停在子樹內。
  - 合併兒子時，往返需額外 2 步；把唯一不回程段放在目前方案或新兒子中。
  - 每次合併使用新陣列，答案取 open[1][0..k] 最大值。
solution_outline: >-
  根樹後做後序 DP。每點以自身蘋果初始化；逐兒子枚舉兩邊步數，更新回程+回程，以及回程+不回程兩類。
proof_or_invariant: >-
  樹上路線進入一個兒子子樹後，若還要造訪別的兒子就必須沿同邊返回；整條路線至多一個兒子段不返回。轉移枚舉此段的位置與步數分配，依子樹歸納涵蓋所有合法路線。
common_errors: ['把父子邊的一次或兩次行走漏算', '同時讓兩個兒子不回程', '只取恰好 k 步而漏掉較短最佳解']
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
  #include <vector>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);
   int n,k;cin>>n>>k; vector<int>a(n+1);for(int i=1;i<=n;i++)cin>>a[i];
   vector<vector<int>>g(n+1);for(int i=1,u,v;i<n;i++){cin>>u>>v;g[u].push_back(v);g[v].push_back(u);}
   const int neg=-1000000000;vector<vector<int>>back(n+1,vector<int>(k+1,neg)),open=back;
   auto dfs=[&](auto&&self,int u,int p)->void{back[u][0]=open[u][0]=a[u];
    for(int v:g[u])if(v!=p){self(self,v,u);auto nb=back[u],no=open[u];
     for(int i=0;i<=k;i++)for(int j=0;j<=k;j++){
      if(i+j+2<=k&&back[u][i]>neg&&back[v][j]>neg)nb[i+j+2]=max(nb[i+j+2],back[u][i]+back[v][j]);
      if(i+j+2<=k&&open[u][i]>neg&&back[v][j]>neg)no[i+j+2]=max(no[i+j+2],open[u][i]+back[v][j]);
      if(i+j+1<=k&&back[u][i]>neg&&open[v][j]>neg)no[i+j+1]=max(no[i+j+1],back[u][i]+open[v][j]);
     }back[u].swap(nb);open[u].swap(no);
    }};dfs(dfs,1,0);cout<<*max_element(open[1].begin(),open[1].end())<<'\n';}
external_url: http://bailian.openjudge.cn/practice/2486/
external_platform: OpenJudge 百練
external_problem_id: '2486'
external_title: Apple Tree
external_relation: original
source_book_pages: [364]
source_pdf_pages: [382]
review_status: verified
---

回程／不回程雙狀態精確描述樹上一次行走的形狀。
