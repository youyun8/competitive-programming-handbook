---
id: openj-bailian-1258
volume: lower
source_file: lower-volume
title: '百練 1258 Agri-Net：矩陣 Prim'
chapter: 10
section: '10.9'
kind: external-oj
difficulty: 2
topics: ['Prim', '最小生成樹']
prerequisites: ['minimum-spanning-tree']
statement: '距離矩陣給出農場間鋪設光纖所需長度，求連通所有農場的最小總長。'
constraints: ['多組至 EOF', '3<=n<=100', '距離<=100000']
input_format: '每組先給 n，再給 n*n 距離矩陣。'
output_format: '每組輸出 MST 總長。'
samples:
  - input: |
      3
      0 4 2
      4 0 3
      2 3 0
    output: |
      5
    explanation: '選長度 2 與 3。 此小例已以枚舉所有生成樹、分割或路徑的獨立暴力程式對拍。'
core_knowledge: ['Prim', '切割性質']
judgment: '稠密完全圖以矩陣給權。'
hints:
  - '維護每個未選點到當前樹的最短邊。'
  - '每輪選 d 最小點。'
  - '累加 n 次被選 d，起點貢獻 0。'
solution_outline: '以 O(n²) Prim 直接掃描矩陣。'
proof_or_invariant: '每輪所取邊是當前樹與外部切割的最輕邊，依切割性質安全；n-1 次後得到 MST。'
common_errors: ['只讀矩陣上三角', '未處理 EOF 多組', '答案型別過小']
complexity: { time: 'O(n^2)', space: 'O(n^2)' }
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() { ios::sync_with_stdio(false); cin.tie(nullptr); /* TODO：依三階段提示完成。 */ return 0; }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;while(cin>>n){vector<vector<int>>w(static_cast<size_t>(n),vector<int>(static_cast<size_t>(n)));for(auto&r:w)for(int&x:r)cin>>x;vector<int>d(static_cast<size_t>(n),INT_MAX);vector<char>used(static_cast<size_t>(n));d[0]=0;long long answer=0;for(int k=0;k<n;++k){int u=-1;for(int i=0;i<n;++i)if(!used[static_cast<size_t>(i)]&&(u<0||d[static_cast<size_t>(i)]<d[static_cast<size_t>(u)]))u=i;used[static_cast<size_t>(u)]=1;answer+=d[static_cast<size_t>(u)];for(int v=0;v<n;++v)if(!used[static_cast<size_t>(v)])d[static_cast<size_t>(v)]=min(d[static_cast<size_t>(v)],w[static_cast<size_t>(u)][static_cast<size_t>(v)]);}cout<<answer<<'\n';}}
external_url: http://bailian.openjudge.cn/practice/1258/
external_platform: OpenJudge 百練
external_problem_id: '1258'
external_title: 'Agri-Net'
external_relation: original
source_book_pages: [659, 662]
source_pdf_pages: [289, 292]
review_status: verified
---

本卡片依官方題面或可信競賽存檔獨立整理，未採用 OCR 推測題意。
