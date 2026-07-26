---
id: luogu-p4479
volume: upper
source_file: upper-volume
title: 洛谷 P4479 [BJWC2018] 第 k 大斜率
chapter: 4
section: '4.2'
kind: external-oj
difficulty: 5
topics: &id001
  - binary-search-on-answer
  - dominance-counting
  - fenwick-tree
prerequisites:
  - fenwick-tree
statement: 所有橫座標不同點對所定直線按斜率降序，輸出第 k 大斜率向下取整。
constraints:
  - n <= 100000
  - '|x_i|,|y_i| <= 100000000'
  - 只計斜率存在的點對
input_format: 輸入 n k，再給 n 個點。
output_format: 輸出第 k 大斜率的 floor。
samples:
  - input: |
      4 3
      0 0
      1 2
      2 1
      3 3
    output: |
      1
    explanation: 六條斜率排序後第三大向下取整為 1。
core_knowledge: *id001
judgment: 二分答案，每次用 BIT 計二維偏序點對。
hints:
  - 二分整數 s，計算斜率 >=s 的點對數。
  - x_i<x_j 時條件等價於 y_i-sx_i <= y_j-sx_j。
  - 按 x 分組掃描，以 BIT 計前面轉換值不大的點；同 x 不互計。
solution_outline: 二分答案，每次用 BIT 計二維偏序點對。
proof_or_invariant: 判定函數精確計數斜率至少 s 的有效點對，且隨 s 單調不增；最大滿足 count>=k 的整數即 floor。
common_errors:
  - 索引或閉區間邊界處理錯誤
  - 離線排序後遺失原詢問順序
  - 計數或乘積未使用 long long
complexity:
  time: O(n log n log C)
  space: O(n)
cpp_skeleton: |
  // TODO：依提示補完核心資料結構。
  #include <bits/stdc++.h>
  using namespace std;
  class Fenwick{public:explicit Fenwick(int n):t(static_cast<size_t>(n+1)){}void add(int x,long long v){for(int i=x;i<static_cast<int>(t.size());i+=i&-i)t[static_cast<size_t>(i)]+=v;}long long sum(int x)const{long long s=0;for(int i=x;i>0;i-=i&-i)s+=t[static_cast<size_t>(i)];return s;}private:vector<long long>t;};
  struct Point{long long x,y,v;};int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;long long k;cin>>n>>k;vector<Point>p(static_cast<size_t>(n));for(auto&z:p)cin>>z.x>>z.y;sort(p.begin(),p.end(),[](const Point&a,const Point&b){return a.x<b.x;});auto count_at_least=[&](long long slope){vector<long long>vals;vals.reserve(p.size());for(auto&z:p){z.v=z.y-slope*z.x;vals.push_back(z.v);}sort(vals.begin(),vals.end());vals.erase(unique(vals.begin(),vals.end()),vals.end());Fenwick bit(n);long long count=0;for(int i=0;i<n;){int j=i;while(j<n&&p[static_cast<size_t>(j)].x==p[static_cast<size_t>(i)].x)++j;for(int t=i;t<j;++t){int rank=static_cast<int>(upper_bound(vals.begin(),vals.end(),p[static_cast<size_t>(t)].v)-vals.begin());count+=bit.sum(rank);}for(int t=i;t<j;++t){int rank=static_cast<int>(lower_bound(vals.begin(),vals.end(),p[static_cast<size_t>(t)].v)-vals.begin())+1;bit.add(rank,1);}i=j;}return count;};long long low=-200000000,high=200000000,answer=low;while(low<=high){long long mid=low+(high-low)/2;if(count_at_least(mid)>=k){answer=mid;low=mid+1;}else high=mid-1;}cout<<answer<<'\n';}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  class Fenwick{public:explicit Fenwick(int n):t(static_cast<size_t>(n+1)){}void add(int x,long long v){for(int i=x;i<static_cast<int>(t.size());i+=i&-i)t[static_cast<size_t>(i)]+=v;}long long sum(int x)const{long long s=0;for(int i=x;i>0;i-=i&-i)s+=t[static_cast<size_t>(i)];return s;}private:vector<long long>t;};
  struct Point{long long x,y,v;};int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;long long k;cin>>n>>k;vector<Point>p(static_cast<size_t>(n));for(auto&z:p)cin>>z.x>>z.y;sort(p.begin(),p.end(),[](const Point&a,const Point&b){return a.x<b.x;});auto count_at_least=[&](long long slope){vector<long long>vals;vals.reserve(p.size());for(auto&z:p){z.v=z.y-slope*z.x;vals.push_back(z.v);}sort(vals.begin(),vals.end());vals.erase(unique(vals.begin(),vals.end()),vals.end());Fenwick bit(n);long long count=0;for(int i=0;i<n;){int j=i;while(j<n&&p[static_cast<size_t>(j)].x==p[static_cast<size_t>(i)].x)++j;for(int t=i;t<j;++t){int rank=static_cast<int>(upper_bound(vals.begin(),vals.end(),p[static_cast<size_t>(t)].v)-vals.begin());count+=bit.sum(rank);}for(int t=i;t<j;++t){int rank=static_cast<int>(lower_bound(vals.begin(),vals.end(),p[static_cast<size_t>(t)].v)-vals.begin())+1;bit.add(rank,1);}i=j;}return count;};long long low=-200000000,high=200000000,answer=low;while(low<=high){long long mid=low+(high-low)/2;if(count_at_least(mid)>=k){answer=mid;low=mid+1;}else high=mid-1;}cout<<answer<<'\n';}
external_url: https://www.luogu.com.cn/problem/P4479
external_platform: Luogu
external_problem_id: P4479
external_title: 洛谷 P4479 [BJWC2018] 第 k 大斜率
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
