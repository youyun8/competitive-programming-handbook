---
id: openj-bailian-1041
volume: lower
source_file: lower-volume
original_label: OpenJ_Bailian 1041
title: John's trip：街道編號字典序最小的歐拉迴路
chapter: 10
section: '10.3'
kind: external-oj
difficulty: 4
topics: [euler-circuit, undirected-multigraph, lexicographic-order]
prerequisites: [degree, connectivity, hierholzer]
statement: >-
  城鎮的每條雙向街道連接兩個路口，且有互不相同的正整數編號。John 從第一筆街道兩端
  較小的路口出發，希望每條街恰走一次並回到原點；若有多條路線，輸出街道編號序列
  字典序最小者。若不存在這種迴路，輸出指定訊息。
constraints:
  [
    街道數 n < 1995,
    路口數 m <= 44,
    每個路口連接不超過 44 條街,
    街道編號互異,
    所有街道位於同一含邊連通分量,
    時間限制 1000 ms,
    記憶體限制 65536 kB
  ]
input_format: >-
  多組資料；每條街以 x y z 表示連接路口 x、y 且編號為 z。每組以 0 0 結束，最後再以一個
  空資料組 0 0 結束全部輸入。
output_format: 每組可行時輸出一行以空格分隔的街道編號；不可行時輸出 Round trip does not exist.。
samples:
  - input: "1 2 1\n2 3 2\n3 1 6\n1 2 5\n2 3 3\n3 1 4\n0 0\n1 2 1\n2 3 2\n1 3 3\n2 4 4\n0 0\n0 0\n"
    output: "1 2 3 5 4 6\nRound trip does not exist."
    explanation: 第一組各路口皆為偶度，從路口 1 可得到最小街號序列；第二組有奇度路口，不能形成回到起點的歐拉迴路。
core_knowledge: [無向歐拉迴路的偶度條件, 以邊編號排序的 Hierholzer, 邊識別碼處理重邊, 多組不定長輸入]
judgment: 起點固定為每組第一條街兩端的較小路口；比較的是街道編號序列而非路口序列。任一奇度路口都表示不存在迴路。
hints:
  - 先檢查每個出現路口的度數；只要有奇數度就無法回到起點。
  - 每個路口的鄰接項依街道編號遞增排序，並以街道編號共用 used 狀態處理無向邊。
  - 從指定起點做 Hierholzer，回溯時記錄進入該點的街道編號，最後反轉。
solution_outline: >-
  每組讀到 0 0 為止，記住第一條街兩端較小者。建立含終點與街號的雙向鄰接串列，排序每點
  鄰接項並檢查全偶度。以顯式頂點堆疊及入邊堆疊執行 Hierholzer；略過已使用街號，回溯時
  收集入邊。若用邊數完整，反轉後以空格輸出，否則輸出不存在訊息。
proof_or_invariant: >-
  街號唯一，所以兩端鄰接項共用 used[id] 能保證每條無向街恰使用一次。含邊圖連通時，
  所有度數為偶數是存在指定起點歐拉迴路的充要條件。Hierholzer 回溯時才加入入邊，能把
  每段閉合子迴路無縫拼接。固定任何共同街號前綴，遞增掃描會選擇仍能被回溯拼入完整迴路
  的最小下一街號；因此由第一個分歧位置比較，反轉後的完整街號序列字典序最小。
common_errors:
  [
    把第一條街的街號誤當起點,
    依終點編號而非街道編號排序,
    無向邊兩端各走一次,
    忘記反轉回溯街號,
    將組尾 0 0 誤讀為仍有第三個整數
  ]
complexity: { time: O(n log n), space: O(n + m) }
cpp_skeleton: |
  #include <algorithm>
  #include <iostream>
  #include <vector>
  using namespace std;
  struct Street {
      int to;
      int id;
  };
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int first = 0;
      int second = 0;
      while (cin >> first >> second && (first != 0 || second != 0)) {
          int street_id = 0;
          cin >> street_id;
          int start = min(first, second);
          vector<vector<Street>> graph(45);
          vector<int> degree(45, 0);
          graph[static_cast<size_t>(first)].push_back({second, street_id});
          graph[static_cast<size_t>(second)].push_back({first, street_id});
          ++degree[static_cast<size_t>(first)];
          ++degree[static_cast<size_t>(second)];
          while (cin >> first >> second && (first != 0 || second != 0)) {
              cin >> street_id;
              graph[static_cast<size_t>(first)].push_back({second, street_id});
              graph[static_cast<size_t>(second)].push_back({first, street_id});
              ++degree[static_cast<size_t>(first)];
              ++degree[static_cast<size_t>(second)];
          }
          (void)start;
          // TODO：檢查偶度，依街號排序後建立並輸出最小歐拉迴路。
      }
  }
cpp_solution: |
  #include <algorithm>
  #include <iostream>
  #include <vector>
  using namespace std;
  struct Street {
      int to;
      int id;
  };
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int first = 0;
      int second = 0;
      while (cin >> first >> second && (first != 0 || second != 0)) {
          int street_id = 0;
          cin >> street_id;
          int start = min(first, second);
          int street_total = 0;
          int maximum_id = 0;
          vector<vector<Street>> graph(45);
          vector<int> degree(45, 0);
          auto add_street = [&](int from, int to, int id) {
              graph[static_cast<size_t>(from)].push_back({to, id});
              graph[static_cast<size_t>(to)].push_back({from, id});
              ++degree[static_cast<size_t>(from)];
              ++degree[static_cast<size_t>(to)];
              ++street_total;
              maximum_id = max(maximum_id, id);
          };
          add_street(first, second, street_id);
          while (cin >> first >> second && (first != 0 || second != 0)) {
              cin >> street_id;
              add_street(first, second, street_id);
          }
          bool possible = true;
          for (int junction = 1; junction <= 44; ++junction) {
              if (degree[static_cast<size_t>(junction)] % 2 != 0) {
                  possible = false;
              }
              sort(graph[static_cast<size_t>(junction)].begin(),
                   graph[static_cast<size_t>(junction)].end(),
                   [](const Street& left, const Street& right) { return left.id < right.id; });
          }
          vector<bool> used(static_cast<size_t>(maximum_id + 1), false);
          vector<size_t> next_street(45, 0);
          vector<int> junction_stack{start};
          vector<int> street_stack;
          vector<int> reversed_route;
          while (possible && !junction_stack.empty()) {
              int junction = junction_stack.back();
              size_t& index = next_street[static_cast<size_t>(junction)];
              const auto& adjacent = graph[static_cast<size_t>(junction)];
              while (index < adjacent.size() && used[static_cast<size_t>(adjacent[index].id)]) {
                  ++index;
              }
              if (index < adjacent.size()) {
                  Street street = adjacent[index++];
                  used[static_cast<size_t>(street.id)] = true;
                  junction_stack.push_back(street.to);
                  street_stack.push_back(street.id);
              } else {
                  junction_stack.pop_back();
                  if (!street_stack.empty()) {
                      reversed_route.push_back(street_stack.back());
                      street_stack.pop_back();
                  }
              }
          }
          if (!possible || reversed_route.size() != static_cast<size_t>(street_total)) {
              cout << "Round trip does not exist.\n";
              continue;
          }
          reverse(reversed_route.begin(), reversed_route.end());
          for (size_t index = 0; index < reversed_route.size(); ++index) {
              if (index > 0) {
                  cout << ' ';
              }
              cout << reversed_route[index];
          }
          cout << '\n';
      }
  }
external_url: http://bailian.openjudge.cn/practice/1041/
external_platform: OpenJ_Bailian
external_problem_id: '1041'
external_title: John's trip
external_relation: original
source_book_pages: [615]
source_pdf_pages: [245]
review_status: verified
---

這題的字典序落在「街道編號」而非頂點；以唯一街號標記無向邊，才能同時處理重邊與輸出順序。
