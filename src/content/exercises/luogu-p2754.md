---
id: luogu-p2754
volume: lower
source_file: lower-volume
title: '洛谷 P2754 家園：時間展開最大流'
chapter: 10
section: '10.10'
kind: external-oj
difficulty: 5
topics: ['時間展開網路', '增量最大流', '並查集']
prerequisites: ['max-flow']
statement: '太空船按週期停站且容量有限，所有人初始在地球；求把 k 人送到月球的最短時間，無解輸出 0。'
constraints: ['1<=n<=13', '1<=m<=20', '1<=k<=50', '1<=週期長<=n+2']
input_format: 'n、m、k；每艘船給容量、週期長與站點序列（地球 0、月球 -1）。'
output_format: '最短時間；無解 0。'
samples:
  - input: |
      0 1 1
      1 2 0 -1
    output: |
      1
    explanation: '容量一的船在時刻 1 由地球抵達月球。 此例已以窮舉可行路徑、割或配置的獨立小資料程式對拍。'
core_knowledge: ['time-expanded network', 'incremental Dinic', '可達性預判']
judgment: '船在離散時間由前一停靠站移至下一站，時間必須成為圖的一維。'
hints:
  - '先用船週期連通性判斷地球與月球是否可能相通。'
  - '每一時刻複製所有站點，等待邊容量 INF。'
  - '船從 t-1 的舊站向 t 的新站連容量；逐層增量跑最大流。'
solution_outline: '可達性不成立輸出 0；否則逐時刻加等待、船運、地球源與月球匯邊，累加新增流，首度達 k 時輸出時間。'
proof_or_invariant: '時間展開圖中的每條 s-t 流路徑完整描述一人的等待與乘船時序，船邊容量限制同時搭乘數；任何運輸方案亦可映成同值流。逐層首度達 k 即最短時間。'
common_errors: ['船在同一時間層內連邊', '漏等待邊', '每層重建流而丟失先前人員', '無解時無限展開']
complexity: { time: "O(TV^2E)\uff0cT \u70ba\u7b54\u6848", space: 'O(T(n+m))' }
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
  struct Dsu{vector<int>p;explicit Dsu(int n):p(static_cast<size_t>(n)){iota(p.begin(),p.end(),0);}int find(int x){return p[static_cast<size_t>(x)]==x?x:p[static_cast<size_t>(x)]=find(p[static_cast<size_t>(x)]);}void unite(int x,int y){x=find(x);y=find(y);p[static_cast<size_t>(x)]=y;}};
  struct Ship{int capacity;vector<int> stop;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int stations,m,people;cin>>stations>>m>>people;vector<Ship>ship(static_cast<size_t>(m));Dsu connectivity(stations+2);auto normalize=[&](int x){return x==-1?stations+1:x;};for(auto&value:ship){int count;cin>>value.capacity>>count;value.stop.resize(static_cast<size_t>(count));for(int&i:value.stop){cin>>i;i=normalize(i);}for(int i=0;i<count;++i)connectivity.unite(value.stop[static_cast<size_t>(i)],value.stop[static_cast<size_t>((i+1)%count)]);}if(connectivity.find(0)!=connectivity.find(stations+1)){cout<<0<<'\n';return 0;}int width=stations+2,max_time=1000,source=(max_time+1)*width,sink=source+1;Dinic flow(sink+1);constexpr long long inf=1000000;auto node=[&](int time,int place){return time*width+place;};flow.add_edge(source,node(0,0),inf);flow.add_edge(node(0,stations+1),sink,inf);long long moved=flow.max_flow(source,sink);for(int time=1;time<=max_time;++time){for(int place=0;place<width;++place)flow.add_edge(node(time-1,place),node(time,place),inf);flow.add_edge(source,node(time,0),inf);flow.add_edge(node(time,stations+1),sink,inf);for(const auto&value:ship){int count=static_cast<int>(value.stop.size());int from=value.stop[static_cast<size_t>((time-1)%count)],to=value.stop[static_cast<size_t>(time%count)];flow.add_edge(node(time-1,from),node(time,to),value.capacity);}moved+=flow.max_flow(source,sink);if(moved>=people){cout<<time<<'\n';return 0;}}cout<<0<<'\n';}
external_url: https://www.luogu.com.cn/problem/P2754
external_platform: 洛谷
external_problem_id: 'P2754'
external_title: '[CTSC1999] 家園 / 星際轉移問題'
external_relation: original
source_book_pages: [663, 675]
source_pdf_pages: [293, 305]
review_status: verified
---

本卡片依官方題面或可信原賽事存檔獨立整理，未以 OCR 猜測題意。
