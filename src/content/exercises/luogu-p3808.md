---
id: luogu-p3808
volume: lower
source_file: lower-volume
title: 洛谷 P3808 AC 自動機（簡單版）
chapter: 9
section: '9.6'
kind: external-oj
difficulty: 3
topics: [aho-corasick, trie, failure-link]
prerequisites: [ac-automaton]
statement: 給定 n 個模式串與文本，求有多少個有不同編號的模式串曾在文本中出現；內容相同但編號不同者分別計數。
constraints: ['1 <= n <= 10^6', '模式總長與文本長度各不超過 10^6', '字串只含小寫字母']
input_format: 第一行 n，接著 n 行模式串，最後一行文本。
output_format: 輸出出現過的模式串編號數。
samples:
  - input: "3\na\naa\na\naa\n"
    output: '3'
    explanation: 兩個編號不同的 a 與 aa 都曾出現，故答案為 3；另以集合式暴力搜尋短隨機字串對拍。
core_knowledge: [AC 自動機, fail 鏈, 一次性終點]
judgment: 每個模式編號至多貢獻一次，重複內容依輸入個數貢獻。
hints:
  - 終點保存結束於此的模式編號數，重複字串必須累加。
  - BFS 補齊轉移並建立 fail；掃文本時目前狀態的 fail 祖先都是匹配後綴。
  - 某終點第一次計入後清零；已清零鏈可用字典後綴連結避免反覆走訪。
solution_outline: 建 AC 自動機與 output link（指向最近的非空終點祖先）。掃文本後沿 output link 枚舉尚未處理的終點，把 multiplicity 加入答案並清零；清零後將 output link 路徑壓縮到下一個未處理終點。
proof_or_invariant: 每個文本位置的狀態及其 output-link 鏈恰列出所有在此結束的模式；終點值只在首次遇到時加入，故每個輸入編號恰在其內容出現時貢獻一次，未出現者永不貢獻。
common_errors: [把重複模式合併成一次, 統計所有出現次數而非是否出現, 每個位置完整走 fail 鏈而退化]
complexity: { time: 'O(模式總長+文本長+節點數)', space: 'O(模式總長×26)' }
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);/* TODO：建 AC，自每個終點只取一次 multiplicity。*/return 0;}
cpp_solution: |
  #include <array>
  #include <iostream>
  #include <queue>
  #include <string>
  #include <vector>
  using namespace std;
  struct Node{array<int,26> next{};int fail=0;int output=0;int count=0;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n=0;if(!(cin>>n))return 0;vector<Node>a(1);for(int i=0;i<n;++i){string s;cin>>s;int u=0;for(char ch:s){size_t c=static_cast<size_t>(ch-'a');if(a[static_cast<size_t>(u)].next[c]==0){a[static_cast<size_t>(u)].next[c]=static_cast<int>(a.size());a.push_back({});}u=a[static_cast<size_t>(u)].next[c];}++a[static_cast<size_t>(u)].count;}queue<int>q;for(size_t c=0;c<26;++c)if(a[0].next[c]!=0)q.push(a[0].next[c]);while(!q.empty()){int u=q.front();q.pop();for(size_t c=0;c<26;++c){int&v=a[static_cast<size_t>(u)].next[c];if(v!=0){a[static_cast<size_t>(v)].fail=a[static_cast<size_t>(a[static_cast<size_t>(u)].fail)].next[c];int f=a[static_cast<size_t>(v)].fail;a[static_cast<size_t>(v)].output=a[static_cast<size_t>(f)].count>0?f:a[static_cast<size_t>(f)].output;q.push(v);}else v=a[static_cast<size_t>(a[static_cast<size_t>(u)].fail)].next[c];}}string text;cin>>text;int answer=0,u=0;for(char ch:text){u=a[static_cast<size_t>(u)].next[static_cast<size_t>(ch-'a')];for(int v=u;v!=0;){if(a[static_cast<size_t>(v)].count>0){answer+=a[static_cast<size_t>(v)].count;a[static_cast<size_t>(v)].count=0;}int next=a[static_cast<size_t>(v)].output;if(next!=0&&a[static_cast<size_t>(next)].count==0)a[static_cast<size_t>(v)].output=a[static_cast<size_t>(next)].output;v=a[static_cast<size_t>(v)].output;}}cout<<answer<<'\n';}
external_url: https://www.luogu.com.cn/problem/P3808
external_platform: 洛谷
external_problem_id: P3808
external_title: '【模板】AC 自動機（簡單版）'
external_relation: original
source_book_pages: [579, 586]
source_pdf_pages: [209, 216]
review_status: verified
---

一次性清除終點，把「總出現次數」改成「是否曾出現」。
