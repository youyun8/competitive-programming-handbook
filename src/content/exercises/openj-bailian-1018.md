---
id: openj-bailian-1018
volume: upper
source_file: upper-volume
title: OpenJudge 1018 Communication System
chapter: 2
section: '2.4'
kind: external-oj
difficulty: 3
topics: ['枚舉瓶頸', '貪心', '排序']
prerequisites: ['二分搜尋', '比值最佳化']
statement: 系統有 n 類裝置，每類須選一個廠牌，各選項有頻寬與價格。系統頻寬 B 為所選頻寬最小值，總價 P 為價格和；最大化 B/P。
constraints: ['1 ≤ T ≤ 10', '1 ≤ n ≤ 100', '每類 1 ≤ m_i ≤ 100', '頻寬與價格為正整數']
input_format: 第一行測試組數；每組先輸入 n，之後每類一行 m_i 與 m_i 對頻寬、價格。
output_format: 每組輸出最大 B/P，保留三位小數。
samples:
  - input: |
      1
      3
      3 100 25 150 35 80 25
      2 120 80 155 40
      2 100 100 120 110
    output: |
      0.649
    explanation: 枚舉可能的系統瓶頸頻寬並為每類選足夠頻寬的最低價，可得到最大比值約 0.649。
core_knowledge: ['最優瓶頸必為某選項頻寬', '固定瓶頸時各類獨立取最低價格']
judgment: 固定 B 後，提高任何已足夠的裝置頻寬不改善分子，故只需最小化各類價格。
hints:
  - '最終最小頻寬一定等於某個被選選項的頻寬。'
  - '枚舉 B；每類只考慮頻寬≥B 的選項，取其中最低價格。'
  - '每類依頻寬排序並建立後綴最低價，可用 lower_bound 查詢。'
solution_outline: 收集所有候選頻寬。每類排序後建 suffix_min_price。對每個 B，二分每類第一個足夠選項並加後綴最低價；若每類皆可選，更新 B/總價。
proof_or_invariant: 任一配置的 B 來自其中一個選項，故枚舉涵蓋最優分子。固定 B 時各類價格和可分離最小化，後綴最低價給出精確最小 P，因此枚舉所得最大比值為全域最優。
common_errors: ['把系統頻寬當總和', '固定 B 時選頻寬最大而非價格最低', '某類無足夠頻寬仍計算', '四捨五入位數錯誤']
complexity: { time: 'O(U n log m)', space: 'O(Σm_i)' }
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){int tests;cin>>tests;while(tests--){int n;cin>>n;for(int i=0;i<n;++i){int m;cin>>m;while(m--){int b,p;cin>>b>>p;}}cout<<fixed<<setprecision(3)<<0.0<<'\n';}}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){
      ios::sync_with_stdio(false);cin.tie(nullptr);
      int tests;cin>>tests;
      while(tests--){
          int n;cin>>n;vector<vector<pair<int,int>>> devices(static_cast<size_t>(n));vector<int> candidates;
          for(auto&options:devices){int m;cin>>m;while(m--){int bandwidth,price;cin>>bandwidth>>price;options.push_back({bandwidth,price});candidates.push_back(bandwidth);}sort(options.begin(),options.end());for(int i=static_cast<int>(options.size())-2;i>=0;--i)options[static_cast<size_t>(i)].second=min(options[static_cast<size_t>(i)].second,options[static_cast<size_t>(i+1)].second);}
          double answer=0;
          for(const int bandwidth:candidates){long long price_sum=0;bool possible=true;for(const auto&options:devices){auto it=lower_bound(options.begin(),options.end(),pair<int,int>{bandwidth,numeric_limits<int>::min()});if(it==options.end()){possible=false;break;}price_sum+=it->second;}if(possible)answer=max(answer,static_cast<double>(bandwidth)/static_cast<double>(price_sum));}
          cout<<fixed<<setprecision(3)<<answer<<'\n';
      }
  }
external_url: http://bailian.openjudge.cn/practice/1018/
external_platform: OpenJ_Bailian
external_problem_id: '1018'
external_title: Communication System
external_relation: original
source_book_pages: [57]
source_pdf_pages: [75]
review_status: verified
---

瓶頸值枚舉後，各裝置類別的最低成本選擇彼此獨立。
