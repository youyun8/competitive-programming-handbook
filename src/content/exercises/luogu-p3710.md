---
id: luogu-p3710
volume: upper
source_file: upper-volume
source_book_pages: [197, 220]
source_pdf_pages: [215, 238]
chapter: 4
section: '4.5'
kind: external-oj
review_status: verified
external_relation: original
title: 洛谷 P3710 方方方的資料結構：撤銷修改與單點查詢
difficulty: 5
topics: [KD Tree, 時間離線化, 仿射標記]
prerequisites: [lazy-propagation, offline-processing]
statement: 全零序列依序接受區間加、區間乘、單點查詢，以及撤銷某次先前修改；撤銷只移除該修改，其他修改的相對順序不變。答案模 998244353。
constraints:
  - '1 <= n,m <= 150000'
  - '0 <= d <= 1073741823'
  - 每個加／乘操作至多被撤銷一次，資料由題目指定的隨機生成器產生
input_format: 第一行 n、m；`1 l r d` 加、`2 l r d` 乘、`3 p` 查詢、`4 operation_id` 撤銷。
output_format: 每個操作 3 輸出位置目前值模 998244353。
samples:
  - input: |
      3 6
      1 1 3 2
      2 2 3 3
      3 2
      4 1
      3 2
      3 1
    output: |
      6
      0
      0
    explanation: 前兩次修改後位置 2 為 (0+2)×3=6；撤銷加法後只剩乘法，零乘三仍為零。
core_knowledge: [修改有效時間, 二維矩形更新, 仿射函數合成]
judgment: 離線後每次修改只在「位置區間×有效時間區間」矩形生效，而每次查詢是一個點；題目隨機性允許 KD Tree 做矩形仿射更新。
hints:
  - 先讀完操作，為每次修改求有效時間 [operation_id,cancel_id-1]。
  - 只把查詢建成二維點 (time,position)，修改轉為覆蓋這些點的矩形。
  - 加與乘統一成 f(v)=v×mul+add；新標記接在舊標記後時，要同步更新 add 與 mul 的合成順序。
solution_outline: 離線取得修改終止時間，對所有查詢點建平衡 KD Tree；依原操作順序對相應矩形套用仿射標記，最後下推並按查詢順序輸出。
proof_or_invariant: 查詢點被某修改矩形包含，當且僅當其位置受影響且查詢發生在修改尚有效時。按修改原順序更新，仿射合成與刪除該操作後的序列語意完全一致。
complexity:
  time: 隨機資料下期望 O(m sqrt(m))
  space: O(m)
common_errors:
  - 撤銷時間仍包含 cancel 操作之後的查詢
  - 仿射標記合成寫成 add+=new_add 而未乘 new_mul
  - KD 節點完整覆蓋時仍遞迴，導致退化
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);const long long mod=998244353;int n,m;cin>>n>>m;vector<long long>a(static_cast<size_t>(n+1));struct Op{int type,l,r;long long d;bool active;};vector<Op>ops(1);while(m--){int type;cin>>type;if(type<=2){int l,r;long long d;cin>>l>>r>>d;ops.push_back({type,l,r,d,true});if(type==1)for(int i=l;i<=r;++i)a[static_cast<size_t>(i)]=(a[static_cast<size_t>(i)]+d)%mod;else for(int i=l;i<=r;++i)a[static_cast<size_t>(i)]=a[static_cast<size_t>(i)]*(d%mod)%mod;}else if(type==3){int p;cin>>p;ops.push_back({3,p,p,0,false});cout<<a[static_cast<size_t>(p)]<<'\n';}else{int p;cin>>p;ops.push_back({4,p,p,0,false});/* TODO：離線處理撤銷；此框架只示範輸入。 */}}}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  static const long long kMod=998244353;
  struct Operation{int type=0,left=0,right=0,end=0;long long value=0;};struct Point{int x=0,y=0,id=0;};struct Node{Point point;int child[2]{0,0},minimum[2]{0,0},maximum[2]{0,0};long long value=0,multiply=1,add=0;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;cin>>n>>m;(void)n;vector<Operation>operation(static_cast<size_t>(m+1));vector<Point>point;int query_count=0;for(int i=1;i<=m;++i){int type;cin>>type;operation[static_cast<size_t>(i)].type=type;if(type<=2){cin>>operation[static_cast<size_t>(i)].left>>operation[static_cast<size_t>(i)].right>>operation[static_cast<size_t>(i)].value;operation[static_cast<size_t>(i)].end=m;}else{int p;cin>>p;operation[static_cast<size_t>(i)].left=p;if(type==3)point.push_back({i,p,query_count++});else operation[static_cast<size_t>(p)].end=i-1;}}if(point.empty())return 0;vector<Node>tree(point.size()+1);function<int(int,int,int)>build=[&](int l,int r,int dimension){if(l>r)return 0;int mid=(l+r)/2;nth_element(point.begin()+l,point.begin()+mid,point.begin()+r+1,[dimension](const Point&a,const Point&b){return dimension==0?a.x<b.x:a.y<b.y;});int id=mid+1;tree[static_cast<size_t>(id)].point=point[static_cast<size_t>(mid)];tree[static_cast<size_t>(id)].child[0]=build(l,mid-1,dimension^1);tree[static_cast<size_t>(id)].child[1]=build(mid+1,r,dimension^1);for(int d=0;d<2;++d){int coordinate=d==0?tree[static_cast<size_t>(id)].point.x:tree[static_cast<size_t>(id)].point.y;tree[static_cast<size_t>(id)].minimum[d]=tree[static_cast<size_t>(id)].maximum[d]=coordinate;for(int side=0;side<2;++side){int child=tree[static_cast<size_t>(id)].child[side];if(child!=0){tree[static_cast<size_t>(id)].minimum[d]=min(tree[static_cast<size_t>(id)].minimum[d],tree[static_cast<size_t>(child)].minimum[d]);tree[static_cast<size_t>(id)].maximum[d]=max(tree[static_cast<size_t>(id)].maximum[d],tree[static_cast<size_t>(child)].maximum[d]);}}}return id;};int root=build(0,static_cast<int>(point.size())-1,0);auto apply=[&](int id,long long multiply,long long add){Node&node=tree[static_cast<size_t>(id)];node.value=(node.value*multiply+add)%kMod;node.multiply=node.multiply*multiply%kMod;node.add=(node.add*multiply+add)%kMod;};function<void(int)>push=[&](int id){Node&node=tree[static_cast<size_t>(id)];for(int side=0;side<2;++side)if(node.child[side]!=0)apply(node.child[side],node.multiply,node.add);node.multiply=1;node.add=0;};function<void(int,int,int,int,int,long long,long long)>modify=[&](int id,int x1,int x2,int y1,int y2,long long multiply,long long add){if(id==0)return;Node&node=tree[static_cast<size_t>(id)];if(node.maximum[0]<x1||x2<node.minimum[0]||node.maximum[1]<y1||y2<node.minimum[1])return;if(x1<=node.minimum[0]&&node.maximum[0]<=x2&&y1<=node.minimum[1]&&node.maximum[1]<=y2){apply(id,multiply,add);return;}push(id);if(x1<=node.point.x&&node.point.x<=x2&&y1<=node.point.y&&node.point.y<=y2)node.value=(node.value*multiply+add)%kMod;modify(node.child[0],x1,x2,y1,y2,multiply,add);modify(node.child[1],x1,x2,y1,y2,multiply,add);};for(int i=1;i<=m;++i){const Operation&op=operation[static_cast<size_t>(i)];if(op.type==1)modify(root,i,op.end,op.left,op.right,1,op.value%kMod);else if(op.type==2)modify(root,i,op.end,op.left,op.right,op.value%kMod,0);}vector<long long>answer(static_cast<size_t>(query_count));function<void(int)>collect=[&](int id){if(id==0)return;push(id);const Node&node=tree[static_cast<size_t>(id)];answer[static_cast<size_t>(node.point.id)]=node.value;collect(node.child[0]);collect(node.child[1]);};collect(root);for(long long value:answer)cout<<value<<'\n';}
external_url: https://www.luogu.com.cn/problem/P3710
external_platform: 洛谷
external_problem_id: P3710
external_title: 方方方的数据结构
---

撤銷任意歷史修改看似在線，單點查詢卻讓它能轉成離線二維矩形問題。
