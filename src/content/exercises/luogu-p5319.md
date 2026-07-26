---
id: luogu-p5319
volume: lower
source_file: lower-volume
title: 洛谷 P5319 奧術神杖
chapter: 9
section: '9.8'
kind: external-oj
difficulty: 5
topics: [aho-corasick, fractional-programming, dynamic-programming]
prerequisites: [aho-corasick, binary-search-on-answer]
statement: 將數字串中的句點填成數字。每次咒語出現都使 Magic 乘其權值，若總出現數為 c，最大化 Magic 的 c 次方根；c=0 時值為 1，輸出任一最優填法。
constraints: ['1 <= n,m <= 1501', 'sum |S_i| <= 1501', '1 <= V_i <= 10^9', '咒語互不相同']
input_format: 第一行 n、m，第二行含數字與句點的 T；接著 m 行咒語 S_i 與 V_i。
output_format: 輸出一個最優的完整數字串。
samples:
  - input: "1 1\n5\n5 2\n"
    output: '5'
    explanation: 固定位唯一且咒語出現一次，最終值為 2；官方範例允許多解，另以枚舉短模板全部填法比較幾何平均對拍。
core_knowledge: [對數化幾何平均, 01 分數規劃, AC 狀態 DP 與回溯]
judgment: 同類咒語不同位置要重複計；多個咒語可在同一結尾同時匹配；多解任意。
hints:
  - 最大化 exp(Σlog(V)/c)，等價於最大化平均 log(V)。
  - 二分平均值 x，令每次匹配貢獻 log(V)−x；存在總和大於零的填法表示答案可至少為 x。
  - AC 節點累加 fail 祖先的 log 權重和與咒語數；每個位置以「AC 狀態」做 DP，最後一次再記錄前驅回溯。
solution_outline: 建十進位 AC，自 fail 傳遞每個狀態結尾的權重對數和與匹配數。二分平均對數，每輪滾動 DP 求允許字元下最大轉換總分；收斂後重跑並保存前驅狀態與字元，從最佳終態回溯輸出。
proof_or_invariant: 任一完成串的 DP 路徑逐位置累加所有在該位置結尾的咒語，故總分正是 Σlog(V)−x·c。此值為正當且僅當其平均對數大於 x，提供單調判定；二分極限是最優平均，最終 DP 前驅給出達到該值的合法串。
common_errors: [只計當前 trie 終點而漏 fail 輸出, 用乘積導致溢位, c=0 的零分路徑誤判成正可行]
complexity: { time: 'O(iterations × n × states × 10)', space: 'O(n × states)' }
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);/* TODO：AC 上二分平均 log 權重並 DP 回溯。*/return 0;}
cpp_solution: |
  #include <array>
  #include <cmath>
  #include <iostream>
  #include <limits>
  #include <queue>
  #include <string>
  #include <vector>
  using namespace std;
  struct Node{array<int,10> next{};int fail=0,count=0;double logarithm=0;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n=0,m=0;string text;cin>>n>>m>>text;vector<Node>trie(1);for(int i=0;i<m;++i){string spell;long long power=0;cin>>spell>>power;int node=0;for(char ch:spell){size_t digit=static_cast<size_t>(ch-'0');if(trie[static_cast<size_t>(node)].next[digit]==0){trie[static_cast<size_t>(node)].next[digit]=static_cast<int>(trie.size());trie.push_back({});}node=trie[static_cast<size_t>(node)].next[digit];}++trie[static_cast<size_t>(node)].count;trie[static_cast<size_t>(node)].logarithm+=log(static_cast<double>(power));}queue<int>pending;for(size_t digit=0;digit<10;++digit){int child=trie[0].next[digit];if(child!=0)pending.push(child);}while(!pending.empty()){int node=pending.front();pending.pop();int failure=trie[static_cast<size_t>(node)].fail;trie[static_cast<size_t>(node)].count+=trie[static_cast<size_t>(failure)].count;trie[static_cast<size_t>(node)].logarithm+=trie[static_cast<size_t>(failure)].logarithm;for(size_t digit=0;digit<10;++digit){int child=trie[static_cast<size_t>(node)].next[digit];if(child!=0){trie[static_cast<size_t>(child)].fail=trie[static_cast<size_t>(failure)].next[digit];pending.push(child);}else trie[static_cast<size_t>(node)].next[digit]=trie[static_cast<size_t>(failure)].next[digit];}}int states=static_cast<int>(trie.size());const double negative=-numeric_limits<double>::infinity();auto run=[&](double average,vector<int>*previous,vector<unsigned char>*chosen){vector<double>old(static_cast<size_t>(states),negative),current(static_cast<size_t>(states),negative);old[0]=0;for(int position=0;position<n;++position){fill(current.begin(),current.end(),negative);int first=text[static_cast<size_t>(position)]=='.'?0:text[static_cast<size_t>(position)]-'0',last=text[static_cast<size_t>(position)]=='.'?9:first;for(int state=0;state<states;++state)if(isfinite(old[static_cast<size_t>(state)]))for(int digit=first;digit<=last;++digit){int next=trie[static_cast<size_t>(state)].next[static_cast<size_t>(digit)];double value=old[static_cast<size_t>(state)]+trie[static_cast<size_t>(next)].logarithm-average*trie[static_cast<size_t>(next)].count;if(value>current[static_cast<size_t>(next)]){current[static_cast<size_t>(next)]=value;if(previous!=nullptr){size_t index=static_cast<size_t>(position+1)*static_cast<size_t>(states)+static_cast<size_t>(next);(*previous)[index]=state;(*chosen)[index]=static_cast<unsigned char>(digit);}}}old.swap(current);}int best=0;for(int state=1;state<states;++state)if(old[static_cast<size_t>(state)]>old[static_cast<size_t>(best)])best=state;return pair<double,int>{old[static_cast<size_t>(best)],best};};double low=0,high=log(1e9);for(int iteration=0;iteration<36;++iteration){double middle=(low+high)/2;if(run(middle,nullptr,nullptr).first>1e-10)low=middle;else high=middle;}vector<int>previous(static_cast<size_t>(n+1)*static_cast<size_t>(states));vector<unsigned char>chosen(previous.size());auto result=run(low, &previous, &chosen);string answer(static_cast<size_t>(n),'0');int state=result.second;for(int position=n;position>=1;--position){size_t index=static_cast<size_t>(position)*static_cast<size_t>(states)+static_cast<size_t>(state);answer[static_cast<size_t>(position-1)]=static_cast<char>('0'+chosen[index]);state=previous[index];}cout<<answer<<'\n';}
external_url: https://www.luogu.com.cn/problem/P5319
external_platform: 洛谷
external_problem_id: P5319
external_title: '[BJOI2019] 奧術神杖'
external_relation: original
source_book_pages: [596, 599]
source_pdf_pages: [226, 229]
review_status: verified
---

乘積先取對數，再把「平均值最大」轉為固定平均下的路徑最大和；AC 負責一次列出所有結尾匹配。
