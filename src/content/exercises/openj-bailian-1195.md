---
id: openj-bailian-1195
volume: upper
source_file: upper-volume
title: OpenJudge 百練 1195 Mobile phones：二維點增量與矩形和
chapter: 4
section: '4.2'
kind: external-oj
difficulty: 4
topics: &id001
  - two-dimensional-fenwick-tree
  - inclusion-exclusion
prerequisites:
  - fenwick-tree
statement: S×S 網格初值為零，支援單格增量與閉矩形手機總數查詢。
constraints:
  - 1 <= S <= 1024
  - 更新量 -32768 到 32767
  - 指令不超過 60002
input_format: 指令 0 S 初始化；1 X Y A 更新；2 L B R T 查詢；3 結束。
output_format: 每個指令 2 輸出矩形總和。
samples:
  - input: |
      0 4
      1 1 2 3
      2 0 0 2 2
      1 1 1 2
      1 1 2 -1
      2 1 1 2 3
      3
    output: |
      3
      4
    explanation: 第一次矩形含三部手機；後續同格增減後第二次總和為四。
core_knowledge: *id001
judgment: 二維 BIT 維護點增量與前綴矩形和。
hints:
  - 一維 BIT 的 add/prefix 可在兩個維度各套一層。
  - 題目座標從 0 起，BIT 內部需平移成 1 起。
  - 矩形和用四個二維前綴和容斥。
solution_outline: 二維 BIT 維護點增量與前綴矩形和。
proof_or_invariant: 每個 BIT 節點代表二維 lowbit 矩形；雙重迴圈更新所有包含點的節點，prefix 不重不漏分割前綴矩形。
common_errors:
  - 索引基準或閉區間端點處理錯誤
  - 更新資料結構後忘記同步原始狀態
  - 使用 32 位元儲存可能溢位的計數或總和
complexity:
  time: O(U log²S)
  space: O(S²)
cpp_skeleton: |
  // TODO：先依三階段提示自行完成核心；以下框架可嚴格編譯。
  #include <bits/stdc++.h>
  using namespace std;
  class Fenwick2D{public:explicit Fenwick2D(int n):n_(n),t(static_cast<size_t>((n+1)*(n+1))){}void add(int x,int y,int v){for(int i=x+1;i<=n_;i+=i&-i)for(int j=y+1;j<=n_;j+=j&-j)t[static_cast<size_t>(i*(n_+1)+j)]+=v;}long long prefix(int x,int y)const{long long s=0;for(int i=x+1;i>0;i-=i&-i)for(int j=y+1;j>0;j-=j&-j)s+=t[static_cast<size_t>(i*(n_+1)+j)];return s;}long long rect(int x1,int y1,int x2,int y2)const{return prefix(x2,y2)-prefix(x1-1,y2)-prefix(x2,y1-1)+prefix(x1-1,y1-1);}private:int n_;vector<long long>t;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int op,n;cin>>op>>n;Fenwick2D bit(n);while(cin>>op&&op!=3){if(op==1){int x,y,a;cin>>x>>y>>a;bit.add(x,y,a);}else{int l,b,r,t;cin>>l>>b>>r>>t;cout<<bit.rect(l,b,r,t)<<'\n';}}}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  class Fenwick2D{public:explicit Fenwick2D(int n):n_(n),t(static_cast<size_t>((n+1)*(n+1))){}void add(int x,int y,int v){for(int i=x+1;i<=n_;i+=i&-i)for(int j=y+1;j<=n_;j+=j&-j)t[static_cast<size_t>(i*(n_+1)+j)]+=v;}long long prefix(int x,int y)const{long long s=0;for(int i=x+1;i>0;i-=i&-i)for(int j=y+1;j>0;j-=j&-j)s+=t[static_cast<size_t>(i*(n_+1)+j)];return s;}long long rect(int x1,int y1,int x2,int y2)const{return prefix(x2,y2)-prefix(x1-1,y2)-prefix(x2,y1-1)+prefix(x1-1,y1-1);}private:int n_;vector<long long>t;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int op,n;cin>>op>>n;Fenwick2D bit(n);while(cin>>op&&op!=3){if(op==1){int x,y,a;cin>>x>>y>>a;bit.add(x,y,a);}else{int l,b,r,t;cin>>l>>b>>r>>t;cout<<bit.rect(l,b,r,t)<<'\n';}}}
external_url: http://bailian.openjudge.cn/practice/1195/
external_platform: OpenJ_Bailian
external_problem_id: '1195'
external_title: OpenJudge 百練 1195 Mobile phones
external_relation: original
source_book_pages:
  - 151
  - 170
source_pdf_pages:
  - 169
  - 188
review_status: verified
---

本卡片依外部題面與限制獨立整理。
