---
id: luogu-p3863
volume: upper
source_file: upper-volume
source_book_pages: [197, 220]
source_pdf_pages: [215, 238]
chapter: 4
section: '4.5'
kind: external-oj
review_status: verified
external_relation: original
title: 洛谷 P3863 序列：位置與時間的離線掃描
difficulty: 5
topics: [掃描線, 時間軸分塊, 歷史查詢]
prerequisites: [sqrt-decomposition, offline-processing]
statement: 第 0 秒有一個序列，第 i 個操作發生在第 i 秒。操作可令一段區間加上整數，或詢問某位置在第 0 秒到本次操作前一秒之間，有多少秒的值不小於門檻。
constraints:
  - '2 <= n, q <= 100000'
  - '1 <= l <= r <= n，1 <= p <= n'
  - '初值、增量與門檻介於 -10^9 與 10^9'
input_format: 第一行 n、q，第二行初值；`1 l r x` 區間加，`2 p y` 查歷史門檻次數。
output_format: 每個操作 2 輸出一行答案。
samples:
  - input: |
      3 3
      1 3 5
      2 1 2
      1 1 2 -3
      2 1 1
    output: |
      0
      2
    explanation: 位置 1 在第 0、1、2 秒的值為 1、1、-2；兩次查詢分別只看秒 0，以及秒 0 到 2。
core_knowledge: [二維離線化, 位置掃描線, 時間軸區間加與門檻計數]
judgment: 把位置作掃描軸；一次區間修改對涵蓋位置的所有後續時刻加值，可在 l 加事件、r+1 減事件，時間維再用分塊。
hints:
  - 對修改發生在時刻 t 的 [l,r]+x，在位置 l 掛「時間 [t,q]+x」，在 r+1 掛相反事件。
  - 從位置 i 移到 i+1 時，整條時間軸還要加初值差 a[i+1]-a[i]。
  - 時間軸需支援後綴加，以及查前綴 [0,t-1] 中不小於 y 的個數，可用塊標記與塊內排序。
solution_outline: 讀入後把修改拆成位置事件、查詢掛到指定位置。掃描位置時維護所有時刻的該位置值，以時間分塊處理後綴加與前綴門檻計數。
proof_or_invariant: 掃到位置 p 時，時間陣列的第 t 項等於位置 p 在第 t 秒操作完成後的值；位置差與區間差分事件保持此不變量。詢問只統計 0..t-1，正合題意。
complexity:
  time: O((n+q)sqrt(q) log q)
  space: O(n+q)
common_errors:
  - 查詢把本次操作所在秒也算入
  - 修改事件從 t+1 才生效而產生一秒偏移
  - 掃到下一位置時忘記加入兩位置初值差
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,q;cin>>n>>q;vector<long long>a(static_cast<size_t>(n+1));for(int i=1;i<=n;++i)cin>>a[static_cast<size_t>(i)];vector<vector<long long>>history(static_cast<size_t>(n+1));for(int i=1;i<=n;++i)history[static_cast<size_t>(i)].push_back(a[static_cast<size_t>(i)]);while(q--){int op;cin>>op;if(op==1){int l,r;long long x;cin>>l>>r>>x;for(int i=l;i<=r;++i)a[static_cast<size_t>(i)]+=x;for(int i=1;i<=n;++i)history[static_cast<size_t>(i)].push_back(a[static_cast<size_t>(i)]);}else{int p;long long y;cin>>p>>y;cout<<count_if(history[static_cast<size_t>(p)].begin(),history[static_cast<size_t>(p)].end(),[y](long long x){return x>=y;})<<'\n';}}}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  struct Event{int time;long long delta;};struct Query{int time,index;long long threshold;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,q;cin>>n>>q;vector<long long>initial(static_cast<size_t>(n+1));for(int i=1;i<=n;++i)cin>>initial[static_cast<size_t>(i)];vector<vector<Event>>event(static_cast<size_t>(n+2));vector<vector<Query>>query(static_cast<size_t>(n+1));int query_count=0;for(int time=1;time<=q;++time){int op;cin>>op;if(op==1){int l,r;long long x;cin>>l>>r>>x;event[static_cast<size_t>(l)].push_back({time,x});event[static_cast<size_t>(r+1)].push_back({time,-x});}else{int p;long long y;cin>>p>>y;query[static_cast<size_t>(p)].push_back({time,query_count++,y});}}int size=q+1,length=max(1,static_cast<int>(sqrt(static_cast<double>(size)))),blocks=(size+length-1)/length;vector<long long>value(static_cast<size_t>(size),initial[1]),tag(static_cast<size_t>(blocks));vector<vector<long long>>sorted(static_cast<size_t>(blocks));auto rebuild=[&](int b){int l=b*length,r=min(size,(b+1)*length);auto&v=sorted[static_cast<size_t>(b)];v.assign(value.begin()+l,value.begin()+r);sort(v.begin(),v.end());};for(int b=0;b<blocks;++b)rebuild(b);auto suffix_add=[&](int left,long long delta){int b=left/length,end=min(size,(b+1)*length);for(int i=left;i<end;++i)value[static_cast<size_t>(i)]+=delta;rebuild(b);for(++b;b<blocks;++b)tag[static_cast<size_t>(b)]+=delta;};auto prefix_count=[&](int right,long long threshold){int answer=0,full=right/length;for(int b=0;b<full;++b){const auto&v=sorted[static_cast<size_t>(b)];answer+=static_cast<int>(v.end()-lower_bound(v.begin(),v.end(),threshold-tag[static_cast<size_t>(b)]));}for(int i=full*length;i<=right;++i)answer+=value[static_cast<size_t>(i)]+tag[static_cast<size_t>(full)]>=threshold;return answer;};vector<int>answer(static_cast<size_t>(query_count));for(int position=1;position<=n;++position){if(position>1)suffix_add(0,initial[static_cast<size_t>(position)]-initial[static_cast<size_t>(position-1)]);for(const Event&e:event[static_cast<size_t>(position)])suffix_add(e.time,e.delta);for(const Query&item:query[static_cast<size_t>(position)])answer[static_cast<size_t>(item.index)]=prefix_count(item.time-1,item.threshold);}for(int x:answer)cout<<x<<'\n';}
external_url: https://www.luogu.com.cn/problem/P3863
external_platform: 洛谷
external_problem_id: P3863
external_title: 序列
---

歷史版本問題常可把「時間」提升成另一個幾何維度，再以掃描線處理。
