---
id: luogu-p4017
volume: lower
source_file: lower-volume
original_label: 洛谷 P4017
title: 最大食物鏈計數
chapter: 10
section: '10.2'
kind: external-oj
difficulty: 2
topics: [dag, topological-sort, path-counting]
prerequisites: [indegree, modular-arithmetic]
statement: >-
  給定無環食物網，每條 A→B 表示 B 捕食 A。最大食物鏈必須從不捕食其他生物的生產者
  出發，終止於不被其他生物捕食的消費者。求這類完整食物鏈數量。
constraints: [1 <= n <= 5000, 1 <= m <= 500000, 輸入保證沒有有向環, 答案對 80112002 取模]
input_format: 第一行 n m；接著 m 行 A B，表示 A 被 B 捕食。
output_format: 輸出最大食物鏈數量 modulo 80112002。
samples:
  - input: "5 7\n1 2\n1 3\n2 3\n3 5\n2 5\n4 5\n3 4\n"
    output: '5'
    explanation: 從唯一生產者 1 出發，沿捕食方向到最終消費者 5，共有五條不同完整路徑。
core_knowledge: [DAG 路徑計數, 多源拓撲動態規劃, 以入度與出度辨認端點]
judgment: 只加總由原始入度零點到原始出度零點的完整路徑，不能把中途鏈段計入。
hints:
  - 生產者是入度為零的點，令它們的路徑數為 1。
  - 依拓撲序沿 A→B 做 ways[B]+=ways[A]。
  - 最後只加總出度為零的點。
solution_outline: Kahn 拓撲排序並做多源路徑計數；保存原始出度，所有入度零點初值為一，最後加總匯點。
proof_or_invariant: >-
  點 v 出隊時，所有前驅已處理；每條到 v 的完整前綴有唯一最後一條邊 u→v，因此各前驅
  ways[u] 相加不漏不重。源點空路徑初值為一，故匯點 ways 恰是完整食物鏈數。
common_errors: [把邊方向反過來, 所有點 ways 都初始化為 1, 加總所有點而非出度零點, 忘記每次加法取模]
complexity: { time: O(n + m), space: O(n + m) }
cpp_skeleton: |
  #include <iostream>
  #include <queue>
  #include <vector>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n=0,m=0;cin>>n>>m;vector<vector<int>> graph(static_cast<size_t>(n+1));vector<int> indegree(static_cast<size_t>(n+1),0),outdegree(static_cast<size_t>(n+1),0);for(int i=0;i<m;++i){int a=0,b=0;cin>>a>>b;graph[static_cast<size_t>(a)].push_back(b);++indegree[static_cast<size_t>(b)];++outdegree[static_cast<size_t>(a)];}/* TODO：拓撲路徑計數。*/}
cpp_solution: |
  #include <iostream>
  #include <queue>
  #include <vector>
  using namespace std;
  int main(){
      ios::sync_with_stdio(false);cin.tie(nullptr);constexpr int mod=80112002;int n=0,m=0;cin>>n>>m;
      vector<vector<int>> graph(static_cast<size_t>(n+1));vector<int> indegree(static_cast<size_t>(n+1),0),outdegree(static_cast<size_t>(n+1),0),ways(static_cast<size_t>(n+1),0);
      for(int i=0;i<m;++i){int a=0,b=0;cin>>a>>b;graph[static_cast<size_t>(a)].push_back(b);++indegree[static_cast<size_t>(b)];++outdegree[static_cast<size_t>(a)];}
      queue<int> ready;for(int v=1;v<=n;++v)if(indegree[static_cast<size_t>(v)]==0){ready.push(v);ways[static_cast<size_t>(v)]=1;}
      while(!ready.empty()){int u=ready.front();ready.pop();for(int v:graph[static_cast<size_t>(u)]){ways[static_cast<size_t>(v)]=(ways[static_cast<size_t>(v)]+ways[static_cast<size_t>(u)])%mod;if(--indegree[static_cast<size_t>(v)]==0)ready.push(v);}}
      int answer=0;for(int v=1;v<=n;++v)if(outdegree[static_cast<size_t>(v)]==0)answer=(answer+ways[static_cast<size_t>(v)])%mod;cout<<answer<<'\n';
  }
external_url: https://www.luogu.com.cn/problem/P4017
external_platform: Luogu
external_problem_id: P4017
external_title: 最大食物鏈計數
external_relation: original
source_book_pages: [610]
source_pdf_pages: [240]
review_status: verified
---

「最大」描述的是從生產者延伸到最終消費者的完整鏈，而不是邊數最長的路徑。
