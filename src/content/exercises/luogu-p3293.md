---
id: luogu-p3293
volume: upper
source_file: upper-volume
source_book_pages: [179, 196]
source_pdf_pages: [197, 214]
chapter: 4
section: '4.4'
kind: external-oj
review_status: verified
external_relation: original
title: 洛谷 P3293 美味：區間內帶加法的最大 XOR
difficulty: 5
topics: [主席樹, 位元貪心, 值域存在性]
prerequisites: [persistent-segment-tree, bitwise-xor]
statement: 菜 i 的評價為 a_i。每位顧客給 b、x 與可選編號 [l,r]，一道菜的美味度為 b XOR (a_i+x)，求最大美味度。
constraints:
  - '1 <= n <= 200000，1 <= m <= 100000'
  - '0 <= a_i,b,x < 100000'
  - '1 <= l <= r <= n'
input_format: 第一行 n、m，第二行評價；接著 m 行 b、x、l、r。
output_format: 每位顧客輸出一行最大美味度。
samples:
  - input: |
      4 4
      1 2 3 4
      1 4 1 4
      2 3 2 3
      3 2 3 3
      4 1 2 4
    output: |
      9
      7
      6
      7
    explanation: 第一筆選 a=4，得到 1 XOR 8=9；其餘答案也由各自限制區間內取最大。
core_knowledge: [高位到低位貪心, 二進位前綴區間, 主席樹區間計數]
judgment: 加上 x 後不能直接沿 a 的 XOR Trie；但固定答案高位後，期望的下一位對應 a 的一段連續值域，可用主席樹判斷是否存在。
hints:
  - 從最高可能位向低位決定 y=a_i+x 的二進位前綴，優先讓 y 的目前位與 b 不同。
  - 固定 y 前綴 prefix 後，該位候選分支是一段長 2^bit 的 y 區間；兩端同減 x 就是 a 區間。
  - 用 root[r]-root[l-1] 查該值域是否非空；有則走理想分支，否則走另一支，最後輸出 prefix XOR b。
solution_outline: 對 a 建位置前綴主席樹。每個詢問逐位構造某個可行的 y=a+x，高位優先選使 XOR 為 1 的分支，存在性由區間值域計數判斷。
proof_or_invariant: 每一步 prefix 保證至少有一個可選 a 使 a+x 擁有此前綴。若理想分支非空，選它會在最高尚未決定位取得 1，必優於另一支；否則只有另一支可行，故貪心最優。
complexity:
  time: 建樹 O(n log V)，每次詢問 O(log² V)
  space: O(n log V)
common_errors:
  - 查值域時忘記把 y 區間兩端減 x
  - 負下界或超過最大 a 的上界沒有裁切
  - 最後輸出構造的 y 而非 b XOR y
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;cin>>n>>m;vector<int>a(static_cast<size_t>(n+1));for(int i=1;i<=n;++i)cin>>a[static_cast<size_t>(i)];while(m--){int b,x,l,r;cin>>b>>x>>l>>r;int answer=0;for(int i=l;i<=r;++i)answer=max(answer,b^(a[static_cast<size_t>(i)]+x));cout<<answer<<'\n';}}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  struct Node{int left=0,right=0,count=0;};
  static int insert(vector<Node>&t,int old,int l,int r,int p){int id=static_cast<int>(t.size());t.push_back(t[static_cast<size_t>(old)]);++t[static_cast<size_t>(id)].count;if(l==r)return id;int mid=(l+r)/2;if(p<=mid)t[static_cast<size_t>(id)].left=insert(t,t[static_cast<size_t>(old)].left,l,mid,p);else t[static_cast<size_t>(id)].right=insert(t,t[static_cast<size_t>(old)].right,mid+1,r,p);return id;}
  static int count_range(const vector<Node>&t,int old,int now,int l,int r,int ql,int qr){if(qr<l||r<ql)return 0;if(ql<=l&&r<=qr)return t[static_cast<size_t>(now)].count-t[static_cast<size_t>(old)].count;int mid=(l+r)/2;return count_range(t,t[static_cast<size_t>(old)].left,t[static_cast<size_t>(now)].left,l,mid,ql,qr)+count_range(t,t[static_cast<size_t>(old)].right,t[static_cast<size_t>(now)].right,mid+1,r,ql,qr);}
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;cin>>n>>m;const int maximum=100000;vector<Node>tree(1);tree.reserve(static_cast<size_t>(n)*20U);vector<int>root(static_cast<size_t>(n+1));for(int i=1,p;i<=n;++i){cin>>p;root[static_cast<size_t>(i)]=insert(tree,root[static_cast<size_t>(i-1)],0,maximum,p);}while(m--){int b,x,l,r;cin>>b>>x>>l>>r;int prefix=0;for(int bit=17;bit>=0;--bit){int desired=((b>>bit)&1)^1;int candidate=prefix|(desired<<bit);int low=max(0,candidate-x),high=min(maximum,candidate+(1<<bit)-1-x);if(low<=high&&count_range(tree,root[static_cast<size_t>(l-1)],root[static_cast<size_t>(r)],0,maximum,low,high)>0)prefix=candidate;else prefix|=(desired^1)<<bit;}cout<<(b^prefix)<<'\n';}}
external_url: https://www.luogu.com.cn/problem/P3293
external_platform: 洛谷
external_problem_id: P3293
external_title: '[SCOI2016] 美味'
---

加法破壞 Trie 的直接分支關係，但固定二進位前綴後仍對應連續值域。
