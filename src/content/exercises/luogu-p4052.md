---
id: luogu-p4052
volume: lower
source_file: lower-volume
title: 洛谷 P4052 文本生成器
chapter: 9
section: '9.6'
kind: external-oj
difficulty: 4
topics: [aho-corasick, dynamic-programming, complement-counting]
prerequisites: [ac-automaton, dynamic-programming]
statement: 求長度恰為 m 的大寫字母字串中，至少包含一個給定單詞者的數量，答案 modulo 10007。
constraints: ['1 <= n <= 60', '1 <= m <= 100', '單詞長度 <= 100且只含大寫字母']
input_format: 第一行 n、m，接著 n 行單詞。
output_format: 輸出可讀文本數 modulo 10007。
samples:
  - input: "2 2\nA\nB\n"
    output: '100'
    explanation: 全部 676 個二字串扣除只用其餘 24 字母的 576 個；另以枚舉小字母表短串對拍。
core_knowledge: [AC 安全狀態, 線性 DP, 補集]
judgment: 字串只要至少命中一個單詞即計一次，重疊或多次命中不重複增加方案數。
hints:
  - 沿 fail 傳遞終點標記，任何命中狀態都不能屬於「完全不可讀」路徑。
  - dp[len][state] 計數尚未命中任何單詞的字串。
  - 答案是 26^m 減去所有安全終態方案數。
solution_outline: 建 AC 並標記所有含模式後綴的危險狀態。從根做 m 輪 DP，只允許轉入安全狀態；最後用快速冪得到總字串數並減去安全方案總和。
proof_or_invariant: DP 保持「目前前綴未含任何單詞且自動機狀態正確」；完整轉移枚舉所有安全字串恰一次。其與至少命中一詞的字串構成全集的不交劃分，補集相減即答案。
common_errors: [漏傳 fail 終點標記, 直接把命中次數相加造成重複計數, 負數取模未正規化]
complexity: { time: 'O((模式總長+m×節點數)×26)', space: 'O(節點數×26)' }
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);/* TODO：AC 安全狀態 DP 後取補集。*/return 0;}
cpp_solution: |
  #include <array>
  #include <iostream>
  #include <queue>
  #include <string>
  #include <vector>
  using namespace std;
  constexpr int mod=10007;
  struct Node{array<int,26> next{};int fail=0;bool bad=false;};
  static int power(int a,int e){int r=1;while(e>0){if((e&1)!=0)r=r*a%mod;a=a*a%mod;e>>=1;}return r;}
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n=0,m=0;cin>>n>>m;vector<Node>a(1);while(n--){string s;cin>>s;int u=0;for(char ch:s){size_t c=static_cast<size_t>(ch-'A');if(a[static_cast<size_t>(u)].next[c]==0){a[static_cast<size_t>(u)].next[c]=static_cast<int>(a.size());a.push_back({});}u=a[static_cast<size_t>(u)].next[c];}a[static_cast<size_t>(u)].bad=true;}queue<int>q;for(size_t c=0;c<26;++c)if(a[0].next[c]!=0)q.push(a[0].next[c]);while(!q.empty()){int u=q.front();q.pop();a[static_cast<size_t>(u)].bad=a[static_cast<size_t>(u)].bad||a[static_cast<size_t>(a[static_cast<size_t>(u)].fail)].bad;for(size_t c=0;c<26;++c){int&v=a[static_cast<size_t>(u)].next[c];if(v!=0){a[static_cast<size_t>(v)].fail=a[static_cast<size_t>(a[static_cast<size_t>(u)].fail)].next[c];q.push(v);}else v=a[static_cast<size_t>(a[static_cast<size_t>(u)].fail)].next[c];}}vector<int>dp(a.size()),next(a.size());dp[0]=1;for(int length=0;length<m;++length){fill(next.begin(),next.end(),0);for(size_t u=0;u<a.size();++u)for(size_t c=0;c<26;++c){int v=a[u].next[c];if(!a[static_cast<size_t>(v)].bad)next[static_cast<size_t>(v)]=(next[static_cast<size_t>(v)]+dp[u])%mod;}dp.swap(next);}int safe=0;for(int value:dp)safe=(safe+value)%mod;cout<<(power(26,m)-safe+mod)%mod<<'\n';}
external_url: https://www.luogu.com.cn/problem/P4052
external_platform: 洛谷
external_problem_id: P4052
external_title: '[JSOI2007] 文本生成器'
external_relation: original
source_book_pages: [579, 586]
source_pdf_pages: [209, 216]
review_status: verified
---

「至少一個」先改數「一個都沒有」，AC 自動機上的安全路徑即可線性 DP。
