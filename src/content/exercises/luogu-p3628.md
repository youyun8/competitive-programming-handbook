---
id: luogu-p3628
volume: upper
source_file: upper-volume
title: 洛谷 P3628 特別行動隊
chapter: 5
section: '5.9'
kind: external-oj
difficulty: 4
topics: ['li-chao-tree', 'dynamic-programming']
prerequisites: ['dynamic-programming']
statement: >-
  依序有 n 名隊員、戰力 x_i。把序列分成連續小隊；戰力和為 X 的小隊收益為 aX²+bX+c，求總收益最大值。
constraints:
  - 1 <= n <= 1000000
  - a<0
  - 前綴和與答案在 64 位範圍
input_format: 第一行 n；第二行 a、b、c；第三部分給 n 個戰力。
output_format: 輸出最大總收益。
samples:
  - input: |-
      1
      -1 2 3
      1
    output: |-
      4
    explanation: 唯一小隊戰力和為 1，收益 -1+2+3=4。
core_knowledge: ['平方分段收益', '直線最大值', '離散 Li Chao']
judgment: 最後一隊 j+1..i 的平方展開後，j 對 prefix[i] 貢獻是一條直線；需動態加入並查最大值。
hints:
  - dp[i]=max_j(dp[j]+a(S_i-S_j)²+b(S_i-S_j)+c)。
  - 直線斜率為 -2aS_j，截距為 dp[j]+aS_j²-bS_j。
  - 以所有前綴和作離散 x 座標，用 Li Chao tree 插線與查詢，避免斜率順序假設。
solution_outline: >-
  預先計算前綴和並建離散 Li Chao 樹；先加入 j=0 的直線。依 i 查最大直線值，加共同項得到 dp[i]，再加入 i 的直線。
proof_or_invariant: >-
  平方展開把每個 j 的候選精確寫成共同項加線性函數。Li Chao 節點保留在區間中點較優的線，較差線只可能在一側反超並遞迴至該側，因此每個座標的最大線值不會遺失。
common_errors: ['求最大值卻初始化為正無窮', '漏加 j=0 候選', '平方與乘法使用 int']
complexity:
  time: 'O(n log n)'
  space: 'O(n)'
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：依狀態定義完成初始化、轉移與答案輸出。
      return 0;
  }
cpp_solution: |
  #include <algorithm>
  #include <iostream>
  #include <limits>
  #include <vector>
  using namespace std;
  struct Line{long long m=0,b=numeric_limits<long long>::min()/4;long long value(long long x)const{return m*x+b;}};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;long long a,b,c;cin>>n>>a>>b>>c;vector<long long>s(n+1),dp(n+1);for(int i=1;i<=n;i++){cin>>s[i];s[i]+=s[i-1];}vector<long long>xs=s;sort(xs.begin(),xs.end());xs.erase(unique(xs.begin(),xs.end()),xs.end());vector<Line>tree(xs.size()*4);auto add=[&](auto&&self,Line line,int node,int left,int right)->void{int mid=(left+right)/2;bool low=line.value(xs[left])>tree[node].value(xs[left]),middle=line.value(xs[mid])>tree[node].value(xs[mid]);if(middle)swap(line,tree[node]);if(left==right)return;if(low!=middle)self(self,line,node*2,left,mid);else self(self,line,node*2+1,mid+1,right);};auto query=[&](auto&&self,int index,int node,int left,int right)->long long{long long result=tree[node].value(xs[index]);if(left==right)return result;int mid=(left+right)/2;if(index<=mid)result=max(result,self(self,index,node*2,left,mid));else result=max(result,self(self,index,node*2+1,mid+1,right));return result;};auto line=[&](int j){return Line{-2*a*s[j],dp[j]+a*s[j]*s[j]-b*s[j]};};add(add,line(0),1,0,xs.size()-1);for(int i=1;i<=n;i++){int index=lower_bound(xs.begin(),xs.end(),s[i])-xs.begin();dp[i]=a*s[i]*s[i]+b*s[i]+c+query(query,index,1,0,xs.size()-1);add(add,line(i),1,0,xs.size()-1);}cout<<dp[n]<<'\n';}
external_url: https://www.luogu.com.cn/problem/P3628
external_platform: 洛谷
external_problem_id: 'P3628'
external_title: 特別行動隊
external_relation: original
source_book_pages: [377]
source_pdf_pages: [395]
review_status: verified
---

Li Chao tree 直接維護展開後的候選直線，不依賴斜率或前綴和的額外單調條件。
