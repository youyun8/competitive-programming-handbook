---
id: luogu-p2765
volume: lower
source_file: lower-volume
title: '洛谷 P2765 魔術球：最小路徑覆蓋'
chapter: 10
section: '10.10'
kind: external-oj
difficulty: 5
topics: ['二分圖最大匹配', '最小路徑覆蓋', '增量最大流']
prerequisites: ['max-flow']
statement: '依序放置編號 1,2,... 的球到 n 根柱；同柱相鄰球編號和須為完全平方數。求最多球數並輸出方案。'
constraints: ['4<=n<=55', 'Special Judge']
input_format: '一行柱數 n。'
output_format: '第一行最多球數；接著 n 行各柱由下到上的球號。'
samples:
  - input: |
      4
    output: |
      11
      1 3 6 10
      2 7 9
      4 5 11
      8
    explanation: '這是一個合法的 4 路徑覆蓋；每列相鄰球號和依序為完全平方數。最大球數另以二分圖最大匹配的獨立實作對拍。'
core_knowledge: ['DAG minimum path cover', 'bipartite matching', 'flow reconstruction']
judgment: '較小球只能接較大球，形成 DAG；柱數等於最小路徑覆蓋數。'
hints:
  - '若 i<j 且 i+j 為平方，連 DAG 邊 i->j。'
  - '拆成二分圖後最小路徑覆蓋=N-最大匹配。'
  - '逐球加點與邊；首度覆蓋數超 n 時，前一球即答案，再由匹配重建後繼。'
solution_outline: '增量建立單位容量匹配網路，每加一球繼續 Dinic；以 value-flow 判柱數。從滿流的中間邊建立 next，從無前驅點輸出各鏈。'
proof_or_invariant: 'DAG 的每條柱序列是一條點不重複路徑，反之亦然；經典二分圖定理給出最小路徑覆蓋 N-|matching|。逐 N 首次不可行前的值最大，匹配邊直接串成對應路徑覆蓋。'
common_errors: ['未限制 i<j 造成環', '重算流時丟失殘量調整能力', '輸出匹配方向顛倒', '停止時把不可行新球算入']
complexity: { time: "O(BE sqrt V) \u7684\u589e\u91cf\u5339\u914d\u91cf\u7d1a", space: 'O(B^2)' }
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);/* TODO：依三階段提示完成建模與演算法。 */}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  struct Dinic {
      struct Edge { int to; long long capacity; };
      vector<Edge> edges; vector<vector<int>> graph; vector<int> level; vector<size_t> current;
      explicit Dinic(int n):graph(static_cast<size_t>(n)),level(static_cast<size_t>(n)),current(static_cast<size_t>(n)){}
      int add_edge(int u,int v,long long c){int id=static_cast<int>(edges.size());graph[static_cast<size_t>(u)].push_back(id);edges.push_back({v,c});graph[static_cast<size_t>(v)].push_back(id+1);edges.push_back({u,0});return id;}
      bool bfs(int s,int t){fill(level.begin(),level.end(),-1);queue<int>q;q.push(s);level[static_cast<size_t>(s)]=0;while(!q.empty()){int u=q.front();q.pop();for(int id:graph[static_cast<size_t>(u)]){const auto&e=edges[static_cast<size_t>(id)];if(e.capacity>0&&level[static_cast<size_t>(e.to)]<0){level[static_cast<size_t>(e.to)]=level[static_cast<size_t>(u)]+1;q.push(e.to);}}}return level[static_cast<size_t>(t)]>=0;}
      long long dfs(int u,int t,long long limit){if(u==t)return limit;for(size_t&i=current[static_cast<size_t>(u)];i<graph[static_cast<size_t>(u)].size();++i){int id=graph[static_cast<size_t>(u)][i];auto&e=edges[static_cast<size_t>(id)];if(e.capacity<=0||level[static_cast<size_t>(e.to)]!=level[static_cast<size_t>(u)]+1)continue;long long sent=dfs(e.to,t,min(limit,e.capacity));if(sent){e.capacity-=sent;edges[static_cast<size_t>(id^1)].capacity+=sent;return sent;}}return 0;}
      long long max_flow(int s,int t){long long result=0;while(bfs(s,t)){fill(current.begin(),current.end(),0);while(long long sent=dfs(s,t,LLONG_MAX/4))result+=sent;}return result;}
  };
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int pillars;cin>>pillars;constexpr int maximum=3000,offset=maximum+1,source=2*offset,sink=source+1;Dinic flow(sink+1);vector<tuple<int,int,int>> links;int matching=0,balls=0;for(int value=1;value<=maximum;++value){flow.add_edge(source,value,1);flow.add_edge(offset+value,sink,1);for(int previous=1;previous<value;++previous){int root=static_cast<int>(sqrt(previous+value));if(root*root==previous+value){int id=flow.add_edge(previous,offset+value,1);links.push_back({previous,value,id});}}matching+=static_cast<int>(flow.max_flow(source,sink));if(value-matching>pillars){balls=value-1;break;}}cout<<balls<<'\n';vector<int>next(static_cast<size_t>(balls+1)),previous(static_cast<size_t>(balls+1));for(auto [u,v,id]:links)if(v<=balls&&flow.edges[static_cast<size_t>(id)].capacity==0){next[static_cast<size_t>(u)]=v;previous[static_cast<size_t>(v)]=u;}int lines=0;for(int i=1;i<=balls;++i)if(previous[static_cast<size_t>(i)]==0){for(int u=i;u;u=next[static_cast<size_t>(u)])cout<<u<<(next[static_cast<size_t>(u)]?' ':'\n');++lines;}while(lines++<pillars)cout<<'\n';}
external_url: https://www.luogu.com.cn/problem/P2765
external_platform: 洛谷
external_problem_id: 'P2765'
external_title: '魔術球問題'
external_relation: original
source_book_pages: [663, 675]
source_pdf_pages: [293, 305]
review_status: verified
---

本卡片依官方題面或可信原賽事存檔獨立整理，未以 OCR 猜測題意。
