---
id: openj-bailian-2182
volume: upper
source_file: upper-volume
title: OpenJudge 百練 2182 Lost Cows
chapter: 4
section: '4.3'
kind: external-oj
difficulty: 3
topics: &id001
  - fenwick-tree
  - order-statistics
  - inversion-sequence
prerequisites:
  - segment-tree
statement: 已知隊列第 i 頭牛前面有多少品牌較小的牛，還原每個位置的品牌。
constraints:
  - 2 <= N <= 8000
  - 品牌恰為 1..N
input_format: 輸入 N 與位置 2..N 的較小前驅數。
output_format: 逐行輸出每個位置的品牌。
samples:
  - input: |
      5
      1
      2
      1
      0
    output: |
      2
      4
      5
      3
      1
    explanation: 逆序選剩餘品牌中的第 count+1 小者。
core_knowledge: *id001
judgment: 逆序依 inversion sequence 做第 k 小刪除。
hints:
  - 從最後位置開始，後方牛不影響它的前驅統計。
  - 第 i 頭品牌是剩餘品牌中第 a[i]+1 小。
  - BIT 維護品牌是否尚未使用並找第 k 個一。
solution_outline: 逆序依 inversion sequence 做第 k 小刪除。
proof_or_invariant: 逆序時剩餘品牌恰屬於前 i 個位置；其中有 a[i] 個較小品牌，故當前品牌秩唯一為 a[i]+1。
common_errors:
  - 端點、開閉區間或 0/1 起始索引處理錯誤
  - 合併摘要時遺漏跨左右區間的候選
  - 使用 32 位元儲存可能溢位的計數或總和
complexity:
  time: O(N log N)
  space: O(N)
cpp_skeleton: |
  // TODO：依三階段提示自行完成核心。
  #include <bits/stdc++.h>
  using namespace std;class F{public:explicit F(int n):t(static_cast<size_t>(n+1)){}void add(int x,int v){for(int i=x;i<static_cast<int>(t.size());i+=i&-i)t[static_cast<size_t>(i)]+=v;}int kth(int k)const{int x=0;for(int step=1;step<static_cast<int>(t.size());step<<=1){}int step=1;while((step<<1)<static_cast<int>(t.size()))step<<=1;for(;step;step>>=1){int nx=x+step;if(nx<static_cast<int>(t.size())&&t[static_cast<size_t>(nx)]<k){x=nx;k-=t[static_cast<size_t>(nx)];}}return x+1;}private:vector<int>t;};int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;cin>>n;vector<int>less(static_cast<size_t>(n+1)),ans(static_cast<size_t>(n+1));for(int i=2;i<=n;++i)cin>>less[static_cast<size_t>(i)];F bit(n);for(int i=1;i<=n;++i)bit.add(i,1);for(int i=n;i>=1;--i){ans[static_cast<size_t>(i)]=bit.kth(less[static_cast<size_t>(i)]+1);bit.add(ans[static_cast<size_t>(i)],-1);}for(int i=1;i<=n;++i)cout<<ans[static_cast<size_t>(i)]<<'\n';}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;class F{public:explicit F(int n):t(static_cast<size_t>(n+1)){}void add(int x,int v){for(int i=x;i<static_cast<int>(t.size());i+=i&-i)t[static_cast<size_t>(i)]+=v;}int kth(int k)const{int x=0;for(int step=1;step<static_cast<int>(t.size());step<<=1){}int step=1;while((step<<1)<static_cast<int>(t.size()))step<<=1;for(;step;step>>=1){int nx=x+step;if(nx<static_cast<int>(t.size())&&t[static_cast<size_t>(nx)]<k){x=nx;k-=t[static_cast<size_t>(nx)];}}return x+1;}private:vector<int>t;};int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;cin>>n;vector<int>less(static_cast<size_t>(n+1)),ans(static_cast<size_t>(n+1));for(int i=2;i<=n;++i)cin>>less[static_cast<size_t>(i)];F bit(n);for(int i=1;i<=n;++i)bit.add(i,1);for(int i=n;i>=1;--i){ans[static_cast<size_t>(i)]=bit.kth(less[static_cast<size_t>(i)]+1);bit.add(ans[static_cast<size_t>(i)],-1);}for(int i=1;i<=n;++i)cout<<ans[static_cast<size_t>(i)]<<'\n';}
external_url: http://bailian.openjudge.cn/practice/2182/
external_platform: OpenJ_Bailian
external_problem_id: '2182'
external_title: OpenJudge 百練 2182 Lost Cows
external_relation: original
source_book_pages:
  - 202
source_pdf_pages:
  - 220
review_status: verified
---

本卡片依外部題面與限制獨立整理。
