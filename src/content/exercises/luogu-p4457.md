---
id: luogu-p4457
volume: lower
source_file: lower-volume
source_book_pages:
  - 405
source_pdf_pages:
  - 35
title: Luogu P4457 治療之雨
chapter: 6
section: '6.4'
kind: external-oj
difficulty: 5
topics: &a1
  - 期望
  - 模高斯消去
  - 二項分布
prerequisites:
  - 模運算與線性方程
  - 依題型所需的圖論或數論基礎
statement: 英雄血量上限 n、目前 p，另有 m 個無上限隨從。每輪先在未滿血角色中均勻治療 1 點，再做 k 次：在血量非零角色中均勻造成 1 點傷害。求英雄死亡前輪數期望，模 10^9+7；永不死亡輸出 -1。
constraints:
  - 多組資料
  - n <= 1500
input_format: T，接著每組一行 n、p、m、k。
output_format: 每組輸出模意義期望或 -1。
samples:
  - input: |
      1
      1 1 0 2
    output: |
      1
    explanation: 英雄已滿血且沒有隨從，治療步驟不操作；第一次傷害即令英雄歸零，所以答案是一輪。
core_knowledge: *a1
judgment: 計算一輪 k 次傷害中英雄受 y 次的二項機率，對血量 1..n 建立期望方程。係數矩陣只有主對角線下方與一條上對角線，前向消去只需更新下一欄與常數，總計 O(n²)。
hints:
  - 先把隨機過程、流量調整或冪次條件寫成代數式。
  - 辨認固定維矩陣、線性方程、分數規劃或同餘系統，避免直接模擬巨大狀態。
  - 處理自由變數、非互質模數、數值精度與溢位等邊界後再輸出。
solution_outline: 計算一輪 k 次傷害中英雄受 y 次的二項機率，對血量 1..n 建立期望方程。係數矩陣只有主對角線下方與一條上對角線，前向消去只需更新下一欄與常數，總計 O(n²)。
proof_or_invariant: 治療選英雄機率為 1/(m+1)，選隨從為 m/(m+1)；每次傷害同理，故英雄受傷次數服從二項分布。對每個血量套全期望公式得到方程。消去操作保持解集，吸收狀態 0 的期望為 0，因此所得 f[p] 即答案。
complexity:
  time: O(n²+n log MOD)
  space: O(n²)
common_errors:
  - k=0 或特殊 m=0 情況未判無解
  - 二項機率中的治療與傷害索引錯一
  - 模高斯消去未正規化負數
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main() {
    // TODO：依三段提示建立核心狀態與演算法。
    return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  const int MOD=1000000007;long long pw(long long a,int e){long long r=1;while(e){if(e&1)r=r*a%MOD;a=a*a%MOD;e>>=1;}return r;}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int tc;cin>>tc;while(tc--){int n,start,m,k;cin>>n>>start>>m>>k;if(start==0){cout<<0<<"\n";continue;}if(k==0){cout<<-1<<"\n";continue;}if(m==0&&k==1){cout<<(n==1?1:-1)<<"\n";continue;}long long inv=pw(m+1,MOD-2),ph=inv,po=static_cast<long long>(m)*inv%MOD;vector<long long>prob(n+1);long long comb=1;for(int i=0;i<=min(n,k);++i){prob[i]=pw(ph,i)*pw(po,k-i)%MOD*comb%MOD;if(i<min(n,k))comb=comb*(k-i)%MOD*pw(i+1,MOD-2)%MOD;}vector<vector<long long>>e(n+1,vector<long long>(n+2));for(int x=1;x<n;++x){for(int y=0;y<x;++y)e[x][x-y]=(e[x][x-y]-ph*prob[y+1]-po*prob[y])%MOD;e[x][x+1]=(e[x][x+1]-ph*prob[0])%MOD;e[x][x]=(e[x][x]+1)%MOD;e[x][n+1]=1;}for(int y=1;y<n;++y)e[n][n-y]=(e[n][n-y]-prob[y])%MOD;e[n][n]=(1-prob[0])%MOD;e[n][n+1]=1;for(int i=1;i<n;++i){e[i][i]=(e[i][i]+MOD)%MOD;long long iv=pw(e[i][i],MOD-2);for(int j=i+1;j<=n;++j){long long t=(e[j][i]+MOD)%MOD*iv%MOD;e[j][i]=0;e[j][i+1]=(e[j][i+1]-t*e[i][i+1])%MOD;e[j][n+1]=(e[j][n+1]-t*e[i][n+1])%MOD;}}vector<long long>f(n+1);for(int i=n;i>=1;--i){long long rhs=(e[i][n+1]+MOD)%MOD;if(i<n)rhs=(rhs-(e[i][i+1]+MOD)%MOD*f[i+1])%MOD;f[i]=(rhs+MOD)%MOD*pw((e[i][i]+MOD)%MOD,MOD-2)%MOD;}cout<<f[start]<<"\n";}}
external_url: https://www.luogu.com.cn/problem/P4457
external_platform: Luogu
external_problem_id: P4457
external_title: 治療之雨
external_relation: original
review_status: verified
---

計算一輪 k 次傷害中英雄受 y 次的二項機率，對血量 1..n 建立期望方程。係數矩陣只有主對角線下方與一條上對角線，前向消去只需更新下一欄與常數，總計 O(n²)。
