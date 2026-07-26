---
id: luogu-p4762
volume: lower
source_file: lower-volume
title: 洛谷 P4762 CERC2014 Virus synthesis
chapter: 9
section: '9.4'
kind: external-oj
difficulty: 5
topics: [palindromic-tree, half-link, dynamic-programming]
prerequisites: [palindromic-tree, failure-link]
statement: '從空序列開始，每步可在任一端加一字元，或複製目前序列、反轉後貼到任一端；求合成指定 DNA 的最少操作。'
constraints:
  - '1 <= T'
  - '每字串長度不超過 100000'
  - '字元只含 A C G T'
input_format: '第一行 T，接著每組一行 DNA 字串。'
output_format: '每組輸出最少操作數。'
samples:
  - input: "3\nA\nAA\nAGGA\n"
    output: "1\n2\n3"
    explanation: 'A 一次加入；AA 可先加入 A 再複製；AGGA 可先做 AG 再反轉複製。'
core_knowledge:
  - 'palindromic-tree'
  - 'half-link'
  - 'dynamic-programming'
judgment: '每組輸出最少操作數。'
hints:
  - '最後一次複製得到的部分必構成某個偶長迴文核心，其餘邊角可逐字加入。'
  - 'PAM 節點 u 維護最長不超過 len[u]/2 的迴文後綴 half[u]。'
  - 'dp[u] 可由 Trie 父回文加一字元，或先造 half、補滿一半再複製一次；最後加 n-len[u] 邊角。'
solution_outline: '建 DNA 的 PAM 與 half；按 PAM Trie 從短到長 DP，取 dp[parent]+1 與 dp[half]+1+len/2-len[half]，全節點更新 n-len+dp。'
proof_or_invariant: '任一使用複製的最後核心必是目標的某個迴文子串；複製前可取其半段中的最長迴文後綴，較短選擇不會更優。兩個轉移涵蓋逐字擴展與最後複製，外部字元逐一補齊，故最小值完備。'
common_errors:
  - '把複製操作當成原串直接重複而非反轉'
  - '奇長節點套用半段複製轉移'
  - '忘記核心外 n-len 個字元成本'
complexity:
  time: 'O(n)'
  space: 'O(n*4)'
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);/* TODO：完成 PAM 狀態與轉移。*/return 0;}
cpp_solution: |
  #include <algorithm>
  #include <array>
  #include <iostream>
  #include <queue>
  #include <string>
  #include <vector>
  using namespace std;
  struct Node{array<int,4> next{};int fail=0;int length=0;int half=0;int cost=0;};
  static int code(char c){if(c=='A')return 0;if(c=='C')return 1;if(c=='G')return 2;return 3;}
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int tests=0;cin>>tests;while(tests--){string s;cin>>s;int n=static_cast<int>(s.size());vector<Node>a(2);a[0].fail=1;a[1].fail=1;a[1].length=-1;vector<int>text(1,-1);int last=0;for(char ch:s){int c=code(ch);text.push_back(c);int pos=static_cast<int>(text.size())-1,p=last;auto ok=[&](int u){return text[static_cast<size_t>(pos-a[static_cast<size_t>(u)].length-1)]==c;};while(!ok(p))p=a[static_cast<size_t>(p)].fail;if(a[static_cast<size_t>(p)].next[static_cast<size_t>(c)]==0){int created=static_cast<int>(a.size()),q=a[static_cast<size_t>(p)].fail;a.push_back({});a[static_cast<size_t>(created)].length=a[static_cast<size_t>(p)].length+2;a[static_cast<size_t>(created)].cost=a[static_cast<size_t>(created)].length;while(!ok(q))q=a[static_cast<size_t>(q)].fail;a[static_cast<size_t>(created)].fail=a[static_cast<size_t>(q)].next[static_cast<size_t>(c)];a[static_cast<size_t>(p)].next[static_cast<size_t>(c)]=created;if(a[static_cast<size_t>(created)].length<=2)a[static_cast<size_t>(created)].half=a[static_cast<size_t>(created)].fail;else{q=a[static_cast<size_t>(p)].half;while(!ok(q)||(a[static_cast<size_t>(q)].length+2)*2>a[static_cast<size_t>(created)].length)q=a[static_cast<size_t>(q)].fail;a[static_cast<size_t>(created)].half=a[static_cast<size_t>(q)].next[static_cast<size_t>(c)];}}last=a[static_cast<size_t>(p)].next[static_cast<size_t>(c)];}int answer=n;queue<int>q;for(int c=0;c<4;++c)if(a[0].next[static_cast<size_t>(c)]!=0)q.push(a[0].next[static_cast<size_t>(c)]);while(!q.empty()){int u=q.front();q.pop();int h=a[static_cast<size_t>(u)].half;a[static_cast<size_t>(u)].cost=min(a[static_cast<size_t>(u)].cost,a[static_cast<size_t>(h)].cost+1+a[static_cast<size_t>(u)].length/2-a[static_cast<size_t>(h)].length);answer=min(answer,n-a[static_cast<size_t>(u)].length+a[static_cast<size_t>(u)].cost);for(int c=0;c<4;++c){int v=a[static_cast<size_t>(u)].next[static_cast<size_t>(c)];if(v!=0){a[static_cast<size_t>(v)].cost=min(a[static_cast<size_t>(v)].cost,a[static_cast<size_t>(u)].cost+1);q.push(v);}}}cout<<answer<<'\n';}}
external_url: https://www.luogu.com.cn/problem/P4762
external_platform: 洛谷
external_problem_id: 'P4762'
external_title: '洛谷 P4762 CERC2014 Virus synthesis'
external_relation: original
source_book_pages: [580, 595]
source_pdf_pages: [210, 225]
review_status: verified
---

迴文樹把所有本質不同的迴文壓成線性數量狀態。
