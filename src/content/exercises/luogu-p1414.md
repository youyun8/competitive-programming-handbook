---
id: luogu-p1414
volume: lower
source_file: lower-volume
source_book_pages:
  - 387
  - 461
source_pdf_pages:
  - 17
  - 91
title: Luogu P1414 又是畢業季II
chapter: 6
section: '6.7'
kind: external-oj
difficulty: 3
topics:
  - 因數計數
  - 倍數篩
prerequisites:
  - 最大公因數與整除
statement: 給定 n 位同學的能力值。對每個 k=1..n，求選出恰好 k 人時，其能力值最大公因數可能達到的最大值。
constraints:
  - 1 <= n <= 10^4
  - 1 <= ability_i <= 10^6
input_format: 第一行 n；第二行 n 個能力值。
output_format: 輸出 n 行，第 k 行為選 k 人可得的最大 gcd。
samples:
  - input: |
      4
      6 10 15 30
    output: |
      30
      15
      5
      1
    explanation: 選一人可取 30；兩人取 15、30；三人取 10、15、30 的 gcd 為 5；四人 gcd 為 1。
core_knowledge:
  - 倍數篩
  - 頻率統計
judgment: 某個 d 能作為 k 人 gcd 的下界，當且僅當至少 k 個能力值是 d 的倍數；由大到小掃 d 更新所有尚未回答的 k。
hints:
  - 固定候選 gcd d，哪些人可以被選？
  - 用值域頻率加總 d 的所有倍數。
  - 大 d 優先，若它可供 cnt 人，則所有尚未回答的 k<=cnt 都取 d。
solution_outline: 某個 d 能作為 k 人 gcd 的下界，當且僅當至少 k 個能力值是 d 的倍數；由大到小掃 d 更新所有尚未回答的 k。
proof_or_invariant: 若至少 k 個數被 d 整除，任取其中 k 人的 gcd 至少 d；任一實際 gcd g 又必整除被選的 k 個數，因此倍數計數至少 k。由大至小掃描得到最大可行值。
complexity:
  time: O(V log V+n)
  space: O(V+n)
common_errors:
  - 只統計 d 本身而非倍數
  - 答案 k 的更新方向錯誤
cpp_skeleton: |
  // TODO：理解證明後，可嘗試自行重寫核心步驟。
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;cin>>n;const int V=1000000;vector<int>f(V+1);for(int i=0,x;i<n;++i){cin>>x;++f[x];}vector<int>a(n+1);int filled=0;for(int d=V;d>=1;--d){int c=0;for(int j=d;j<=V;j+=d)c+=f[j];while(filled<c&&filled<n)a[++filled]=d;}for(int k=1;k<=n;++k)cout<<a[k]<<"\n";}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;cin>>n;const int V=1000000;vector<int>f(V+1);for(int i=0,x;i<n;++i){cin>>x;++f[x];}vector<int>a(n+1);int filled=0;for(int d=V;d>=1;--d){int c=0;for(int j=d;j<=V;j+=d)c+=f[j];while(filled<c&&filled<n)a[++filled]=d;}for(int k=1;k<=n;++k)cout<<a[k]<<"\n";}
external_url: https://www.luogu.com.cn/problem/P1414
external_platform: Luogu
external_problem_id: P1414
external_title: 又是畢業季II
external_relation: original
review_status: verified
---

本題以可驗證的數論性質化簡後實作。
