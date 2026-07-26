---
id: luogu-p4551
volume: lower
source_file: lower-volume
title: 洛谷 P4551 最長異或路徑
chapter: 9
section: '9.3'
kind: external-oj
difficulty: 3
topics: [binary-trie, tree, xor]
prerequisites: [tree-traversal, bitwise-xor]
statement: 給定一棵帶非負邊權的樹，求任意兩點唯一簡單路徑上所有邊權的最大異或值。
constraints: ['1 <= n <= 10^5', '0 <= w < 2^31', 節點編號介於 1 與 n]
input_format: 第一行 n；接著 n-1 行 u v w 表示無向邊。
output_format: 輸出最大路徑異或值。
samples:
  - input: "4\n1 2 3\n2 3 4\n2 4 6\n"
    output: '7'
    explanation: 節點 1 到 3 的路徑權值為 3、4，異或為 7。
core_knowledge: [根到點前綴異或, 公共路段異或兩次抵消, 01-Trie 貪心最大異或]
judgment: 可選任意兩個節點；邊權含 0，答案需能表示到第 30 位。
hints:
  - 任選根，記 value[u] 為根到 u 的邊權異或；思考 u 到 v 的公共部分會如何抵消。
  - 路徑答案等於 value[u] xor value[v]，問題化為一組整數中的最大異或對。
  - 把所有 value 由高位到低位插入 01-Trie；查詢時每一位優先走相反位，因高位的 1 永遠最重要。
solution_outline: DFS 或迭代走訪計算所有根路徑異或；插入 31 位 01-Trie，再對每個值由高到低貪心查找可得到的最大異或。
proof_or_invariant: 根到 u 與根到 v 的共同邊在 xor 後出現兩次而歸零，剩餘恰為 u-v 路徑。Trie 查詢在每一位先固定更高位的最優結果，再優先選相反位，故依字典序最大化二進位值，得到該值的最佳配對；遍歷所有值即得全域最大。
common_errors: [把 xor 前綴誤寫成加法距離, 只建有向邊導致遍歷不完整, 使用有號 1<<30 附近運算不一致]
complexity: { time: O(31n), space: O(31n) }
cpp_skeleton: |
  #include <array>
  #include <cstdint>
  #include <iostream>
  #include <vector>
  using namespace std;
  struct Edge{int to;uint32_t weight;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n=0;cin>>n;
      // TODO：求根路徑 xor，插入 01-Trie 並查最大異或。
      (void)n;return 0;}
cpp_solution: |
  #include <algorithm>
  #include <array>
  #include <cstdint>
  #include <iostream>
  #include <utility>
  #include <vector>
  using namespace std;
  struct Edge{int to;uint32_t weight;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n=0;cin>>n;vector<vector<Edge>> graph(static_cast<size_t>(n+1));
      for(int i=1;i<n;++i){int u=0,v=0;uint32_t w=0;cin>>u>>v>>w;graph[static_cast<size_t>(u)].push_back({v,w});graph[static_cast<size_t>(v)].push_back({u,w});}
      vector<uint32_t> value(static_cast<size_t>(n+1),0);vector<int> parent(static_cast<size_t>(n+1),0),stack{1};while(!stack.empty()){int u=stack.back();stack.pop_back();for(Edge e:graph[static_cast<size_t>(u)])if(e.to!=parent[static_cast<size_t>(u)]){parent[static_cast<size_t>(e.to)]=u;value[static_cast<size_t>(e.to)]=value[static_cast<size_t>(u)]^e.weight;stack.push_back(e.to);}}
      vector<array<int,2>> trie(1);for(int u=1;u<=n;++u){int node=0;for(int bit=30;bit>=0;--bit){size_t b=static_cast<size_t>((value[static_cast<size_t>(u)]>>bit)&1U);if(trie[static_cast<size_t>(node)][b]==0){trie[static_cast<size_t>(node)][b]=static_cast<int>(trie.size());trie.push_back({});}node=trie[static_cast<size_t>(node)][b];}}
      uint32_t answer=0;for(int u=1;u<=n;++u){int node=0;uint32_t current=0;for(int bit=30;bit>=0;--bit){size_t b=static_cast<size_t>((value[static_cast<size_t>(u)]>>bit)&1U),want=b^1U;if(trie[static_cast<size_t>(node)][want]!=0){current|=(1U<<bit);node=trie[static_cast<size_t>(node)][want];}else node=trie[static_cast<size_t>(node)][b];}answer=max(answer,current);}cout<<answer<<'\n';
  }
external_url: https://www.luogu.com.cn/problem/P4551
external_platform: 洛谷
external_problem_id: P4551
external_title: 最長異或路徑
external_relation: original
source_book_pages: [554, 574]
source_pdf_pages: [184, 204]
review_status: verified
---

樹路徑先化成兩個前綴值，01-Trie 再負責找最大異或對，是 XOR 題很常見的兩段式轉換。
