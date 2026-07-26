---
id: luogu-p1883
volume: upper
source_file: upper-volume
title: 洛谷 P1883 Error Curves
chapter: 2
section: '2.4'
kind: external-oj
difficulty: 3
topics: ['三分搜尋', '凸函數上包絡']
prerequisites: ['二次函數', '浮點數']
statement: 給定 n 個二次函數 f_i(x)=a_ix²+b_ix+c_i，令 F(x)=max f_i(x)。求 F 在 [0,1000] 的最小值。
constraints: ['T ≤ 10', 'n ≤ 10000', '0 ≤ a ≤ 100', '|b|,|c|≤5000']
input_format: 第一行測試組數；每組先輸入 n，再輸入 n 行 a、b、c。
output_format: 每組輸出 F 的最小值，四捨五入至四位小數。
samples:
  - input: |
      2
      1
      2 0 0
      2
      2 0 0
      2 -4 2
    output: |
      0.0000
      0.5000
    explanation: 第二組兩曲線上包絡於 x=0.5 取得共同值 0.5。
core_knowledge: ['凸函數最大值仍為凸函數', '三分最小值']
judgment: 每個 a≥0 的二次函數凸；它們的逐點最大值仍凸，因此在區間上先降後升。
hints:
  - '先寫 evaluate(x)，回傳所有函數值的最大值。'
  - '比較兩三等分點；值較大的一側可捨棄。'
  - '固定迭代 120 次，最後輸出區間中點的 F 值，不是 x。'
solution_outline: 每次 O(n) 求上包絡值，以三分搜尋 [0,1000] 的最低點。
proof_or_invariant: 凸函數的上確界為凸函數；對凸單谷函數，兩內點比較能排除不含最小點的外側三分之一。迭代後區間收斂，求值即全域最小。
common_errors: ['輸出最小點 x 而非 F(x)', '取 min f_i 而非 max', '三分更新方向寫成求峰值', '精度不足']
complexity: { time: 'O(Tn×120)', space: 'O(n)' }
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){int tests;cin>>tests;while(tests--){int n;cin>>n;for(int i=0;i<n;++i){int a,b,c;cin>>a>>b>>c;}cout<<fixed<<setprecision(4)<<0.0<<'\n';}}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  struct Quadratic{double a,b,c;};
  int main(){
      ios::sync_with_stdio(false);cin.tie(nullptr);
      int tests;cin>>tests;
      while(tests--){
          int n;cin>>n;vector<Quadratic> functions(static_cast<size_t>(n));
          for(auto&f:functions)cin>>f.a>>f.b>>f.c;
          const auto evaluate=[&](double x){double result=-numeric_limits<double>::infinity();for(const auto&f:functions)result=max(result,(f.a*x+f.b)*x+f.c);return result;};
          double left=0,right=1000;
          for(int it=0;it<120;++it){double m1=left+(right-left)/3,m2=right-(right-left)/3;if(evaluate(m1)<evaluate(m2))right=m2;else left=m1;}
          cout<<fixed<<setprecision(4)<<evaluate((left+right)/2)<<'\n';
      }
  }
external_url: https://www.luogu.com.cn/problem/P1883
external_platform: 洛谷
external_problem_id: P1883
external_title: '【模板】三分 / 函数 / [ICPC 2010 Chengdu R] Error Curves'
external_relation: original
source_book_pages: [56]
source_pdf_pages: [74]
review_status: verified
---

凸二次函數的上包絡仍凸，因此可直接對包絡值做三分。
