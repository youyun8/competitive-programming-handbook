---
id: luogu-p5353
volume: lower
source_file: lower-volume
title: 洛谷 P5353 樹上後綴排序
chapter: 9
section: '9.7'
kind: external-oj
difficulty: 5
topics: [suffix-array, tree, doubling, radix-sort]
prerequisites: [suffix-array, binary-lifting, counting-sort]
statement: 根樹每點代表「由該點一路到根」的字串，求全部字串的字典序。內容完全相同時依父親排名，再相同依節點編號排序。
constraints: ['1 <= n <= 5*10^5', 'f_i < i', '每點字元為小寫英文字母']
input_format: 第一行 n；第二行 f_2..f_n；第三行長度 n 的標籤字串。
output_format: 依排名由小到大輸出節點編號。
samples:
  - input: "5\n1 1 3 2\nabbaa\n"
    output: '1 5 4 2 3'
    explanation: 官方範例；另以直接建立根路徑字串並依題目遞迴 tie-break 排序小型隨機樹對拍。
core_knowledge: [樹上倍增字串, 等價排名與唯一次序, 穩定基數排序]
judgment: 字串方向是節點到根；內容相同不能任意排序，必須先比較父親排名再比較編號。
hints:
  - 仿 SA 倍增：長度 2^(k+1) 的根路徑前綴由目前排名與跳 2^k 後祖先排名組成。
  - 'rk 保留內容等價類；另以 order_rank 保存每輪無重複的完整次序，作第二段關鍵字以延續題目的 tie-break。'
  - 每輪先按祖先的 `order_rank`、再按本點 `rk` 做兩次穩定計數排序，總時間 O(n log n)。
solution_outline: 初始按字元穩定排序，建立內容排名 rk 與唯一位置排名 order_rank。每輪用倍增祖先的 order_rank 作第二鍵、rk 作第一鍵基數排序；依兩段內容 rk 判斷新等價類，並重新給唯一位置排名。覆蓋最大深度後目前次序即答案。
proof_or_invariant: 第 k 輪 rk 相同當且僅當長度 2^k（不足補最小哨兵）的路徑前綴相同；兩段拼接維持此不變量。相同內容內，祖先唯一次序先延續父親的遞迴排名，再由穩定順序延續節點編號，因此恰符合兩級 tie-break。
common_errors: [把路徑方向寫成根到節點, 只有等價 rk 而遺失相同字串的指定順序, 計數排序未保持穩定]
complexity: { time: 'O(n log n)', space: 'O(n log n)' }
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);/* TODO：樹上 SA 倍增，分開維護內容排名與唯一次序。*/return 0;}
cpp_solution: |
  #include <algorithm>
  #include <iostream>
  #include <numeric>
  #include <string>
  #include <vector>
  using namespace std;
  static void counting_sort(vector<int>&order,const vector<int>&key,int maximum){vector<int>count(static_cast<size_t>(maximum+1)),result(order.size());for(int node:order)++count[static_cast<size_t>(key[static_cast<size_t>(node)])];for(int i=1;i<=maximum;++i)count[static_cast<size_t>(i)]+=count[static_cast<size_t>(i-1)];for(size_t i=order.size();i-->0;){int node=order[i];result[static_cast<size_t>(--count[static_cast<size_t>(key[static_cast<size_t>(node)])])]=node;}order.swap(result);}
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n=0;cin>>n;vector<int>parent(static_cast<size_t>(n+1));for(int i=2;i<=n;++i)cin>>parent[static_cast<size_t>(i)];string labels;cin>>labels;vector<int>order(static_cast<size_t>(n)),content_rank(static_cast<size_t>(n+1)),unique_rank(static_cast<size_t>(n+1)),key(static_cast<size_t>(n+1)),ancestor=parent;iota(order.begin(),order.end(),1);for(int i=1;i<=n;++i)key[static_cast<size_t>(i)]=labels[static_cast<size_t>(i-1)]-'a'+1;counting_sort(order,key,26);int classes=0;for(int i=0;i<n;++i){int node=order[static_cast<size_t>(i)];if(i==0||key[static_cast<size_t>(node)]!=key[static_cast<size_t>(order[static_cast<size_t>(i-1)])])++classes;content_rank[static_cast<size_t>(node)]=classes;unique_rank[static_cast<size_t>(node)]=i+1;}for(int width=1;width<n;width<<=1){vector<int>old_rank=content_rank;for(int i=1;i<=n;++i){int up=ancestor[static_cast<size_t>(i)];key[static_cast<size_t>(i)]=up==0?0:unique_rank[static_cast<size_t>(up)];}counting_sort(order,key,n);counting_sort(order,old_rank,classes);classes=0;for(int i=0;i<n;++i){int node=order[static_cast<size_t>(i)],up=ancestor[static_cast<size_t>(node)];bool different=i==0;if(i>0){int previous=order[static_cast<size_t>(i-1)],previous_up=ancestor[static_cast<size_t>(previous)];different=old_rank[static_cast<size_t>(node)]!=old_rank[static_cast<size_t>(previous)]||(up==0?0:old_rank[static_cast<size_t>(up)])!=(previous_up==0?0:old_rank[static_cast<size_t>(previous_up)]);}if(different)++classes;content_rank[static_cast<size_t>(node)]=classes;unique_rank[static_cast<size_t>(node)]=i+1;}vector<int>next_ancestor(static_cast<size_t>(n+1));for(int i=1;i<=n;++i){int up=ancestor[static_cast<size_t>(i)];next_ancestor[static_cast<size_t>(i)]=up==0?0:ancestor[static_cast<size_t>(up)];}ancestor.swap(next_ancestor);}for(int node:order)cout<<node<<' ';cout<<'\n';}
external_url: https://www.luogu.com.cn/problem/P5353
external_platform: 洛谷
external_problem_id: P5353
external_title: 樹上後綴排序
external_relation: original
source_book_pages: [587, 595]
source_pdf_pages: [217, 225]
review_status: verified
---

這題需要同時維護「內容可相等的 rank」與「永遠唯一的排序位置」；混成一個陣列會破壞指定 tie-break。
