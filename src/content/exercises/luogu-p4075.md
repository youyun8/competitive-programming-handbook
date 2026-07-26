---
id: luogu-p4075
volume: upper
source_file: upper-volume
source_book_pages: [253]
source_pdf_pages: [271]
chapter: 4
section: '4.9'
kind: external-oj
review_status: verified
external_relation: original
title: 洛谷 P4075 模式字串：點分治與週期雜湊
difficulty: 5
topics: [點分治, 雙雜湊, 週期字串, 有序路徑]
prerequisites: [tree-centroid, string-hashing]
statement: 樹上每點有大寫字母。給模式串 S，統計有序節點對 (u,v)，使 u 到 v 路徑字串恰為 S 重複正整數次。
constraints:
  - '1 <= test_count <= 10'
  - 各測資 n、m 總和不超過 1000000
  - 字元皆為 A 到 Z
input_format: 第一行測資數 C。每組給 n、m、一個長 n 節點字串、n-1 條邊，最後給長 m 模式串。
output_format: 每組輸出合法有序點對數。
samples:
  - input: |
      1
      3 1
      AAA
      1 2
      2 3
      A
    output: |
      9
    explanation: 任意有序端點的路徑皆為一個以上的 A，等於模式 A 重複若干次。
core_knowledge: [centroid_ordered_pair_count, upward_path_hash, periodic_prefix, residue_complement]
judgment: 經重心路徑可拆成左端到重心前一點，以及重心到右端；將右半反向後，兩半分別只需匹配 S∞ 與 reverse(S)∞ 的前綴。
hints:
  - 對深度 d 左端，檢查「端點往重心、不含重心」長 d 字串是否為 S∞ 前綴。
  - 對深度 e 右端，檢查「端點往重心、包含重心」長 e+1 字串是否為 reverse(S)∞ 前綴。
  - 兩者還需 d+e+1≡0 (mod m)。逐重心分支先查再插左右合法餘數桶，便只配不同分支並同時計數兩個方向。
solution_outline: 雙模數預處理 S 與反串的週期前綴 hash。點分治 DFS 以「前端加字元」方式得到端點到重心 hash，標記左右合法性與深度餘數，跨分支互補計數。
proof_or_invariant: 總長為 m 倍數時，右半由終點反讀恰應等於 reverse(S)∞ 前綴；兩個 hash 條件與餘數條件合起來充要描述完整路徑字串。分支先查後插使每個有序路徑在首次分離重心恰計一次。
complexity:
  time: O(total_n log total_n)
  space: O(total_n)
common_errors:
  - 把 (u,v) 與 (v,u) 當成同一對
  - 左半 hash 未排除重心字元
  - 只檢查週期前綴，忘記總長必須是模式長度整數倍
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int tests;cin>>tests;while(tests--){int n,m;cin>>n>>m;/* TODO：雙雜湊週期前綴與點分治餘數配對。 */}}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  constexpr long long mod1=1000000007LL,mod2=1000000009LL,base=911382323LL;
  struct Hash{long long first,second;};
  Hash add_hash(Hash a,Hash b){return {(a.first+b.first)%mod1,(a.second+b.second)%mod2};}
  Hash subtract_hash(Hash a,Hash b){return {(a.first-b.first+mod1)%mod1,(a.second-b.second+mod2)%mod2};}
  Hash multiply_hash(Hash a,Hash b){return {a.first*b.first%mod1,a.second*b.second%mod2};}
  bool equal_hash(Hash a,Hash b){return a.first==b.first&&a.second==b.second;}
  struct Record{int residue;bool left_valid,right_valid;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int test_count;cin>>test_count;while(test_count--){int n,pattern_length;cin>>n>>pattern_length;string labels,pattern;cin>>labels;vector<vector<int>>graph(static_cast<size_t>(n+1));for(int i=1,u,v;i<n;++i){cin>>u>>v;graph[static_cast<size_t>(u)].push_back(v);graph[static_cast<size_t>(v)].push_back(u);}cin>>pattern;string reversed_pattern=pattern;reverse(reversed_pattern.begin(),reversed_pattern.end());vector<Hash>power(static_cast<size_t>(n+2)),prefix(static_cast<size_t>(n+2)),reverse_prefix(static_cast<size_t>(n+2));power[0]={1,1};Hash base_hash{base%mod1,base%mod2};for(int i=1;i<=n+1;++i){power[static_cast<size_t>(i)]=multiply_hash(power[static_cast<size_t>(i-1)],base_hash);int normal=pattern[static_cast<size_t>((i-1)%pattern_length)]-'A'+1,backward=reversed_pattern[static_cast<size_t>((i-1)%pattern_length)]-'A'+1;prefix[static_cast<size_t>(i)]=add_hash(multiply_hash(prefix[static_cast<size_t>(i-1)],base_hash),{normal,normal});reverse_prefix[static_cast<size_t>(i)]=add_hash(multiply_hash(reverse_prefix[static_cast<size_t>(i-1)],base_hash),{backward,backward});}vector<int>subtree(static_cast<size_t>(n+1));vector<char>removed(static_cast<size_t>(n+1));function<int(int,int)>measure=[&](int node,int parent){subtree[static_cast<size_t>(node)]=1;for(int next:graph[static_cast<size_t>(node)])if(next!=parent&&removed[static_cast<size_t>(next)]==0)subtree[static_cast<size_t>(node)]+=measure(next,node);return subtree[static_cast<size_t>(node)];};function<int(int,int,int)>centroid=[&](int node,int parent,int total){for(int next:graph[static_cast<size_t>(node)])if(next!=parent&&removed[static_cast<size_t>(next)]==0&&subtree[static_cast<size_t>(next)]>total/2)return centroid(next,node,total);return node;};function<void(int,int,int,Hash,int,vector<Record>&)>collect=[&](int node,int parent,int depth,Hash parent_hash,int center_code,vector<Record>&records){int code=labels[static_cast<size_t>(node-1)]-'A'+1;Hash current=add_hash(multiply_hash({code,code},power[static_cast<size_t>(depth)]),parent_hash);Hash without_center=subtract_hash(current,{center_code,center_code});bool left=equal_hash(without_center,multiply_hash(prefix[static_cast<size_t>(depth)],base_hash));bool right=equal_hash(current,reverse_prefix[static_cast<size_t>(depth+1)]);records.push_back({depth%pattern_length,left,right});for(int next:graph[static_cast<size_t>(node)])if(next!=parent&&removed[static_cast<size_t>(next)]==0)collect(next,node,depth+1,current,center_code,records);};long long answer=0;function<void(int)>decompose=[&](int start){int center=centroid(start,0,measure(start,0));int center_code=labels[static_cast<size_t>(center-1)]-'A'+1;vector<long long>left_count(static_cast<size_t>(pattern_length)),right_count(static_cast<size_t>(pattern_length));left_count[0]=1;bool center_right=center_code==pattern.back()-'A'+1;if(center_right)right_count[0]=1;if(pattern_length==1&&center_right)++answer;for(int next:graph[static_cast<size_t>(center)])if(removed[static_cast<size_t>(next)]==0){vector<Record>records;collect(next,center,1,{center_code,center_code},center_code,records);for(const Record&record:records){int complement=(pattern_length-1-record.residue+pattern_length)%pattern_length;if(record.right_valid)answer+=left_count[static_cast<size_t>(complement)];if(record.left_valid)answer+=right_count[static_cast<size_t>(complement)];}for(const Record&record:records){if(record.left_valid)++left_count[static_cast<size_t>(record.residue)];if(record.right_valid)++right_count[static_cast<size_t>(record.residue)];}}removed[static_cast<size_t>(center)]=1;for(int next:graph[static_cast<size_t>(center)])if(removed[static_cast<size_t>(next)]==0)decompose(next);};decompose(1);cout<<answer<<'\n';}}
external_url: https://www.luogu.com.cn/problem/P4075
external_platform: 洛谷
external_problem_id: P4075
external_title: '[SDOI2016] 模式字符串'
---

反轉右半路徑後，原本依賴左半長度的匹配相位可由「總長是 m 的倍數」消去，兩端因此能獨立驗證。
