---
volume: lower
source_file: lower-volume
chapter: 6
section: '6.3'
kind: external-oj
review_status: verified
external_relation: original
source_book_pages:
  - 387
  - 461
source_pdf_pages:
  - 17
  - 91
id: luogu-p1962
title: 洛谷 P1962 斐波那契數列
difficulty: 2
topics:
  - 費波那契快速倍增
prerequisites:
  - 模運算
statement: 定義 F_1=F_2=1、F_n=F_{n-1}+F_{n-2}，求 F_n mod 1000000007。
constraints:
  - 1 <= n < 2^63
input_format: 一行一個正整數 n。
output_format: 輸出 F_n mod 1000000007。
samples:
  - input: |
      6
    output: |
      8
    explanation: 數列前六項為 1、1、2、3、5、8。
core_knowledge:
  - 快速倍增公式
  - 二分索引
judgment: n 可達 64 位範圍，使用把索引減半的快速倍增。
hints:
  - 同時求 F_k 與 F_{k+1}，才能從 k 推到 2k。
  - F_{2k}=F_k(2F_{k+1}-F_k)，F_{2k+1}=F_k²+F_{k+1}²。
  - 遞迴基底回傳 (F_0,F_1)=(0,1)，奇偶索引分別組合。
solution_outline: 遞迴快速倍增並全程取模，輸出配對第一項。
proof_or_invariant: 倍增公式由費波那契加法公式導出；每層回傳配對定義不變，索引每次折半，最終正確。
complexity:
  time: O(log n)
  space: O(log n)
common_errors:
  - 題目 F_1=1 卻輸出 F_{n-1}
  - 模減法未正規化
  - 用有號位移處理接近 2^63 的 n
cpp_skeleton: >-
  #include <bits/stdc++.h>

  using namespace std;static const long long M=1000000007;static pair<long long,long long> f(unsigned long long
  n){if(!n)return {0,1};auto h=f(n/2);long long a=h.first,b=h.second,c=a*((2*b-a+M)%M)%M,d=(a*a+b*b)%M;return
  n&1ULL?make_pair(d,(c+d)%M):make_pair(c,d);}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);unsigned long long
  n;if(cin>>n)cout<<f(n).first<<'\n';return 0;}
cpp_solution: >-
  #include <bits/stdc++.h>

  using namespace std;static const long long M=1000000007;static pair<long long,long long> f(unsigned long long
  n){if(!n)return {0,1};auto h=f(n/2);long long a=h.first,b=h.second,c=a*((2*b-a+M)%M)%M,d=(a*a+b*b)%M;return
  n&1ULL?make_pair(d,(c+d)%M):make_pair(c,d);}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);unsigned long long
  n;if(cin>>n)cout<<f(n).first<<'\n';return 0;}
external_url: https://www.luogu.com.cn/problem/P1962
external_platform: Luogu
external_problem_id: P1962
external_title: 斐波那契數列
---

快速倍增比通用矩陣更精簡，但本質同樣是二分合併轉移。
