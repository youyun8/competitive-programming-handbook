---
id: luogu-p3975
volume: lower
source_file: lower-volume
title: 洛谷 P3975 弦論
chapter: 9
section: '9.8'
kind: external-oj
difficulty: 5
topics: [suffix-automaton, lexicographic-order, path-counting]
prerequisites: [suffix-automaton, dag-dp]
statement: 求字串按字典序排列的第 k 小非空子串；t=0 時相同內容只算一次，t=1 時不同出現位置分別計數。數量不足輸出 -1。
constraints: ['1 <= |S| <= 5*10^5', 'S 只含小寫字母', 't 為 0 或 1，1 <= k <= 10^18']
input_format: 第一行 S，第二行 t、k。
output_format: 輸出第 k 小子串，若不存在輸出 -1。
samples:
  - input: "aabc\n0 3\n"
    output: aab
    explanation: 官方範例；不同子串前三小為 a、aa、aab。另以枚舉短字串全部子串並排序對拍。
core_knowledge: [SAM 路徑與子串, endpos 大小, DAG 子樹權重]
judgment: t=0 按內容去重；t=1 每個出現位置都占一個排名，字典序相同者連續重複。
hints:
  - SAM 從根出發的每條非空路徑唯一表示一種不同子串。
  - t=0 時每個非根狀態的終止權重為 1；t=1 時為該狀態 endpos 大小，需沿 link 逆長度累加。
  - 逆長度求 total[u]=weight[u]+Σtotal[next]，再從根按 a..z 跳過整個轉移子樹。
solution_outline: 建 SAM，以長度計數排序。依 t 決定狀態終止權重，逆序沿 suffix link 求出現次數，再逆序求每個狀態可生成的帶權路徑總數。若根總數不足輸出 -1，否則逐字按轉移子樹大小定位第 k 項。
proof_or_invariant: SAM 路徑與不同子串一一對應；到達狀態 v 的字串皆有相同 endpos，故 t=1 時恰重複 weight[v] 次。total 遞推將「在 v 結束」與各首字元分支作不交劃分，按字元順序跳過區塊因此正是字典序選擇。
common_errors: [clone 初始出現次數設成一, 把根的空字串算入排名, 選中轉移後忘記先扣目的狀態自身權重]
complexity: { time: 'O(|S|×26)', space: 'O(|S|×26)' }
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);/* TODO：SAM 狀態權重與 DAG 路徑計數後找第 k 小。*/return 0;}
cpp_solution: |
  #include <array>
  #include <iostream>
  #include <string>
  #include <vector>
  using namespace std;
  using U64=unsigned long long;
  struct State{array<int,26> next{};int link=-1;int length=0;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);string s;int type=0;U64 k=0;cin>>s>>type>>k;vector<State>a(1);vector<U64>occ(1);int last=0;for(char ch:s){size_t c=static_cast<size_t>(ch-'a');int current=static_cast<int>(a.size());a.push_back({});occ.push_back(1);a[static_cast<size_t>(current)].length=a[static_cast<size_t>(last)].length+1;int p=last;while(p!=-1&&a[static_cast<size_t>(p)].next[c]==0){a[static_cast<size_t>(p)].next[c]=current;p=a[static_cast<size_t>(p)].link;}if(p==-1)a[static_cast<size_t>(current)].link=0;else{int q=a[static_cast<size_t>(p)].next[c];if(a[static_cast<size_t>(p)].length+1==a[static_cast<size_t>(q)].length)a[static_cast<size_t>(current)].link=q;else{int clone=static_cast<int>(a.size());a.push_back(a[static_cast<size_t>(q)]);occ.push_back(0);a[static_cast<size_t>(clone)].length=a[static_cast<size_t>(p)].length+1;while(p!=-1&&a[static_cast<size_t>(p)].next[c]==q){a[static_cast<size_t>(p)].next[c]=clone;p=a[static_cast<size_t>(p)].link;}a[static_cast<size_t>(q)].link=a[static_cast<size_t>(current)].link=clone;}}last=current;}vector<int>count(s.size()+1),order(a.size());for(const State&state:a)++count[static_cast<size_t>(state.length)];for(size_t i=1;i<count.size();++i)count[i]+=count[i-1];for(size_t i=a.size();i-->0;)order[static_cast<size_t>(--count[static_cast<size_t>(a[i].length)])]=static_cast<int>(i);if(type==1)for(size_t i=order.size();i-->1;){int u=order[i],parent=a[static_cast<size_t>(u)].link;occ[static_cast<size_t>(parent)]+=occ[static_cast<size_t>(u)];}else for(size_t i=1;i<occ.size();++i)occ[i]=1;occ[0]=0;vector<U64>total(a.size());for(size_t i=order.size();i-->0;){int u=order[i];U64 value=occ[static_cast<size_t>(u)];for(int v:a[static_cast<size_t>(u)].next)value+=total[static_cast<size_t>(v)];total[static_cast<size_t>(u)]=value;}if(k>total[0]){cout<<-1<<'\n';return 0;}string answer;int u=0;while(k>0){for(size_t c=0;c<26;++c){int v=a[static_cast<size_t>(u)].next[c];if(v==0)continue;if(k>total[static_cast<size_t>(v)])k-=total[static_cast<size_t>(v)];else{answer.push_back(static_cast<char>('a'+c));u=v;if(k<=occ[static_cast<size_t>(u)])k=0;else k-=occ[static_cast<size_t>(u)];break;}}}cout<<answer<<'\n';}
external_url: https://www.luogu.com.cn/problem/P3975
external_platform: 洛谷
external_problem_id: P3975
external_title: '[TJOI2015] 弦論'
external_relation: original
source_book_pages: [596, 599]
source_pdf_pages: [226, 229]
review_status: verified
---

字典序不是依狀態編號；要把每條字元轉移視為一整個帶權區塊，按 a 到 z 跳過。
