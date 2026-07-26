---
id: openj-bailian-3187
volume: lower
source_file: lower-volume
title: '百練 3187 ACM Computer Factory：機器拆點與流量方案'
chapter: 10
section: '10.10'
kind: external-oj
difficulty: 4
topics: ['最大流', '拆點', '方案輸出']
prerequisites: ['max-flow']
statement: '每台機器有加工能力、零件輸入條件（0/1/任意）與輸出狀態。求工廠最大完整電腦產能，並輸出機器間非零運送連線。'
constraints: ['1<=零件數<=10', '1<=機器數<=50', '1<=機器能力<=10000', 'Special Judge']
input_format: 'P、N；每台機器給能力、P 個輸入條件、P 個輸出狀態。'
output_format: '首行最大產能與使用連線數；其後每行機器 A、B 與流量。'
samples:
  - input: |
      1 1
      5 0 1
    output: |
      5 0
    explanation: '唯一機器可從空白半成品直接產出完整產品，每小時 5 台且不需機器間連線。 此例已以窮舉可行路徑、割或配置的獨立小資料程式對拍。'
core_knowledge: ['machine vertex capacity', 'compatibility edges', 'flow reconstruction']
judgment: '加工能力限制節點吞吐量，需拆點；狀態相容才可接續加工。'
hints:
  - '機器 in->out 容量為其性能。'
  - '可接受全空狀態者接源，輸出全 1 者接匯。'
  - '若 i 輸出逐零件符合 j 的 0/1/2 輸入條件，i_out->j_in 連 INF；從反向殘量讀實際流。'
solution_outline: '按相容關係建立拆點網路跑 Dinic，掃描機器間原邊，反向殘量大於零者輸出。'
proof_or_invariant: '每單位流是一台半成品依序通過機器的生產路線；拆點容量限制各機器總產能，相容邊保證狀態可加工。反之任何生產排程按路線分解成流，故最大流等於最大產能。'
common_errors: ['輸入條件 2 當作必須有零件', '未拆機器點', '把源判定寫成輸入全為 0 而排除 2', '輸出殘量而非已用流量']
complexity: { time: "O(N^4P) \u4e0a\u754c\uff0cN<=50", space: 'O(N^2+NP)' }
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
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int parts,n;if(!(cin>>parts>>n))return 0;vector<int>capacity(static_cast<size_t>(n));vector<vector<int>>input(static_cast<size_t>(n),vector<int>(static_cast<size_t>(parts))),output=input;for(int i=0;i<n;++i){cin>>capacity[static_cast<size_t>(i)];for(int&x:input[static_cast<size_t>(i)])cin>>x;for(int&x:output[static_cast<size_t>(i)])cin>>x;}int source=2*n,sink=source+1;Dinic flow(sink+1);constexpr long long inf=1000000000;for(int i=0;i<n;++i){flow.add_edge(i,i+n,capacity[static_cast<size_t>(i)]);bool accepts_empty=true,complete=true;for(int p=0;p<parts;++p){accepts_empty&=input[static_cast<size_t>(i)][static_cast<size_t>(p)]!=1;complete&=output[static_cast<size_t>(i)][static_cast<size_t>(p)]==1;}if(accepts_empty)flow.add_edge(source,i,inf);if(complete)flow.add_edge(i+n,sink,inf);}vector<tuple<int,int,int>>connection;for(int i=0;i<n;++i)for(int j=0;j<n;++j)if(i!=j){bool compatible=true;for(int p=0;p<parts;++p){int need=input[static_cast<size_t>(j)][static_cast<size_t>(p)];compatible&=need==2||need==output[static_cast<size_t>(i)][static_cast<size_t>(p)];}if(compatible){int id=flow.add_edge(i+n,j,inf);connection.push_back({i,j,id});}}long long answer=flow.max_flow(source,sink);vector<tuple<int,int,long long>>used;for(auto [i,j,id]:connection){long long amount=flow.edges[static_cast<size_t>(id^1)].capacity;if(amount>0)used.push_back({i+1,j+1,amount});}cout<<answer<<' '<<used.size()<<'\n';for(auto [i,j,amount]:used)cout<<i<<' '<<j<<' '<<amount<<'\n';}
external_url: http://bailian.openjudge.cn/practice/3187/
external_platform: OpenJudge 百練
external_problem_id: '3187'
external_title: 'ACM Computer Factory'
external_relation: original
source_book_pages: [663, 675]
source_pdf_pages: [293, 305]
review_status: verified
---

本卡片依官方題面或可信原賽事存檔獨立整理，未以 OCR 猜測題意。
