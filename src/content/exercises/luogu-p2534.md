---
id: luogu-p2534
volume: upper
source_file: upper-volume
title: 洛谷 P2534 [AHOI2012] 鐵盤整理
chapter: 3
section: '3.9'
kind: external-oj
difficulty: 4
topics: [ida-star, pancake-sorting]
prerequisites: [coordinate-compression]
statement: 給定由上到下的不同鐵盤半徑，每次可將最上方若干盤整段翻轉，求使半徑由小到大排列的最少翻轉次數。
constraints: [1 <= N <= 50, 1 <= R_i <= 100, 所有半徑互異]
input_format: 第一行 N；第二行 N 個半徑。
output_format: 輸出最少翻轉次數。
samples:
  - input: |
      5
      2 4 3 5 1
    output: '5'
    explanation: 最少需五次前綴翻轉才能由小到大。
core_knowledge: [IDA*, 斷點下界, 座標壓縮]
judgment: 翻轉的是非空前綴；半徑大小只影響相對排名。
hints:
  - 先把半徑替換成 1..N 的排名，目標即 1,2,…,N。
  - 把底部視為接著虛擬盤 N+1；相鄰排名差不為 1 的位置稱為斷點。
  - 一次前綴翻轉只會改變前綴與後綴交界的一個斷點，因此斷點數是剩餘步數下界。
solution_outline: 壓縮為排名後做 IDA*。估價為含底部虛擬盤的斷點數；枚舉翻轉長度 2..N，略過立即撤銷上一步的操作。
proof_or_invariant: 前綴內所有相鄰對只顛倒方向，絕對排名差不變；一次操作只改變前綴末端與下一盤（或虛擬底盤）的鄰接，故最多消除一個斷點。斷點數不高估。IDA* 逐深度完整枚舉，第一個零斷點狀態必為遞增目標且深度最小。
complexity: { time: '最壞 O(N^D)，D 為最少翻轉數；IDA* 下界剪枝', space: O(N+D) }
common_errors: [未加入底部虛擬盤導致全遞減狀態下界為零, 用原半徑差一而非排名差一, 允許連續兩次相同翻轉]
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;cin>>n;vector<int>a(n);for(int&x:a)cin>>x;/* TODO: 排名壓縮並做 IDA*。*/cout<<0<<'\n';}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;cin>>n;vector<int>a(n),sorted;for(int&x:a)cin>>x;sorted=a;sort(sorted.begin(),sorted.end());for(int&x:a)x=static_cast<int>(lower_bound(sorted.begin(),sorted.end(),x)-sorted.begin())+1;const auto heuristic=[&](){int bad=0;for(int i=0;i+1<n;++i)if(abs(a[i]-a[i+1])!=1)++bad;if(abs(a[n-1]-(n+1))!=1)++bad;return bad;};const auto dfs=[&](const auto&self,int depth,int limit,int previous)->bool{int estimate=heuristic();if(depth+estimate>limit)return false;if(estimate==0)return true;for(int length=2;length<=n;++length){if(length==previous)continue;reverse(a.begin(),a.begin()+length);if(self(self,depth+1,limit,length))return true;reverse(a.begin(),a.begin()+length);}return false;};for(int limit=heuristic();;++limit)if(dfs(dfs,0,limit,-1)){cout<<limit<<'\n';break;}}
external_url: https://www.luogu.com.cn/problem/P2534
external_platform: 洛谷
external_problem_id: P2534
external_title: '[AHOI2012] 鐵盤整理'
external_relation: original
source_book_pages: [97, 149]
source_pdf_pages: [115, 167]
review_status: verified
---

斷點下界的安全性來自「前綴內部鄰接只反向、絕對差不變」。
