---
id: luogu-p1117
volume: lower
source_file: lower-volume
title: 洛谷 P1117 優秀的拆分
chapter: 9
section: '9.7'
kind: external-oj
difficulty: 5
topics: [suffix-array, lcp, tandem-repeat, difference-array]
prerequisites: [suffix-array, range-minimum-query, difference-array]
statement: 若一個子串能按某切點拆成 AABB（A、B 皆非空），此拆分算一次。統計原串所有位置子串的所有優秀拆分總數。
constraints: ['1 <= T <= 10', '1 <= |S| <= 30000', 'S 只含小寫英文字母', '不同位置或不同切點分別計數']
input_format: 第一行 T，接著 T 行各一個字串。
output_format: 每組輸出一行優秀拆分總數。
samples:
  - input: "4\naabbbb\ncccccc\naabaabaabaa\nbbaabaababaaba\n"
    output: "3\n5\n4\n7"
    explanation: 官方完整範例；例如 aabbbb 有 aa、bbbb 兩段平方串形成 AABB。另以枚舉所有子串、切點及 A/B 長度的短字串程式對拍。
core_knowledge: [平方串端點計數, 正反 LCP, 調和級數枚舉, 區間差分]
judgment: A 可等於 B；同內容在不同位置仍分別計；同一子串的不同切點也分別計。
hints:
  - 若令 start[i] 為從 i 開始的 AA 數量、finish[i] 為在 i 結束的 AA 數量，答案是 Σ finish[i]·start[i+1]。
  - 枚舉半長 L，固定相距 L 的兩錨點；向右 LCP 與向左 LCS 的和至少 L 時，存在跨過錨點的長度 2L 平方串。
  - 可行平方串起點形成連續區間；用差分同時更新 start 與 finish。正反 SA 加 RMQ 可 O(1) 求 LCP/LCS。
solution_outline: 對原串與反串各建 SA、Kasai height、稀疏表。枚舉 L，再每隔 L 取相鄰錨點，以 LCP/LCS 算所有跨該錨點且不重複歸屬的平方串起點區間，差分加入 start/finish。還原差分後，枚舉 AABB 中間切點乘法累加。
proof_or_invariant: 每個長度 2L 的平方串左半段恰跨過一個 L 倍數錨點，因此只被對應錨點枚舉一次。兩錨點向左右相同的總延伸覆蓋 L 當且僅當可形成平方串，截斷後的連續起點區間正是全部可行位置。任一 AABB 拆分唯一對應左側結束的 AA 與右側開始的 BB，乘積求和不重不漏。
common_errors: [把不同切點去重, LCS 包含錨點時下標少一, 平方串可行區間未限制在唯一錨點窗口, 計數使用 32 位溢位]
complexity: { time: 'O(n log n)', space: 'O(n log n)' }
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);/* TODO：正反 SA 求 LCP/LCS，枚舉週期差分平方串端點。*/return 0;}
cpp_solution: |
  #include <algorithm>
  #include <iostream>
  #include <string>
  #include <utility>
  #include <vector>
  using namespace std;
  class SuffixLcp{
      int n;
      vector<int> rank_of,logarithm;
      vector<vector<int>> table;
  public:
      explicit SuffixLcp(const string& text):n(static_cast<int>(text.size())),rank_of(static_cast<size_t>(n)){
          vector<int> sa(static_cast<size_t>(n)),next_rank(static_cast<size_t>(n)),count(static_cast<size_t>(max(n,256)+1)),second;
          int classes=256;
          for(int i=0;i<n;++i){rank_of[static_cast<size_t>(i)]=static_cast<unsigned char>(text[static_cast<size_t>(i)]);++count[static_cast<size_t>(rank_of[static_cast<size_t>(i)])];}
          for(int i=1;i<classes;++i)count[static_cast<size_t>(i)]+=count[static_cast<size_t>(i-1)];
          for(int i=n-1;i>=0;--i)sa[static_cast<size_t>(--count[static_cast<size_t>(rank_of[static_cast<size_t>(i)])])]=i;
          for(int length=1;length<n;length<<=1){
              second.clear();second.reserve(static_cast<size_t>(n));
              for(int i=n-length;i<n;++i)second.push_back(i);
              for(int position:sa)if(position>=length)second.push_back(position-length);
              fill(count.begin(),count.end(),0);
              for(int rank:rank_of)++count[static_cast<size_t>(rank)];
              for(int i=1;i<classes;++i)count[static_cast<size_t>(i)]+=count[static_cast<size_t>(i-1)];
              for(int i=n-1;i>=0;--i){int position=second[static_cast<size_t>(i)];sa[static_cast<size_t>(--count[static_cast<size_t>(rank_of[static_cast<size_t>(position)])])]=position;}
              next_rank[static_cast<size_t>(sa[0])]=0;int next_classes=1;
              for(int i=1;i<n;++i){int x=sa[static_cast<size_t>(i-1)],y=sa[static_cast<size_t>(i)],x2=x+length<n?rank_of[static_cast<size_t>(x+length)]:-1,y2=y+length<n?rank_of[static_cast<size_t>(y+length)]:-1;if(rank_of[static_cast<size_t>(x)]!=rank_of[static_cast<size_t>(y)]||x2!=y2)++next_classes;next_rank[static_cast<size_t>(y)]=next_classes-1;}
              rank_of=next_rank;classes=next_classes;if(classes==n)break;
          }
          for(int i=0;i<n;++i)rank_of[static_cast<size_t>(sa[static_cast<size_t>(i)])]=i;
          vector<int> height(static_cast<size_t>(n));
          for(int i=0,matched=0;i<n;++i){int rank=rank_of[static_cast<size_t>(i)];if(rank==0)continue;int previous=sa[static_cast<size_t>(rank-1)];while(i+matched<n&&previous+matched<n&&text[static_cast<size_t>(i+matched)]==text[static_cast<size_t>(previous+matched)])++matched;height[static_cast<size_t>(rank)]=matched;if(matched>0)--matched;}
          logarithm.assign(static_cast<size_t>(n+1),0);for(int i=2;i<=n;++i)logarithm[static_cast<size_t>(i)]=logarithm[static_cast<size_t>(i/2)]+1;
          int levels=logarithm[static_cast<size_t>(n)]+1;table.assign(static_cast<size_t>(levels),height);
          for(int level=1;(1<<level)<=n;++level)for(int i=0;i+(1<<level)<=n;++i)table[static_cast<size_t>(level)][static_cast<size_t>(i)]=min(table[static_cast<size_t>(level-1)][static_cast<size_t>(i)],table[static_cast<size_t>(level-1)][static_cast<size_t>(i+(1<<(level-1)))]);
      }
      int lcp(int x,int y)const{
          if(x==y)return n-x;
          int left=rank_of[static_cast<size_t>(x)],right=rank_of[static_cast<size_t>(y)];if(left>right)swap(left,right);++left;
          int level=logarithm[static_cast<size_t>(right-left+1)];
          return min(table[static_cast<size_t>(level)][static_cast<size_t>(left)],table[static_cast<size_t>(level)][static_cast<size_t>(right-(1<<level)+1)]);
      }
  };
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int tests=0;cin>>tests;while(tests--){string text;cin>>text;int n=static_cast<int>(text.size());SuffixLcp forward(text);string reversed=text;reverse(reversed.begin(),reversed.end());SuffixLcp backward(reversed);vector<long long>starts(static_cast<size_t>(n+1)),finishes(static_cast<size_t>(n+1));for(int length=1;2*length<=n;++length)for(int left=0;left+length<n;left+=length){int right=left+length;if(text[static_cast<size_t>(left)]!=text[static_cast<size_t>(right)])continue;int common_left=backward.lcp(n-1-left,n-1-right),common_right=forward.lcp(left,right);int first=max({left-common_left+1,0,left-length+1});int last=min({left+common_right-1,left+length-1,n-length-1});if(last-first+1>=length){int amount=last-first-length+2;++starts[static_cast<size_t>(first)];--starts[static_cast<size_t>(first+amount)];++finishes[static_cast<size_t>(first+2*length-1)];--finishes[static_cast<size_t>(first+2*length+amount-1)];}}for(int i=1;i<n;++i){starts[static_cast<size_t>(i)]+=starts[static_cast<size_t>(i-1)];finishes[static_cast<size_t>(i)]+=finishes[static_cast<size_t>(i-1)];}long long answer=0;for(int i=0;i+1<n;++i)answer+=finishes[static_cast<size_t>(i)]*starts[static_cast<size_t>(i+1)];cout<<answer<<'\n';}}
external_url: https://www.luogu.com.cn/problem/P1117
external_platform: 洛谷
external_problem_id: P1117
external_title: '[NOI2016] 優秀的拆分'
external_relation: original
source_book_pages: [587, 595]
source_pdf_pages: [217, 225]
review_status: verified
---

先分別計算每個切點左右能接上的平方串數量，AABB 的全域枚舉就化為一次逐點乘法。
