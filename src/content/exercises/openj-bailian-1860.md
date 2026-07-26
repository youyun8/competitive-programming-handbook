---
id: openj-bailian-1860
volume: lower
source_file: lower-volume
original_label: OpenJudge 百練 1860
title: 百練 1860 Currency Exchange：含手續費套利
chapter: 10
section: '10.8'
kind: external-oj
difficulty: 3
topics: [Bellman-Ford, 套利, 鬆弛]
prerequisites: [dijkstra]
core_knowledge: [匯率與手續費, 可增值環, 起點可達性]
judgment: 持有 x 單位貨幣，兌換後為 (x-commission)×rate；只關心從指定貨幣可達的增值。
statement: 給定雙向但參數不同的貨幣兌換所、起始貨幣及金額，判斷能否經若干次兌換後讓起始財富增加。
constraints: ['貨幣數 <= 100', '每個兌換所兩方向匯率與手續費分別給定']
input_format: 第一行 n、m、s、v；接著 m 行給兩貨幣及雙向的匯率、手續費。
output_format: 可套利輸出 YES，否則 NO。
samples:
  - input: |-
      2 1 1 20
      1 2 1.1 1 1.1 1
    output: 'YES'
    explanation: 20 經兩次兌換成 (20−1)×1.1=20.9，再成 (20.9−1)×1.1=21.89，大於起始金額。
hints:
  - amount[v] 記錄目前可持有 v 的最大金額。
  - 邊的鬆弛不是加法，而是 (amount[u]-fee)×rate。
  - 做 n 輪 Bellman-Ford；第 n 輪仍能增加表示可利用增值環。
solution_outline: 將每個兌換所展開成兩條有向邊，從起始貨幣金額執行最大值版 Bellman-Ford，第 n 輪仍更新即套利。
proof_or_invariant: 第 r 輪後 amount 是使用至多 r 條兌換邊可得的最大金額。無可增值環時最佳方案可去除重複點而至多 n-1 邊；第 n 輪仍改善必含可重複獲利的環，反之獲利環必能持續改善。
complexity: { time: 'O(nm)', space: 'O(n+m)' }
common_errors: [先乘匯率才扣手續費, 忘記兩方向參數不同, 對不可支付手續費的狀態仍鬆弛]
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){int n,m,s;double v;cin>>n>>m>>s>>v;/* TODO：最大金額 Bellman-Ford。 */}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  struct Edge{int from,to;double rate,fee;};
  int main(){
      ios::sync_with_stdio(false);cin.tie(nullptr);
      int n,m,s;double initial;if(!(cin>>n>>m>>s>>initial))return 0;vector<Edge> edges;
      for(int i=0;i<m;++i){int a,b;double rab,cab,rba,cba;cin>>a>>b>>rab>>cab>>rba>>cba;edges.push_back({a,b,rab,cab});edges.push_back({b,a,rba,cba});}
      vector<double> amount(static_cast<size_t>(n+1),0);amount[static_cast<size_t>(s)]=initial;
      for(int round=1;round<=n;++round){bool changed=false;for(const Edge& e:edges)if(amount[static_cast<size_t>(e.from)]>e.fee){double candidate=(amount[static_cast<size_t>(e.from)]-e.fee)*e.rate;if(candidate>amount[static_cast<size_t>(e.to)]+1e-10){amount[static_cast<size_t>(e.to)]=candidate;changed=true;if(round==n){cout<<"YES\n";return 0;}}}if(!changed)break;}
      cout<<"NO\n";
  }
external_url: http://bailian.openjudge.cn/practice/1860/
external_platform: OpenJudge 百練
external_problem_id: '1860'
external_title: Currency Exchange
external_relation: original
source_book_pages: [600, 683]
source_pdf_pages: [230, 313]
review_status: verified
---

帶固定手續費時不能取對數；直接在金額上做最大化鬆弛最穩妥。
