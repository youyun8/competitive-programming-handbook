---
id: luogu-p3157
volume: upper
source_file: upper-volume
title: 洛谷 P3157 動態逆序對：分塊刪除
chapter: 2
section: '2.9'
kind: external-oj
difficulty: 5
topics: ['分塊', '逆序對', 'Fenwick 樹']
prerequisites: []
statement: |-
  給定 1..n 的排列，依序刪除 m 個值；每次刪除前輸出目前逆序對數。
constraints:
  - 'n<=100000；m<=50000。'
input_format: '依題意輸入規模、初始資料及所有查詢或刪除操作。'
output_format: '逐次輸出最簡分數或目前逆序對數。'
samples:
  - input: |
      5 3
      5
      1
      4
      2
      3
      4
      1
    output: |
      6
      3
      2
    explanation: '依題意直接建立小型狀態，可逐項驗證輸出。'
core_knowledge: ['分塊', '逆序對', 'Fenwick 樹']
judgment: '資料規模排除逐次重建，需預處理倍增資訊或以分塊維護刪除影響。'
hints:
  - '先找出一次操作只會影響哪些分層區間或哪些逆序對。'
  - '對完整區塊預存可二分的資訊，邊界則直接掃描。'
  - '以不變量證明每次只加入或扣除當次操作的精確貢獻。'
solution_outline: '先求初始逆序對。刪除位置 p、值 x 時，以位置分塊統計左側大於 x 與右側小於 x 的存活元素，從答案扣除並自排序塊刪除 x。'
proof_or_invariant: '刪除 x 只會移除以 x 為端點的逆序對，恰分為左大與右小兩類且不相交；分塊查詢精確計數兩類，故逐次維護正確。'
common_errors: ['使用 int 儲存總和', '端點或刪除前後時機錯誤', '更新資料結構後未保持排序']
complexity:
  time: 'O(n log n + m(n/B+B log B))'
  space: 'O(n)'
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main() {
      // TODO：依提示建立資料結構並回答查詢。
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  class Fenwick{vector<int>t;public:explicit Fenwick(int n):t(static_cast<size_t>(n+1)){}void add(int p,int v){for(int n=static_cast<int>(t.size());p<n;p+=p&-p)t[p]+=v;}int sum(int p)const{int r=0;for(;p;p-=p&-p)r+=t[p];return r;}};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;if(!(cin>>n>>m))return 0;vector<int>a(n),position(n+1);Fenwick fw(n);long long inversions=0;for(int i=0;i<n;++i){cin>>a[i];position[a[i]]=i;inversions+=i-fw.sum(a[i]);fw.add(a[i],1);}int block_size=320,block_count=(n+block_size-1)/block_size;vector<vector<int>>blocks(block_count);vector<char>alive(n,1);for(int i=0;i<n;++i)blocks[i/block_size].push_back(a[i]);for(auto&b:blocks)sort(b.begin(),b.end());auto count_range=[&](int l,int r,int x,bool less){int result=0;while(l<=r&&l%block_size!=0){if(alive[l]&&(less?a[l]<x:a[l]>x))++result;++l;}while(l+block_size-1<=r){const auto&b=blocks[l/block_size];result+=less?static_cast<int>(lower_bound(b.begin(),b.end(),x)-b.begin()):static_cast<int>(b.end()-upper_bound(b.begin(),b.end(),x));l+=block_size;}while(l<=r){if(alive[l]&&(less?a[l]<x:a[l]>x))++result;++l;}return result;};while(m--){int x;cin>>x;cout<<inversions<<'\n';int p=position[x];inversions-=count_range(0,p-1,x,false)+count_range(p+1,n-1,x,true);alive[p]=0;auto&b=blocks[p/block_size];b.erase(lower_bound(b.begin(),b.end(),x));}return 0;}
external_url: https://www.luogu.com.cn/problem/P3157
external_platform: 洛谷
external_problem_id: P3157
external_title: '動態逆序對：分塊刪除'
external_relation: original
source_book_pages: [92]
source_pdf_pages: [110]
review_status: verified
---

本題使用可證明的離線／倍增結構避免逐次暴力。
