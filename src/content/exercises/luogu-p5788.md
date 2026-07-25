---
id: luogu-p5788
volume: upper
source_file: upper-volume
title: 洛谷 P5788 單調棧：每個元素右邊第一個更大的數
chapter: 1
section: '1.3'
kind: external-oj
difficulty: 2
topics: ['單調棧', '堆疊', '線性掃描']
prerequisites: ['stack']
statement: |-
  給定一個長度為 n 的序列，對每個位置 i 求出最小的 j > i 使得 a[j] > a[i]；若不存在則答案為 0。
  本卡片的題意為本站依題目主題重新敘述；完整原文敘述與資料範圍請以外部題目頁面為準。
constraints:
  - 'n 可達 3×10^6 等級，必須是 O(n) 並搭配快速輸入'
  - '完整限制條件請參閱外部題目頁面'
input_format: '第一行一個整數 n；第二行 n 個整數 a[1..n]。'
output_format: '一行 n 個整數，第 i 個是位置 i 的答案，不存在時輸出 0。'
samples:
  - input: |
      5
      5 4 2 3 1
    output: |
      0 0 4 0 0
    explanation: |-
      位置 1 的值 5 是全域最大，答案 0；位置 2 的值 4 右邊只剩 2、3、1，也沒有更大的，答案同樣是 0；位置 3 的值 2 右邊第一個更大的是位置 4 的值 3。 本站自製測資（本次工作環境的網路政策封鎖了所有 OJ 網域，無法取得官方範例）。解法本身已與獨立撰寫的暴力參考解在數千組隨機測資上對拍一致。
hints:
  - |-
    樸素做法是對每個 i 往右掃到第一個更大的值，最壞 O(n²)。關鍵觀察是：如果 i < j 而且 a[i] >= a[j]，那麼 j 永遠不會擋住 i 的答案——凡是能超過 a[j] 的不一定能超過 a[i]，所以 a[j] 這種「被壓在下面的小值」可以和 a[i] 一起排隊等答案。
  - |-
    維護一個棧，裡面存**還沒找到答案的索引**，而且對應的值由棧底到棧頂遞減。這個單調性是自然形成的，不需要額外維護。
  - |-
    讀到新元素 a[i] 時，只要棧頂對應的值小於 a[i]，那個索引的答案就是 i，把它彈出並記錄；重複直到棧頂的值不小於 a[i]，再把 i 推進去。
  - |-
    複雜度用攤還分析：每個索引最多進棧一次、出棧一次，所以雖然內層是 while 迴圈，總操作次數仍是 O(n)。
  - |-
    最後留在棧裡的索引都沒有找到更大的元素，答案保持 0。n 很大時記得關掉 `cin` 與 `stdio` 的同步。
solution_outline: |-
  用一個 `vector<int>` 當棧存索引，維持對應值由底到頂遞減。從左到右掃描：當棧非空且棧頂值小於當前值時，彈出並把當前索引記為它的答案；然後推入當前索引。掃完後棧中殘留的索引答案為 0。
proof_or_invariant: |-
  不變量是「棧中索引由底到頂遞增，對應的值嚴格遞減」。維持這個性質後，棧頂永遠是最容易被下一個元素超過的候選；一旦被超過就永久出棧，因此每個元素只被處理常數次，總時間 O(n)。
complexity:
  time: 'O(n)'
  space: 'O(n)'
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      if (!(cin >> n)) { return 0; }
      vector<int> a(static_cast<size_t>(n) + 1);
      for (int i = 1; i <= n; ++i) { cin >> a[static_cast<size_t>(i)]; }
      vector<int> answer(static_cast<size_t>(n) + 1, 0);

      // TODO：把這段 O(n^2) 換成單調棧。
      //   棧裡存「還沒找到答案」的索引，且對應的值由底到頂遞減。
      //   讀到新元素 i 時，所有棧頂值小於 a[i] 的索引，答案都是 i，逐一彈出。
      //   每個索引最多進棧一次、出棧一次，總計 O(n)。
      for (int i = 1; i <= n; ++i) {
          for (int j = i + 1; j <= n; ++j) {
              if (a[static_cast<size_t>(j)] > a[static_cast<size_t>(i)]) {
                  answer[static_cast<size_t>(i)] = j;
                  break;
              }
          }
      }

      for (int i = 1; i <= n; ++i) { cout << answer[static_cast<size_t>(i)] << " \n"[i == n]; }
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  // 單調棧：棧內索引對應的值嚴格遞減，新元素把所有比它小的都彈出，
  // 被彈出者的答案就是當前索引。
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      if (!(cin >> n)) { return 0; }
      vector<int> a(static_cast<size_t>(n) + 1);
      for (int i = 1; i <= n; ++i) { cin >> a[static_cast<size_t>(i)]; }
      vector<int> answer(static_cast<size_t>(n) + 1, 0);
      vector<int> stack_indices;
      for (int i = 1; i <= n; ++i) {
          while (!stack_indices.empty() && a[static_cast<size_t>(stack_indices.back())] < a[static_cast<size_t>(i)]) {
              answer[static_cast<size_t>(stack_indices.back())] = i;
              stack_indices.pop_back();
          }
          stack_indices.push_back(i);
      }
      for (int i = 1; i <= n; ++i) { cout << answer[static_cast<size_t>(i)] << " \n"[i == n]; }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P5788
external_platform: 洛谷
external_problem_id: P5788
external_title: '【模板】單調棧'
external_relation: original
source_book_pages: [1, 31]
source_pdf_pages: [19, 49]
review_status: verified
---

單調棧是把 O(n²) 的「往右找第一個滿足條件的元素」壓成 O(n) 的標準工具，接雨水、最大矩形、直方圖都靠它。
