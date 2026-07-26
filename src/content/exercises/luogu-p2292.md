---
id: luogu-p2292
volume: lower
source_file: lower-volume
title: 洛谷 P2292 L 語言
chapter: 9
section: '9.3'
kind: external-oj
difficulty: 3
topics: [trie, dynamic-programming, word-break]
prerequisites: [prefix, boolean-dp]
statement: 給定一份單字表與多段文章；對每篇文章求最長前綴長度，使此前綴能完整切成若干個表內單字。
constraints: ['1 <= n,m <= 20', 單字長度不超過 10, 文章長度不超過 10^6, 所有字串只含小寫英文字母]
input_format: 第一行 n m；接著 n 行單字，再接 m 行文章。
output_format: 每篇文章輸出一行可被單字表完整解析的最長前綴長度。
samples:
  - input: "3 2\na\nab\nbc\nabca\nacx\n"
    output: "4\n1\n"
    explanation: >-
      `abca` 可切為 `a+bc+a`，整段可解析；`acx` 只有第一個 `a` 可解析。
core_knowledge: [Trie 同時比對多個單字, 可達位置動態規劃, 單字最大長度限制轉移]
judgment: 答案是從文章開頭連續可解析的最遠位置，不是任意可解析子串。
hints:
  - 令 reachable[i] 表示文章前 i 個字元能否完整切成字典單字。
  - 只從 reachable 的位置出發沿 Trie 向後走；走到單字終點時標記新的 reachable 位置。
  - 因單字長度至多 10，每個起點只需向後探索常數個字元，最後取最大的可達位置。
solution_outline: 建立單字 Trie。每篇文章令 reachable[0]=true，依位置掃描；可達時沿 Trie 最多走最大單字長度，遇終點即標記結束位置，並維護最大值。
proof_or_invariant: reachable[i] 為真當且僅當存在一個以 i 結束的合法切法；從每個已合法前綴接上一個 Trie 中的完整單字，枚舉了最後一段的所有可能，因此歸納後所有且僅有合法切點被標記。
common_errors: [從不可達位置開始匹配, 把 Trie 路徑前綴當成完整單字, 回報最後一次匹配單字的位置而非最大可達位置]
complexity: { time: O(nL + mSL), space: O(nL + S) }
cpp_skeleton: |
  #include <array>
  #include <iostream>
  #include <string>
  #include <vector>
  using namespace std;
  struct Node{array<int,26> next{};bool terminal=false;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n=0,m=0;cin>>n>>m;
      // TODO：建 Trie，並以可達位置 DP 處理每篇文章。
      (void)n;(void)m;return 0;}
cpp_solution: |
  #include <array>
  #include <iostream>
  #include <string>
  #include <vector>
  using namespace std;
  struct Node{array<int,26> next{};bool terminal=false;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n=0,m=0;cin>>n>>m;vector<Node> trie(1);int maximum_length=0;
      for(int i=0;i<n;++i){string word;cin>>word;maximum_length=max(maximum_length,static_cast<int>(word.size()));int u=0;for(char c:word){size_t x=static_cast<size_t>(c-'a');if(trie[static_cast<size_t>(u)].next[x]==0){trie[static_cast<size_t>(u)].next[x]=static_cast<int>(trie.size());trie.push_back({});}u=trie[static_cast<size_t>(u)].next[x];}trie[static_cast<size_t>(u)].terminal=true;}
      while(m--){string text;cin>>text;vector<bool> reachable(text.size()+1,false);reachable[0]=true;int answer=0;for(size_t start=0;start<text.size();++start){if(!reachable[start])continue;int u=0;for(size_t pos=start;pos<text.size()&&pos-start<static_cast<size_t>(maximum_length);++pos){u=trie[static_cast<size_t>(u)].next[static_cast<size_t>(text[pos]-'a')];if(u==0)break;if(trie[static_cast<size_t>(u)].terminal){reachable[pos+1]=true;answer=max(answer,static_cast<int>(pos+1));}}}cout<<answer<<'\n';}
  }
external_url: https://www.luogu.com.cn/problem/P2292
external_platform: 洛谷
external_problem_id: P2292
external_title: '[HNOI2004] L 語言'
external_relation: original
source_book_pages: [554, 574]
source_pdf_pages: [184, 204]
review_status: verified
---

把「前綴可切分」化成可達位置後，Trie 負責從每個切點一次枚舉所有可能的下一個單字。
