---
id: openj-bailian-2482
volume: upper
source_file: upper-volume
title: OpenJudge 百練 2482 Stars in Your Window
chapter: 4
section: '4.3'
kind: external-oj
difficulty: 4
topics: &id001
  - weighted-rectangle-overlap
  - scanline
  - range-add-maximum
prerequisites:
  - segment-tree
statement: 平移固定寬高且邊界不計的視窗，最大化內部星星亮度總和。
constraints:
  - 1 <= N <= 10000
  - W,H <= 1000000
  - 座標 < 2^31
  - 亮度 1..100
input_format: 多組 N W H 與星星 x y c，讀到 EOF。
output_format: 每組輸出最大亮度。
samples:
  - input: |
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
    explanation: 第二組三顆星可同時落在開視窗內。
core_knowledge: *id001
judgment: 將星轉成參數空間矩形後做加權掃描線。
hints:
  - 固定一顆星，視窗角落可放置的位置形成矩形。
  - 問題轉成找被權重矩形覆蓋總權最大的點。
  - 掃 x，線段樹對 y 區間加亮度並維護最大值。
solution_outline: 將星轉成參數空間矩形後做加權掃描線。
proof_or_invariant: 視窗位置與參數平面點一一對應；該點落入星的可行矩形當且僅當星在視窗內。
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
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;long long w,h;while(cin>>n>>w>>h){vector<array<long long,3>>a(static_cast<size_t>(n));for(auto&x:a)cin>>x[0]>>x[1]>>x[2];cout<<solve(a,w,h)<<'\n';}}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  struct E{long long x,y1,y2,w;};static vector<long long>ys,mx,lazy;static void add(int p,int l,int r,int ql,int qr,long long v){if(qr<l||r<ql)return;if(ql<=l&&r<=qr){mx[static_cast<size_t>(p)]+=v;lazy[static_cast<size_t>(p)]+=v;return;}int m=(l+r)/2;add(p*2,l,m,ql,qr,v);add(p*2+1,m+1,r,ql,qr,v);mx[static_cast<size_t>(p)]=lazy[static_cast<size_t>(p)]+max(mx[static_cast<size_t>(p*2)],mx[static_cast<size_t>(p*2+1)]);}static long long solve(vector<array<long long,3>>stars,long long w,long long h){vector<E>e;ys.clear();for(auto s:stars){e.push_back({s[0],s[1],s[1]+h-1,s[2]});e.push_back({s[0]+w,s[1],s[1]+h-1,-s[2]});ys.push_back(s[1]);ys.push_back(s[1]+h-1);}sort(ys.begin(),ys.end());ys.erase(unique(ys.begin(),ys.end()),ys.end());sort(e.begin(),e.end(),[](const E&a,const E&b){return a.x!=b.x?a.x<b.x:a.w<b.w;});mx.assign(ys.size()*4+4,0);lazy.assign(ys.size()*4+4,0);long long ans=0;for(auto z:e){int l=static_cast<int>(lower_bound(ys.begin(),ys.end(),z.y1)-ys.begin()),r=static_cast<int>(lower_bound(ys.begin(),ys.end(),z.y2)-ys.begin());add(1,0,static_cast<int>(ys.size())-1,l,r,z.w);ans=max(ans,mx[1]);}return ans;}
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;long long w,h;while(cin>>n>>w>>h){vector<array<long long,3>>a(static_cast<size_t>(n));for(auto&x:a)cin>>x[0]>>x[1]>>x[2];cout<<solve(a,w,h)<<'\n';}}
external_url: http://bailian.openjudge.cn/practice/2482/
external_platform: OpenJ_Bailian
external_problem_id: '2482'
external_title: OpenJudge 百練 2482 Stars in Your Window
external_relation: original
source_book_pages:
  - 202
source_pdf_pages:
  - 220
review_status: verified
---

本卡片依外部題面與限制獨立整理。
