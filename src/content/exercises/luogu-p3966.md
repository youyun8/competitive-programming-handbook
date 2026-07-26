---
id: luogu-p3966
volume: lower
source_file: lower-volume
title: 洛谷 P3966 單詞
chapter: 9
section: '9.6'
kind: external-oj
difficulty: 3
topics: [aho-corasick, fail-tree, occurrence-counting]
prerequisites: [ac-automaton]
statement: 把輸入的 n 個單詞視為一篇文章的 n 個獨立單詞，對每個單詞求它作為連續子串在整篇文章中出現的總次數。
constraints: ['n <= 200', '單詞只含小寫字母', '單詞總長不超過 10^6']
input_format: 第一行 n，接著 n 行單詞。
output_format: 依輸入順序每行輸出該單詞的總出現次數。
samples:
  - input: "3\na\naba\nba\n"
    output: "4\n1\n2"
    explanation: a 在三個單詞中共 1+2+1 次，ba 在 aba、ba 各一次；已與逐詞逐位置暴力對拍。
core_knowledge: [Trie 前綴造訪, fail 樹子樹和, 反 BFS]
judgment: 不跨越兩個單詞邊界匹配；同一單詞內重疊出現照計。
hints:
  - 插入每個單詞時，讓路徑上每個節點的計數加一。
  - 節點 v 的 fail 子樹正好收集以 v 代表字串為後綴的所有前綴位置。
  - 反 BFS 把計數加給 fail，最後讀各輸入單詞終點。
solution_outline: 所有單詞共建 Trie；插入時每經過一個節點便增加一次，等價於掃描每個單詞且在邊界重置。建 fail 後反向 BFS 聚合，輸出終點計數。
proof_or_invariant: 初始計數一一對應文章內每個單詞的所有前綴結尾；某模式在該位置出現當且僅當其終點是目前節點的 fail 祖先。逆序累加故精確把每個位置貢獻給所有匹配模式，且不會跨單詞。
common_errors: [把所有單詞直接串接而跨界匹配, 插入時只增加終點, 正向聚合 fail]
complexity: { time: 'O(單詞總長×26)', space: 'O(單詞總長×26)' }
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);/* TODO：插入路徑計數並反 BFS 聚合。*/return 0;}
cpp_solution: |
  #include <array>
  #include <iostream>
  #include <queue>
  #include <string>
  #include <vector>
  using namespace std;
  struct Node{array<int,26> next{};int fail=0;long long count=0;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n=0;cin>>n;vector<Node>a(1);vector<int>end(static_cast<size_t>(n));for(int i=0;i<n;++i){string s;cin>>s;int u=0;for(char ch:s){size_t c=static_cast<size_t>(ch-'a');if(a[static_cast<size_t>(u)].next[c]==0){a[static_cast<size_t>(u)].next[c]=static_cast<int>(a.size());a.push_back({});}u=a[static_cast<size_t>(u)].next[c];++a[static_cast<size_t>(u)].count;}end[static_cast<size_t>(i)]=u;}queue<int>q;vector<int>order;for(size_t c=0;c<26;++c)if(a[0].next[c]!=0)q.push(a[0].next[c]);while(!q.empty()){int u=q.front();q.pop();order.push_back(u);for(size_t c=0;c<26;++c){int&v=a[static_cast<size_t>(u)].next[c];if(v!=0){a[static_cast<size_t>(v)].fail=a[static_cast<size_t>(a[static_cast<size_t>(u)].fail)].next[c];q.push(v);}else v=a[static_cast<size_t>(a[static_cast<size_t>(u)].fail)].next[c];}}for(auto it=order.rbegin();it!=order.rend();++it)a[static_cast<size_t>(a[static_cast<size_t>(*it)].fail)].count+=a[static_cast<size_t>(*it)].count;for(int v:end)cout<<a[static_cast<size_t>(v)].count<<'\n';}
external_url: https://www.luogu.com.cn/problem/P3966
external_platform: 洛谷
external_problem_id: P3966
external_title: '[TJOI2013] 單詞'
external_relation: original
source_book_pages: [579, 586]
source_pdf_pages: [209, 216]
review_status: verified
---

把每個單詞的每個前綴結尾視為一次文本造訪，即可省掉實際串接文章。
