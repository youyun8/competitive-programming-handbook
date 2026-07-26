---
id: luogu-p3960
volume: upper
source_file: upper-volume
title: 洛谷 P3960 [NOIP2017] 列隊
chapter: 4
section: '4.2'
kind: external-oj
difficulty: 5
topics: &id001
  - dynamic-segment-tree
  - order-statistics
  - implicit-sequences
prerequisites:
  - fenwick-tree
statement: n×m 方陣依序編號；每次 (x,y) 學生離隊，該行左移、末列上移，離隊者補到右下角。輸出離隊者原編號。
constraints:
  - n,m,q <= 300000
  - 編號需 64 位元
input_format: 輸入 n m q，再給 q 個 x y。
output_format: 每次輸出當時 (x,y) 的學生編號。
samples:
  - input: |
      2 3 3
      1 2
      2 3
      1 3
    output: |
      2
      2
      6
    explanation: 依規則模擬兩條序列的刪除與尾插。
core_knowledge: *id001
judgment: 每條序列以動態線段樹記刪除位置，額外向量記尾插值。
hints:
  - 把每行前 m-1 格與最後一列拆成 n+1 條序列。
  - 事件是行序列刪第 y、末列刪第 x，再各自尾插。
  - 初始連續值可由位置公式取得，只為刪除標記動態開節點。
solution_outline: 每條序列以動態線段樹記刪除位置，額外向量記尾插值。
proof_or_invariant: 分解後左移與上移恰等價於兩次序列刪除及尾插；第 k 個未刪位置由節點刪除數精確定位。
common_errors:
  - 索引或閉區間邊界處理錯誤
  - 離線排序後遺失原詢問順序
  - 計數或乘積未使用 long long
complexity:
  time: O(q log(max(n,m)+q))
  space: O(n+q log(max(n,m)+q))
cpp_skeleton: |
  // TODO：依提示補完核心資料結構。
  #include <bits/stdc++.h>
  using namespace std;
  struct Node{int left=0,right=0,deleted=0;};static vector<Node>nodes(1);static int remove_kth(int&root,int l,int r,int current_len,int k){if(root==0){root=static_cast<int>(nodes.size());nodes.push_back(Node{});}const int node=root;if(l==r){++nodes[static_cast<size_t>(node)].deleted;return l;}int mid=(l+r)/2;int left=nodes[static_cast<size_t>(node)].left;int right=nodes[static_cast<size_t>(node)].right;int left_total=max(0,min(mid,current_len)-l+1);int left_deleted=nodes[static_cast<size_t>(left)].deleted;int pos;if(k<=left_total-left_deleted){pos=remove_kth(left,l,mid,current_len,k);nodes[static_cast<size_t>(node)].left=left;}else{pos=remove_kth(right,mid+1,r,current_len,k-(left_total-left_deleted));nodes[static_cast<size_t>(node)].right=right;}nodes[static_cast<size_t>(node)].deleted=nodes[static_cast<size_t>(left)].deleted+nodes[static_cast<size_t>(right)].deleted;return pos;}
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m,q;cin>>n>>m>>q;int limit=max(n,m)+q+2;vector<int>roots(static_cast<size_t>(n+1)),row_len(static_cast<size_t>(n+1),m-1);vector<vector<long long>>extra(static_cast<size_t>(n+1));int column_root=0,column_len=n;vector<long long>column_extra;auto pop_row=[&](int row,int k){int pos=remove_kth(roots[static_cast<size_t>(row)],1,limit,row_len[static_cast<size_t>(row)],k);return pos<m?static_cast<long long>(row-1)*m+pos:extra[static_cast<size_t>(row)][static_cast<size_t>(pos-(m-1)-1)];};auto pop_column=[&](int k){int pos=remove_kth(column_root,1,limit,column_len,k);return pos<=n?static_cast<long long>(pos)*m:column_extra[static_cast<size_t>(pos-n-1)];};while(q--){int x,y;cin>>x>>y;long long answer;if(y==m){answer=pop_column(x);column_extra.push_back(answer);++column_len;}else{answer=pop_row(x,y);long long moved=pop_column(x);extra[static_cast<size_t>(x)].push_back(moved);++row_len[static_cast<size_t>(x)];column_extra.push_back(answer);++column_len;}cout<<answer<<'\n';}}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  struct Node{int left=0,right=0,deleted=0;};static vector<Node>nodes(1);static int remove_kth(int&root,int l,int r,int current_len,int k){if(root==0){root=static_cast<int>(nodes.size());nodes.push_back(Node{});}const int node=root;if(l==r){++nodes[static_cast<size_t>(node)].deleted;return l;}int mid=(l+r)/2;int left=nodes[static_cast<size_t>(node)].left;int right=nodes[static_cast<size_t>(node)].right;int left_total=max(0,min(mid,current_len)-l+1);int left_deleted=nodes[static_cast<size_t>(left)].deleted;int pos;if(k<=left_total-left_deleted){pos=remove_kth(left,l,mid,current_len,k);nodes[static_cast<size_t>(node)].left=left;}else{pos=remove_kth(right,mid+1,r,current_len,k-(left_total-left_deleted));nodes[static_cast<size_t>(node)].right=right;}nodes[static_cast<size_t>(node)].deleted=nodes[static_cast<size_t>(left)].deleted+nodes[static_cast<size_t>(right)].deleted;return pos;}
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m,q;cin>>n>>m>>q;int limit=max(n,m)+q+2;vector<int>roots(static_cast<size_t>(n+1)),row_len(static_cast<size_t>(n+1),m-1);vector<vector<long long>>extra(static_cast<size_t>(n+1));int column_root=0,column_len=n;vector<long long>column_extra;auto pop_row=[&](int row,int k){int pos=remove_kth(roots[static_cast<size_t>(row)],1,limit,row_len[static_cast<size_t>(row)],k);return pos<m?static_cast<long long>(row-1)*m+pos:extra[static_cast<size_t>(row)][static_cast<size_t>(pos-(m-1)-1)];};auto pop_column=[&](int k){int pos=remove_kth(column_root,1,limit,column_len,k);return pos<=n?static_cast<long long>(pos)*m:column_extra[static_cast<size_t>(pos-n-1)];};while(q--){int x,y;cin>>x>>y;long long answer;if(y==m){answer=pop_column(x);column_extra.push_back(answer);++column_len;}else{answer=pop_row(x,y);long long moved=pop_column(x);extra[static_cast<size_t>(x)].push_back(moved);++row_len[static_cast<size_t>(x)];column_extra.push_back(answer);++column_len;}cout<<answer<<'\n';}}
external_url: https://www.luogu.com.cn/problem/P3960
external_platform: Luogu
external_problem_id: P3960
external_title: 洛谷 P3960 [NOIP2017] 列隊
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
