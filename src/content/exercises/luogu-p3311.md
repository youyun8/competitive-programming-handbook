---
id: luogu-p3311
volume: lower
source_file: lower-volume
title: 洛谷 P3311 數數
chapter: 9
section: '9.6'
kind: external-oj
difficulty: 5
topics: [aho-corasick, digit-dp, forbidden-substrings]
prerequisites: [ac-automaton, digit-dp]
statement: 稱正整數為幸運數，當且僅當其十進位表示不含任何給定數字串；求不大於巨大整數 N 的幸運數數量 modulo 1000000007。
constraints: ['1 <= N < 10^1201', '1 <= m <= 100', '模式總長不超過 1500，模式可有前導零']
input_format: 第一行十進位整數 N，第二行 m，接著 m 行禁用數字串。
output_format: 輸出不大於 N 的幸運正整數數量 modulo 1000000007。
samples:
  - input: "20\n6\n3\n13\n2\n12\n20\n14\n"
    output: '14'
    explanation: 1 到 20 中排除 2、3、12、13、14、20 共六個；另以枚舉小 N 的十進位字串對拍。
core_knowledge: [數字 AC 自動機, 前導零, 卡上界 DP]
judgment: 只計正整數；前導零不屬於數的十進位表示，因此不能觸發以零開頭的禁串。
hints:
  - 對禁串建十字元 AC，沿 fail 傳遞危險標記。
  - DP 還需記 tight 與 started；尚未開始時填零應停在根且不匹配。
  - 已開始後每填一位沿 AC 轉移，若到危險狀態就捨棄；末尾只加總 started=true。
solution_outline: 建數字 AC 自動機。由最高位到最低位做滾動數位 DP，狀態為上界限制、是否已出現非前導零及 AC 節點；依可填數字轉移，排除危險節點，最後加總所有已開始狀態。
proof_or_invariant: DP 每個狀態一一對應 N 的某個合法前綴；tight 精確維持不超上界，started 使前導零不進自動機，而 AC 節點完整記錄已開始部分的禁串後綴。故所有且僅有合法正整數在末層各出現一次。
common_errors: [讓前導零進入 AC 而誤判 0233, 漏傳 fail 的危險標記, 把全前導零狀態當成數字零計入]
complexity: { time: 'O(|N|×S×10)', space: 'O(S)' }
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);/* TODO：數字 AC 上做含 tight/started 的數位 DP。*/return 0;}
cpp_solution: |
  #include <array>
  #include <iostream>
  #include <queue>
  #include <string>
  #include <vector>
  using namespace std;
  constexpr int mod=1000000007;
  struct Node{array<int,10> next{};int fail=0;bool bad=false;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);string bound;int m=0;cin>>bound>>m;vector<Node>a(1);while(m--){string s;cin>>s;int u=0;for(char ch:s){size_t c=static_cast<size_t>(ch-'0');if(a[static_cast<size_t>(u)].next[c]==0){a[static_cast<size_t>(u)].next[c]=static_cast<int>(a.size());a.push_back({});}u=a[static_cast<size_t>(u)].next[c];}a[static_cast<size_t>(u)].bad=true;}queue<int>q;for(size_t c=0;c<10;++c)if(a[0].next[c]!=0)q.push(a[0].next[c]);while(!q.empty()){int u=q.front();q.pop();a[static_cast<size_t>(u)].bad=a[static_cast<size_t>(u)].bad||a[static_cast<size_t>(a[static_cast<size_t>(u)].fail)].bad;for(size_t c=0;c<10;++c){int&v=a[static_cast<size_t>(u)].next[c];if(v!=0){a[static_cast<size_t>(v)].fail=a[static_cast<size_t>(a[static_cast<size_t>(u)].fail)].next[c];q.push(v);}else v=a[static_cast<size_t>(a[static_cast<size_t>(u)].fail)].next[c];}}using Layer=array<vector<int>,4>;Layer dp,next;for(auto&v:dp)v.assign(a.size(),0);for(auto&v:next)v.assign(a.size(),0);dp[2][0]=1;for(char bound_digit:bound){for(auto&v:next)fill(v.begin(),v.end(),0);for(int flags=0;flags<4;++flags)for(size_t u=0;u<a.size();++u)if(dp[static_cast<size_t>(flags)][u]!=0){bool tight=(flags&2)!=0,started=(flags&1)!=0;int limit=tight?bound_digit-'0':9;for(int digit=0;digit<=limit;++digit){bool next_tight=tight&&digit==limit;bool next_started=started||digit!=0;size_t v=next_started?static_cast<size_t>(a[u].next[static_cast<size_t>(digit)]):0U;if(next_started&&a[v].bad)continue;size_t nf=static_cast<size_t>((next_tight?2:0)|(next_started?1:0));next[nf][v]=(next[nf][v]+dp[static_cast<size_t>(flags)][u])%mod;}}dp.swap(next);}int answer=0;for(int tight=0;tight<2;++tight)for(int value:dp[static_cast<size_t>(tight*2+1)])answer=(answer+value)%mod;cout<<answer<<'\n';}
external_url: https://www.luogu.com.cn/problem/P3311
external_platform: 洛谷
external_problem_id: P3311
external_title: '[SDOI2014] 數數'
external_relation: original
source_book_pages: [579, 586]
source_pdf_pages: [209, 216]
review_status: verified
---

前導零不是字串的一部分；把「尚未開始」獨立成狀態是本題正確性的核心。
