---
id: openj-bailian-2481
volume: upper
source_file: upper-volume
title: OpenJudge 百練 2481 Cows：區間包含計數
chapter: 4
section: '4.2'
kind: external-oj
difficulty: 4
topics: &id001
  - offline-sorting
  - fenwick-tree
  - dominance-counting
prerequisites:
  - fenwick-tree
statement: 每頭牛偏好閉區間 [S,E]；嚴格更長且完整包含另一區間者較強。求每頭牛被多少較強牛包含。
constraints:
  - 1 <= N <= 100000
  - 0 <= S < E <= 100000
  - N=0 結束
input_format: 多組資料，每組 N 後接 N 個 S E。
output_format: 依原順序輸出每頭牛的較強者數。
samples:
  - input: |
      3
      1 2
      0 3
      3 4
      0
    output: |
      1 0 0
    explanation: '[0,3] 完整且嚴格包含 [1,2]。'
core_knowledge: *id001
judgment: 排序後以 BIT 統計已處理右端點中嚴格更大的數量。
hints:
  - 先按左端點升序，使已處理區間不晚於目前起點。
  - 同左端點時右端點降序，查詢已出現的 E 不小於目前 E。
  - 完全相同區間不算嚴格更強，需整組先查後更新。
solution_outline: 排序後以 BIT 統計已處理右端點中嚴格更大的數量。
proof_or_invariant: 排序保證候選 S 較小；BIT 的 E 篩選保證右端覆蓋；相同區間分組排除等長情況，條件充要。
common_errors:
  - 索引基準或閉區間端點處理錯誤
  - 更新資料結構後忘記同步原始狀態
  - 使用 32 位元儲存可能溢位的計數或總和
complexity:
  time: O(n log n)
  space: O(n+座標範圍)
cpp_skeleton:
  "// TODO：先依三階段提示自行完成核心；以下框架可嚴格編譯。\n#include <bits/stdc++.h>\nusing namespace std;\nclass Fenwick{public:explicit\
  \ Fenwick(int n):t(static_cast<size_t>(n+1)){}void add(int x,int v){for(int i=x;i<static_cast<int>(t.size());i+=i&-i)t[static_cast<size_t>(i)]+=v;}long\
  \ long sum(int x)const{long long s=0;for(int i=x;i>0;i-=i&-i)s+=t[static_cast<size_t>(i)];return s;}private:vector<long\
  \ long>t;};\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;while(cin>>n&&n!=0){struct Cow{int s,e,id;};vector<Cow>a(static_cast<size_t>(n));for(int\
  \ i=0;i<n;++i){cin>>a[static_cast<size_t>(i)].s>>a[static_cast<size_t>(i)].e;a[static_cast<size_t>(i)].id=i;}sort(a.begin(),a.end(),[](const\
  \ Cow&x,const Cow&y){return x.s!=y.s?x.s<y.s:x.e>y.e;});Fenwick bit(100002);vector<long long>ans(static_cast<size_t>(n));for(int\
  \ i=0;i<n;){int j=i;while(j<n&&a[static_cast<size_t>(j)].s==a[static_cast<size_t>(i)].s&&a[static_cast<size_t>(j)].e==a[static_cast<size_t>(i)].e)++j;long\
  \ long stronger=bit.sum(100001)-bit.sum(a[static_cast<size_t>(i)].e);for(int k=i;k<j;++k)ans[static_cast<size_t>(a[static_cast<size_t>(k)].id)]=stronger;for(int\
  \ k=i;k<j;++k)bit.add(a[static_cast<size_t>(k)].e+1,1);i=j;}for(int i=0;i<n;++i){if(i>0)cout<<' ';cout<<ans[static_cast<size_t>(i)];}cout<<'\\n';}}\n"
cpp_solution:
  "#include <bits/stdc++.h>\nusing namespace std;\nclass Fenwick{public:explicit Fenwick(int n):t(static_cast<size_t>(n+1)){}void\
  \ add(int x,int v){for(int i=x;i<static_cast<int>(t.size());i+=i&-i)t[static_cast<size_t>(i)]+=v;}long long sum(int x)const{long\
  \ long s=0;for(int i=x;i>0;i-=i&-i)s+=t[static_cast<size_t>(i)];return s;}private:vector<long long>t;};\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);int\
  \ n;while(cin>>n&&n!=0){struct Cow{int s,e,id;};vector<Cow>a(static_cast<size_t>(n));for(int i=0;i<n;++i){cin>>a[static_cast<size_t>(i)].s>>a[static_cast<size_t>(i)].e;a[static_cast<size_t>(i)].id=i;}sort(a.begin(),a.end(),[](const\
  \ Cow&x,const Cow&y){return x.s!=y.s?x.s<y.s:x.e>y.e;});Fenwick bit(100002);vector<long long>ans(static_cast<size_t>(n));for(int\
  \ i=0;i<n;){int j=i;while(j<n&&a[static_cast<size_t>(j)].s==a[static_cast<size_t>(i)].s&&a[static_cast<size_t>(j)].e==a[static_cast<size_t>(i)].e)++j;long\
  \ long stronger=bit.sum(100001)-bit.sum(a[static_cast<size_t>(i)].e);for(int k=i;k<j;++k)ans[static_cast<size_t>(a[static_cast<size_t>(k)].id)]=stronger;for(int\
  \ k=i;k<j;++k)bit.add(a[static_cast<size_t>(k)].e+1,1);i=j;}for(int i=0;i<n;++i){if(i>0)cout<<' ';cout<<ans[static_cast<size_t>(i)];}cout<<'\\n';}}\n"
external_url: http://bailian.openjudge.cn/practice/2481/
external_platform: OpenJ_Bailian
external_problem_id: '2481'
external_title: OpenJudge 百練 2481 Cows
external_relation: original
source_book_pages:
  - 151
  - 170
source_pdf_pages:
  - 169
  - 188
review_status: verified
---

本卡片依外部題面與限制獨立整理。
