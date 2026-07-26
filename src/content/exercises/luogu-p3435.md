---
id: luogu-p3435
volume: lower
source_file: lower-volume
title: 洛谷 P3435 OKR-Periods of Words
chapter: 9
section: '9.5'
kind: external-oj
difficulty: 4
topics: [prefix-function, shortest-border, path-compression]
prerequisites: [kmp, string]
statement: '對字串每個長度至少 2 的前綴，取其最短非空 border 長度 b，累加 prefix_length-b。'
constraints:
  - '2 <= n <= 10^6'
  - '字串只含小寫字母'
input_format: '第一行 n，第二行字串。'
output_format: '輸出所有前綴貢獻總和。'
samples:
  - input: "4\naaaa\n"
    output: '6'
    explanation: '長度 2、3、4 的最短 border 都為 a，貢獻 1、2、3，合計 6。'
core_knowledge:
  - 'prefix-function'
  - 'shortest-border'
  - 'path-compression'
judgment: '輸出所有前綴貢獻總和。'
hints:
  - 'pi[i] 給最長 border，但題目需要 border 鏈底端最短的非空者。'
  - '若 shortest[pi[i]] 已知，則目前最短 border 就是它；否則是 pi[i]。'
  - '依前綴長度遞增即可 DP，累加 i-shortest[i]。'
solution_outline: '先算 pi，再對每個長度把最長 border 沿已求的 shortest 壓到最短非空 border。'
proof_or_invariant: '所有 border 恰沿 pi 鏈；遞增 DP 已知鏈上前一節點的最短 border，因此取得全鏈最短非空值，公式逐項精確。'
common_errors:
  - '直接使用最長 border'
  - '把 border 0 當可用答案'
  - '總和用 int 溢位'
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
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n=0;string s;cin>>n>>s;vector<int>pi(static_cast<size_t>(n+1)),shortest(static_cast<size_t>(n+1));long long ans=0;for(int i=2,j=0;i<=n;++i){while(j>0&&s[static_cast<size_t>(i-1)]!=s[static_cast<size_t>(j)])j=pi[static_cast<size_t>(j)];if(s[static_cast<size_t>(i-1)]==s[static_cast<size_t>(j)])++j;pi[static_cast<size_t>(i)]=j;int b=j;if(b>0&&shortest[static_cast<size_t>(b)]>0)b=shortest[static_cast<size_t>(b)];shortest[static_cast<size_t>(i)]=b;ans+=i-b;}cout<<ans<<'\n';}
external_url: https://www.luogu.com.cn/problem/P3435
external_platform: 洛谷
external_problem_id: 'P3435'
external_title: '[POI 2006] OKR-Periods of Words'
external_relation: original
source_book_pages: [575, 595]
source_pdf_pages: [205, 225]
review_status: verified
---

以線性字串結構重用已知前後綴資訊，避免重新比較。
