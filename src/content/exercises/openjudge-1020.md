---
id: openjudge-1020
volume: upper
source_file: upper-volume
title: OpenJudge 百練 1020 Anniversary Cake
chapter: 3
section: '3.2'
kind: external-oj
difficulty: 4
topics: [backtracking, packing, pruning]
prerequisites: [dfs]
statement: 判斷能否把邊長 s 的正方形蛋糕，以不重疊、不留空的方式切成給定 n 個整數邊長正方形。
constraints: ['1 <= t <= 10', '1 <= n <= 16', 小正方形邊長為 1..10]
input_format: 第一行 t；每組依序給 s、n 與 n 個小正方形邊長。
output_format: 可恰好鋪滿輸出 `KHOOOOB!`，否則輸出 `HUTUTU!`。
samples:
  - input: "2\n4 8 1 1 1 1 1 3 1 1\n5 6 3 3 2 1 1 1\n"
    output: "KHOOOOB!\nHUTUTU!"
    explanation: 第一組可由一個 3×3 與七個 1×1 鋪滿；第二組無法無縫鋪滿。
core_knowledge: [天際線狀態, 第一缺口分支, 重複尺寸剪枝]
judgment: 所有小正方形都必須且只能使用一次；總面積不等於 s² 時立即無解。
hints:
  - 先檢查面積總和，再把邊長由大到小排序。
  - 以每一欄目前填到的高度作天際線；選最左側最低欄作下一個必須覆蓋的位置。
  - 只嘗試能放入連續等高區間的未用方塊，且同一層跳過相同邊長。
solution_outline: 面積相等後，以天際線 DFS；每層固定第一個最低缺口，枚舉可放尺寸、更新連續欄高並回溯。
proof_or_invariant: 天際線始終表示由底部無洞鋪設的部分。任一完成鋪法中，覆蓋最左最低缺口的方塊下緣必在該高度，且左緣就是該缺口，故枚舉所有可容尺寸不漏解；每次放置面積增加，使用完全部方塊且高度皆 s 即為完整鋪法。
complexity: { time: 'O(n!) 最壞，面積與天際線剪枝', space: 'O(n+s)' }
common_errors: [未先檢查總面積, 相同尺寸重複分支, 只檢查第一欄高度而未檢查整段等高]
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main() { /* TODO：以欄高天際線搜尋第一個最低缺口。 */ }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  int side,count_piece;vector<int> piece,height;vector<bool> used;
  bool search(int placed){if(placed==count_piece)return all_of(height.begin(),height.end(),[](int h){return h==side;});int x=static_cast<int>(min_element(height.begin(),height.end())-height.begin()),base=height[x],run=0;while(x+run<side&&height[x+run]==base)++run;int previous=-1;for(int i=0;i<count_piece;++i)if(!used[i]&&piece[i]!=previous&&piece[i]<=run&&base+piece[i]<=side){previous=piece[i];used[i]=true;for(int c=x;c<x+piece[i];++c)height[c]+=piece[i];if(search(placed+1))return true;for(int c=x;c<x+piece[i];++c)height[c]-=piece[i];used[i]=false;}return false;}
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int tests;cin>>tests;while(tests--){cin>>side>>count_piece;piece.resize(count_piece);int area=0;for(int&length:piece){cin>>length;area+=length*length;}sort(piece.rbegin(),piece.rend());height.assign(side,0);used.assign(count_piece,false);cout<<(area==side*side&&search(0)?"KHOOOOB!":"HUTUTU!")<<'\n';}}
external_url: http://bailian.openjudge.cn/practice/1020/
external_platform: OpenJudge 百練
external_problem_id: '1020'
external_title: Anniversary Cake
external_relation: original
source_book_pages: [97, 149]
source_pdf_pages: [115, 167]
review_status: verified
---

固定第一個最低缺口，把二維任意放置縮成有限且完備的尺寸分支。
