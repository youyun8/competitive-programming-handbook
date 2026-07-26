---
id: luogu-p2014
volume: upper
source_file: upper-volume
title: 洛谷 P2014 選課
chapter: 5
section: '5.6'
kind: external-oj
difficulty: 3
topics: ['tree-dp', 'dependency-knapsack']
prerequisites: ['depth-first-search', 'dynamic-programming']
statement: >-
  每門課有學分且至多一門先修課；要選恰好 m 門，選課前必須選其先修課，求最大學分。
constraints:
  - 1 <= n <= 300
  - 1 <= m <= n
  - 先修關係形成森林
input_format: 第一行 n、m；接著 n 行給課 i 的先修編號（0 表示無）與學分。
output_format: 輸出恰選 m 門的最大學分。
samples:
  - input: |-
      7 4
      2 2
      0 1
      0 4
      2 1
      7 1
      7 6
      2 2
    output: |-
      13
    explanation: 把所有無先修課接虛擬根後，最佳祖先封閉集合含四門課，學分 13。
core_knowledge: ['依賴揹包', '虛擬根', '恰好容量']
judgment: 合法集合對先修祖先封閉，等價於依賴森林中的含根連通選點。
hints:
  - 建立不占名額、學分為 0 的虛擬課 0。
  - dp[u][j] 表示在 u 子樹選 j 門真課且若 u 非虛擬根則必選 u。
  - 逐兒子用新陣列合併 0..子樹大小門，輸出 dp[0][m]。
solution_outline: >-
  將森林接到虛擬根，後序做樹形分組揹包；真課以選自己一門初始化，虛擬根以零門初始化。
proof_or_invariant: >-
  每個合法選課集合加上虛擬根後連通；反之含根連通集合必含每門課的先修鏈。兒子子樹互不相交，揹包枚舉所有名額分配，歸納得到最優。
common_errors: ['把虛擬根計入 m', '未選父課卻合併兒子方案', '把恰好 m 寫成至多 m']
complexity:
  time: 'O(nm^2)'
  space: 'O(nm)'
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
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;cin>>n>>m;vector<vector<int>>ch(n+1);vector<int>w(n+1);for(int i=1,p;i<=n;i++){cin>>p>>w[i];ch[p].push_back(i);}const int neg=-1000000000;vector<vector<int>>dp(n+1,vector<int>(m+1,neg));auto dfs=[&](auto&&s,int u)->void{dp[u][u?1:0]=w[u];for(int v:ch[u]){s(s,v);auto nd=dp[u];for(int i=0;i<=m;i++)if(dp[u][i]>neg)for(int j=1;i+j<=m;j++)if(dp[v][j]>neg)nd[i+j]=max(nd[i+j],dp[u][i]+dp[v][j]);dp[u].swap(nd);}};dfs(dfs,0);cout<<dp[0][m]<<'\n';}
external_url: https://www.luogu.com.cn/problem/P2014
external_platform: 洛谷
external_problem_id: 'P2014'
external_title: 選課
external_relation: original
source_book_pages: [364]
source_pdf_pages: [382]
review_status: verified
---

先修限制透過虛擬根轉成標準祖先封閉樹形揹包。
