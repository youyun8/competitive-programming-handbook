---
id: luogu-p4360
volume: upper
source_file: upper-volume
title: 洛谷 P4360 鋸木廠選址
chapter: 5
section: '5.9'
kind: external-oj
difficulty: 4
topics: ['convex-hull-trick', 'greedy']
prerequisites: ['dynamic-programming']
statement: >-
  n 棵樹沿山路由山頂至山腳排列，木材只能往山下運；山腳已有鋸木廠，另在樹的位置新建兩座，求全部木材運到第一座下游鋸木廠的最小重量乘距離總和。
constraints:
  - 2 <= n <= 20000
  - 1 <= w_i <= 10000
  - 0 <= d_i <= 10000
  - 山腳方案成本小於 2×10^9
input_format: 第一行 n；接著 n 行重量 w_i 與到下一位置的距離 d_i，d_n 通往山腳。
output_format: 輸出最小運輸成本。
samples:
  - input: |-
      9
      1 2
      2 1
      3 3
      1 1
      3 2
      1 6
      2 1
      1 2
      1 1
    output: |-
      26
    explanation: 在兩個適當樹位建廠後，各棵樹運往首個下游工廠，最小總成本為 26。
core_knowledge: ['運輸成本', '前綴重量', 'Li Chao tree']
judgment: 固定下游新廠 i 後，上游新廠 j 的節省可寫成 W[j]*(D[j]-D[i])，是對 x=-D[i] 的直線最大值。
hints:
  - 由下往上累加 d 得每棵樹到山腳距離 D，並算重量前綴 W 與全送山腳成本 total。
  - 兩廠位於 j<i 時成本為 total-D[j]W[j]-D[i](W[i]-W[j])。
  - 把 j 建成斜率 W[j]、截距 D[j]W[j] 的線，在 x=-D[i] 查最大值；用離散 Li Chao tree。
solution_outline: >-
  預處理 D、W、total。依 i 由 2 到 n，先加入 j=i-1 的線，查詢 -D[i] 的最大節省，更新 total-D[i]W[i]-query。
proof_or_invariant: >-
  每棵樹總是運往第一個下游工廠。兩廠 j<i 時，前 j 棵節省 D[j]W[j]，j+1..i 節省 D[i](W[i]-W[j])，其餘不變，得公式。枚舉 i 並以 Li Chao 取所有 j<i 的最大節省即涵蓋全部選址。
common_errors: ['距離未做後綴累加', '允許 j>=i', '查最大節省卻維護最小直線']
complexity:
  time: 'O(n log n)'
  space: 'O(n)'
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
  struct Line{long long m=0,b=numeric_limits<long long>::min()/4;long long value(long long x)const{return m*x+b;}};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;cin>>n;vector<long long>w(n+1),distance(n+2),prefix(n+1);for(int i=1;i<=n;i++)cin>>w[i]>>distance[i];for(int i=n;i>=1;i--)distance[i]+=distance[i+1];long long total=0;for(int i=1;i<=n;i++){prefix[i]=prefix[i-1]+w[i];total+=w[i]*distance[i];}vector<long long>xs;for(int i=2;i<=n;i++)xs.push_back(-distance[i]);sort(xs.begin(),xs.end());xs.erase(unique(xs.begin(),xs.end()),xs.end());int x_count=static_cast<int>(xs.size());vector<Line>tree(xs.size()*4);auto add=[&](auto&&self,Line line,int node,int l,int r)->void{int mid=(l+r)/2;bool left=line.value(xs[l])>tree[node].value(xs[l]),middle=line.value(xs[mid])>tree[node].value(xs[mid]);if(middle)swap(line,tree[node]);if(l==r)return;if(left!=middle)self(self,line,node*2,l,mid);else self(self,line,node*2+1,mid+1,r);};auto query=[&](auto&&self,int index,int node,int l,int r)->long long{long long result=tree[node].value(xs[index]);if(l==r)return result;int mid=(l+r)/2;return max(result,index<=mid?self(self,index,node*2,l,mid):self(self,index,node*2+1,mid+1,r));};long long answer=total;for(int i=2;i<=n;i++){int j=i-1;add(add,{prefix[j],distance[j]*prefix[j]},1,0,x_count-1);int index=static_cast<int>(lower_bound(xs.begin(),xs.end(),-distance[i])-xs.begin());answer=min(answer,total-distance[i]*prefix[i]-query(query,index,1,0,x_count-1));}cout<<answer<<'\n';}
external_url: https://www.luogu.com.cn/problem/P4360
external_platform: 洛谷
external_problem_id: 'P4360'
external_title: 鋸木廠選址
external_relation: original
source_book_pages: [377]
source_pdf_pages: [395]
review_status: verified
---

固定下游廠後，上游廠的選擇是線性函數最大值；運輸成本因此能用凸殼求解。
