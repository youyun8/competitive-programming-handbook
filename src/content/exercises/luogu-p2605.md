---
id: luogu-p2605
volume: upper
source_file: upper-volume
title: 洛谷 P2605 基站選址
chapter: 5
section: '5.7'
kind: external-oj
difficulty: 5
topics: ['segment-tree', 'dynamic-programming']
prerequisites: ['dynamic-programming']
statement: >-
  n 個村莊位於直線上，最多選 k 個村莊建基站並支付建設費。村莊 i 在距離 S_i 內沒有任何基站時，另付補償 W_i。求建設與補償總費用最小值。
constraints:
  - n <= 20000
  - k <= 100
  - D_i,S_i <= 10^9
  - C_i,W_i <= 10000
input_format: 第一行 n、k；第二行 D_2..D_n；其後三行依序為 C、S、W。
output_format: 輸出最小總費用。
samples:
  - input: |-
      3 2
      1 2
      2 3 2
      1 1 0
      10 20 30
    output: |-
      4
    explanation: 在村莊 1、3 建站，建設費為 4 且三村都被覆蓋。
core_knowledge: ['區間加最小值', '覆蓋邊界', '虛擬終點']
judgment: 設 dp_i 為目前最後一站建在 i 的前綴最小費用。固定基站數時，轉移值是上一層 dp_j 加上 j、i 間未覆蓋村莊的補償，再加 C_i。
hints:
  - 二分求每個村莊可被哪些基站覆蓋的索引範圍 [L_i,R_i]。
  - 右端點掃過 R_v 後，若上一站 j<L_v，村莊 v 已不可能被兩端覆蓋，對候選區間 [1,L_v-1] 加 W_v。
  - 用線段樹維護候選轉移值的區間加與區間最小；增加一個零建設費的虛擬終點統一結算尾段。
solution_outline: >-
  先按 R 將村莊分桶。計算只放一站時的初值；之後枚舉 2..k+1 個含虛擬終點的站，以上一層 dp 建樹，逐右端點查詢前綴最小並處理到期補償。
proof_or_invariant: >-
  掃描右站 i 時，村莊 v 只有在上一站 j<L_v 且 i>R_v 時才不被兩站覆蓋；事件 i=R_v 對恰當 j 前綴加 W_v，故線段樹葉 j 始終等於完整轉移代價。區間最小取得最佳上一站。虛擬終點使其 dp 正是全序列代價，枚舉不超過 k 個實站取最小即得答案。
common_errors: ['把覆蓋距離的等號排除', '事件在算 i 前加入而提早收補償', '只計算恰好 k 站而忽略少建更佳']
complexity:
  time: 'O(nk log n)'
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
  struct SegmentTree{vector<long long>mn,lazy;explicit SegmentTree(int size):mn(4*size),lazy(4*size){}void build(int node,int left,int right,const vector<long long>&value){lazy[node]=0;if(left==right){mn[node]=value[left];return;}int mid=(left+right)/2;build(node*2,left,mid,value);build(node*2+1,mid+1,right,value);mn[node]=min(mn[node*2],mn[node*2+1]);}void add(int node,int left,int right,int ql,int qr,long long value){if(ql<=left&&right<=qr){mn[node]+=value;lazy[node]+=value;return;}int mid=(left+right)/2;if(ql<=mid)add(node*2,left,mid,ql,qr,value);if(qr>mid)add(node*2+1,mid+1,right,ql,qr,value);mn[node]=lazy[node]+min(mn[node*2],mn[node*2+1]);}long long query(int node,int left,int right,int ql,int qr,long long carry=0){if(ql<=left&&right<=qr)return mn[node]+carry;carry+=lazy[node];int mid=(left+right)/2;long long result=numeric_limits<long long>::max()/4;if(ql<=mid)result=min(result,query(node*2,left,mid,ql,qr,carry));if(qr>mid)result=min(result,query(node*2+1,mid+1,right,ql,qr,carry));return result;}};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int original_n,k;cin>>original_n>>k;int n=original_n+1;vector<long long>distance(n+1),cost(n+1),radius(n+1),penalty(n+1),dp(n+1);for(int i=2;i<=original_n;i++)cin>>distance[i];for(int i=1;i<=original_n;i++)cin>>cost[i];for(int i=1;i<=original_n;i++)cin>>radius[i];for(int i=1;i<=original_n;i++)cin>>penalty[i];distance[n]=numeric_limits<long long>::max()/8;vector<int>left(n+1),right(n+1);vector<vector<int>>ending(n+1);for(int i=1;i<=n;i++){left[i]=static_cast<int>(lower_bound(distance.begin()+1,distance.begin()+n+1,distance[i]-radius[i])-distance.begin());right[i]=static_cast<int>(upper_bound(distance.begin()+1,distance.begin()+n+1,distance[i]+radius[i])-distance.begin())-1;ending[right[i]].push_back(i);}long long accumulated=0;for(int i=1;i<=n;i++){dp[i]=accumulated+cost[i];for(int village:ending[i])accumulated+=penalty[village];}long long answer=dp[n];SegmentTree tree(n);for(int used=2;used<=k+1;used++){tree.build(1,1,n,dp);for(int i=1;i<=n;i++){dp[i]=(i>=used?tree.query(1,1,n,used-1,i-1):0)+cost[i];for(int village:ending[i])if(left[village]>1)tree.add(1,1,n,1,left[village]-1,penalty[village]);}answer=min(answer,dp[n]);}cout<<answer<<'\n';}
external_url: https://www.luogu.com.cn/problem/P2605
external_platform: 洛谷
external_problem_id: 'P2605'
external_title: 基站選址
external_relation: original
source_book_pages: [366]
source_pdf_pages: [384]
review_status: verified
---

補償何時成為必付費用可轉為掃描事件，讓二次轉移只剩動態區間最小值。
