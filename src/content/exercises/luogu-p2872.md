---
id: luogu-p2872
volume: lower
source_file: lower-volume
title: '洛谷 P2872 Building Roads：預連通 MST'
chapter: 10
section: '10.9'
kind: external-oj
difficulty: 2
topics: ['Kruskal', '預連通分量', '歐氏距離']
prerequisites: ['minimum-spanning-tree']
statement: '平面上 n 個農場已有 m 條道路，新增直線道路使全部連通，求最小新增總長。'
constraints: ['1<=n<=1000', '1<=m<=1000', '0<=座標<=1000000']
input_format: 'n、m；n 行座標；m 行既有道路端點。'
output_format: '最小新增長度，兩位小數。'
samples:
  - input: |
      3 1
      0 0
      3 0
      0 4
      1 2
    output: |
      4.00
    explanation: '1、2 已連通，只需建 1-3 長度 4。 此小例已以枚舉所有生成樹、分割或路徑的獨立暴力程式對拍。'
core_knowledge: ['預先合併', '完全圖 MST']
judgment: '既有道路成本視為零且可傳遞連通。'
hints:
  - '先把既有道路端點 union。'
  - '列舉所有點對歐氏距離。'
  - 'Kruskal 只累加仍跨分量的新道路。'
solution_outline: '以既有路初始化 DSU，再對所有幾何邊做遞增 Kruskal。'
proof_or_invariant: '把既有路收縮成零成本超點後即為普通 MST；預合併 DSU 與收縮等價，Kruskal 得最小新增成本。'
common_errors: ['既有路仍計距離', '座標差先平方造成 int 溢位', '輸出精度錯誤']
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

  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;cin>>n>>m;vector<pair<long long,long long>>p(static_cast<size_t>(n+1));for(int i=1;i<=n;++i)cin>>p[static_cast<size_t>(i)].first>>p[static_cast<size_t>(i)].second;Dsu d(n);for(int i=0,u,v;i<m;++i){cin>>u>>v;d.unite(u,v);}vector<Edge>e;for(int i=1;i<=n;++i)for(int j=i+1;j<=n;++j)e.push_back({i,j,hypot(static_cast<double>(p[static_cast<size_t>(i)].first-p[static_cast<size_t>(j)].first),static_cast<double>(p[static_cast<size_t>(i)].second-p[static_cast<size_t>(j)].second))});sort(e.begin(),e.end(),[](const Edge&a,const Edge&b){return a.w<b.w;});double answer=0;for(const auto&x:e)if(d.unite(x.u,x.v))answer+=x.w;cout<<fixed<<setprecision(2)<<answer<<'\n';}
external_url: https://www.luogu.com.cn/problem/P2872
external_platform: 洛谷
external_problem_id: 'P2872'
external_title: '[USACO07DEC] Building Roads S'
external_relation: original
source_book_pages: [659, 662]
source_pdf_pages: [289, 292]
review_status: verified
---

本卡片依官方題面或可信競賽存檔獨立整理，未採用 OCR 推測題意。
