---
id: luogu-p6940
volume: lower
source_file: lower-volume
title: 洛谷 P6940 Visual Python++：矩形角點配對
chapter: 8
section: '8.6'
kind: external-oj
difficulty: 5
topics: ['掃描線', '平衡樹', '區間巢狀']
prerequisites: ['事件排序', 'laminar family']
statement: 有 n 個左上角與 n 個右下角，需要一一配對成字元矩形。合法程式中任意兩矩形只能嚴格巢狀或完全不相交，且無論哪種情況，邊界都不能有共同點。輸出任一合法配對；若不存在則輸出 syntax error。
constraints:
  - '1 <= n <= 100000'
  - '1 <= row,column <= 10^9'
  - 所有 2n 個角點位置互異
input_format: 第一行為 n；接著 n 行依輸入編號給左上角 (r,c)，再接 n 行依輸入編號給右下角。
output_format: 若有解，輸出 n 行，第 i 行為與第 i 個左上角配對的右下角編號，且整體須為 1..n 的排列；無解輸出 syntax error。
samples:
  - input: |
      2
      4 7
      9 8
      14 17
      19 18
    output: |
      2
      1
    explanation: 配對後兩個矩形分別為 (4,7)-(19,18) 與 (9,8)-(14,17)，第二個嚴格位於第一個內部，且邊界不重合。
core_knowledge:
  - 依列掃描時，每個右下角應配給尚未使用且欄座標小於它的最右左上角
  - 合法矩形族在任一水平切線上的欄區間形成括號式巢狀結構
  - 矩形開啟或關閉時，兩條垂直邊必在活動端點集合中相鄰
judgment: 先按 row 掃描角點，以 ordered set 對每個右下角貪心匹配欄座標最大的可用左上角。再獨立驗證所得矩形：同一水平邊事件上的區間不可相交；逐 row 開關矩形時，左右欄端點插入後及刪除前都必須相鄰。
hints:
  - 同 row 先處理右下角、再加入左上角，避免產生高度為零的矩形；右下角用 lower_bound(c) 的前一個左上角配對。
  - 配對只是候選，仍須驗證。把每個矩形的上、下邊按 row 分組，同 row 的閉區間必須嚴格分離。
  - 維護目前被掃描線穿過的所有垂直邊欄座標；開啟矩形插入兩端後應相鄰，關閉前也應相鄰，否則存在交錯重疊。
solution_outline: 將角點按 row 分組，對每組先將所有右下角與 active 左上角中最大 c<c_right 者配對並刪除，再加入左上角。若失敗或殘留即無解。建立矩形後檢查正寬高；將上下水平邊按 row 檢查閉區間不相交，並以另一輪 row 事件掃描 ordered set，關閉時先檢查相鄰並刪除，開啟時插入後檢查相鄰。
proof_or_invariant: 在任何合法解中，掃到右下角 (r,c) 時，其左上角已出現。若它沒有配給 c 左側最右的可用左上角 q，而配給更左的 p，則 q 所屬矩形的右下角必在目前之後；兩矩形的列區間與欄區間因此交錯，無法巢狀或分離，矛盾，故貪心是必要的。對候選矩形，水平邊檢查排除同 row 邊界交疊；活動欄端點相鄰不變量恰表示每次開關的區間不是跨過既有邊界，故所有矩形成為嚴格巢狀或分離的 laminar family。兩項都通過即充分合法。
complexity:
  time: O(n log n)
  space: O(n)
common_errors:
  - 同 row 先加入左上角，錯配成零高度矩形
  - 只做角點貪心而未驗證矩形間交錯
  - 把閉邊界相切視為合法；題目禁止邊界共享點
  - 關閉矩形時直接刪除，沒有先檢查兩端是否相鄰
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  struct Corner { long long row; long long column; int id; };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：先依 row 貪心配對角點，再掃描驗證矩形族嚴格巢狀或分離。
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  struct Corner {
      long long row;
      long long column;
      int id;
  };
  struct Rectangle {
      long long top;
      long long left;
      long long bottom;
      long long right;
  };
  struct RowEvent {
      vector<int> opening;
      vector<int> closing;
      vector<pair<long long, long long>> horizontal;
  };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      cin >> n;
      vector<Corner> top_left(static_cast<size_t>(n));
      vector<Corner> bottom_right(static_cast<size_t>(n));
      map<long long, pair<vector<int>, vector<int>>> corner_rows;
      for (int i = 0; i < n; ++i) {
          Corner& corner = top_left[static_cast<size_t>(i)];
          cin >> corner.row >> corner.column;
          corner.id = i;
          corner_rows[corner.row].first.push_back(i);
      }
      for (int i = 0; i < n; ++i) {
          Corner& corner = bottom_right[static_cast<size_t>(i)];
          cin >> corner.row >> corner.column;
          corner.id = i;
          corner_rows[corner.row].second.push_back(i);
      }

      bool valid = true;
      set<pair<long long, int>> available;
      vector<int> answer(static_cast<size_t>(n), -1);
      for (const auto& [row, ids] : corner_rows) {
          (void)row;
          for (int right_id : ids.second) {
              const long long column =
                  bottom_right[static_cast<size_t>(right_id)].column;
              auto iterator = available.lower_bound({column, -1});
              if (iterator == available.begin()) {
                  valid = false;
                  break;
              }
              --iterator;
              const int left_id = iterator->second;
              answer[static_cast<size_t>(left_id)] = right_id;
              available.erase(iterator);
          }
          if (!valid) { break; }
          for (int left_id : ids.first) {
              available.insert(
                  {top_left[static_cast<size_t>(left_id)].column, left_id});
          }
      }
      if (!available.empty()) { valid = false; }

      vector<Rectangle> rectangles(static_cast<size_t>(n));
      map<long long, RowEvent> events;
      if (valid) {
          for (int i = 0; i < n; ++i) {
              const Corner& first = top_left[static_cast<size_t>(i)];
              const Corner& second = bottom_right[static_cast<size_t>(
                  answer[static_cast<size_t>(i)])];
              Rectangle rectangle{
                  first.row, first.column, second.row, second.column};
              if (rectangle.top >= rectangle.bottom ||
                  rectangle.left >= rectangle.right) {
                  valid = false;
                  break;
              }
              rectangles[static_cast<size_t>(i)] = rectangle;
              events[rectangle.top].opening.push_back(i);
              events[rectangle.bottom].closing.push_back(i);
              events[rectangle.top].horizontal.push_back(
                  {rectangle.left, rectangle.right});
              events[rectangle.bottom].horizontal.push_back(
                  {rectangle.left, rectangle.right});
          }
      }

      set<pair<long long, int>> vertical_edges;
      if (valid) {
          for (auto& [row, event] : events) {
              (void)row;
              sort(event.horizontal.begin(), event.horizontal.end());
              for (size_t i = 1; i < event.horizontal.size(); ++i) {
                  if (event.horizontal[i - 1U].second >=
                      event.horizontal[i].first) {
                      valid = false;
                  }
              }
              for (int id : event.closing) {
                  const Rectangle& rectangle =
                      rectangles[static_cast<size_t>(id)];
                  const auto left =
                      vertical_edges.find({rectangle.left, id});
                  const auto right =
                      vertical_edges.find({rectangle.right, id});
                  if (left == vertical_edges.end() ||
                      right == vertical_edges.end() ||
                      next(left) != right) {
                      valid = false;
                      break;
                  }
                  vertical_edges.erase(left);
                  vertical_edges.erase(right);
              }
              if (!valid) { break; }
              for (int id : event.opening) {
                  const Rectangle& rectangle =
                      rectangles[static_cast<size_t>(id)];
                  const auto same_left =
                      vertical_edges.lower_bound({rectangle.left, -1});
                  const auto same_right =
                      vertical_edges.lower_bound({rectangle.right, -1});
                  if ((same_left != vertical_edges.end() &&
                       same_left->first == rectangle.left) ||
                      (same_right != vertical_edges.end() &&
                       same_right->first == rectangle.right)) {
                      valid = false;
                      break;
                  }
                  const auto left =
                      vertical_edges.insert({rectangle.left, id});
                  const auto right =
                      vertical_edges.insert({rectangle.right, id});
                  if (!left.second || !right.second ||
                      next(left.first) != right.first) {
                      valid = false;
                      break;
                  }
              }
              if (!valid) { break; }
          }
      }
      if (!vertical_edges.empty()) { valid = false; }

      if (!valid) {
          cout << "syntax error\n";
      } else {
          for (int id : answer) { cout << id + 1 << '\n'; }
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P6940
external_platform: 洛谷
external_problem_id: P6940
external_title: '[ICPC 2017 WF] Visual Python++'
external_relation: original
source_book_pages: [563]
source_pdf_pages: [193]
review_status: verified
---

題面、限制與四組官方範例已依 ICPC World Finals 封存題面（UVa 1760）及洛谷頁交叉核實；繁中敘述、證明與程式為本站獨立撰寫。
