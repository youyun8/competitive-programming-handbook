---
id: luogu-p3674
volume: upper
source_file: upper-volume
source_book_pages: [197, 220]
source_pdf_pages: [215, 238]
chapter: 4
section: '4.5'
kind: external-oj
review_status: verified
external_relation: original
title: 洛谷 P3674 小清新人渣的本願：莫隊與 bitset
difficulty: 5
topics: [莫隊, bitset, 和差積判定]
prerequisites: [mo-algorithm]
statement: 對序列區間回答三類存在性問題：是否存在兩個區間內數值，使其差、和或積等於指定 x。依原題，兩個數值可取相同值。
constraints:
  - '1 <= n,m <= 100000'
  - '1 <= a_i,x <= 100000'
  - 操作類型為 1（差）、2（和）、3（積）
input_format: 第一行 n、m；第二行序列；接著 m 行 op、l、r、x。
output_format: 每個詢問輸出 hana（存在）或 bi（不存在）。
samples:
  - input: |
      5 4
      1 2 3 6 8
      1 1 5 5
      2 1 3 4
      3 2 5 18
      3 1 2 8
    output: |
      hana
      hana
      hana
      bi
    explanation: 可分別選 1、6；1、3；3、6；最後區間只有 1、2，無法得到積 8。
core_knowledge: [莫隊窗口, 正反 bitset, 因數枚舉]
judgment: 差與和可化為兩個存在集合的位元平移交集；積只需枚舉 x 的因數對。
hints:
  - 維護 present[v]，以及 reversed[MAX-v]；頻率由 0 變 1 或 1 變 0 時才改 bit。
  - 差 x 檢查 present 與 present<<x；和 x 將一份集合反向後平移，使互補值落在同一索引。
  - 積 x 枚舉到 sqrt(x) 的因數 d，檢查 d 與 x/d 是否都存在。
solution_outline: 按區間莫隊排序，維護當前值集合及其鏡像 bitset；差、和用一次位元交集，積枚舉因數。
proof_or_invariant: present 的置位位置恰為窗口出現值。位移交集非空分別等價於存在 v 與 v+x、v 與 x-v；積判定枚舉了所有可能因數對。
complexity:
  time: O((n+m)sqrt(n)+m(MAX/word_size+sqrt(x)))
  space: O(n+m+MAX)
common_errors:
  - 每次增刪都翻轉 bit，忽略同值仍有其他位置
  - 鏡像 bitset 的偏移方向寫反
  - 積判定只檢查真因數而漏掉平方根
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;cin>>n>>m;vector<int>a(static_cast<size_t>(n+1));for(int i=1;i<=n;++i)cin>>a[static_cast<size_t>(i)];while(m--){int op,l,r,x;cin>>op>>l>>r>>x;set<int>s;for(int i=l;i<=r;++i)s.insert(a[static_cast<size_t>(i)]);bool ok=false;for(int u:s)for(int v:s)ok=ok||(op==1&&abs(u-v)==x)||(op==2&&u+v==x)||(op==3&&1LL*u*v==x);cout<<(ok?"hana":"bi")<<'\n';}}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  constexpr int limit=100000;
  struct Query{int operation,left,right,value,index;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;cin>>n>>m;vector<int>a(static_cast<size_t>(n+1));for(int i=1;i<=n;++i)cin>>a[static_cast<size_t>(i)];vector<Query>query(static_cast<size_t>(m));for(int i=0;i<m;++i){cin>>query[static_cast<size_t>(i)].operation>>query[static_cast<size_t>(i)].left>>query[static_cast<size_t>(i)].right>>query[static_cast<size_t>(i)].value;query[static_cast<size_t>(i)].index=i;}int block=max(1,static_cast<int>(sqrt(static_cast<double>(n))));sort(query.begin(),query.end(),[block](const Query&x,const Query&y){int xb=x.left/block,yb=y.left/block;return xb!=yb?xb<yb:((xb&1)!=0?x.right>y.right:x.right<y.right);});vector<int>frequency(static_cast<size_t>(limit+1));bitset<limit+1>present,reversed;vector<bool>answer(static_cast<size_t>(m));int left=1,right=0;auto add=[&](int position){int value=a[static_cast<size_t>(position)];if(frequency[static_cast<size_t>(value)]++==0){present.set(static_cast<size_t>(value));reversed.set(static_cast<size_t>(limit-value));}};auto remove=[&](int position){int value=a[static_cast<size_t>(position)];if(--frequency[static_cast<size_t>(value)]==0){present.reset(static_cast<size_t>(value));reversed.reset(static_cast<size_t>(limit-value));}};for(const Query&item:query){while(left>item.left)add(--left);while(right<item.right)add(++right);while(left<item.left)remove(left++);while(right>item.right)remove(right--);bool ok=false;if(item.operation==1&&item.value<=limit)ok=(present&(present<<static_cast<size_t>(item.value))).any();else if(item.operation==2&&item.value<=2*limit){int shift=limit-item.value;if(shift>=0)ok=(present&(reversed>>static_cast<size_t>(shift))).any();else ok=(present&(reversed<<static_cast<size_t>(-shift))).any();}else if(item.operation==3){for(int divisor=1;1LL*divisor*divisor<=item.value;++divisor)if(item.value%divisor==0&&divisor<=limit&&item.value/divisor<=limit&&present.test(static_cast<size_t>(divisor))&&present.test(static_cast<size_t>(item.value/divisor))){ok=true;break;}}answer[static_cast<size_t>(item.index)]=ok;}for(bool ok:answer)cout<<(ok?"hana":"bi")<<'\n';}
external_url: https://www.luogu.com.cn/problem/P3674
external_platform: 洛谷
external_problem_id: P3674
external_title: 小清新人渣的本愿
---

bitset 把「是否存在一對互補值」平行化為機器字交集，是莫隊窗口內集合判定的典型搭配。
