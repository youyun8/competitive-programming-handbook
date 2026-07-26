---
id: luogu-p4618
volume: upper
source_file: upper-volume
source_book_pages: [179, 196]
source_pdf_pages: [197, 214]
chapter: 4
section: '4.4'
kind: external-oj
review_status: verified
external_relation: original
title: 洛谷 P4618 原題識別：樹路徑不同顏色與期望
difficulty: 5
topics: [離線二維計數, 樹上顏色, 隨機資料分析]
prerequisites: [dfs-order, fenwick-tree, inclusion-exclusion]
statement: 生成一棵有根樹及每點顏色。詢問一可求 x-y 路徑不同顏色數；詢問二從根到 A、根到 B 的路徑各均勻選一點 x、y，輸出不同顏色數期望乘兩條根路徑節點數的乘積。
constraints:
  - '1 <= T <= 3，2 <= p <= n <= 100000，1 <= m <= 200000'
  - '10000 <= SA,SB,SC <= 1000000'
  - 樹與顏色必須完全依官方 rng61 呼叫順序生成
input_format: 第一行 T；每組給 n、p、SA、SB、SC，生成樹與顏色後讀 m，再讀 m 行 type、x、y。
output_format: 每個詢問輸出一行整數；第二類輸出已乘分母的期望分子。
samples:
  - input: |
      2
      5 3 10000 12345 54321
      3
      1 2 3
      2 1 3
      1 3 2
      10 6 23456 77777 55555
      5
      1 1 10
      2 3 5
      2 7 5
      2 5 4
      1 8 6
    output: |
      1
      5
      1
      4
      34
      61
      45
      3
    explanation: 第一組三個詢問輸出前三行；第二類輸出的是所有祖先端點配對之不同顏色數總和，而非除法後的小數期望。
core_knowledge: [顏色貢獻拆分, Euler 子樹矩形, 二維離線掃描]
judgment: 把答案按顏色拆開；某顏色是否出現在端點路徑可表示成 Euler 座標矩形聯集，所有詢問遂能離線成二維點／矩形加總。
hints:
  - 對固定顏色，刪去該色節點後，端點對路徑不含此色當且僅當兩點位於同一個剩餘連通塊。
  - DFS 進出時間把每個子樹變成區間；以容斥將「路徑含此色」寫成少量二維矩形，依顏色出現位置壓縮邊界。
  - 第一類是單一 Euler 點對；第二類是兩條祖先鏈的笛卡兒積。用掃描線與四個 BIT 取得帶祖先前綴權重的矩形和。
solution_outline: 生成資料並做進出 Euler 序。逐顏色建立其「路徑包含此色」矩形事件；把兩類詢問轉為點或祖先前綴矩形。掃描第一維，以四棵 BIT 維護雙線性差分並回答。
proof_or_invariant: 每個顏色的矩形恰覆蓋路徑包含該色的端點對，故所有顏色指示量相加等於不同顏色數。第二類對所有祖先端點對求和，正是題目要求的期望乘分母。
complexity:
  time: 依官方隨機資料期望 O((n+m)log n)
  space: O(n+m+events)
common_errors:
  - rng61 呼叫順序或 unsigned 位元運算與官方不同
  - 第二類輸出做除法，或漏算根與端點
  - 同色多節點的子樹矩形直接相加而未做容斥
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  static unsigned int seed_a,seed_b,seed_c;
  static unsigned int rng61(){seed_a^=seed_a<<16;seed_a^=seed_a>>5;seed_a^=seed_a<<1;unsigned int temporary=seed_a;seed_a=seed_b;seed_b=seed_c;seed_c^=temporary^seed_a;return seed_c;}
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int tests;cin>>tests;while(tests--){int n,p;cin>>n>>p>>seed_a>>seed_b>>seed_c;vector<int>parent(static_cast<size_t>(n+1)),color(static_cast<size_t>(n+1));for(int i=2;i<=p;++i)parent[static_cast<size_t>(i)]=i-1;for(int i=p+1;i<=n;++i)parent[static_cast<size_t>(i)]=static_cast<int>(rng61()%static_cast<unsigned int>(i-1))+1;for(int i=1;i<=n;++i)color[static_cast<size_t>(i)]=static_cast<int>(rng61()%static_cast<unsigned int>(n))+1;int m;cin>>m;while(m--){int type,x,y;cin>>type>>x>>y;cout<<0<<'\n';}/* TODO：將顏色貢獻離線成 Euler 二維矩形。 */}}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  using int64=long long;
  static const int kNodeLimit=100005,kBoundaryLimit=1010,kEventLimit=5500005;
  static unsigned int seed_a,seed_b,seed_c;
  static int n,chain_length,euler_limit,current_x,edge_count,event_count;
  static int color[kNodeLimit],first_child[kNodeLimit],next_sibling[kNodeLimit],enter_time[kNodeLimit],leave_time[kNodeLimit],depth_prefix[kNodeLimit*2],order_node[kNodeLimit];
  static int boundary[kBoundaryLimit],boundary_count,grid[kBoundaryLimit][kBoundaryLimit],add_event_head[kNodeLimit*2],query_event_head[kNodeLimit*2],event_left[kEventLimit],event_right[kEventLimit],event_value[kEventLimit],event_next[kEventLimit];
  static int64 answer[kNodeLimit*2],bit_0[kNodeLimit*2],bit_x[kNodeLimit*2],bit_y[kNodeLimit*2],bit_xy[kNodeLimit*2];
  static unsigned int rng61(){seed_a^=seed_a<<16;seed_a^=seed_a>>5;seed_a^=seed_a<<1;unsigned int temporary=seed_a;seed_a=seed_b;seed_b=seed_c;seed_c^=temporary^seed_a;return seed_c;}
  static void add_child(int parent,int child){next_sibling[child]=first_child[parent];first_child[parent]=child;}
  static void append_event(int&head,int left,int right,int value){++event_count;event_left[event_count]=left;event_right[event_count]=right;event_value[event_count]=value;event_next[event_count]=head;head=event_count;}
  static void dfs(int node){euler_limit=enter_time[node]=++edge_count;depth_prefix[edge_count]=1;for(int child=first_child[node];child!=0;child=next_sibling[child])dfs(child);leave_time[node]=++edge_count;depth_prefix[edge_count]=-1;}
  static bool color_less(int left,int right){return color[left]<color[right];}
  static void prepare_grid(){sort(boundary+1,boundary+boundary_count+1);int unique_count=0;for(int i=1;i<=boundary_count;++i)if(boundary[i]!=boundary[unique_count])boundary[++unique_count]=boundary[i];boundary_count=unique_count;for(int i=1;i<=boundary_count;++i)fill(grid[i]+1,grid[i]+boundary_count+1,0);}
  static void rectangle_tag(int x_left,int x_right,int y_left,int y_right,int delta){x_left=static_cast<int>(lower_bound(boundary,boundary+boundary_count+1,x_left-1)-boundary)+1;x_right=static_cast<int>(lower_bound(boundary,boundary+boundary_count+1,x_right)-boundary)+1;y_left=static_cast<int>(lower_bound(boundary,boundary+boundary_count+1,y_left-1)-boundary)+1;y_right=static_cast<int>(lower_bound(boundary,boundary+boundary_count+1,y_right)-boundary)+1;grid[x_left][y_left]+=delta;grid[x_left][y_right]-=delta;grid[x_right][y_left]-=delta;grid[x_right][y_right]+=delta;}
  static void collect_color_node(int node,bool make_rectangles){if(!make_rectangles){boundary[++boundary_count]=enter_time[node]-1;boundary[++boundary_count]=leave_time[node];for(int child=first_child[node];child!=0;child=next_sibling[child]){boundary[++boundary_count]=enter_time[child]-1;boundary[++boundary_count]=leave_time[child];}}else{rectangle_tag(enter_time[node],leave_time[node],1,euler_limit,1);rectangle_tag(1,euler_limit,enter_time[node],leave_time[node],1);for(int child=first_child[node];child!=0;child=next_sibling[child])rectangle_tag(enter_time[child],leave_time[child],enter_time[child],leave_time[child],-2);}}
  static void emit_rectangles(){for(int i=1;i<=boundary_count;++i)for(int j=1;j<=boundary_count;++j){grid[i][j]+=grid[i-1][j]+grid[i][j-1]-grid[i-1][j-1];if(grid[i][j]!=0){append_event(add_event_head[boundary[i-1]+1],boundary[j-1]+1,boundary[j],1);append_event(add_event_head[boundary[i]+1],boundary[j-1]+1,boundary[j],-1);}}}
  static void bit_insert(int position,int delta){int64 coefficient_x=static_cast<int64>(depth_prefix[current_x-1])*delta,coefficient_y=static_cast<int64>(depth_prefix[position-1])*delta,coefficient_xy=static_cast<int64>(depth_prefix[current_x-1])*depth_prefix[position-1]*delta;for(int i=position;i<=euler_limit;i+=i&-i){bit_0[i]+=delta;bit_x[i]+=coefficient_x;bit_y[i]+=coefficient_y;bit_xy[i]+=coefficient_xy;}}
  static int64 bit_ask(int position){int original=position;int64 a=0,b=0,c=0,d=0;for(int i=position;i>0;i-=i&-i){a+=bit_0[i];b+=bit_x[i];c+=bit_y[i];d+=bit_xy[i];}return a*depth_prefix[current_x]*depth_prefix[original]-b*depth_prefix[original]-c*depth_prefix[current_x]+d;}
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int test_count;cin>>test_count;while(test_count--){cin>>n>>chain_length>>seed_a>>seed_b>>seed_c;fill(first_child+1,first_child+n+1,0);fill(add_event_head+1,add_event_head+2*n+1,0);fill(query_event_head+1,query_event_head+2*n+1,0);fill(bit_0+1,bit_0+2*n+1,0);fill(bit_x+1,bit_x+2*n+1,0);fill(bit_y+1,bit_y+2*n+1,0);fill(bit_xy+1,bit_xy+2*n+1,0);edge_count=event_count=0;for(int i=2;i<=chain_length;++i)add_child(i-1,i);for(int i=chain_length+1;i<=n;++i)add_child(static_cast<int>(rng61()%static_cast<unsigned int>(i-1))+1,i);for(int i=1;i<=n;++i)color[i]=static_cast<int>(rng61()%static_cast<unsigned int>(n))+1;dfs(1);for(int i=1;i<=euler_limit;++i)depth_prefix[i]+=depth_prefix[i-1];for(int i=1;i<=n;++i){order_node[i]=i;if(leave_time[i]>euler_limit)leave_time[i]=euler_limit;}sort(order_node+1,order_node+n+1,color_less);for(int begin=1,end;begin<=n;begin=end){boundary[0]=0;boundary_count=1;boundary[1]=euler_limit;for(end=begin;end<=n&&color[order_node[begin]]==color[order_node[end]];++end)collect_color_node(order_node[end],false);prepare_grid();for(int i=begin;i<end;++i)collect_color_node(order_node[i],true);emit_rectangles();}int query_count;cin>>query_count;for(int i=1;i<=query_count;++i){int type,x,y;cin>>type>>x>>y;answer[i]=0;int x_left,x_right,y_left,y_right;if(type==1){x_left=x_right=enter_time[x];y_left=y_right=enter_time[y];}else{x_left=1;x_right=enter_time[x];y_left=1;y_right=enter_time[y];}append_event(query_event_head[x_left-1],y_left,y_right,-i);append_event(query_event_head[x_right],y_left,y_right,i);}for(current_x=1;current_x<=euler_limit;++current_x){for(int event=add_event_head[current_x];event!=0;event=event_next[event]){bit_insert(event_left[event],event_value[event]);bit_insert(event_right[event]+1,-event_value[event]);}for(int event=query_event_head[current_x];event!=0;event=event_next[event]){int signed_id=event_value[event],id=abs(signed_id);int64 value=bit_ask(event_right[event])-bit_ask(event_left[event]-1);if(signed_id>0)answer[id]+=value;else answer[id]-=value;}}for(int i=1;i<=query_count;++i)cout<<answer[i]<<'\n';}}
external_url: https://www.luogu.com.cn/problem/P4618
external_platform: 洛谷
external_problem_id: P4618
external_title: '[SDOI2018] 原题识别'
---

將答案拆成「每個顏色是否出現」的 0/1 貢獻後，複雜的樹路徑問題可轉為二維覆蓋計數。
