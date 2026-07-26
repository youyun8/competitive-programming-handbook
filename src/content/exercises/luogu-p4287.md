---
id: luogu-p4287
volume: lower
source_file: lower-volume
title: 洛谷 P4287 SHOI2011 雙倍迴文
chapter: 9
section: '9.4'
kind: external-oj
difficulty: 5
topics: [palindromic-tree, half-link, double-palindrome]
prerequisites: [palindromic-tree, failure-link]
statement: '雙倍迴文可寫成 w reverse(w) w reverse(w)；求輸入中最長雙倍迴文子串長度。'
constraints:
  - '1 <= n <= 500000'
  - '字串只含小寫英文字母'
input_format: '第一行 n，第二行字串。'
output_format: '輸出最長長度；不存在輸出 0。'
samples:
  - input: "8\nabbaabba\n"
    output: '8'
    explanation: 'abbaabba 可取 w=ab，寫成 ab+ba+ab+ba，整段是雙倍迴文。'
core_knowledge:
  - 'palindromic-tree'
  - 'half-link'
  - 'double-palindrome'
judgment: '輸出最長長度；不存在輸出 0。'
hints:
  - '候選本身必為長度 4 的倍數的迴文。'
  - '它的後半段也須是長度恰為一半的迴文後綴。'
  - '為每個 PAM 節點維護不超過自身一半的最長迴文後綴 half；長度恰一半即合法。'
solution_outline: '建 PAM 時由父節點 half 與 fail 鏈求新節點 half，對每個新或既有 last 檢查長度條件。'
proof_or_invariant: 'PAM 包含所有本質迴文；雙倍迴文的後半恰是其長度一半的迴文後綴。half 定義保證若存在此長度後綴就必被選中，因此兩項長度檢查充要。'
common_errors:
  - '只檢查整串迴文未檢查一半'
  - '漏掉長度須整除 4'
  - 'half 跳轉超過一半'
complexity:
  time: 'O(n)'
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
  struct Node{array<int,26> next{};int fail=0;int length=0;int half=0;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n=0;string s;cin>>n>>s;vector<Node>a(2);a[0].fail=1;a[1].fail=1;a[1].length=-1;string text="#";int last=0,answer=0;for(char ch:s){text+=ch;int pos=static_cast<int>(text.size())-1,p=last,c=ch-'a';auto extendable=[&](int u){return text[static_cast<size_t>(pos-a[static_cast<size_t>(u)].length-1)]==ch;};while(!extendable(p))p=a[static_cast<size_t>(p)].fail;if(a[static_cast<size_t>(p)].next[static_cast<size_t>(c)]==0){int created=static_cast<int>(a.size()),q=a[static_cast<size_t>(p)].fail;a.push_back({});a[static_cast<size_t>(created)].length=a[static_cast<size_t>(p)].length+2;while(!extendable(q))q=a[static_cast<size_t>(q)].fail;a[static_cast<size_t>(created)].fail=a[static_cast<size_t>(q)].next[static_cast<size_t>(c)];a[static_cast<size_t>(p)].next[static_cast<size_t>(c)]=created;if(a[static_cast<size_t>(created)].length<=2)a[static_cast<size_t>(created)].half=a[static_cast<size_t>(created)].fail;else{q=a[static_cast<size_t>(p)].half;while(!extendable(q)||(a[static_cast<size_t>(q)].length+2)*2>a[static_cast<size_t>(created)].length)q=a[static_cast<size_t>(q)].fail;a[static_cast<size_t>(created)].half=a[static_cast<size_t>(q)].next[static_cast<size_t>(c)];}}last=a[static_cast<size_t>(p)].next[static_cast<size_t>(c)];int length=a[static_cast<size_t>(last)].length;if(length%4==0&&a[static_cast<size_t>(a[static_cast<size_t>(last)].half)].length*2==length)answer=max(answer,length);}cout<<answer<<'\n';}
external_url: https://www.luogu.com.cn/problem/P4287
external_platform: 洛谷
external_problem_id: 'P4287'
external_title: '洛谷 P4287 SHOI2011 雙倍迴文'
external_relation: original
source_book_pages: [580, 595]
source_pdf_pages: [210, 225]
review_status: verified
---

迴文樹把所有本質不同的迴文壓成線性數量狀態。
