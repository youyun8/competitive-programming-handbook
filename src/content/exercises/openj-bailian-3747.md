---
id: openj-bailian-3747
volume: upper
source_file: upper-volume
title: OpenJudge 3747 UmBasketella
chapter: 2
section: '2.4'
kind: external-oj
difficulty: 3
topics: ['三分搜尋', '圓錐幾何']
prerequisites: ['圓錐表面積', '圓錐體積']
statement: 一個含底面的直圓錐容器總表面積為 S。求在此限制下可達到的最大體積，並輸出該圓錐高度與底面半徑。
constraints: ['輸入至 EOF', '1 ≤ S ≤ 10000']
input_format: 每筆資料一個實數 S。
output_format: 每筆依序輸出最大體積、高度、半徑，各占一行並保留兩位小數。
samples:
  - input: |
      30
    output: |
      10.93
      4.37
      1.55
    explanation: 在總表面積 30 下，最佳半徑約 1.55、高度約 4.37，體積約 10.93。
core_knowledge: ['由表面積和半徑解出斜高與高度', '單峰體積三分']
judgment: 固定半徑 r 後，斜高由 S=πr²+πrℓ 唯一決定，高度再由 h²=ℓ²-r² 得到。
hints:
  - '先用 S 解出斜高 ℓ=(S-πr²)/(πr)。'
  - '要有實數高度需 ℓ≥r，因此 r≤sqrt(S/(2π))。'
  - '在合法半徑區間三分最大化 V=πr²h/3，最後重新計算 h。'
solution_outline: 將體積寫成半徑的一元函數；在正半徑至 sqrt(S/(2π)) 間三分峰值，輸出對應體積、高度、半徑。
proof_or_invariant: 每個合法 r 對應唯一圓錐，且涵蓋所有滿足表面積的圓錐。體積於合法區間連續、兩端趨近零並具唯一內部峰值，三分保持峰值並收斂。
common_errors: ['表面積漏算底面', '把斜高當高度', '半徑上界取 sqrt(S/π) 導致根號負值', '三行輸出順序錯誤']
complexity: { time: '每筆 O(150)', space: 'O(1)' }
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){double s;while(cin>>s)cout<<fixed<<setprecision(2)<<0.0<<'\n'<<0.0<<'\n'<<0.0<<'\n';}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){
      ios::sync_with_stdio(false);cin.tie(nullptr);
      const double pi=acos(-1.0);double surface;
      while(cin>>surface){
          const auto dimensions=[&](double radius){double slant=(surface-pi*radius*radius)/(pi*radius);return sqrt(max(0.0,slant*slant-radius*radius));};
          const auto volume=[&](double radius){return pi*radius*radius*dimensions(radius)/3.0;};
          double left=1e-12,right=sqrt(surface/(2*pi));
          for(int it=0;it<150;++it){double m1=left+(right-left)/3,m2=right-(right-left)/3;if(volume(m1)<volume(m2))left=m1;else right=m2;}
          const double radius=(left+right)/2,height=dimensions(radius);
          cout<<fixed<<setprecision(2)<<volume(radius)<<'\n'<<height<<'\n'<<radius<<'\n';
      }
  }
external_url: http://bailian.openjudge.cn/practice/3747/
external_platform: OpenJ_Bailian
external_problem_id: '3747'
external_title: UmBasketella
external_relation: original
source_book_pages: [57]
source_pdf_pages: [75]
review_status: verified
---

固定半徑即可由表面積還原唯一高度，將二變數最佳化降成一元三分。
