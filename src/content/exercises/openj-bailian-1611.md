---
id: openj-bailian-1611
volume: upper
source_file: upper-volume
title: OpenJudge 百練 1611 The Suspects：群組傳播
chapter: 4
section: '4.1'
kind: external-oj
difficulty: 3
topics: &id001
  - disjoint-set-union
  - hyperedge-connectivity
prerequisites:
  - disjoint-set-union
statement: 學生 0 已被認定為嫌疑者；任何群組只要有一名嫌疑者，所有成員都算嫌疑者。學生可參加多組，求最後嫌疑者總數。
constraints:
  - 0 < n <= 30000
  - 0 <= m <= 500
  - 學生編號 0 到 n-1；0 0 結束
input_format: 每組先給 n、m；接著 m 行先給成員數 k，再列出 k 個學生編號。
output_format: 每組輸出與學生 0 經群組關係相連的人數。
samples:
  - input: |
      100 4
      2 1 2
      5 10 13 11 12 14
      2 0 1
      2 99 2
      200 2
      1 5
      5 1 2 3 4 5
      1 0
      0 0
    output: |
      4
      1
      1
    explanation: 第一組中 0 經群組連到 1、2、99；後兩組沒有其他人連到 0。
core_knowledge: *id001
judgment: 同一群組所有成員互相連通；空群組不造成合併。
hints:
  - 每個學生群組可看成一條超邊。
  - 把群組第一人依次與其餘成員合併即可。
  - 最後查詢 0 所在集合大小。
solution_outline: 並查集按群組合併所有成員，輸出 component_size(0)。
proof_or_invariant: 同群組成員被合併，重疊群組透過共同成員傳遞；反之沒有群組鏈就不會被合併，故 0 的集合恰為全部嫌疑者。
common_errors:
  - 學生編號從 0 開始
  - k=0 時仍讀取第一位成員
  - 只合併相鄰群組而非群內成員
complexity:
  time: O((n+總成員數) alpha(n))
  space: O(n)
cpp_skeleton: |
  // TODO：先自行重建核心不變量，再與下列可編譯框架比較。
  #include <bits/stdc++.h>
  using namespace std;
  class DisjointSet { public: explicit DisjointSet(int n): parent_(static_cast<size_t>(n)), size_(static_cast<size_t>(n),1){iota(parent_.begin(),parent_.end(),0);} int find_root(int x){if(parent_[static_cast<size_t>(x)]!=x) parent_[static_cast<size_t>(x)]=find_root(parent_[static_cast<size_t>(x)]); return parent_[static_cast<size_t>(x)];} bool unite(int a,int b){a=find_root(a); b=find_root(b); if(a==b)return false; if(size_[static_cast<size_t>(a)]<size_[static_cast<size_t>(b)])swap(a,b); parent_[static_cast<size_t>(b)]=a; size_[static_cast<size_t>(a)]+=size_[static_cast<size_t>(b)]; return true;} int component_size(int x){return size_[static_cast<size_t>(find_root(x))];} private: vector<int> parent_,size_;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;while(cin>>n>>m&&(n!=0||m!=0)){DisjointSet dsu(n);for(int g=0;g<m;++g){int k;cin>>k;if(k==0)continue;int first;cin>>first;for(int j=1;j<k;++j){int x;cin>>x;dsu.unite(first,x);}}cout<<dsu.component_size(0)<<'\n';}}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  class DisjointSet { public: explicit DisjointSet(int n): parent_(static_cast<size_t>(n)), size_(static_cast<size_t>(n),1){iota(parent_.begin(),parent_.end(),0);} int find_root(int x){if(parent_[static_cast<size_t>(x)]!=x) parent_[static_cast<size_t>(x)]=find_root(parent_[static_cast<size_t>(x)]); return parent_[static_cast<size_t>(x)];} bool unite(int a,int b){a=find_root(a); b=find_root(b); if(a==b)return false; if(size_[static_cast<size_t>(a)]<size_[static_cast<size_t>(b)])swap(a,b); parent_[static_cast<size_t>(b)]=a; size_[static_cast<size_t>(a)]+=size_[static_cast<size_t>(b)]; return true;} int component_size(int x){return size_[static_cast<size_t>(find_root(x))];} private: vector<int> parent_,size_;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;while(cin>>n>>m&&(n!=0||m!=0)){DisjointSet dsu(n);for(int g=0;g<m;++g){int k;cin>>k;if(k==0)continue;int first;cin>>first;for(int j=1;j<k;++j){int x;cin>>x;dsu.unite(first,x);}}cout<<dsu.component_size(0)<<'\n';}}
external_url: http://bailian.openjudge.cn/practice/1611/
external_platform: OpenJ_Bailian
external_problem_id: '1611'
external_title: The Suspects
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
