---
id: openj-bailian-3435
volume: lower
source_file: lower-volume
title: 百練 3435 Borg Maze：BFS 建圖與最小生成樹
chapter: 10
section: '10.9'
kind: external-oj
difficulty: 3
topics: [網格 BFS, 最小生成樹, Prim]
prerequisites: [breadth-first-search, minimum-spanning-tree]
statement: 迷宮中有起點 S 與若干外星人 A；搜索隊可在 S 或找到 A 時分裂。求消滅全部外星人時所有隊伍合計行走步數的最小值。
constraints: [測試組數 <= 50, 1 <= 寬與高 <= 50, 外星人至多 100 個, 所有目標可達, 迷宮外框封閉]
input_format: 第一行測試組數；每組先給寬 x、高 y，接著 y 行可含空格的迷宮，`#` 為牆。
output_format: 每組輸出一行最小總步數。
samples:
  - input: |
      1
      5 3
      #####
      #S A#
      #####
    output: |
      2
    explanation: S 與唯一 A 相距兩步。此小例並以狀態搜尋枚舉所有目標連接方式核對。
core_knowledge: [多源目標間最短距離, BFS, MST]
judgment: 分裂搜索的總成本等價於在所有 S/A 關鍵點間，以迷宮最短距離為邊權求 MST。
hints:
  - 找出所有 S 與 A，從每個關鍵點各做一次 BFS。
  - BFS 抵達其他關鍵點時記錄兩者迷宮最短距離。
  - 對關鍵點完全圖跑 Prim 或 Kruskal。
solution_outline: 逐行 getline 保留空格。收集關鍵點，從每點 BFS 得到距離矩陣，再以 O(k²) Prim 累加 MST。
proof_or_invariant: 任一實際搜索方案的分裂路徑聯集連通所有關鍵點，刪環後得到一棵成本不增的樹；每段成本至少為端點迷宮最短距離。反之，將距離圖 MST 每條邊實作為對應最短路，允許分裂即可達成該總成本。因此兩者最優值相同。
common_errors: [用 cin 讀迷宮而丟失空格, 把 x 與 y 顛倒, 只從 S 做一次 BFS 後誤加距離, 把牆當可行格]
complexity: { time: 'O(kxy + k^2)', space: 'O(xy + k^2)' }
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);/* TODO：關鍵點 BFS 建圖，再求 MST。 */}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){
      ios::sync_with_stdio(false);cin.tie(nullptr);
      int tests;cin>>tests;
      while(tests--){
          int width,height;cin>>width>>height;
          string line;getline(cin,line);
          vector<string> grid(static_cast<size_t>(height));
          vector<pair<int,int>> key;
          for(int r=0;r<height;++r){getline(cin,grid[static_cast<size_t>(r)]);while(static_cast<int>(grid[static_cast<size_t>(r)].size())<width)grid[static_cast<size_t>(r)]+=' ';for(int c=0;c<width;++c)if(grid[static_cast<size_t>(r)][static_cast<size_t>(c)]=='S'||grid[static_cast<size_t>(r)][static_cast<size_t>(c)]=='A')key.push_back({r,c});}
          const int k=static_cast<int>(key.size());
          vector<vector<int>> weight(static_cast<size_t>(k),vector<int>(static_cast<size_t>(k)));
          constexpr int dr[4]={-1,1,0,0},dc[4]={0,0,-1,1};
          for(int source=0;source<k;++source){
              vector<vector<int>> distance(static_cast<size_t>(height),vector<int>(static_cast<size_t>(width),-1));
              queue<pair<int,int>> pending;pending.push(key[static_cast<size_t>(source)]);distance[static_cast<size_t>(key[static_cast<size_t>(source)].first)][static_cast<size_t>(key[static_cast<size_t>(source)].second)]=0;
              while(!pending.empty()){auto [r,c]=pending.front();pending.pop();for(int direction=0;direction<4;++direction){int nr=r+dr[direction],nc=c+dc[direction];if(nr<0||nr>=height||nc<0||nc>=width||grid[static_cast<size_t>(nr)][static_cast<size_t>(nc)]=='#'||distance[static_cast<size_t>(nr)][static_cast<size_t>(nc)]>=0)continue;distance[static_cast<size_t>(nr)][static_cast<size_t>(nc)]=distance[static_cast<size_t>(r)][static_cast<size_t>(c)]+1;pending.push({nr,nc});}}
              for(int target=0;target<k;++target)weight[static_cast<size_t>(source)][static_cast<size_t>(target)]=distance[static_cast<size_t>(key[static_cast<size_t>(target)].first)][static_cast<size_t>(key[static_cast<size_t>(target)].second)];
          }
          vector<int> best(static_cast<size_t>(k),INT_MAX);vector<char> used(static_cast<size_t>(k));best[0]=0;int answer=0;
          for(int step=0;step<k;++step){int u=-1;for(int i=0;i<k;++i)if(!used[static_cast<size_t>(i)]&&(u<0||best[static_cast<size_t>(i)]<best[static_cast<size_t>(u)]))u=i;used[static_cast<size_t>(u)]=1;answer+=best[static_cast<size_t>(u)];for(int v=0;v<k;++v)if(!used[static_cast<size_t>(v)])best[static_cast<size_t>(v)]=min(best[static_cast<size_t>(v)],weight[static_cast<size_t>(u)][static_cast<size_t>(v)]);}
          cout<<answer<<'\n';
      }
  }
external_url: http://bailian.openjudge.cn/practice/3435/
external_platform: OpenJudge 百練
external_problem_id: '3435'
external_title: Borg Maze
external_relation: original
source_book_pages: [659, 662]
source_pdf_pages: [289, 292]
review_status: verified
---

百練 3435 為 POJ 3026 的可信鏡像；格式與限制已對照原題存檔。
