---
id: luogu-p4514
volume: upper
source_file: upper-volume
title: 洛谷 P4514 上帝造題的七分鐘：二維區間修改查詢
chapter: 4
section: '4.2'
kind: external-oj
difficulty: 4
topics: &id001
  - two-dimensional-fenwick-tree
  - difference-array
  - inclusion-exclusion
prerequisites:
  - fenwick-tree
  - two-dimensional-prefix-sum
statement: 初始為全零的 n×m 矩陣。L 將指定矩形所有元素加 delta；小寫 k 查詢指定矩形元素總和。
constraints:
  - 1 <= n,m <= 2048
  - 操作不超過 200000
  - -500 <= delta <= 500
  - 最終答案落在 32 位元，但中間計算應使用 64 位元
input_format: 第一行 `X n m`；之後讀到 EOF，為 `L a b c d delta` 或 `k a b c d`。
output_format: 每個小寫 k 操作輸出矩形總和。
samples:
  - input: |
      X 4 4
      L 1 1 3 3 2
      L 2 2 4 4 1
      k 2 2 3 3
    output: |
      12
    explanation: 查詢的四格先各加 2，又各加 1，因此總和為 4×3=12。
core_knowledge: *id001
judgment: 輸入查詢命令是小寫 k；矩形四邊都包含。
hints:
  - 一維區間加區間和需要兩棵 BIT，二維展開後需要四棵。
  - 以四個角做二維差分更新。
  - 前綴和是 B1*x*y-Bx*y-By*x+Bxy，再用容斥求矩形。
solution_outline: 四棵二維 BIT 維護差分的 1、x-1、y-1、(x-1)(y-1) 係數，矩形更新拆四角，查詢拆四前綴。
proof_or_invariant: 二維差分的每個角對前綴矩形貢獻可展開為四個可分離係數；BIT 分別累積後公式重建前綴和，容斥得到任意矩形。
common_errors:
  - 把命令 k 當大寫
  - 角落 x2+1 或 y2+1 越界未忽略
  - 乘法在轉成 long long 前已溢位
complexity:
  time: 每次 O(log n log m)
  space: O(nm)
cpp_skeleton: |
  // TODO：先自行補出核心更新與查詢，再用此可編譯框架核對。
  #include <bits/stdc++.h>
  using namespace std;
  class Fenwick2D{public:Fenwick2D(int n,int m):n_(n),m_(m),tree_(static_cast<size_t>((n+1)*(m+1))){ }void add(int x,int y,long long v){for(int i=x;i<=n_;i+=i&-i)for(int j=y;j<=m_;j+=j&-j)tree_[index(i,j)]+=v;}long long sum(int x,int y)const{long long ans=0;for(int i=x;i>0;i-=i&-i)for(int j=y;j>0;j-=j&-j)ans+=tree_[index(i,j)];return ans;}private:size_t index(int x,int y)const{return static_cast<size_t>(x*(m_+1)+y);}int n_,m_;vector<long long>tree_;};
  class RectangleFenwick{public:RectangleFenwick(int n,int m):n_(n),m_(m),one_(n,m),x_(n,m),y_(n,m),xy_(n,m){}void add_rectangle(int x1,int y1,int x2,int y2,long long v){corner(x1,y1,v);corner(x1,y2+1,-v);corner(x2+1,y1,-v);corner(x2+1,y2+1,v);}long long query_rectangle(int x1,int y1,int x2,int y2)const{return prefix(x2,y2)-prefix(x1-1,y2)-prefix(x2,y1-1)+prefix(x1-1,y1-1);}private:void corner(int x,int y,long long v){if(x>n_||y>m_)return;one_.add(x,y,v);x_.add(x,y,v*(x-1));y_.add(x,y,v*(y-1));xy_.add(x,y,v*(x-1)*(y-1));}long long prefix(int x,int y)const{return one_.sum(x,y)*x*y-x_.sum(x,y)*y-y_.sum(x,y)*x+xy_.sum(x,y);}int n_,m_;Fenwick2D one_,x_,y_,xy_;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);char op;int n,m;cin>>op>>n>>m;RectangleFenwick bit(n,m);while(cin>>op){int a,b,c,d;cin>>a>>b>>c>>d;if(op=='L'){long long delta;cin>>delta;bit.add_rectangle(a,b,c,d,delta);}else cout<<bit.query_rectangle(a,b,c,d)<<'\n';}}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  class Fenwick2D{public:Fenwick2D(int n,int m):n_(n),m_(m),tree_(static_cast<size_t>((n+1)*(m+1))){ }void add(int x,int y,long long v){for(int i=x;i<=n_;i+=i&-i)for(int j=y;j<=m_;j+=j&-j)tree_[index(i,j)]+=v;}long long sum(int x,int y)const{long long ans=0;for(int i=x;i>0;i-=i&-i)for(int j=y;j>0;j-=j&-j)ans+=tree_[index(i,j)];return ans;}private:size_t index(int x,int y)const{return static_cast<size_t>(x*(m_+1)+y);}int n_,m_;vector<long long>tree_;};
  class RectangleFenwick{public:RectangleFenwick(int n,int m):n_(n),m_(m),one_(n,m),x_(n,m),y_(n,m),xy_(n,m){}void add_rectangle(int x1,int y1,int x2,int y2,long long v){corner(x1,y1,v);corner(x1,y2+1,-v);corner(x2+1,y1,-v);corner(x2+1,y2+1,v);}long long query_rectangle(int x1,int y1,int x2,int y2)const{return prefix(x2,y2)-prefix(x1-1,y2)-prefix(x2,y1-1)+prefix(x1-1,y1-1);}private:void corner(int x,int y,long long v){if(x>n_||y>m_)return;one_.add(x,y,v);x_.add(x,y,v*(x-1));y_.add(x,y,v*(y-1));xy_.add(x,y,v*(x-1)*(y-1));}long long prefix(int x,int y)const{return one_.sum(x,y)*x*y-x_.sum(x,y)*y-y_.sum(x,y)*x+xy_.sum(x,y);}int n_,m_;Fenwick2D one_,x_,y_,xy_;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);char op;int n,m;cin>>op>>n>>m;RectangleFenwick bit(n,m);while(cin>>op){int a,b,c,d;cin>>a>>b>>c>>d;if(op=='L'){long long delta;cin>>delta;bit.add_rectangle(a,b,c,d,delta);}else cout<<bit.query_rectangle(a,b,c,d)<<'\n';}}
external_url: https://www.luogu.com.cn/problem/P4514
external_platform: 洛谷
external_problem_id: P4514
external_title: 上帝造題的七分鐘
external_relation: original
source_book_pages:
  - 151
  - 314
source_pdf_pages:
  - 169
  - 332
review_status: verified
---

將每個標記的語意固定後再實作，可避免重複計算。
