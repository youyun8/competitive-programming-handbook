---
id: luogu-p4395
volume: upper
source_file: upper-volume
title: 洛谷 P4395 Gem 氣墊車 (Day 1)
chapter: 5
section: '5.6'
kind: external-oj
difficulty: 3
topics: ['tree-dp', 'coloring']
prerequisites: ['depth-first-search', 'dynamic-programming']
statement: >-
  給一棵 n 點樹，每點指定正整數顏色，鄰接點顏色必須不同；代價為所有顏色編號總和，求最小代價。
constraints:
  - 1 <= n <= 10000
  - 輸入為一棵樹
  - 顏色可用任意正整數
input_format: 第一行 n，接著 n-1 行無向邊。
output_format: 輸出最小顏色總和。
samples:
  - input: |-
      4
      1 2
      2 3
      2 4
    output: |-
      5
    explanation: 中心染 2，其餘三點染 1，總和為 5。
core_knowledge: ['樹著色 DP', '有限顏色上界', '父子限制']
judgment: 樹沒有同層衝突；固定父色後，各兒子只需避開父色並獨立取最小值。
hints:
  - 令 dp[u][c] 為 u 染 c 時子樹最小代價。
  - 轉移為 c 加上每個兒子在 c 以外顏色的最小 dp。
  - 只需枚舉 1..20；最優解不會使用超過 O(log n) 的顏色，可安全覆蓋 n<=10000。
solution_outline: >-
  根樹後序計算 20 種顏色；每個兒子找排除父色後的最小值累加，根取最小。
proof_or_invariant: >-
  固定 u 顏色時，兒子子樹間沒有邊，故可各自選不同於 u 的最小方案。若某點使用顏色 c，沿著迫使 1..c-1 都不可替代的子樹至少呈指數增長；n<=10000 時 20 色足夠。
common_errors: ['誤要求兄弟顏色互異', '只枚舉兩色而錯過降低總和的方案', '使用 int 累加溢位']
complexity:
  time: 'O(20^2 n)'
  space: 'O(20n)'
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
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;cin>>n;vector<vector<int>>g(n+1);for(int i=1,u,v;i<n;i++){cin>>u>>v;g[u].push_back(v);g[v].push_back(u);}const int colors=20;vector<vector<long long>>dp(n+1,vector<long long>(colors+1));auto dfs=[&](auto&&f,int u,int p)->void{for(int v:g[u])if(v!=p)f(f,v,u);for(int c=1;c<=colors;c++){dp[u][c]=c;for(int v:g[u])if(v!=p){long long best=1LL<<60;for(int x=1;x<=colors;x++)if(x!=c)best=min(best,dp[v][x]);dp[u][c]+=best;}}};dfs(dfs,1,0);cout<<*min_element(dp[1].begin()+1,dp[1].end())<<'\n';}
external_url: https://www.luogu.com.cn/problem/P4395
external_platform: 洛谷
external_problem_id: 'P4395'
external_title: Gem 氣墊車 (Day 1)
external_relation: original
source_book_pages: [364]
source_pdf_pages: [382]
review_status: verified
---

父色是兒子唯一需要排除的資訊，形成直接的樹形著色 DP。
