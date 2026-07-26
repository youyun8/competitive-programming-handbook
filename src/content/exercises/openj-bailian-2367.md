---
id: openj-bailian-2367
volume: lower
source_file: lower-volume
original_label: OpenJ_Bailian 2367
title: Genealogical Tree：長輩優先發言
chapter: 10
section: '10.2'
kind: external-oj
difficulty: 2
topics: [topological-sort, directed-acyclic-graph]
prerequisites: [indegree, queue]
statement: >-
  火星議會有 N 名成員，每人列出自己的所有子女。請安排發言次序，使每位成員都在自己的
  所有後代之前發言。若有多個合法次序，輸出任意一個。
constraints: [1 <= N <= 100, 至少存在一個合法次序, 總時間限制 1000 ms, 記憶體限制 65536 kB]
input_format: 第一行 N；接著第 i 行列出 i 的所有子女編號，並以 0 結束，空列表只含 0。
output_format: 輸出一行 N 個以空格分隔的成員編號，形成任一合法次序。
samples:
  - input: "5\n0\n4 5 1 0\n1 0\n5 3 0\n3 0\n"
    output: '2 4 5 3 1'
    explanation: 每條親代到子女的邊都由左指向右，例如 2 在 4、5、1 前，4 在 5、3 前。
core_knowledge: [親子限制建成有向邊, Kahn 拓撲排序, 零入度代表尚無未發言祖先]
judgment: 題目接受任意合法拓撲序，不要求字典序。
hints:
  - 對每個「i 的子女是 c」建立 i→c。
  - 先將所有入度為零的成員放入佇列。
  - 每輸出一人就刪除其指向子女的邊，新零入度者入列。
solution_outline: 讀取鄰接表並統計入度，以 Kahn 演算法依序取出零入度點並輸出。
proof_or_invariant: >-
  佇列中的點沒有任何尚未輸出的親代，所以現在發言不違反限制。刪除已發言者的出邊後，
  新入度零點的所有已知親代都已發言。DAG 保證過程取出全部點，故每位祖先先於其所有後代。
common_errors: [把子女到親代反向建邊, 將行末 0 當成頂點, 少輸出孤立成員, 額外要求唯一順序]
complexity: { time: O(N + E), space: O(N + E) }
cpp_skeleton: |
  #include <iostream>
  #include <queue>
  #include <vector>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n=0;cin>>n;vector<vector<int>> graph(static_cast<size_t>(n+1));vector<int> indegree(static_cast<size_t>(n+1),0);for(int u=1;u<=n;++u){int v=0;while(cin>>v&&v!=0){graph[static_cast<size_t>(u)].push_back(v);++indegree[static_cast<size_t>(v)];}}/* TODO：Kahn 拓撲排序並輸出。*/}
cpp_solution: |
  #include <iostream>
  #include <queue>
  #include <vector>
  using namespace std;
  int main(){
      ios::sync_with_stdio(false);cin.tie(nullptr);int n=0;cin>>n;
      vector<vector<int>> graph(static_cast<size_t>(n+1));vector<int> indegree(static_cast<size_t>(n+1),0);
      for(int u=1;u<=n;++u){int v=0;while(cin>>v&&v!=0){graph[static_cast<size_t>(u)].push_back(v);++indegree[static_cast<size_t>(v)];}}
      queue<int> ready;for(int v=1;v<=n;++v)if(indegree[static_cast<size_t>(v)]==0)ready.push(v);
      bool first=true;while(!ready.empty()){int u=ready.front();ready.pop();if(!first)cout<<' ';first=false;cout<<u;for(int v:graph[static_cast<size_t>(u)])if(--indegree[static_cast<size_t>(v)]==0)ready.push(v);}cout<<'\n';
  }
external_url: http://bailian.openjudge.cn/practice/2367/
external_platform: OpenJ_Bailian
external_problem_id: '2367'
external_title: Genealogical tree
external_relation: original
source_book_pages: [610]
source_pdf_pages: [240]
review_status: verified
---

親代到子女的邊已經完整表達「所有祖先都要更早」；不必另外求傳遞閉包。
