---
id: luogu-p2597
volume: lower
source_file: lower-volume
original_label: 洛谷 P2597
title: 災難：食物網的支配樹
chapter: 10
section: '10.2'
kind: external-oj
difficulty: 5
topics: [dag, dominator-tree, lowest-common-ancestor, topological-sort]
prerequisites: [binary-lifting, subtree-size]
statement: >-
  食物網是一張 DAG；若 x 能吃 y，則有 y→x。生產者不依賴食物，消費者只有在所有可吃
  的物種都滅絕後才會滅絕。對每個物種 x，求它突然滅絕後必然連帶滅絕的其他物種數。
constraints:
  - 1 <= n <= 65534
  - 食物關係總數不超過 1000000，輸入檔不超過 1 MB
  - 每行食物編號互異，且食物網沒有有向環
input_format: 第一行 n；接著第 i 行列出物種 i 可吃的所有物種編號，以 0 結束。
output_format: 輸出 n 行，第 i 行為物種 i 的災難值。
samples:
  - input: "5\n0\n1 0\n1 0\n2 3 0\n2 0\n"
    output: "4\n1\n0\n0\n0"
    explanation: 物種 1 滅絕會使 2、3、5 失去全部食物，繼而使 4 也滅絕；物種 2 只必然帶走 5。
core_knowledge: [DAG 支配關係, 多個前驅在支配樹上的 LCA, 倍增 LCA, 子樹統計]
judgment: 某消費者有任一食物存活便不會滅絕；災難值不包含最初滅絕的物種本身。
hints:
  - 加一個虛擬根連向所有生產者；「x 滅絕必使 y 滅絕」就是 x 支配 y。
  - 按食物到捕食者的拓撲序處理，物種 v 在支配樹的父親是所有食物節點的 LCA。
  - 建好支配樹後，x 的所有必然受害者恰為其子樹內除 x 外的節點。
solution_outline: >-
  讀入 food→consumer 邊並拓撲排序。建立虛根 0；來源點掛在 0 下。點 u 確定父親後立即填
  倍增祖先表，再用 u 更新每個後繼累積的 LCA；後繼入度歸零時，其所有食物都已入樹，
  累積 LCA 即父親。最後逆拓撲序把子樹大小加給父親，輸出 size[u]-1。
proof_or_invariant: >-
  虛根到 v 的每條支配樹路徑表示能單獨切斷所有來源到 v 路徑的物種。對來源點只有虛根
  支配。對非來源 v，某 x 支配 v 當且僅當 x 同時支配 v 的每個食物前驅；這些共同支配者
  正是各前驅在已建支配樹上的共同祖先，而最深者為 LCA。因此歸納得到正確支配樹。
  x 的後代恰是所有必須經 x 才能存活的物種，故子樹大小減一就是答案。
common_errors:
  - 把「任一食物滅絕」誤當成消費者滅絕條件
  - 取食物編號的 LCA 前尚未按拓撲序把它們加入支配樹
  - 多個食物只取兩個的 LCA，未持續累積
  - 子樹答案忘記扣除物種自身
complexity: { time: O((n + m) log n), space: O((n + m) + n log n) }
cpp_skeleton: |
  #include <array>
  #include <iostream>
  #include <queue>
  #include <vector>
  using namespace std;
  constexpr int log_n = 17;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n=0;cin>>n;vector<vector<int>> graph(static_cast<size_t>(n+1));vector<int> indegree(static_cast<size_t>(n+1),0);for(int consumer=1;consumer<=n;++consumer){int food=0;while(cin>>food&&food!=0){graph[static_cast<size_t>(food)].push_back(consumer);++indegree[static_cast<size_t>(consumer)];}}/* TODO：依拓撲序建立支配樹，再統計子樹。*/}
cpp_solution: |
  #include <algorithm>
  #include <array>
  #include <iostream>
  #include <queue>
  #include <vector>
  using namespace std;
  constexpr int log_n = 17;
  static int lca(int a,int b,const vector<int>& depth,const vector<array<int,log_n>>& up){
      if(depth[static_cast<size_t>(a)]<depth[static_cast<size_t>(b)])swap(a,b);
      int difference=depth[static_cast<size_t>(a)]-depth[static_cast<size_t>(b)];
      for(int bit=0;bit<log_n;++bit)if((difference&(1<<bit))!=0)a=up[static_cast<size_t>(a)][static_cast<size_t>(bit)];
      if(a==b)return a;
      for(int bit=log_n-1;bit>=0;--bit)if(up[static_cast<size_t>(a)][static_cast<size_t>(bit)]!=up[static_cast<size_t>(b)][static_cast<size_t>(bit)]){a=up[static_cast<size_t>(a)][static_cast<size_t>(bit)];b=up[static_cast<size_t>(b)][static_cast<size_t>(bit)];}
      return up[static_cast<size_t>(a)][0];
  }
  int main(){
      ios::sync_with_stdio(false);cin.tie(nullptr);int n=0;cin>>n;
      vector<vector<int>> graph(static_cast<size_t>(n+1));vector<int> indegree(static_cast<size_t>(n+1),0);
      for(int consumer=1;consumer<=n;++consumer){int food=0;while(cin>>food&&food!=0){graph[static_cast<size_t>(food)].push_back(consumer);++indegree[static_cast<size_t>(consumer)];}}
      vector<array<int,log_n>> up(static_cast<size_t>(n+1));vector<int> depth(static_cast<size_t>(n+1),0),parent(static_cast<size_t>(n+1),0),candidate(static_cast<size_t>(n+1),-1),order;order.reserve(static_cast<size_t>(n));
      queue<int> ready;for(int v=1;v<=n;++v)if(indegree[static_cast<size_t>(v)]==0){candidate[static_cast<size_t>(v)]=0;ready.push(v);}
      while(!ready.empty()){
          int u=ready.front();ready.pop();parent[static_cast<size_t>(u)]=candidate[static_cast<size_t>(u)];depth[static_cast<size_t>(u)]=depth[static_cast<size_t>(parent[static_cast<size_t>(u)])]+1;up[static_cast<size_t>(u)][0]=parent[static_cast<size_t>(u)];
          for(int bit=1;bit<log_n;++bit)up[static_cast<size_t>(u)][static_cast<size_t>(bit)]=up[static_cast<size_t>(up[static_cast<size_t>(u)][static_cast<size_t>(bit-1)])][static_cast<size_t>(bit-1)];
          order.push_back(u);
          for(int v:graph[static_cast<size_t>(u)]){int& current=candidate[static_cast<size_t>(v)];current=current==-1?u:lca(current,u,depth,up);if(--indegree[static_cast<size_t>(v)]==0)ready.push(v);}
      }
      vector<int> subtree(static_cast<size_t>(n+1),1);
      for(auto it=order.rbegin();it!=order.rend();++it)subtree[static_cast<size_t>(parent[static_cast<size_t>(*it)])]+=subtree[static_cast<size_t>(*it)];
      for(int v=1;v<=n;++v)cout<<subtree[static_cast<size_t>(v)]-1<<'\n';
  }
external_url: https://www.luogu.com.cn/problem/P2597
external_platform: Luogu
external_problem_id: P2597
external_title: '[ZJOI2012] 災難'
external_relation: original
source_book_pages: [610]
source_pdf_pages: [240]
review_status: verified
---

一般 DAG 的「必經前驅」不是任選一棵生成樹能描述；支配樹把所有來源路徑的交集壓成一棵樹。
