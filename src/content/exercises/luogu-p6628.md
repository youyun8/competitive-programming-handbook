---
id: luogu-p6628
volume: lower
source_file: lower-volume
original_label: 洛谷 P6628
title: 丁香之路：線性距離上的郵差路徑
chapter: 10
section: '10.3'
kind: external-oj
difficulty: 5
topics: [euler-trail, minimum-weight-matching, minimum-spanning-tree]
prerequisites: [euler-trail, disjoint-set, kruskal]
statement: >-
  n 個頂點編號 1 到 n，任兩點 u、v 間都有耗時 |u-v| 的無向邊；其中給定 m 條開有丁香花的
  道路。所有朋友都從 s 出發，第 t 位朋友要在頂點 t 結束，且每條丁香路至少經過一次。
  對每個 t=1..n，求完成要求的最少總耗時。
constraints: [1 <= n <= 2500, 0 <= m <= n(n-1)/2, 1 <= s <= n, 丁香路無重複且端點不同, 所有答案需 64 位整數]
input_format: 第一行 n m s；接著 m 行 u v，表示一條必須經過的無向邊。
output_format: 輸出一行 n 個以空格分隔的整數，第 t 個是從 s 出發、在 t 結束的最少耗時。
samples:
  - input: "4 3 1\n1 2\n4 2\n3 1\n"
    output: "6 7 8 7\n"
    explanation: 必經邊成本和為 6；依終點調整奇度並補足連通後，四個最小值依序為 6、7、8、7。
  - input: "6 0 2\n"
    output: "1 0 1 2 3 4\n"
    explanation: 沒有必經邊，從 2 直接走到各終點即可，回到 2 本身成本為零。
  - input: "5 4 1\n1 2\n3 4\n4 5\n3 5\n"
    output: "8 7 6 7 8\n"
    explanation: 必經邊可能不連通；除了修正奇偶度，還須以成對道路連接其所在分量。
core_knowledge: [加入零成本虛擬端點邊, 線上相鄰奇點配對, 分量的加倍 MST]
judgment: >-
  對終點 t 暫加零成本虛擬邊 s-t，把 Euler 路化成 Euler 迴路；相鄰配對所有奇點，
  每對以等成本的相鄰點鏈連接並順便吸收沿途分量，再把剩餘分量以線性距離 MST 連通且每條連接邊走兩次。
hints:
  - 固定終點 t，加入一條只用於建模、成本為零的 s-t 虛擬邊；刪除它後，Euler 迴路正好成為所求 s 到 t 路徑。
  - 在距離 |u-v| 的直線上，將奇度點依編號排序後相鄰配對，就是修正全部奇偶度的最小成本。
  - 配對邊可拆成同成本的連續單位邊以吸收中間分量；縮點後再對相鄰有邊頂點做 Kruskal，每條連接邊加入兩份。
solution_outline: >-
  先累加所有必經邊成本、度數並建立 DSU。對每個終點 t 複製狀態，令 s、t 度數各加一並合併
  其分量（代表零成本虛擬邊）；由小到大把奇度點兩兩連接，累加距離，並以相同成本的單位邊鏈
  合併兩端間每個頂點。收集度數非零點，
  將相鄰點形成的邊按距離排序後做 Kruskal，每次成功合併增加兩倍邊權。所得成本即該 t 答案。
proof_or_invariant: >-
  固定 t，在任何可行 s-t 行走中加入虛擬邊 t-s，便得到一個連通偶度多重圖；反之刪除任一
  含虛擬邊的 Euler 迴路，即得使用其餘每條邊的 s-t Euler 路，因此問題等價於以最小成本補成
  連通偶度圖。令奇點為 x1<...<x2q。任一配對在直線上若有交錯或巢狀端點，可用三角等式交換
  成 (x1,x2),(x3,x4),... 而不增成本；故相鄰配對是最小 T-join。距離 xj-xi 的配對邊可改成
  i,i+1,...,j 的單位邊鏈，成本相同且中間點度數增加二，不改奇偶，故可免費吸收沿途分量。
  修正奇偶後，額外維持偶度的
  連通部分可分解為若干閉合走法；每次跨越兩個既有分量的割至少要出去再回來，成本至少是分量
  距離 MST 的兩倍。反過來，把 MST 每條邊各加入兩份，會保持所有度數為偶且使分量連通，恰達
  此下界。在一維度量中，任一割的最短跨割邊必可由相鄰的有邊頂點代表，因此對這些相鄰邊做
  Kruskal 得到的就是分量度量 MST。兩階段構造遂同時達到奇偶與連通下界，答案最優。
common_errors:
  [把虛擬 s-t 邊的距離計入答案, 修正奇度後忘記合併其 DSU 分量, 連分量時只加一份邊而破壞偶度, 以 32 位整數累加]
complexity: { time: 'O(m + n^2 log n)', space: 'O(m + n)' }
cpp_skeleton: |
  #include <cstdint>
  #include <iostream>
  #include <vector>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n=0,m=0,start=0;cin>>n>>m>>start;/* TODO：逐終點修正奇度，再以加倍 MST 連接分量。*/}
cpp_solution: |
  #include <algorithm>
  #include <cstdint>
  #include <cstdlib>
  #include <iostream>
  #include <numeric>
  #include <tuple>
  #include <vector>
  using namespace std;
  class DisjointSet{
  public:
      explicit DisjointSet(int size):parent_(static_cast<size_t>(size)),rank_(static_cast<size_t>(size),0){iota(parent_.begin(),parent_.end(),0);}
      int find(int vertex){int& parent=parent_[static_cast<size_t>(vertex)];if(parent!=vertex)parent=find(parent);return parent;}
      bool unite(int first,int second){
          first=find(first);second=find(second);if(first==second)return false;
          if(rank_[static_cast<size_t>(first)]<rank_[static_cast<size_t>(second)])swap(first,second);
          parent_[static_cast<size_t>(second)]=first;
          if(rank_[static_cast<size_t>(first)]==rank_[static_cast<size_t>(second)])++rank_[static_cast<size_t>(first)];
          return true;
      }
  private:
      vector<int> parent_;
      vector<int> rank_;
  };
  int main(){
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n=0,m=0,start=0;
      if(!(cin>>n>>m>>start))return 0;
      --start;
      vector<int> base_degree(static_cast<size_t>(n),0);
      DisjointSet base_components(n);
      int64_t base_cost=0;
      for(int edge=0;edge<m;++edge){
          int u=0,v=0;cin>>u>>v;--u;--v;
          base_cost+=static_cast<int64_t>(abs(u-v));
          ++base_degree[static_cast<size_t>(u)];
          ++base_degree[static_cast<size_t>(v)];
          base_components.unite(u,v);
      }
      for(int target=0;target<n;++target){
          vector<int> degree=base_degree;
          DisjointSet components=base_components;
          ++degree[static_cast<size_t>(start)];
          ++degree[static_cast<size_t>(target)];
          components.unite(start,target);
          int64_t answer=base_cost;
          int pending_odd=-1;
          for(int vertex=0;vertex<n;++vertex){
              if(degree[static_cast<size_t>(vertex)]%2==0)continue;
              if(pending_odd==-1){
                  pending_odd=vertex;
              }else{
                  answer+=vertex-pending_odd;
                  for(int position=pending_odd;position<vertex;++position)components.unite(position,position+1);
                  pending_odd=-1;
              }
          }
          vector<int> active_vertices;
          for(int vertex=0;vertex<n;++vertex)if(degree[static_cast<size_t>(vertex)]>0)active_vertices.push_back(vertex);
          vector<tuple<int,int,int>> candidate_edges;
          for(size_t index=1;index<active_vertices.size();++index){
              const int left=active_vertices[index-1];
              const int right=active_vertices[index];
              candidate_edges.emplace_back(right-left,left,right);
          }
          sort(candidate_edges.begin(),candidate_edges.end());
          for(const auto& [weight,u,v]:candidate_edges)if(components.unite(u,v))answer+=2LL*weight;
          if(target>0)cout<<' ';
          cout<<answer;
      }
      cout<<'\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P6628
external_platform: 洛谷
external_problem_id: P6628
external_title: '[省選聯考 2020 B 卷] 丁香之路'
external_relation: original
source_book_pages: [615]
source_pdf_pages: [245]
review_status: verified
---

官方三組範例均已實跑；另以 n≤7 的狀態最短路枚舉所有必經邊覆蓋狀態，對隨機小圖逐終點對拍。
