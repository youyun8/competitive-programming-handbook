---
id: openj-bailian-3437
volume: lower
source_file: lower-volume
title: 百練 3437 Desert King：最優比率生成樹
chapter: 10
section: '10.9'
kind: external-oj
difficulty: 5
topics: [0/1 分數規劃, Prim, 最優比率生成樹]
prerequisites: [minimum-spanning-tree, fractional-programming]
statement: 每對村莊間水渠長度為平面距離、升降機成本為高度差。選一棵生成樹，最小化總成本除以總長度。
constraints: [2 <= n <= 1000, 0 <= x, y < 10000, 0 <= z < 10000000, n=0 結束, 村莊高度互異]
input_format: 多組；每組 n 與 n 行 x、y、z，0 結束。
output_format: 每組輸出最小比率，四捨五入至小數點後三位。
samples:
  - input: |
      4
      0 0 0
      0 1 1
      1 1 2
      1 0 3
      0
    output: |
      1.000
    explanation: 官方範例的最優樹總高度差與總水平長相同。另以 n<=7 枚舉 Prüfer 序列的所有生成樹對拍。
core_knowledge: [Dinkelbach, 參數化 MST, 稠密圖 Prim]
judgment: 目標是兩個邊權和的比，而非各邊比率之和。
hints:
  - 對候選比率 r，把邊權改為 height_diff-r*horizontal_length。
  - 新權最小生成樹的總和若為負，代表存在比率小於 r 的樹。
  - 可二分 r；每次以 O(n²) Prim 在隱式完全圖求 MST。
solution_outline: 預算所有點對 cost 與 length。在 [0,10^7] 二分 60 次，對改權 cost-mid*length 做 Prim；MST 和 <=0 時縮小上界，否則提高下界。
proof_or_invariant: 對任一樹 T，ratio(T)<=r 等價於 Σ(cost-r*length)<=0。所有樹的左式最小值由改權 MST 給出，且隨 r 單調不增，因此二分判定精確定位最小可行 r。
common_errors: [最小化每條邊 cost/length 後求 MST, 二分方向顛倒, 平面長度誤含高度 z, 輸出精度錯誤]
complexity: { time: 'O(60n^2)', space: 'O(n^2)' }
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);/* TODO：二分比率，以參數化邊權跑 Prim。 */}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  struct Village{double x,y,z;};
  int main(){
      ios::sync_with_stdio(false);cin.tie(nullptr);
      int n;
      cout<<fixed<<setprecision(3);
      while(cin>>n&&n){
          vector<Village> point(static_cast<size_t>(n));
          for(auto& value:point)cin>>value.x>>value.y>>value.z;
          vector<vector<double>> length(static_cast<size_t>(n),vector<double>(static_cast<size_t>(n)));
          vector<vector<double>> cost=length;
          for(int i=0;i<n;++i)for(int j=i+1;j<n;++j){length[static_cast<size_t>(i)][static_cast<size_t>(j)]=length[static_cast<size_t>(j)][static_cast<size_t>(i)]=hypot(point[static_cast<size_t>(i)].x-point[static_cast<size_t>(j)].x,point[static_cast<size_t>(i)].y-point[static_cast<size_t>(j)].y);cost[static_cast<size_t>(i)][static_cast<size_t>(j)]=cost[static_cast<size_t>(j)][static_cast<size_t>(i)]=abs(point[static_cast<size_t>(i)].z-point[static_cast<size_t>(j)].z);}
          auto transformed_mst=[&](double ratio){vector<double>best(static_cast<size_t>(n),numeric_limits<double>::infinity());vector<char>used(static_cast<size_t>(n));best[0]=0;double sum=0;for(int step=0;step<n;++step){int u=-1;for(int i=0;i<n;++i)if(!used[static_cast<size_t>(i)]&&(u<0||best[static_cast<size_t>(i)]<best[static_cast<size_t>(u)]))u=i;used[static_cast<size_t>(u)]=1;sum+=best[static_cast<size_t>(u)];for(int v=0;v<n;++v)if(!used[static_cast<size_t>(v)])best[static_cast<size_t>(v)]=min(best[static_cast<size_t>(v)],cost[static_cast<size_t>(u)][static_cast<size_t>(v)]-ratio*length[static_cast<size_t>(u)][static_cast<size_t>(v)]);}return sum;};
          double low=0,high=1e7;
          for(int iteration=0;iteration<70;++iteration){double middle=(low+high)/2;if(transformed_mst(middle)<=0)high=middle;else low=middle;}
          cout<<(low+high)/2<<'\n';
      }
  }
external_url: http://bailian.openjudge.cn/practice/3437/
external_platform: OpenJudge 百練
external_problem_id: '3437'
external_title: Desert King
external_relation: original
source_book_pages: [659, 662]
source_pdf_pages: [289, 292]
review_status: verified
---

百練 3437 為 POJ 2728 的可信鏡像；題意、限制與官方範例已對照 POJ 存檔。
