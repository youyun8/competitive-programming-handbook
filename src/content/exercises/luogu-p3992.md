---
id: luogu-p3992
volume: upper
source_file: upper-volume
source_book_pages: [197, 220]
source_pdf_pages: [215, 238]
chapter: 4
section: '4.5'
kind: external-oj
review_status: verified
external_relation: original
title: 洛谷 P3992 開車：動態最小一維匹配
difficulty: 5
topics: [分塊, 前綴平衡, 一維匹配]
prerequisites: [sqrt-decomposition, coordinate-compression]
statement: 數軸上有同樣數量的汽車與加油站，每車須一對一前往一站，求最小總距離。每次修改某輛車的位置後再次輸出答案。
constraints:
  - 汽車數與修改數不超過 100000
  - 所有座標可用 32 位元有號整數表示
  - 修改只移動指定汽車，加油站固定
input_format: 第一行 n，接著 n 個汽車座標、n 個加油站座標；再給 q 與 q 行 car_id、new_position。
output_format: 先輸出初始最小總距離，再逐行輸出每次修改後答案。
samples:
  - input: |
      2
      0 10
      3 8
      2
      1 4
      2 7
    output: |
      5
      3
      2
    explanation: 一維最優匹配保持排序；兩次移動後距離分別為 1+2 與 1+1。
core_knowledge: [排序匹配, 邊流量貢獻, 帶權絕對值和]
judgment: 每段座標間隙被穿越的次數是左側汽車數減加油站數的絕對值；移車只讓兩座標間的一段前綴平衡整體 ±1。
hints:
  - 離線收集所有可能出現座標；令 d_i 為座標 i 左側汽車數減站數，答案是 Σ gap_i×|d_i|。
  - 車從 old 移到 new，只修改兩者壓縮下標之間的 d，方向決定加一或減一。
  - 對 d 分塊；完整塊以 lazy 與按 d 排序的 gap 權重前綴，二分 0 分界後重算絕對值和。
solution_outline: 壓縮初始、車站與所有新座標，建立每段前綴平衡及長度。分塊維護帶權 |d| 和，區間 ±1 後相加各塊答案。
proof_or_invariant: 一維最優匹配不交叉。每跨越一段的淨車流量必為該段左側供需差，故貢獻公式成立；移動一輛車對前綴差的影響恰是一個連續區間的 ±1。
complexity:
  time: O((n+q)sqrt(n)log n)
  space: O(n+q)
common_errors:
  - 間隙貢獻使用右端座標而非相鄰座標差
  - 移車方向與區間增量正負寫反
  - 未把所有未來新座標一起離散化
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  static long long answer(vector<long long>car,vector<long long>station){sort(car.begin(),car.end());sort(station.begin(),station.end());long long sum=0;for(size_t i=0;i<car.size();++i)sum+=llabs(car[i]-station[i]);return sum;}
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;cin>>n;vector<long long>car(static_cast<size_t>(n)),station(static_cast<size_t>(n));for(auto&x:car)cin>>x;for(auto&x:station)cin>>x;cout<<answer(car,station)<<'\n';int q;cin>>q;while(q--){int id;long long p;cin>>id>>p;car[static_cast<size_t>(id-1)]=p;cout<<answer(car,station)<<'\n';}}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  struct Change{int id;long long position;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;cin>>n;vector<long long>car(static_cast<size_t>(n)),station(static_cast<size_t>(n)),coordinate;for(auto&x:car){cin>>x;coordinate.push_back(x);}for(auto&x:station){cin>>x;coordinate.push_back(x);}int q;cin>>q;vector<Change>change(static_cast<size_t>(q));for(auto&item:change){cin>>item.id>>item.position;--item.id;coordinate.push_back(item.position);}sort(coordinate.begin(),coordinate.end());coordinate.erase(unique(coordinate.begin(),coordinate.end()),coordinate.end());int segments=static_cast<int>(coordinate.size())-1;vector<int>difference(coordinate.size());auto index_of=[&](long long x){return static_cast<int>(lower_bound(coordinate.begin(),coordinate.end(),x)-coordinate.begin());};for(long long x:car)++difference[static_cast<size_t>(index_of(x))];for(long long x:station)--difference[static_cast<size_t>(index_of(x))];vector<long long>value(static_cast<size_t>(max(0,segments))),weight(static_cast<size_t>(max(0,segments)));int prefix=0;for(int i=0;i<segments;++i){prefix+=difference[static_cast<size_t>(i)];value[static_cast<size_t>(i)]=prefix;weight[static_cast<size_t>(i)]=coordinate[static_cast<size_t>(i+1)]-coordinate[static_cast<size_t>(i)];}int length=max(1,static_cast<int>(sqrt(static_cast<double>(max(1,segments))))),blocks=(segments+length-1)/length;vector<long long>tag(static_cast<size_t>(blocks)),block_answer(static_cast<size_t>(blocks));vector<vector<pair<long long,long long>>>ordered(static_cast<size_t>(blocks));auto rebuild=[&](int b){int l=b*length,r=min(segments,(b+1)*length);auto&o=ordered[static_cast<size_t>(b)];o.clear();block_answer[static_cast<size_t>(b)]=0;for(int i=l;i<r;++i){o.push_back({value[static_cast<size_t>(i)],weight[static_cast<size_t>(i)]});block_answer[static_cast<size_t>(b)]+=weight[static_cast<size_t>(i)]*llabs(value[static_cast<size_t>(i)]+tag[static_cast<size_t>(b)]);}sort(o.begin(),o.end());};for(int b=0;b<blocks;++b)rebuild(b);auto retag=[&](int b,long long delta){tag[static_cast<size_t>(b)]+=delta;long long result=0;for(const auto&[raw,w]:ordered[static_cast<size_t>(b)])result+=w*llabs(raw+tag[static_cast<size_t>(b)]);block_answer[static_cast<size_t>(b)]=result;};auto range_add=[&](int l,int r,long long delta){if(l>r)return;int lb=l/length,rb=r/length;if(lb==rb){for(int i=l;i<=r;++i)value[static_cast<size_t>(i)]+=delta;rebuild(lb);}else{for(int i=l;i<(lb+1)*length;++i)value[static_cast<size_t>(i)]+=delta;rebuild(lb);for(int b=lb+1;b<rb;++b)retag(b,delta);for(int i=rb*length;i<=r;++i)value[static_cast<size_t>(i)]+=delta;rebuild(rb);}};auto output=[&](){cout<<accumulate(block_answer.begin(),block_answer.end(),0LL)<<'\n';};output();for(const Change&item:change){int old=index_of(car[static_cast<size_t>(item.id)]),now=index_of(item.position);if(old<now)range_add(old,now-1,-1);else if(now<old)range_add(now,old-1,1);car[static_cast<size_t>(item.id)]=item.position;output();}}
external_url: https://www.luogu.com.cn/problem/P3992
external_platform: 洛谷
external_problem_id: P3992
external_title: '[BJOI2017] 开车'
---

匹配距離可改寫成每條相鄰座標邊上的流量成本，動態修改便只剩區間 ±1。
