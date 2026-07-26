---
id: luogu-p4824
volume: lower
source_file: lower-volume
title: 洛谷 P4824 Censoring S
chapter: 9
section: '9.5'
kind: external-oj
difficulty: 4
topics: [kmp, stack, online-deletion]
prerequisites: [kmp, string]
statement: '逐字讀取文本；每當目前字串尾端等於模式串就立刻刪除，輸出最終字串。'
constraints:
  - '兩字串只含小寫字母'
  - '文本長度不超過 10^6'
  - '模式非空'
input_format: '第一行文本，第二行模式。'
output_format: '輸出反覆刪除後字串。'
samples:
  - input: "whatthemomooofun\nmoo\n"
    output: 'whatthefun'
    explanation: '掃到 moo 時刪除，刪除後的新尾端繼續保留其匹配狀態。'
core_knowledge:
  - 'kmp'
  - 'stack'
  - 'online-deletion'
judgment: '輸出反覆刪除後字串。'
hints:
  - '刪除只發生在目前尾端，適合用堆疊保存結果。'
  - '為堆疊每個位置同步保存它結尾時的 KMP 匹配長度。'
  - '匹配完整模式時同時彈掉 m 個字元與 m 個狀態，舊尾狀態立即恢復。'
solution_outline: 'KMP 掃描並把字元、matched 壓棧；matched=m 時縮短兩棧 m。'
proof_or_invariant: '兩棧不變量是字元棧等於已處理前綴的刪除結果，狀態棧頂等於其最長模式前綴後綴；刪除與題意同步，故最終正確。'
common_errors:
  - '只刪一次而未處理刪除後形成的新匹配'
  - '彈字元卻未恢復 KMP 狀態'
  - '用反覆 find 退化成平方'
complexity:
  time: 'O(n+m)'
  space: 'O(n+m)'
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);/* TODO：依提示完成核心演算法。*/return 0;}
cpp_solution: |
  #include <iostream>
  #include <string>
  #include <vector>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);string text,p;cin>>text>>p;vector<int> pi(p.size());for(size_t i=1;i<p.size();++i){int j=pi[i-1];while(j>0&&p[i]!=p[static_cast<size_t>(j)])j=pi[static_cast<size_t>(j-1)];if(p[i]==p[static_cast<size_t>(j)])++j;pi[i]=j;}string out;vector<int> state;for(char c:text){int j=state.empty()?0:state.back();while(j>0&&c!=p[static_cast<size_t>(j)])j=pi[static_cast<size_t>(j-1)];if(c==p[static_cast<size_t>(j)])++j;out.push_back(c);state.push_back(j);if(j==static_cast<int>(p.size())){out.resize(out.size()-p.size());state.resize(state.size()-p.size());}}cout<<out<<'\n';}
external_url: https://www.luogu.com.cn/problem/P4824
external_platform: 洛谷
external_problem_id: 'P4824'
external_title: '[USACO15FEB] Censoring S'
external_relation: original
source_book_pages: [575, 595]
source_pdf_pages: [205, 225]
review_status: verified
---

以線性字串結構重用已知前後綴資訊，避免重新比較。
