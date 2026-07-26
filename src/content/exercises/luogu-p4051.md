---
id: luogu-p4051
volume: lower
source_file: lower-volume
title: 洛谷 P4051 字符加密
chapter: 9
section: '9.7'
kind: external-oj
difficulty: 3
topics: [cyclic-shifts, suffix-array, burrows-wheeler-transform]
prerequisites: [suffix-array]
statement: 列出字串的所有循環位移並按字典序排序，依序輸出每個位移的最後一個字元。
constraints: ['1 <= |S| <= 100000', '字串可含字母、數字與符號', '輸入為單行非空字串']
input_format: 一行欲加密字串。
output_format: 一行加密後字串。
samples:
  - input: "JSOI07\n"
    output: I0O7SJ
    explanation: 官方範例的六個循環位移排序後末欄依序為 I0O7SJ；另以直接產生並排序短字串循環位移對拍。
core_knowledge: [循環位移排序, 倍增排名, BWT 末欄]
judgment: 相同循環位移仍各占一列；比較採字元實際位元組值。
hints:
  - 第 k 輪已知長度 2^k 的循環片段排名，下一輪以 (rank[i],rank[(i+len)%n]) 排序。
  - 排名完全不同或片段長度已覆蓋整個環後，order 就是循環位移順序。
  - 起點 i 的位移最後字元位於 (i+n−1)%n。
solution_outline: 以單字元初始化循環位移排名，每輪倍增片段長度並按兩個排名排序、重編等價類；完成後依 order 輸出每個起點的前一字元。
proof_or_invariant: 每輪排名相等當且僅當兩起點長度 len 的循環片段相同；兩個相鄰 len 片段唯一組成長度 2len 片段，故雙關鍵字排序維持不變量。len>=n 時比較已涵蓋整個位移，順序正確。
common_errors: [排序普通後綴而未處理環, 輸出首字元而非末字元, 相同位移被去重]
complexity: { time: 'O(n log²n)', space: 'O(n)' }
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);/* TODO：倍增排序所有循環位移並輸出末欄。*/return 0;}
cpp_solution: |
  #include <algorithm>
  #include <iostream>
  #include <numeric>
  #include <string>
  #include <utility>
  #include <vector>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);string s;cin>>s;int n=static_cast<int>(s.size());vector<int>order(static_cast<size_t>(n)),rank_of(static_cast<size_t>(n)),next_rank(static_cast<size_t>(n));iota(order.begin(),order.end(),0);for(int i=0;i<n;++i)rank_of[static_cast<size_t>(i)]=static_cast<unsigned char>(s[static_cast<size_t>(i)]);for(int length=1;length<n;length<<=1){sort(order.begin(),order.end(),[&](int x,int y){return pair<int,int>{rank_of[static_cast<size_t>(x)],rank_of[static_cast<size_t>((x+length)%n)]}<pair<int,int>{rank_of[static_cast<size_t>(y)],rank_of[static_cast<size_t>((y+length)%n)]};});next_rank[static_cast<size_t>(order[0])]=0;for(int i=1;i<n;++i){int x=order[static_cast<size_t>(i-1)],y=order[static_cast<size_t>(i)];pair<int,int>left{rank_of[static_cast<size_t>(x)],rank_of[static_cast<size_t>((x+length)%n)]},right{rank_of[static_cast<size_t>(y)],rank_of[static_cast<size_t>((y+length)%n)]};next_rank[static_cast<size_t>(y)]=next_rank[static_cast<size_t>(x)]+(left!=right);}rank_of=next_rank;}for(int start:order)cout<<s[static_cast<size_t>((start+n-1)%n)];cout<<'\n';}
external_url: https://www.luogu.com.cn/problem/P4051
external_platform: 洛谷
external_problem_id: P4051
external_title: '[JSOI2007] 字符加密'
external_relation: original
source_book_pages: [587, 595]
source_pdf_pages: [217, 225]
review_status: verified
---

這正是循環位移矩陣的最後一欄；不必真的建立矩陣，只需排序各列起點。
