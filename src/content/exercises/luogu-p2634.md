---
id: luogu-p2634
volume: upper
source_file: upper-volume
source_book_pages: [253]
source_pdf_pages: [271]
chapter: 4
section: '4.9'
kind: external-oj
review_status: verified
external_relation: original
title: 洛谷 P2634 聰聰可可：樹距離模三計數
difficulty: 4
topics: [樹形 DP, 距離餘數, 點對計數]
prerequisites: [tree-dp]
statement: 帶權樹上等機率選擇有序起點與終點（可相同），求兩點距離為 3 的倍數的機率，以最簡分數輸出。
constraints:
  - '1 <= n <= 20000'
  - 邊權為正整數
  - 分母為 n^2
input_format: 第一行 n；接著 n-1 行 u、v、w。
output_format: 最簡分數 numerator/denominator。
samples:
  - input: |
      3
      1 2 1
      2 3 2
    output: |
      5/9
    explanation: 三組同點有序對及 1↔3 兩組有序對距離可被 3 整除，共 5 組。
core_knowledge: [modulo_distance, 在 LCA 合併子樹, ordered_pair_conversion]
judgment: 只關心距離模 3；固定節點作兩點 LCA 時，可用已合併部分與新兒子子樹的餘數桶計數跨子樹路徑。
hints:
  - 每個子樹維護 count[u][r]：u 到子樹節點距離模 3 為 r 的節點數。
  - 合併邊權 w 的兒子時，先把兒子餘數平移 w，再與目前桶配對，使兩餘數和模 3 為 0。
  - DP 得到的是不同節點無序對；分子轉為 2×pairs+n，再與 n^2 約分。
solution_outline: 後序樹 DP，逐兒子合併三個餘數桶並累加合法跨部分點對；最後轉成有序對機率。
proof_or_invariant: 任意不同節點對在其 LCA 處首次位於兩個已合併部分，距離餘數是兩段到 LCA 餘數之和，因此恰被計一次；同點對另加 n。
complexity:
  time: O(n)
  space: O(n)
common_errors:
  - 只輸出無序點對比例
  - 漏掉起終點相同的 n 組距離 0
  - 兒子餘數未加連接邊權後就配對
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;cin>>n;/* TODO：三餘數樹 DP。 */}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;cin>>n;vector<vector<pair<int,int>>>graph(static_cast<size_t>(n+1));for(int i=1,u,v,w;i<n;++i){cin>>u>>v>>w;w%=3;graph[static_cast<size_t>(u)].push_back({v,w});graph[static_cast<size_t>(v)].push_back({u,w});}vector<int>parent(static_cast<size_t>(n+1)),order{1};for(size_t i=0;i<order.size();++i){int node=order[i];for(auto [next,weight]:graph[static_cast<size_t>(node)])if(next!=parent[static_cast<size_t>(node)]){(void)weight;parent[static_cast<size_t>(next)]=node;order.push_back(next);}}vector<array<long long,3>>count(static_cast<size_t>(n+1));long long unordered_pairs=0;for(auto iterator=order.rbegin();iterator!=order.rend();++iterator){int node=*iterator;count[static_cast<size_t>(node)][0]=1;for(auto [next,weight]:graph[static_cast<size_t>(node)])if(parent[static_cast<size_t>(next)]==node){array<long long,3>shifted{};for(int residue=0;residue<3;++residue)shifted[static_cast<size_t>((residue+weight)%3)]=count[static_cast<size_t>(next)][static_cast<size_t>(residue)];for(int first=0;first<3;++first)for(int second=0;second<3;++second)if((first+second)%3==0)unordered_pairs+=count[static_cast<size_t>(node)][static_cast<size_t>(first)]*shifted[static_cast<size_t>(second)];for(int residue=0;residue<3;++residue)count[static_cast<size_t>(node)][static_cast<size_t>(residue)]+=shifted[static_cast<size_t>(residue)];}}long long numerator=2*unordered_pairs+n,denominator=1LL*n*n,divisor=gcd(numerator,denominator);cout<<numerator/divisor<<'/'<<denominator/divisor<<'\n';}
external_url: https://www.luogu.com.cn/problem/P2634
external_platform: 洛谷
external_problem_id: P2634
external_title: '[国家集训队] 聪聪可可'
---

點分治可做本題，但模數只有三時，以 LCA 為唯一歸屬點的樹 DP 更短且達到線性時間。
