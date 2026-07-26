---
id: openj-bailian-2585
volume: lower
source_file: lower-volume
original_label: OpenJ_Bailian 2585
title: Window Pains：驗證視窗疊放關係
chapter: 10
section: '10.2'
kind: external-oj
difficulty: 3
topics: [topological-sort, cycle-detection, graph-modeling]
prerequisites: [directed-graph]
statement: >-
  4×4 螢幕上有九個固定位置的 2×2 視窗：編號 1 到 9 的左上角依序位於 3×3 格點。
  每次把一個視窗移到最前面，它會蓋住重疊視窗。給定最後每格可見的視窗編號，判斷是否
  存在某個移到前景的次序能產生此畫面。
constraints: [資料組數不超過 100, 每組畫面恰為 4×4, 可見編號只會出現在該視窗實際覆蓋的位置, 時間限制 1000 ms]
input_format: 每組以 START 開始，接四行各四個整數，再以 END 結束；ENDOFINPUT 結束全部輸入。
output_format: 可形成輸出 THESE WINDOWS ARE CLEAN，否則輸出 THESE WINDOWS ARE BROKEN。
samples:
  - input: "START\n1 2 3 3\n4 5 6 6\n7 8 9 9\n7 8 9 9\nEND\nSTART\n1 1 3 3\n4 1 3 3\n7 7 9 9\n7 7 9 9\nEND\nENDOFINPUT\n"
    output: "THESE WINDOWS ARE CLEAN\nTHESE WINDOWS ARE BROKEN"
    explanation: 第一幅畫可由某個無矛盾的前後順序形成；第二幅推導出的遮蓋先後關係含環。
core_knowledge: [由遮擋推導偏序, 九點 DAG 判環, Kahn 拓撲排序]
judgment: 某格顯示 x，代表所有同樣覆蓋該格的其他視窗都在 x 下方。
hints:
  - 視窗 k 的左上角是 ((k-1)/3,(k-1)%3)，因此可列出覆蓋某格的所有視窗。
  - 若格子顯示 x，對每個同樣覆蓋此格的 y 建 y→x。
  - 畫面可行當且僅當九個視窗的先後圖無環。
solution_outline: 掃描 16 格，枚舉九個視窗是否覆蓋該格，建立「被蓋→可見」邊並去重；Kahn 取出九點即 CLEAN。
proof_or_invariant: >-
  任一實際疊放中，某格可見 x 證明 x 比所有同格視窗更晚移到前景，因此每條建邊都是必要
  關係。若圖無環，任一拓撲序依序把視窗移到前景，會滿足所有可見格的必要比較，最後畫面
  即輸入；若有環則不存在任何線性疊放順序。故條件充要。
common_errors: [把可見視窗指向被遮視窗, 視窗左上角的列行計算錯一格, 重複邊重複增加入度, 只檢查畫面中出現的視窗]
complexity: { time: O(16*9 + 9^2), space: O(9^2) }
cpp_skeleton: |
  #include <iostream>
  #include <string>
  #include <vector>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);string marker;while(cin>>marker&&marker!="ENDOFINPUT"){vector<vector<int>> screen(4,vector<int>(4));for(auto& row:screen)for(int& value:row)cin>>value;cin>>marker;/* TODO：由每格遮擋建立九點圖並判環。*/}}
cpp_solution: |
  #include <iostream>
  #include <queue>
  #include <string>
  #include <vector>
  using namespace std;
  int main(){
      ios::sync_with_stdio(false);cin.tie(nullptr);string marker;
      while(cin>>marker&&marker!="ENDOFINPUT"){
          vector<vector<int>> screen(4,vector<int>(4));for(auto& row:screen)for(int& value:row)cin>>value;cin>>marker;
          vector<vector<bool>> edge(10,vector<bool>(10,false));vector<int> indegree(10,0);
          for(int row=0;row<4;++row)for(int column=0;column<4;++column){int visible=screen[static_cast<size_t>(row)][static_cast<size_t>(column)];for(int window=1;window<=9;++window){int top=(window-1)/3,left=(window-1)%3;if(row>=top&&row<=top+1&&column>=left&&column<=left+1&&window!=visible&&!edge[static_cast<size_t>(window)][static_cast<size_t>(visible)]){edge[static_cast<size_t>(window)][static_cast<size_t>(visible)]=true;++indegree[static_cast<size_t>(visible)];}}}
          queue<int> ready;for(int window=1;window<=9;++window)if(indegree[static_cast<size_t>(window)]==0)ready.push(window);int processed=0;
          while(!ready.empty()){int u=ready.front();ready.pop();++processed;for(int v=1;v<=9;++v)if(edge[static_cast<size_t>(u)][static_cast<size_t>(v)]&&--indegree[static_cast<size_t>(v)]==0)ready.push(v);}
          cout<<(processed==9?"THESE WINDOWS ARE CLEAN\n":"THESE WINDOWS ARE BROKEN\n");
      }
  }
external_url: http://bailian.openjudge.cn/practice/2585/
external_platform: OpenJ_Bailian
external_problem_id: '2585'
external_title: Window Pains
external_relation: original
source_book_pages: [610]
source_pdf_pages: [240]
review_status: verified
---

畫面本身不直接給疊放次序，但每個可見格都提供一批「誰必須在誰上面」的偏序限制。
