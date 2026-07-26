---
id: luogu-p2294
volume: lower
source_file: lower-volume
original_label: 洛谷 P2294
title: 洛谷 P2294 狡猾的商人：帶權並查集驗帳
chapter: 10
section: '10.8'
kind: external-oj
difficulty: 3
topics: [帶權並查集, 前綴和, 差分約束]
prerequisites: [dijkstra]
core_knowledge: [區間和轉前綴差, 勢能差, 矛盾環]
judgment: 記錄 [u,v] 總收入 s 等價於 prefix[v]-prefix[u-1]=s。
statement: 多組帳本給出若干月份區間收入總和，判斷所有紀錄能否同時成立。
constraints: [多組資料, 收入可正可負, 月份區間以 1 開始]
input_format: 第一行資料組數 w；每組為月份數 n、紀錄數 m，再輸入 m 行 u、v、s。
output_format: 每組真實輸出 true，矛盾輸出 false。
samples:
  - input: |-
      2
      2 2
      1 1 3
      1 2 5
      2 3
      1 1 3
      2 2 4
      1 2 8
    output: |-
      true
      false
    explanation: 第二組前兩條推出兩月合計 7，與第三條的 8 矛盾。
hints:
  - 建立前綴點 0..n，區間 [u,v] 對應 v 與 u-1 的差。
  - 帶權並查集維護 weight[x]=prefix[x]-prefix[parent[x]]。
  - 兩點已連通時比較既有差值與新紀錄；未連通時依方程合併。
solution_outline: 用帶權並查集維護前綴和節點間已知差值，逐條加入等式；若同集合內差值不一致即標記假帳。
proof_or_invariant: 路徑壓縮後 weight[x] 等於 prefix[x]-prefix[root]，所以同根兩點之差可唯一求得。合併公式維持每條已接受等式；同根時不一致當且僅當新等式與既有等式環矛盾。
complexity: { time: 'O(m α(n))', space: 'O(n)' }
common_errors: [區間左端沒有減一, 合併根時權值符號寫反, 發現矛盾後未讀完本組輸入]
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){int tests;cin>>tests;/* TODO：帶權並查集維護前綴差。 */}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  struct Dsu{
      vector<int> parent;vector<long long> weight;
      explicit Dsu(int n):parent(static_cast<size_t>(n)),weight(static_cast<size_t>(n),0){iota(parent.begin(),parent.end(),0);}
      int find(int x){if(parent[static_cast<size_t>(x)]==x)return x;int old=parent[static_cast<size_t>(x)];parent[static_cast<size_t>(x)]=find(old);weight[static_cast<size_t>(x)]+=weight[static_cast<size_t>(old)];return parent[static_cast<size_t>(x)];}
      bool add(int left,int right,long long sum){int a=find(left),b=find(right);if(a==b)return weight[static_cast<size_t>(right)]-weight[static_cast<size_t>(left)]==sum;
          parent[static_cast<size_t>(b)]=a;weight[static_cast<size_t>(b)]=sum+weight[static_cast<size_t>(left)]-weight[static_cast<size_t>(right)];return true;}
  };
  int main(){
      ios::sync_with_stdio(false);cin.tie(nullptr);
      int tests;if(!(cin>>tests))return 0;while(tests-->0){int n,m;cin>>n>>m;Dsu dsu(n+1);bool valid=true;
          for(int i=0;i<m;++i){int u,v;long long sum;cin>>u>>v>>sum;if(!dsu.add(u-1,v,sum))valid=false;}
          cout<<(valid?"true":"false")<<'\n';
      }
  }
external_url: https://www.luogu.com.cn/problem/P2294
external_platform: 洛谷
external_problem_id: P2294
external_title: '[HNOI2005] 狡猾的商人'
external_relation: original
source_book_pages: [600, 683]
source_pdf_pages: [230, 313]
review_status: verified
---

區間和等式先轉成前綴和差，就成了帶權並查集最標準的勢能關係。
