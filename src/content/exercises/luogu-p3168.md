---
id: luogu-p3168
volume: upper
source_file: upper-volume
source_book_pages: [179, 196]
source_pdf_pages: [197, 214]
chapter: 4
section: '4.4'
kind: external-oj
review_status: verified
external_relation: original
title: 洛谷 P3168 任務查詢系統：時間版本的前 k 小和
difficulty: 5
topics: [可持久化線段樹, 差分事件, 前 k 小總和]
prerequisites: [persistent-segment-tree]
statement: 任務在時間閉區間 [s,e] 執行並有優先級 p。每個時間點詢問當時優先級最小的 k 個任務之和；k 由上次答案在線生成，超過任務數時取全部。
constraints:
  - '1 <= 任務數 m、時間範圍 n、c_i <= 100000'
  - '0 <= a_i,b_i <= 100000，1 <= p_i <= 10000000'
  - 查詢時間 x_i 是 1..n 的一個排列
input_format: 第一行 m、n；接著 m 行 s、e、p；再 n 行 x、a、b、c，令 k=1+(a*pre+b) mod c，初始 pre=1。
output_format: 每個時間詢問輸出一行答案，並令 pre 等於此答案。
samples:
  - input: |
      2 2
      1 2 5
      2 2 3
      1 0 0 1
      2 0 1 2
    output: |
      5
      8
    explanation: 時間 1 只有優先級 5；第二筆 k=2，時間 2 的兩個任務都被選取。
core_knowledge: [時間差分, 多重集合主席樹, k 小和]
judgment: 每個時間點的活動任務多重集合只在任務開始與結束後改變；以事件建立時間版本，可在值域樹同步維護數量與總和。
hints:
  - 對每個任務在 s 掛 +p、e+1 掛 -p，依時間建立版本。
  - 節點同時保存 count 與 sum；若整個節點數量不超過 k，可整段取走。
  - 否則先看左子樹數量；不足時取完整左和，再到右邊找剩餘個數。
solution_outline: 離散化優先級，按時間套用增刪事件形成可持久化根。每個查詢算出 k，沿該時間版本求最小 k 個值之和。
proof_or_invariant: root[t] 恰含 s<=t<=e 的所有任務。值域由小到大，遞迴總是先取完整左側，再取右側缺額，因此所得多重集合正是最小的 min(k,total) 個優先級。
complexity:
  time: O((m+n) log m)
  space: O(m log m)
common_errors:
  - 在 e 而不是 e+1 刪除任務
  - 重複優先級只存存在性而非數量
  - a*pre 使用 32 位元而溢位
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int m,n;cin>>m>>n;struct Task{int s,e,p;};vector<Task>task(static_cast<size_t>(m));for(auto&t:task)cin>>t.s>>t.e>>t.p;long long previous=1;for(int i=0;i<n;++i){int x,a,b,c;cin>>x>>a>>b>>c;int k=1+static_cast<int>((a*previous+b)%c);vector<int>active;for(const auto&t:task)if(t.s<=x&&x<=t.e)active.push_back(t.p);sort(active.begin(),active.end());previous=accumulate(active.begin(),active.begin()+min(k,static_cast<int>(active.size())),0LL);cout<<previous<<'\n';}}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  struct Node{int left=0,right=0,count=0;long long sum=0;};struct Event{int value,delta;};
  static int update(vector<Node>&tree,int old,int l,int r,int p,int delta,int value){int id=static_cast<int>(tree.size());tree.push_back(tree[static_cast<size_t>(old)]);tree[static_cast<size_t>(id)].count+=delta;tree[static_cast<size_t>(id)].sum+=static_cast<long long>(delta)*value;if(l==r)return id;int mid=(l+r)/2;if(p<=mid)tree[static_cast<size_t>(id)].left=update(tree,tree[static_cast<size_t>(old)].left,l,mid,p,delta,value);else tree[static_cast<size_t>(id)].right=update(tree,tree[static_cast<size_t>(old)].right,mid+1,r,p,delta,value);return id;}
  static long long smallest_sum(const vector<Node>&tree,int id,int l,int r,int k,const vector<int>&values){if(k<=0)return 0;if(tree[static_cast<size_t>(id)].count<=k)return tree[static_cast<size_t>(id)].sum;if(l==r)return static_cast<long long>(k)*values[static_cast<size_t>(l)];int left=tree[static_cast<size_t>(id)].left,left_count=tree[static_cast<size_t>(left)].count,mid=(l+r)/2;if(k<=left_count)return smallest_sum(tree,left,l,mid,k,values);return tree[static_cast<size_t>(left)].sum+smallest_sum(tree,tree[static_cast<size_t>(id)].right,mid+1,r,k-left_count,values);}
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int m,n;cin>>m>>n;struct Task{int s,e,p;};vector<Task>task(static_cast<size_t>(m));vector<int>values;for(auto&t:task){cin>>t.s>>t.e>>t.p;values.push_back(t.p);}sort(values.begin(),values.end());values.erase(unique(values.begin(),values.end()),values.end());vector<vector<Event>>events(static_cast<size_t>(n+2));for(const auto&t:task){int p=static_cast<int>(lower_bound(values.begin(),values.end(),t.p)-values.begin());events[static_cast<size_t>(t.s)].push_back({p,1});events[static_cast<size_t>(t.e+1)].push_back({p,-1});}vector<Node>tree(1);tree.reserve(static_cast<size_t>(m)*40U+1U);vector<int>root(static_cast<size_t>(n+1));for(int time=1;time<=n;++time){int current=root[static_cast<size_t>(time-1)];for(const Event&e:events[static_cast<size_t>(time)])current=update(tree,current,0,static_cast<int>(values.size())-1,e.value,e.delta,values[static_cast<size_t>(e.value)]);root[static_cast<size_t>(time)]=current;}long long previous=1;for(int i=0;i<n;++i){int x,a,b,c;cin>>x>>a>>b>>c;int k=1+static_cast<int>((static_cast<long long>(a)*previous+b)%c);previous=smallest_sum(tree,root[static_cast<size_t>(x)],0,static_cast<int>(values.size())-1,k,values);cout<<previous<<'\n';}}
external_url: https://www.luogu.com.cn/problem/P3168
external_platform: 洛谷
external_problem_id: P3168
external_title: '[CQOI2015] 任务查询系统'
---

可持久化的版本軸不一定是陣列前綴，也可以是時間。
