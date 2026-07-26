---
id: openj-bailian-1128
volume: lower
source_file: lower-volume
original_label: OpenJ_Bailian 1128
title: Frame Stacking：列舉畫框疊放次序
chapter: 10
section: '10.2'
kind: external-oj
difficulty: 4
topics: [topological-sort, backtracking, bounding-box]
prerequisites: [directed-acyclic-graph, indegree]
statement: >-
  若干以不同大寫字母標記的矩形畫框依序疊在字元網格上；框線寬一格，邊長至少三格，
  且每一邊至少有一處可見。給定最後畫面，列出所有可能的「由底到頂」疊放次序，並按
  字典序輸出。
constraints:
  [1 <= h, w <= 30, 每個字母代表唯一畫框, 每框四邊都至少有一格可見, 每組至少存在一個合法次序, 多組資料直到 EOF]
input_format: 每組先各以一行給高度 h、寬度 w，再給 h 行長度 w 的畫面；組間沒有空行。
output_format: 逐行輸出所有可能的由底到頂字母序列；多組資料之間不留空行。
samples:
  - input: "9\n8\n.CCC....\nECBCBB..\nDCBCDB..\nDCCC.B..\nD.B.ABAA\nD.BBBB.A\nDDDDAD.A\nE...AAAA\nEEEEEE..\n"
    output: 'EDABC'
    explanation: 由每個框的外接矩形邊界可推出 E 在 D 下、D 在 A 等遮蓋關係，唯一拓撲序為 EDABC。
core_knowledge: [由可見字元求畫框邊界, 遮擋關係建圖, 枚舉所有拓撲序]
judgment: 輸出方向是底到頂；同一遮擋關係只能計一次入度。
hints:
  - 對每個字母記錄出現位置的最小與最大列、欄；題目保證這就是原框矩形。
  - 掃描該矩形四條邊，若某格顯示另一字母 X，代表此框在 X 下方。
  - 按字母序回溯選取目前入度為零的未用框，即可直接產生字典序答案。
solution_outline: >-
  掃描畫面求各框 bounding box。對框 A 的四邊每格，若可見字母為 B 且 B≠A，就建立 A→B。
  去重後統計入度，以回溯枚舉所有拓撲序；選取字母前將後繼入度減一，返回時完整恢復。
proof_or_invariant: >-
  A 原本的邊界格若顯示 B，只有 B 後放且覆蓋 A 才可能，所以 A→B 是必要關係；反之所有
  實際遮擋比較都會在下層框邊界被觀察而加入。滿足此偏序的任一線性序依序疊框，所有畫面
  指定的上層字母都會蓋住下層，故可行。回溯每層選所有零入度點，恰枚舉所有線性延伸。
common_errors: [只掃描外接矩形內部而非四條邊, 把可見框指向被遮框, 重複邊重複增加入度, 忘記回溯時恢復後繼入度]
complexity: { time: O(h*w + A*F*(F+E)), space: O(F^2)，F 為框數且 A 為答案數 }
cpp_skeleton: |
  #include <array>
  #include <iostream>
  #include <string>
  #include <vector>
  using namespace std;
  static void enumerate(const vector<int>& letters,const vector<vector<bool>>& edge,vector<int>& indegree,vector<bool>& used,string& order){(void)letters;(void)edge;(void)indegree;(void)used;(void)order;/* TODO：枚舉所有拓撲序。*/}
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int h=0,w=0;while(cin>>h>>w){vector<string> picture(static_cast<size_t>(h));for(string& row:picture)cin>>row;/* TODO：求各框邊界並建立遮擋圖。*/vector<int> letters,indegree;vector<vector<bool>> edge;vector<bool> used;string order;enumerate(letters,edge,indegree,used,order);}}
cpp_solution: |
  #include <algorithm>
  #include <array>
  #include <iostream>
  #include <string>
  #include <vector>
  using namespace std;
  static void enumerate(const vector<int>& letters,const vector<vector<bool>>& edge,vector<int>& indegree,vector<bool>& used,string& order){
      if(order.size()==letters.size()){cout<<order<<'\n';return;}
      for(int letter:letters)if(!used[static_cast<size_t>(letter)]&&indegree[static_cast<size_t>(letter)]==0){used[static_cast<size_t>(letter)]=true;order.push_back(static_cast<char>('A'+letter));for(int next:letters)if(edge[static_cast<size_t>(letter)][static_cast<size_t>(next)])--indegree[static_cast<size_t>(next)];enumerate(letters,edge,indegree,used,order);for(int next:letters)if(edge[static_cast<size_t>(letter)][static_cast<size_t>(next)])++indegree[static_cast<size_t>(next)];order.pop_back();used[static_cast<size_t>(letter)]=false;}
  }
  int main(){
      ios::sync_with_stdio(false);cin.tie(nullptr);int h=0,w=0;
      while(cin>>h>>w){
          vector<string> picture(static_cast<size_t>(h));for(string& row:picture)cin>>row;
          array<int,26> min_row,min_col,max_row,max_col;min_row.fill(h);min_col.fill(w);max_row.fill(-1);max_col.fill(-1);
          for(int row=0;row<h;++row)for(int column=0;column<w;++column){char c=picture[static_cast<size_t>(row)][static_cast<size_t>(column)];if(c=='.')continue;size_t id=static_cast<size_t>(c-'A');min_row[id]=min(min_row[id],row);max_row[id]=max(max_row[id],row);min_col[id]=min(min_col[id],column);max_col[id]=max(max_col[id],column);}
          vector<int> letters;for(int id=0;id<26;++id)if(max_row[static_cast<size_t>(id)]!=-1)letters.push_back(id);
          vector<vector<bool>> edge(26,vector<bool>(26,false));vector<int> indegree(26,0);
          for(int id:letters){int r1=min_row[static_cast<size_t>(id)],r2=max_row[static_cast<size_t>(id)],c1=min_col[static_cast<size_t>(id)],c2=max_col[static_cast<size_t>(id)];for(int row=r1;row<=r2;++row)for(int column=c1;column<=c2;++column)if(row==r1||row==r2||column==c1||column==c2){char visible=picture[static_cast<size_t>(row)][static_cast<size_t>(column)];if(visible=='.'||visible==static_cast<char>('A'+id))continue;int top=visible-'A';if(!edge[static_cast<size_t>(id)][static_cast<size_t>(top)]){edge[static_cast<size_t>(id)][static_cast<size_t>(top)]=true;++indegree[static_cast<size_t>(top)];}}}
          vector<bool> used(26,false);string order;enumerate(letters,edge,indegree,used,order);
      }
  }
external_url: http://bailian.openjudge.cn/practice/1128/
external_platform: OpenJ_Bailian
external_problem_id: '1128'
external_title: Frame Stacking
external_relation: original
source_book_pages: [610]
source_pdf_pages: [240]
review_status: verified
---

每個被覆蓋的邊界格都揭露一條底到頂的偏序；之後問題就成了列舉 DAG 的所有線性延伸。
