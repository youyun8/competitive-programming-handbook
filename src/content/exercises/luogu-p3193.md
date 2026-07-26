---
id: luogu-p3193
volume: lower
source_file: lower-volume
title: 洛谷 P3193 GT 考試
chapter: 9
section: '9.5'
kind: external-oj
difficulty: 4
topics: [kmp-automaton, matrix-exponentiation, pattern-avoidance]
prerequisites: [kmp, string]
statement: '計算長度 n 的十進位數字串中，不含給定模式串作為連續子串者數量 modulo k。'
constraints:
  - '1 <= n <= 10^9'
  - '1 <= m <= 20'
  - '1 <= k <= 10^5'
input_format: '第一行 n m k，第二行長度 m 的數字模式。'
output_format: '輸出合法字串數 modulo k。'
samples:
  - input: "2 1 100\n1\n"
    output: '81'
    explanation: '兩位各可選除 1 外九種數字，共 81 種。'
core_knowledge:
  - 'kmp-automaton'
  - 'matrix-exponentiation'
  - 'pattern-avoidance'
judgment: '輸出合法字串數 modulo k。'
hints:
  - 'KMP matched 長度可作狀態；加入一位數後沿 pi 轉移。'
  - '轉移若到 m 代表已包含禁用模式，捨棄；其餘累加到矩陣。'
  - '長度 n 很大，計算初始狀態向量乘轉移矩陣的 n 次方。'
solution_outline: '建立 m 狀態 KMP 自動機矩陣，二進位快速冪後加總從狀態 0 可達各安全狀態。'
proof_or_invariant: '狀態精確記錄目前後綴與模式前綴的最長匹配；捨棄 m 狀態當且僅當新出現禁串。矩陣乘法組合步數，n 次方枚舉全部長 n 序列且各計一次。'
common_errors:
  - '把前導零排除但題目是數字串'
  - '保留完整匹配狀態'
  - '乘法未及時 modulo'
complexity:
  time: 'O(m^3 log n + 10m^2)'
  space: 'O(m^2)'
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);/* TODO：依提示完成核心演算法。*/return 0;}
cpp_solution: |
  #include <iostream>
  #include <string>
  #include <vector>
  using namespace std;using Matrix=vector<vector<int>>;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);long long n=0;int m=0,mod=0;string p;cin>>n>>m>>mod>>p;vector<int>pi(static_cast<size_t>(m));for(int i=1;i<m;++i){int j=pi[static_cast<size_t>(i-1)];while(j>0&&p[static_cast<size_t>(i)]!=p[static_cast<size_t>(j)])j=pi[static_cast<size_t>(j-1)];if(p[static_cast<size_t>(i)]==p[static_cast<size_t>(j)])++j;pi[static_cast<size_t>(i)]=j;}Matrix base(static_cast<size_t>(m),vector<int>(static_cast<size_t>(m)));for(int state=0;state<m;++state)for(char c='0';c<='9';++c){int j=state;while(j>0&&c!=p[static_cast<size_t>(j)])j=pi[static_cast<size_t>(j-1)];if(c==p[static_cast<size_t>(j)])++j;if(j<m)base[static_cast<size_t>(state)][static_cast<size_t>(j)]=(base[static_cast<size_t>(state)][static_cast<size_t>(j)]+1)%mod;}auto multiply=[&](const Matrix&a,const Matrix&b){Matrix c(static_cast<size_t>(m),vector<int>(static_cast<size_t>(m)));for(int i=0;i<m;++i)for(int x=0;x<m;++x)for(int j=0;j<m;++j)c[static_cast<size_t>(i)][static_cast<size_t>(j)]=static_cast<int>((c[static_cast<size_t>(i)][static_cast<size_t>(j)]+1LL*a[static_cast<size_t>(i)][static_cast<size_t>(x)]*b[static_cast<size_t>(x)][static_cast<size_t>(j)])%mod);return c;};Matrix result(static_cast<size_t>(m),vector<int>(static_cast<size_t>(m)));for(int i=0;i<m;++i)result[static_cast<size_t>(i)][static_cast<size_t>(i)]=1%mod;while(n>0){if((n&1LL)!=0)result=multiply(result,base);base=multiply(base,base);n>>=1;}int answer=0;for(int j=0;j<m;++j)answer=(answer+result[0][static_cast<size_t>(j)])%mod;cout<<answer<<'\n';}
external_url: https://www.luogu.com.cn/problem/P3193
external_platform: 洛谷
external_problem_id: 'P3193'
external_title: '[HNOI2008] GT 考試'
external_relation: original
source_book_pages: [575, 595]
source_pdf_pages: [205, 225]
review_status: verified
---

以線性字串結構重用已知前後綴資訊，避免重新比較。
