---
id: openj-bailian-1988
volume: upper
source_file: upper-volume
title: OpenJudge 百練 1988 Cube Stacking：帶位移並查集
chapter: 4
section: '4.1'
kind: external-oj
difficulty: 3
topics: &id001
  - weighted-disjoint-set-union
  - relative-offset
prerequisites:
  - disjoint-set-union
statement: 最多三萬個方塊起初各成一疊。M X Y 把 X 所在整疊搬到 Y 所在整疊上方；C X 詢問 X 下方有幾個方塊。
constraints:
  - 1 <= N <= 30000
  - 1 <= P <= 100000
  - 輸入不提供 N；搬移保證兩疊不同
input_format: 第一行操作數 P；之後為 M X Y 或 C X。
output_format: 每次 C 輸出 X 下方方塊數。
samples:
  - input: |
      6
      M 1 6
      C 1
      M 2 4
      M 2 6
      C 3
      C 4
    output: |
      1
      0
      2
    explanation: 1 疊到 6 上後其下有一塊；2、4 疊再搬到含 6 的疊後，4 下方共有兩塊。
core_knowledge: *id001
judgment: M 搬的是 X 所在整疊，不是單一方塊。
hints:
  - 根代表一疊最底端，根上保存整疊大小。
  - below[x] 記 x 到父節點之間累積的下方數。
  - 把根 rx 接到 ry 時，rx 下方新增 size[ry]。
solution_outline: 帶權並查集保存每節點下方位移；合併整疊時更新舊根位移與新根大小。
proof_or_invariant: 父鏈每條權值代表搬移時下方新增量，沿鏈相加就是該方塊下方總數；整疊內相對順序不變。
common_errors:
  - 把單一 X 接到 Y 而非兩個根
  - 路徑壓縮未累加 below
  - 合併後更新錯誤根的 size
complexity:
  time: O(P alpha(N))
  space: O(N)
cpp_skeleton: |
  // TODO：先自行重建核心不變量，再與下列可編譯框架比較。
  #include <bits/stdc++.h>
  using namespace std;
  class StackSet{public:explicit StackSet(int n):parent_(static_cast<size_t>(n+1)),size_(static_cast<size_t>(n+1),1),below_(static_cast<size_t>(n+1),0){iota(parent_.begin(),parent_.end(),0);}int find_root(int x){int p=parent_[static_cast<size_t>(x)];if(p!=x){parent_[static_cast<size_t>(x)]=find_root(p);below_[static_cast<size_t>(x)]+=below_[static_cast<size_t>(p)];}return parent_[static_cast<size_t>(x)];}void move(int x,int y){int rx=find_root(x),ry=find_root(y);if(rx==ry)return;parent_[static_cast<size_t>(rx)]=ry;below_[static_cast<size_t>(rx)]=size_[static_cast<size_t>(ry)];size_[static_cast<size_t>(ry)]+=size_[static_cast<size_t>(rx)];}int below(int x){find_root(x);return below_[static_cast<size_t>(x)];}private:vector<int>parent_,size_,below_;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int p;cin>>p;StackSet dsu(30000);while(p--){char op;int x,y;cin>>op>>x;if(op=='M'){cin>>y;dsu.move(x,y);}else cout<<dsu.below(x)<<'\n';}}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  class StackSet{public:explicit StackSet(int n):parent_(static_cast<size_t>(n+1)),size_(static_cast<size_t>(n+1),1),below_(static_cast<size_t>(n+1),0){iota(parent_.begin(),parent_.end(),0);}int find_root(int x){int p=parent_[static_cast<size_t>(x)];if(p!=x){parent_[static_cast<size_t>(x)]=find_root(p);below_[static_cast<size_t>(x)]+=below_[static_cast<size_t>(p)];}return parent_[static_cast<size_t>(x)];}void move(int x,int y){int rx=find_root(x),ry=find_root(y);if(rx==ry)return;parent_[static_cast<size_t>(rx)]=ry;below_[static_cast<size_t>(rx)]=size_[static_cast<size_t>(ry)];size_[static_cast<size_t>(ry)]+=size_[static_cast<size_t>(rx)];}int below(int x){find_root(x);return below_[static_cast<size_t>(x)];}private:vector<int>parent_,size_,below_;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int p;cin>>p;StackSet dsu(30000);while(p--){char op;int x,y;cin>>op>>x;if(op=='M'){cin>>y;dsu.move(x,y);}else cout<<dsu.below(x)<<'\n';}}
external_url: http://bailian.openjudge.cn/practice/1988/
external_platform: OpenJ_Bailian
external_problem_id: '1988'
external_title: Cube Stacking
external_relation: original
source_book_pages:
  - 151
  - 314
source_pdf_pages:
  - 169
  - 332
review_status: verified
---

本題卡片依官方題面重新敘述，程式採 C++17。
