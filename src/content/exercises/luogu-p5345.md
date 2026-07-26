---
id: luogu-p5345
volume: lower
source_file: lower-volume
source_book_pages:
  - 431
source_pdf_pages:
  - 61
title: Luogu P5345 快樂肥宅
chapter: 6
section: '6.9'
kind: external-oj
difficulty: 5
topics: &a1
  - 擴展 BSGS
  - 擴展中國剩餘定理
prerequisites:
  - 模運算與線性方程
  - 依題型所需的圖論或數論基礎
statement: 第 0 天每人體重為 1，第 i 人每天體重乘 k_i 後對 g_i 取模（餘數 0 以 g_i 表示）。求不超過 10^9 的最早一天，使所有人體重依序為 r_i；不存在輸出 Impossible。
constraints:
  - 1 <= n <= 1000
  - 1 <= k_i,r_i <= g_i <= 10^7
input_format: n，接著 n 行 k_i、g_i、r_i。
output_format: 最小天數，或 Impossible。
samples:
  - input: |
      2
      4 7 4
      2 5 3
    output: |
      7
    explanation: 兩序列分別在第 7 天為 4 與 3，且之前沒有同時符合。
core_knowledge: *a1
judgment: 每人要求 k_i^x≡r_i (mod g_i)。ExBSGS 求最小解與進入循環後的週期；尾端單次解需固定 x，週期解形成同餘式。用 ExCRT 合併並檢查 x<=10^9。
hints:
  - 先把隨機過程、流量調整或冪次條件寫成代數式。
  - 辨認固定維矩陣、線性方程、分數規劃或同餘系統，避免直接模擬巨大狀態。
  - 處理自由變數、非互質模數、數值精度與溢位等邊界後再輸出。
solution_outline: 每人要求 k_i^x≡r_i (mod g_i)。ExBSGS 求最小解與進入循環後的週期；尾端單次解需固定 x，週期解形成同餘式。用 ExCRT 合併並檢查 x<=10^9。
proof_or_invariant: ExBSGS 逐次剝除 base 與 modulus 的 gcd，完整處理非互質尾鏈；進入互質部分後 BSGS 找首解與乘法階，因此描述該方程全部解。固定解逐一核對，週期解由 ExCRT 取交集，最後得到所有人同時符合的最早日。
complexity:
  time: O(Σsqrt(g_i) log g_i)
  space: O(max sqrt(g_i)+n)
common_errors:
  - 把 r_i=g_i 當成 g_i 而非餘數 0
  - 普通 BSGS 套在 base 與模數不互質
  - 漏掉 10^9 上限或非週期單點解
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
  using i64=long long;i64 pw(i64 a,i64 e,i64 m){i64 r=1%m;for(a%=m;e;e>>=1,a=a*a%m)if(e&1)r=r*a%m;return r;}i64 egcd(i64 a,i64 b,i64&x,i64&y){if(!b){x=1;y=0;return a;}i64 g=egcd(b,a%b,y,x);y-=a/b*x;return g;}i64 bsgs(i64 a,i64 b,i64 m,bool positive){if(m==1)return positive?1:0;a%=m;b%=m;if(!positive&&b==1%m)return 0;i64 s=static_cast<i64>(sqrt(static_cast<double>(m)))+1;unordered_map<i64,int>tab;tab.reserve(static_cast<size_t>(s*2+3));i64 cur=b;for(int j=0;j<s;++j){tab[cur]=j;cur=cur*a%m;}i64 step=pw(a,s,m);cur=1;for(int i=1;i<=s+1;++i){cur=cur*step%m;auto it=tab.find(cur);if(it!=tab.end()){i64 x=static_cast<i64>(i)*s-it->second;if(x>0||!positive)return x;}}return -1;}pair<i64,i64> exbsgs(i64 a,i64 b,i64 m){a%=m;b%=m;if(m==1)return {0,1};i64 offset=0,acc=1%m,d=1;while(true){i64 nd=gcd(acc*a%m,m);if(d==nd)break;if(acc==b)return {offset,-1};++offset;acc=acc*a%m;d=nd;}if(b%d)return {-1,-1};m/=d;b/=d;acc/=d;if(m==1)return {offset,1};i64 x=0,y=0;egcd(acc,m,x,y);x%=m;if(x<0)x+=m;b=b*x%m;i64 first=bsgs(a,b,m,false);if(first<0)return {-1,-1};i64 order=bsgs(a,1%m,m,true);if(order<1)return {-1,-1};return {first%order+offset,order};}bool combine(i64&r,i64&mod,i64 b,i64 m){i64 x=0,y=0,g=egcd(mod,m,x,y),diff=b-r;if(diff%g)return false;i64 q=m/g;x%=q;if(x<0)x+=q;i64 t=(x*((diff/g%q+q)%q))%q;i64 nm=mod*q;r=(r+mod*t)%nm;if(r<0)r+=nm;mod=nm;return true;}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;cin>>n;vector<pair<i64,i64>>sol;sol.reserve(n);i64 fixed=-1,lower=0;bool ok=true;for(int i=0;i<n;++i){i64 k,g,r;cin>>k>>g>>r;auto z=exbsgs(k,r%g,g);if(z.first<0)ok=false;sol.push_back(z);lower=max(lower,z.first);if(z.second<0){if(fixed<0)fixed=z.first;else if(fixed!=z.first)ok=false;}}const i64 U=1000000000;if(!ok){cout<<"Impossible\n";return 0;}if(fixed>=0){for(auto [r,m]:sol)if((m<0&&fixed!=r)||(m>0&&(fixed<r||(fixed-r)%m)))ok=false;if(!ok||fixed>U)cout<<"Impossible\n";else cout<<fixed<<"\n";return 0;}i64 r=0,mod=1;for(auto [a,m]:sol){if(mod>U){if(r<a||(r-a)%m)ok=false;}else if(!combine(r,mod,a%m,m))ok=false;if(!ok)break;}if(ok&&r<lower)r+=(lower-r+mod-1)/mod*mod;if(!ok||r>U)cout<<"Impossible\n";else cout<<r<<"\n";}
external_url: https://www.luogu.com.cn/problem/P5345
external_platform: Luogu
external_problem_id: P5345
external_title: 快樂肥宅
external_relation: original
review_status: verified
---

每人要求 k_i^x≡r_i (mod g_i)。ExBSGS 求最小解與進入循環後的週期；尾端單次解需固定 x，週期解形成同餘式。用 ExCRT 合併並檢查 x<=10^9。
