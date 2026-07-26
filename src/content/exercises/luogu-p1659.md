---
id: luogu-p1659
volume: lower
source_file: lower-volume
title: 洛谷 P1659 拉拉隊排練
chapter: 9
section: '9.2'
kind: external-oj
difficulty: 4
topics: [manacher, counting, fast-power]
prerequisites: [palindrome, modular-exponentiation]
statement: 列出字串所有奇數長度迴文子串（區間不同即分開），按長度遞減取前 K 個，求其長度乘積 modulo 19930726；不足 K 個輸出 -1。
constraints: ['1 <= n <= 10^6', '1 <= K <= 10^12', 字串只含小寫英文字母]
input_format: 第一行 n K，第二行長度 n 的字串。
output_format: 輸出乘積餘數；奇長迴文總數小於 K 時輸出 -1。
samples:
  - input: "5 3\nababa\n"
    output: '45'
    explanation: 最長三個奇長迴文是長 5 的 ababa，以及兩個長 3 的 aba、bab，乘積 5*3*3=45。
core_knowledge: [奇中心 Manacher, 半徑差分統計各長度數量, 模快速冪批次乘相同長度]
judgment: 只計奇數長度；內容相同但區間不同仍是不同群體，K 可達 10^12。
hints:
  - Manacher 求得中心最大奇迴文長度 L，便代表該中心也有 L-2、L-4…等所有較短迴文。
  - 先記每個中心的最大長度，再由大到小每隔 2 做後綴累加，得到每種長度的區間數。
  - 從最大奇數長度往下取，對同長的 count 個以快速冪一次乘入，直到取滿 K。
solution_outline: 求奇 Manacher 半徑，把每中心最大長度計入 exact；由大到小 exact[len]+=exact[len+2]。再降序取 min(K,exact[len]) 個，以 pow_mod(len,take) 乘入答案。
proof_or_invariant: 每個中心的奇迴文長度恰為 1,3,…,L，因此逆向隔二累加後 count[len] 正是長度至少 len、亦即存在長 len 迴文的中心數。按 len 降序取用正好模擬排序後前 K 個；快速冪僅批次計算相同因子，不改變乘積。
common_errors: [把偶數長度也計入, K 與計數使用 32 位整數, count 只記最大迴文而未向短長度累加]
complexity: { time: O(n + log K), space: O(n) }
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n=0;long long k=0;cin>>n>>k;/* TODO：奇 Manacher、長度計數、快速冪。*/(void)n;(void)k;}
cpp_solution: |
  #include <algorithm>
  #include <iostream>
  #include <string>
  #include <vector>
  using namespace std;
  static long long power_mod(long long base,long long exponent){constexpr long long mod=19930726;long long result=1;while(exponent>0){if((exponent&1LL)!=0)result=result*base%mod;base=base*base%mod;exponent>>=1;}return result;}
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n=0;long long k=0;string s;cin>>n>>k>>s;vector<int> radius(static_cast<size_t>(n));vector<long long> count(static_cast<size_t>(n+2),0);int left=0,right=-1;for(int i=0;i<n;++i){int length=i>right?1:min(radius[static_cast<size_t>(left+right-i)],right-i+1);while(i-length>=0&&i+length<n&&s[static_cast<size_t>(i-length)]==s[static_cast<size_t>(i+length)])++length;radius[static_cast<size_t>(i)]=length;int palindrome_length=2*length-1;++count[static_cast<size_t>(palindrome_length)];if(i+length-1>right){left=i-length+1;right=i+length-1;}}for(int length=(n%2==0?n-1:n);length>=1;length-=2)if(length+2<=n)count[static_cast<size_t>(length)]+=count[static_cast<size_t>(length+2)];long long answer=1;for(int length=(n%2==0?n-1:n);length>=1&&k>0;length-=2){long long take=min(k,count[static_cast<size_t>(length)]);answer=answer*power_mod(length,take)%19930726;k-=take;}cout<<(k==0?answer:-1)<<'\n';}
external_url: https://www.luogu.com.cn/problem/P1659
external_platform: 洛谷
external_problem_id: P1659
external_title: '[國家集訓隊] 拉拉隊排練'
external_relation: original
source_book_pages: [580, 595]
source_pdf_pages: [210, 225]
review_status: verified
---

Manacher 給每個中心的最大半徑，隔二後綴和把它展開成所有奇數長度的數量分布。
