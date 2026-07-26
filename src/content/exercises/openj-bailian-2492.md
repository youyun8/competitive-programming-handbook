---
id: openj-bailian-2492
volume: upper
source_file: upper-volume
title: OpenJudge 百練 2492 A Bug's Life：二分圖矛盾
chapter: 4
section: '4.1'
kind: external-oj
difficulty: 3
topics: &id001
  - bipartite-graph
  - weighted-disjoint-set-union
  - parity
prerequisites:
  - disjoint-set-union
statement: 每次互動都應發生在兩種不同性別的昆蟲之間。給定互動邊，判斷是否存在二分性別指派；若不存在則有可疑互動。
constraints:
  - 昆蟲數 1 到 2000
  - 互動數不超過 1000000
input_format: 第一行場景數；每場景給昆蟲數、互動數，再列每對不同編號的互動。
output_format: '按官方格式輸出 Scenario #i 與是否發現 suspicious bugs，場景後空一行。'
samples:
  - input: |
      2
      3 3
      1 2
      2 3
      1 3
      4 2
      1 2
      3 4
    output: |
      Scenario #1:
      Suspicious bugs found!

      Scenario #2:
      No suspicious bugs found!
    explanation: 三角形不能二分，所以第一場可疑；第二場兩條獨立邊可二分。
core_knowledge: *id001
judgment: 即使已發現矛盾仍需讀完當前場景輸入。
hints:
  - 每條互動要求兩端顏色不同。
  - 以 xor 權值並查集維護相對顏色。
  - 同根時若兩端 parity 相同即矛盾。
solution_outline: 對每條邊加入差為 1 的關係；任何不相容關係使場景標為可疑。
proof_or_invariant: 圖可二分當且僅當所有邊的端點可滿足 xor=1；帶權並查集精確維護這些等式，衝突等價於奇環。
common_errors:
  - 格式漏掉場景空行
  - 發現矛盾後未讀剩餘邊
  - 普通 DSU 無法保存異色關係
complexity:
  time: O((n+m) alpha(n))
  space: O(n)
cpp_skeleton: |
  // TODO：先自行重建核心不變量，再與下列可編譯框架比較。
  #include <bits/stdc++.h>
  using namespace std;
  class ParitySet {public:explicit ParitySet(int n):parent_(static_cast<size_t>(n+1)),parity_(static_cast<size_t>(n+1),0){iota(parent_.begin(),parent_.end(),0);}int find_root(int x){int p=parent_[static_cast<size_t>(x)];if(p!=x){parent_[static_cast<size_t>(x)]=find_root(p);parity_[static_cast<size_t>(x)]^=parity_[static_cast<size_t>(p)];}return parent_[static_cast<size_t>(x)];}bool relate(int a,int b,int different){int ra=find_root(a),rb=find_root(b);if(ra==rb)return (parity_[static_cast<size_t>(a)]^parity_[static_cast<size_t>(b)])==different;parent_[static_cast<size_t>(ra)]=rb;parity_[static_cast<size_t>(ra)]=parity_[static_cast<size_t>(a)]^parity_[static_cast<size_t>(b)]^different;return true;}int relation(int a,int b){if(find_root(a)!=find_root(b))return -1;return parity_[static_cast<size_t>(a)]^parity_[static_cast<size_t>(b)];}private:vector<int> parent_,parity_;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int tests;cin>>tests;for(int tc=1;tc<=tests;++tc){int n,m;cin>>n>>m;ParitySet dsu(n);bool suspicious=false;for(int i=0;i<m;++i){int a,b;cin>>a>>b;if(!dsu.relate(a,b,1))suspicious=true;}cout<<"Scenario #"<<tc<<":\n"<<(suspicious?"Suspicious bugs found!":"No suspicious bugs found!")<<"\n\n";}}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  class ParitySet {public:explicit ParitySet(int n):parent_(static_cast<size_t>(n+1)),parity_(static_cast<size_t>(n+1),0){iota(parent_.begin(),parent_.end(),0);}int find_root(int x){int p=parent_[static_cast<size_t>(x)];if(p!=x){parent_[static_cast<size_t>(x)]=find_root(p);parity_[static_cast<size_t>(x)]^=parity_[static_cast<size_t>(p)];}return parent_[static_cast<size_t>(x)];}bool relate(int a,int b,int different){int ra=find_root(a),rb=find_root(b);if(ra==rb)return (parity_[static_cast<size_t>(a)]^parity_[static_cast<size_t>(b)])==different;parent_[static_cast<size_t>(ra)]=rb;parity_[static_cast<size_t>(ra)]=parity_[static_cast<size_t>(a)]^parity_[static_cast<size_t>(b)]^different;return true;}int relation(int a,int b){if(find_root(a)!=find_root(b))return -1;return parity_[static_cast<size_t>(a)]^parity_[static_cast<size_t>(b)];}private:vector<int> parent_,parity_;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int tests;cin>>tests;for(int tc=1;tc<=tests;++tc){int n,m;cin>>n>>m;ParitySet dsu(n);bool suspicious=false;for(int i=0;i<m;++i){int a,b;cin>>a>>b;if(!dsu.relate(a,b,1))suspicious=true;}cout<<"Scenario #"<<tc<<":\n"<<(suspicious?"Suspicious bugs found!":"No suspicious bugs found!")<<"\n\n";}}
external_url: http://bailian.openjudge.cn/practice/2492/
external_platform: OpenJ_Bailian
external_problem_id: '2492'
external_title: A Bug's Life
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
