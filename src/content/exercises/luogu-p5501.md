---
id: luogu-p5501
volume: upper
source_file: upper-volume
source_book_pages: [197, 220]
source_pdf_pages: [215, 238]
chapter: 4
section: '4.5'
kind: external-oj
review_status: verified
external_relation: original
title: 洛谷 P5501 來者不拒，去者不追：莫隊二次離線
difficulty: 5
topics: [莫隊二次離線, 值域分塊, 區間點對貢獻]
prerequisites: [mo-algorithm, square-root-decomposition]
statement: 對每個詢問區間，若數值 x 在排序後是第 k 小（名次為 1 加上嚴格小於 x 的元素數，相等者同名次），其 Abbi 值為 k×x；求區間所有元素 Abbi 值之和。
constraints:
  - '1 <= n,m <= 500000'
  - '1 <= a_i <= 100000'
  - '1 <= l <= r <= n'
input_format: 第一行 n、m；第二行序列；接著 m 行詢問 l、r。
output_format: 每個詢問輸出區間 Abbi 值總和。
samples:
  - input: |
      4 3
      1 2 2 3
      1 4
      2 3
      2 4
    output: |
      21
      4
      13
    explanation: 全區間名次為 1、2、2、4，總和 1×1+2×2+2×2+4×3=21。
core_knowledge: [對稱點對函數, 莫隊移動差分, 二次離線事件, 值域區間加點查]
judgment: 答案等於區間和，加上每對不等值元素中較大值；加入 x 的點對增量為 x×count(<x)+sum(>x)，可對前綴作差並把莫隊移動批次離線。
hints:
  - 預掃前綴，令 f[i] 為 a_i 與 [1,i-1] 的點對貢獻；值域分塊可 O(sqrt V) 插入、O(1) 查 x×count(<x)+sum(>x)。
  - 依莫隊順序移動區間時先用 f 的加減作基準；當實際邊界不是前綴 1 時，記一個「在某前綴，對一段位置求貢獻」的修正事件。
  - 再掃一次前綴處理全部事件。每個詢問記的是相對上一個莫隊詢問的答案差，最後按莫隊順序做前綴累加，再加原區間元素和。
solution_outline: 將 Abbi 和改寫為元素和加對稱點對核。第一次值域分塊掃描求 f；莫隊只建立前綴修正事件；第二次掃描以同一資料結構 O(1) 回答事件中的單點核，最後還原各詢問。
proof_or_invariant: 每個元素的名次額外部分，對每個嚴格較小元素貢獻一次自身值，故點對核為不等兩值的最大者。莫隊四種端點移動的 f 基準計入與完整前綴的交互，事件恰加減多算前綴；因此累積差值等於每個區間全部點對核。
complexity:
  time: O(n sqrt V+(n+m)sqrt n)
  space: O(n+m+V)
common_errors:
  - 相等元素彼此產生點對貢獻；它們名次相同，不應計入
  - 將每個莫隊 delta 當成獨立答案，漏做莫隊順序前綴和
  - 事件在插入前綴位置前處理，少算該位置
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;cin>>n>>m;vector<int>a(static_cast<size_t>(n+1));for(int i=1;i<=n;++i)cin>>a[static_cast<size_t>(i)];while(m--){int l,r;cin>>l>>r;long long answer=0;for(int i=l;i<=r;++i){long long rank=1;for(int j=l;j<=r;++j)rank+=a[static_cast<size_t>(j)]<a[static_cast<size_t>(i)];answer+=rank*a[static_cast<size_t>(i)];}cout<<answer<<'\n';}}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  struct RangeAddPointQuery{int maximum,block_size,block_count;vector<long long>direct,lazy;explicit RangeAddPointQuery(int limit):maximum(limit),block_size(max(1,static_cast<int>(sqrt(static_cast<double>(limit)))+1)),block_count((limit+block_size-1)/block_size),direct(static_cast<size_t>(limit+1)),lazy(static_cast<size_t>(block_count)){}void add(int left,int right,long long value){if(left>right)return;int left_block=(left-1)/block_size,right_block=(right-1)/block_size;if(left_block==right_block){for(int position=left;position<=right;++position)direct[static_cast<size_t>(position)]+=value;return;}int left_end=(left_block+1)*block_size;for(int position=left;position<=left_end;++position)direct[static_cast<size_t>(position)]+=value;for(int block=left_block+1;block<right_block;++block)lazy[static_cast<size_t>(block)]+=value;for(int position=right_block*block_size+1;position<=right;++position)direct[static_cast<size_t>(position)]+=value;}long long get(int position)const{return direct[static_cast<size_t>(position)]+lazy[static_cast<size_t>((position-1)/block_size)];}};
  struct Kernel{int maximum;RangeAddPointQuery less_count,greater_sum;explicit Kernel(int limit):maximum(limit),less_count(limit),greater_sum(limit){}long long query(int value)const{return less_count.get(value)*value+greater_sum.get(value);}void insert(int value){less_count.add(value+1,maximum,1);greater_sum.add(1,value-1,value);}};
  struct Query{int left,right,index;long long delta=0;};
  struct Event{int left,right,query_index,sign;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;cin>>n>>m;vector<int>values(static_cast<size_t>(n+1));vector<long long>prefix_sum(static_cast<size_t>(n+1));int maximum_value=1;for(int i=1;i<=n;++i){cin>>values[static_cast<size_t>(i)];maximum_value=max(maximum_value,values[static_cast<size_t>(i)]);prefix_sum[static_cast<size_t>(i)]=prefix_sum[static_cast<size_t>(i-1)]+values[static_cast<size_t>(i)];}Kernel first_scan(maximum_value);vector<long long>prefix_contribution(static_cast<size_t>(n+1));for(int i=1;i<=n;++i){prefix_contribution[static_cast<size_t>(i)]=first_scan.query(values[static_cast<size_t>(i)]);first_scan.insert(values[static_cast<size_t>(i)]);}vector<Query>queries(static_cast<size_t>(m));for(int i=0;i<m;++i){cin>>queries[static_cast<size_t>(i)].left>>queries[static_cast<size_t>(i)].right;queries[static_cast<size_t>(i)].index=i;}int mo_block=max(1,static_cast<int>(static_cast<double>(n)/sqrt(static_cast<double>(max(1,m)))));sort(queries.begin(),queries.end(),[mo_block](const Query&a,const Query&b){int first=a.left/mo_block,second=b.left/mo_block;if(first!=second)return first<second;return ((first&1)!=0)?a.right<b.right:a.right>b.right;});vector<vector<Event>>events(static_cast<size_t>(n+1));int left=1,right=0;for(int index=0;index<m;++index){Query&query=queries[static_cast<size_t>(index)];if(left>query.left)events[static_cast<size_t>(right)].push_back({query.left,left-1,index,1});while(left>query.left)query.delta-=prefix_contribution[static_cast<size_t>(--left)];if(right<query.right)events[static_cast<size_t>(left-1)].push_back({right+1,query.right,index,-1});while(right<query.right)query.delta+=prefix_contribution[static_cast<size_t>(++right)];if(left<query.left)events[static_cast<size_t>(right)].push_back({left,query.left-1,index,-1});while(left<query.left)query.delta+=prefix_contribution[static_cast<size_t>(left++)];if(right>query.right)events[static_cast<size_t>(left-1)].push_back({query.right+1,right,index,1});while(right>query.right)query.delta-=prefix_contribution[static_cast<size_t>(right--)];}Kernel second_scan(maximum_value);for(int prefix=1;prefix<=n;++prefix){second_scan.insert(values[static_cast<size_t>(prefix)]);for(const Event&event:events[static_cast<size_t>(prefix)])for(int position=event.left;position<=event.right;++position)queries[static_cast<size_t>(event.query_index)].delta+=event.sign*second_scan.query(values[static_cast<size_t>(position)]);}vector<long long>answer(static_cast<size_t>(m));long long pair_sum=0;for(const Query&query:queries){pair_sum+=query.delta;answer[static_cast<size_t>(query.index)]=pair_sum+prefix_sum[static_cast<size_t>(query.right)]-prefix_sum[static_cast<size_t>(query.left-1)];}for(long long result:answer)cout<<result<<'\n';}
external_url: https://www.luogu.com.cn/problem/P5501
external_platform: 洛谷
external_problem_id: P5501
external_title: '[LnOI2019] 来者不拒，去者不追'
---

二次離線不是另一種排序，而是把莫隊每次昂貴的「目前區間統計」改寫成前綴查詢事件，再統一掃描回答。
