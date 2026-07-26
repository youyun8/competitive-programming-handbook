---
id: luogu-p3810
volume: upper
source_file: upper-volume
title: 洛谷 P3810 陌上花開：三維偏序
chapter: 2
section: '2.9'
kind: external-oj
difficulty: 5
topics: ['CDQ 分治', 'Fenwick 樹', '三維偏序', '去重']
prerequisites: ['fenwick-tree', 'divide-and-conquer']
statement: |-
  給定 n 個三維點。對每個點，計算三個座標皆不大於它的其他點數量 d；輸出 d=0..n-1 的點數分布。相同點彼此也互相計入。
constraints:
  - '1 <= n <= 100000；1 <= a_i,b_i,c_i <= k <= 200000'
input_format: '第一行 n、k；接著 n 行三個座標。'
output_format: '輸出 n 行，第 d+1 行為等級 d 的點數。'
samples:
  - input: |
      3 3
      1 1 1
      2 2 2
      1 2 3
    output: |
      1
      2
      0
    explanation: '第一點等級為 0；其餘兩點都只有第一點支配，等級為 1。'
core_knowledge: ['先按第一維排序', 'CDQ 處理跨半部貢獻', 'Fenwick 樹統計第三維前綴']
judgment: '三維「皆不大於」計數且 n 為十萬，標準作法是排序一維、CDQ 一維、Fenwick 維護最後一維。'
hints:
  - '完全相同的點先合併並記錄 multiplicity，否則分治邊界會讓重點彼此計數不完整。'
  - '依 x,y,z 排序後做 CDQ；合併時依 y 掃描，把左半點的 count 加入 z 軸 Fenwick。'
  - '右半點查詢 z 的前綴和；最後將每個合併點的答案加上 count-1，再把 count 個點放進對應直方圖。'
solution_outline: '排序並合併重點。CDQ 遞迴處理左右半部，再依 y 合併，Fenwick 計算左半對右半的支配貢獻；最後展開 multiplicity。'
proof_or_invariant: '排序保證左半點 x 不大於右半點。合併掃描加入所有 y 不大於目前右點的左點，Fenwick 前綴再篩出 z 不大於者，因此每個跨半支配對恰計一次；遞迴涵蓋同半配對。'
common_errors: ['未合併完全相同的點', 'CDQ 合併後未保持 y 有序', 'Fenwick 使用後未撤銷左半更新']
complexity:
  time: 'O(n log^2 n)'
  space: 'O(n+k)'
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main() {
      // TODO：合併重點後，以 CDQ 分治與 Fenwick 樹統計三維偏序。
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  struct Point{int x,y,z,count,answer;};
  class Fenwick{vector<int>tree;public:explicit Fenwick(int n):tree(static_cast<size_t>(n+1)){}void add(int p,int v){for(int n=static_cast<int>(tree.size());p<n;p+=p&-p)tree[static_cast<size_t>(p)]+=v;}int sum(int p)const{int r=0;for(;p>0;p-=p&-p)r+=tree[static_cast<size_t>(p)];return r;}};
  void cdq(vector<Point>&a,vector<Point>&tmp,Fenwick&bit,int l,int r){if(r-l<=1)return;int m=(l+r)/2;cdq(a,tmp,bit,l,m);cdq(a,tmp,bit,m,r);int i=l,j=m,k=l;while(j<r){while(i<m&&a[i].y<=a[j].y){bit.add(a[i].z,a[i].count);tmp[k++]=a[i++];}a[j].answer+=bit.sum(a[j].z);tmp[k++]=a[j++];}for(int p=l;p<i;++p)bit.add(a[p].z,-a[p].count);while(i<m)tmp[k++]=a[i++];for(int p=l;p<r;++p)a[p]=tmp[p];}
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,max_z;if(!(cin>>n>>max_z))return 0;vector<array<int,3>>raw(n);for(auto&p:raw)cin>>p[0]>>p[1]>>p[2];sort(raw.begin(),raw.end());vector<Point>a;for(auto p:raw){if(!a.empty()&&a.back().x==p[0]&&a.back().y==p[1]&&a.back().z==p[2])++a.back().count;else a.push_back({p[0],p[1],p[2],1,0});}for(auto&p:a)p.answer=p.count-1;vector<Point>tmp(a.size());Fenwick bit(max_z);cdq(a,tmp,bit,0,static_cast<int>(a.size()));vector<int>hist(n);for(auto p:a)hist[static_cast<size_t>(p.answer)]+=p.count;for(int x:hist)cout<<x<<'\n';return 0;}
external_url: https://www.luogu.com.cn/problem/P3810
external_platform: 洛谷
external_problem_id: P3810
external_title: '[模板] 三維偏序（陌上花開）'
external_relation: original
source_book_pages: [92]
source_pdf_pages: [110]
review_status: verified
---

CDQ 將一維偏序轉成跨半部統計，是高維離線計數的重要技巧。
