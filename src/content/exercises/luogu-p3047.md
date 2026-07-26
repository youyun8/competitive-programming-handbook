---
id: luogu-p3047
volume: upper
source_file: upper-volume
title: 洛谷 P3047 Nearby Cows G
chapter: 5
section: '5.6'
kind: external-oj
difficulty: 3
topics: ['tree-dp', 'rerooting']
prerequisites: ['depth-first-search', 'dynamic-programming']
statement: >-
  帶點權樹上，對每個節點求距離不超過 k 的所有節點權值總和。
constraints:
  - 1 <= n <= 100000
  - 1 <= k <= 20
  - 0 <= 點權 <= 1000
input_format: 第一行 n、k，接著 n-1 條邊，最後 n 行依序給點權。
output_format: 對每個節點輸出距離不超過 k 的權值和。
samples:
  - input: |-
      6 2
      5 1
      3 6
      2 4
      2 1
      3 2
      1
      2
      3
      4
      5
      6
    output: |-
      15
      21
      16
      10
      8
      11
    explanation: 例如距離田地 1 不超過兩條邊的牛共有 15 頭。
core_knowledge: ['距離分層 DP', '換根', '容斥']
judgment: 先算每點向下各距離的權值，再換根把父側恰距離資訊補給兒子。
hints:
  - down[u][d] 表示 u 子樹內距 u 不超過 d 的權值和。
  - 先後序算 down；令 all[u][d] 為全樹距 u 不超過 d 的和。
  - 傳到兒子 v：all[v][d]=down[v][d]+all[u][d-1]-down[v][d-2]，最後一項避免重複。
solution_outline: >-
  根於 1 做兩遍 DFS。第一遍累加子樹半徑和；第二遍由父傳全樹半徑和，按公式扣掉已包含的兒子方向。
proof_or_invariant: >-
  距 v 不超過 d 的點分成 v 子樹內與先經父邊兩類。父側候選是距 u 不超過 d-1 的全部點，其中 v 子樹內距 v 不超過 d-2 的點已在第一類，恰需扣除。兩類並集即公式。
common_errors: ['使用恰好距離與不超過距離的公式混用', 'd=1 時存取 d-2', '答案使用 down 而非換根後 all']
complexity:
  time: 'O(nk)'
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
  #include <iostream>
  #include <vector>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,k;cin>>n>>k;vector<vector<int>>g(n+1);for(int i=1,u,v;i<n;i++){cin>>u>>v;g[u].push_back(v);g[v].push_back(u);}vector<long long>w(n+1);for(int i=1;i<=n;i++)cin>>w[i];vector<vector<long long>>down(n+1,vector<long long>(k+1)),all=down;auto d1=[&](auto&&f,int u,int p)->void{for(int d=0;d<=k;d++)down[u][d]=w[u];for(int v:g[u])if(v!=p){f(f,v,u);for(int d=1;d<=k;d++)down[u][d]+=down[v][d-1];}};auto d2=[&](auto&&f,int u,int p)->void{for(int v:g[u])if(v!=p){all[v][0]=w[v];for(int d=1;d<=k;d++)all[v][d]=down[v][d]+all[u][d-1]-(d>=2?down[v][d-2]:0);f(f,v,u);}};d1(d1,1,0);all[1]=down[1];d2(d2,1,0);for(int i=1;i<=n;i++)cout<<all[i][k]<<'\n';}
external_url: https://www.luogu.com.cn/problem/P3047
external_platform: 洛谷
external_problem_id: 'P3047'
external_title: Nearby Cows G
external_relation: original
source_book_pages: [364]
source_pdf_pages: [382]
review_status: verified
---

換根公式用一次容斥，把父側資訊加入而不重複兒子子樹。
