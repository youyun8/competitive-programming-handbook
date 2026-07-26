---
id: luogu-p4047
volume: lower
source_file: lower-volume
title: '洛谷 P4047 部落劃分：最大化群間距離'
chapter: 10
section: '10.9'
kind: external-oj
difficulty: 3
topics: ['Kruskal', '聚類']
prerequisites: ['minimum-spanning-tree']
statement: '把 n 個平面點分成 k 個非空部落，最大化最近兩部落間的距離。'
constraints: ['2 <= k <= n <= 1000', '0 <= x,y <= 10000']
input_format: 'n、k；接著 n 行座標。'
output_format: '最優最近部落距離，兩位小數。'
samples:
  - input: |
      3 2
      0 0
      3 0
      0 4
    output: |
      4.00
    explanation: '把距離 3 的兩點放同部落，另一點獨立，最近的跨部落距離為 4。此小例已以枚舉所有兩群分割的獨立暴力程式對拍。'
core_knowledge: ['single-linkage 聚類', 'Kruskal']
judgment: '形成 k 個分量後，下一條會合併不同分量的最短邊才是群間距離。'
hints:
  - '先以 Kruskal 合併到 k 個分量。'
  - '不要輸出最後一條已合併的邊。'
  - '繼續找第一條跨不同分量的邊，其權才是答案。'
solution_outline: '遞增掃邊；合併至 k 分量後，輸出下一條端點仍分屬不同分量的邊。'
proof_or_invariant: '任意分組的群間距離為跨群邊最小值。Kruskal 在答案門檻以下強迫相連的點必須同群；首次需要第 k-1 次以外合併的邊就是最大可維持門檻。'
common_errors: ['與 P1991 相同地輸出最後合併邊', 'k=1 邊界', '距離未開根號']
complexity: { time: 'O(n^2 log n)', space: 'O(n^2)' }
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() { ios::sync_with_stdio(false); cin.tie(nullptr); /* TODO：依三階段提示完成。 */ return 0; }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  struct Edge{int u,v;double w;};
  struct Dsu {
      vector<int> parent, size;
      explicit Dsu(int n): parent(static_cast<size_t>(n + 1)), size(static_cast<size_t>(n + 1), 1) { iota(parent.begin(), parent.end(), 0); }
      int find_root(int x) { return parent[static_cast<size_t>(x)] == x ? x : parent[static_cast<size_t>(x)] = find_root(parent[static_cast<size_t>(x)]); }
      bool unite(int x, int y) { x = find_root(x); y = find_root(y); if (x == y) return false; if (size[static_cast<size_t>(x)] < size[static_cast<size_t>(y)]) swap(x, y); parent[static_cast<size_t>(y)] = x; size[static_cast<size_t>(x)] += size[static_cast<size_t>(y)]; return true; }
  };

  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,k;cin>>n>>k;vector<pair<int,int>>p(static_cast<size_t>(n));for(auto&x:p)cin>>x.first>>x.second;vector<Edge>e;for(int i=0;i<n;++i)for(int j=i+1;j<n;++j)e.push_back({i+1,j+1,hypot(static_cast<double>(p[static_cast<size_t>(i)].first-p[static_cast<size_t>(j)].first),static_cast<double>(p[static_cast<size_t>(i)].second-p[static_cast<size_t>(j)].second))});sort(e.begin(),e.end(),[](const Edge&a,const Edge&b){return a.w<b.w;});Dsu d(n);int components=n;double answer=0;for(const auto&x:e){if(d.find_root(x.u)==d.find_root(x.v))continue;if(components==k){answer=x.w;break;}d.unite(x.u,x.v);--components;}cout<<fixed<<setprecision(2)<<answer<<'\n';}
external_url: https://www.luogu.com.cn/problem/P4047
external_platform: 洛谷
external_problem_id: 'P4047'
external_title: '[JSOI2010] 部落劃分'
external_relation: original
source_book_pages: [659, 662]
source_pdf_pages: [289, 292]
review_status: verified
---

本卡片依官方題面或可信競賽存檔獨立整理，未採用 OCR 推測題意。
