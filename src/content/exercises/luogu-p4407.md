---
id: luogu-p4407
volume: lower
source_file: lower-volume
title: 洛谷 P4407 電子字典
chapter: 9
section: '9.3'
kind: external-oj
difficulty: 3
topics: [string-set, edit-distance, enumeration]
prerequisites: [hash-set]
statement: 給定互異的字典單字。若查詢字本身在字典中輸出 -1，否則輸出與它編輯距離恰為 1 的字典單字數。
constraints: ['1 <= n,m <= 10000', 字典字與查詢字長度皆介於 1 與 20, 所有字串只含小寫英文字母, 字典單字互異]
input_format: 第一行 n m；接著 n 行字典單字，再接 m 行查詢字。
output_format: 每個查詢輸出一行；字本身存在為 -1，否則輸出編輯距離 1 的字典字數。
samples:
  - input: "4 3\nabcd\nabcde\naabc\nabced\nabcd\nabc\nabcdd\n"
    output: "-1\n2\n3\n"
    explanation: abcd 本身存在；abc 與 abcd、aabc 距離 1；abcdd 有三個距離 1 的字典字。
core_knowledge: [一次插入刪除替換的完整枚舉, 雜湊集合 O(1) 期望查找, 候選去重]
judgment: 若原字存在必須輸出 -1，不再計數；其餘只計不同的字典單字。
hints:
  - 長度至多 20，可以直接枚舉對查詢字做一次操作後得到的所有字串。
  - 分別枚舉刪一字、每位置替換成 25 種其他字、每縫隙插入 26 種字，再查字典集合。
  - 同一結果可能由不同操作產生，例如重複字元附近插入；用另一個集合為命中的字典字去重。
solution_outline: 以 unordered_set 保存字典。查詢先測原字；不存在時枚舉三類一次編輯，把存在字典的結果加入 matched，輸出其大小。
proof_or_invariant: Levenshtein 距離 1 的兩字必且只可能由一次刪除、插入或替換互相得到；演算法逐一枚舉全部位置與字元，因此涵蓋所有候選，matched 又只接受字典元素並去重，計數精確。
common_errors: [原字存在時仍輸出鄰居數, 替換時把原字元也算一次, 重複字元使同一候選被多次計數]
complexity: { time: O(mL^2|Sigma|) 期望時間, space: O(nL + L^2|Sigma|) }
cpp_skeleton: |
  #include <iostream>
  #include <string>
  #include <unordered_set>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n=0,m=0;cin>>n>>m;
      // TODO：保存字典，枚舉每個查詢的一次編輯候選並去重。
      (void)n;(void)m;return 0;}
cpp_solution: |
  #include <iostream>
  #include <string>
  #include <unordered_set>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n=0,m=0;cin>>n>>m;unordered_set<string> dictionary;for(int i=0;i<n;++i){string s;cin>>s;dictionary.insert(s);}
      while(m--){string s;cin>>s;if(dictionary.count(s)!=0U){cout<<-1<<'\n';continue;}unordered_set<string> matched;
          for(size_t i=0;i<s.size();++i){string candidate=s.substr(0,i)+s.substr(i+1);if(dictionary.count(candidate)!=0U)matched.insert(candidate);}
          for(size_t i=0;i<s.size();++i){string candidate=s;for(char c='a';c<='z';++c){if(c==s[i])continue;candidate[i]=c;if(dictionary.count(candidate)!=0U)matched.insert(candidate);}candidate[i]=s[i];}
          for(size_t i=0;i<=s.size();++i){for(char c='a';c<='z';++c){string candidate=s.substr(0,i)+c+s.substr(i);if(dictionary.count(candidate)!=0U)matched.insert(candidate);}}
          cout<<matched.size()<<'\n';}
  }
external_url: https://www.luogu.com.cn/problem/P4407
external_platform: 洛谷
external_problem_id: P4407
external_title: '[JSOI2009] 電子字典'
external_relation: original
source_book_pages: [554, 574]
source_pdf_pages: [184, 204]
review_status: verified
---

短字串讓「枚舉所有一次編輯結果」比在 Trie 上維護多維狀態更直接，命中集合則處理重複生成。
