---
id: openjudge-1945
volume: upper
source_file: upper-volume
title: OpenJudge 百練 1945 Power Hungry Cows
chapter: 3
section: '3.8'
kind: external-oj
difficulty: 5
topics: [a-star, state-space-search, number-theory]
prerequisites: [priority-queue, gcd]
statement: 兩個工作變數初始為 x 與 1。一次可將任兩工作變數相乘或相除，結果覆寫任一工作變數，且保存結果須為整數。給定 P，求取得 x^P 的最少操作數。
constraints: ['1 <= P <= 20000', 工作變數固定兩個]
input_format: 一個整數 P。
output_format: 輸出取得 x^P 的最少操作數。
samples:
  - input: '31'
    output: '6'
    explanation: 指數可依 1→2→4→8→16→32，再以 32−1 得 31，共六次。
core_knowledge: [指數二元狀態, A* 一致下界, gcd 可達性剪枝]
judgment: 把 x^a 與 x^b 相乘、相除等價於指數 a+b、|a-b|；目標是任一工作變數指數等於 P。
hints:
  - 將狀態正規化為 `a>=b>=0`，初態為 `(1,0)`。
  - 若目前最大指數為 a，至少還需連續倍增 `ceil(log2(P/a))` 次才可能達到 P，可作 A* 下界。
  - '`gcd(a,b)` 永遠整除後續兩指數；若它不整除 P，該狀態不可達目標。'
solution_outline: 以已用步數加倍增下界為優先鍵做 A*，枚舉覆寫任一變數後所得八種加、減、倍增狀態；正規化、去重並套用 gcd 與大小剪枝。
proof_or_invariant: 指數加減完整等價於原本乘除，所列轉移涵蓋兩運算元與兩覆寫位置。一次操作至多把最大指數加倍，因此倍增次數不高估剩餘距離。A* 首次取出含 P 的狀態時，其實際步數最小；gcd 剪枝只移除不可能生成 P 的狀態。
complexity: { time: 'O(S log S)', space: 'O(S)' }
common_errors: [直接對巨大冪值運算, 允許負指數卻忽略整數限制, 只生成 a+b 而漏掉覆寫另一變數]
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main() { /* TODO：在指數 pair 上做 A*。 */ }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  struct State{int estimate,steps,a,b;bool operator>(const State&other)const{return tie(estimate,steps,a,b)>tie(other.estimate,other.steps,other.a,other.b);}};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int target;cin>>target;auto heuristic=[&](int value){int steps=0;while(value<target){value*=2;++steps;}return steps;};priority_queue<State,vector<State>,greater<State>> pending;unordered_map<long long,int> best;auto add=[&](int a,int b,int steps){if(a<b)swap(a,b);if(a>2*target||(a>target&&b==0)||a==b||target%gcd(a,b)!=0)return;long long key=static_cast<long long>(a)*(2*target+1)+b;auto it=best.find(key);if(it!=best.end()&&it->second<=steps)return;best[key]=steps;pending.push({steps+heuristic(a),steps,a,b});};add(1,0,0);while(!pending.empty()){State current=pending.top();pending.pop();long long key=static_cast<long long>(current.a)*(2*target+1)+current.b;if(best[key]!=current.steps)continue;if(current.a==target||current.b==target){cout<<current.steps<<'\n';break;}int a=current.a,b=current.b,s=current.steps+1;add(2*a,b,s);add(a,2*b,s);add(2*a,a,s);if(b)add(2*b,b,s);add(a+b,b,s);add(a+b,a,s);add(a-b,a,s);add(a-b,b,s);}}
external_url: http://bailian.openjudge.cn/practice/1945/
external_platform: OpenJudge 百練
external_problem_id: '1945'
external_title: Power Hungry Cows
external_relation: original
source_book_pages: [143]
source_pdf_pages: [161]
review_status: verified
---

搜尋的是指數代數而非冪值；兩個整數即可表示完整工作記憶體狀態。
