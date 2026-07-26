---
id: openj-bailian-1789
volume: lower
source_file: lower-volume
title: '百練 1789 Truck History：Hamming 距離 MST'
chapter: 10
section: '10.9'
kind: external-oj
difficulty: 2
topics: ['Prim', 'Hamming 距離']
prerequisites: ['minimum-spanning-tree']
statement: '每種卡車以七字元碼表示，衍生代價為不同位置數；選一棵衍生樹使代價和最小，輸出品質 1/Q。'
constraints: ['2<=n<=2000', '字串長度恰 7 且互異', 'n=0 結束']
input_format: '多組；n 後接 n 個七字元碼，0 結束。'
output_format: '固定格式 The highest possible quality is 1/Q.'
samples:
  - input: |
      2
      aaaaaaa
      aaaaaab
      0
    output: |
      The highest possible quality is 1/1.
    explanation: '兩碼只差一位。 此小例已以枚舉所有生成樹、分割或路徑的獨立暴力程式對拍。'
core_knowledge: ['隱式完全圖', 'Hamming 距離', 'Prim']
judgment: '完整邊集太大但任兩碼距離可 O(7) 即時計算。'
hints:
  - '把每個碼視為點。'
  - '邊權是七個位置的不同數。'
  - 'O(n²) Prim 時即時計算，不需存全部邊。'
solution_outline: 'Prim 維護每點最小連接代價；加入 u 後掃所有 v 計算 Hamming 距離更新。'
proof_or_invariant: '隱式圖仍是普通完全加權圖，Prim 切割性質照常成立；所求 Q 為 MST 權和。'
common_errors: ['輸出固定句缺句點', '把相同字元數當距離', '建 O(n²) 邊物件浪費記憶體']
complexity: { time: 'O(7n^2)', space: 'O(n)' }
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() { ios::sync_with_stdio(false); cin.tie(nullptr); /* TODO：依三階段提示完成。 */ return 0; }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;while(cin>>n&&n){vector<string>s(static_cast<size_t>(n));for(auto&x:s)cin>>x;vector<int>d(static_cast<size_t>(n),INT_MAX);vector<char>used(static_cast<size_t>(n));d[0]=0;int answer=0;for(int k=0;k<n;++k){int u=-1;for(int i=0;i<n;++i)if(!used[static_cast<size_t>(i)]&&(u<0||d[static_cast<size_t>(i)]<d[static_cast<size_t>(u)]))u=i;used[static_cast<size_t>(u)]=1;answer+=d[static_cast<size_t>(u)];for(int v=0;v<n;++v)if(!used[static_cast<size_t>(v)]){int w=0;for(int p=0;p<7;++p)w+=s[static_cast<size_t>(u)][static_cast<size_t>(p)]!=s[static_cast<size_t>(v)][static_cast<size_t>(p)];d[static_cast<size_t>(v)]=min(d[static_cast<size_t>(v)],w);}}cout<<"The highest possible quality is 1/"<<answer<<".\n";}}
external_url: http://bailian.openjudge.cn/practice/1789/
external_platform: OpenJudge 百練
external_problem_id: '1789'
external_title: 'Truck History'
external_relation: original
source_book_pages: [659, 662]
source_pdf_pages: [289, 292]
review_status: verified
---

本卡片依官方題面或可信競賽存檔獨立整理，未採用 OCR 推測題意。
