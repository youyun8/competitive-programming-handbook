---
id: luogu-p4570
volume: lower
source_file: lower-volume
source_book_pages:
  - 387
  - 461
source_pdf_pages:
  - 17
  - 91
title: Luogu P4570 元素
chapter: 6
section: '6.5'
kind: external-oj
difficulty: 4
topics:
  - 線性基
  - 分數規劃
prerequisites:
  - GF(2) 與二分答案
statement: 每個礦石有元素編號與魔力值；選出元素編號線性獨立的集合，使魔力值總和最大。
constraints:
  - n<=1000
  - 元素編號為 64 位元非負整數
input_format: 依題意讀入測試組、陣列或圖資料。
output_format: 逐組輸出指定答案。
samples:
  - input: |
      3
      1 10
      2 20
      3 100
    output: |
      120
    explanation: 直接列舉小型案例或依判定式計算可得。
core_knowledge:
  - 等價判定
  - 線性獨立或負環
judgment: 依魔力由大至小，若元素向量可增加線性基秩就選取，這是向量擬陣上的加權貪心。
hints:
  - 先把目標改寫成線性獨立或「答案至少為 x」的判定。
  - 找出判定中需要最大化的加總量。
  - 使用線性基、背包或負環檢測完成判定，並處理精度。
solution_outline: 依魔力由大至小，若元素向量可增加線性基秩就選取，這是向量擬陣上的加權貪心。
proof_or_invariant: 線性獨立集合構成擬陣；交換性質保證按權重遞減加入仍獨立元素得到最大權基。
complexity:
  time: O(n log n+n·64)
  space: O(n)
common_errors:
  - 線性基主元方向錯誤
  - 二分可行方向顛倒
  - 64 位元或浮點精度不足
cpp_skeleton: |
  // TODO：依提示重寫核心資料結構。
  #include <bits/stdc++.h>
  using namespace std;
  struct E{unsigned long long x;long long w;};int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;cin>>n;vector<E>a(n);for(auto&e:a)cin>>e.x>>e.w;sort(a.begin(),a.end(),[](E p,E q){return p.w>q.w;});array<unsigned long long,64>b{};long long ans=0;for(auto e:a){auto x=e.x;bool ok=false;for(int j=63;j>=0;--j)if(x>>j&1ULL){if(b[j])x^=b[j];else{b[j]=x;ok=true;break;}}if(ok)ans+=e.w;}cout<<ans<<"\n";}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  struct E{unsigned long long x;long long w;};int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;cin>>n;vector<E>a(n);for(auto&e:a)cin>>e.x>>e.w;sort(a.begin(),a.end(),[](E p,E q){return p.w>q.w;});array<unsigned long long,64>b{};long long ans=0;for(auto e:a){auto x=e.x;bool ok=false;for(int j=63;j>=0;--j)if(x>>j&1ULL){if(b[j])x^=b[j];else{b[j]=x;ok=true;break;}}if(ok)ans+=e.w;}cout<<ans<<"\n";}
external_url: https://www.luogu.com.cn/problem/P4570
external_platform: Luogu
external_problem_id: P4570
external_title: 元素
external_relation: original
review_status: verified
---

以代數結構或單調判定取代直接枚舉。
