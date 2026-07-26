---
id: luogu-p1197
volume: upper
source_file: upper-volume
title: 洛谷 P1197 星球大戰：反向恢復節點
chapter: 4
section: '4.1'
kind: external-oj
difficulty: 4
topics: &id001
  - offline-reversal
  - disjoint-set-union
  - dynamic-connectivity
prerequisites:
  - disjoint-set-union
statement: 無向圖中的星球依指定順序被摧毀，摧毀星球也移除其鄰接隧道。輸出初始及每次摧毀後現存圖的連通分量數。
constraints:
  - 1 <= m <= 200000
  - 1 <= n <= 2m
  - 節點編號 0 到 n-1；被摧毀節點互異
input_format: 先給 n、m 與 m 條邊；再給 k 與 k 個依序摧毀的節點。
output_format: 共輸出 k+1 行：初始與每次攻擊後分量數。
samples:
  - input: |
      8 13
      0 1
      1 6
      6 5
      5 0
      0 6
      1 2
      2 3
      3 4
      4 5
      7 1
      7 2
      7 6
      3 6
      5
      1
      6
      3
      5
      7
    output: |
      1
      1
      1
      2
      3
      3
    explanation: 反向從全部五個目標已刪除的圖開始，依 7、5、3、6、1 恢復即可得到正向答案。
core_knowledge: *id001
judgment: 沒有星球時連通分量為 0；恢復節點本身先新增一個分量。
hints:
  - DSU 不擅長刪除，但擅長新增。
  - 先建立所有攻擊完成後仍存在的圖。
  - 倒序恢復節點與通往 active 鄰點的邊，再反向輸出。
solution_outline: 標記被刪節點，建最終圖 DSU；倒序 activate 每點並更新分量數。
proof_or_invariant: 反向第 i 個狀態與正向第 i 次攻擊後的現存圖完全相同；恢復時加入且只加入該點及當時可用邊，分量維護正確。
common_errors:
  - 恢復點前忘記 components++
  - 連到尚未恢復鄰點
  - 輸出少了初始狀態
complexity:
  time: O((n+m+k) alpha(n))
  space: O(n+m)
cpp_skeleton: |
  // TODO：先自行實作核心資料結構；此框架保持可嚴格編譯。
  #include <bits/stdc++.h>
  using namespace std;
  class DisjointSet{public:explicit DisjointSet(int n):p(static_cast<size_t>(n+1)),s(static_cast<size_t>(n+1),1){iota(p.begin(),p.end(),0);}int root(int x){return p[static_cast<size_t>(x)]==x?x:p[static_cast<size_t>(x)]=root(p[static_cast<size_t>(x)]);}bool unite(int a,int b){a=root(a);b=root(b);if(a==b)return false;if(s[static_cast<size_t>(a)]<s[static_cast<size_t>(b)])swap(a,b);p[static_cast<size_t>(b)]=a;s[static_cast<size_t>(a)]+=s[static_cast<size_t>(b)];return true;}int size(int x){return s[static_cast<size_t>(root(x))];}private:vector<int>p,s;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;cin>>n>>m;vector<vector<int>> graph(static_cast<size_t>(n));for(int i=0;i<m;++i){int a,b;cin>>a>>b;graph[static_cast<size_t>(a)].push_back(b);graph[static_cast<size_t>(b)].push_back(a);}int k;cin>>k;vector<int> removed(static_cast<size_t>(k));vector<char> active(static_cast<size_t>(n),1);for(int& x:removed){cin>>x;active[static_cast<size_t>(x)]=0;}DisjointSet dsu(n);int components=n-k;for(int a=0;a<n;++a)if(active[static_cast<size_t>(a)]!=0)for(int b:graph[static_cast<size_t>(a)])if(active[static_cast<size_t>(b)]!=0&&dsu.unite(a,b))--components;vector<int> answer(static_cast<size_t>(k+1));answer[static_cast<size_t>(k)]=components;for(int i=k-1;i>=0;--i){int x=removed[static_cast<size_t>(i)];active[static_cast<size_t>(x)]=1;++components;for(int y:graph[static_cast<size_t>(x)])if(active[static_cast<size_t>(y)]!=0&&dsu.unite(x,y))--components;answer[static_cast<size_t>(i)]=components;}for(int x:answer)cout<<x<<'\n';}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  class DisjointSet{public:explicit DisjointSet(int n):p(static_cast<size_t>(n+1)),s(static_cast<size_t>(n+1),1){iota(p.begin(),p.end(),0);}int root(int x){return p[static_cast<size_t>(x)]==x?x:p[static_cast<size_t>(x)]=root(p[static_cast<size_t>(x)]);}bool unite(int a,int b){a=root(a);b=root(b);if(a==b)return false;if(s[static_cast<size_t>(a)]<s[static_cast<size_t>(b)])swap(a,b);p[static_cast<size_t>(b)]=a;s[static_cast<size_t>(a)]+=s[static_cast<size_t>(b)];return true;}int size(int x){return s[static_cast<size_t>(root(x))];}private:vector<int>p,s;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;cin>>n>>m;vector<vector<int>> graph(static_cast<size_t>(n));for(int i=0;i<m;++i){int a,b;cin>>a>>b;graph[static_cast<size_t>(a)].push_back(b);graph[static_cast<size_t>(b)].push_back(a);}int k;cin>>k;vector<int> removed(static_cast<size_t>(k));vector<char> active(static_cast<size_t>(n),1);for(int& x:removed){cin>>x;active[static_cast<size_t>(x)]=0;}DisjointSet dsu(n);int components=n-k;for(int a=0;a<n;++a)if(active[static_cast<size_t>(a)]!=0)for(int b:graph[static_cast<size_t>(a)])if(active[static_cast<size_t>(b)]!=0&&dsu.unite(a,b))--components;vector<int> answer(static_cast<size_t>(k+1));answer[static_cast<size_t>(k)]=components;for(int i=k-1;i>=0;--i){int x=removed[static_cast<size_t>(i)];active[static_cast<size_t>(x)]=1;++components;for(int y:graph[static_cast<size_t>(x)])if(active[static_cast<size_t>(y)]!=0&&dsu.unite(x,y))--components;answer[static_cast<size_t>(i)]=components;}for(int x:answer)cout<<x<<'\n';}
external_url: https://www.luogu.com.cn/problem/P1197
external_platform: 洛谷
external_problem_id: P1197
external_title: 星球大戰
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
