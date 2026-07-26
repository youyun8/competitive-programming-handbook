---
id: openjudge-1010
volume: upper
source_file: upper-volume
title: OpenJudge 百練 1010 STAMPS
chapter: 3
section: '3.2'
kind: external-oj
difficulty: 3
topics: [dfs, enumeration, lexicographic-ranking]
prerequisites: [backtracking]
statement: 給定至多 25 種郵票面值（相同面值的不同輸入項仍是不同種類）與多個需求值。每次至多選四張，依序最大化種類數、最小化張數、最大化單張面值；排名仍相同但方案不同時判 tie。
constraints: [每套郵票種類數至多 25, 每次至多使用四張, 正整數序列皆以 0 結束且成對讀到 EOF]
input_format: 每套資料兩行；第一行為郵票種類面值，第二行為顧客需求，兩行各以 0 結束。
output_format: '對每個需求輸出 `需求 (種類數): 面值...`；無解輸出 `需求 ---- none`；最優方案不唯一輸出 `需求 (種類數): tie`。'
samples:
  - input: "1 2 3 0\n7 4 0\n1 1 0\n6 2 3 0\n"
    output: "7 (3): 1 1 2 3\n4 (2): 1 3\n6 ---- none\n2 (2): 1 1\n3 (2): tie"
    explanation: 先比較種類數，再依張數與最大面值決勝；需求 3 最後仍有兩個最優種類方案。
core_knowledge: [可重複組合枚舉, 多層比較鍵, 最優解唯一性]
judgment: 同面值的兩個輸入項是不同種類；tie 判定發生在三層評分全相同且存在不同選擇方案時。
hints:
  - 把每個輸入位置視為一種郵票，DFS 的種類下標採非遞減順序即可不重複枚舉排列。
  - 深度 1 到 4 每次總和等於需求時，以 `(種類數,-張數,最大面值)` 比較。
  - 評分相同時標記 tie；出現更佳評分時覆蓋答案並清除 tie。
solution_outline: 對每個需求枚舉所有長度至多四的可重複種類組合，維護三層排名與是否有另一個同排名方案，最後按固定格式輸出。
proof_or_invariant: 任一至多四張的配置把種類下標排序後，恰被非遞減 DFS 枚舉一次。比較鍵完全按照題目優先級，因此保存者正是最優評分；同評分方案數至少二時且僅此時輸出 tie。
complexity: { time: '每個需求 O(K^4)', space: 'O(4)' }
common_errors: [把相同面值合併成一種, 先比較最大面值而非張數, 把不同排列誤判為 tie]
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main() { /* TODO：逐需求枚舉至多四張的非遞減種類下標。 */ }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  struct Answer{int types=-1,count=0,largest=0;bool tie=false;vector<int> values;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int first;while(cin>>first){vector<int> stamp{first};int x;while(cin>>x&&x)stamp.push_back(x);sort(stamp.begin(),stamp.end());vector<int> request;while(cin>>x&&x)request.push_back(x);for(int need:request){Answer best;vector<int> chosen;function<void(int,int)> dfs=[&](int begin,int sum){if(sum==need&&!chosen.empty()){set<int> kinds(chosen.begin(),chosen.end());int type_count=static_cast<int>(kinds.size()),count=static_cast<int>(chosen.size()),largest=stamp[chosen.back()];tuple<int,int,int> score{type_count,-count,largest},old{best.types,-best.count,best.largest};if(best.types<0||score>old){best={type_count,count,largest,false,{}};for(int id:chosen)best.values.push_back(stamp[id]);}else if(score==old)best.tie=true;}if(chosen.size()==4||sum>=need)return;for(int i=begin;i<(int)stamp.size();++i){chosen.push_back(i);dfs(i,sum+stamp[i]);chosen.pop_back();}};dfs(0,0);cout<<need;if(best.types<0){cout<<" ---- none\n";continue;}cout<<" ("<<best.types<<"):";if(best.tie){cout<<" tie\n";continue;}for(int value:best.values)cout<<' '<<value;cout<<'\n';}}}
external_url: http://bailian.openjudge.cn/practice/1010/
external_platform: OpenJudge 百練
external_problem_id: '1010'
external_title: STAMPS
external_relation: original
source_book_pages: [120]
source_pdf_pages: [138]
review_status: verified
---

種類由輸入項而非面值決定；這也是重複面值不能先去重的原因。
