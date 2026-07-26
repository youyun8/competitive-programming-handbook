---
id: openj-bailian-2513
volume: lower
source_file: lower-volume
original_label: OpenJ_Bailian 2513
title: Colored Sticks：把所有彩色木棍接成一直線
chapter: 10
section: '10.3'
kind: external-oj
difficulty: 3
topics: [euler-trail, undirected-multigraph, string-mapping, disjoint-set]
prerequisites: [degree, connectivity, hash-table]
statement: >-
  有一批木棍，每根兩端各塗一種以小寫單字命名的顏色。木棍可以翻轉；只有接觸兩端顏色
  相同時才能相接。判斷能否將輸入的所有木棍恰使用一次，排成一條直線。
constraints:
  [
    木棍數不超過 250000,
    顏色名稱只含小寫英文字母且長度不超過 10,
    同一顏色對可重複,
    時間限制 5000 ms,
    記憶體限制 128000 kB
  ]
input_format: 輸入直到 EOF；每行兩個以空白分隔的顏色單字，代表一根木棍的兩端。
output_format: 可以排成所需直線時輸出 Possible，否則輸出 Impossible。
samples:
  - input: "blue red\nred violet\ncyan blue\nblue magenta\nmagenta cyan\n"
    output: Possible
    explanation: 可依 violet—red、red—blue、blue—cyan、cyan—magenta、magenta—blue 排列；只有 violet 與 blue 為奇度端點。
core_knowledge: [顏色作頂點且木棍作無向邊, 無向歐拉跡充要條件, 字串動態編號與 DSU]
judgment: 木棍可反向，故邊是無向的；平行木棍都必須保留。只有實際出現的顏色參與連通性判定。
hints:
  - 用雜湊表為每種新顏色配置連續整數編號，每根木棍使兩端度數各加一。
  - 以 DSU 合併每根木棍的兩端；讀完後所有已編號顏色必須具有相同根。
  - 連通後，奇度顏色數為 0 時可形成封閉鏈，為 2 時可形成開放鏈，其餘皆不可能。
solution_outline: >-
  邊讀邊以 unordered_map 將顏色映射為編號，動態擴充 DSU 與度數陣列；每根木棍合併兩端
  並各加一度。最後檢查所有已出現顏色是否同屬一個分量，且奇度頂點數只能是 0 或 2。
proof_or_invariant: >-
  每種顏色是無向圖頂點，每根可翻轉木棍是一條無向邊，所求排列正是使用所有邊一次的歐拉
  跡。單一路徑令所有含邊頂點連通；每個內部頂點的邊成對進出而為偶度，若路徑不閉合則
  只有兩端為奇度。反之，連通無向多重圖在奇點為零或二時，Hierholzer 定理保證存在封閉
  或開放歐拉跡。因此 DSU 與奇度計數檢查的是完整充要條件。
common_errors:
  [
    只計算奇度而忽略多個連通分量,
    把顏色字串的雜湊值直接當陣列索引,
    將相同端點的多根木棍去重,
    誤以為只能形成封閉鏈,
    讀固定行數而非直到 EOF
  ]
complexity: { time: O(E*alpha(V)) 期望時間, space: O(V) }
cpp_skeleton: |
  #include <iostream>
  #include <string>
  #include <unordered_map>
  #include <vector>
  using namespace std;
  struct Dsu{vector<int> parent,size;int add(){int id=static_cast<int>(parent.size());parent.push_back(id);size.push_back(1);return id;}int find(int x){return parent[static_cast<size_t>(x)]==x?x:parent[static_cast<size_t>(x)]=find(parent[static_cast<size_t>(x)]);}void unite(int a,int b){a=find(a);b=find(b);if(a==b)return;if(size[static_cast<size_t>(a)]<size[static_cast<size_t>(b)]){int temporary=a;a=b;b=temporary;}parent[static_cast<size_t>(b)]=a;size[static_cast<size_t>(a)]+=size[static_cast<size_t>(b)];}};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);unordered_map<string,int> id;vector<int> degree;Dsu dsu;auto get_id=[&](const string& color){auto found=id.find(color);if(found!=id.end())return found->second;int next=dsu.add();id.emplace(color,next);degree.push_back(0);return next;};string left_color,right_color;while(cin>>left_color>>right_color){int left=get_id(left_color),right=get_id(right_color);++degree[static_cast<size_t>(left)];++degree[static_cast<size_t>(right)];dsu.unite(left,right);}/* TODO：檢查連通性與奇度頂點數。*/}
cpp_solution: |
  #include <iostream>
  #include <string>
  #include <unordered_map>
  #include <vector>
  using namespace std;
  struct Dsu{vector<int> parent,size;int add(){int id=static_cast<int>(parent.size());parent.push_back(id);size.push_back(1);return id;}int find(int x){return parent[static_cast<size_t>(x)]==x?x:parent[static_cast<size_t>(x)]=find(parent[static_cast<size_t>(x)]);}void unite(int a,int b){a=find(a);b=find(b);if(a==b)return;if(size[static_cast<size_t>(a)]<size[static_cast<size_t>(b)]){int temporary=a;a=b;b=temporary;}parent[static_cast<size_t>(b)]=a;size[static_cast<size_t>(a)]+=size[static_cast<size_t>(b)];}};
  int main(){
      ios::sync_with_stdio(false);cin.tie(nullptr);unordered_map<string,int> id;id.reserve(500000);vector<int> degree;degree.reserve(500000);Dsu dsu;
      auto get_id=[&](const string& color){auto found=id.find(color);if(found!=id.end())return found->second;int next=dsu.add();id.emplace(color,next);degree.push_back(0);return next;};
      string left_color,right_color;while(cin>>left_color>>right_color){int left=get_id(left_color),right=get_id(right_color);++degree[static_cast<size_t>(left)];++degree[static_cast<size_t>(right)];dsu.unite(left,right);}
      bool possible=true;int root=-1,odd_count=0;for(int vertex=0;vertex<static_cast<int>(degree.size());++vertex){if(root==-1)root=dsu.find(vertex);else if(root!=dsu.find(vertex))possible=false;if(degree[static_cast<size_t>(vertex)]%2!=0)++odd_count;}
      if(odd_count!=0&&odd_count!=2){possible=false;}
      cout<<(possible?"Possible\n":"Impossible\n");
  }
external_url: http://bailian.openjudge.cn/practice/2513/
external_platform: OpenJ_Bailian
external_problem_id: '2513'
external_title: Colored Sticks
external_relation: original
source_book_pages: [615]
source_pdf_pages: [245]
review_status: verified
---

顏色名稱只是圖頂點標籤；動態編號後，巨量字串輸入便縮成標準的連通性與奇度判定。
