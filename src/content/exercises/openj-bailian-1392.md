---
id: openj-bailian-1392
volume: lower
source_file: lower-volume
original_label: OpenJudge 百練 1392
title: Ouroboros Snake：最小二進位 De Bruijn 環
chapter: 10
section: '10.3'
kind: external-oj
difficulty: 4
topics: [de-bruijn-sequence, euler-circuit, hierholzer]
prerequisites: [directed-graph, binary-representation]
statement: >-
  長度為 2^n 的循環二進位串若每個長度 n 的循環視窗恰好產生 0 到 2^n-1，
  就稱為 n 階 Ouroboros circle。只考慮字典序最小的這種循環串；給定 n、k，
  輸出從第 k 位起連續 n 位所代表的整數 o(n,k)。
constraints: [1 <= n <= 15, 0 <= k < 2^n, 多組資料, 0 0 結束, 時間限制 1000 ms, 記憶體限制 65536 kB]
input_format: 每組一行 n k；讀到 0 0 時結束且不處理該行。
output_format: 每組輸出一行 o(n,k)。
samples:
  - input: "2 0\n2 1\n2 2\n2 3\n0 0\n"
    output: "0\n1\n3\n2\n"
    explanation: 字典序最小的二階循環串是 0011，四個循環視窗依序為 00、01、11、10。
core_knowledge: [n-1 位後綴作頂點, n 位字串作有向邊, 字典序最小 De Bruijn 環]
judgment: >-
  在二進位 De Bruijn 圖中從全零狀態出發，每點依 0、1 順序取未用出邊；
  Hierholzer 回溯邊標反轉後，前補 n-1 個零即得所需最小循環串的線性展開。
hints:
  - 把目前最後 n-1 位當成頂點；附加一位 bit 就走過唯一代表某個 n 位字串的邊。
  - 每個頂點各有兩條入邊與兩條出邊，從全零頂點可走遍全部邊，故可用 Hierholzer。
  - 出邊固定先取 0 再取 1，反轉回溯邊標並在前面補 n-1 個零；再從位置 k 讀 n 位。
solution_outline: >-
  建立 2^(n-1) 個隱式頂點，轉移為 ((vertex<<1)|bit) & (vertex_count-1)。
  以頂點堆疊迭代執行 Hierholzer，每點依序使用 bit=0、1，退棧時收集入邊標；
  反轉邊標、前補 n-1 個零，從 k 起累積 n 個二進位位元。
proof_or_invariant: >-
  每條邊由「長度 n-1 的前綴、末位 bit」唯一決定，故恰與 2^n 個 n 位字串一一對應；
  圖中每點入出度皆為 2 且全圖由全零點可達，所以 Hierholzer 恰使用每條邊一次。
  相鄰邊首尾重疊 n-1 位，線性展開的每個循環視窗因而恰對應一條不同邊。
  對固定前綴，演算法總先選標號 0 的尚未使用邊；若最小序列首個與它不同的位置改選 1，
  交換到 0 邊仍可由 Euler 巡迴拼接性補完剩餘邊，會得到更小序列，矛盾，故所得序列字典序最小。
common_errors: [把頂點數寫成 2^n, 忘記反轉回溯邊標, 未補 n-1 個前導零而使尾端視窗越界, 把視窗當十進位字串]
complexity: { time: '每組 O(2^n + n)', space: 'O(2^n)' }
cpp_skeleton: |
  #include <iostream>
  #include <string>
  #include <vector>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n=0,k=0;while(cin>>n>>k&&(n!=0||k!=0)){int vertex_count=1<<(n-1);vector<int> next_bit(static_cast<size_t>(vertex_count),0);/* TODO：迭代 Hierholzer，建立最小循環串並輸出第 k 個視窗。*/}}
cpp_solution: |
  #include <algorithm>
  #include <iostream>
  #include <string>
  #include <vector>
  using namespace std;
  int main(){
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n=0,k=0;
      while(cin>>n>>k&&(n!=0||k!=0)){
          const int vertex_count=1<<(n-1);
          const int mask=vertex_count-1;
          vector<int> next_bit(static_cast<size_t>(vertex_count),0);
          vector<int> vertex_stack{0};
          vector<int> incoming_bits;
          string reversed_bits;
          reversed_bits.reserve(static_cast<size_t>(1<<n));
          while(!vertex_stack.empty()){
              const int vertex=vertex_stack.back();
              int& bit=next_bit[static_cast<size_t>(vertex)];
              if(bit<2){
                  const int used_bit=bit++;
                  vertex_stack.push_back(((vertex<<1)|used_bit)&mask);
                  incoming_bits.push_back(used_bit);
              }else{
                  vertex_stack.pop_back();
                  if(!incoming_bits.empty()){
                      reversed_bits.push_back(static_cast<char>('0'+incoming_bits.back()));
                      incoming_bits.pop_back();
                  }
              }
          }
          reverse(reversed_bits.begin(),reversed_bits.end());
          const string sequence=string(static_cast<size_t>(n-1),'0')+reversed_bits;
          int answer=0;
          for(int offset=0;offset<n;++offset)answer=(answer<<1)+(sequence[static_cast<size_t>(k+offset)]-'0');
          cout<<answer<<'\n';
      }
      return 0;
  }
external_url: http://bailian.openjudge.cn/practice/1392/
external_platform: OpenJ_Bailian
external_problem_id: '1392'
external_title: Ouroboros Snake
external_relation: original
source_book_pages: [615]
source_pdf_pages: [245]
review_status: verified
---

原題頁與同源 POJ 1392／區域賽存檔交叉核對；範例亦由本卡 C++17 解答實際執行。
