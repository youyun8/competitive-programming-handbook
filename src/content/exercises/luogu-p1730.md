---
id: luogu-p1730
volume: lower
source_file: lower-volume
original_label: 洛谷 P1730
title: 洛谷 P1730 最小密度路徑：固定邊數動態規劃
chapter: 10
section: '10.8'
kind: external-oj
difficulty: 4
topics: [最短路徑, 動態規劃, DAG]
prerequisites: [dijkstra, dynamic-programming]
core_knowledge: [路徑平均邊權, 固定邊數最小權和, min-plus 轉移]
judgment: 先固定路徑邊數 k，最小化總權；該 k 的最佳密度就是最小總權除以 k。
statement: 加權有向無環圖有多次詢問；每問求兩點間「邊權和除以邊數」最小的路徑密度。
constraints: ['n <= 50', '圖為 DAG', '可能有重邊']
input_format: 第一行 n、m；接著 m 行 a、b、w；再給詢問數 q 與 q 組 x、y。
output_format: 每問輸出最小密度並保留三位小數；不可達輸出 OMG!。
samples:
  - input: |-
      3 3
      1 3 5
      2 1 6
      2 3 6
      2
      1 3
      2 3
    output: |-
      5.000
      5.500
    explanation: 2 到 3 可直接走密度 6，或走 2→1→3，總權 11、兩條邊，密度 5.5。
hints:
  - f[k][i][j] 表示恰走 k 條邊由 i 到 j 的最小總權。
  - 基底 f[1] 是直接邊；轉移枚舉倒數第二點 p：f[k-1][i][p]+edge[p][j]。
  - DAG 的簡單路至多 n-1 條邊，詢問時枚舉 k 並取 f[k][x][y]/k 最小值。
solution_outline: 保留重邊最小權，依邊數 1..n-1 做 min-plus 動態規劃；每次詢問掃描所有可達邊數並取最小平均。
proof_or_invariant: 任一 k 邊路徑去掉最後一邊後是 k-1 邊路徑，轉移枚舉其倒數第二點，故歸納得到固定 k 的最小總權。密度最優路必有某個 k，對全部可能 k 取最小即正確。
complexity: { time: 'O(n^4+qn)', space: 'O(n^3)' }
common_errors: [重邊直接覆蓋而未取最小, 把總權最短路誤當密度最小路, 不可達狀態參與加法造成溢位]
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){int n,m;cin>>n>>m;/* TODO：按恰好邊數預處理最小權和。 */}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){
      ios::sync_with_stdio(false);cin.tie(nullptr);
      int n,m;if(!(cin>>n>>m))return 0;const long long inf=LLONG_MAX/4;vector<vector<long long>> edge(static_cast<size_t>(n),vector<long long>(static_cast<size_t>(n),inf));for(int i=0;i<m;++i){int u,v;long long w;cin>>u>>v>>w;--u;--v;edge[static_cast<size_t>(u)][static_cast<size_t>(v)]=min(edge[static_cast<size_t>(u)][static_cast<size_t>(v)],w);}
      vector<vector<vector<long long>>> best(static_cast<size_t>(n),vector<vector<long long>>(static_cast<size_t>(n),vector<long long>(static_cast<size_t>(n),inf)));best[1]=edge;
      for(int length=2;length<n;++length)for(int from=0;from<n;++from)for(int middle=0;middle<n;++middle)if(best[static_cast<size_t>(length-1)][static_cast<size_t>(from)][static_cast<size_t>(middle)]<inf)for(int to=0;to<n;++to)if(edge[static_cast<size_t>(middle)][static_cast<size_t>(to)]<inf)best[static_cast<size_t>(length)][static_cast<size_t>(from)][static_cast<size_t>(to)]=min(best[static_cast<size_t>(length)][static_cast<size_t>(from)][static_cast<size_t>(to)],best[static_cast<size_t>(length-1)][static_cast<size_t>(from)][static_cast<size_t>(middle)]+edge[static_cast<size_t>(middle)][static_cast<size_t>(to)]);
      int queries;cin>>queries;cout<<fixed<<setprecision(3);while(queries-->0){int from,to;cin>>from>>to;--from;--to;double answer=numeric_limits<double>::infinity();for(int length=1;length<n;++length){long long value=best[static_cast<size_t>(length)][static_cast<size_t>(from)][static_cast<size_t>(to)];if(value<inf)answer=min(answer,static_cast<double>(value)/length);}if(isinf(answer))cout<<"OMG!\n";else cout<<answer<<'\n';}
  }
external_url: https://www.luogu.com.cn/problem/P1730
external_platform: 洛谷
external_problem_id: P1730
external_title: 最小密度路徑
external_relation: original
source_book_pages: [600, 683]
source_pdf_pages: [230, 313]
review_status: verified
---

「最小平均」不具普通最短路的可加性；固定邊數後分母成常數，便恢復可加的動態規劃。
