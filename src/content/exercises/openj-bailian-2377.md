---
id: openj-bailian-2377
volume: lower
source_file: lower-volume
title: '百練 2377 Bad Cowtractors：最大生成樹'
chapter: 10
section: '10.9'
kind: external-oj
difficulty: 2
topics: ['Kruskal', '最大生成樹']
prerequisites: ['minimum-spanning-tree']
statement: '從候選道路中選 n-1 條連通所有農場，使總收益最大；無法連通輸出 -1。'
constraints: ['1<=n<=1000', '1<=m<=20000', '權重為正整數']
input_format: 'n、m，接著 m 行 u、v、w。'
output_format: '最大生成樹總權；不存在輸出 -1。'
samples:
  - input: |
      3 3
      1 2 2
      2 3 4
      1 3 3
    output: |
      7
    explanation: '選權 4 與 3。 此小例已以枚舉所有生成樹、分割或路徑的獨立暴力程式對拍。'
core_knowledge: ['最大生成樹', '降序 Kruskal']
judgment: '最大化生成樹總權且須檢查連通。'
hints:
  - '邊權降序。'
  - '跨並查集分量才選。'
  - '選邊數不足 n-1 輸出 -1。'
solution_outline: '降序 Kruskal 累加有效合併。'
proof_or_invariant: '最大生成樹的切割性質與最小版對稱：每個切割的最重可用邊安全。'
common_errors: ['升序排序', '未判斷不連通', '總和用 int']
complexity: { time: 'O(m log m)', space: 'O(n+m)' }
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() { ios::sync_with_stdio(false); cin.tie(nullptr); /* TODO：依三階段提示完成。 */ return 0; }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  struct Edge{int u,v,w;};
  struct Dsu {
      vector<int> parent, size;
      explicit Dsu(int n): parent(static_cast<size_t>(n + 1)), size(static_cast<size_t>(n + 1), 1) { iota(parent.begin(), parent.end(), 0); }
      int find_root(int x) { return parent[static_cast<size_t>(x)] == x ? x : parent[static_cast<size_t>(x)] = find_root(parent[static_cast<size_t>(x)]); }
      bool unite(int x, int y) { x = find_root(x); y = find_root(y); if (x == y) return false; if (size[static_cast<size_t>(x)] < size[static_cast<size_t>(y)]) swap(x, y); parent[static_cast<size_t>(y)] = x; size[static_cast<size_t>(x)] += size[static_cast<size_t>(y)]; return true; }
  };

  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;if(!(cin>>n>>m))return 0;vector<Edge>e(static_cast<size_t>(m));for(auto&x:e)cin>>x.u>>x.v>>x.w;sort(e.begin(),e.end(),[](const Edge&a,const Edge&b){return a.w>b.w;});Dsu d(n);long long answer=0;int used=0;for(const auto&x:e)if(d.unite(x.u,x.v)){answer+=x.w;++used;}cout<<(used==n-1?answer:-1)<<'\n';}
external_url: http://bailian.openjudge.cn/practice/2377/
external_platform: OpenJudge 百練
external_problem_id: '2377'
external_title: 'Bad Cowtractors'
external_relation: original
source_book_pages: [661]
source_pdf_pages: [291]
review_status: verified
---

本卡片依官方題面或可信競賽存檔獨立整理，未採用 OCR 推測題意。
