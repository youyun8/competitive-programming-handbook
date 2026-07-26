---
id: luogu-p2852
volume: lower
source_file: lower-volume
title: 洛谷 P2852 Milk Patterns G
chapter: 9
section: '9.7'
kind: external-oj
difficulty: 4
topics: [suffix-array, lcp, monotonic-queue]
prerequisites: [suffix-array]
statement: 給定整數序列，求至少出現 K 次的最長連續子序列長度；各次出現可以重疊。
constraints: ['1 <= N <= 20000', '2 <= K <= N', '每個值介於 0 與 1000000']
input_format: 第一行 N、K，接著 N 個整數（可跨行）。
output_format: 輸出最長重複模式長度。
samples:
  - input: "8 2\n1\n2\n3\n2\n3\n2\n3\n1\n"
    output: '4'
    explanation: 2,3,2,3 在位置 2 與 4 各出現一次；另以枚舉短序列所有子段對拍。
core_knowledge: [整數後綴陣列, Kasai LCP, 滑動窗口最小值]
judgment: 出現可重疊；要求至少 K 次，答案是長度而非模式內容。
hints:
  - K 個後綴共有長度 L 的前綴，當且僅當它們在 SA 中形成連續窗口且窗口內 K−1 個相鄰 LCP 都至少 L。
  - 因此每個 K 後綴窗口的可行長度，是對應 LCP 窗口的最小值。
  - 用單調佇列維護長度 K−1 的 LCP 滑動最小值，取所有窗口最大值。
solution_outline: 對整數離散排名後以倍增法建 SA，再用 Kasai 求 height。若 K=1 答 N；否則單調佇列掃 height[1..N−1]，維護 K−1 個元素的最小值並取最大。
proof_or_invariant: 任意出現至少 K 次的模式對應 K 個以它開頭的後綴，這些後綴在字典序中連續，且相鄰 LCP 最小值至少模式長。反之任一 K 後綴窗口的最小 LCP 是它們共同前綴長度，確實出現 K 次；取最大即最優。
common_errors: [LCP 窗口誤用 K 個而非 K−1 個, 禁止重疊而漏解, 整數值未離散化就錯開計數陣列]
complexity: { time: 'O(N log²N)', space: 'O(N)' }
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);/* TODO：SA/LCP 後滑動最小 K-1 個 height。*/return 0;}
cpp_solution: |
  #include <algorithm>
  #include <deque>
  #include <iostream>
  #include <numeric>
  #include <utility>
  #include <vector>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n=0,k=0;cin>>n>>k;vector<int>s(static_cast<size_t>(n));for(int&x:s)cin>>x;vector<int>sa(static_cast<size_t>(n)),rank_of=s,next_rank(static_cast<size_t>(n));iota(sa.begin(),sa.end(),0);{vector<int>values=s;sort(values.begin(),values.end());values.erase(unique(values.begin(),values.end()),values.end());for(int i=0;i<n;++i)rank_of[static_cast<size_t>(i)]=static_cast<int>(lower_bound(values.begin(),values.end(),s[static_cast<size_t>(i)])-values.begin());}for(int length=1;;length<<=1){sort(sa.begin(),sa.end(),[&](int x,int y){pair<int,int>lx{rank_of[static_cast<size_t>(x)],x+length<n?rank_of[static_cast<size_t>(x+length)]:-1},ly{rank_of[static_cast<size_t>(y)],y+length<n?rank_of[static_cast<size_t>(y+length)]:-1};return lx<ly;});next_rank[static_cast<size_t>(sa[0])]=0;for(int i=1;i<n;++i){int x=sa[static_cast<size_t>(i-1)],y=sa[static_cast<size_t>(i)];pair<int,int>lx{rank_of[static_cast<size_t>(x)],x+length<n?rank_of[static_cast<size_t>(x+length)]:-1},ly{rank_of[static_cast<size_t>(y)],y+length<n?rank_of[static_cast<size_t>(y+length)]:-1};next_rank[static_cast<size_t>(y)]=next_rank[static_cast<size_t>(x)]+(lx!=ly);}rank_of=next_rank;if(rank_of[static_cast<size_t>(sa.back())]==n-1)break;}vector<int>height(static_cast<size_t>(n));for(int i=0;i<n;++i)rank_of[static_cast<size_t>(sa[static_cast<size_t>(i)])]=i;for(int i=0,matched=0;i<n;++i){int rank=rank_of[static_cast<size_t>(i)];if(rank==0)continue;int previous=sa[static_cast<size_t>(rank-1)];while(i+matched<n&&previous+matched<n&&s[static_cast<size_t>(i+matched)]==s[static_cast<size_t>(previous+matched)])++matched;height[static_cast<size_t>(rank)]=matched;if(matched>0)--matched;}deque<int>window;int answer=0;for(int i=1;i<n;++i){while(!window.empty()&&height[static_cast<size_t>(window.back())]>=height[static_cast<size_t>(i)])window.pop_back();window.push_back(i);while(!window.empty()&&window.front()<i-(k-2))window.pop_front();if(i>=k-1)answer=max(answer,height[static_cast<size_t>(window.front())]);}cout<<answer<<'\n';}
external_url: https://www.luogu.com.cn/problem/P2852
external_platform: 洛谷
external_problem_id: P2852
external_title: '[USACO06DEC] Milk Patterns G'
external_relation: original
source_book_pages: [587, 595]
source_pdf_pages: [217, 225]
review_status: verified
---

K 次出現就是 K 個後綴的共同前綴；SA 將候選聚成窗口，LCP 最小值給出窗口答案。
