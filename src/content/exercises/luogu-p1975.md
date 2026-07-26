---
id: luogu-p1975
volume: upper
source_file: upper-volume
source_book_pages: [197, 220]
source_pdf_pages: [215, 238]
chapter: 4
section: '4.5'
kind: external-oj
review_status: verified
external_relation: original
title: 洛谷 P1975 排隊：交換位置後的逆序對
difficulty: 5
topics: [動態逆序對, 分塊, 區間排名]
prerequisites: [fenwick-tree, sqrt-decomposition]
statement: 給定小朋友身高序列，先輸出初始逆序對數。每次交換任意兩個位置後，再輸出目前逆序對數；相同身高不構成逆序對。
constraints:
  - '1 <= n <= 20000，1 <= m <= 2000'
  - '1 <= h_i <= 10^9'
  - 每次交換兩個不同且合法的位置
input_format: 第一行 n，第二行身高，第三行 m，接著 m 行各給兩個交換位置。
output_format: 共 m+1 行，先輸出初始逆序對數，再輸出每次交換後結果。
samples:
  - input: |
      3
      130 150 140
      2
      2 3
      1 3
    output: |
      1
      0
      3
    explanation: 初始只有 (150,140)；第一次交換後遞增；第二次成為 150、140、130，共三個逆序對。
core_knowledge: [交換增量, 區間小於與大於計數, 塊內有序表]
judgment: 交換 x、y 只改變兩端元素與中間元素的配對；分塊可在 O(sqrt(n) log n) 求中段排名並更新兩塊。
hints:
  - 先用 BIT 求初始逆序對，身高需離散化但重複值不可視為逆序。
  - 假設 x<y，列出中間每個值與 a_x、a_y 在交換前後的四個比較。
  - 每塊保存排序副本；區間小於用 lower_bound，大於用 upper_bound，散塊逐點。
solution_outline: 離散化後以 BIT 求初值。每次交換用分塊區間排名計算中間元素貢獻差，加上端點配對差，再更新兩個塊的排序副本。
proof_or_invariant: 不含 x、y 的任意配對不受交換影響。公式逐一扣除兩端與每個中間元素的舊關係並加入新關係，另處理 (x,y)，涵蓋且僅涵蓋所有改變的配對。
complexity:
  time: 初始 O(n log n)，每次交換 O(sqrt(n) log n)
  space: O(n)
common_errors:
  - 相同身高誤算為逆序對
  - 忘記單獨處理交換兩端彼此的配對
  - 交換同一塊內兩值時錯誤重建或重複刪除
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  static long long inversions(const vector<int>&a){long long answer=0;for(size_t i=1;i<a.size();++i)for(size_t j=i+1;j<a.size();++j)answer+=a[i]>a[j];return answer;}
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;cin>>n;vector<int>a(static_cast<size_t>(n+1));for(int i=1;i<=n;++i)cin>>a[static_cast<size_t>(i)];cout<<inversions(a)<<'\n';int m;cin>>m;while(m--){int x,y;cin>>x>>y;swap(a[static_cast<size_t>(x)],a[static_cast<size_t>(y)]);cout<<inversions(a)<<'\n';}}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  class Fenwick{public:explicit Fenwick(int n):t(static_cast<size_t>(n+1)){}void add(int p){for(size_t i=static_cast<size_t>(p);i<t.size();i+=i&(~i+1U))++t[i];}int sum(int p)const{int s=0;for(size_t i=static_cast<size_t>(p);i>0;i-=i&(~i+1U))s+=t[i];return s;}private:vector<int>t;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;cin>>n;vector<int>a(static_cast<size_t>(n+1)),values;for(int i=1;i<=n;++i){cin>>a[static_cast<size_t>(i)];values.push_back(a[static_cast<size_t>(i)]);}sort(values.begin(),values.end());values.erase(unique(values.begin(),values.end()),values.end());for(int i=1;i<=n;++i)a[static_cast<size_t>(i)]=static_cast<int>(lower_bound(values.begin(),values.end(),a[static_cast<size_t>(i)])-values.begin())+1;Fenwick bit(static_cast<int>(values.size()));long long answer=0;for(int i=n;i>=1;--i){answer+=bit.sum(a[static_cast<size_t>(i)]-1);bit.add(a[static_cast<size_t>(i)]);}int length=max(1,static_cast<int>(sqrt(static_cast<double>(n))));int blocks=(n+length-1)/length;vector<vector<int>>sorted(static_cast<size_t>(blocks));for(int i=1;i<=n;++i)sorted[static_cast<size_t>((i-1)/length)].push_back(a[static_cast<size_t>(i)]);for(auto&v:sorted)sort(v.begin(),v.end());auto count_less=[&](int l,int r,int value){int result=0;if(l>r)return result;while(l<=r&&(l-1)%length!=0)result+=a[static_cast<size_t>(l++)]<value;while(l+length-1<=r){const auto&v=sorted[static_cast<size_t>((l-1)/length)];result+=static_cast<int>(lower_bound(v.begin(),v.end(),value)-v.begin());l+=length;}while(l<=r)result+=a[static_cast<size_t>(l++)]<value;return result;};auto count_greater=[&](int l,int r,int value){int result=0;if(l>r)return result;while(l<=r&&(l-1)%length!=0)result+=a[static_cast<size_t>(l++)]>value;while(l+length-1<=r){const auto&v=sorted[static_cast<size_t>((l-1)/length)];result+=static_cast<int>(v.end()-upper_bound(v.begin(),v.end(),value));l+=length;}while(l<=r)result+=a[static_cast<size_t>(l++)]>value;return result;};cout<<answer<<'\n';int m;cin>>m;while(m--){int x,y;cin>>x>>y;if(x>y)swap(x,y);int left=a[static_cast<size_t>(x)],right=a[static_cast<size_t>(y)];answer+=count_less(x+1,y-1,right)+count_greater(x+1,y-1,left)-count_less(x+1,y-1,left)-count_greater(x+1,y-1,right);answer+=(right>left)-(left>right);int bx=(x-1)/length,by=(y-1)/length;auto replace=[&](int b,int old_value,int new_value){auto&v=sorted[static_cast<size_t>(b)];v.erase(lower_bound(v.begin(),v.end(),old_value));v.insert(lower_bound(v.begin(),v.end(),new_value),new_value);};if(by!=bx){replace(bx,left,right);replace(by,right,left);}swap(a[static_cast<size_t>(x)],a[static_cast<size_t>(y)]);cout<<answer<<'\n';}}
external_url: https://www.luogu.com.cn/problem/P1975
external_platform: 洛谷
external_problem_id: P1975
external_title: '[国家集训队] 排队'
---

動態逆序對不必重算全域；交換只影響穿過兩個端點的配對。
