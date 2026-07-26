---
id: luogu-p1127
volume: lower
source_file: lower-volume
original_label: 洛谷 P1127
title: 詞鏈：輸出字典序最小的單字接龍
chapter: 10
section: '10.3'
kind: external-oj
difficulty: 4
topics: [euler-trail, directed-multigraph, lexicographic-order, hierholzer]
prerequisites: [indegree, outdegree, depth-first-search]
statement: >-
  給定 n 個小寫英文單字。若前一個單字的尾字母等於下一個單字的首字母，兩字便能以句點
  相接。請將每個輸入單字恰使用一次，輸出字典序最小的完整詞鏈；同一單字若輸入多次，也
  必須使用相同次數。若無法完成則回報無解。
constraints: [1 <= n <= 1000, 每個單字長度為 1 到 20, 單字只含小寫英文字母, 相同單字可以重複]
input_format: 第一行為單字數 n；接著 n 行每行一個單字。
output_format: 輸出以英文句點 . 分隔的字典序最小完整詞鏈；不存在時輸出 ***。
samples:
  - input: "6\naloha\narachnid\ndog\ngopher\nrat\ntiger\n"
    output: aloha.arachnid.dog.gopher.rat.tiger
    explanation: 依序的尾、首字母分別為 a、d、g、r、t，均能相接；在所有使用六個單字一次的合法序列中，此串字典序最小。
core_knowledge: [單字作首字母到尾字母的有向邊, 有向歐拉跡度數條件, 字典序 Hierholzer]
judgment: 比較的是包含完整單字與句點的輸出字串；平行邊及完全相同的單字都必須各使用一次。
hints:
  - 將 26 個字母視為頂點，每個單字視為首字母指向尾字母、並攜帶完整單字標籤的邊。
  - 起點須滿足 out-in=1；若所有點出入度相等，從具有出邊的最小字母開始，最後還要確認共取出 n 條邊。
  - 各頂點出邊按完整單字字典序排列；Hierholzer 優先取最小邊並在回溯時收集，最後反轉邊序。
solution_outline: >-
  建立 26 個有向鄰接串列並統計入出度。檢查度差只能是全零，或恰一個 +1 與一個 -1；
  選定起點後，把每個串列按單字反向排序，使末端可彈出目前最小邊。執行 Hierholzer，
  回溯時記錄使用的單字，反轉後若恰有 n 條邊便以句點連接，否則輸出 ***。
proof_or_invariant: >-
  詞鏈相鄰條件正是有向邊首尾相接，因此完整詞鏈等價於使用所有邊一次的有向歐拉跡。
  有向歐拉跡的度差條件決定合法起點與終點；Hierholzer 若收集到 n 條邊，也同時證明所有
  含邊部分皆由起點可涵蓋。演算法每次從目前頂點取字典序最小的未用邊；若它暫時形成封閉
  子巡迴，回溯拼接只會把必要邊插入較後位置。對第一個不同邊作交換，可知任何其他歐拉跡
  都不會在該位置使用更小單字，故反轉後所得邊序為字典序最小。
common_errors:
  [
    只按尾字母而非完整單字排序,
    忘記反轉回溯答案,
    只檢查度數而未確認所有邊用完,
    將重複單字去重,
    歐拉迴路時固定從 a 而非最小有出邊字母開始
  ]
complexity: { time: O(n*log(n) + 總字元數), space: O(n + 總字元數) }
cpp_skeleton: |
  #include <algorithm>
  #include <iostream>
  #include <string>
  #include <vector>
  using namespace std;
  struct Edge{int to;string word;};
  static void build_path(int u,vector<vector<Edge>>& graph,vector<string>& reversed){(void)u;(void)graph;(void)reversed;/* TODO：Hierholzer，回溯時記錄單字。*/}
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n=0;cin>>n;vector<vector<Edge>> graph(26);vector<int> indegree(26,0),outdegree(26,0);for(int i=0;i<n;++i){string word;cin>>word;int from=word.front()-'a',to=word.back()-'a';graph[static_cast<size_t>(from)].push_back({to,word});++outdegree[static_cast<size_t>(from)];++indegree[static_cast<size_t>(to)];}/* TODO：驗證度差、排序、建路並輸出。*/}
cpp_solution: |
  #include <algorithm>
  #include <iostream>
  #include <string>
  #include <vector>
  using namespace std;
  struct Edge{int to;string word;};
  static void build_path(int u,vector<vector<Edge>>& graph,vector<string>& reversed){while(!graph[static_cast<size_t>(u)].empty()){Edge edge=graph[static_cast<size_t>(u)].back();graph[static_cast<size_t>(u)].pop_back();build_path(edge.to,graph,reversed);reversed.push_back(edge.word);}}
  int main(){
      ios::sync_with_stdio(false);cin.tie(nullptr);int n=0;cin>>n;vector<vector<Edge>> graph(26);vector<int> indegree(26,0),outdegree(26,0);
      for(int i=0;i<n;++i){string word;cin>>word;int from=word.front()-'a',to=word.back()-'a';graph[static_cast<size_t>(from)].push_back({to,word});++outdegree[static_cast<size_t>(from)];++indegree[static_cast<size_t>(to)];}
      bool possible=true;int start=-1,start_count=0,finish_count=0;for(int v=0;v<26;++v){int difference=outdegree[static_cast<size_t>(v)]-indegree[static_cast<size_t>(v)];if(difference==1){start=v;++start_count;}else if(difference==-1)++finish_count;else if(difference!=0)possible=false;}
      if(!((start_count==0&&finish_count==0)||(start_count==1&&finish_count==1))){possible=false;}
      if(start==-1){for(int v=0;v<26;++v)if(outdegree[static_cast<size_t>(v)]>0){start=v;break;}}
      for(auto& edges:graph)sort(edges.begin(),edges.end(),[](const Edge& left,const Edge& right){return left.word>right.word;});
      vector<string> reversed;if(start!=-1){build_path(start,graph,reversed);}
      if(static_cast<int>(reversed.size())!=n){possible=false;}
      if(!possible){cout<<"***\n";return 0;}
      reverse(reversed.begin(),reversed.end());for(int i=0;i<n;++i){if(i>0)cout<<'.';cout<<reversed[static_cast<size_t>(i)];}cout<<'\n';
  }
external_url: https://www.luogu.com.cn/problem/P1127
external_platform: Luogu
external_problem_id: P1127
external_title: 詞鏈
external_relation: original
source_book_pages: [615]
source_pdf_pages: [245]
review_status: verified
---

排序的單位必須是整個單字，而不是僅看下一個字母；這正是本題比一般歐拉路多出的一層要求。
