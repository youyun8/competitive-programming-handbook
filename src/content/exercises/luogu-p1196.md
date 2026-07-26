---
id: luogu-p1196
volume: upper
source_file: upper-volume
title: 洛谷 P1196 銀河英雄傳說：戰艦列隊位移
chapter: 4
section: '4.1'
kind: external-oj
difficulty: 4
topics: &id001
  - weighted-disjoint-set-union
  - relative-offset
  - sequence-concatenation
prerequisites:
  - disjoint-set-union
statement: 三萬艘戰艦起初各自成列。M i j 把 i 所在整列接到 j 所在列尾；C i j 詢問同列兩艦之間有幾艘，不同列輸出 -1。
constraints:
  - 操作數 T <= 500000
  - 戰艦編號 1 到 30000
input_format: 第一行 T；每行 M i j 或 C i j。
output_format: 每個 C 輸出兩艦之間數量或 -1。
samples:
  - input: |
      4
      M 2 3
      C 1 2
      M 2 4
      C 4 2
    output: |
      -1
      1
    explanation: 第一次查詢時 1、2 不同列；把含 2、3 的列接到 4 後，4 與 2 之間隔著一艘戰艦。
core_knowledge: *id001
judgment: M 搬移整個 i 所在列；題目保證兩列原先不同。
hints:
  - 根維護列長，offset 維護節點到根的相對位置。
  - 來源根接到目的根時 offset 設為目的列長。
  - 同根時答案為位置差絕對值減一。
solution_outline: 帶位移 DSU 支援整列串接與同列位置差查詢。
proof_or_invariant: 每次串接保持兩列內部順序，來源列所有位置統一增加目的列長；父邊 offset 正表示此平移，沿鏈相加得到全局相對位置。
common_errors:
  - 只搬 i 而非整列
  - 查詢前未壓縮更新 offset
  - 忘記位置差要減一
complexity:
  time: O(T alpha(30000))
  space: O(30000)
cpp_skeleton: |
  // TODO：先自行實作核心資料結構；此框架保持可嚴格編譯。
  #include <bits/stdc++.h>
  using namespace std;
  class GalaxySet{public:GalaxySet():p(30001),s(30001,1),offset(30001){iota(p.begin(),p.end(),0);}int root(int x){int q=p[static_cast<size_t>(x)];if(q!=x){p[static_cast<size_t>(x)]=root(q);offset[static_cast<size_t>(x)]+=offset[static_cast<size_t>(q)];}return p[static_cast<size_t>(x)];}void move(int a,int b){int ra=root(a),rb=root(b);if(ra==rb)return;p[static_cast<size_t>(ra)]=rb;offset[static_cast<size_t>(ra)]=s[static_cast<size_t>(rb)];s[static_cast<size_t>(rb)]+=s[static_cast<size_t>(ra)];}int between(int a,int b){if(root(a)!=root(b))return -1;return max(0,abs(offset[static_cast<size_t>(a)]-offset[static_cast<size_t>(b)])-1);}private:vector<int>p,s,offset;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int t;cin>>t;GalaxySet dsu;while(t--){char op;int a,b;cin>>op>>a>>b;if(op=='M')dsu.move(a,b);else cout<<dsu.between(a,b)<<'\n';}}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  class GalaxySet{public:GalaxySet():p(30001),s(30001,1),offset(30001){iota(p.begin(),p.end(),0);}int root(int x){int q=p[static_cast<size_t>(x)];if(q!=x){p[static_cast<size_t>(x)]=root(q);offset[static_cast<size_t>(x)]+=offset[static_cast<size_t>(q)];}return p[static_cast<size_t>(x)];}void move(int a,int b){int ra=root(a),rb=root(b);if(ra==rb)return;p[static_cast<size_t>(ra)]=rb;offset[static_cast<size_t>(ra)]=s[static_cast<size_t>(rb)];s[static_cast<size_t>(rb)]+=s[static_cast<size_t>(ra)];}int between(int a,int b){if(root(a)!=root(b))return -1;return max(0,abs(offset[static_cast<size_t>(a)]-offset[static_cast<size_t>(b)])-1);}private:vector<int>p,s,offset;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int t;cin>>t;GalaxySet dsu;while(t--){char op;int a,b;cin>>op>>a>>b;if(op=='M')dsu.move(a,b);else cout<<dsu.between(a,b)<<'\n';}}
external_url: https://www.luogu.com.cn/problem/P1196
external_platform: 洛谷
external_problem_id: P1196
external_title: 銀河英雄傳說
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
