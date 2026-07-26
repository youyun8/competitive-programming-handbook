---
volume: upper
source_file: upper-volume
chapter: 3
kind: external-oj
review_status: verified
id: luogu-p5440
title: 洛谷 P5440 奇蹟
section: '3.1'
difficulty: 3
topics:
  - enumeration
  - primality-test
  - date
prerequisites:
  - leap-year
  - modular-arithmetic
statement: 日期以 YYYYMMDD 八位表示，年份 1 至 9999。若 DD、MMDD、YYYYMMDD
  三個整數皆為質數，稱為候選奇蹟日期。每筆輸入以 `-` 表示未知位，求符合樣式的候選日期數。
constraints:
  - 日期必須真實存在，年份範圍 0001 至 9999
  - 輸入是八字元，由數字與 `-` 組成
  - 有多組查詢
input_format: 第一行查詢數 T；其後 T 行各一個八位日期樣式。
output_format: 每筆查詢輸出符合的日期數。
samples:
  - input: |
      2
      53-7-3-7
      20190629
    output: |-
      6
      0
    explanation: 第一個樣式有六個日期同時通過三層質數條件；20190629 的三層條件未全數成立。
core_knowledge:
  - 合法日期枚舉
  - 確定性 Miller–Rabin 質數測試
  - 樣式比對
judgment: 前導零屬日期格式的一部分，但質數判定使用其整數值；閏年依公曆規則。
hints:
  - 先枚舉年份、月份及該月日期，而不是對每個 `-` 展開十進位組合。
  - 先以日與月日的質數條件過濾，再檢查完整八位數。
  - 候選日期可一次預處理成字串；每個查詢只需逐位比對數字或 `-`。
solution_outline: 枚舉 1..9999 年所有合法日期，依序測 DD、MMDD、YYYYMMDD 是否為質數並保存八位字串。對每個樣式掃描候選列表計數。
proof_or_invariant: 年月日枚舉恰好產生範圍內每個真實日期一次，三次質數測試與定義等價，所以候選表不多不少。逐位比對恰實作萬用字元語意，計數即答案。
complexity:
  time: 預處理 O(D sqrt(M))，每筆 O(V*8)，D 為日期數、M 為最大八位日期值、V 為候選數
  space: O(V)
common_errors:
  - 把 00 年當合法年份
  - 二月閏日判斷錯誤
  - 只檢查完整日期是否為質數
cpp_skeleton: |-
  #include <bits/stdc++.h>
  using namespace std;
  static bool prime(int n){if(n<2)return false;for(int p:{2,3,5,7,11,13,17,19,23,29,31}){if(n==p)return true;if(n%p==0)return false;}for(int d=37;1LL*d*d<=n;d+=2)if(n%d==0)return false;return true;}
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);vector<string> valid;for(int y=1;y<=9999;++y){bool leap=(y%400==0)||(y%4==0&&y%100!=0);int days[12]={31,leap?29:28,31,30,31,30,31,31,30,31,30,31};for(int m=1;m<=12;++m)for(int d=1;d<=days[m-1];++d){if(!prime(d)||!prime(m*100+d)||!prime(y*10000+m*100+d))continue;ostringstream out;out<<setw(4)<<setfill('0')<<y<<setw(2)<<m<<setw(2)<<d;valid.push_back(out.str());}}int t;cin>>t;while(t--){string pattern;cin>>pattern;int answer=0;for(const string& date:valid){bool ok=true;for(int i=0;i<8;++i)if(pattern[i]!='-'&&pattern[i]!=date[i])ok=false;if(ok)++answer;}cout<<answer<<'\n';}}
cpp_solution: |-
  #include <bits/stdc++.h>
  using namespace std;
  static bool prime(int n){if(n<2)return false;for(int p:{2,3,5,7,11,13,17,19,23,29,31}){if(n==p)return true;if(n%p==0)return false;}for(int d=37;1LL*d*d<=n;d+=2)if(n%d==0)return false;return true;}
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);vector<string> valid;for(int y=1;y<=9999;++y){bool leap=(y%400==0)||(y%4==0&&y%100!=0);int days[12]={31,leap?29:28,31,30,31,30,31,31,30,31,30,31};for(int m=1;m<=12;++m)for(int d=1;d<=days[m-1];++d){if(!prime(d)||!prime(m*100+d)||!prime(y*10000+m*100+d))continue;ostringstream out;out<<setw(4)<<setfill('0')<<y<<setw(2)<<m<<setw(2)<<d;valid.push_back(out.str());}}int t;cin>>t;while(t--){string pattern;cin>>pattern;int answer=0;for(const string& date:valid){bool ok=true;for(int i=0;i<8;++i)if(pattern[i]!='-'&&pattern[i]!=date[i])ok=false;if(ok)++answer;}cout<<answer<<'\n';}}
external_url: https://www.luogu.com.cn/problem/P5440
external_platform: 洛谷
external_problem_id: P5440
external_title: 奇蹟
external_relation: original
source_book_pages:
  - 109
source_pdf_pages:
  - 127
---

本卡片依官方題面重述，解法與程式為獨立撰寫。
