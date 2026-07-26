---
id: openjudge-1696
volume: lower
source_file: lower-volume
title: OpenJudge 1696 Space Ant：只向左轉的巡訪順序
chapter: 8
section: '8.3'
kind: external-oj
difficulty: 3
topics: ['叉積', '極角貪心', 'Jarvis march']
prerequisites: ['向量', '叉積', '距離平方']
statement: 平面上有 N 株植物，橫座標彼此不同且縱座標彼此不同。螞蟻從最低植物同高度的 x=0 處向右出發，每天走到一株尚未拜訪的植物；路徑不得自交且每次只能逆時針轉。輸出能依規則拜訪所有植物的順序。
constraints:
  - '1 <= M <= 10'
  - '1 <= N <= 50'
  - '1 <= x_i, y_i <= 100'
  - 植物編號為 1 到 N，輸入按編號遞增
  - 任兩植物不共用相同 x 或相同 y
input_format: 第一行為測試組數 M。每組先給 N，接著 N 行各為植物編號、x、y。
output_format: 每組一行，先輸出路徑上的植物數量，再依拜訪順序輸出植物編號。
samples:
  - input: |
      2
      10
      1 4 5
      2 9 8
      3 5 9
      4 1 7
      5 3 2
      6 6 3
      7 10 10
      8 8 1
      9 2 4
      10 7 6
      14
      1 6 11
      2 11 9
      3 8 7
      4 12 8
      5 9 20
      6 3 2
      7 1 6
      8 2 13
      9 15 1
      10 14 17
      11 13 19
      12 5 18
      13 7 3
      14 10 16
    output: |
      10 8 7 3 4 9 5 6 2 1 10
      14 9 10 11 5 12 8 7 6 13 4 14 1 3 2
    explanation: 官方範例中每一步都選擇使其餘未訪點位於前進方向左側的植物；同一直線時先到較近者，因此兩組都能依序拜訪全部植物。
core_knowledge:
  - 以叉積比較繞當前點的方向
  - 支撐線端點貪心
  - 共線候選的距離規則
judgment: N 僅 50，可在每一步掃描所有未訪點，選出使其他候選全在其左側的支撐點；這與 Jarvis march 選凸包下一點相同，但拜訪後繼續在剩餘點上做。
hints:
  - 第一株必須是 y 最小的植物；起始方向向右，因此走到它不需右轉。
  - 站在 current，維護候選 next；若另一點落在 current→next 的右側，就把 next 改成該點，掃完後所有剩餘點都在新方向左側。
  - 若三點共線，先選離 current 較近者，之後可沿同方向拜訪更遠點而不產生轉彎，也不會跨過未訪植物。
solution_outline: 找出最低點作起點。重複從未訪點中任取候選並線性掃描：叉積顯示新點更靠右時更新，共線時取較近者；標記選出的點，直到輸出全部編號。
proof_or_invariant: 每一步掃描結束後，對所有未訪點 q，cross(next-current,q-current) >= 0，因此從上一段走到 current→next 不會被迫向右，且 current→next 是剩餘點集的一條支撐線，不可能穿越由先前支撐線包住的已走路徑。共線時先近後遠使線段不跨過待訪點。歸納可知路徑只左轉且不自交，並因每步恰標記一點而拜訪全部植物。
complexity:
  time: 每組 O(N²)
  space: O(N)
common_errors:
  - 起點錯選成 x 最小而非 y 最小
  - 叉積更新方向寫反，選到右轉候選
  - 共線時取最遠點，之後回頭拜訪近點
  - 輸出陣列位置而非題目給定的植物編號
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  struct Plant { int id; long long x; long long y; };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：逐步選出讓其餘未訪點都位於前進方向左側的植物。
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  struct Plant {
      int id;
      long long x;
      long long y;
  };

  static long long cross_from(const Plant& origin, const Plant& a, const Plant& b) {
      return (a.x - origin.x) * (b.y - origin.y) -
             (a.y - origin.y) * (b.x - origin.x);
  }

  static long long squared_distance(const Plant& a, const Plant& b) {
      const long long dx = a.x - b.x;
      const long long dy = a.y - b.y;
      return dx * dx + dy * dy;
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int test_count;
      cin >> test_count;
      while (test_count-- > 0) {
          int n;
          cin >> n;
          vector<Plant> plants(static_cast<size_t>(n));
          for (Plant& plant : plants) { cin >> plant.id >> plant.x >> plant.y; }
          int start = 0;
          for (int i = 1; i < n; ++i) {
              if (plants[static_cast<size_t>(i)].y < plants[static_cast<size_t>(start)].y) {
                  start = i;
              }
          }
          vector<bool> visited(static_cast<size_t>(n), false);
          vector<int> order;
          order.reserve(static_cast<size_t>(n));
          int current = start;
          visited[static_cast<size_t>(current)] = true;
          order.push_back(plants[static_cast<size_t>(current)].id);
          while (order.size() < plants.size()) {
              int next = -1;
              for (int i = 0; i < n; ++i) {
                  if (visited[static_cast<size_t>(i)]) { continue; }
                  if (next == -1) {
                      next = i;
                      continue;
                  }
                  const long long turn =
                      cross_from(plants[static_cast<size_t>(current)],
                                 plants[static_cast<size_t>(next)],
                                 plants[static_cast<size_t>(i)]);
                  if (turn < 0 ||
                      (turn == 0 &&
                       squared_distance(plants[static_cast<size_t>(current)],
                                        plants[static_cast<size_t>(i)]) <
                           squared_distance(plants[static_cast<size_t>(current)],
                                            plants[static_cast<size_t>(next)]))) {
                      next = i;
                  }
              }
              current = next;
              visited[static_cast<size_t>(current)] = true;
              order.push_back(plants[static_cast<size_t>(current)].id);
          }
          cout << n;
          for (const int id : order) { cout << ' ' << id; }
          cout << '\n';
      }
  }
external_url: http://bailian.openjudge.cn/practice/1696/
external_platform: OpenJudge 百練
external_problem_id: '1696'
external_title: Space Ant
external_relation: original
source_book_pages: [548]
source_pdf_pages: [178]
review_status: verified
---

題面資訊依外部 OJ 頁面核實；敘述、證明與程式為本站獨立撰寫。
