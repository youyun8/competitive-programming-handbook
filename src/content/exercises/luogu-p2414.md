---
id: luogu-p2414
volume: lower
source_file: lower-volume
title: 洛谷 P2414 阿狸的打字機
chapter: 9
section: '9.6'
kind: external-oj
difficulty: 5
topics: [aho-corasick, fail-tree, fenwick-tree, offline-queries]
prerequisites: [ac-automaton, fenwick-tree, dfs-order]
statement: 操作串中，小寫字母在尾端輸入、B 刪除末字元、P 列印目前字串；對每個詢問 (x,y)，求第 x 個列印字串在第 y 個列印字串中的重疊出現次數。
constraints: ['列印字串數 n <= 10^5', '詢問數 m <= 10^5', '操作串總長 <= 10^5']
input_format: 第一行操作串，第二行詢問數 m，接著 m 行 x、y。
output_format: 依詢問順序每行輸出出現次數。
samples:
  - input: "aPaPBbP\n3\n1 2\n1 3\n2 3\n"
    output: "2\n1\n0"
    explanation: 列印字串依序為 a、aa、ab；另以直接 substring 比對隨機短操作串對拍。
core_knowledge: [操作 Trie, fail 樹子樹, DFS 序, 樹狀陣列]
judgment: 出現允許重疊；P 不改目前字串，B 保證操作合法。
hints:
  - 操作過程天然建出 Trie，記錄每次 P 所在節點以及每個字母節點的父親。
  - 模式 x 在文本 y 某前綴位置出現，當且僅當該位置節點位於 x 終點的 fail 子樹。
  - DFS 操作 Trie 時維護目前根到節點路徑；把路徑節點的 fail-DFS 序加入 BIT，即可在 y 終點回答 x 子樹和。
solution_outline: 由操作串建 Trie 與列印終點，建立 AC fail 樹並求 DFS 區間。把詢問按 y 離線；遍歷原 Trie，進入/離開節點時在 BIT 對其 fail 序加一/減一，在列印節點用 x 終點的 fail 子樹區間和回答。
proof_or_invariant: 遍歷到 y 節點時，BIT 中恰含 y 的所有前綴終點。某前綴以 x 結尾等價於其 AC 節點沿 fail 可達 x，即位於 x 的 fail 子樹；區間和因此逐一計數所有出現位置。
common_errors: [建 AC 後把補齊轉移當原 Trie 子邊遍歷, P 後錯誤清空目前字串, Trie DFS 回溯時忘記 BIT 減一]
complexity: { time: 'O((|ops|+m)log|ops|)', space: 'O(|ops|×26+m)' }
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);/* TODO：fail 子樹 DFS 序 + 操作 Trie 離線 BIT。*/return 0;}
cpp_solution: |
  #include <array>
  #include <iostream>
  #include <queue>
  #include <string>
  #include <tuple>
  #include <utility>
  #include <vector>
  using namespace std;
  struct Node{array<int,26> next{};int fail=0;int parent=0;vector<int>children;vector<int>prints;};
  struct Fenwick{vector<int>tree;explicit Fenwick(size_t n):tree(n+1){}void add(int p,int v){for(size_t i=static_cast<size_t>(p);i<tree.size();i+=i&(~i+1))tree[i]+=v;}int sum(int p)const{int r=0;for(size_t i=static_cast<size_t>(p);i>0;i-=i&(~i+1))r+=tree[i];return r;}};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);string ops;cin>>ops;vector<Node>a(1);vector<int>printed(1);int current=0;for(char ch:ops){if(ch=='B')current=a[static_cast<size_t>(current)].parent;else if(ch=='P'){printed.push_back(current);a[static_cast<size_t>(current)].prints.push_back(static_cast<int>(printed.size())-1);}else{size_t c=static_cast<size_t>(ch-'a');if(a[static_cast<size_t>(current)].next[c]==0){int child=static_cast<int>(a.size());a[static_cast<size_t>(current)].next[c]=child;a.push_back({});a.back().parent=current;a[static_cast<size_t>(current)].children.push_back(child);}current=a[static_cast<size_t>(current)].next[c];}}queue<int>q;for(size_t c=0;c<26;++c)if(a[0].next[c]!=0)q.push(a[0].next[c]);vector<vector<int>>fail_tree(a.size());while(!q.empty()){int u=q.front();q.pop();fail_tree[static_cast<size_t>(a[static_cast<size_t>(u)].fail)].push_back(u);for(size_t c=0;c<26;++c){int&v=a[static_cast<size_t>(u)].next[c];if(v!=0){a[static_cast<size_t>(v)].fail=a[static_cast<size_t>(a[static_cast<size_t>(u)].fail)].next[c];q.push(v);}else v=a[static_cast<size_t>(a[static_cast<size_t>(u)].fail)].next[c];}}vector<int>tin(a.size()),tout(a.size());int timer=0;vector<pair<int,bool>>stack{{0,true}};while(!stack.empty()){auto [u,enter]=stack.back();stack.pop_back();if(enter){tin[static_cast<size_t>(u)]=++timer;stack.push_back({u,false});for(int v:fail_tree[static_cast<size_t>(u)])stack.push_back({v,true});}else tout[static_cast<size_t>(u)]=timer;}int query_count=0;cin>>query_count;vector<vector<pair<int,int>>>queries(printed.size());vector<int>answer(static_cast<size_t>(query_count));for(int i=0;i<query_count;++i){int x=0,y=0;cin>>x>>y;queries[static_cast<size_t>(y)].push_back({x,i});}Fenwick bit(a.size()+2);stack={{0,true}};while(!stack.empty()){auto [u,enter]=stack.back();stack.pop_back();if(enter){bit.add(tin[static_cast<size_t>(u)],1);for(int print_id:a[static_cast<size_t>(u)].prints)for(auto [x,id]:queries[static_cast<size_t>(print_id)]){int node=printed[static_cast<size_t>(x)];answer[static_cast<size_t>(id)]=bit.sum(tout[static_cast<size_t>(node)])-bit.sum(tin[static_cast<size_t>(node)]-1);}stack.push_back({u,false});for(int v:a[static_cast<size_t>(u)].children)stack.push_back({v,true});}else bit.add(tin[static_cast<size_t>(u)],-1);}for(int value:answer)cout<<value<<'\n';}
external_url: https://www.luogu.com.cn/problem/P2414
external_platform: 洛谷
external_problem_id: P2414
external_title: '[NOI2011] 阿狸的打字機'
external_relation: original
source_book_pages: [579, 586]
source_pdf_pages: [209, 216]
review_status: verified
---

同一批節點同時屬於操作 Trie 路徑與 fail 樹子樹；DFS 序與 BIT 正好把兩種關係交會起來。
