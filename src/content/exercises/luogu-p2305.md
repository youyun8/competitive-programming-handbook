---
id: luogu-p2305
volume: upper
source_file: upper-volume
title: 洛谷 P2305 購票
chapter: 5
section: '5.9'
kind: external-oj
difficulty: 5
topics: ['li-chao-tree', 'tree-dp']
prerequisites: ['dynamic-programming']
statement: >-
  城市形成以 1 為根的帶權樹。城市 v 可買票到距離不超過 l_v 的祖先 a，票價為距離乘 p_v 再加 q_v；可多次轉乘，求每個城市到根的最低總票價。
constraints:
  - n <= 200000
  - 0 <= p_v <= 1000000
  - 0 <= q_v <= 10^12
  - s_v <= l_v <= 2*10^11
  - 答案在 64 位有號整數範圍
input_format: 第一行 n、資料類型 t；城市 2..n 各一行父親 f_v、邊長 s_v、p_v、q_v、l_v。
output_format: 依序輸出城市 2..n 到根的最低費用。
samples:
  - input: |-
      7 3
      1 2 20 0 3
      1 5 10 100 5
      2 4 10 10 10
      2 9 1 100 10
      3 5 20 100 10
      4 4 20 0 10
    output: |-
      40
      150
      70
      149
      300
      150
    explanation: 例如城市 2 可直達根，費用 2*20=40。
core_knowledge: ['祖先距離限制', '出棧序', '線段樹套李超樹']
judgment: dist_v 為根距離，dp_v=min(dp_a-dist_a*p_v)+dist_v*p_v+q_v，其中 a 是 dist_a>=dist_v-l_v 的祖先。
hints:
  - 祖先 a 對查詢 x=p_v 提供直線 y=-dist_a*x+dp_a。
  - 合法祖先是目前 DFS 路徑的一段後綴；用路徑距離二分其最遠端。
  - 預先求 DFS 出棧序，查詢目前節點到該祖先的出棧序區間；尚未走訪的非路徑節點沒有直線，已走完的旁支落在區間外。
solution_outline: >-
  先求與正式 DFS 相同順序的出棧編號。外層線段樹按出棧編號單點加入直線、區間查詢；每個外層節點用動態李超樹求 p 範圍內最小值。
proof_or_invariant: >-
  DP 式由第一段票價加祖先最優費用直接得到。DFS 當下，指定出棧區間中已插入者恰為合法路徑後綴：早先旁支已取得更小出棧號，未來節點尚未插入。外層分解不漏不重地涵蓋此區間，各李超樹回傳其直線最小值，故取得所有且僅合法祖先的最小轉移。
common_errors: ['將 l_v 當邊數而非加權距離', '李超樹做最大值而非最小值', '出棧序預處理與正式 DFS 使用不同子節點順序']
complexity:
  time: 'O(n log n log P)'
  space: 'O(n log n)'
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：依狀態定義完成初始化、轉移與答案輸出。
      return 0;
  }
cpp_solution: |
  #include <algorithm>
  #include <iostream>
  #include <limits>
  #include <vector>
  using namespace std;
  struct City{long long edge,p,q,limit,dist,dp;int parent;};
  struct Line{long long slope,intercept;long long value(long long x)const{return slope*x+intercept;}};
  struct LiChaoPool{vector<int>line,left,right;vector<Line>*lines;LiChaoPool(vector<Line>&all):line(1),left(1),right(1),lines(&all){}int create(int id){line.push_back(id);left.push_back(0);right.push_back(0);return line.size()-1;}void insert(int&node,int low,int high,int id){if(!node){node=create(id);return;}int mid=(low+high)/2;if((*lines)[id].value(mid)<(*lines)[line[node]].value(mid))swap(id,line[node]);if(low==high)return;if((*lines)[id].value(low)<(*lines)[line[node]].value(low)){int child=left[node];insert(child,low,mid,id);left[node]=child;}else if((*lines)[id].value(high)<(*lines)[line[node]].value(high)){int child=right[node];insert(child,mid+1,high,id);right[node]=child;}}long long query(int node,int low,int high,int x)const{if(!node)return numeric_limits<long long>::max()/4;long long result=(*lines)[line[node]].value(x);if(low==high)return result;int mid=(low+high)/2;if(x<=mid)return min(result,query(left[node],low,mid,x));return min(result,query(right[node],mid+1,high,x));}};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,type;cin>>n>>type;vector<City>city(n+1);vector<vector<int>>children(n+1);for(int v=2;v<=n;v++){cin>>city[v].parent>>city[v].edge>>city[v].p>>city[v].q>>city[v].limit;children[city[v].parent].push_back(v);}vector<int>post(n+1),next_child(n+1),stack={1};int timer=0;while(!stack.empty()){int u=stack.back();if(next_child[u]<(int)children[u].size())stack.push_back(children[u][next_child[u]++]);else{post[u]=++timer;stack.pop_back();}}vector<Line>lines(n+1);LiChaoPool pool(lines);vector<int>roots(4*n+4);auto add_line=[&](auto&&self,int node,int low,int high,int position,int id)->void{pool.insert(roots[node],0,1000000,id);if(low==high)return;int mid=(low+high)/2;if(position<=mid)self(self,node*2,low,mid,position,id);else self(self,node*2+1,mid+1,high,position,id);};auto range_query=[&](auto&&self,int node,int low,int high,int ql,int qr,int x)->long long{if(ql<=low&&high<=qr)return pool.query(roots[node],0,1000000,x);int mid=(low+high)/2;long long result=numeric_limits<long long>::max()/4;if(ql<=mid)result=min(result,self(self,node*2,low,mid,ql,qr,x));if(qr>mid)result=min(result,self(self,node*2+1,mid+1,high,ql,qr,x));return result;};struct Frame{int node,next;};vector<Frame>dfs={{1,0}};vector<int>path;vector<long long>path_distance;city[1].dp=0;city[1].dist=0;lines[1]={0,0};add_line(add_line,1,1,n,post[1],1);path.push_back(1);path_distance.push_back(0);while(!dfs.empty()){Frame&frame=dfs.back();int u=frame.node;if(frame.next==(int)children[u].size()){dfs.pop_back();path.pop_back();path_distance.pop_back();continue;}int v=children[u][frame.next++];city[v].dist=city[u].dist+city[v].edge;long long minimum_distance=city[v].dist-city[v].limit;int first=lower_bound(path_distance.begin(),path_distance.end(),minimum_distance)-path_distance.begin();long long best=range_query(range_query,1,1,n,post[v],post[path[first]],city[v].p);city[v].dp=best+city[v].dist*city[v].p+city[v].q;lines[v]={-city[v].dist,city[v].dp};add_line(add_line,1,1,n,post[v],v);path.push_back(v);path_distance.push_back(city[v].dist);dfs.push_back({v,0});}for(int v=2;v<=n;v++)cout<<city[v].dp<<'\n';}
external_url: https://www.luogu.com.cn/problem/P2305
external_platform: 洛谷
external_problem_id: 'P2305'
external_title: 購票
external_relation: original
source_book_pages: [377]
source_pdf_pages: [395]
review_status: verified
---

出棧序把 DFS 路徑後綴轉成靜態區間，線性票價轉移再由李超樹處理。
