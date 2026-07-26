---
id: luogu-p3850
volume: upper
source_file: upper-volume
title: '洛谷 P3850 [TJOI2007] 書架'
chapter: 4
section: '4.16'
kind: external-oj
difficulty: 5
topics: ['隱式平衡樹', '按排名插入', '按排名查詢']
prerequisites: ['隱式平衡樹', '按排名插入', '按排名查詢']
statement: |-
  給定初始書名序列，依序把新書插入當時的指定位置，最後回答若干位置上的書名。
constraints:
  - '書名不含空白且長度 <= 10'
  - '每次插入位置合法'
input_format: '依官方題面依序輸入初始資料與操作。'
output_format: '對每個詢問依序輸出答案。'
samples:
  - input: |-
      3
      Math
      Algorithm
      Program
      2
      Picture 2
      System 1
      3
      0
      1
      3
    output: |-
      Math
      System
      Picture
    explanation: '此例已用卡片程式執行核對；亦可依題意手算驗證。'
core_knowledge: ['隱式平衡樹', '按排名插入', '按排名查詢']
judgment: |-
  位置從 0 編號；每次插入的位置相對於當時的書架。
hints:
  - '先辨識核心模型：隱式平衡樹、按排名插入、按排名查詢；暫時不要處理所有操作細節。'
  - '位置從 0 編號；每次插入的位置相對於當時的書架。'
  - '最後依此不變量實作：以子樹大小作隱式鍵。split(root,pos) 得到前 pos 本與其餘部分，把新節點合併在兩者之間；查詢沿子樹大小尋找第 pos+1 名。'
solution_outline: |-
  以子樹大小作隱式鍵。split(root,pos) 得到前 pos 本與其餘部分，把新節點合併在兩者之間；查詢沿子樹大小尋找第 pos+1 名。
proof_or_invariant: |-
  split 保持兩側相對順序，merge 只把整個左序列接到右序列之前，所以每次操作與陣列插入等價；排名下降唯一定位答案。
common_errors:
  - '索引、加密參數或區間端點偏移一位'
  - '懶標記、旋轉或虛實邊切換前沒有先下傳'
  - '距離、乘積、子樹和或答案使用 int 而溢位'
complexity:
  time: 'O((n+m+q)log(n+m))'
  space: 'O(n+m)'
cpp_skeleton: |-
  #include <iostream>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：依題卡的不變量完成平衡樹、KD-tree 或 Link-Cut Tree。
      return 0;
  }
cpp_solution: |-
  #if defined(__GNUC__)
  #pragma GCC diagnostic ignored "-Wconversion"
  #pragma GCC diagnostic ignored "-Wshadow"
  #pragma GCC diagnostic ignored "-Wpedantic"
  #pragma GCC diagnostic ignored "-Wsign-compare"
  #pragma GCC diagnostic ignored "-Wunused-parameter"
  #pragma GCC diagnostic ignored "-Wunused-variable"
  #pragma GCC diagnostic ignored "-Wunused-function"
  #pragma GCC diagnostic ignored "-Wunused-result"
  #pragma GCC diagnostic ignored "-Wparentheses"
  #pragma GCC diagnostic ignored "-Wmisleading-indentation"
  #pragma GCC diagnostic ignored "-Wdangling-else"
  #pragma GCC diagnostic ignored "-Wsequence-point"
  #pragma GCC diagnostic ignored "-Wclass-memaccess"
  #pragma GCC diagnostic ignored "-Wimplicit-fallthrough"
  #endif
  #include<bits/stdc++.h>
  using namespace std;
  const int MAXN = 1e5+305;

  int n,m;
  int cnt;
  int head=0;
  string key[MAXN];
  int ls[MAXN];
  int rs[MAXN];
  int sz[MAXN];
  double priority[MAXN];

  int ansi=-1;
  string ans[MAXN];

  void up(int i){
      sz[i]=sz[ls[i]]+sz[rs[i]]+1;
  }

  void split(int l, int r, int i, int rank) {
      if (i == 0) {
          rs[l] = ls[r] = 0;
      } else {
          if (sz[ls[i]] + 1 <= rank) {
              rs[l] = i;
              split(i, r, rs[i], rank - sz[ls[i]] - 1);
          } else {
              ls[r] = i;
              split(l, i, ls[i], rank);
          }
          up(i);
      }
  }

  int merge(int l, int r) {
      if (l == 0 || r == 0) {
          return l + r;
      }
      if (priority[l] >= priority[r]) {
          rs[l] = merge(rs[l], r);
          up(l);
          return l;
      } else {
          ls[r] = merge(l, ls[r]);
          up(r);
          return r;
      }
  }

  void inorder(int i) {
      if (i != 0) {
          inorder(ls[i]);
          ans[++ansi] = key[i];
          inorder(rs[i]);
      }
  }

  int main()
  {
      ios::sync_with_stdio(0);
      cin.tie(0),cout.tie(0);
      srand(time(0));
      cin>>n;
      string s;
      for(int i=1;i<=n;i++){
          cin>>s;
          key[++cnt]=s;
          sz[cnt]=1;
          priority[cnt]=(double)rand()/RAND_MAX;
          head=merge(head,cnt);
      }
      cin>>m;
      for(int i=1;i<=m;i++){
          cin>>s;
          int pos;
          cin>>pos;
          split(0,0,head,pos);
          int l=rs[0],r=ls[0];
          key[++cnt]=s;
          sz[cnt]=1;
          priority[cnt]=(double)rand()/RAND_MAX;
          l=merge(l,cnt);
          head=merge(l,r);
      }

      inorder(head);
      int q;
      cin>>q;
      for(int i=1;i<=q;i++){
          int u;
          cin>>u;
          cout<<ans[u]<<endl;
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P3850
external_platform: '洛谷'
external_problem_id: 'P3850'
external_title: '[TJOI2007] 書架'
external_relation: original
source_book_pages: [296, 299]
source_pdf_pages: [314, 317]
review_status: verified
---

題意、限制與輸入輸出已逐題對照官方題面或可信競賽存檔；解說以繁體中文獨立整理。
