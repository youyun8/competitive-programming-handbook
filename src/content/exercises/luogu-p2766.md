---
id: luogu-p2766
volume: lower
source_file: lower-volume
title: '洛谷 P2766 最長不下降子序列：DP 與最大流'
chapter: 10
section: '10.10'
kind: external-oj
difficulty: 5
topics: ['LNDS', '拆點', '最大流']
prerequisites: ['max-flow']
statement: '求最長不下降子序列長度、元素不可重用時最多可取幾條，以及允許首尾元素重用時的最大條數。'
constraints: ['1 <= n <= 500', '序列元素為正整數']
input_format: 'n；下一行 n 個數。'
output_format: '三行依序輸出長度、不可重用條數、首尾可重用條數。'
samples:
  - input: |
      4
      3 6 2 5
    output: |
      2
      2
      3
    explanation: '官方範例可取 (3,6)、(2,5)；重用首尾後可達三條。 此例已以窮舉可行路徑、割或配置的獨立小資料程式對拍。'
core_knowledge: ['O(n²) DP', '分層 DAG', '點容量最大流']
judgment: '每個元素只能屬於一條序列是點容量限制；合法 DP 轉移形成分層 DAG。'
hints:
  - '先求以 i 結尾的 LNDS 長度 f[i]。'
  - 'i 拆點容量 1；f=1 接源，f=L 接匯，合法且 f+1 的轉移連邊。'
  - '第三問把第 1、n 個元素相關的點容量與端點邊改 INF。'
solution_outline: 'DP 求 L；按層建拆點網路跑兩次最大流，第二次允許首尾重用；L=1 時第三問按題意為 n。'
proof_or_invariant: '每條 s-t 單位流依 f 層嚴格遞增，對應一條長 L 的不下降子序列；點容量保證不同流不共用元素。任何互斥序列集也可轉成等值流，故最大流即最大條數。'
common_errors: ['把不下降寫成嚴格上升', '轉移未要求 f[j]=f[i]+1', '第三問只改拆點邊而漏源匯邊', 'L=1 未特判']
complexity: { time: 'O(n^3)', space: 'O(n^2)' }
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
  static long long solve_flow(const vector<int>&a,const vector<int>&length,int longest,bool reusable){int n=static_cast<int>(a.size())-1,source=2*n+1,sink=source+1;Dinic flow(sink+1);constexpr long long inf=1000000;for(int i=1;i<=n;++i){long long cap=(reusable&&(i==1||i==n))?inf:1;flow.add_edge(i,i+n,cap);if(length[static_cast<size_t>(i)]==1)flow.add_edge(source,i,(reusable&&i==1)?inf:1);if(length[static_cast<size_t>(i)]==longest)flow.add_edge(i+n,sink,(reusable&&i==n)?inf:1);}for(int i=1;i<=n;++i)for(int j=i+1;j<=n;++j)if(a[static_cast<size_t>(i)]<=a[static_cast<size_t>(j)]&&length[static_cast<size_t>(j)]==length[static_cast<size_t>(i)]+1)flow.add_edge(i+n,j,1);return flow.max_flow(source,sink);}
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;cin>>n;vector<int>a(static_cast<size_t>(n+1)),length(static_cast<size_t>(n+1),1);int longest=0;for(int i=1;i<=n;++i){cin>>a[static_cast<size_t>(i)];for(int j=1;j<i;++j)if(a[static_cast<size_t>(j)]<=a[static_cast<size_t>(i)])length[static_cast<size_t>(i)]=max(length[static_cast<size_t>(i)],length[static_cast<size_t>(j)]+1);longest=max(longest,length[static_cast<size_t>(i)]);}cout<<longest<<'\n'<<solve_flow(a,length,longest,false)<<'\n';if(longest==1)cout<<n<<'\n';else cout<<solve_flow(a,length,longest,true)<<'\n';}
external_url: https://www.luogu.com.cn/problem/P2766
external_platform: 洛谷
external_problem_id: 'P2766'
external_title: '最長不下降子序列問題'
external_relation: original
source_book_pages: [663, 675]
source_pdf_pages: [293, 305]
review_status: verified
---

本卡片依官方題面或可信原賽事存檔獨立整理，未以 OCR 猜測題意。
