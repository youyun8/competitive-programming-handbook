---
id: luogu-p3287
volume: upper
source_file: upper-volume
title: 洛谷 P3287 方伯伯的玉米田
chapter: 5
section: '5.7'
kind: external-oj
difficulty: 5
topics: ['fenwick-tree', 'dynamic-programming']
prerequisites: ['dynamic-programming']
statement: >-
  給玉米高度序列。至多 k 次操作，每次選一個區間全部加一；之後可刪任意元素，求剩餘高度非遞減的最大株數。
constraints:
  - 2 <= n < 10000
  - 2 <= k <= 500
  - 1 <= a_i <= 5000
input_format: 第一行 n、k；第二行 n 個高度。
output_format: 輸出最長可保留株數。
samples:
  - input: |-
      5 2
      3 1 2 1 4
    output: |-
      4
    explanation: 適當把後綴視為區間加高後，可保留四株形成非遞減序列。
core_knowledge: ['最長不降子序列', '區間加操作', '二維偏序']
judgment: 最優操作可延長至序列尾端；若第 i 株累計加 j，前驅狀態 (q,a_p+q) 必同時不超過 (j,a_i+j)。
hints:
  - 令 f[i][j] 為以 i 結尾且 i 被加 j 次的最長長度。
  - 轉移查詢所有 p<i、q<=j、a[p]+q<=a[i]+j 的最大 f。
  - 用按 j 分組的高度 Fenwick 與按 a+j 分組的操作數 Fenwick，查二維前綴邊界；j 倒序避免同一元素自轉移。
solution_outline: >-
  依 i 掃描，對 j=k..0 查兩組 Fenwick 前綴最大值得 f，再分別更新 low[j] 的高度位置與 over[a+j] 的 j+1 位置。
proof_or_invariant: >-
  任何被選子序列的區間加操作都可把右端延至 n，不降低後續高度，因此每點只需記被多少個後綴加。合法相鄰狀態恰是兩座標偏序。二維前綴最大值的邊界可由固定 j 與固定 a+j 的兩組一維查詢覆蓋，轉移完整。
common_errors: ['j 正序造成同一株重複計數', 'Fenwick 下標 j=0 未平移一', '只比較原高度而漏掉加高次數']
complexity:
  time: 'O(nk(log A+log k))'
  space: 'O(kA)'
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：依狀態定義完成初始化、轉移與答案輸出。
      return 0;
  }
cpp_solution: |
  #include <algorithm>
  #include <iostream>
  #include <vector>
  using namespace std;
  struct Fenwick{vector<int>bit;Fenwick()=default;explicit Fenwick(int n):bit(n+1){}int query(int x){int r=0;for(;x>0;x-=x&-x)r=max(r,bit[x]);return r;}void add(int x,int v){for(int n=static_cast<int>(bit.size());x<n;x+=x&-x)bit[x]=max(bit[x],v);}};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,k;cin>>n>>k;vector<int>a(n);int bound=k;for(int&x:a){cin>>x;bound=max(bound,x+k);}vector<Fenwick>by_add;for(int j=0;j<=k;j++)by_add.emplace_back(bound+1);vector<Fenwick>by_height;for(int x=0;x<=bound;x++)by_height.emplace_back(k+1);int answer=0;for(int value:a)for(int j=k;j>=0;j--){int best=max(by_add[j].query(value),by_height[value+j].query(j+1))+1;answer=max(answer,best);by_add[j].add(value,best);by_height[value+j].add(j+1,best);}cout<<answer<<'\n';}
external_url: https://www.luogu.com.cn/problem/P3287
external_platform: 洛谷
external_problem_id: 'P3287'
external_title: 方伯伯的玉米田
external_relation: original
source_book_pages: [366]
source_pdf_pages: [384]
review_status: verified
---

操作可標準化為後綴加，問題遂成為操作次數與調整後高度的二維偏序 LIS。
