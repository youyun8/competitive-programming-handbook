---
id: luogu-p1525
volume: upper
source_file: upper-volume
title: 洛谷 P1525 關押罪犯：最小化最大衝突
chapter: 4
section: '4.1'
kind: external-oj
difficulty: 4
topics: &id001
  - bipartite-constraints
  - disjoint-set-union
  - greedy
prerequisites:
  - disjoint-set-union
statement: 把 n 名罪犯分到兩座監獄；同獄的一對罪犯會產生指定怨氣值。求所有同獄衝突中的最大值最小可為多少，無衝突則為 0。
constraints:
  - n <= 20000
  - m <= 100000
  - 怨氣值不超過 10^9
input_format: 第一行 n、m；接著 m 行 a b c。
output_format: 輸出最小可能的最大怨氣值。
samples:
  - input: |
      4 6
      1 4 2534
      2 3 3512
      1 2 28351
      1 3 6618
      2 4 1805
      3 4 12884
    output: |
      3512
    explanation: 可讓所有怨氣大於 3512 的配對分處兩獄，但再要求 3512 這對也分開會產生矛盾。
core_knowledge: *id001
judgment: 目標是最小化最大值，不是怨氣總和。
hints:
  - 由大到小嘗試強制衝突邊兩端分開。
  - 為每人建立「在另一獄」的對應節點。
  - 首次發現兩端已被迫同獄時，該邊權就是答案。
solution_outline: 降序掃邊，以 2n DSU 加入 a 與 b 異側；首次矛盾輸出權值。
proof_or_invariant: 在權值門檻以上的所有邊可二分時可避免這些衝突；第一條不可再分開的邊給出恰好不可突破的最小最大值。
common_errors:
  - 升序處理
  - 只記一個 enemy 指標卻未正確合併
  - 無矛盾時未輸出 0
complexity:
  time: O(m log m)
  space: O(n+m)
cpp_skeleton: |
  // TODO：先自行實作核心資料結構；此框架保持可嚴格編譯。
  #include <bits/stdc++.h>
  using namespace std;
  class DisjointSet{public:explicit DisjointSet(int n):p(static_cast<size_t>(n+1)),s(static_cast<size_t>(n+1),1){iota(p.begin(),p.end(),0);}int root(int x){return p[static_cast<size_t>(x)]==x?x:p[static_cast<size_t>(x)]=root(p[static_cast<size_t>(x)]);}bool unite(int a,int b){a=root(a);b=root(b);if(a==b)return false;if(s[static_cast<size_t>(a)]<s[static_cast<size_t>(b)])swap(a,b);p[static_cast<size_t>(b)]=a;s[static_cast<size_t>(a)]+=s[static_cast<size_t>(b)];return true;}int size(int x){return s[static_cast<size_t>(root(x))];}private:vector<int>p,s;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;cin>>n>>m;vector<array<int,3>> conflict(static_cast<size_t>(m));for(auto& e:conflict)cin>>e[0]>>e[1]>>e[2];sort(conflict.begin(),conflict.end(),[](auto a,auto b){return a[2]>b[2];});DisjointSet dsu(2*n);for(auto e:conflict){int a=e[0],b=e[1];if(dsu.root(a)==dsu.root(b)){cout<<e[2]<<'\n';return 0;}dsu.unite(a,b+n);dsu.unite(a+n,b);}cout<<0<<'\n';}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  class DisjointSet{public:explicit DisjointSet(int n):p(static_cast<size_t>(n+1)),s(static_cast<size_t>(n+1),1){iota(p.begin(),p.end(),0);}int root(int x){return p[static_cast<size_t>(x)]==x?x:p[static_cast<size_t>(x)]=root(p[static_cast<size_t>(x)]);}bool unite(int a,int b){a=root(a);b=root(b);if(a==b)return false;if(s[static_cast<size_t>(a)]<s[static_cast<size_t>(b)])swap(a,b);p[static_cast<size_t>(b)]=a;s[static_cast<size_t>(a)]+=s[static_cast<size_t>(b)];return true;}int size(int x){return s[static_cast<size_t>(root(x))];}private:vector<int>p,s;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;cin>>n>>m;vector<array<int,3>> conflict(static_cast<size_t>(m));for(auto& e:conflict)cin>>e[0]>>e[1]>>e[2];sort(conflict.begin(),conflict.end(),[](auto a,auto b){return a[2]>b[2];});DisjointSet dsu(2*n);for(auto e:conflict){int a=e[0],b=e[1];if(dsu.root(a)==dsu.root(b)){cout<<e[2]<<'\n';return 0;}dsu.unite(a,b+n);dsu.unite(a+n,b);}cout<<0<<'\n';}
external_url: https://www.luogu.com.cn/problem/P1525
external_platform: 洛谷
external_problem_id: P1525
external_title: 關押罪犯
external_relation: original
source_book_pages:
  - 151
  - 314
source_pdf_pages:
  - 169
  - 332
review_status: verified
---

先明確寫下資料結構不變量，再推導合併公式。
