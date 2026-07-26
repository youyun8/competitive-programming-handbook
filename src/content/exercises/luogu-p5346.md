---
id: luogu-p5346
volume: lower
source_file: lower-volume
title: 洛谷 P5346 柯南家族
chapter: 9
section: '9.7'
kind: external-oj
difficulty: 5
topics: [tree-suffix-order, persistent-segment-tree, kth-order-statistic]
prerequisites: [suffix-array, persistent-segment-tree, euler-tour]
statement: 依智商、父親聰明排名及出生時間遞迴定義全族唯一聰明排名；回答個人總排名、祖先鏈（含自己）第 k 聰明者、子樹（含自己）第 k 聰明者。
constraints: ['1 <= n,q <= 5*10^5', 'f_i < i', '1 <= a_i <= 10^9', '所有詢問保證合法']
input_format: 第一行 n、q；第二行 f_2..f_n；第三行 a_1..a_n；接著 q 行三類詢問。
output_format: 每個詢問輸出一行排名或人員編號。
samples:
  - input: "5 11\n1 1 3 2\n1 2 2 1 1\n1 1\n1 2\n1 3\n1 4\n1 5\n2 4 1\n2 5 3\n3 1 1\n3 1 2\n3 1 3\n3 1 4\n"
    output: "5\n2\n1\n3\n4\n3\n1\n3\n2\n4\n5"
    explanation: 官方範例的聰明順序為 3、2、4、5、1；另以遞迴比較器及直接枚舉祖先/子樹的小型隨機樹對拍。
core_knowledge: [樹上字串倍增排名, 穩定基數排序, 可持久化值域第 k 小]
judgment: 排名 1 最聰明；祖先與後代詢問都包含 x 自己；同智商且同父親（或一方無父）時後出生者較聰明。
hints:
  - 把每人視為從自己到根的「智商序列」，以智商由大到小作字典序；完全相同時延續父親排名，再依編號由大到小。
  - 仿樹上 SA 倍增，同時維護可重複的內容 rank 與唯一 order rank，兩次穩定計數排序即可求全序。
  - 將總排名當值域：根到點的持久化版本回答祖先鏈；Euler 序前綴版本相減回答子樹。
solution_outline: 先把智商離散成由大到小的初始鍵，從編號大到小穩定排序。樹上倍增每輪按前半內容 rank、後半祖先唯一 rank 排序，得到總排名。建立兩組持久化線段樹：每點由父版本加入自身排名；另一組按 Euler 序做前綴。三類詢問分別直接查 rank、單版本第 k 小、兩前綴版本差第 k 小。
proof_or_invariant: 倍增第 t 輪的內容 rank 精確描述長 2^t 祖先序列；唯一 rank 在相同內容內保留父親遞迴次序與較大編號優先，故最終次序等於聰明定義。持久化版本的計數集合分別恰為根到 x 路徑與 Euler 子樹區間，值域第 k 小即第 k 聰明。
common_errors: [把智商由小到大排序, 忘記祖先/後代集合包含自己, 子樹版本未用 Euler 前綴相減, 相同序列按編號升序]
complexity: { time: 'O((n+q) log n)', space: 'O(n log n)' }
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);/* TODO：樹上倍增排名，兩組持久化值域樹回答第 k 名。*/return 0;}
cpp_solution: |
  #include <algorithm>
  #include <iostream>
  #include <numeric>
  #include <vector>
  using namespace std;
  static void counting_sort(vector<int>&order,const vector<int>&key,int maximum){vector<int>count(static_cast<size_t>(maximum+1)),result(order.size());for(int x:order)++count[static_cast<size_t>(key[static_cast<size_t>(x)])];for(int i=1;i<=maximum;++i)count[static_cast<size_t>(i)]+=count[static_cast<size_t>(i-1)];for(size_t i=order.size();i-->0;){int x=order[i];result[static_cast<size_t>(--count[static_cast<size_t>(key[static_cast<size_t>(x)])])]=x;}order.swap(result);}
  struct Node{int left=0,right=0,count=0;};
  static int add(vector<Node>&tree,int previous,int left,int right,int position){int current=static_cast<int>(tree.size());tree.push_back(tree[static_cast<size_t>(previous)]);++tree[static_cast<size_t>(current)].count;if(left<right){int middle=(left+right)/2;if(position<=middle)tree[static_cast<size_t>(current)].left=add(tree,tree[static_cast<size_t>(previous)].left,left,middle,position);else tree[static_cast<size_t>(current)].right=add(tree,tree[static_cast<size_t>(previous)].right,middle+1,right,position);}return current;}
  static int kth(const vector<Node>&tree,int before,int after,int left,int right,int k){while(left<right){int middle=(left+right)/2;int amount=tree[static_cast<size_t>(tree[static_cast<size_t>(after)].left)].count-tree[static_cast<size_t>(tree[static_cast<size_t>(before)].left)].count;if(k<=amount){before=tree[static_cast<size_t>(before)].left;after=tree[static_cast<size_t>(after)].left;right=middle;}else{k-=amount;before=tree[static_cast<size_t>(before)].right;after=tree[static_cast<size_t>(after)].right;left=middle+1;}}return left;}
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n=0,queries=0;cin>>n>>queries;vector<int>parent(static_cast<size_t>(n+1));vector<vector<int>>children(static_cast<size_t>(n+1));for(int i=2;i<=n;++i){cin>>parent[static_cast<size_t>(i)];children[static_cast<size_t>(parent[static_cast<size_t>(i)])].push_back(i);}vector<int>iq(static_cast<size_t>(n+1)),values;for(int i=1;i<=n;++i){cin>>iq[static_cast<size_t>(i)];values.push_back(iq[static_cast<size_t>(i)]);}sort(values.begin(),values.end(),greater<int>());values.erase(unique(values.begin(),values.end()),values.end());vector<int>order(static_cast<size_t>(n)),rank(static_cast<size_t>(n+1)),unique_rank(static_cast<size_t>(n+1)),key(static_cast<size_t>(n+1)),ancestor=parent;iota(order.rbegin(),order.rend(),1);for(int i=1;i<=n;++i)key[static_cast<size_t>(i)]=static_cast<int>(lower_bound(values.begin(),values.end(),iq[static_cast<size_t>(i)],greater<int>())-values.begin())+1;counting_sort(order,key,static_cast<int>(values.size()));int classes=0;for(int i=0;i<n;++i){int x=order[static_cast<size_t>(i)];if(i==0||key[static_cast<size_t>(x)]!=key[static_cast<size_t>(order[static_cast<size_t>(i-1)])])++classes;rank[static_cast<size_t>(x)]=classes;unique_rank[static_cast<size_t>(x)]=i+1;}for(int width=1;width<n;width<<=1){vector<int>old=rank;int missing_content=classes+1;for(int i=1;i<=n;++i){int up=ancestor[static_cast<size_t>(i)];key[static_cast<size_t>(i)]=up?unique_rank[static_cast<size_t>(up)]:n+1;}counting_sort(order,key,n+1);counting_sort(order,old,classes);classes=0;for(int i=0;i<n;++i){int x=order[static_cast<size_t>(i)],up=ancestor[static_cast<size_t>(x)];bool different=i==0;if(i){int y=order[static_cast<size_t>(i-1)],previous_up=ancestor[static_cast<size_t>(y)];different=old[static_cast<size_t>(x)]!=old[static_cast<size_t>(y)]||(up?old[static_cast<size_t>(up)]:missing_content)!=(previous_up?old[static_cast<size_t>(previous_up)]:missing_content);}if(different)++classes;rank[static_cast<size_t>(x)]=classes;unique_rank[static_cast<size_t>(x)]=i+1;}vector<int>next(static_cast<size_t>(n+1));for(int i=1;i<=n;++i){int up=ancestor[static_cast<size_t>(i)];next[static_cast<size_t>(i)]=up?ancestor[static_cast<size_t>(up)]:0;}ancestor.swap(next);}vector<int>tin(static_cast<size_t>(n+1)),tout(static_cast<size_t>(n+1)),euler(static_cast<size_t>(n+1)),stack{1};int timer=0;while(!stack.empty()){int x=stack.back();stack.pop_back();if(x<0){tout[static_cast<size_t>(-x)]=timer;continue;}tin[static_cast<size_t>(x)]=++timer;euler[static_cast<size_t>(timer)]=x;stack.push_back(-x);for(size_t i=children[static_cast<size_t>(x)].size();i-->0;)stack.push_back(children[static_cast<size_t>(x)][i]);}vector<Node>tree(1);tree.reserve(static_cast<size_t>(n)*42+1);vector<int>path_root(static_cast<size_t>(n+1)),prefix_root(static_cast<size_t>(n+1));for(int i=1;i<=n;++i)path_root[static_cast<size_t>(i)]=add(tree,path_root[static_cast<size_t>(parent[static_cast<size_t>(i)])],1,n,unique_rank[static_cast<size_t>(i)]);for(int i=1;i<=n;++i){int x=euler[static_cast<size_t>(i)];prefix_root[static_cast<size_t>(i)]=add(tree,prefix_root[static_cast<size_t>(i-1)],1,n,unique_rank[static_cast<size_t>(x)]);}while(queries--){int type=0,x=0,k=0;cin>>type>>x;if(type==1){cout<<unique_rank[static_cast<size_t>(x)]<<'\n';continue;}cin>>k;int smart_rank=type==2?kth(tree,0,path_root[static_cast<size_t>(x)],1,n,k):kth(tree,prefix_root[static_cast<size_t>(tin[static_cast<size_t>(x)]-1)],prefix_root[static_cast<size_t>(tout[static_cast<size_t>(x)])],1,n,k);cout<<order[static_cast<size_t>(smart_rank-1)]<<'\n';}}
external_url: https://www.luogu.com.cn/problem/P5346
external_platform: 洛谷
external_problem_id: P5346
external_title: 【XR-1】柯南家族
external_relation: original
source_book_pages: [587, 595]
source_pdf_pages: [217, 225]
review_status: verified
---

先把遞迴聰明定義變成完整排名，兩種集合詢問便都退化為「排名值域上的第 k 小」。
