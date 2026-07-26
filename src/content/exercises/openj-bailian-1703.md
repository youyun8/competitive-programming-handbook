---
id: openj-bailian-1703
volume: upper
source_file: upper-volume
title: OpenJudge 百練 1703 發現它，抓住它：二元關係並查集
chapter: 4
section: '4.1'
kind: external-oj
difficulty: 3
topics: &id001
  - weighted-disjoint-set-union
  - parity
prerequisites:
  - disjoint-set-union
statement: 每起案件由兩個團伙之一所為。D a b 提供兩案屬於不同團伙；A a b 詢問依目前資訊能否確定同團或異團。
constraints:
  - 1 <= T <= 20
  - N,M <= 100000
input_format: 先給 T；每組給 N、M，接著 M 行為 D a b 或 A a b。
output_format: 每次 A 分別輸出 `In the same gang.`、`In different gangs.` 或 `Not sure yet.`。
samples:
  - input: |
      1
      5 5
      A 1 2
      D 1 2
      A 1 2
      D 2 4
      A 1 4
    output: |
      Not sure yet.
      In different gangs.
      In the same gang.
    explanation: 第一問尚無關係；得知 1、2 不同後可回答第二問，且 1 與 4 都和 2 不同，所以同團。
core_knowledge: *id001
judgment: 不同集合代表資訊不足，不能自行指定團伙後回答。
hints:
  - 只需知道相對團伙，不需知道 A、B 的絕對名稱。
  - 用 0/1 權值表示節點與父節點是否同團。
  - D 合併時令兩端異團；A 同根才能由權值 xor 判定。
solution_outline: 維護帶 xor 權值的並查集；D 加入差為 1 的關係，A 比較根與相對權。
proof_or_invariant: 權值 xor 沿父鏈給出節點到根的團伙差；同根兩點之 xor 唯一決定相對關係，不同根則沒有可推導關係。
common_errors:
  - 把不同團伙關係當普通合併
  - 不同根時猜測答案
  - 路徑壓縮未累加 parity
complexity:
  time: O((N+M) alpha(N))
  space: O(N)
cpp_skeleton: |
  // TODO：先自行重建核心不變量，再與下列可編譯框架比較。
  #include <bits/stdc++.h>
  using namespace std;
  class ParitySet {public:explicit ParitySet(int n):parent_(static_cast<size_t>(n+1)),parity_(static_cast<size_t>(n+1),0){iota(parent_.begin(),parent_.end(),0);}int find_root(int x){int p=parent_[static_cast<size_t>(x)];if(p!=x){parent_[static_cast<size_t>(x)]=find_root(p);parity_[static_cast<size_t>(x)]^=parity_[static_cast<size_t>(p)];}return parent_[static_cast<size_t>(x)];}bool relate(int a,int b,int different){int ra=find_root(a),rb=find_root(b);if(ra==rb)return (parity_[static_cast<size_t>(a)]^parity_[static_cast<size_t>(b)])==different;parent_[static_cast<size_t>(ra)]=rb;parity_[static_cast<size_t>(ra)]=parity_[static_cast<size_t>(a)]^parity_[static_cast<size_t>(b)]^different;return true;}int relation(int a,int b){if(find_root(a)!=find_root(b))return -1;return parity_[static_cast<size_t>(a)]^parity_[static_cast<size_t>(b)];}private:vector<int> parent_,parity_;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int tests;cin>>tests;while(tests--){int n,m;cin>>n>>m;ParitySet dsu(n);while(m--){char op;int a,b;cin>>op>>a>>b;if(op=='D')dsu.relate(a,b,1);else{int r=dsu.relation(a,b);cout<<(r<0?"Not sure yet.":r==0?"In the same gang.":"In different gangs.")<<'\n';}}}}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  class ParitySet {public:explicit ParitySet(int n):parent_(static_cast<size_t>(n+1)),parity_(static_cast<size_t>(n+1),0){iota(parent_.begin(),parent_.end(),0);}int find_root(int x){int p=parent_[static_cast<size_t>(x)];if(p!=x){parent_[static_cast<size_t>(x)]=find_root(p);parity_[static_cast<size_t>(x)]^=parity_[static_cast<size_t>(p)];}return parent_[static_cast<size_t>(x)];}bool relate(int a,int b,int different){int ra=find_root(a),rb=find_root(b);if(ra==rb)return (parity_[static_cast<size_t>(a)]^parity_[static_cast<size_t>(b)])==different;parent_[static_cast<size_t>(ra)]=rb;parity_[static_cast<size_t>(ra)]=parity_[static_cast<size_t>(a)]^parity_[static_cast<size_t>(b)]^different;return true;}int relation(int a,int b){if(find_root(a)!=find_root(b))return -1;return parity_[static_cast<size_t>(a)]^parity_[static_cast<size_t>(b)];}private:vector<int> parent_,parity_;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int tests;cin>>tests;while(tests--){int n,m;cin>>n>>m;ParitySet dsu(n);while(m--){char op;int a,b;cin>>op>>a>>b;if(op=='D')dsu.relate(a,b,1);else{int r=dsu.relation(a,b);cout<<(r<0?"Not sure yet.":r==0?"In the same gang.":"In different gangs.")<<'\n';}}}}
external_url: http://bailian.openjudge.cn/practice/1703/
external_platform: OpenJ_Bailian
external_problem_id: '1703'
external_title: 發現它，抓住它
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
