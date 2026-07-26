---
id: openj-bailian-1177
volume: upper
source_file: upper-volume
title: OpenJudge 百練 1177 Picture
chapter: 4
section: '4.3'
kind: external-oj
difficulty: 4
topics: &id001
  - scanline
  - connected-segments
  - union-perimeter
prerequisites:
  - segment-tree
statement: 求軸平行矩形聯集的外邊界周長。
constraints:
  - 0 <= N < 5000
  - 座標 -10000..10000
input_format: 輸入 N 與 N 個矩形。
output_format: 輸出聯集周長。
samples:
  - input: |
      2
      0 0 2 2
      1 1 3 3
    output: |
      12
    explanation: 兩重疊正方形聯集周長十二。
core_knowledge: *id001
judgment: 掃描 y 並維護 x 聯集摘要。
hints:
  - 維護掃描線覆蓋長與連通段數。
  - 垂直邊貢獻為 2*段數*dy。
  - 水平邊貢獻是事件前後覆蓋長差絕對值。
solution_outline: 掃描 y 並維護 x 聯集摘要。
proof_or_invariant: 每個帶狀區間每個覆蓋段有左右兩邊；事件造成的聯集變化恰為水平邊。
common_errors:
  - 端點、開閉區間或 0/1 起始索引處理錯誤
  - 合併摘要時遺漏跨左右區間的候選
  - 使用 32 位元儲存可能溢位的計數或總和
complexity:
  time: O(N log N)
  space: O(N)
cpp_skeleton: |
  // TODO：依三階段提示自行完成核心。
  #include <bits/stdc++.h>
  using namespace std;struct E{int y,x1,x2,d;};struct N{int c=0,len=0,seg=0;bool l=false,r=false;};static vector<int>xs;static vector<N>tr;static void pull(int p,int l,int r){N&z=tr[static_cast<size_t>(p)];if(z.c>0){z.len=xs[static_cast<size_t>(r+1)]-xs[static_cast<size_t>(l)];z.seg=1;z.l=z.r=true;}else if(l==r){z.len=z.seg=0;z.l=z.r=false;}else{N&a=tr[static_cast<size_t>(p*2)];N&b=tr[static_cast<size_t>(p*2+1)];z.len=a.len+b.len;z.seg=a.seg+b.seg-(a.r&&b.l);z.l=a.l;z.r=b.r;}}static void upd(int p,int l,int r,int ql,int qr,int d){if(qr<l||r<ql)return;if(ql<=l&&r<=qr)tr[static_cast<size_t>(p)].c+=d;else{int m=(l+r)/2;upd(p*2,l,m,ql,qr,d);upd(p*2+1,m+1,r,ql,qr,d);}pull(p,l,r);}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;cin>>n;vector<E>e;for(int i=0;i<n;++i){int x1,y1,x2,y2;cin>>x1>>y1>>x2>>y2;e.push_back({y1,x1,x2,1});e.push_back({y2,x1,x2,-1});xs.push_back(x1);xs.push_back(x2);}if(n==0){cout<<0<<'\n';return 0;}sort(xs.begin(),xs.end());xs.erase(unique(xs.begin(),xs.end()),xs.end());sort(e.begin(),e.end(),[](const E&a,const E&b){return a.y!=b.y?a.y<b.y:a.d>b.d;});tr.assign(xs.size()*4+4,N{});long long ans=0;int py=e[0].y;for(auto x:e){ans+=2LL*tr[1].seg*(x.y-py);int old=tr[1].len;int l=static_cast<int>(lower_bound(xs.begin(),xs.end(),x.x1)-xs.begin()),r=static_cast<int>(lower_bound(xs.begin(),xs.end(),x.x2)-xs.begin())-1;upd(1,0,static_cast<int>(xs.size())-2,l,r,x.d);ans+=abs(tr[1].len-old);py=x.y;}cout<<ans<<'\n';}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;struct E{int y,x1,x2,d;};struct N{int c=0,len=0,seg=0;bool l=false,r=false;};static vector<int>xs;static vector<N>tr;static void pull(int p,int l,int r){N&z=tr[static_cast<size_t>(p)];if(z.c>0){z.len=xs[static_cast<size_t>(r+1)]-xs[static_cast<size_t>(l)];z.seg=1;z.l=z.r=true;}else if(l==r){z.len=z.seg=0;z.l=z.r=false;}else{N&a=tr[static_cast<size_t>(p*2)];N&b=tr[static_cast<size_t>(p*2+1)];z.len=a.len+b.len;z.seg=a.seg+b.seg-(a.r&&b.l);z.l=a.l;z.r=b.r;}}static void upd(int p,int l,int r,int ql,int qr,int d){if(qr<l||r<ql)return;if(ql<=l&&r<=qr)tr[static_cast<size_t>(p)].c+=d;else{int m=(l+r)/2;upd(p*2,l,m,ql,qr,d);upd(p*2+1,m+1,r,ql,qr,d);}pull(p,l,r);}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;cin>>n;vector<E>e;for(int i=0;i<n;++i){int x1,y1,x2,y2;cin>>x1>>y1>>x2>>y2;e.push_back({y1,x1,x2,1});e.push_back({y2,x1,x2,-1});xs.push_back(x1);xs.push_back(x2);}if(n==0){cout<<0<<'\n';return 0;}sort(xs.begin(),xs.end());xs.erase(unique(xs.begin(),xs.end()),xs.end());sort(e.begin(),e.end(),[](const E&a,const E&b){return a.y!=b.y?a.y<b.y:a.d>b.d;});tr.assign(xs.size()*4+4,N{});long long ans=0;int py=e[0].y;for(auto x:e){ans+=2LL*tr[1].seg*(x.y-py);int old=tr[1].len;int l=static_cast<int>(lower_bound(xs.begin(),xs.end(),x.x1)-xs.begin()),r=static_cast<int>(lower_bound(xs.begin(),xs.end(),x.x2)-xs.begin())-1;upd(1,0,static_cast<int>(xs.size())-2,l,r,x.d);ans+=abs(tr[1].len-old);py=x.y;}cout<<ans<<'\n';}
external_url: http://bailian.openjudge.cn/practice/1177/
external_platform: OpenJ_Bailian
external_problem_id: '1177'
external_title: OpenJudge 百練 1177 Picture
external_relation: original
source_book_pages:
  - 202
source_pdf_pages:
  - 220
review_status: verified
---

本卡片依外部題面與限制獨立整理。
