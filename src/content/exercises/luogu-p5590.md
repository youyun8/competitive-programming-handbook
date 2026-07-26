---
id: luogu-p5590
volume: lower
source_file: lower-volume
original_label: 洛谷 P5590
title: 洛谷 P5590 賽車遊戲：用勢能構造等長路徑
chapter: 10
section: '10.8'
kind: external-oj
difficulty: 5
topics: [差分約束, 可達性, 構造]
prerequisites: [dijkstra, topological-sort]
core_knowledge: [有效子圖, 邊權轉點勢能, 正環判無解]
judgment: 若每條有效邊權設為 potential[v]-potential[u]，任意 1 到 n 路徑都會望遠鏡相消成相同總長。
statement: 給定有向圖，為每條邊指定 1..9 的整數權，使所有從 1 到 n 的路徑長度相同；輸出任一方案，無解輸出 -1。
constraints: [邊權必須是 1..9, 起終點為 1 與 n, 非有效路徑上的邊可任意賦權]
input_format: 第一行 n、m；接著 m 行有向邊 u、v。
output_format: 無解輸出 -1；否則先輸出 n、m，再按輸入順序輸出 u、v、所構造權值。
samples:
  - input: |-
      3 3
      1 2
      2 3
      1 3
    output: |-
      3 3
      1 2 1
      2 3 1
      1 3 2
    explanation: 兩條 1 到 3 路徑長度都為 2。
hints:
  - 只有「從 1 可達且可到 n」的點與兩端皆有效的邊會出現在 1→n 路徑。
  - 對有效邊 u→v 要求 1≤p[v]-p[u]≤9，拆成兩個差分約束。
  - 以最長路鬆弛求勢能；出現正環代表不等式無解，否則邊權取勢能差。
solution_outline: 正反圖 DFS/BFS 標記有效點；若 n 不可達則失敗。對有效邊建立 p[v]≥p[u]+1 與 p[u]≥p[v]-9，SPFA 最大化並判正環；有效邊輸出勢能差，其他邊輸出 1。
proof_or_invariant: 差分約束精確保證有效邊權介於 1、9。任一 1→n 路徑只經有效邊，權和為 Σ(p[v]-p[u])=p[n]-p[1]，因此全等長。反之任何合法權可沿路定義勢能並滿足同一約束，判無解亦為充要。
complexity: { time: 'O(n+m) 平均，SPFA 最壞 O(nm)', space: 'O(n+m)' }
common_errors: [把與 1 到 n 無關的邊也納入約束造成假無解, 只加權值下界未加上界, 輸出勢能值而非兩端勢能差]
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){int n,m;cin>>n>>m;/* TODO：標記有效子圖並解差分約束。 */}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  struct Constraint{int to,weight;};
  int main(){
      ios::sync_with_stdio(false);cin.tie(nullptr);
      int n,m;if(!(cin>>n>>m))return 0;vector<pair<int,int>> edges(static_cast<size_t>(m));vector<vector<int>> graph(static_cast<size_t>(n+1)),reverse_graph(static_cast<size_t>(n+1));for(auto& [u,v]:edges){cin>>u>>v;graph[static_cast<size_t>(u)].push_back(v);reverse_graph[static_cast<size_t>(v)].push_back(u);}
      auto reachable=[&](int source,const vector<vector<int>>& adjacency){vector<char> seen(static_cast<size_t>(n+1));queue<int> queue_nodes;seen[static_cast<size_t>(source)]=1;queue_nodes.push(source);while(!queue_nodes.empty()){int u=queue_nodes.front();queue_nodes.pop();for(int v:adjacency[static_cast<size_t>(u)])if(!seen[static_cast<size_t>(v)]){seen[static_cast<size_t>(v)]=1;queue_nodes.push(v);}}return seen;};
      vector<char> from_start=reachable(1,graph),to_target=reachable(n,reverse_graph);if(!from_start[static_cast<size_t>(n)]){cout<<"-1\n";return 0;}vector<char> useful(static_cast<size_t>(n+1));for(int i=1;i<=n;++i)useful[static_cast<size_t>(i)]=static_cast<char>(from_start[static_cast<size_t>(i)]&&to_target[static_cast<size_t>(i)]);
      vector<vector<Constraint>> constraints(static_cast<size_t>(n+1));for(const auto& [u,v]:edges)if(useful[static_cast<size_t>(u)]&&useful[static_cast<size_t>(v)]){constraints[static_cast<size_t>(u)].push_back({v,1});constraints[static_cast<size_t>(v)].push_back({u,-9});}
      vector<int> potential(static_cast<size_t>(n+1)),count(static_cast<size_t>(n+1));vector<char> in_queue(static_cast<size_t>(n+1),1);queue<int> queue_nodes;for(int i=1;i<=n;++i)queue_nodes.push(i);bool impossible=false;
      while(!queue_nodes.empty()&&!impossible){int u=queue_nodes.front();queue_nodes.pop();in_queue[static_cast<size_t>(u)]=0;for(const Constraint& edge:constraints[static_cast<size_t>(u)])if(potential[static_cast<size_t>(edge.to)]<potential[static_cast<size_t>(u)]+edge.weight){potential[static_cast<size_t>(edge.to)]=potential[static_cast<size_t>(u)]+edge.weight;if(++count[static_cast<size_t>(edge.to)]>n){impossible=true;break;}if(!in_queue[static_cast<size_t>(edge.to)]){in_queue[static_cast<size_t>(edge.to)]=1;queue_nodes.push(edge.to);}}}
      if(impossible){cout<<"-1\n";return 0;}cout<<n<<' '<<m<<'\n';for(const auto& [u,v]:edges){int weight=1;if(useful[static_cast<size_t>(u)]&&useful[static_cast<size_t>(v)])weight=potential[static_cast<size_t>(v)]-potential[static_cast<size_t>(u)];cout<<u<<' '<<v<<' '<<weight<<'\n';}
  }
external_url: https://www.luogu.com.cn/problem/P5590
external_platform: 洛谷
external_problem_id: P5590
external_title: 賽車遊戲
external_relation: original
source_book_pages: [600, 683]
source_pdf_pages: [230, 313]
review_status: verified
---

把邊權表示成兩端勢能差，所有路徑等長會自動成立；真正要解的只剩每條勢能差在 1 到 9。
