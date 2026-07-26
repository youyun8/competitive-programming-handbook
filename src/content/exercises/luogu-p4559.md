---
id: luogu-p4559
volume: upper
source_file: upper-volume
source_book_pages: [179, 196]
source_pdf_pages: [197, 214]
chapter: 4
section: '4.4'
kind: external-oj
review_status: verified
external_relation: original
title: 洛谷 P4559 列隊：排序匹配連續集合點
difficulty: 5
topics: [主席樹, 單調匹配, 區間距離和]
prerequisites: [persistent-segment-tree]
statement: 學生 i 的休息座標 a_i 兩兩不同。每次指定編號 [l,r] 與 K，所有被選學生須分別站到 K..K+r-l 的不同整數點，求最小移動距離總和。
constraints:
  - '1 <= n, m <= 500000'
  - '1 <= a_i,K <= 1000000，所有 a_i 互異'
  - '1 <= l <= r <= n'
input_format: 第一行 n、m，第二行各學生座標；接著 m 行 l、r、K。
output_format: 每條命令輸出最小體力總和。
samples:
  - input: |
      4 2
      1 7 4 10
      1 3 3
      2 4 6
    output: |
      4
      4
    explanation: 第一批座標排序為 1、4、7，依序配 3、4、5，距離和 4；第二批 4、7、10 配 6、7、8，距離和 4。
core_knowledge: [排序不交叉匹配, 前綴主席樹, 計數與座標和]
judgment: 一維絕對距離的最優匹配保持排序；主席樹可取得編號區間的座標有序多重集合，遞迴時同步切分目標連續區間。
hints:
  - 交換兩條交叉匹配邊不會增加距離，因此第 j 小學生位置應配 K+j-1。
  - 每個位置前綴建立權值線段樹，節點存座標數量與座標總和。
  - 遞迴節點若整段來源都在目標左／右，可用等差和一次算完；否則依左子樹人數切目標區間。
solution_outline: 建立座標值域主席樹。查詢以 root[r]-root[l-1] 表示學生集合，遞迴同步維護來源值域與該節點應配到的連續目標段。
proof_or_invariant: 排序匹配最優。遞迴中 target 段長恆等於節點學生數，左子樹恰配較小的前 left_count 個點；完整位於一側時絕對值符號固定，計數和座標和公式精確。
complexity:
  time: 建樹 O(n log V)，每次詢問 O(log V)
  space: O(n log V)
common_errors:
  - 沒有依左子樹人數切分目標座標段
  - 等差級數與座標總和使用 32 位元
  - 誤以原編號順序配對而非按座標排序
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;cin>>n>>m;vector<long long>a(static_cast<size_t>(n+1));for(int i=1;i<=n;++i)cin>>a[static_cast<size_t>(i)];while(m--){int l,r;long long k;cin>>l>>r>>k;vector<long long>v(a.begin()+l,a.begin()+r+1);sort(v.begin(),v.end());long long answer=0;for(size_t i=0;i<v.size();++i)answer+=llabs(v[i]-(k+static_cast<long long>(i)));cout<<answer<<'\n';}}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  struct Node{int left=0,right=0,count=0;long long sum=0;};
  static int insert(vector<Node>&t,int old,int l,int r,int p){int id=static_cast<int>(t.size());t.push_back(t[static_cast<size_t>(old)]);++t[static_cast<size_t>(id)].count;t[static_cast<size_t>(id)].sum+=p;if(l==r)return id;int mid=(l+r)/2;if(p<=mid)t[static_cast<size_t>(id)].left=insert(t,t[static_cast<size_t>(old)].left,l,mid,p);else t[static_cast<size_t>(id)].right=insert(t,t[static_cast<size_t>(old)].right,mid+1,r,p);return id;}
  static long long arithmetic(long long l,long long r){return (l+r)*(r-l+1)/2;}
  static long long solve(const vector<Node>&t,int old,int now,int l,int r,long long target_l){int count=t[static_cast<size_t>(now)].count-t[static_cast<size_t>(old)].count;if(count==0)return 0;long long target_r=target_l+count-1,sum=t[static_cast<size_t>(now)].sum-t[static_cast<size_t>(old)].sum;if(r<=target_l)return arithmetic(target_l,target_r)-sum;if(l>=target_r)return sum-arithmetic(target_l,target_r);if(l==r)return llabs(static_cast<long long>(l)-target_l);int old_left=t[static_cast<size_t>(old)].left,now_left=t[static_cast<size_t>(now)].left,left_count=t[static_cast<size_t>(now_left)].count-t[static_cast<size_t>(old_left)].count,mid=(l+r)/2;return solve(t,old_left,now_left,l,mid,target_l)+solve(t,t[static_cast<size_t>(old)].right,t[static_cast<size_t>(now)].right,mid+1,r,target_l+left_count);}
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;cin>>n>>m;const int maximum=1000000;vector<Node>tree(1);tree.reserve(static_cast<size_t>(n)*22U);vector<int>root(static_cast<size_t>(n+1));for(int i=1,p;i<=n;++i){cin>>p;root[static_cast<size_t>(i)]=insert(tree,root[static_cast<size_t>(i-1)],1,maximum,p);}while(m--){int l,r;long long k;cin>>l>>r>>k;cout<<solve(tree,root[static_cast<size_t>(l-1)],root[static_cast<size_t>(r)],1,maximum,k)<<'\n';}}
external_url: https://www.luogu.com.cn/problem/P4559
external_platform: 洛谷
external_problem_id: P4559
external_title: '[JSOI2018] 列队'
---

主席樹不只找第 k 小；也能在遞迴中同步維護「排序後第幾名應配到哪裡」。
