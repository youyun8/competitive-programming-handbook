---
id: luogu-p3121
volume: lower
source_file: lower-volume
title: 洛谷 P3121 Censoring G
chapter: 9
section: '9.6'
kind: external-oj
difficulty: 4
topics: [aho-corasick, stack, online-deletion]
prerequisites: [ac-automaton, stack]
statement: 反覆刪除文章中起點最早的禁詞，直到沒有禁詞；刪除後的新接縫也可能形成禁詞，求最後字串。禁詞間不存在子串包含關係。
constraints: ['文章與禁詞只含小寫字母', '禁詞互不為彼此子串', '結果保證非空']
input_format: 第一行文章，第二行禁詞數 n，接著 n 行禁詞。
output_format: 輸出全部刪除完成後的文章。
samples:
  - input: "begintheescapexecutionatthebreakofdawn\n2\nescape\nexecution\n"
    output: beginthatthebreakofdawn
    explanation: 依序刪除 escape 與接合後出現的 execution；另以直接反覆尋找最早禁詞的短字串程式對拍。
core_knowledge: [AC 多模式匹配, 字元棧, 自動機狀態棧]
judgment: 每次刪除最早起點；題目保證禁詞無包含關係，使線上處理到的後綴刪除與規則一致。
hints:
  - 從左到右加入字元，若目前結果的後綴是禁詞，就立刻刪掉。
  - 除字元外，再為棧中每個位置保存加入後的 AC 狀態。
  - 刪除長度 L 只需彈出 L 格，然後從新棧頂恢復狀態。
solution_outline: 對禁詞建 AC，終點保存詞長並沿 fail 繼承。逐字掃文章，把字元和新狀態壓棧；若狀態命中禁詞，彈出相應長度。最後棧內容即答案。
proof_or_invariant: 每輪後棧內容等於已讀前綴依題意完全刪除後的結果，狀態棧精確描述其各前綴。新禁詞只能因加入末字元而成為目前結果後綴，立即彈出故維持不變量；無包含保證不會選錯同一起點的詞。
common_errors: [刪除後未恢復 AC 狀態, 只檢查 Trie 終點而漏 fail 終點, 用 erase 造成平方複雜度]
complexity: { time: 'O(文章長+禁詞總長)', space: 'O(文章長+禁詞總長×26)' }
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);/* TODO：AC 狀態與字元同步入棧、命中即彈出。*/return 0;}
cpp_solution: |
  #include <array>
  #include <iostream>
  #include <queue>
  #include <string>
  #include <vector>
  using namespace std;
  struct Node{array<int,26> next{};int fail=0;int length=0;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);string text;int n=0;cin>>text>>n;vector<Node>a(1);while(n--){string s;cin>>s;int u=0;for(char ch:s){size_t c=static_cast<size_t>(ch-'a');if(a[static_cast<size_t>(u)].next[c]==0){a[static_cast<size_t>(u)].next[c]=static_cast<int>(a.size());a.push_back({});}u=a[static_cast<size_t>(u)].next[c];}a[static_cast<size_t>(u)].length=static_cast<int>(s.size());}queue<int>q;for(size_t c=0;c<26;++c)if(a[0].next[c]!=0)q.push(a[0].next[c]);while(!q.empty()){int u=q.front();q.pop();if(a[static_cast<size_t>(u)].length==0)a[static_cast<size_t>(u)].length=a[static_cast<size_t>(a[static_cast<size_t>(u)].fail)].length;for(size_t c=0;c<26;++c){int&v=a[static_cast<size_t>(u)].next[c];if(v!=0){a[static_cast<size_t>(v)].fail=a[static_cast<size_t>(a[static_cast<size_t>(u)].fail)].next[c];q.push(v);}else v=a[static_cast<size_t>(a[static_cast<size_t>(u)].fail)].next[c];}}vector<char>answer;vector<int>states(1,0);for(char ch:text){int state=a[static_cast<size_t>(states.back())].next[static_cast<size_t>(ch-'a')];answer.push_back(ch);states.push_back(state);int length=a[static_cast<size_t>(state)].length;if(length>0){answer.resize(answer.size()-static_cast<size_t>(length));states.resize(states.size()-static_cast<size_t>(length));}}for(char ch:answer)cout<<ch;cout<<'\n';}
external_url: https://www.luogu.com.cn/problem/P3121
external_platform: 洛谷
external_problem_id: P3121
external_title: '[USACO15FEB] Censoring G'
external_relation: original
source_book_pages: [579, 586]
source_pdf_pages: [209, 216]
review_status: verified
---

刪除不是重跑匹配：把自動機狀態也存進棧，就能 O(1) 回復接縫前狀態。
