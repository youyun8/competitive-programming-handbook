---
id: luogu-p2178
volume: lower
source_file: lower-volume
title: 洛谷 P2178 品酒大會
chapter: 9
section: '9.7'
kind: external-oj
difficulty: 5
topics: [suffix-array, lcp, disjoint-set-union, offline-processing]
prerequisites: [suffix-array, disjoint-set-union]
statement: 對每個 r=0..n−1，統計起點不同且長度 r 前綴相同的後綴對數，並求這些起點美味度乘積最大值；無合法對輸出 0 0。
constraints: ['1 <= n <= 3*10^5', 'S 只含小寫字母', '|a_i| <= 10^9']
input_format: 第一行 n，第二行 S，第三行 n 個美味度。
output_format: 依 r=0..n−1 各輸出方案數與最大乘積。
samples:
  - input: "2\naa\n-2 3\n"
    output: "1 -6\n1 -6"
    explanation: 唯一一對後綴 LCP 為 1，所以對 r=0、1 都合法；另以枚舉所有後綴對及直接 LCP 對拍。
core_knowledge: [相鄰後綴 LCP 邊, Kruskal 重構觀點, DSU 極值維護]
judgment: 每對無序起點只計一次；乘積可為負數，只有無方案時最大值才輸出 0。
hints:
  - 把 SA 相鄰排名連邊，邊權為 height；兩點在只保留權重至少 r 的邊時連通，當且僅當兩後綴 LCP 至少 r。
  - 將邊按權重由大到小合併；兩個分量合併新增 size_x×size_y 對，其 LCP 門檻恰在目前權重首次成立。
  - 分量維護美味度最小與最大值；跨分量最大乘積只需比較 min_x·min_y 與 max_x·max_y，再對 r 做後綴累加。
solution_outline: 建 SA、Kasai height，把每個相鄰排名形成一條帶權邊。降序以 DSU 合併，於對應權重累加新增對數及跨分量最大乘積；最後由 n−2 到 0 對答案做後綴和/最大值傳遞。
proof_or_invariant: SA 區間中相鄰 LCP 的最小值就是兩端 LCP，因此權重至少 r 的相鄰邊連通塊恰為共享長度 r 前綴的後綴集合。降序合併時每對起點只在首次連通時被兩分量笛卡兒積計入一次；分量極值涵蓋所有可能最大跨乘積。
common_errors: [負數情況只維護最大值, 同一對在多次合併重複計數, 沒把精確門檻答案向較小 r 累加]
complexity: { time: 'O(n log n)', space: 'O(n)' }
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);/* TODO：SA 相鄰 LCP 邊降序做 DSU。*/return 0;}
cpp_solution: |
  #include <algorithm>
  #include <iostream>
  #include <limits>
  #include <numeric>
  #include <string>
  #include <tuple>
  #include <utility>
  #include <vector>
  using namespace std;
  struct Dsu{vector<int>parent,size;vector<long long>minimum,maximum;explicit Dsu(const vector<long long>&value):parent(value.size()),size(value.size(),1),minimum(value),maximum(value){iota(parent.begin(),parent.end(),0);}int find(int x){return parent[static_cast<size_t>(x)]==x?x:parent[static_cast<size_t>(x)]=find(parent[static_cast<size_t>(x)]);}pair<long long,long long>join(int x,int y){x=find(x);y=find(y);long long pairs=static_cast<long long>(size[static_cast<size_t>(x)])*size[static_cast<size_t>(y)];long long product=max(minimum[static_cast<size_t>(x)]*minimum[static_cast<size_t>(y)],maximum[static_cast<size_t>(x)]*maximum[static_cast<size_t>(y)]);if(size[static_cast<size_t>(x)]<size[static_cast<size_t>(y)])swap(x,y);parent[static_cast<size_t>(y)]=x;size[static_cast<size_t>(x)]+=size[static_cast<size_t>(y)];minimum[static_cast<size_t>(x)]=min(minimum[static_cast<size_t>(x)],minimum[static_cast<size_t>(y)]);maximum[static_cast<size_t>(x)]=max(maximum[static_cast<size_t>(x)],maximum[static_cast<size_t>(y)]);return {pairs,product};}};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n=0;string s;cin>>n>>s;vector<long long>value(static_cast<size_t>(n));for(long long&x:value)cin>>x;vector<int>sa(static_cast<size_t>(n)),rank_of(static_cast<size_t>(n)),next_rank(static_cast<size_t>(n)),count(static_cast<size_t>(max(n,256)+1)),second;int classes=256;for(int i=0;i<n;++i){rank_of[static_cast<size_t>(i)]=static_cast<unsigned char>(s[static_cast<size_t>(i)]);++count[static_cast<size_t>(rank_of[static_cast<size_t>(i)])];}for(int i=1;i<classes;++i)count[static_cast<size_t>(i)]+=count[static_cast<size_t>(i-1)];for(int i=n-1;i>=0;--i)sa[static_cast<size_t>(--count[static_cast<size_t>(rank_of[static_cast<size_t>(i)])])]=i;for(int length=1;length<n;length<<=1){second.clear();for(int i=n-length;i<n;++i)second.push_back(i);for(int position:sa)if(position>=length)second.push_back(position-length);fill(count.begin(),count.end(),0);for(int rank:rank_of)++count[static_cast<size_t>(rank)];for(int i=1;i<classes;++i)count[static_cast<size_t>(i)]+=count[static_cast<size_t>(i-1)];for(int i=n-1;i>=0;--i){int position=second[static_cast<size_t>(i)];sa[static_cast<size_t>(--count[static_cast<size_t>(rank_of[static_cast<size_t>(position)])])]=position;}next_rank[static_cast<size_t>(sa[0])]=0;int new_classes=1;for(int i=1;i<n;++i){int x=sa[static_cast<size_t>(i-1)],y=sa[static_cast<size_t>(i)],x2=x+length<n?rank_of[static_cast<size_t>(x+length)]:-1,y2=y+length<n?rank_of[static_cast<size_t>(y+length)]:-1;if(rank_of[static_cast<size_t>(x)]!=rank_of[static_cast<size_t>(y)]||x2!=y2)++new_classes;next_rank[static_cast<size_t>(y)]=new_classes-1;}rank_of=next_rank;classes=new_classes;if(classes==n)break;}for(int i=0;i<n;++i)rank_of[static_cast<size_t>(sa[static_cast<size_t>(i)])]=i;vector<int>height(static_cast<size_t>(n));for(int i=0,matched=0;i<n;++i){int rank=rank_of[static_cast<size_t>(i)];if(rank==0)continue;int previous=sa[static_cast<size_t>(rank-1)];while(i+matched<n&&previous+matched<n&&s[static_cast<size_t>(i+matched)]==s[static_cast<size_t>(previous+matched)])++matched;height[static_cast<size_t>(rank)]=matched;if(matched>0)--matched;}vector<tuple<int,int,int>>edges;for(int rank=1;rank<n;++rank)edges.push_back({height[static_cast<size_t>(rank)],rank-1,rank});sort(edges.begin(),edges.end(),greater<tuple<int,int,int>>());vector<long long>rank_value(static_cast<size_t>(n));for(int rank=0;rank<n;++rank)rank_value[static_cast<size_t>(rank)]=value[static_cast<size_t>(sa[static_cast<size_t>(rank)])];Dsu dsu(rank_value);vector<long long>ways(static_cast<size_t>(n)),best(static_cast<size_t>(n),numeric_limits<long long>::lowest());for(auto [weight,x,y]:edges){auto [added,product]=dsu.join(x,y);ways[static_cast<size_t>(weight)]+=added;best[static_cast<size_t>(weight)]=max(best[static_cast<size_t>(weight)],product);}for(int r=n-2;r>=0;--r){ways[static_cast<size_t>(r)]+=ways[static_cast<size_t>(r+1)];best[static_cast<size_t>(r)]=max(best[static_cast<size_t>(r)],best[static_cast<size_t>(r+1)]);}for(int r=0;r<n;++r)cout<<ways[static_cast<size_t>(r)]<<' '<<(ways[static_cast<size_t>(r)]?best[static_cast<size_t>(r)]:0)<<'\n';}
external_url: https://www.luogu.com.cn/problem/P2178
external_platform: 洛谷
external_problem_id: P2178
external_title: '[NOI2015] 品酒大會'
external_relation: original
source_book_pages: [587, 595]
source_pdf_pages: [217, 225]
review_status: verified
---

把 height 視為相鄰後綴間的邊權後，所有相似度門檻可由一次離線 Kruskal 式合併得到。
