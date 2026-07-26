---
id: luogu-p4588
volume: upper
source_file: upper-volume
title: 洛谷 P4588 [TJOI2018] 數學計算
chapter: 4
section: '4.3'
kind: external-oj
difficulty: 3
topics: &id001
  - product-segment-tree
  - offline-inverse
prerequisites:
  - segment-tree
statement: x 初始為一；乘上一個數或撤銷先前某次乘法，每步輸出 x mod M。
constraints:
  - T <= 5
  - Q <= 100000
  - 1 < M <= 1000000000
input_format: 每組 Q M；操作 1 m 或 2 pos。
output_format: 每步輸出目前乘積模 M。
samples:
  - input: |
      1
      4 100
      1 6
      1 7
      2 1
      1 5
    output: |
      6
      42
      7
      35
    explanation: 撤銷第一次乘法後只剩七。
core_knowledge: *id001
judgment: 維護所有仍生效乘數的區間乘積。
hints:
  - 不能假設模數下存在除法逆元。
  - 把每次乘法放在時間軸葉子。
  - 撤銷就是把對應葉改回乘法單位元一。
solution_outline: 維護所有仍生效乘數的區間乘積。
proof_or_invariant: 根乘積恰包含所有未撤銷操作；置一精確刪除指定因子且不需要模逆元。
common_errors:
  - 同座標事件順序或開閉邊界處理錯誤
  - 區間為空時仍遞迴更新
  - 合併時忘記保留跨左右區間候選
complexity:
  time: O(Q log Q)
  space: O(Q)
cpp_skeleton: |
  // TODO：依三階段提示自行完成核心。
  #include <bits/stdc++.h>
  using namespace std;static vector<long long>tr;static long long mod;static void setv(int p,int l,int r,int x,long long v){if(l==r){tr[static_cast<size_t>(p)]=v%mod;return;}int m=(l+r)/2;if(x<=m)setv(p*2,l,m,x,v);else setv(p*2+1,m+1,r,x,v);tr[static_cast<size_t>(p)]=tr[static_cast<size_t>(p*2)]*tr[static_cast<size_t>(p*2+1)]%mod;}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int T;cin>>T;while(T--){int q;cin>>q>>mod;tr.assign(static_cast<size_t>(4*q+4),1);for(int i=1;i<=q;++i){int op,x;cin>>op>>x;setv(1,1,q,op==1?i:x,op==1?x:1);cout<<tr[1]<<'\n';}}}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;static vector<long long>tr;static long long mod;static void setv(int p,int l,int r,int x,long long v){if(l==r){tr[static_cast<size_t>(p)]=v%mod;return;}int m=(l+r)/2;if(x<=m)setv(p*2,l,m,x,v);else setv(p*2+1,m+1,r,x,v);tr[static_cast<size_t>(p)]=tr[static_cast<size_t>(p*2)]*tr[static_cast<size_t>(p*2+1)]%mod;}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int T;cin>>T;while(T--){int q;cin>>q>>mod;tr.assign(static_cast<size_t>(4*q+4),1);for(int i=1;i<=q;++i){int op,x;cin>>op>>x;setv(1,1,q,op==1?i:x,op==1?x:1);cout<<tr[1]<<'\n';}}}
external_url: https://www.luogu.com.cn/problem/P4588
external_platform: 洛谷
external_problem_id: P4588
external_title: 洛谷 P4588 [TJOI2018] 數學計算
external_relation: original
source_book_pages:
  - 202
source_pdf_pages:
  - 220
review_status: verified
---

本卡片依外部題面與限制獨立整理。
