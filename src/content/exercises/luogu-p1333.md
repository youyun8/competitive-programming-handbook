---
id: luogu-p1333
volume: lower
source_file: lower-volume
original_label: 洛谷 P1333
title: 瑞瑞的木棍：首尾顏色能否全部相接
chapter: 10
section: '10.3'
kind: external-oj
difficulty: 3
topics: [euler-trail, disjoint-set, string-mapping]
prerequisites: [undirected-graph, degree]
statement: >-
  每根木棍兩端各塗一種以小寫字串命名的顏色。木棍可翻轉；若接觸端顏色相同便可相接。
  判斷能否把輸入的所有木棍恰使用一次，連成一條不必閉合的鏈。
constraints: [輸入包含不超過 250000 根木棍直到 EOF, 顏色名稱僅含小寫字母且長度不超過 10, 相同顏色對可重複]
input_format: 每行兩個顏色字串，表示一根木棍的兩端；讀至 EOF。
output_format: 可以連成一條鏈輸出 Possible，否則輸出 Impossible。
samples:
  - input: "red blue\nblue green\ngreen red\n"
    output: 'Possible'
    explanation: 三種顏色各有偶數度，三根木棍可形成 red→blue→green→red 的封閉鏈。
core_knowledge: [木棍作無向邊, 無向歐拉跡度數條件, 非零度頂點連通]
judgment: 空輸入可視為可行；顏色字串必須映射成同一頂點，平行木棍不能去重。
hints:
  - 每種顏色是頂點，每根木棍是連接兩色的無向邊。
  - 用 DSU 合併每根木棍兩端，即可檢查所有出現顏色是否連通。
  - 可行條件是奇度頂點數恰為 0 或 2，且所有非零度頂點同屬一個分量。
solution_outline: 用雜湊表動態編號顏色，維護度數與 DSU；讀完後檢查奇度數及所有已編號頂點的根是否一致。
proof_or_invariant: >-
  一條使用所有邊的開放鏈只有兩端各少一次進或出，因此恰兩個奇度點；閉合鏈則全為偶度。
  單一鏈必使所有有邊頂點連通。無向歐拉跡定理保證這兩條必要條件也充分，DSU 與度數恰好
  完整檢查它們。
common_errors: [只檢查奇度數而忽略分離分量, 用字串雜湊值直接當連續陣列索引, 將重複木棍去重, 要求一定閉合而排除兩奇點]
complexity: { time: O(E*alpha(V)) 期望時間, space: O(V) }
cpp_skeleton: |
  #include <iostream>
  #include <string>
  #include <unordered_map>
  #include <vector>
  using namespace std;
  struct Dsu{vector<int> p;int add(){int id=static_cast<int>(p.size());p.push_back(id);return id;}int find(int x){return p[static_cast<size_t>(x)]==x?x:p[static_cast<size_t>(x)]=find(p[static_cast<size_t>(x)]);}void unite(int a,int b){p[static_cast<size_t>(find(a))]=find(b);}};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);unordered_map<string,int> id;vector<int> degree;Dsu dsu;string left,right;while(cin>>left>>right){/* TODO：編號、合併並更新度數。*/}/* TODO：檢查連通與奇度。*/}
cpp_solution: |
  #include <iostream>
  #include <string>
  #include <unordered_map>
  #include <vector>
  using namespace std;
  struct Dsu{vector<int> p;int add(){int id=static_cast<int>(p.size());p.push_back(id);return id;}int find(int x){return p[static_cast<size_t>(x)]==x?x:p[static_cast<size_t>(x)]=find(p[static_cast<size_t>(x)]);}void unite(int a,int b){p[static_cast<size_t>(find(a))]=find(b);}};
  int main(){
      ios::sync_with_stdio(false);cin.tie(nullptr);unordered_map<string,int> id;vector<int> degree;Dsu dsu;
      auto get_id=[&](const string& color){auto [it,inserted]=id.emplace(color,static_cast<int>(id.size()));if(inserted){dsu.add();degree.push_back(0);}return it->second;};
      string left,right;while(cin>>left>>right){int a=get_id(left),b=get_id(right);++degree[static_cast<size_t>(a)];++degree[static_cast<size_t>(b)];dsu.unite(a,b);}
      bool ok=true;int odd=0,root=-1;for(int v=0;v<static_cast<int>(degree.size());++v){if(degree[static_cast<size_t>(v)]%2!=0)++odd;if(root==-1)root=dsu.find(v);else if(root!=dsu.find(v))ok=false;}if(odd!=0&&odd!=2)ok=false;cout<<(ok?"Possible\n":"Impossible\n");
  }
external_url: https://www.luogu.com.cn/problem/P1333
external_platform: Luogu
external_problem_id: P1333
external_title: 瑞瑞的木棍
external_relation: original
source_book_pages: [615]
source_pdf_pages: [245]
review_status: verified
---

顏色名稱再長也只是頂點標籤；映射成編號後，問題完全等價於無向圖的歐拉跡存在性。
