---
id: luogu-p3605
volume: upper
source_file: upper-volume
title: 洛谷 P3605 [USACO17JAN] Promotion Counting P
chapter: 4
section: '4.2'
kind: external-oj
difficulty: 4
topics: &id001
  - euler-tour
  - offline-sorting
  - fenwick-tree
prerequisites:
  - fenwick-tree
statement: 公司為根樹；對每位員工，求其嚴格下屬中能力值較高者數量。
constraints:
  - n <= 100000
  - 能力值為整數
input_format: 輸入 n、n 個能力值，再給員工 2..n 的主管。
output_format: 依員工編號輸出答案。
samples:
  - input: |
      5
      3
      5
      4
      2
      1
      1
      1
      2
      2
    output: |
      2
      0
      0
      0
      0
    explanation: 根的下屬中能力 5、4 較高，其餘沒有更高下屬。
core_knowledge: *id001
judgment: Euler 展平；能力降序離線，以 BIT 查子樹內已加入數。
hints:
  - Euler 序把下屬集合變成子樹區間。
  - 依能力由高到低處理，BIT 中只放已處理的較高員工。
  - 相同能力須整批查完再加入，才能維持嚴格大於。
solution_outline: Euler 展平；能力降序離線，以 BIT 查子樹內已加入數。
proof_or_invariant: 查詢時 BIT 恰含所有且僅含能力嚴格較高節點；Euler 區間再限制為下屬，交集即答案。
common_errors:
  - 索引或閉區間邊界處理錯誤
  - 離線排序後遺失原詢問順序
  - 計數或乘積未使用 long long
complexity:
  time: O(n log n)
  space: O(n)
cpp_skeleton: |
  // TODO：依提示補完核心資料結構。
  #include <bits/stdc++.h>
  using namespace std;
  class Fenwick{public:explicit Fenwick(int n):t(static_cast<size_t>(n+1)){}void add(int x,long long v){for(int i=x;i<static_cast<int>(t.size());i+=i&-i)t[static_cast<size_t>(i)]+=v;}long long sum(int x)const{long long s=0;for(int i=x;i>0;i-=i&-i)s+=t[static_cast<size_t>(i)];return s;}private:vector<long long>t;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;cin>>n;vector<int>ability(static_cast<size_t>(n+1));for(int i=1;i<=n;++i)cin>>ability[static_cast<size_t>(i)];vector<vector<int>>children(static_cast<size_t>(n+1));for(int i=2;i<=n;++i){int p;cin>>p;children[static_cast<size_t>(p)].push_back(i);}vector<int>tin(static_cast<size_t>(n+1)),tout(static_cast<size_t>(n+1)),it(static_cast<size_t>(n+1)),st{1};int timer=0;while(!st.empty()){int x=st.back();if(it[static_cast<size_t>(x)]==0)tin[static_cast<size_t>(x)]=++timer;if(it[static_cast<size_t>(x)]<static_cast<int>(children[static_cast<size_t>(x)].size()))st.push_back(children[static_cast<size_t>(x)][static_cast<size_t>(it[static_cast<size_t>(x)]++)]);else{tout[static_cast<size_t>(x)]=timer;st.pop_back();}}vector<int>order(static_cast<size_t>(n));iota(order.begin(),order.end(),1);sort(order.begin(),order.end(),[&](int x,int y){return ability[static_cast<size_t>(x)]>ability[static_cast<size_t>(y)];});Fenwick bit(n);vector<long long>ans(static_cast<size_t>(n+1));for(int i=0;i<n;){int j=i;while(j<n&&ability[static_cast<size_t>(order[static_cast<size_t>(j)])]==ability[static_cast<size_t>(order[static_cast<size_t>(i)])])++j;for(int k=i;k<j;++k){int x=order[static_cast<size_t>(k)];ans[static_cast<size_t>(x)]=bit.sum(tout[static_cast<size_t>(x)])-bit.sum(tin[static_cast<size_t>(x)]);}for(int k=i;k<j;++k)bit.add(tin[static_cast<size_t>(order[static_cast<size_t>(k)])],1);i=j;}for(int i=1;i<=n;++i)cout<<ans[static_cast<size_t>(i)]<<'\n';}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  class Fenwick{public:explicit Fenwick(int n):t(static_cast<size_t>(n+1)){}void add(int x,long long v){for(int i=x;i<static_cast<int>(t.size());i+=i&-i)t[static_cast<size_t>(i)]+=v;}long long sum(int x)const{long long s=0;for(int i=x;i>0;i-=i&-i)s+=t[static_cast<size_t>(i)];return s;}private:vector<long long>t;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;cin>>n;vector<int>ability(static_cast<size_t>(n+1));for(int i=1;i<=n;++i)cin>>ability[static_cast<size_t>(i)];vector<vector<int>>children(static_cast<size_t>(n+1));for(int i=2;i<=n;++i){int p;cin>>p;children[static_cast<size_t>(p)].push_back(i);}vector<int>tin(static_cast<size_t>(n+1)),tout(static_cast<size_t>(n+1)),it(static_cast<size_t>(n+1)),st{1};int timer=0;while(!st.empty()){int x=st.back();if(it[static_cast<size_t>(x)]==0)tin[static_cast<size_t>(x)]=++timer;if(it[static_cast<size_t>(x)]<static_cast<int>(children[static_cast<size_t>(x)].size()))st.push_back(children[static_cast<size_t>(x)][static_cast<size_t>(it[static_cast<size_t>(x)]++)]);else{tout[static_cast<size_t>(x)]=timer;st.pop_back();}}vector<int>order(static_cast<size_t>(n));iota(order.begin(),order.end(),1);sort(order.begin(),order.end(),[&](int x,int y){return ability[static_cast<size_t>(x)]>ability[static_cast<size_t>(y)];});Fenwick bit(n);vector<long long>ans(static_cast<size_t>(n+1));for(int i=0;i<n;){int j=i;while(j<n&&ability[static_cast<size_t>(order[static_cast<size_t>(j)])]==ability[static_cast<size_t>(order[static_cast<size_t>(i)])])++j;for(int k=i;k<j;++k){int x=order[static_cast<size_t>(k)];ans[static_cast<size_t>(x)]=bit.sum(tout[static_cast<size_t>(x)])-bit.sum(tin[static_cast<size_t>(x)]);}for(int k=i;k<j;++k)bit.add(tin[static_cast<size_t>(order[static_cast<size_t>(k)])],1);i=j;}for(int i=1;i<=n;++i)cout<<ans[static_cast<size_t>(i)]<<'\n';}
external_url: https://www.luogu.com.cn/problem/P3605
external_platform: Luogu
external_problem_id: P3605
external_title: 洛谷 P3605 [USACO17JAN] Promotion Counting P
external_relation: original
source_book_pages:
  - 151
  - 170
source_pdf_pages:
  - 169
  - 188
review_status: verified
---

本卡片依外部題面與限制獨立整理。
