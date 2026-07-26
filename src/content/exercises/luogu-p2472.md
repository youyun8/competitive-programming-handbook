---
id: luogu-p2472
volume: lower
source_file: lower-volume
title: '洛谷 P2472 蜥蜴：點容量最大流'
chapter: 10
section: '10.10'
kind: external-oj
difficulty: 4
topics: ['最大流', '拆點', '幾何建圖']
prerequisites: ['max-flow']
statement: '網格石柱有高度（可被離開的次數），蜥蜴可跳至歐氏距離不超過 d 的石柱或界外；求最少無法逃出的蜥蜴數。'
constraints: ['1<=r,c<=20', '1<=d<=4', '柱高 0..3']
input_format: 'r、c、d；r 行柱高數字；r 行蜥蜴位置。'
output_format: '最少未逃出數。'
samples:
  - input: |
      1 1 1
      1
      L
    output: |
      0
    explanation: '唯一蜥蜴可一步跳出地圖。 此例已以窮舉可行路徑、割或配置的獨立小資料程式對拍。'
core_knowledge: ['點容量拆點', '源匯建模', 'Dinic']
judgment: '每根柱的可離開次數是點容量，逃出蜥蜴數可最大化。'
hints:
  - '每根非零柱拆成 in、out，容量為高度。'
  - '源點向每隻蜥蜴所在 in 連 1；可互跳則 out 向 in 連 INF。'
  - '能直接跳出邊界的 out 向匯點連 INF。'
solution_outline: '依距離建殘量網路，最大流為最多逃出數，答案為蜥蜴總數減最大流。'
proof_or_invariant: '每單位整數流對應一隻蜥蜴的跳躍路徑；柱 in-out 容量恰限制總離開次數。反之任何合法逃生方案可逐隻轉成流，故最大流與最多逃出數相等。'
common_errors: ['曼哈頓距離代替平方歐氏距離', '漏拆點', '邊界判斷使用 <=d 而不是距界外步數 <=d']
complexity: { time: "O(V^2E)\uff0c\u672c\u984c V<=802", space: 'O(V+E)' }
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
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int rows,columns,jump;if(!(cin>>rows>>columns>>jump))return 0;vector<string>height(static_cast<size_t>(rows)),lizard(static_cast<size_t>(rows));for(auto&row:height)cin>>row;for(auto&row:lizard)cin>>row;int cells=rows*columns,source=2*cells,sink=source+1;Dinic flow(sink+1);constexpr long long inf=1000000;int total=0;auto id=[&](int r,int c){return r*columns+c;};for(int r=0;r<rows;++r)for(int c=0;c<columns;++c)if(height[static_cast<size_t>(r)][static_cast<size_t>(c)]!='0'){int u=id(r,c);flow.add_edge(u,u+cells,height[static_cast<size_t>(r)][static_cast<size_t>(c)]-'0');if(lizard[static_cast<size_t>(r)][static_cast<size_t>(c)]=='L'){flow.add_edge(source,u,1);++total;}if(r<jump||c<jump||rows-1-r<jump||columns-1-c<jump)flow.add_edge(u+cells,sink,inf);for(int nr=0;nr<rows;++nr)for(int nc=0;nc<columns;++nc)if(height[static_cast<size_t>(nr)][static_cast<size_t>(nc)]!='0'&&(r-nr)*(r-nr)+(c-nc)*(c-nc)<=jump*jump)flow.add_edge(u+cells,id(nr,nc),inf);}cout<<total-flow.max_flow(source,sink)<<'\n';}
external_url: https://www.luogu.com.cn/problem/P2472
external_platform: 洛谷
external_problem_id: 'P2472'
external_title: '[SCOI2007] 蜥蜴'
external_relation: original
source_book_pages: [663, 675]
source_pdf_pages: [293, 305]
review_status: verified
---

本卡片依官方題面或可信原賽事存檔獨立整理，未以 OCR 猜測題意。
