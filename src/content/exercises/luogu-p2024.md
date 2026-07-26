---
id: luogu-p2024
volume: upper
source_file: upper-volume
title: 洛谷 P2024 食物鏈：模三帶權並查集
chapter: 4
section: '4.1'
kind: external-oj
difficulty: 4
topics: &id001
  - weighted-disjoint-set-union
  - modular-relation
  - consistency-check
prerequisites:
  - disjoint-set-union
statement: 三類動物形成循環捕食。依序判斷同類或捕食敘述，編號越界、自食或與先前真話矛盾者是假話，求假話數。
constraints:
  - 1 <= N <= 50000
  - 0 <= K <= 100000
input_format: 第一行 N、K；接著 K 行 D X Y，D=1 同類，D=2 表示 X 吃 Y。
output_format: 輸出假話總數。
samples:
  - input: |
      100 7
      1 101 1
      2 1 2
      2 2 3
      2 3 3
      1 1 3
      2 3 1
      1 5 5
    output: |
      3
    explanation: 越界、自食及與已接受關係衝突各產生一條假話。
core_knowledge: *id001
judgment: 假話不加入資料結構，後續只依先前真話判斷。
hints:
  - 以模 3 差表示同類、吃、被吃。
  - 路徑壓縮時累加節點到根的關係。
  - 同根檢查差，異根由等式反推根權值。
solution_outline: 帶權 DSU 依序驗證或加入每條模三關係，先處理越界與自食。
proof_or_invariant: 關係差沿父鏈模三相加；同根時既有差唯一，異根時總能設定根間差滿足新真話，因此衝突判定充要。
common_errors:
  - 假話仍合併
  - 負餘數未正規化
  - D=2 的方向寫反
complexity:
  time: O((N+K) alpha(N))
  space: O(N)
cpp_skeleton: |
  // TODO：先自行實作核心資料結構；此框架保持可嚴格編譯。
  #include <bits/stdc++.h>
  using namespace std;
  class RelationSet{public:explicit RelationSet(int n):p(static_cast<size_t>(n+1)),r(static_cast<size_t>(n+1)){iota(p.begin(),p.end(),0);}int root(int x){int q=p[static_cast<size_t>(x)];if(q!=x){p[static_cast<size_t>(x)]=root(q);r[static_cast<size_t>(x)]=(r[static_cast<size_t>(x)]+r[static_cast<size_t>(q)])%3;}return p[static_cast<size_t>(x)];}bool add(int a,int b,int wanted){int ra=root(a),rb=root(b);if(ra==rb)return (r[static_cast<size_t>(a)]-r[static_cast<size_t>(b)]+3)%3==wanted;p[static_cast<size_t>(ra)]=rb;r[static_cast<size_t>(ra)]=(wanted-r[static_cast<size_t>(a)]+r[static_cast<size_t>(b)]+6)%3;return true;}private:vector<int>p,r;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,k;cin>>n>>k;RelationSet dsu(n);int lies=0;while(k--){int d,x,y;cin>>d>>x>>y;if(x>n||y>n||(d==2&&x==y)||!dsu.add(x,y,d-1))++lies;}cout<<lies<<'\n';}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  class RelationSet{public:explicit RelationSet(int n):p(static_cast<size_t>(n+1)),r(static_cast<size_t>(n+1)){iota(p.begin(),p.end(),0);}int root(int x){int q=p[static_cast<size_t>(x)];if(q!=x){p[static_cast<size_t>(x)]=root(q);r[static_cast<size_t>(x)]=(r[static_cast<size_t>(x)]+r[static_cast<size_t>(q)])%3;}return p[static_cast<size_t>(x)];}bool add(int a,int b,int wanted){int ra=root(a),rb=root(b);if(ra==rb)return (r[static_cast<size_t>(a)]-r[static_cast<size_t>(b)]+3)%3==wanted;p[static_cast<size_t>(ra)]=rb;r[static_cast<size_t>(ra)]=(wanted-r[static_cast<size_t>(a)]+r[static_cast<size_t>(b)]+6)%3;return true;}private:vector<int>p,r;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,k;cin>>n>>k;RelationSet dsu(n);int lies=0;while(k--){int d,x,y;cin>>d>>x>>y;if(x>n||y>n||(d==2&&x==y)||!dsu.add(x,y,d-1))++lies;}cout<<lies<<'\n';}
external_url: https://www.luogu.com.cn/problem/P2024
external_platform: 洛谷
external_problem_id: P2024
external_title: 食物鏈
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
