---
id: openj-bailian-2337
volume: lower
source_file: lower-volume
original_label: OpenJ_Bailian 2337
title: Catenyms：字典序最小的複合詞鏈
chapter: 10
section: '10.3'
kind: external-oj
difficulty: 4
topics: [euler-trail, directed-graph, lexicographic-order, hierholzer]
prerequisites: [indegree, outdegree, depth-first-search]
statement: >-
  若前一個小寫單字的尾字母等於下一個單字的首字母，便可用句點連成詞鏈。對每組互不相同
  的字典單字，找出恰使用每字一次的複合詞鏈，並在所有解中輸出字典序最小者；無解則回報。
constraints: [1 <= 測試組數, 3 <= n <= 1000, 每個單字長度為 1 到 20, 單字只含小寫英文字母, 同組單字互不相同]
input_format: 第一行為測試組數 t；每組先給字典大小 n，接著 n 行每行一個單字。
output_format: 每組輸出一行以句點分隔的字典序最小完整詞鏈；不存在時輸出 ***。
samples:
  - input: "2\n6\naloha\narachnid\ndog\ngopher\nrat\ntiger\n3\noak\nmaple\nelm\n"
    output: "aloha.arachnid.dog.gopher.rat.tiger\n***"
    explanation: 第一組六字可依 a→a→d→g→r→t 的端點關係串起且此序列最小；第二組的首尾字母度差無法形成使用全部三邊的歐拉跡。
core_knowledge: [單字是帶標籤的有向邊, 有向歐拉跡, 字典序最小 Hierholzer]
judgment: 每組必須使用所有字典單字且各一次；字典序比較完整輸出，句點位置由單字序列唯一決定。
hints:
  - 以字母為頂點、單字為由首字母到尾字母的邊，先檢查有向歐拉跡的入出度型態。
  - 歐拉迴路從最小的有出邊字母開始；開放歐拉跡則只能從 out-in=1 的字母開始。
  - 將各頂點的出邊按完整單字由大到小存放，遞迴時從尾端取最小邊，回溯收集後再反轉。
solution_outline: >-
  統計 26 個字母的入出度，只接受全平衡或一個 +1、一個 -1。各頂點出邊按完整單字降冪
  排序，用 Hierholzer 每次彈出最小單字，並在遞迴回溯時把單字加入答案。若最後未得到 n
  條邊，代表含邊部分不連通，輸出 ***；否則反轉後以句點連接。
proof_or_invariant: >-
  每字使用一次且相鄰首尾相同，與帶單字標籤有向圖的歐拉跡完全等價。度差型態是端點必要
  條件，而 Hierholzer 得到 n 條邊恰證明所有邊在同一可走的歐拉結構中，故條件充分。
  取邊時總選當前可用的最小完整單字；Hierholzer 回溯只把提早封閉的巡迴拼入不早於其
  分歧的位置。若另一解在第一個相異位置更小，該邊當時也可選，會與演算法已選最小邊矛盾，
  因而反轉後答案為全域字典序最小。
common_errors:
  [
    按輸入順序或尾字母排序而非完整單字,
    沒有確認答案邊數等於 n,
    回溯結果未反轉,
    歐拉迴路選錯起點,
    無解時輸出錯誤數量的星號
  ]
complexity: { time: O(n*log(n) + 總字元數), space: O(n + 總字元數) }
cpp_skeleton: |
  #include <algorithm>
  #include <iostream>
  #include <string>
  #include <vector>
  using namespace std;
  struct Edge{int to;string word;};
  void make_chain(int u,vector<vector<Edge>>& graph,vector<string>& reversed){(void)u;(void)graph;(void)reversed;/* TODO：Hierholzer 並於回溯記錄邊標籤。*/}
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int tests=0;cin>>tests;while(tests--){int n=0;cin>>n;vector<vector<Edge>> graph(26);vector<int> indegree(26,0),outdegree(26,0);for(int i=0;i<n;++i){string word;cin>>word;int from=word.front()-'a',to=word.back()-'a';graph[static_cast<size_t>(from)].push_back({to,word});++outdegree[static_cast<size_t>(from)];++indegree[static_cast<size_t>(to)];}/* TODO：驗證、建鏈並輸出。*/}}
cpp_solution: |
  #include <algorithm>
  #include <iostream>
  #include <string>
  #include <vector>
  using namespace std;
  struct Edge{int to;string word;};
  static void make_chain(int u,vector<vector<Edge>>& graph,vector<string>& reversed){while(!graph[static_cast<size_t>(u)].empty()){Edge edge=graph[static_cast<size_t>(u)].back();graph[static_cast<size_t>(u)].pop_back();make_chain(edge.to,graph,reversed);reversed.push_back(edge.word);}}
  int main(){
      ios::sync_with_stdio(false);cin.tie(nullptr);int tests=0;cin>>tests;
      while(tests--){int n=0;cin>>n;vector<vector<Edge>> graph(26);vector<int> indegree(26,0),outdegree(26,0);
          for(int i=0;i<n;++i){string word;cin>>word;int from=word.front()-'a',to=word.back()-'a';graph[static_cast<size_t>(from)].push_back({to,word});++outdegree[static_cast<size_t>(from)];++indegree[static_cast<size_t>(to)];}
          bool possible=true;int start=-1,start_count=0,finish_count=0;for(int v=0;v<26;++v){int difference=outdegree[static_cast<size_t>(v)]-indegree[static_cast<size_t>(v)];if(difference==1){start=v;++start_count;}else if(difference==-1)++finish_count;else if(difference!=0)possible=false;}
          if(!((start_count==0&&finish_count==0)||(start_count==1&&finish_count==1))){possible=false;}
          if(start==-1){for(int v=0;v<26;++v)if(outdegree[static_cast<size_t>(v)]>0){start=v;break;}}
          for(auto& edges:graph)sort(edges.begin(),edges.end(),[](const Edge& left,const Edge& right){return left.word>right.word;});
          vector<string> reversed;if(start!=-1){make_chain(start,graph,reversed);}
          if(static_cast<int>(reversed.size())!=n){possible=false;}
          if(!possible){cout<<"***\n";continue;}
          reverse(reversed.begin(),reversed.end());for(int i=0;i<n;++i){if(i>0)cout<<'.';cout<<reversed[static_cast<size_t>(i)];}cout<<'\n';
      }
  }
external_url: http://bailian.openjudge.cn/practice/2337/
external_platform: OpenJ_Bailian
external_problem_id: '2337'
external_title: Catenyms
external_relation: original
source_book_pages: [615]
source_pdf_pages: [245]
review_status: verified
---

字典序需求落在「完整單字邊」上；只讓下一個字母最小，無法保證整條輸出字串最小。
