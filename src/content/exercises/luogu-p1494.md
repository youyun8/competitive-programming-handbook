---
id: luogu-p1494
volume: upper
source_file: upper-volume
source_book_pages: [197, 220]
source_pdf_pages: [215, 238]
chapter: 4
section: '4.5'
kind: external-oj
review_status: verified
external_relation: original
title: 洛谷 P1494 小 Z 的襪子：莫隊維護同色機率
difficulty: 4
topics: [莫隊, 組合計數, 分數約分]
prerequisites: [mo-algorithm]
statement: 從指定區間等機率抽出兩隻不同襪子，求兩襪同色的機率，以最簡分數輸出；區間長度不足二時輸出 0/1。
constraints:
  - '1 <= n,m <= 50000'
  - '1 <= color_i <= n'
  - '1 <= l <= r <= n'
input_format: 第一行 n、m，第二行襪子顏色；接著 m 行 l、r。
output_format: 每個詢問輸出最簡分數 numerator/denominator。
samples:
  - input: |
      5 3
      1 2 1 2 1
      1 5
      2 4
      3 3
    output: |
      2/5
      1/3
      0/1
    explanation: 全區間同色對有 C(3,2)+C(2,2)=4，總對數 10；第二段三隻中只有兩隻顏色 2 相同。
core_knowledge: [同色有序對增量, 莫隊窗口, gcd]
judgment: 查詢可離線，加入或移除一隻襪子能由其目前頻率 O(1) 更新同色對數，符合莫隊條件。
hints:
  - 維護 ordered_pairs=Σ count[color]×(count[color]-1)，加入前頻率 c 時增量為 2c。
  - 分母可用 length×(length-1)，與有序對分子同除二後機率不變。
  - 依左端塊、右端奇偶排序移動窗口，記錄後用 gcd 約分。
solution_outline: 莫隊排序所有詢問，維護顏色頻率與同色有序對數；答案分母為區間有序抽法數，最後約分。
proof_or_invariant: ordered_pairs 精確計數兩個位置不同且同色的有序選法，denominator 計數所有有序選法，兩者比值即所求機率；增減公式維持不變量。
complexity:
  time: O((n+m)sqrt(n))
  space: O(n+m)
common_errors:
  - 移除時使用移除前頻率的錯誤增量
  - 區間長一時對零分母取 gcd
  - 分子與分母使用 32 位元而溢位
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;cin>>n>>m;vector<int>a(static_cast<size_t>(n+1));for(int i=1;i<=n;++i)cin>>a[static_cast<size_t>(i)];while(m--){int l,r;cin>>l>>r;map<int,long long>count;for(int i=l;i<=r;++i)++count[a[static_cast<size_t>(i)]];long long numerator=0;for(auto [color,c]:count){(void)color;numerator+=c*(c-1);}long long denominator=static_cast<long long>(r-l+1)*(r-l);if(denominator==0){cout<<"0/1\n";continue;}long long divisor=gcd(numerator,denominator);cout<<numerator/divisor<<'/'<<denominator/divisor<<'\n';}}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  struct Query{int left,right,index;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;cin>>n>>m;vector<int>a(static_cast<size_t>(n+1));for(int i=1;i<=n;++i)cin>>a[static_cast<size_t>(i)];vector<Query>query(static_cast<size_t>(m));for(int i=0;i<m;++i){cin>>query[static_cast<size_t>(i)].left>>query[static_cast<size_t>(i)].right;query[static_cast<size_t>(i)].index=i;}int block=max(1,static_cast<int>(sqrt(static_cast<double>(n))));sort(query.begin(),query.end(),[block](const Query&x,const Query&y){int xb=x.left/block,yb=y.left/block;return xb!=yb?xb<yb:((xb&1)!=0?x.right>y.right:x.right<y.right);});vector<int>frequency(static_cast<size_t>(n+1));vector<pair<long long,long long>>answer(static_cast<size_t>(m));int left=1,right=0;long long same=0;auto add=[&](int position){int color=a[static_cast<size_t>(position)];same+=2LL*frequency[static_cast<size_t>(color)]++;};auto remove=[&](int position){int color=a[static_cast<size_t>(position)];same-=2LL*--frequency[static_cast<size_t>(color)];};for(const Query&item:query){while(left>item.left)add(--left);while(right<item.right)add(++right);while(left<item.left)remove(left++);while(right>item.right)remove(right--);long long length=item.right-item.left+1,denominator=length*(length-1);if(denominator==0)answer[static_cast<size_t>(item.index)]={0,1};else{long long divisor=gcd(same,denominator);answer[static_cast<size_t>(item.index)]={same/divisor,denominator/divisor};}}for(auto [numerator,denominator]:answer)cout<<numerator<<'/'<<denominator<<'\n';}
external_url: https://www.luogu.com.cn/problem/P1494
external_platform: 洛谷
external_problem_id: P1494
external_title: '[国家集训队] 小 Z 的袜子'
---

選兩件物品的機率題，先把分子改寫成頻率的可增量統計量，往往就能套用莫隊。
