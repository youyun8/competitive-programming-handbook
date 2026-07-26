---
id: openj-bailian-1386
volume: lower
source_file: lower-volume
original_label: OpenJ_Bailian 1386
title: Play on Words：判斷能否排成完整詞鏈
chapter: 10
section: '10.3'
kind: external-oj
difficulty: 3
topics: [euler-trail, directed-graph, disjoint-set]
prerequisites: [indegree, outdegree, connectivity]
statement: >-
  每扇門上有若干寫著小寫英文單字的磁片。要把所有磁片排成一列，使每個單字的首字母等於
  前一個單字的尾字母。判斷是否存在使用清單中每片磁片恰好一次的排列；重複出現的單字也
  必須依其出現次數分別使用。
constraints: [1 <= 測試組數, 1 <= N <= 100000, 每個單字長度為 2 到 1000, 單字只含 a 到 z, 同一單字可重複]
input_format: 第一行為測試組數 T；每組先給磁片數 N，接著 N 行每行一個單字。
output_format: 可排列時輸出 Ordering is possible.；否則輸出 The door cannot be opened.。
samples:
  - input: "3\n2\nacm\nibm\n3\nacm\nmalform\nmouse\n2\nok\nok\n"
    output: "The door cannot be opened.\nOrdering is possible.\nThe door cannot be opened."
    explanation: 第一組兩字無法相接；第二組可排為 acm→malform→mouse；第三組每個 ok 都由 o 指向 k，度差不符合歐拉跡條件。
core_knowledge: [首尾字母建立有向邊, 有向歐拉跡度數條件, 含邊字母的弱連通]
judgment: 本題只判斷存在性，不必輸出排列；相同單字出現多次時，每次都算一條獨立的平行邊。
hints:
  - 將每個單字視為由首字母指向尾字母的邊，統計 26 個字母的入度與出度。
  - 忽略方向後，所有在任一單字端點出現的字母必須位於同一連通分量。
  - 度差必須全為零，或恰一點 out-in=1、恰一點 in-out=1，其餘皆為零。
solution_outline: >-
  對每組資料統計每個字母的入度、出度，並以 DSU 合併每個單字的首尾字母。掃描所有有度數
  的字母檢查同根，再計算 out-in：只接受全零，或恰一個 +1 與一個 -1。
proof_or_invariant: >-
  每個單字恰對應一條有向邊，合法排列就是使用所有邊一次的有向歐拉跡。單一路徑必使所有
  含邊頂點在忽略方向後連通；路徑的內部頂點每進一次便出一次，因此入出度相等，只有不同
  的起點可多一條出邊、終點可多一條入邊。反之，弱連通與上述兩種度差型態是有向歐拉跡的
  充要條件，所以逐項通過即保證存在所求排列。
common_errors:
  [只檢查度差而漏掉分離的詞群, 要求沒有出現的字母也連通, 把首尾方向顛倒, 將相同單字去重, 輸出字串的大小寫或句點不符原題]
complexity: { time: O(總輸入字元數 + N*alpha(26)), space: O(26) 不計單字讀取緩衝 }
cpp_skeleton: |
  #include <iostream>
  #include <string>
  #include <vector>
  using namespace std;
  struct Dsu{vector<int> parent;explicit Dsu(int n):parent(static_cast<size_t>(n)){for(int i=0;i<n;++i)parent[static_cast<size_t>(i)]=i;}int find(int x){return parent[static_cast<size_t>(x)]==x?x:parent[static_cast<size_t>(x)]=find(parent[static_cast<size_t>(x)]);}void unite(int a,int b){parent[static_cast<size_t>(find(a))]=find(b);}};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int tests=0;cin>>tests;while(tests--){int n=0;cin>>n;vector<int> indegree(26,0),outdegree(26,0);Dsu dsu(26);for(int i=0;i<n;++i){string word;cin>>word;int from=word.front()-'a',to=word.back()-'a';++outdegree[static_cast<size_t>(from)];++indegree[static_cast<size_t>(to)];dsu.unite(from,to);}/* TODO：檢查弱連通與精確度差型態。*/}}
cpp_solution: |
  #include <iostream>
  #include <string>
  #include <vector>
  using namespace std;
  struct Dsu{vector<int> parent;explicit Dsu(int n):parent(static_cast<size_t>(n)){for(int i=0;i<n;++i)parent[static_cast<size_t>(i)]=i;}int find(int x){return parent[static_cast<size_t>(x)]==x?x:parent[static_cast<size_t>(x)]=find(parent[static_cast<size_t>(x)]);}void unite(int a,int b){parent[static_cast<size_t>(find(a))]=find(b);}};
  int main(){
      ios::sync_with_stdio(false);cin.tie(nullptr);int tests=0;cin>>tests;
      while(tests--){int n=0;cin>>n;vector<int> indegree(26,0),outdegree(26,0);Dsu dsu(26);
          for(int i=0;i<n;++i){string word;cin>>word;int from=word.front()-'a',to=word.back()-'a';++outdegree[static_cast<size_t>(from)];++indegree[static_cast<size_t>(to)];dsu.unite(from,to);}
          bool possible=true;int root=-1,start_count=0,finish_count=0;
          for(int v=0;v<26;++v)if(indegree[static_cast<size_t>(v)]+outdegree[static_cast<size_t>(v)]>0){if(root==-1)root=dsu.find(v);else if(root!=dsu.find(v))possible=false;int difference=outdegree[static_cast<size_t>(v)]-indegree[static_cast<size_t>(v)];if(difference==1)++start_count;else if(difference==-1)++finish_count;else if(difference!=0)possible=false;}
          if(!((start_count==0&&finish_count==0)||(start_count==1&&finish_count==1))){possible=false;}
          cout<<(possible?"Ordering is possible.\n":"The door cannot be opened.\n");
      }
  }
external_url: http://bailian.openjudge.cn/practice/1386/
external_platform: OpenJ_Bailian
external_problem_id: '1386'
external_title: Play on Words
external_relation: original
source_book_pages: [615]
source_pdf_pages: [245]
review_status: verified
---

單字的內部字母不影響銜接；只保留首尾後，題目就是 26 個頂點上的有向歐拉跡存在性判定。
