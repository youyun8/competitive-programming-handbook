---
id: luogu-p3649
volume: lower
source_file: lower-volume
title: 洛谷 P3649 APIO2014 迴文串
chapter: 9
section: '9.4'
kind: external-oj
difficulty: 5
topics: [palindromic-tree, occurrence-propagation, fail-tree]
prerequisites: [palindromic-tree, failure-link]
statement: '定義回文子串的存在值為其長度乘在原字串中的出現次數，求最大存在值。'
constraints:
  - '1 <= |s| <= 300000'
  - 's 只含小寫英文字母'
input_format: '一行非空字串。'
output_format: '輸出所有回文子串的最大存在值。'
samples:
  - input: "www\n"
    output: '4'
    explanation: '迴文 w 出現三次得 3，ww 出現兩次且長 2 得 4，www 得 3，最大為 4。'
core_knowledge:
  - 'palindromic-tree'
  - 'occurrence-propagation'
  - 'fail-tree'
judgment: '輸出所有回文子串的最大存在值。'
hints:
  - '每次插入字元時，last 對應的迴文在此位置出現一次。'
  - '較長迴文每次出現也使其 fail 所代表的迴文後綴出現一次。'
  - '按節點長度由大到小把 count 加到 fail，再最大化 len*count。'
solution_outline: '建 PAM 記 last 次數，以長度排序逆序沿 fail 聚合，掃節點計算乘積。'
proof_or_invariant: '每個回文區間在其右端使恰一個 last 節點加一；該區間的全部迴文後綴沿 fail 鏈排列。逆序聚合把每次出現傳給所有後綴且不重複，因此 count 精確。'
common_errors:
  - 'clone 式誤解 PAM 節點'
  - '正序聚合 fail'
  - '乘積用 32 位'
complexity:
  time: 'O(n+alphabet*n)'
  space: 'O(n*26)'
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);/* TODO：完成 PAM 狀態與轉移。*/return 0;}
cpp_solution: |
  #include <algorithm>
  #include <array>
  #include <iostream>
  #include <string>
  #include <vector>
  using namespace std;
  struct Node{array<int,26> next{};int fail=0;int length=0;long long count=0;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);string s;cin>>s;vector<Node>a(2);a[0].fail=1;a[1].fail=1;a[1].length=-1;string text="#";int last=0;for(char ch:s){text+=ch;int pos=static_cast<int>(text.size())-1,p=last,c=ch-'a';while(text[static_cast<size_t>(pos-a[static_cast<size_t>(p)].length-1)]!=ch)p=a[static_cast<size_t>(p)].fail;if(a[static_cast<size_t>(p)].next[static_cast<size_t>(c)]==0){int created=static_cast<int>(a.size()),q=a[static_cast<size_t>(p)].fail;a.push_back({});a[static_cast<size_t>(created)].length=a[static_cast<size_t>(p)].length+2;while(text[static_cast<size_t>(pos-a[static_cast<size_t>(q)].length-1)]!=ch)q=a[static_cast<size_t>(q)].fail;a[static_cast<size_t>(created)].fail=a[static_cast<size_t>(q)].next[static_cast<size_t>(c)];a[static_cast<size_t>(p)].next[static_cast<size_t>(c)]=created;}last=a[static_cast<size_t>(p)].next[static_cast<size_t>(c)];++a[static_cast<size_t>(last)].count;}vector<int>order;for(size_t i=2;i<a.size();++i)order.push_back(static_cast<int>(i));sort(order.begin(),order.end(),[&](int x,int y){return a[static_cast<size_t>(x)].length>a[static_cast<size_t>(y)].length;});long long answer=0;for(int u:order){answer=max(answer,a[static_cast<size_t>(u)].count*a[static_cast<size_t>(u)].length);a[static_cast<size_t>(a[static_cast<size_t>(u)].fail)].count+=a[static_cast<size_t>(u)].count;}cout<<answer<<'\n';}
external_url: https://www.luogu.com.cn/problem/P3649
external_platform: 洛谷
external_problem_id: 'P3649'
external_title: '洛谷 P3649 APIO2014 迴文串'
external_relation: original
source_book_pages: [580, 595]
source_pdf_pages: [210, 225]
review_status: verified
---

迴文樹把所有本質不同的迴文壓成線性數量狀態。
