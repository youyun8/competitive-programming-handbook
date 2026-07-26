---
id: luogu-p3796
volume: lower
source_file: lower-volume
title: 洛谷 P3796 AC 自動機（簡單版 II）
chapter: 9
section: '9.6'
kind: external-oj
difficulty: 3
topics: [aho-corasick, occurrence-counting, fail-tree]
prerequisites: [ac-automaton]
statement: 對多組資料，求各模式串在文本中的重疊出現次數，輸出最大值及所有達到最大值的模式串。
constraints: ['資料組數不超過 50', '1 <= n <= 150，模式長度 <= 70', '文本長度 <= 10^6，模式互異']
input_format: 每組先 n、接著 n 個模式與文本；n=0 結束。
output_format: 每組先輸出最大次數，再依輸入順序輸出所有最大者。
samples:
  - input: "2\na\naa\naaa\n0\n"
    output: "3\na"
    explanation: a 出現三次、aa 出現兩次；另以逐模式暴力比對短字串對拍。
core_knowledge: [AC 自動機, 反 BFS 累加, 模式終點]
judgment: 出現可重疊；並列者全部依原順序輸出。
hints:
  - 插入時保存每個模式的終點。
  - 掃文本只增加目前狀態的造訪次數。
  - 反向 BFS 把節點次數加給 fail，終點值就是模式出現次數。
solution_outline: 建 AC 並保留 BFS 序；掃文本記錄狀態造訪，反序沿 fail 聚合，讀取各模式終點計數後輸出最大者。
proof_or_invariant: 每個位置目前狀態的 fail 祖先恰代表所有以該位置結束的模式前綴；逆序聚合把一次造訪傳給全部祖先且各一次，因此終點計數等於重疊出現總數。
common_errors: [清除終點而漏掉後續出現, 正向累加 fail, 並列答案未按輸入順序]
complexity: { time: 'O(模式總長+文本長+節點數)', space: 'O(模式總長×26)' }
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);/* TODO：AC 掃描後反 BFS 聚合。*/return 0;}
cpp_solution: |
  #include <algorithm>
  #include <array>
  #include <iostream>
  #include <queue>
  #include <string>
  #include <vector>
  using namespace std;
  struct Node{array<int,26> next{};int fail=0;long long visits=0;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n=0;while(cin>>n&&n!=0){vector<Node>a(1);vector<string>words(static_cast<size_t>(n));vector<int>ending(static_cast<size_t>(n));for(int i=0;i<n;++i){cin>>words[static_cast<size_t>(i)];int u=0;for(char ch:words[static_cast<size_t>(i)]){size_t c=static_cast<size_t>(ch-'a');if(a[static_cast<size_t>(u)].next[c]==0){a[static_cast<size_t>(u)].next[c]=static_cast<int>(a.size());a.push_back({});}u=a[static_cast<size_t>(u)].next[c];}ending[static_cast<size_t>(i)]=u;}queue<int>q;vector<int>order;for(size_t c=0;c<26;++c)if(a[0].next[c]!=0)q.push(a[0].next[c]);while(!q.empty()){int u=q.front();q.pop();order.push_back(u);for(size_t c=0;c<26;++c){int&v=a[static_cast<size_t>(u)].next[c];if(v!=0){a[static_cast<size_t>(v)].fail=a[static_cast<size_t>(a[static_cast<size_t>(u)].fail)].next[c];q.push(v);}else v=a[static_cast<size_t>(a[static_cast<size_t>(u)].fail)].next[c];}}string text;cin>>text;int u=0;for(char ch:text){u=a[static_cast<size_t>(u)].next[static_cast<size_t>(ch-'a')];++a[static_cast<size_t>(u)].visits;}for(auto it=order.rbegin();it!=order.rend();++it)a[static_cast<size_t>(a[static_cast<size_t>(*it)].fail)].visits+=a[static_cast<size_t>(*it)].visits;long long best=0;for(int v:ending)best=max(best,a[static_cast<size_t>(v)].visits);cout<<best<<'\n';for(int i=0;i<n;++i)if(a[static_cast<size_t>(ending[static_cast<size_t>(i)])].visits==best)cout<<words[static_cast<size_t>(i)]<<'\n';}}
external_url: https://www.luogu.com.cn/problem/P3796
external_platform: 洛谷
external_problem_id: P3796
external_title: 'AC 自動機（簡單版 II）'
external_relation: original
source_book_pages: [579, 586]
source_pdf_pages: [209, 216]
review_status: verified
---

反向聚合比逐位置走 fail 更穩定，也直接保留重疊次數。
