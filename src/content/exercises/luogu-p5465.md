---
id: luogu-p5465
volume: upper
source_file: upper-volume
title: 洛谷 P5465 星際穿越：最短距離期望
chapter: 2
section: '2.5'
kind: external-oj
difficulty: 5
topics: ['倍增法', '最短路分層', '區間距離和']
prerequisites: []
statement: |-
  n 個星球位於數軸；星球 i 與 [l_i,i-1] 每點建立雙向單位邊。每次從 x 到 [l,r] 均勻隨機目的地，輸出最短距離期望的最簡分數。
constraints:
  - 'n,q<=300000；查詢保證 l<r<x。'
input_format: '依題意輸入規模、初始資料及所有查詢或刪除操作。'
output_format: '逐次輸出最簡分數或目前逆序對數。'
samples:
  - input: |
      4
      1 2 1
      1
      1 2 4
    output: |
      1/1
    explanation: '依題意直接建立小型狀態，可逐項驗證輸出。'
core_knowledge: ['倍增法', '最短路分層', '區間距離和']
judgment: '資料規模排除逐次重建，需預處理倍增資訊或以分塊維護刪除影響。'
hints:
  - '先找出一次操作只會影響哪些分層區間或哪些逆序對。'
  - '對完整區塊預存可二分的資訊，邊界則直接掃描。'
  - '以不變量證明每次只加入或扣除當次操作的精確貢獻。'
solution_outline: '預處理每個後綴一步可達最左端，倍增維護跳 2^j 層後的左端與整段距離和；兩個前綴距離和相減回答區間。'
proof_or_invariant: '每 k 步可達的左側點形成後綴區間；倍增表依兩個半程合併。calc 恰逐層累計每個距離分層，差分後即為查詢區間距離總和。'
common_errors: ['使用 int 儲存總和', '端點或刪除前後時機錯誤', '更新資料結構後未保持排序']
complexity:
  time: 'O((n+q) log n)'
  space: 'O(n log n)'
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main() {
      // TODO：依提示建立資料結構並回答查詢。
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;if(!(cin>>n))return 0;const int levels=20;vector<int>left(n+1,1);for(int i=2;i<=n;++i)cin>>left[i];vector<array<int,levels>>jump(n+1);vector<array<long long,levels>>sum(n+1);jump[n][0]=left[n];sum[n][0]=n-left[n];for(int i=n-1;i>=1;--i){jump[i][0]=min(jump[i+1][0],left[i]);sum[i][0]=i-jump[i][0];}for(int j=1;j<levels;++j)for(int i=1;i<=n;++i){int middle=jump[i][j-1];jump[i][j]=jump[middle][j-1];sum[i][j]=sum[i][j-1]+sum[middle][j-1]+(1LL<<(j-1))*(middle-jump[i][j]);}auto calc=[&](int aim,int x){if(aim>=left[x])return static_cast<long long>(x-aim);long long answer=x-left[x],step=1;x=left[x];for(int j=levels-1;j>=0;--j)if(jump[x][j]>=aim){answer+=step*(x-jump[x][j])+sum[x][j];step+=1LL<<j;x=jump[x][j];}if(x>aim)answer+=(step+1)*(x-aim);return answer;};int q;cin>>q;while(q--){int l,r,x;cin>>l>>r>>x;long long numerator=calc(l,x)-calc(r+1,x),denominator=r-l+1,g=gcd(numerator,denominator);cout<<numerator/g<<'/'<<denominator/g<<'\n';}return 0;}
external_url: https://www.luogu.com.cn/problem/P5465
external_platform: 洛谷
external_problem_id: P5465
external_title: '星際穿越：最短距離期望'
external_relation: original
source_book_pages: [92]
source_pdf_pages: [110]
review_status: verified
---

本題使用可證明的離線／倍增結構避免逐次暴力。
