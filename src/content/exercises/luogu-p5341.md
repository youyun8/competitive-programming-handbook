---
id: luogu-p5341
volume: lower
source_file: lower-volume
title: 洛谷 P5341 甲苯先生和大中鋒的字符串
chapter: 9
section: '9.8'
kind: external-oj
difficulty: 4
topics: [suffix-automaton, occurrence-counting, difference-array]
prerequisites: [suffix-automaton, difference-array]
statement: 對每組字串與 k，把恰好出現 k 次的不同子串按長度分類；輸出子串種類數最多的長度，並列取較長者；不存在則輸出 -1。
constraints: ['1 <= T <= 100', '1 <= |S| <= 10^5，所有 |S| 總和 <= 3*10^6', '1 <= k <= |S|，S 只含小寫字母']
input_format: 第一行 T；接著每行一個字串 S 與整數 k。
output_format: 每組輸出一行答案。
samples:
  - input: "6\naab 1\nabc 1\naaaa 2\nabab 2\nababacc 2\nabab 4\n"
    output: "2\n1\n3\n1\n2\n-1"
    explanation: 官方完整範例；例如 aab 中恰出現一次的長度二子串有 aa、ab，數量最多。另以枚舉短字串所有不同子串對拍。
core_knowledge: [SAM endpos 等價類, link 長度區間, 區間差分]
judgment: 只統計出現次數恰為 k 的不同內容；同數量長度並列時輸出較長者。
hints:
  - 原生狀態 occurrence 初始一、clone 初始零，再按 length 逆序沿 link 累加。
  - 同一狀態 v 代表長度 len(link[v])+1..len[v] 的各一個子串，且它們的出現次數都等於 occurrence[v]。
  - occurrence[v]=k 時對上述整段長度做差分加一，前綴和後取最大，並由短到長用 >= 更新以保留較長者。
solution_outline: 建 SAM 並計算各狀態 endpos 大小。對每個恰有 k 個 endpos 的非根狀態，把其代表的連續長度區間加入差分陣列；掃描各長度的種類數，找最大值與最長並列答案。
proof_or_invariant: SAM 狀態 v 的所有子串長度恰為 (len(link[v]),len[v]]，每個長度唯一一個且 endpos 集相同，因此 occurrence[v]=k 時整段恰各貢獻一種。不同狀態代表不同內容，差分加總正是每種長度的合法子串種類數。
common_errors: [clone 計數設成一, 區間左端漏加一, 最大種類數並列時取了較短長度]
complexity: { time: 'O(|S|×26)', space: 'O(|S|×26)' }
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);/* TODO：SAM occurrence=k 的長度區間做差分。*/return 0;}
cpp_solution: |
  #include <array>
  #include <iostream>
  #include <string>
  #include <vector>
  using namespace std;
  struct State{array<int,26> next{};int link=-1;int length=0;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int tests=0;cin>>tests;while(tests--){string s;long long wanted=0;cin>>s>>wanted;vector<State>a(1);vector<long long>occ(1);int last=0;for(char ch:s){size_t c=static_cast<size_t>(ch-'a');int current=static_cast<int>(a.size());a.push_back({});occ.push_back(1);a[static_cast<size_t>(current)].length=a[static_cast<size_t>(last)].length+1;int p=last;while(p!=-1&&a[static_cast<size_t>(p)].next[c]==0){a[static_cast<size_t>(p)].next[c]=current;p=a[static_cast<size_t>(p)].link;}if(p==-1)a[static_cast<size_t>(current)].link=0;else{int q=a[static_cast<size_t>(p)].next[c];if(a[static_cast<size_t>(p)].length+1==a[static_cast<size_t>(q)].length)a[static_cast<size_t>(current)].link=q;else{int clone=static_cast<int>(a.size());a.push_back(a[static_cast<size_t>(q)]);occ.push_back(0);a[static_cast<size_t>(clone)].length=a[static_cast<size_t>(p)].length+1;while(p!=-1&&a[static_cast<size_t>(p)].next[c]==q){a[static_cast<size_t>(p)].next[c]=clone;p=a[static_cast<size_t>(p)].link;}a[static_cast<size_t>(q)].link=a[static_cast<size_t>(current)].link=clone;}}last=current;}vector<int>count(s.size()+1),order(a.size());for(const State&state:a)++count[static_cast<size_t>(state.length)];for(size_t i=1;i<count.size();++i)count[i]+=count[i-1];for(size_t i=a.size();i-->0;)order[static_cast<size_t>(--count[static_cast<size_t>(a[i].length)])]=static_cast<int>(i);for(size_t i=order.size();i-->1;){int u=order[i];occ[static_cast<size_t>(a[static_cast<size_t>(u)].link)]+=occ[static_cast<size_t>(u)];}vector<int>difference(s.size()+2);for(size_t u=1;u<a.size();++u)if(occ[u]==wanted){int left=a[static_cast<size_t>(a[u].link)].length+1,right=a[u].length;++difference[static_cast<size_t>(left)];--difference[static_cast<size_t>(right+1)];}int current=0,best=0,answer=-1;for(size_t length=1;length<=s.size();++length){current+=difference[length];if(current>=best&&current>0){best=current;answer=static_cast<int>(length);}}cout<<answer<<'\n';}}
external_url: https://www.luogu.com.cn/problem/P5341
external_platform: 洛谷
external_problem_id: P5341
external_title: '[TJOI2019] 甲苯先生和大中鋒的字符串'
external_relation: original
source_book_pages: [596, 599]
source_pdf_pages: [226, 229]
review_status: verified
---

SAM 不只壓縮子串內容，也把「出現次數相同的一整段長度」壓成一個狀態，正好可做區間加法。
