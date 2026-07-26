---
id: luogu-p4774
volume: lower
source_file: lower-volume
source_book_pages:
  - 431
source_pdf_pages:
  - 61
title: Luogu P4774 屠龍勇士
chapter: 6
section: '6.9'
kind: external-oj
difficulty: 5
topics: &a1
  - 擴展中國剩餘定理
  - 擴展歐幾里得
  - 平衡樹
prerequisites:
  - 模運算與線性方程
  - 依題型所需的圖論或數論基礎
statement: 依序面對 n 條龍。每回合每條龍恢復 p_i 血，且同一把劍攻擊一次；首次取不大於龍初始血量的最大攻擊力（若不存在則取最小），屠龍後以掉落的劍替換。求同時能殺死所有龍的最少攻擊輪數。
constraints:
  - 多組資料
  - 數值與最終公倍數可達 64 位元範圍
input_format: T；每組為 n、m，龍血 a、恢復 p、掉落劍，及 m 把初始劍。
output_format: 每組輸出最少輪數；無解輸出 -1。
samples:
  - input: |
      2
      3 3
      3 5 7
      4 6 10
      7 3 9
      1 9 1000
      3 2
      3 5 6
      4 8 7
      1 1 1
      1 1
    output: |
      59
      -1
    explanation: 第一組合併三條線性同餘後最小可行輪數為 59；第二組同餘條件互相衝突。
core_knowledge: *a1
judgment: 用 multiset 模擬每條龍選劍。條件為 atk_i·x≡a_i (mod p_i)，先以 exgcd 化成普通同餘，再逐式 ExCRT 合併；最後把解提升到至少 max ceil(a_i/atk_i)。
hints:
  - 先把隨機過程、流量調整或冪次條件寫成代數式。
  - 辨認固定維矩陣、線性方程、分數規劃或同餘系統，避免直接模擬巨大狀態。
  - 處理自由變數、非互質模數、數值精度與溢位等邊界後再輸出。
solution_outline: 用 multiset 模擬每條龍選劍。條件為 atk_i·x≡a_i (mod p_i)，先以 exgcd 化成普通同餘，再逐式 ExCRT 合併；最後把解提升到至少 max ceil(a_i/atk_i)。
proof_or_invariant: 第 x 輪後淨血量同餘條件恰為 atk_i x≡a_i (mod p_i)；且 x 不小於所需攻擊次數才確實跨過零。線性同餘化簡保留全部解，ExCRT 合併後得到且僅得到所有方程公共解；提升同餘類得到最小可行者。
complexity:
  time: O((n+m)log m+n log V)
  space: O(n+m)
common_errors:
  - 沒有處理不存在不大於血量的劍
  - 只解同餘而漏掉殺死所需下界
  - CRT 中間乘法溢位
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
  using i64=long long;using u64=unsigned long long;i64 egcd(i64 a,i64 b,i64&x,i64&y){if(b==0){x=1;y=0;return a;}i64 x1=0,y1=0,g=egcd(b,a%b,x1,y1);x=y1;y=x1-(a/b)*y1;return g;}u64 addm(u64 a,u64 b,u64 m){return a>=m-b?a-(m-b):a+b;}u64 mulm(u64 a,u64 b,u64 m){u64 r=0;a%=m;while(b){if(b&1ULL)r=addm(r,a,m);b>>=1;if(b)a=addm(a,a,m);}return r;}i64 norm(i64 x,i64 m){x%=m;if(x<0)x+=m;return x;}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int tc;cin>>tc;while(tc--){int n,m;cin>>n>>m;vector<i64>a(n),p(n),drop(n),atk(n);for(i64&x:a)cin>>x;for(i64&x:p)cin>>x;for(i64&x:drop)cin>>x;multiset<i64>s;for(int i=0;i<m;++i){i64 x;cin>>x;s.insert(x);}i64 lower=0;for(int i=0;i<n;++i){auto it=s.upper_bound(a[i]);if(it==s.begin())it=s.begin();else --it;atk[i]=*it;s.erase(it);s.insert(drop[i]);lower=max(lower,(a[i]-1)/atk[i]+1);}i64 ans=0,mod=1;bool ok=true;for(int i=0;i<n&&ok;++i){i64 x=0,y=0,g=egcd(atk[i],p[i],x,y);if(a[i]%g){ok=false;break;}i64 mi=p[i]/g;i64 ri=static_cast<i64>(mulm(static_cast<u64>(norm(x,mi)),static_cast<u64>(a[i]/g),static_cast<u64>(mi)));i64 sx=0,sy=0,gg=egcd(mod,mi,sx,sy);i64 diff=norm(ri-norm(ans,mi),mi);if(diff%gg){ok=false;break;}i64 q=mi/gg;i64 t=static_cast<i64>(mulm(static_cast<u64>(norm(sx,q)),static_cast<u64>(diff/gg),static_cast<u64>(q)));i64 next=mod/gg*mi;u64 inc=mulm(static_cast<u64>(mod),static_cast<u64>(t),static_cast<u64>(next));ans=static_cast<i64>(addm(static_cast<u64>(norm(ans,next)),inc,static_cast<u64>(next)));mod=next;}if(!ok){cout<<-1<<"\n";continue;}if(ans<lower)ans+=(lower-ans+mod-1)/mod*mod;cout<<ans<<"\n";}}
external_url: https://www.luogu.com.cn/problem/P4774
external_platform: Luogu
external_problem_id: P4774
external_title: 屠龍勇士
external_relation: original
review_status: verified
---

用 multiset 模擬每條龍選劍。條件為 atk_i·x≡a_i (mod p_i)，先以 exgcd 化成普通同餘，再逐式 ExCRT 合併；最後把解提升到至少 max ceil(a_i/atk_i)。
