---
id: luogu-p4248
volume: lower
source_file: lower-volume
title: 洛谷 P4248 差異
chapter: 9
section: '9.8'
kind: external-oj
difficulty: 5
topics: [suffix-array, lcp, monotonic-stack, subarray-minimum]
prerequisites: [suffix-array, monotonic-stack]
statement: 對字串所有後綴 Ti，求所有 i<j 的 len(Ti)+len(Tj)−2·lcp(Ti,Tj) 之和。
constraints: ['1 <= |S| <= 5*10^5', 'S 只含小寫英文字母', '答案需使用 64 位整數']
input_format: 一行字串 S。
output_format: 輸出所求總和。
samples:
  - input: "cacao\n"
    output: '54'
    explanation: 官方範例；另以直接枚舉所有後綴對與逐字 LCP 的短字串程式對拍。
core_knowledge: [後綴陣列, LCP 區間最小值, 所有子陣列最小值和]
judgment: 後綴按每個起點各算一個；只計 i<j。
hints:
  - 長度部分中，每個後綴長度出現在 n−1 對，總和為 (n−1)n(n+1)/2。
  - SA 中排名 l<r 的兩後綴 LCP，是 height[l+1..r] 的最小值；所有後綴對因此對應 height 陣列所有非空子陣列的最小值。
  - 單調遞增棧維護「以目前位置結尾的所有子陣列最小值和」，即可線性求全部 LCP 和。
solution_outline: O(n log n) 倍增加計數排序建立 SA，Kasai 求相鄰 LCP。掃 height[1..n−1]，以 (值,合併段數) 單調棧累計所有子陣列最小值；最後由固定長度總和減去兩倍 LCP 總和。
proof_or_invariant: 每對後綴在 SA 排名區間唯一對應一個 height 子陣列，其最小值恰為兩者 LCP，故所有對 LCP 和等於所有非空子陣列最小值和。棧合併所有尾端值不小於 x 的區段後，精確更新以目前位置結尾的最小值總和。
common_errors: [height 索引多算根本不存在的空區間, 單調棧只求最近較小而未乘覆蓋段數, 長度總和或乘二使用 32 位溢位]
complexity: { time: 'O(n log n)', space: 'O(n)' }
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);/* TODO：SA/LCP，將所有後綴對 LCP 化為 height 子陣列最小值和。*/return 0;}
cpp_solution: |
  #include <algorithm>
  #include <iostream>
  #include <string>
  #include <utility>
  #include <vector>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);string s;cin>>s;int n=static_cast<int>(s.size()),classes=256;vector<int>sa(static_cast<size_t>(n)),rank_of(static_cast<size_t>(n)),next_rank(static_cast<size_t>(n)),by_second;vector<int>count(static_cast<size_t>(max(n,256)+1));for(int i=0;i<n;++i){rank_of[static_cast<size_t>(i)]=static_cast<unsigned char>(s[static_cast<size_t>(i)]);++count[static_cast<size_t>(rank_of[static_cast<size_t>(i)])];}for(int i=1;i<classes;++i)count[static_cast<size_t>(i)]+=count[static_cast<size_t>(i-1)];for(int i=n-1;i>=0;--i)sa[static_cast<size_t>(--count[static_cast<size_t>(rank_of[static_cast<size_t>(i)])])]=i;for(int length=1;length<n;length<<=1){by_second.clear();by_second.reserve(static_cast<size_t>(n));for(int i=n-length;i<n;++i)by_second.push_back(i);for(int value:sa)if(value>=length)by_second.push_back(value-length);fill(count.begin(),count.end(),0);for(int value:rank_of)++count[static_cast<size_t>(value)];for(int i=1;i<classes;++i)count[static_cast<size_t>(i)]+=count[static_cast<size_t>(i-1)];for(int i=n-1;i>=0;--i){int position=by_second[static_cast<size_t>(i)];sa[static_cast<size_t>(--count[static_cast<size_t>(rank_of[static_cast<size_t>(position)])])]=position;}next_rank[static_cast<size_t>(sa[0])]=0;int new_classes=1;for(int i=1;i<n;++i){int x=sa[static_cast<size_t>(i-1)],y=sa[static_cast<size_t>(i)],x2=x+length<n?rank_of[static_cast<size_t>(x+length)]:-1,y2=y+length<n?rank_of[static_cast<size_t>(y+length)]:-1;if(rank_of[static_cast<size_t>(x)]!=rank_of[static_cast<size_t>(y)]||x2!=y2)++new_classes;next_rank[static_cast<size_t>(y)]=new_classes-1;}rank_of=next_rank;classes=new_classes;if(classes==n)break;}for(int i=0;i<n;++i)rank_of[static_cast<size_t>(sa[static_cast<size_t>(i)])]=i;vector<int>height(static_cast<size_t>(n));for(int i=0,matched=0;i<n;++i){int rank=rank_of[static_cast<size_t>(i)];if(rank==0)continue;int previous=sa[static_cast<size_t>(rank-1)];while(i+matched<n&&previous+matched<n&&s[static_cast<size_t>(i+matched)]==s[static_cast<size_t>(previous+matched)])++matched;height[static_cast<size_t>(rank)]=matched;if(matched>0)--matched;}vector<pair<int,long long>>stack;long long ending_sum=0,lcp_sum=0;for(int i=1;i<n;++i){int value=height[static_cast<size_t>(i)];long long ways=1;while(!stack.empty()&&stack.back().first>=value){ending_sum-=static_cast<long long>(stack.back().first)*stack.back().second;ways+=stack.back().second;stack.pop_back();}stack.push_back({value,ways});ending_sum+=static_cast<long long>(value)*ways;lcp_sum+=ending_sum;}long long nn=n;long long length_sum=(nn-1)*nn*(nn+1)/2;cout<<length_sum-2*lcp_sum<<'\n';}
external_url: https://www.luogu.com.cn/problem/P4248
external_platform: 洛谷
external_problem_id: P4248
external_title: '[AHOI2013] 差異'
external_relation: original
source_book_pages: [596, 599]
source_pdf_pages: [226, 229]
review_status: verified
---

後綴對的 LCP 看似二次數量，放到 SA 上卻正好是 height 所有子陣列的最小值，能用單調棧一次加總。
