---
id: openj-bailian-2299
volume: upper
source_file: upper-volume
title: OpenJudge 百練 2299 Ultra-QuickSort：逆序對
chapter: 4
section: '4.2'
kind: external-oj
difficulty: 4
topics: &id001
  - merge-sort
  - inversion-count
prerequisites:
  - fenwick-tree
statement: 相鄰交換直到嚴格不同的序列升序，求最少交換次數。
constraints:
  - n < 500000
  - 元素互異且介於 0 到 999999999
  - n=0 結束
input_format: 多組資料；每組先給 n，再給 n 個元素。
output_format: 每組輸出最少相鄰交換數。
samples:
  - input: |
      5
      9
      1
      0
      5
      4
      3
      1
      2
      3
      0
    output: |
      6
      0
    explanation: 每次相鄰交換恰消去一個逆序，第一組共有六個逆序。
core_knowledge: *id001
judgment: 用歸併排序累加逆序對數。
hints:
  - 最少相鄰交換數與哪個序列統計量相同？
  - 分治左右半段後，只需計算跨越中點的逆序。
  - 歸併時右值先取出，代表它小於左側尚餘的全部元素。
solution_outline: 用歸併排序累加逆序對數。
proof_or_invariant: 每個逆序至少需一次相鄰交換，冒泡式交換可逐一消除，故最少次數等於逆序數；歸併精確計算三類逆序。
common_errors:
  - 索引基準或閉區間端點處理錯誤
  - 更新資料結構後忘記同步原始狀態
  - 使用 32 位元儲存可能溢位的計數或總和
complexity:
  time: O(n log n)
  space: O(n)
cpp_skeleton: |
  // TODO：先依三階段提示自行完成核心；以下框架可嚴格編譯。
  #include <bits/stdc++.h>
  using namespace std;
  static long long count_inversions(vector<long long>& a, vector<long long>& temp, int l, int r){if(r-l<=1)return 0;int m=(l+r)/2;long long ans=count_inversions(a,temp,l,m)+count_inversions(a,temp,m,r);int i=l,j=m,k=l;while(i<m||j<r){if(j==r||(i<m&&a[static_cast<size_t>(i)]<=a[static_cast<size_t>(j)]))temp[static_cast<size_t>(k++)]=a[static_cast<size_t>(i++)];else{temp[static_cast<size_t>(k++)]=a[static_cast<size_t>(j++)];ans+=m-i;}}copy(temp.begin()+l,temp.begin()+r,a.begin()+l);return ans;}
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;while(cin>>n&&n!=0){vector<long long>a(static_cast<size_t>(n)),temp(static_cast<size_t>(n));for(auto&x:a)cin>>x;cout<<count_inversions(a,temp,0,n)<<'\n';}}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  static long long count_inversions(vector<long long>& a, vector<long long>& temp, int l, int r){if(r-l<=1)return 0;int m=(l+r)/2;long long ans=count_inversions(a,temp,l,m)+count_inversions(a,temp,m,r);int i=l,j=m,k=l;while(i<m||j<r){if(j==r||(i<m&&a[static_cast<size_t>(i)]<=a[static_cast<size_t>(j)]))temp[static_cast<size_t>(k++)]=a[static_cast<size_t>(i++)];else{temp[static_cast<size_t>(k++)]=a[static_cast<size_t>(j++)];ans+=m-i;}}copy(temp.begin()+l,temp.begin()+r,a.begin()+l);return ans;}
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;while(cin>>n&&n!=0){vector<long long>a(static_cast<size_t>(n)),temp(static_cast<size_t>(n));for(auto&x:a)cin>>x;cout<<count_inversions(a,temp,0,n)<<'\n';}}
external_url: http://bailian.openjudge.cn/practice/2299/
external_platform: OpenJ_Bailian
external_problem_id: '2299'
external_title: OpenJudge 百練 2299 Ultra-QuickSort
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
