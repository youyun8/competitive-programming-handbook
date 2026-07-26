---
id: openj-bailian-2240
volume: lower
source_file: lower-volume
original_label: OpenJudge 百練 2240
title: 百練 2240 Arbitrage：最大匯率閉包
chapter: 10
section: '10.8'
kind: external-oj
difficulty: 2
topics: [Floyd-Warshall, 套利, 字串映射]
prerequisites: [dijkstra]
core_knowledge: [最大乘積路徑, 匯率環, 對角線判定]
judgment: 某貨幣回到自身的最大兌換倍率大於 1 時存在套利。
statement: 給定多種貨幣名稱與單向匯率，判斷是否存在經若干次兌換後增值的環。
constraints: ['n <= 30', 'n=0 結束', '貨幣名稱不含空白']
input_format: 每組輸入 n、n 個名稱、m 及 m 條來源、匯率、目的。
output_format: '依序輸出 Case k: Yes 或 Case k: No。'
samples:
  - input: |-
      3
      USDollar
      BritishPound
      FrenchFranc
      3
      USDollar 0.5 BritishPound
      BritishPound 10 FrenchFranc
      FrenchFranc 0.21 USDollar
      0
    output: 'Case 1: Yes'
    explanation: 一圈的倍率為 0.5×10×0.21=1.05。
hints:
  - 用雜湊表把貨幣名稱映射成矩陣索引。
  - Floyd 的組合運算改為乘法，選擇運算改為最大值。
  - 初始化 best[i][i]=1，最後檢查是否嚴格大於 1。
solution_outline: 建最大直接匯率矩陣，執行 max-times Floyd，檢查任一對角元素是否大於 1。
proof_or_invariant: 中繼點 Floyd 歸納保證 best[i][j] 為允許目前中繼集合時的最大倍率；全部完成後，對角線大於 1 與獲利兌換環互為充要。
complexity: { time: 'O(n^3)', space: 'O(n^2)' }
common_errors: [對角線未初始化為 1, 重複匯率未取最大, Yes 與 No 的大小寫或 Case 格式錯誤]
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){int n;while(cin>>n&&n){/* TODO：最大乘積 Floyd。 */}}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){
      ios::sync_with_stdio(false);cin.tie(nullptr);
      int n,case_no=0;while(cin>>n&&n!=0){unordered_map<string,int> id;string name;for(int i=0;i<n;++i){cin>>name;id[name]=i;}
          vector<vector<double>> best(static_cast<size_t>(n),vector<double>(static_cast<size_t>(n),0));for(int i=0;i<n;++i)best[static_cast<size_t>(i)][static_cast<size_t>(i)]=1;
          int m;cin>>m;while(m-->0){string a,b;double rate;cin>>a>>rate>>b;best[static_cast<size_t>(id[a])][static_cast<size_t>(id[b])]=max(best[static_cast<size_t>(id[a])][static_cast<size_t>(id[b])],rate);}
          for(int k=0;k<n;++k)for(int i=0;i<n;++i)for(int j=0;j<n;++j)best[static_cast<size_t>(i)][static_cast<size_t>(j)]=max(best[static_cast<size_t>(i)][static_cast<size_t>(j)],best[static_cast<size_t>(i)][static_cast<size_t>(k)]*best[static_cast<size_t>(k)][static_cast<size_t>(j)]);
          bool yes=false;for(int i=0;i<n;++i)if(best[static_cast<size_t>(i)][static_cast<size_t>(i)]>1+1e-12)yes=true;cout<<"Case "<<++case_no<<": "<<(yes?"Yes":"No")<<'\n';
      }
  }
external_url: http://bailian.openjudge.cn/practice/2240/
external_platform: OpenJudge 百練
external_problem_id: '2240'
external_title: Arbitrage
external_relation: original
source_book_pages: [600, 683]
source_pdf_pages: [230, 313]
review_status: verified
---

最大乘積 Floyd 是匯率套利最直接的全源動態規劃。
