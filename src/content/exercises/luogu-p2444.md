---
id: luogu-p2444
volume: lower
source_file: lower-volume
title: 洛谷 P2444 病毒
chapter: 9
section: '9.6'
kind: external-oj
difficulty: 4
topics: [aho-corasick, directed-cycle, infinite-string]
prerequisites: [ac-automaton, depth-first-search]
statement: 給定若干非空二進位病毒碼，判斷是否存在無限長二進位字串，不含任何病毒碼作為子串。
constraints: ['n <= 2000', '病毒碼總長不超過 30000', '字元只含 0、1']
input_format: 第一行 n，接著 n 行病毒碼。
output_format: 存在則輸出 TAK，否則輸出 NIE。
samples:
  - input: "3\n011\n11\n00000\n"
    output: TAK
    explanation: 010101… 不含任一病毒碼；另以有限狀態圖暴力 SCC 判定短模式集對拍。
core_knowledge: [AC Trie 圖, 危險狀態, 可達有向環]
judgment: 要求無限長；任何位置命中任一病毒碼即不安全。
hints:
  - 終點以及 fail 祖先含終點的節點都標為危險。
  - 補齊 AC 轉移後，每個安全字串就是從根出發、只走安全節點的一條路。
  - 有限狀態圖存在無限安全路徑，當且僅當根可達的安全子圖含有向環。
solution_outline: 建二字元 AC 自動機並傳遞危險標記；在安全 Trie 圖從根做三色 DFS，遇到仍在遞迴棧中的節點即輸出 TAK。
proof_or_invariant: 每個字串前綴唯一對應 AC 圖路徑，避開危險節點等價於未含病毒碼。有限圖上的無限路徑必重複狀態形成環；反之可達安全環可無限循環並產生安全字串。
common_errors: [只標原始終點而漏 fail 後綴, 在 Trie 樹而非補齊轉移圖找環, 把已完成節點誤當遞迴棧節點]
complexity: { time: 'O(病毒碼總長)', space: 'O(病毒碼總長)' }
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);/* TODO：建安全 Trie 圖並做三色 DFS。*/return 0;}
cpp_solution: |
  #include <array>
  #include <functional>
  #include <iostream>
  #include <queue>
  #include <string>
  #include <vector>
  using namespace std;
  struct Node{array<int,2> next{};int fail=0;bool bad=false;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n=0;cin>>n;vector<Node>a(1);while(n--){string s;cin>>s;int u=0;for(char ch:s){size_t c=static_cast<size_t>(ch-'0');if(a[static_cast<size_t>(u)].next[c]==0){a[static_cast<size_t>(u)].next[c]=static_cast<int>(a.size());a.push_back({});}u=a[static_cast<size_t>(u)].next[c];}a[static_cast<size_t>(u)].bad=true;}queue<int>q;for(size_t c=0;c<2;++c)if(a[0].next[c]!=0)q.push(a[0].next[c]);while(!q.empty()){int u=q.front();q.pop();a[static_cast<size_t>(u)].bad=a[static_cast<size_t>(u)].bad||a[static_cast<size_t>(a[static_cast<size_t>(u)].fail)].bad;for(size_t c=0;c<2;++c){int&v=a[static_cast<size_t>(u)].next[c];if(v!=0){a[static_cast<size_t>(v)].fail=a[static_cast<size_t>(a[static_cast<size_t>(u)].fail)].next[c];q.push(v);}else v=a[static_cast<size_t>(a[static_cast<size_t>(u)].fail)].next[c];}}vector<int>color(a.size());function<bool(int)>dfs=[&](int u){color[static_cast<size_t>(u)]=1;for(int v:a[static_cast<size_t>(u)].next){if(a[static_cast<size_t>(v)].bad)continue;if(color[static_cast<size_t>(v)]==1)return true;if(color[static_cast<size_t>(v)]==0&&dfs(v))return true;}color[static_cast<size_t>(u)]=2;return false;};cout<<(dfs(0)?"TAK":"NIE")<<'\n';}
external_url: https://www.luogu.com.cn/problem/P2444
external_platform: 洛谷
external_problem_id: P2444
external_title: '[POI2000] 病毒'
external_relation: original
source_book_pages: [579, 586]
source_pdf_pages: [209, 216]
review_status: verified
---

無限字串問題落到有限自動機後，就是一個可達安全環判定。
