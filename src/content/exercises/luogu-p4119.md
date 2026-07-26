---
id: luogu-p4119
volume: upper
source_file: upper-volume
source_book_pages: [197, 220]
source_pdf_pages: [215, 238]
chapter: 4
section: '4.5'
kind: external-oj
review_status: verified
external_relation: original
title: 洛谷 P4119 未來日記：區間替換與第 k 小
difficulty: 5
topics: [序列分塊, 值域分塊, 標籤合併]
prerequisites: [sqrt-decomposition, fenwick-tree]
statement: 維護一個正整數序列：可將區間內所有等於 x 的元素改成 y，或查詢區間第 k 小值；相同值按出現次數重複計算。
constraints:
  - '1 <= n,m,a_i <= 100000'
  - 修改值 x、y 介於 1 與 100000
  - '1 <= l <= r <= n，1 <= k <= r-l+1'
input_format: 第一行 n、m，第二行序列；`1 l r x y` 替換，`2 l r k` 查第 k 小。
output_format: 每個操作 2 輸出一行答案。
samples:
  - input: |
      5 3
      1 2 2 3 4
      2 1 5 3
      1 2 4 2 5
      2 1 5 3
    output: |
      2
      4
    explanation: 初始排序為 1、2、2、3、4；替換後為 1、5、5、3、4，第三小是 4。
core_knowledge: [塊內值標籤, 序列塊與值域塊, 動態區間頻率]
judgment: 整個序列塊的 x→y 可透過標籤改名或合併完成；散塊重建。再以「值×序列塊」頻率結構快速取得區間第 k 小。
hints:
  - 每個序列塊令多個位置共享一個 label，另存 label 對應的目前真值；若 y 不存在，x→y 只需改映射。
  - 若 x、y 都存在，合併兩個 label；散塊先物化真值，修改後重建標籤。
  - 對每個值及值域塊維護序列塊 Fenwick 計數；查詢先找第 k 小所在值域塊，再掃該塊的具體值。
solution_outline: 序列以約 1000 長度分塊，塊內維護 label 雙向映射。全塊替換更新映射與頻率，散塊物化重建；查詢以值域分塊和跨序列塊 BIT 計頻。
proof_or_invariant: 每個位置的真值恆為 reverse[block][raw_label]。頻率 BIT 與此真值分布同步；替換與重建均維持不變量。逐值域塊扣除頻率後定位的首個值即為第 k 小。
complexity:
  time: 每次操作約 O(sqrt(n) log n)，重建總量均攤 O((n+m)sqrt(n))
  space: O(value_limit×sqrt(n))
common_errors:
  - 全塊改名後沒有同步頻率資料
  - x、y 同時存在時只改映射而遺失其中一組位置
  - 查詢邊界散塊與中間整塊重複計數
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;cin>>n>>m;vector<int>a(static_cast<size_t>(n+1));for(int i=1;i<=n;++i)cin>>a[static_cast<size_t>(i)];while(m--){int op,l,r;cin>>op>>l>>r;if(op==1){int x,y;cin>>x>>y;for(int i=l;i<=r;++i)if(a[static_cast<size_t>(i)]==x)a[static_cast<size_t>(i)]=y;}else{int k;cin>>k;vector<int>v(a.begin()+l,a.begin()+r+1);nth_element(v.begin(),v.begin()+k-1,v.end());cout<<v[static_cast<size_t>(k-1)]<<'\n';}}}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  static const int kLimit=100000,kSequenceLength=1000,kValueLength=317;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;cin>>n>>m;int blocks=(n+kSequenceLength-1)/kSequenceLength,stride=blocks+1,value_blocks=(kLimit+kValueLength-1)/kValueLength;vector<int>raw(static_cast<size_t>(n+1));vector<unordered_map<int,int>>label_of(static_cast<size_t>(blocks)),value_of(static_cast<size_t>(blocks));vector<int>exact(static_cast<size_t>(kLimit+1)*static_cast<size_t>(stride)),coarse(static_cast<size_t>(value_blocks)*static_cast<size_t>(stride));auto bit_add=[&](vector<int>&bit,int group,int block,int delta){for(int i=block+1;i<=blocks;i+=i&-i)bit[static_cast<size_t>(group)*static_cast<size_t>(stride)+static_cast<size_t>(i)]+=delta;};auto bit_prefix=[&](const vector<int>&bit,int group,int block){int sum=0;for(int i=block;i>0;i-=i&-i)sum+=bit[static_cast<size_t>(group)*static_cast<size_t>(stride)+static_cast<size_t>(i)];return sum;};auto full_count=[&](const vector<int>&bit,int group,int left_block,int right_block){if(left_block>right_block)return 0;return bit_prefix(bit,group,right_block+1)-bit_prefix(bit,group,left_block);};for(int i=1,value;i<=n;++i){cin>>value;int b=(i-1)/kSequenceLength;raw[static_cast<size_t>(i)]=value;label_of[static_cast<size_t>(b)][value]=value;value_of[static_cast<size_t>(b)][value]=value;bit_add(exact,value,b,1);bit_add(coarse,(value-1)/kValueLength,b,1);}auto actual=[&](int position){int b=(position-1)/kSequenceLength;return value_of[static_cast<size_t>(b)].at(raw[static_cast<size_t>(position)]);};auto rebuild=[&](int b,int left,int right,int x,int y){unordered_map<int,int>old_frequency,new_frequency;int block_left=b*kSequenceLength+1,block_right=min(n,(b+1)*kSequenceLength);for(int i=block_left;i<=block_right;++i){int value=actual(i);++old_frequency[value];if(left<=i&&i<=right&&value==x)value=y;raw[static_cast<size_t>(i)]=value;++new_frequency[value];}label_of[static_cast<size_t>(b)].clear();value_of[static_cast<size_t>(b)].clear();for(const auto&[value,count]:new_frequency){(void)count;label_of[static_cast<size_t>(b)][value]=value;value_of[static_cast<size_t>(b)][value]=value;}for(const auto&[value,count]:old_frequency){bit_add(exact,value,b,-count);bit_add(coarse,(value-1)/kValueLength,b,-count);}for(const auto&[value,count]:new_frequency){bit_add(exact,value,b,count);bit_add(coarse,(value-1)/kValueLength,b,count);}};auto replace_full=[&](int b,int x,int y){auto&forward=label_of[static_cast<size_t>(b)];auto found=forward.find(x);if(found==forward.end()||x==y)return;int label_x=found->second,count_x=full_count(exact,x,b,b);auto target=forward.find(y);if(target==forward.end()){forward.erase(found);forward[y]=label_x;value_of[static_cast<size_t>(b)][label_x]=y;}else{int label_y=target->second;int left=b*kSequenceLength+1,right=min(n,(b+1)*kSequenceLength);for(int i=left;i<=right;++i)if(raw[static_cast<size_t>(i)]==label_x)raw[static_cast<size_t>(i)]=label_y;forward.erase(found);value_of[static_cast<size_t>(b)].erase(label_x);}bit_add(exact,x,b,-count_x);bit_add(exact,y,b,count_x);bit_add(coarse,(x-1)/kValueLength,b,-count_x);bit_add(coarse,(y-1)/kValueLength,b,count_x);};while(m--){int op,l,r;cin>>op>>l>>r;int lb=(l-1)/kSequenceLength,rb=(r-1)/kSequenceLength;if(op==1){int x,y;cin>>x>>y;if(lb==rb)rebuild(lb,l,r,x,y);else{rebuild(lb,l,(lb+1)*kSequenceLength,x,y);for(int b=lb+1;b<rb;++b)replace_full(b,x,y);rebuild(rb,rb*kSequenceLength+1,r,x,y);}}else{int k;cin>>k;vector<int>edge;int left_end=min(r,(lb+1)*kSequenceLength);for(int i=l;i<=left_end;++i)edge.push_back(actual(i));if(rb!=lb)for(int i=rb*kSequenceLength+1;i<=r;++i)edge.push_back(actual(i));int middle_left=lb+1,middle_right=rb-1,chosen_block=0;for(int vb=0;vb<value_blocks;++vb){int count=full_count(coarse,vb,middle_left,middle_right);for(int value:edge)count+=(value-1)/kValueLength==vb;if(k>count)k-=count;else{chosen_block=vb;break;}}int answer=1;for(int value=chosen_block*kValueLength+1;value<=min(kLimit,(chosen_block+1)*kValueLength);++value){int count=full_count(exact,value,middle_left,middle_right)+static_cast<int>(std::count(edge.begin(),edge.end(),value));if(k>count)k-=count;else{answer=value;break;}}cout<<answer<<'\n';}}}
external_url: https://www.luogu.com.cn/problem/P4119
external_platform: 洛谷
external_problem_id: P4119
external_title: '[Ynoi2018] 未来日记'
---

全塊替換的關鍵是改「值的名稱」，而不是逐個改位置。
