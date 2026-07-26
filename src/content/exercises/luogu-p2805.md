---
id: luogu-p2805
volume: lower
source_file: lower-volume
title: '洛谷 P2805 植物大戰殭屍：拓撲刪環與最大權閉合子圖'
chapter: 10
section: '10.10'
kind: external-oj
difficulty: 5
topics: ['最大權閉合子圖', '最小割', '拓撲排序']
prerequisites: ['max-flow']
statement: '殭屍由每列右側進攻；植物會保護若干位置，吃掉植物可得正或負能源。選擇可合法吃掉的植物使總能源最大。'
constraints: ['1 <= n <= 20', '1 <= m <= 30', '-10000 <= score <= 10000', '攻擊座標為 0-based']
input_format: 'n、m；依列優先給每株植物的能源、攻擊位置數與各座標。'
output_format: '最大可獲能源。'
samples:
  - input: |
      1 1
      5 0
    output: |
      5
    explanation: '唯一植物無保護依賴且收益為 5，應吃掉。 此例已以窮舉可行路徑、割或配置的獨立小資料程式對拍。'
core_knowledge: ['dependency DAG', 'cycle elimination', 'maximum weight closure']
judgment: '吃某植物必須先吃保護它的植物及同列右側植物，形成閉合依賴；環及受環保護者永遠不可吃。'
hints:
  - '建「保護者 -> 被保護者」及「右 -> 左」的拓撲圖，Kahn 未取出的點排除。'
  - '在可用點上反轉為選擇依賴：選被保護者必選保護者。'
  - '正權由源連入、負權連匯，依賴邊容量 INF；答案為正權和減最小割。'
solution_outline: '先拓撲標出能依合法次序清除的點；再對其建立最大權閉合子圖網路並跑 Dinic。'
proof_or_invariant: 'Kahn 取出次序給出合法攻擊順序；未取出的環或其後繼無法被清除。有效點集中，任一攻擊集合必對依賴封閉，反之閉合集可按拓撲序實現。最大權閉合子圖定理以最小割精確求最大收益。'
common_errors: ['直接在含環圖上做閉合子圖', '位置依賴方向顛倒', '把同列左植物當右植物前置條件', 'INF 小於總正權']
complexity: { time: 'O(nm+E+V^2E)', space: 'O(V+E)' }
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
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int rows,columns;cin>>rows>>columns;int count=rows*columns;vector<int>score(static_cast<size_t>(count));vector<vector<int>>topo(static_cast<size_t>(count));vector<int>indegree(static_cast<size_t>(count));auto id=[&](int r,int c){return r*columns+c;};for(int r=0;r<rows;++r)for(int c=0;c<columns;++c){int attacks;int u=id(r,c);cin>>score[static_cast<size_t>(u)]>>attacks;while(attacks--){int x,y;cin>>x>>y;int v=id(x,y);topo[static_cast<size_t>(u)].push_back(v);++indegree[static_cast<size_t>(v)];}}for(int r=0;r<rows;++r)for(int c=1;c<columns;++c){int right=id(r,c),left=id(r,c-1);topo[static_cast<size_t>(right)].push_back(left);++indegree[static_cast<size_t>(left)];}queue<int>pending;vector<char>valid(static_cast<size_t>(count));for(int i=0;i<count;++i)if(indegree[static_cast<size_t>(i)]==0)pending.push(i);while(!pending.empty()){int u=pending.front();pending.pop();valid[static_cast<size_t>(u)]=1;for(int v:topo[static_cast<size_t>(u)])if(--indegree[static_cast<size_t>(v)]==0)pending.push(v);}int source=count,sink=count+1;Dinic flow(sink+1);constexpr long long inf=1000000000;long long positive=0;for(int u=0;u<count;++u)if(valid[static_cast<size_t>(u)]){if(score[static_cast<size_t>(u)]>0){flow.add_edge(source,u,score[static_cast<size_t>(u)]);positive+=score[static_cast<size_t>(u)];}else flow.add_edge(u,sink,-static_cast<long long>(score[static_cast<size_t>(u)]));for(int v:topo[static_cast<size_t>(u)])if(valid[static_cast<size_t>(v)])flow.add_edge(v,u,inf);}cout<<positive-flow.max_flow(source,sink)<<'\n';}
external_url: https://www.luogu.com.cn/problem/P2805
external_platform: 洛谷
external_problem_id: 'P2805'
external_title: '[NOI2009] 植物大戰殭屍'
external_relation: original
source_book_pages: [663, 675]
source_pdf_pages: [293, 305]
review_status: verified
---

本卡片依官方題面或可信原賽事存檔獨立整理，未以 OCR 猜測題意。
