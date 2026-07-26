---
id: luogu-p3705
volume: lower
source_file: lower-volume
source_book_pages:
  - 414
source_pdf_pages:
  - 44
title: Luogu P3705 新生舞會
chapter: 6
section: '6.6'
kind: external-oj
difficulty: 5
topics: &a1
  - 0/1 分數規劃
  - 二分圖最大權匹配
prerequisites:
  - 模運算與線性方程
  - 依題型所需的圖論或數論基礎
statement: n 名男生與 n 名女生需完美配對。配對 (i,j) 有喜悅 a[i][j] 與不協調 b[i][j]，最大化所有喜悅總和除以所有不協調總和。
constraints:
  - 1 <= n <= 100
  - 1 <= a[i][j], b[i][j] <= 10^4
input_format: n，接著 a 矩陣與 b 矩陣。
output_format: 輸出最大比值，四捨五入至六位。
samples:
  - input: |
      3
      19 17 16
      25 24 23
      35 36 31
      9 5 6
      3 4 2
      7 8 9
    output: |
      5.357143
    explanation: 選取一組完美配對後，最優的喜悅總和與不協調總和之比為 75/14。
core_knowledge: *a1
judgment: 二分比值 x，把邊權改為 a[i][j]-x·b[i][j]；以 Hungarian 演算法求完美匹配最大權。最大權非負時 x 可行。
hints:
  - 先把隨機過程、流量調整或冪次條件寫成代數式。
  - 辨認固定維矩陣、線性方程、分數規劃或同餘系統，避免直接模擬巨大狀態。
  - 處理自由變數、非互質模數、數值精度與溢位等邊界後再輸出。
solution_outline: 二分比值 x，把邊權改為 a[i][j]-x·b[i][j]；以 Hungarian 演算法求完美匹配最大權。最大權非負時 x 可行。
proof_or_invariant: 對任一配對，Σa/Σb>=x 當且僅當 Σ(a-xb)>=0，且 Σb>0。最大權完美匹配正好在所有配對中最大化右式，因此判定等價且對 x 單調。
complexity:
  time: O(n^3 log(1/eps))
  space: O(n^2)
common_errors:
  - 只挑每列最大而破壞一對一
  - 未強制匹配滿 n 對
  - 精度不足導致六位小數錯誤
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
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;cin>>n;vector<vector<double>>a(n+1,vector<double>(n+1)),b=a;for(int i=1;i<=n;++i)for(int j=1;j<=n;++j)cin>>a[i][j];for(int i=1;i<=n;++i)for(int j=1;j<=n;++j)cin>>b[i][j];auto best=[&](double x){vector<double>u(n+1),v(n+1);vector<int>p(n+1),way(n+1);for(int i=1;i<=n;++i){p[0]=i;int j0=0;vector<double>mn(n+1,1e100);vector<char>used(n+1);do{used[j0]=1;int i0=p[j0],j1=0;double delta=1e100;for(int j=1;j<=n;++j)if(!used[j]){double cur=-(a[i0][j]-x*b[i0][j])-u[i0]-v[j];if(cur<mn[j])mn[j]=cur,way[j]=j0;if(mn[j]<delta)delta=mn[j],j1=j;}for(int j=0;j<=n;++j)if(used[j])u[p[j]]+=delta,v[j]-=delta;else mn[j]-=delta;j0=j1;}while(p[j0]!=0);do{int j1=way[j0];p[j0]=p[j1];j0=j1;}while(j0);}double sum=0;for(int j=1;j<=n;++j)sum+=a[p[j]][j]-x*b[p[j]][j];return sum;};double l=0,r=10000;for(int it=0;it<80;++it){double mid=(l+r)/2;if(best(mid)>=0)l=mid;else r=mid;}cout<<fixed<<setprecision(6)<<l<<"\n";}
external_url: https://www.luogu.com.cn/problem/P3705
external_platform: Luogu
external_problem_id: P3705
external_title: 新生舞會
external_relation: original
review_status: verified
---

二分比值 x，把邊權改為 a[i][j]-x·b[i][j]；以 Hungarian 演算法求完美匹配最大權。最大權非負時 x 可行。
