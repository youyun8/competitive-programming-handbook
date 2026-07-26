---
id: luogu-p4555
volume: lower
source_file: lower-volume
title: 洛谷 P4555 最長雙迴文串
chapter: 9
section: '9.2'
kind: external-oj
difficulty: 4
topics: [palindromic-tree, palindrome, prefix-suffix]
prerequisites: [trie, failure-link]
statement: 在輸入字串中找最長連續子串 T，使 T 能切成兩個非空且相鄰的迴文串 X、Y；輸出最大總長。
constraints: ['2 <= |S| <= 10^5', S 只含小寫英文字母]
input_format: 一行字串 S。
output_format: 輸出最長雙迴文子串長度。
samples:
  - input: "baacaabbacabb\n"
    output: '12'
    explanation: 從第二個字元開始的 `aacaabbacabb` 可切為迴文 `aacaa` 與 `bbacabb`，總長 12。
core_knowledge: [枚舉兩段間分界, PAM 求每個前綴最長迴文後綴, 反串求每個後綴最長迴文前綴]
judgment: X、Y 都必須非空且相鄰，T 需是原字串中的連續區間，但 T 本身不必是迴文。
hints:
  - 固定分界 i 後，左段應取以 i 結尾的最長迴文，右段取以 i+1 開始的最長迴文，兩者互不影響。
  - 逐字加入迴文樹時，last 節點就是目前前綴的最長迴文後綴，可記錄其長度。
  - 對反轉字串做同樣處理可得到原字串各位置開始的最長迴文；枚舉分界加總兩陣列。
solution_outline: PAM 掃原串得到 end_at[i]；PAM 掃反串，映射得到 start_at[i]。枚舉 i=0..n-2，最大化 end_at[i]+start_at[i+1]。
proof_or_invariant: PAM 的 last 始終代表目前整個前綴的最長迴文後綴，因此 end_at 精確；反轉把「從 i 開始的迴文」對應為反串某前綴的迴文後綴，start_at 亦精確。任何雙迴文有唯一分界，固定分界時兩側各選最長絕不使另一側變差，故枚舉取得最優。
common_errors: [要求整個 T 也是迴文, 左右兩段允許重疊或留空隙, 反串索引映射差一]
complexity: { time: O(n), space: O(n) }
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);/* TODO：正反各建 PAM，枚舉分界。*/}
cpp_solution: |
  #include <algorithm>
  #include <array>
  #include <iostream>
  #include <string>
  #include <vector>
  using namespace std;
  struct PalindromicTree{struct Node{array<int,26> next{};int fail=0;int length=0;};vector<Node> nodes;vector<int> text;int last=0;PalindromicTree():nodes(2),text(1,-1){nodes[0].length=0;nodes[0].fail=1;nodes[1].length=-1;nodes[1].fail=1;}int add(int c){text.push_back(c);int position=static_cast<int>(text.size())-1,p=last;while(text[static_cast<size_t>(position-nodes[static_cast<size_t>(p)].length-1)]!=c)p=nodes[static_cast<size_t>(p)].fail;if(nodes[static_cast<size_t>(p)].next[static_cast<size_t>(c)]==0){int created=static_cast<int>(nodes.size());nodes.push_back({});nodes[static_cast<size_t>(created)].length=nodes[static_cast<size_t>(p)].length+2;if(nodes[static_cast<size_t>(created)].length==1)nodes[static_cast<size_t>(created)].fail=0;else{int q=nodes[static_cast<size_t>(p)].fail;while(text[static_cast<size_t>(position-nodes[static_cast<size_t>(q)].length-1)]!=c)q=nodes[static_cast<size_t>(q)].fail;nodes[static_cast<size_t>(created)].fail=nodes[static_cast<size_t>(q)].next[static_cast<size_t>(c)];}nodes[static_cast<size_t>(p)].next[static_cast<size_t>(c)]=created;}last=nodes[static_cast<size_t>(p)].next[static_cast<size_t>(c)];return nodes[static_cast<size_t>(last)].length;}};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);string s;cin>>s;int n=static_cast<int>(s.size());vector<int> ending(static_cast<size_t>(n)),starting(static_cast<size_t>(n));PalindromicTree forward;for(int i=0;i<n;++i)ending[static_cast<size_t>(i)]=forward.add(s[static_cast<size_t>(i)]-'a');PalindromicTree backward;for(int i=n-1;i>=0;--i)starting[static_cast<size_t>(i)]=backward.add(s[static_cast<size_t>(i)]-'a');int answer=0;for(int i=0;i+1<n;++i)answer=max(answer,ending[static_cast<size_t>(i)]+starting[static_cast<size_t>(i+1)]);cout<<answer<<'\n';}
external_url: https://www.luogu.com.cn/problem/P4555
external_platform: 洛谷
external_problem_id: P4555
external_title: '[國家集訓隊] 最長雙迴文串'
external_relation: original
source_book_pages: [580, 595]
source_pdf_pages: [210, 225]
review_status: verified
---

雙迴文不要求整體迴文；拆點左右各取一個最長迴文後綴／前綴，才是最直接的分解。
