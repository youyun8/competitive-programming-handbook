---
id: luogu-p3243
volume: lower
source_file: lower-volume
original_label: 洛谷 P3243
title: 菜餚製作：反向拓撲的最優序
chapter: 10
section: '10.2'
kind: external-oj
difficulty: 3
topics: [topological-sort, priority-queue, greedy]
prerequisites: [directed-acyclic-graph]
statement: >-
  有 n 道菜，編號越小代表預估品質越高；m 條限制 x→y 要求 x 先做。請在滿足限制下，
  依序讓 1 號的位置儘量早，再讓 2 號儘量早，依此類推。若限制矛盾則回報無解。
constraints: [1 <= n, m <= 100000, 1 <= t <= 3, 限制可能重複, 時間限制 1 秒]
input_format: 第一行為資料組數 t；每組先給 n m，再給 m 行 x y。
output_format: 每組輸出一行最優排列；有環則輸出 Impossible!。
samples:
  - input: "3\n5 4\n5 4\n5 3\n4 2\n3 2\n3 3\n1 2\n2 3\n3 1\n5 2\n5 2\n4 3\n"
    output: "1 5 3 4 2\nImpossible!\n1 5 2 4 3"
    explanation: 第二組形成 1→2→3→1；其餘兩組以題目定義的逐編號優先規則得到所列順序。
core_knowledge: [反圖上的 Kahn 演算法, 最大堆, 反向貪心]
judgment: 目標不是一般的字典序最小拓撲序；例如前置工作可能必須先插入，需最佳化每個小編號的位置。
hints:
  - 從排列尾端決定元素，限制 x→y 會變成先放置 y。
  - 尾端應優先放目前可放的最大編號，替小編號保留更前的位置。
  - 在反圖以最大堆做拓撲排序，最後反轉；取不滿 n 個表示有環。
solution_outline: 將每條 x→y 反向成 y→x，記原圖出度為反圖入度；最大堆反覆取零入度最大點，所得序列反轉即答案。
proof_or_invariant: >-
  考慮尚未決定的最右位置，其候選必是原圖匯點。若候選 a<b 卻放 a，改放 b 不會破壞限制，
  且為較小的 a 保留更靠前的位置，對目標不劣；故應選最大候選。逐位置交換論證得到貪心最優。
  Kahn 未取完全部點恰等價於存在環。
common_errors: [直接用最小堆做正向拓撲, 忘記反轉結果, 重複限制造成的入度未一致處理, 無解字串大小寫或驚嘆號錯誤]
complexity: { time: O((n + m) log n), space: O(n + m) }
cpp_skeleton: |
  #include <iostream>
  #include <queue>
  #include <vector>
  using namespace std;
  int main(){
      ios::sync_with_stdio(false);cin.tie(nullptr);
      int cases=0;cin>>cases;
      while(cases--){int n=0,m=0;cin>>n>>m;vector<vector<int>> reverse_graph(static_cast<size_t>(n+1));vector<int> degree(static_cast<size_t>(n+1),0);
          for(int i=0;i<m;++i){int x=0,y=0;cin>>x>>y;reverse_graph[static_cast<size_t>(y)].push_back(x);++degree[static_cast<size_t>(x)];}
          // TODO：最大堆反向拓撲，反轉後輸出，並判斷環。
      }
  }
cpp_solution: |
  #include <algorithm>
  #include <iostream>
  #include <queue>
  #include <vector>
  using namespace std;
  int main(){
      ios::sync_with_stdio(false);cin.tie(nullptr);
      int cases=0;cin>>cases;
      while(cases--){
          int n=0,m=0;cin>>n>>m;vector<vector<int>> reverse_graph(static_cast<size_t>(n+1));vector<int> degree(static_cast<size_t>(n+1),0);
          for(int i=0;i<m;++i){int x=0,y=0;cin>>x>>y;reverse_graph[static_cast<size_t>(y)].push_back(x);++degree[static_cast<size_t>(x)];}
          priority_queue<int> ready;for(int v=1;v<=n;++v)if(degree[static_cast<size_t>(v)]==0)ready.push(v);
          vector<int> order;order.reserve(static_cast<size_t>(n));
          while(!ready.empty()){int u=ready.top();ready.pop();order.push_back(u);for(int v:reverse_graph[static_cast<size_t>(u)])if(--degree[static_cast<size_t>(v)]==0)ready.push(v);}
          if(static_cast<int>(order.size())!=n){cout<<"Impossible!\n";continue;}
          reverse(order.begin(),order.end());
          for(int i=0;i<n;++i)cout<<order[static_cast<size_t>(i)]<<(i+1==n?'\n':' ');
      }
  }
external_url: https://www.luogu.com.cn/problem/P3243
external_platform: Luogu
external_problem_id: P3243
external_title: '[HNOI2015] 菜餚製作'
external_relation: original
source_book_pages: [610]
source_pdf_pages: [240]
review_status: verified
---

從左端貪心會誤判「為了讓某小編號儘早，哪些前置菜必須先插入」；從右端看，選擇變得局部而明確。
