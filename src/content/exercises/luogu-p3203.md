---
id: luogu-p3203
volume: upper
source_file: upper-volume
source_book_pages: [197, 220]
source_pdf_pages: [215, 238]
chapter: 4
section: '4.5'
kind: external-oj
review_status: verified
external_relation: original
title: 洛谷 P3203 彈飛綿羊：分塊維護跳躍
difficulty: 4
topics: [分塊, 倍增跳躍, 單點修改]
prerequisites: [sqrt-decomposition]
statement: n 個位置由 0 編號；從位置 i 會向右跳 a_i 格。支援修改某個 a_i，以及詢問一隻綿羊從指定位置跳出陣列需要幾次。
constraints:
  - '1 <= n <= 200000，1 <= q <= 100000'
  - '1 <= a_i <= n'
  - 所有詢問與修改位置介於 0 與 n-1
input_format: 第一行 n 與 n 個跳距，接著 q；`1 x` 詢問，`2 x y` 把 a_x 改為 y。
output_format: 每個操作 1 輸出一行跳躍次數。
samples:
  - input: |
      5
      2 3 1 1 2
      4
      1 0
      1 2
      2 2 3
      1 0
    output: |
      4
      3
      2
    explanation: 初始從 0 依序到 2、3、4、陣列外，共四跳；把位置 2 改成跳三格後，0 只需到 2 再出界。
core_knowledge: [分塊跳躍, 塊內倒序重建, 單點更新]
judgment: 跳躍只向右；可預先把每個位置壓縮成「跳出目前塊後的位置與所需步數」，詢問每塊只走一次。
hints:
  - 對每個 i 保存 next[i]：連跳直到離開 i 所在塊後抵達的位置。
  - 同時保存 count[i]；若 i+a_i 仍在同塊，就接上後者的預處理結果。
  - 單點修改只影響同一塊中不大於該位置的狀態，直接倒序重建整塊即可。
solution_outline: 分塊後由右向左計算 next、count。詢問反覆累加 count 並跳到 next；修改後重建所在塊。
proof_or_invariant: 預處理值精確代表從 i 到第一次離開其塊的跳躍段。這些段首尾相接與原逐步跳躍完全相同，直到位置超界；修改只可能改變同塊向右依賴鏈。
complexity:
  time: 建立 O(n)，詢問與修改 O(sqrt(n))
  space: O(n)
common_errors:
  - 把題目的零起算位置誤轉成一起算
  - 判斷同塊時只比較距離而非區塊編號
  - 修改後沒有由塊右端向左重建
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;cin>>n;vector<int>jump(static_cast<size_t>(n));for(int&x:jump)cin>>x;int q;cin>>q;while(q--){int op,x;cin>>op>>x;if(op==1){int answer=0;while(x<n){x+=jump[static_cast<size_t>(x)];++answer;}cout<<answer<<'\n';}else{int y;cin>>y;jump[static_cast<size_t>(x)]=y;}}}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;cin>>n;vector<int>jump(static_cast<size_t>(n)),next(static_cast<size_t>(n)),count(static_cast<size_t>(n));for(int&x:jump)cin>>x;int length=max(1,static_cast<int>(sqrt(static_cast<double>(n))));auto rebuild=[&](int block){int left=block*length,right=min(n,(block+1)*length)-1;for(int i=right;i>=left;--i){int target=i+jump[static_cast<size_t>(i)];if(target<n&&target/length==block){next[static_cast<size_t>(i)]=next[static_cast<size_t>(target)];count[static_cast<size_t>(i)]=count[static_cast<size_t>(target)]+1;}else{next[static_cast<size_t>(i)]=target;count[static_cast<size_t>(i)]=1;}}};int blocks=(n+length-1)/length;for(int b=blocks-1;b>=0;--b)rebuild(b);int q;cin>>q;while(q--){int op,x;cin>>op>>x;if(op==1){int answer=0;while(x<n){answer+=count[static_cast<size_t>(x)];x=next[static_cast<size_t>(x)];}cout<<answer<<'\n';}else{int y;cin>>y;jump[static_cast<size_t>(x)]=y;rebuild(x/length);}}}
external_url: https://www.luogu.com.cn/problem/P3203
external_platform: 洛谷
external_problem_id: P3203
external_title: '[HNOI2010] 弹飞绵羊'
---

這類只向一側移動的函數圖，可以把每個塊內的一串跳躍壓成一條邊。
