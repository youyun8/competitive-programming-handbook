---
volume: upper
source_file: upper-volume
chapter: 3
kind: external-oj
review_status: verified
id: openjudge-1426
title: OpenJudge 百練 1426 Find The Multiple
section: '3.1'
difficulty: 2
topics:
  - breadth-first-search
  - modular-arithmetic
prerequisites:
  - queue
  - remainder
statement: 對每個 1..200 的 n，找一個非零倍數，其十進位只含 0 與 1，且不超過 100 位；多解任一即可。
constraints:
  - 1 <= n <= 200
  - 保證存在不超過 100 位的答案
  - 輸入 0 結束
input_format: 多行 n，以 0 結束。
output_format: 每個 n 輸出一個符合條件的倍數字串。
samples:
  - input: |
      2
      6
      19
      0
    output: |-
      10
      1110
      11001
    explanation: 三個輸出都只含 0、1，並分別能被 2、6、19 整除；題目允許與官方示例不同的合法答案。
core_knowledge:
  - 餘數狀態圖
  - 父指標復原字串
judgment: 答案可能超出整數型別，必須以字串復原；首位不可為 0。
hints:
  - 不保存整個巨大數，只保存它除以 n 的餘數。
  - 從餘數 1%n 出發，附加 0 或 1 後新餘數為 (r*10+d)%n。
  - BFS 到餘數 0 後沿父餘數與所加數字反向復原。
solution_outline: 對 n 個餘數做 BFS，每個餘數只造訪一次並記錄父餘數與末位數字；到 0 復原。
proof_or_invariant: 附加一位的餘數轉移精確等價於十進位構造。BFS 枚舉所有由 1 開頭的 01 字串且不重複餘數；到餘數 0 即為倍數，父鏈還原出合法字串。
complexity:
  time: 每組 O(n)
  space: O(n)
common_errors:
  - 用 long long 儲存最多百位答案
  - 允許答案以 0 開頭
  - 沒有餘數判重
cpp_skeleton: |-
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;while(cin>>n&&n){vector<int>parent(n,-2),digit(n);queue<int>q;int start=1%n;parent[start]=-1;digit[start]=1;q.push(start);while(parent[0]==-2){int r=q.front();q.pop();for(int d=0;d<=1;++d){int nr=(r*10+d)%n;if(parent[nr]!=-2)continue;parent[nr]=r;digit[nr]=d;q.push(nr);}}string answer;for(int r=0;r!=-1;r=parent[r])answer.push_back(static_cast<char>('0'+digit[r]));reverse(answer.begin(),answer.end());cout<<answer<<'\n';}}
cpp_solution: |-
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;while(cin>>n&&n){vector<int>parent(n,-2),digit(n);queue<int>q;int start=1%n;parent[start]=-1;digit[start]=1;q.push(start);while(parent[0]==-2){int r=q.front();q.pop();for(int d=0;d<=1;++d){int nr=(r*10+d)%n;if(parent[nr]!=-2)continue;parent[nr]=r;digit[nr]=d;q.push(nr);}}string answer;for(int r=0;r!=-1;r=parent[r])answer.push_back(static_cast<char>('0'+digit[r]));reverse(answer.begin(),answer.end());cout<<answer<<'\n';}}
external_url: http://bailian.openjudge.cn/practice/1426/
external_platform: OpenJudge 百練
external_problem_id: '1426'
external_title: OpenJudge 百練 1426 Find The Multiple
external_relation: original
source_book_pages:
  - 109
source_pdf_pages:
  - 127
---

本卡片依官方題面重述，解法與程式為獨立撰寫。
