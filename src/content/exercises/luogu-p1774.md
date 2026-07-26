---
id: luogu-p1774
volume: upper
source_file: upper-volume
title: 洛谷 P1774 最接近神的人：逆序對
chapter: 4
section: '4.2'
kind: external-oj
difficulty: 2
topics: &id001
  - merge-sort
  - inversion-count
prerequisites:
  - fenwick-tree
statement: 求序列中 i<j 且 a[i]>a[j] 的配對數。
constraints:
  - n <= 500000
  - 答案使用 64 位元
input_format: 輸入 n 與 n 個整數。
output_format: 輸出逆序對數。
samples:
  - input: |
      5
      5 4 2 3 1
    output: |
      9
    explanation: 除 2<3 不是逆序外，其餘跨序配對共九個。
core_knowledge: *id001
judgment: 歸併排序計算逆序。
hints:
  - 將逆序分成左半、右半與跨中點三類。
  - 歸併時若右值較小，它小於左側所有尚未取出的值。
  - 累加剩餘左元素數並完成排序。
solution_outline: 歸併排序計算逆序。
proof_or_invariant: 遞迴涵蓋兩側逆序，合併只計跨側逆序，三類互斥且完整。
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
  static long long solve(vector<int>&a,vector<int>&tmp,int l,int r){if(r-l<=1)return 0;int m=(l+r)/2;long long ans=solve(a,tmp,l,m)+solve(a,tmp,m,r);int i=l,j=m,k=l;while(i<m||j<r){if(j==r||(i<m&&a[static_cast<size_t>(i)]<=a[static_cast<size_t>(j)]))tmp[static_cast<size_t>(k++)]=a[static_cast<size_t>(i++)];else{tmp[static_cast<size_t>(k++)]=a[static_cast<size_t>(j++)];ans+=m-i;}}copy(tmp.begin()+l,tmp.begin()+r,a.begin()+l);return ans;}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;cin>>n;vector<int>a(static_cast<size_t>(n)),tmp(static_cast<size_t>(n));for(int&x:a)cin>>x;cout<<solve(a,tmp,0,n)<<'\n';}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  static long long solve(vector<int>&a,vector<int>&tmp,int l,int r){if(r-l<=1)return 0;int m=(l+r)/2;long long ans=solve(a,tmp,l,m)+solve(a,tmp,m,r);int i=l,j=m,k=l;while(i<m||j<r){if(j==r||(i<m&&a[static_cast<size_t>(i)]<=a[static_cast<size_t>(j)]))tmp[static_cast<size_t>(k++)]=a[static_cast<size_t>(i++)];else{tmp[static_cast<size_t>(k++)]=a[static_cast<size_t>(j++)];ans+=m-i;}}copy(tmp.begin()+l,tmp.begin()+r,a.begin()+l);return ans;}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;cin>>n;vector<int>a(static_cast<size_t>(n)),tmp(static_cast<size_t>(n));for(int&x:a)cin>>x;cout<<solve(a,tmp,0,n)<<'\n';}
external_url: https://www.luogu.com.cn/problem/P1774
external_platform: Luogu
external_problem_id: P1774
external_title: 洛谷 P1774 最接近神的人：逆序對
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
