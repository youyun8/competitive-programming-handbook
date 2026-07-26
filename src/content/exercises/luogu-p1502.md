---
id: luogu-p1502
volume: upper
source_file: upper-volume
title: 洛谷 P1502 窗口的星星
chapter: 4
section: '4.3'
kind: external-oj
difficulty: 4
topics: &id001
  - weighted-scanline
  - range-add-maximum
prerequisites:
  - segment-tree
statement: 平移固定 W×H 且邊框不計的視窗，最大化可見星星亮度。
constraints:
  - T <= 10
  - N <= 10000
  - W,H <= 1000000
  - 亮度 <= 1000
input_format: 先 T；每組 N W H 與 x y l。
output_format: 每組輸出最大亮度。
samples:
  - input: |
      2
      3 5 4
      1 2 3
      2 3 2
      6 3 1
      3 5 4
      1 2 3
      2 3 2
      5 3 1
    output: |
      5
      6
    explanation: 官方範例。
core_knowledge: *id001
judgment: 參數空間加權矩形最大覆蓋。
hints:
  - 把每顆星轉成所有可容納它的視窗位置矩形。
  - 重疊矩形權重和就是該視窗亮度。
  - 掃描一維，另一維做區間加與全域最大。
solution_outline: 參數空間加權矩形最大覆蓋。
proof_or_invariant: 轉換保持每顆星是否在視窗中的布林關係，故權重和亦保持。
common_errors:
  - 同座標事件順序或開閉邊界處理錯誤
  - 區間為空時仍遞迴更新
  - 合併時忘記保留跨左右區間候選
complexity:
  time: O(N log N)
  space: O(N)
cpp_skeleton: |
  // TODO：依三階段提示自行完成核心。
  #include <bits/stdc++.h>
  using namespace std;
  struct E{long long x,y1,y2,w;};static vector<long long>ys,mx,lazy;static void add(int p,int l,int r,int ql,int qr,long long v){if(qr<l||r<ql)return;if(ql<=l&&r<=qr){mx[static_cast<size_t>(p)]+=v;lazy[static_cast<size_t>(p)]+=v;return;}int m=(l+r)/2;add(p*2,l,m,ql,qr,v);add(p*2+1,m+1,r,ql,qr,v);mx[static_cast<size_t>(p)]=lazy[static_cast<size_t>(p)]+max(mx[static_cast<size_t>(p*2)],mx[static_cast<size_t>(p*2+1)]);}static long long solve(vector<array<long long,3>>stars,long long w,long long h){vector<E>e;ys.clear();for(auto s:stars){e.push_back({s[0],s[1],s[1]+h-1,s[2]});e.push_back({s[0]+w,s[1],s[1]+h-1,-s[2]});ys.push_back(s[1]);ys.push_back(s[1]+h-1);}sort(ys.begin(),ys.end());ys.erase(unique(ys.begin(),ys.end()),ys.end());sort(e.begin(),e.end(),[](const E&a,const E&b){return a.x!=b.x?a.x<b.x:a.w<b.w;});mx.assign(ys.size()*4+4,0);lazy.assign(ys.size()*4+4,0);long long ans=0;for(auto z:e){int l=static_cast<int>(lower_bound(ys.begin(),ys.end(),z.y1)-ys.begin()),r=static_cast<int>(lower_bound(ys.begin(),ys.end(),z.y2)-ys.begin());add(1,0,static_cast<int>(ys.size())-1,l,r,z.w);ans=max(ans,mx[1]);}return ans;}
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int T;cin>>T;while(T--){int n;long long w,h;cin>>n>>w>>h;vector<array<long long,3>>a(static_cast<size_t>(n));for(auto&x:a)cin>>x[0]>>x[1]>>x[2];cout<<solve(a,w,h)<<'\n';}}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  struct E{long long x,y1,y2,w;};static vector<long long>ys,mx,lazy;static void add(int p,int l,int r,int ql,int qr,long long v){if(qr<l||r<ql)return;if(ql<=l&&r<=qr){mx[static_cast<size_t>(p)]+=v;lazy[static_cast<size_t>(p)]+=v;return;}int m=(l+r)/2;add(p*2,l,m,ql,qr,v);add(p*2+1,m+1,r,ql,qr,v);mx[static_cast<size_t>(p)]=lazy[static_cast<size_t>(p)]+max(mx[static_cast<size_t>(p*2)],mx[static_cast<size_t>(p*2+1)]);}static long long solve(vector<array<long long,3>>stars,long long w,long long h){vector<E>e;ys.clear();for(auto s:stars){e.push_back({s[0],s[1],s[1]+h-1,s[2]});e.push_back({s[0]+w,s[1],s[1]+h-1,-s[2]});ys.push_back(s[1]);ys.push_back(s[1]+h-1);}sort(ys.begin(),ys.end());ys.erase(unique(ys.begin(),ys.end()),ys.end());sort(e.begin(),e.end(),[](const E&a,const E&b){return a.x!=b.x?a.x<b.x:a.w<b.w;});mx.assign(ys.size()*4+4,0);lazy.assign(ys.size()*4+4,0);long long ans=0;for(auto z:e){int l=static_cast<int>(lower_bound(ys.begin(),ys.end(),z.y1)-ys.begin()),r=static_cast<int>(lower_bound(ys.begin(),ys.end(),z.y2)-ys.begin());add(1,0,static_cast<int>(ys.size())-1,l,r,z.w);ans=max(ans,mx[1]);}return ans;}
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int T;cin>>T;while(T--){int n;long long w,h;cin>>n>>w>>h;vector<array<long long,3>>a(static_cast<size_t>(n));for(auto&x:a)cin>>x[0]>>x[1]>>x[2];cout<<solve(a,w,h)<<'\n';}}
external_url: https://www.luogu.com.cn/problem/P1502
external_platform: 洛谷
external_problem_id: P1502
external_title: 洛谷 P1502 窗口的星星
external_relation: original
source_book_pages:
  - 202
source_pdf_pages:
  - 220
review_status: verified
---

本卡片依外部題面與限制獨立整理。
