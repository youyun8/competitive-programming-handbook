---
id: luogu-p4683
volume: lower
source_file: lower-volume
title: 洛谷 P4683 Type Printer
chapter: 9
section: '9.3'
kind: external-oj
difficulty: 3
topics: [trie, depth-first-search, constructive]
prerequisites: [tree-traversal]
statement: 從空字串開始，可在尾端加一字母、刪除尾字母或列印目前字串；以最少操作列印所有給定且互異的單字，並輸出一組操作序列。
constraints: ['1 <= n <= 25000', 每個單字長度介於 1 與 20, 單字互異且只含小寫英文字母]
input_format: 第一行 n，接著 n 行要列印的單字。
output_format: 先輸出最少操作數，接著逐行輸出操作；字母表示附加、`-` 表示刪尾、`P` 表示列印。
samples:
  - input: "3\na\nab\nb\n"
    output: "7\nb\nP\n-\na\nP\nb\nP\n"
    explanation: 先列印 b 並退回空字串，再依序列印 a、ab，共 7 次操作；最後不必清空。
core_knowledge: [Trie 邊共享共同前綴, DFS 走訪產生增刪操作, 最長單字路徑留到最後免回退]
judgment: 所有單字都須恰被某次 P 列印；結束時可留字母，因此操作序列不必回到根。
hints:
  - 把單字建成 Trie；走下一條邊是加入字母，回父節點是刪除，終止節點輸出 P。
  - 若最後仍回根，每條 Trie 邊都走下再走回；但題目允許停在最後一個單字。
  - 選一個最長單字，把通往它的孩子在每層最後走且不回退，可省下其深度次刪除操作。
solution_outline: 建 Trie 並選最長單字。DFS 時先走不在該單字路徑上的孩子並回退，最後走目標孩子；沿目標路徑不輸出回退。每個終止節點輸出 P。
proof_or_invariant: 列印所有字必須至少走過 Trie 每條邊一次且執行 n 次 P；除了最後停留路徑外，每條走下的邊都必須走回。可免回的路徑最多是某個單字深度，選最長者使下界為 2E-maxDepth+n。所述 DFS 每條非目標邊往返、目標邊只往下，恰達下界。
common_errors: [DFS 完成後多退回根, 忘記在同時是其他字前綴的終止節點列印, 只輸出操作卻未先輸出數量]
complexity: { time: O(L), space: O(L) }
cpp_skeleton: |
  #include <array>
  #include <iostream>
  #include <string>
  #include <vector>
  using namespace std;
  struct Node{array<int,26> next{};bool terminal=false;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n=0;cin>>n;
      // TODO：建 Trie，將最長單字路徑排最後走，記錄操作。
      (void)n;return 0;}
cpp_solution: |
  #include <array>
  #include <functional>
  #include <iostream>
  #include <string>
  #include <vector>
  using namespace std;
  struct Node{array<int,26> next{};bool terminal=false;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n=0;cin>>n;vector<Node> trie(1);string longest;
      for(int i=0;i<n;++i){string word;cin>>word;if(word.size()>longest.size())longest=word;int u=0;for(char c:word){size_t x=static_cast<size_t>(c-'a');if(trie[static_cast<size_t>(u)].next[x]==0){trie[static_cast<size_t>(u)].next[x]=static_cast<int>(trie.size());trie.push_back({});}u=trie[static_cast<size_t>(u)].next[x];}trie[static_cast<size_t>(u)].terminal=true;}
      vector<char> operations;function<void(int,size_t,bool)> visit=[&](int u,size_t depth,bool on_target){if(trie[static_cast<size_t>(u)].terminal)operations.push_back('P');int special=-1;if(on_target&&depth<longest.size())special=longest[depth]-'a';for(int c=0;c<26;++c){if(c==special)continue;int v=trie[static_cast<size_t>(u)].next[static_cast<size_t>(c)];if(v!=0){operations.push_back(static_cast<char>('a'+c));visit(v,depth+1,false);operations.push_back('-');}}if(special>=0){int v=trie[static_cast<size_t>(u)].next[static_cast<size_t>(special)];operations.push_back(static_cast<char>('a'+special));visit(v,depth+1,true);}};visit(0,0,true);cout<<operations.size()<<'\n';for(char op:operations)cout<<op<<'\n';
  }
external_url: https://www.luogu.com.cn/problem/P4683
external_platform: 洛谷
external_problem_id: P4683
external_title: '[IOI 2008] Type Printer'
external_relation: original
source_book_pages: [554, 574]
source_pdf_pages: [184, 204]
review_status: verified
---

最佳序列就是 Trie 的開放式 DFS：所有支線都往返，只有最長的最後路徑停在葉端。
