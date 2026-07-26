---
id: luogu-p1399
volume: lower
source_file: lower-volume
original_label: 洛谷 P1399
title: 洛谷 P1399 快餐店：最小生成樹直徑
chapter: 10
section: '10.6'
kind: external-oj
difficulty: 5
topics: [基環樹, 樹形 DP, 線段樹]
prerequisites: [trees, segment-tree]
core_knowledge: [樹中心半徑, 枚舉斷環, 區間最大二點距離]
judgment: 基環樹的最小離心率等於「刪一條環邊所得樹的最小直徑」除以二。
statement: 連通無向圖有 n 點 n 邊；店可設在點或邊上任意位置，求到最遠建築的最短路距離之最小值。
constraints: ['n <= 100000', '邊長 <= 10^9', '沒有兩條邊連接相同端點']
input_format: 第一行 n；接著 n 行 a、b、length。
output_format: 輸出最優最遠距離，恰保留一位小數。
samples:
  - input: |-
      4
      1 2 1
      1 4 2
      1 3 2
      2 4 1
    output: '2.0'
    explanation: 選在適當道路位置後，到四棟建築的最遠距離可壓到 2。
hints:
  - 剝葉找環，並把每棵掛樹的深度與直徑累積到環點。
  - 刪一條環邊後成樹；樹的最佳連續選址半徑是直徑的一半。
  - 環複製成兩倍序列；每個長度 k 視窗代表一種斷邊，線段樹節點維護 max(depth-prefix)、max(depth+prefix) 與最佳左右配對。
solution_outline: 剝葉 DP 求掛樹資訊；沿環建立倍長序列與前綴距離，使用可合併線段樹查詢每個 k 長視窗的最大跨環路徑，取最小後與掛樹直徑取大，除二輸出。
proof_or_invariant: 任一最短路樹必不使用至少一條環邊；反之刪任意環邊得到合法生成樹，故原圖最優半徑等於這些樹中心半徑最小值。樹半徑為直徑一半；區間合併式完整枚舉左端環點、右端環點及掛樹深度，故每棵候選樹直徑計算正確。
complexity: { time: 'O(n log n)', space: 'O(n)' }
common_errors: [直接取原基環樹直徑的一半, 忽略完全位於掛樹內的直徑, 視窗多含一條被刪環邊]
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){int n;cin>>n;/* TODO：剝葉 DP，倍長環區間查詢最小直徑。 */}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  struct Edge{int to,id;long long weight;};
  struct Node{long long left_value,right_value,best;bool empty;};
  Node merge_node(const Node& left,const Node& right){if(left.empty)return right;if(right.empty)return left;return {max(left.left_value,right.left_value),max(left.right_value,right.right_value),max({left.best,right.best,left.left_value+right.right_value}),false};}
  int main(){
      ios::sync_with_stdio(false);cin.tie(nullptr);
      int n;if(!(cin>>n))return 0;vector<vector<Edge>> graph(static_cast<size_t>(n));vector<int> degree(static_cast<size_t>(n));for(int id=0;id<n;++id){int u,v;long long w;cin>>u>>v>>w;--u;--v;graph[static_cast<size_t>(u)].push_back({v,id,w});graph[static_cast<size_t>(v)].push_back({u,id,w});++degree[static_cast<size_t>(u)];++degree[static_cast<size_t>(v)];}
      vector<long long> depth(static_cast<size_t>(n)),inside(static_cast<size_t>(n));vector<char> removed(static_cast<size_t>(n));queue<int> leaves;for(int i=0;i<n;++i)if(degree[static_cast<size_t>(i)]==1)leaves.push(i);
      while(!leaves.empty()){int u=leaves.front();leaves.pop();removed[static_cast<size_t>(u)]=1;for(const Edge& edge:graph[static_cast<size_t>(u)])if(!removed[static_cast<size_t>(edge.to)]){int v=edge.to;inside[static_cast<size_t>(v)]=max({inside[static_cast<size_t>(v)],inside[static_cast<size_t>(u)],depth[static_cast<size_t>(v)]+depth[static_cast<size_t>(u)]+edge.weight});depth[static_cast<size_t>(v)]=max(depth[static_cast<size_t>(v)],depth[static_cast<size_t>(u)]+edge.weight);if(--degree[static_cast<size_t>(v)]==1)leaves.push(v);}}
      int start=0;while(removed[static_cast<size_t>(start)])++start;vector<int> cycle;vector<long long> edge_length;int current=start,previous_edge=-1;do{cycle.push_back(current);Edge chosen{-1,-1,0};for(const Edge& edge:graph[static_cast<size_t>(current)])if(!removed[static_cast<size_t>(edge.to)]&&edge.id!=previous_edge){chosen=edge;break;}edge_length.push_back(chosen.weight);previous_edge=chosen.id;current=chosen.to;}while(current!=start);
      int size=static_cast<int>(cycle.size()),length=2*size;vector<long long> prefix(static_cast<size_t>(length));for(int i=1;i<length;++i)prefix[static_cast<size_t>(i)]=prefix[static_cast<size_t>(i-1)]+edge_length[static_cast<size_t>((i-1)%size)];
      int base=1;while(base<length)base*=2;Node empty{0,0,0,true};vector<Node> tree(static_cast<size_t>(2*base),empty);for(int i=0;i<length;++i){long long value=depth[static_cast<size_t>(cycle[static_cast<size_t>(i%size)])];tree[static_cast<size_t>(base+i)]={value-prefix[static_cast<size_t>(i)],value+prefix[static_cast<size_t>(i)],0,false};}for(int i=base-1;i>0;--i)tree[static_cast<size_t>(i)]=merge_node(tree[static_cast<size_t>(2*i)],tree[static_cast<size_t>(2*i+1)]);
      auto query=[&](int left,int right){Node result_left=empty,result_right=empty;for(left+=base,right+=base;left<right;left/=2,right/=2){if(left&1)result_left=merge_node(result_left,tree[static_cast<size_t>(left++)]);if(right&1)result_right=merge_node(tree[static_cast<size_t>(--right)],result_right);}return merge_node(result_left,result_right);};
      long long fixed=0;for(int u:cycle)fixed=max(fixed,inside[static_cast<size_t>(u)]);long long best=LLONG_MAX;for(int left=0;left<size;++left)best=min(best,query(left,left+size).best);long long diameter=max(fixed,best);cout<<diameter/2<<(diameter%2?".5\n":".0\n");
  }
external_url: https://www.luogu.com.cn/problem/P1399
external_platform: 洛谷
external_problem_id: P1399
external_title: '[NOI2013] 快餐店'
external_relation: original
source_book_pages: [600, 683]
source_pdf_pages: [230, 313]
review_status: verified
---

允許把店設在邊上，使樹的最小最大距離恰為直徑的一半；難點只在快速找出所有斷環生成樹中的最小直徑。
