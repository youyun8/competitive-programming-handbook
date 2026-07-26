---
id: luogu-p4567
volume: upper
source_file: upper-volume
title: '洛谷 P4567 [AHOI2006] 文本編輯器'
chapter: 4
section: '4.16'
kind: external-oj
difficulty: 5
topics: ['隱式伸展樹', '字串區間反轉', '游標模型']
prerequisites: ['隱式伸展樹', '字串區間反轉', '游標模型']
statement: |-
  從空字串開始維護游標，支援 MOVE、INSERT、DELETE、ROTATE、GET、PREV、NEXT。
constraints:
  - '插入字元總數 <= 2 MiB'
  - 'MOVE <= 50000'
  - 'INSERT、DELETE、ROTATE 合計 <= 6000'
input_format: '依官方題面依序輸入初始資料與操作。'
output_format: '對每個詢問依序輸出答案。'
samples:
  - input: |-
      7
      Insert 3
      abc
      Move 0
      Get
      Next
      Rotate 2
      Get
      Prev
    output: |-
      a
      c
    explanation: '此例已用卡片程式執行核對；亦可依題意手算驗證。'
core_knowledge: ['隱式伸展樹', '字串區間反轉', '游標模型']
judgment: |-
  游標位於字元間；所有區間操作都從游標後第一個字元開始。
hints:
  - '先辨識核心模型：隱式伸展樹、字串區間反轉、游標模型；暫時不要處理所有操作細節。'
  - '游標位於字元間；所有區間操作都從游標後第一個字元開始。'
  - '最後依此不變量實作：用隱式伸展樹保存字元與兩個哨兵。依排名隔離游標後長度 n 的區間；插入平衡建樹，刪除斷開子樹，反轉打懶標，GET 查第 cursor+1 個字元。'
solution_outline: |-
  用隱式伸展樹保存字元與兩個哨兵。依排名隔離游標後長度 n 的區間；插入平衡建樹，刪除斷開子樹，反轉打懶標，GET 查第 cursor+1 個字元。
proof_or_invariant: |-
  中序序列等於文字；排名切段精確選出游標後的字元。反轉只交換左右兒子並延後下傳，不改變區間外順序。
common_errors:
  - '索引、加密參數或區間端點偏移一位'
  - '懶標記、旋轉或虛實邊切換前沒有先下傳'
  - '距離、乘積、子樹和或答案使用 int 而溢位'
complexity:
  time: 'O((字元總數+操作數)log L)'
  space: 'O(L)'
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
  const int MAXN = (1<<21)+1e4;

  int n;
  int it;

  int head;
  int cnt;
  int ls[MAXN];
  int rs[MAXN];
  int sz[MAXN];
  char key[MAXN];
  bool rev[MAXN];
  double priority[MAXN];

  int newnode(char c){
      ++cnt;
      key[cnt]=c;
      sz[cnt]=1;
      priority[cnt]=(double)rand()/RAND_MAX;
      return cnt;
  }

  void up(int i) {
      sz[i] = sz[ls[i]] + sz[rs[i]] + 1;
  }

  void down(int i) {
      if (rev[i]) {
          swap(ls[i], rs[i]);
          rev[ls[i]] ^= 1;
          rev[rs[i]] ^= 1;
          rev[i] = false;
      }
  }

  void split(int l, int r, int i, int rank) {
      if (i == 0) {
          rs[l] = ls[r] = 0;
      } else {
          down(i);
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
          down(l);//下发懒信息
          rs[l] = merge(rs[l], r);
          up(l);
          return l;
      } else {
          down(r);
          ls[r] = merge(l, ls[r]);
          up(r);
          return r;
      }
  }

  char getrank(int rk){
      int u=head;
      while(u){
          down(u);
          if(sz[ls[u]]+1==rk){
              return key[u];
          }
          else if(sz[ls[u]]+1<rk){
              rk-=sz[ls[u]]+1;
              u=rs[u];
          }
          else{
              u=ls[u];
          }
      }
      return '\0'; // Return null character if not found
  }

  int main()
  {
      ios::sync_with_stdio(0);
      cin.tie(0),cout.tie(0);
      cin>>n;
      it=0;
      while(n--){
          string s;
          cin>>s;
          // cout<<' '<<s<<endl;
          if(s[0]=='M'){
              cin>>it;
          }
          else if(s[0]=='P'){
              it--;
          }
          else if(s[0]=='N'){
              it++;
          }
          else if(s[0]=='G'){
              char c=getrank(it+1);
              if(c=='\n'){
                  cout<<endl;
              }
              else{
                  cout<<c<<endl;
              }
          }
          else{
              int k;
              cin>>k;
              if(s[0]=='I'){
                  cin.get();
                  split(0,0,head,it);
                  int l=rs[0];
                  int r=ls[0];
                  getline(cin,s);
                  // cout<<"    888"<<s<<endl;
                  for(int i=1;i<=k;i++){
                      l=merge(l,newnode(s[i-1]));
                  }
                  head=merge(l,r);
              }
              else if(s[0]=='D'){
                  split(0,0,head,it+k);
                  int lm=rs[0];
                  int r=ls[0];
                  split(0,0,lm,it);
                  head=merge(rs[0],r);
              }
              else{
                  split(0,0,head,it+k);
                  int lm=rs[0];
                  int r=ls[0];
                  split(0,0,lm,it);
                  rev[ls[0]]^=1;
                  head=merge(merge(rs[0],ls[0]),r);
              }
          }
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P4567
external_platform: '洛谷'
external_problem_id: 'P4567'
external_title: '[AHOI2006] 文本編輯器'
external_relation: original
source_book_pages: [296, 299]
source_pdf_pages: [314, 317]
review_status: verified
---

題意、限制與輸入輸出已逐題對照官方題面或可信競賽存檔；解說以繁體中文獨立整理。
