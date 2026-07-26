---
id: luogu-p2463
volume: lower
source_file: lower-volume
title: 洛谷 P2463 Sandy 的卡片
chapter: 9
section: '9.7'
kind: external-oj
difficulty: 4
topics: [difference-array, kmp, longest-common-substring]
prerequisites: [difference-array, kmp]
statement: 給定 N 個整數序列；若兩個等長子串可由其中一個所有元素加同一常數得到另一個，便視為相同。求所有序列皆含有的最長相同子串長度。
constraints: ['40 <= N <= 1000', '2 <= M_i <= 101', '元素介於 0 與 1864']
input_format: 第一行 N；接著 N 行先給 M_i，再給該序列的 M_i 個整數。
output_format: 輸出最大共同長度。
samples:
  - input: "2\n4 1 2 3 4\n4 7 8 9 10\n"
    output: '4'
    explanation: 第二段每個元素減六即與第一段相同；此自建邊界範例另以枚舉短序列、正規化子串後對拍。
core_knowledge: [平移不變性, 差分序列, KMP 最長匹配]
judgment: 各子串可使用不同平移常數；答案至少為 1。
hints:
  - 等長原子串只差同一常數，等價於它們的相鄰差分完全相同。
  - 第一張卡的差分串長度最多 100，可枚舉其每個起點，將後綴作為模式。
  - 對每張卡用 KMP 掃描並記錄模式前綴的最大匹配長度；所有卡的最小值加一就是此起點答案。
solution_outline: 將每張卡轉為相鄰差分。枚舉第一張差分的起點，建立該後綴的 prefix function；對其餘差分串各跑一次 KMP，取得最長匹配前綴，再對卡片取最小、對起點取最大，最後加一還原原序列長度。
proof_or_invariant: 原子串長 L 平移相同當且僅當其 L−1 個相鄰差相同。任一共同差分子串必在第一張某起點出現；固定起點時 KMP 求得每張卡可匹配該後綴前綴的最大長度，跨卡最小值恰為共同長度，枚舉所有起點不漏解。
common_errors: [忘記差分答案需加一, 只與第一張整串前綴匹配而漏掉其他起點, KMP 完整匹配後未回退造成越界]
complexity: { time: 'O(M_1 × sum(M_i))', space: 'O(sum(M_i))' }
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);/* TODO：差分後枚舉第一串起點，以 KMP 求各串最大匹配。*/return 0;}
cpp_solution: |
  #include <algorithm>
  #include <iostream>
  #include <vector>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n=0;cin>>n;vector<vector<int>> differences(static_cast<size_t>(n));for(int i=0;i<n;++i){int length=0;cin>>length;vector<int>values(static_cast<size_t>(length));for(int&value:values)cin>>value;for(int j=1;j<length;++j)differences[static_cast<size_t>(i)].push_back(values[static_cast<size_t>(j)]-values[static_cast<size_t>(j-1)]);}int best=0;const vector<int>&first=differences[0];for(size_t start=0;start<first.size();++start){vector<int>pattern(first.begin()+static_cast<ptrdiff_t>(start),first.end());vector<int>prefix(pattern.size());for(size_t i=1;i<pattern.size();++i){int j=prefix[i-1];while(j>0&&pattern[i]!=pattern[static_cast<size_t>(j)])j=prefix[static_cast<size_t>(j-1)];if(pattern[i]==pattern[static_cast<size_t>(j)])++j;prefix[i]=j;}int common=static_cast<int>(pattern.size());for(int card=1;card<n&&common>0;++card){int matched=0,maximum=0;for(int value:differences[static_cast<size_t>(card)]){while(matched>0&&(matched==static_cast<int>(pattern.size())||value!=pattern[static_cast<size_t>(matched)]))matched=prefix[static_cast<size_t>(matched-1)];if(value==pattern[static_cast<size_t>(matched)])++matched;maximum=max(maximum,matched);if(matched==static_cast<int>(pattern.size()))matched=prefix[static_cast<size_t>(matched-1)];}common=min(common,maximum);}best=max(best,common);}cout<<best+1<<'\n';}
external_url: https://www.luogu.com.cn/problem/P2463
external_platform: 洛谷
external_problem_id: P2463
external_title: '[SDOI2008] Sandy 的卡片'
external_relation: original
source_book_pages: [587, 595]
source_pdf_pages: [217, 225]
review_status: verified
---

「整段加常數」消去後就是差分相等；短模式配合 KMP 已足以避免大型廣義 SA。
