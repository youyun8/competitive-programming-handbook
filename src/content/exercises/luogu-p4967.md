---
id: luogu-p4967
volume: lower
source_file: lower-volume
source_book_pages:
  - 399
source_pdf_pages:
  - 29
title: Luogu P4967 黑暗打擊
chapter: 6
section: '6.3'
kind: external-oj
difficulty: 5
topics: &a1
  - 矩陣快速冪
  - 大整數降冪
prerequisites:
  - 模運算與線性方程
  - 依題型所需的圖論或數論基礎
statement: n 階 Hilbert 曲線構成洞穴牆壁；水從最上層流入，空格在上、左、右至少一格有水時被淹。求被淹單位面積，答案模 9223372036854775783。
constraints:
  - 1 <= n <= 10^10000
input_format: 一行十進位整數 n。
output_format: 輸出淹沒面積取模後的值。
samples:
  - input: |
      3
    output: |
      26
    explanation: 三階圖形直接計數共有 26 格可進水。
  - input: |
      4
    output: |
      100
    explanation: 四階遞推一次後，被淹面積為 100。
  - input: |
      12
    output: |
      2137408
    explanation: 對固定狀態矩陣做十次轉移後得到 2137408。
core_knowledge: *a1
judgment: 依 Hilbert 曲線四分遞迴，維護四種邊界連通狀態；狀態向量乘固定 4×4 矩陣。以十進位逐位冪法直接計算矩陣的超大整數次方，並以加倍法完成溢位安全模乘。
hints:
  - 先把隨機過程、流量調整或冪次條件寫成代數式。
  - 辨認固定維矩陣、線性方程、分數規劃或同餘系統，避免直接模擬巨大狀態。
  - 處理自由變數、非互質模數、數值精度與溢位等邊界後再輸出。
solution_outline: 依 Hilbert 曲線四分遞迴，維護四種邊界連通狀態；狀態向量乘固定 4×4 矩陣。以十進位逐位冪法直接計算矩陣的超大整數次方，並以加倍法完成溢位安全模乘。
proof_or_invariant: 四種狀態完整描述下一階四份旋轉副本的可灌水邊界；逐塊計數導出固定轉移矩陣，因此歸納後向量恰為第 n 階狀態。逐位處理十進位指數時，不變量為 q=B 的「已讀前綴」次方；讀入 d 後更新成 q^10 B^d，故最後得到精確的 B^(n-2)。
complexity:
  time: O(|n| log MOD)
  space: O(1)
common_errors:
  - n=1 或 n=2 時指數為負
  - 64 位元直接相乘溢位
  - 十進位逐位冪更新時漏掉 q 的十次方
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
  using u64=unsigned long long;
  const u64 MOD=9223372036854775783ULL;
  u64 addm(u64 a,u64 b){return a>=MOD-b?a-(MOD-b):a+b;}
  u64 mulm(u64 a,u64 b){u64 r=0;while(b){if(b&1ULL)r=addm(r,a);b>>=1;if(b)a=addm(a,a);}return r;}
  struct Mat{array<array<u64,4>,4>a{};};
  Mat mul(const Mat&x,const Mat&y){Mat z;for(int i=0;i<4;++i)for(int k=0;k<4;++k)if(x.a[i][k])for(int j=0;j<4;++j)z.a[i][j]=addm(z.a[i][j],mulm(x.a[i][k],y.a[k][j]));return z;}
  Mat identity(){Mat r;for(int i=0;i<4;++i)r.a[i][i]=1;return r;}
  Mat small_power(Mat a,int e){Mat r=identity();while(e){if(e&1)r=mul(r,a);e>>=1;if(e)a=mul(a,a);}return r;}
  string minus_two(string s){int i=static_cast<int>(s.size())-1,borrow=2;while(borrow){int value=s[static_cast<size_t>(i)]-'0'-borrow;if(value<0){s[static_cast<size_t>(i)]=static_cast<char>('0'+value+10);borrow=1;}else{s[static_cast<size_t>(i)]=static_cast<char>('0'+value);borrow=0;}--i;}size_t first=s.find_first_not_of('0');return first==string::npos?"0":s.substr(first);}
  int main(){string s;cin>>s;if(s=="1"){cout<<1<<"\n";return 0;}if(s=="2"){cout<<7<<"\n";return 0;}s=minus_two(s);Mat base;base.a={{{2,2,0,0},{1,2,0,0},{1,3,2,0},{0,1,1,1}}};Mat q=identity();for(char c:s){q=small_power(q,10);q=mul(q,small_power(base,c-'0'));}array<u64,4>v{0,1,1,1},w{};for(int j=0;j<4;++j)for(int k=0;k<4;++k)w[j]=addm(w[j],mulm(v[k],q.a[k][j]));u64 ans=1;ans=addm(ans,mulm(w[0],2));ans=addm(ans,mulm(w[1],2));ans=addm(ans,mulm(w[2],3));cout<<ans<<"\n";}
external_url: https://www.luogu.com.cn/problem/P4967
external_platform: Luogu
external_problem_id: P4967
external_title: 黑暗打擊
external_relation: original
review_status: verified
---

依 Hilbert 曲線四分遞迴，維護四種邊界連通狀態；狀態向量乘固定 4×4 矩陣。以十進位逐位冪法直接計算矩陣的超大整數次方，並以加倍法完成溢位安全模乘。
