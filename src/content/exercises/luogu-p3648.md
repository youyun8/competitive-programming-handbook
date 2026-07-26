---
id: luogu-p3648
volume: upper
source_file: upper-volume
title: 洛谷 P3648 序列分割
chapter: 5
section: '5.9'
kind: external-oj
difficulty: 5
topics: ['li-chao-tree', 'dynamic-programming']
prerequisites: ['dynamic-programming']
statement: >-
  非負整數序列重複切割 k 次；每次把一段切成兩段並獲得兩段元素和的乘積。最大化總得分，並輸出一組 k 個切點。
constraints:
  - 2 <= n <= 100000
  - 1 <= k < n 且 k <= 200
  - 元素為非負整數
  - 答案需 64 位
input_format: 第一行 n、k；第二行 n 個非負整數。
output_format: 第一行最大得分；第二行遞增輸出 k 個切點。
samples:
  - input: |-
      4 1
      1 2 3 4
    output: |-
      24
      3
    explanation: 在第三個元素後切割，兩段和為 6、4，得分 24。
core_knowledge: ['分割順序不變性', '前綴和', '方案重建']
judgment: 切割總分與執行順序無關；令前綴和 S，最後切點 j 的增量為 S[j]*(S[i]-S[j])，可化為直線最大值。
hints:
  - dp[g][i]=max_{j<i}(dp[g-1][j]+S[j]*(S[i]-S[j]))。
  - 候選 j 是斜率 S[j]、截距 dp_prev[j]-S[j]² 的直線，在 x=S[i] 查最大值。
  - 每層 Li Chao 線保存來源 j；記 parent[g][i]，由 (k,n) 反向重建切點。
solution_outline: >-
  每一切割層重建離散 Li Chao tree，依 i 遞增先加入 j=i-1 的合法前層直線，再查詢 S[i]。保存最佳線來源；最後沿 parent 回溯並反轉。
proof_or_invariant: >-
  對三段和 a,b,c，先切任一側的總分皆為 ab+ac+bc，因此切割順序不影響最終分數。固定最後邊界 j 得 DP；展開後候選是直線。Li Chao 查得所有 j<i 的最大值，parent 即實際達成該值的合法切點。
common_errors: ['查詢前加入 i 本身造成空段', '前綴和可重複卻使用除法斜率', '切點回溯後未反轉']
complexity:
  time: 'O(kn log n)'
  space: 'O(kn)'
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
  struct Line{long long m=0,b=numeric_limits<long long>::min()/4;int id=-1;long long value(long long x)const{return m*x+b;}};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,k;cin>>n>>k;vector<long long>s(n+1);for(int i=1;i<=n;i++){cin>>s[i];s[i]+=s[i-1];}vector<long long>xs=s;sort(xs.begin(),xs.end());xs.erase(unique(xs.begin(),xs.end()),xs.end());const long long neg=numeric_limits<long long>::min()/4;vector<long long>previous(n+1,0),current(n+1,neg);vector<vector<int>>parent(k+1,vector<int>(n+1,-1));for(int group=1;group<=k;group++){vector<Line>tree(xs.size()*4);auto add=[&](auto&&self,Line line,int node,int l,int r)->void{int mid=(l+r)/2;bool left=line.value(xs[l])>tree[node].value(xs[l]),middle=line.value(xs[mid])>tree[node].value(xs[mid]);if(middle)swap(line,tree[node]);if(l==r)return;if(left!=middle)self(self,line,node*2,l,mid);else self(self,line,node*2+1,mid+1,r);};auto query=[&](auto&&self,int index,int node,int l,int r)->Line{Line best=tree[node];if(l==r)return best;int mid=(l+r)/2;Line other=index<=mid?self(self,index,node*2,l,mid):self(self,index,node*2+1,mid+1,r);return other.value(xs[index])>best.value(xs[index])?other:best;};fill(current.begin(),current.end(),neg);for(int i=group+1;i<=n;i++){int j=i-1;if(previous[j]>neg/2)add(add,{s[j],previous[j]-s[j]*s[j],j},1,0,xs.size()-1);int index=lower_bound(xs.begin(),xs.end(),s[i])-xs.begin();Line best=query(query,index,1,0,xs.size()-1);current[i]=best.value(s[i]);parent[group][i]=best.id;}previous.swap(current);}cout<<previous[n]<<'\n';vector<int>cuts;for(int group=k,node=n;group>=1;group--){node=parent[group][node];cuts.push_back(node);}reverse(cuts.begin(),cuts.end());for(int i=0;i<k;i++)cout<<cuts[i]<<(i+1==k?'\n':' ');}
external_url: https://www.luogu.com.cn/problem/P3648
external_platform: 洛谷
external_problem_id: 'P3648'
external_title: 序列分割
external_relation: original
source_book_pages: [377]
source_pdf_pages: [395]
review_status: verified
---

切割次序不影響成對段和乘積；直線來源索引同時提供最優值與重建方案。
