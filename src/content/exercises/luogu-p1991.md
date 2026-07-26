---
id: luogu-p1991
volume: lower
source_file: lower-volume
title: '洛谷 P1991 無線通訊網：MST 分群'
chapter: 10
section: '10.9'
kind: external-oj
difficulty: 3
topics: ['Kruskal', '聚類', '歐氏距離']
prerequisites: ['minimum-spanning-tree']
statement: 'P 個哨所中可裝 S 套衛星電話；其餘以同一通訊半徑的無線電連通，求所需最小半徑。'
constraints: ['1<=S<=100', 'S<P<=500', '0<=x,y<=10000']
input_format: 'S、P；接著 P 行座標。'
output_format: '最小通訊距離，兩位小數。'
samples:
  - input: |
      1 3
      0 0
      3 0
      0 4
    output: |
      4.00
    explanation: '一組無線網需兩條 MST 邊，最大長度為 4。 此小例已以枚舉所有生成樹、分割或路徑的獨立暴力程式對拍。'
core_knowledge: ['MST 分群', 'Kruskal']
judgment: '衛星電話使 S 個無線連通塊彼此免費互通。'
hints:
  - '完整圖邊權為歐氏距離。'
  - 'Kruskal 合併直到剩 S 個分量。'
  - '最後一次合併邊權就是答案。'
solution_outline: '生成所有點對邊，遞增 Kruskal；分量數降至 S 時輸出當前權。'
proof_or_invariant: '門檻 D 下可形成的最少分量數由加入所有 <=D 邊決定；Kruskal 首次降至 S 分量的權即最小可行 D。'
common_errors: ['合併到一個分量', '平方距離直接輸出', 'S>=P 邊界未輸出 0']
complexity: { time: 'O(P^2 log P)', space: 'O(P^2)' }
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

  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int satellites,n;cin>>satellites>>n;vector<pair<int,int>>p(static_cast<size_t>(n));for(auto&x:p)cin>>x.first>>x.second;vector<Edge>e;for(int i=0;i<n;++i)for(int j=i+1;j<n;++j)e.push_back({i+1,j+1,hypot(static_cast<double>(p[static_cast<size_t>(i)].first-p[static_cast<size_t>(j)].first),static_cast<double>(p[static_cast<size_t>(i)].second-p[static_cast<size_t>(j)].second))});sort(e.begin(),e.end(),[](const Edge&a,const Edge&b){return a.w<b.w;});Dsu d(n);double answer=0;int components=n;for(const auto&x:e)if(d.unite(x.u,x.v)){answer=x.w;if(--components==satellites)break;}cout<<fixed<<setprecision(2)<<answer<<'\n';}
external_url: https://www.luogu.com.cn/problem/P1991
external_platform: 洛谷
external_problem_id: 'P1991'
external_title: '無線通訊網'
external_relation: original
source_book_pages: [659, 662]
source_pdf_pages: [289, 292]
review_status: verified
---

本卡片依官方題面或可信競賽存檔獨立整理，未採用 OCR 推測題意。
