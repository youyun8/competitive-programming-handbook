---
id: luogu-p3709
volume: upper
source_file: upper-volume
source_book_pages: [197, 220]
source_pdf_pages: [215, 238]
chapter: 4
section: '4.5'
kind: external-oj
review_status: verified
external_relation: original
title: 洛谷 P3709 大爺的字串題：莫隊求負眾數頻次
difficulty: 4
topics: [莫隊, 值域壓縮, 頻率的頻率]
prerequisites: [mo-algorithm]
statement: 對每個區間求最少要將多少個數加一，才能使某個原有數值成為嚴格眾數。依原題等價定義，答案為區間最高出現次數的相反數。
constraints:
  - '1 <= n,m <= 200000'
  - 數值在 32 位元有號整數範圍
  - '1 <= l <= r <= n'
input_format: 第一行 n、m；第二行 n 個整數；接著 m 行詢問 l、r。
output_format: 每個詢問輸出 -max_frequency。
samples:
  - input: |
      5 3
      1 2 1 3 1
      1 5
      2 4
      4 5
    output: |
      -3
      -1
      -1
    explanation: 三個區間的最高頻率分別是 3、1、1。
core_knowledge: [莫隊, 離散化, frequency_of_frequency]
judgment: 移動窗口時僅一個值的頻率加減一；另維護每種頻率有幾個值，即可 O(1) 維持最大頻率。
hints:
  - 先離散化數值；答案只取決於出現次數。
  - 除了 count[value]，維護 count_frequency[f] 表示頻率恰為 f 的值數。
  - 移除後若目前最高頻率的桶變空，就把最高頻率減一；輸出其相反數。
solution_outline: 離線莫隊；每次增刪同步更新值頻率、頻率桶與 current_max。
proof_or_invariant: frequency_bucket[f] 始終等於窗口內頻率為 f 的離散值數；current_max 是最大非空桶，因此正是區間最高出現次數，依題意輸出負值。
complexity:
  time: O((n+m)sqrt(n)+n log n)
  space: O(n+m)
common_errors:
  - 誤把題目當成輸出眾數值
  - 移除唯一最高頻值後沒有降低 current_max
  - 未壓縮負數或大數值而直接當陣列索引
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;cin>>n>>m;vector<int>a(static_cast<size_t>(n));for(int&x:a)cin>>x;while(m--){int l,r;cin>>l>>r;map<int,int>count;int maximum=0;for(int i=l-1;i<r;++i)maximum=max(maximum,++count[a[static_cast<size_t>(i)]]);cout<<-maximum<<'\n';}}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  struct Query{int left,right,index;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;cin>>n>>m;vector<int>a(static_cast<size_t>(n+1)),values;for(int i=1;i<=n;++i){cin>>a[static_cast<size_t>(i)];values.push_back(a[static_cast<size_t>(i)]);}sort(values.begin(),values.end());values.erase(unique(values.begin(),values.end()),values.end());for(int i=1;i<=n;++i)a[static_cast<size_t>(i)]=static_cast<int>(lower_bound(values.begin(),values.end(),a[static_cast<size_t>(i)])-values.begin());vector<Query>query(static_cast<size_t>(m));for(int i=0;i<m;++i){cin>>query[static_cast<size_t>(i)].left>>query[static_cast<size_t>(i)].right;query[static_cast<size_t>(i)].index=i;}int block=max(1,static_cast<int>(sqrt(static_cast<double>(n))));sort(query.begin(),query.end(),[block](const Query&x,const Query&y){int xb=x.left/block,yb=y.left/block;return xb!=yb?xb<yb:((xb&1)!=0?x.right>y.right:x.right<y.right);});vector<int>frequency(values.size()),bucket(static_cast<size_t>(n+1)),answer(static_cast<size_t>(m));int left=1,right=0,current_max=0;auto add=[&](int position){int value=a[static_cast<size_t>(position)],old=frequency[static_cast<size_t>(value)]++;if(old>0)--bucket[static_cast<size_t>(old)];++bucket[static_cast<size_t>(old+1)];current_max=max(current_max,old+1);};auto remove=[&](int position){int value=a[static_cast<size_t>(position)],old=frequency[static_cast<size_t>(value)]--;--bucket[static_cast<size_t>(old)];if(old>1)++bucket[static_cast<size_t>(old-1)];while(current_max>0&&bucket[static_cast<size_t>(current_max)]==0)--current_max;};for(const Query&item:query){while(left>item.left)add(--left);while(right<item.right)add(++right);while(left<item.left)remove(left++);while(right>item.right)remove(right--);answer[static_cast<size_t>(item.index)]=-current_max;}for(int value:answer)cout<<value<<'\n';}
external_url: https://www.luogu.com.cn/problem/P3709
external_platform: 洛谷
external_problem_id: P3709
external_title: 大爷的字符串题
---

這題刻意以故事包裝一個簡短的等價答案；實作重點是動態維護最高頻率。
