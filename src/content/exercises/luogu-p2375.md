---
id: luogu-p2375
volume: lower
source_file: lower-volume
title: 洛谷 P2375 動物園
chapter: 9
section: '9.5'
kind: external-oj
difficulty: 4
topics: [prefix-function, border-count, half-limit]
prerequisites: [kmp, string]
statement: '對每個前綴，計算長度不超過其一半的非空 border 數加一，將所有結果相乘 modulo 10^9+7。'
constraints:
  - '1 <= T <= 5'
  - '字串總長受官方限制'
  - '只含小寫字母'
input_format: '第一行 T，接著每組一個字串。'
output_format: '每組輸出指定乘積 modulo 1000000007。'
samples:
  - input: "1\naaaa\n"
    output: '12'
    explanation: '四個前綴的合法 border 數加一依序為 1、2、2、3，乘積 12。'
core_knowledge:
  - 'prefix-function'
  - 'border-count'
  - 'half-limit'
judgment: '每組輸出指定乘積 modulo 1000000007。'
hints:
  - '先以 count[i]=count[pi[i]]+1 求 prefix i 的整條非空 border 鏈大小。'
  - '處理長度 i 時從 pi[i] 沿鏈回退，直到 border 長度不超過 i/2。'
  - '合法 border 都在該節點的 border 鏈上，因此乘 count[j]+1。'
solution_outline: '線性計算 pi 與 border 數；另維護受一半限制的指標，逐前綴乘答案。'
proof_or_invariant: 'pi 鏈完整列出所有 border；回退至第一個不超半長的節點後，其祖先全合法、其後代全過長，count[j] 因而是精確數目。'
common_errors:
  - '忘記加空選擇的一'
  - '半長條件寫成嚴格小於'
  - '每個前綴暴力走完整 border 鏈'
complexity:
  time: 'O(n)'
  space: 'O(n)'
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);/* TODO：依提示完成核心演算法。*/return 0;}
cpp_solution: |
  #include <iostream>
  #include <string>
  #include <vector>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int t=0;cin>>t;constexpr long long mod=1000000007;while(t--){string s;cin>>s;int n=static_cast<int>(s.size());vector<int>pi(static_cast<size_t>(n+1)),count(static_cast<size_t>(n+1));long long ans=1;for(int i=1,j=0;i<=n;++i){if(i>1){while(j>0&&s[static_cast<size_t>(i-1)]!=s[static_cast<size_t>(j)])j=pi[static_cast<size_t>(j)];if(s[static_cast<size_t>(i-1)]==s[static_cast<size_t>(j)])++j;}pi[static_cast<size_t>(i)]=j;count[static_cast<size_t>(i)]=count[static_cast<size_t>(j)]+1;int allowed=j;while(allowed*2>i)allowed=pi[static_cast<size_t>(allowed)];ans=ans*(count[static_cast<size_t>(allowed)]+1LL)%mod;}cout<<ans<<'\n';}}
external_url: https://www.luogu.com.cn/problem/P2375
external_platform: 洛谷
external_problem_id: 'P2375'
external_title: '[NOI2014] 動物園'
external_relation: original
source_book_pages: [575, 595]
source_pdf_pages: [205, 225]
review_status: verified
---

以線性字串結構重用已知前後綴資訊，避免重新比較。
