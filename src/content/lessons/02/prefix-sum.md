---
id: prefix-sum
volume: upper
source_file: upper-volume
chapter: 2
section: '2.6'
title: 前綴和與差分：區間查詢的降維打擊
summary: 利用前綴和將區間查詢降為 O(1)，並以差分實現區間批量修改，推廣到二維與三維。
prerequisites: [arrays, complexity]
learning_goals:
  - 建構一維、二維與三維前綴和陣列
  - 使用差分在 O(1) 區間修改後以 O(n) 還原
  - 判斷前綴和是否適用於動態修改場景
concepts: [prefix-sum, difference-array, range-query, imos]
complexity:
  time: O(n) 預處理，O(1) 區間查詢
  space: O(n)
related_exercises: ['range-add-difference']
source_book_pages: [33, 95]
source_pdf_pages: [51, 113]
review_status: verified
---

## 這個技術解決什麼問題

反覆查詢陣列某段區間的總和，若每次都遍歷該區間，複雜度會隨查詢次數爆炸。前綴和將「區間和」轉換為「兩個前綴相減」。差分則反過來：若要對區間 [l, r] 同時加一個值，只需在差分陣列的 l 處 +v、r+1 處 -v，最後做一次前綴和還原。

## 辨識題型的訊號

- 多次查詢子矩陣或子陣列的和。
- 區間批量加值，最後只問最終陣列的值。
- 二維離散化面積覆蓋計數。
- 將路徑問題轉為前綴性質統計。

## 核心想法與直覺

前綴和把累積的歷史存在每個位置，因此查詢任意區間只要看兩個端點的差。差分則是前綴和的反運算：對原陣列做前綴和得到結果，那麼對差分陣列做前綴和就得到原陣列。區間修改對應差分上的兩點修改。

## 狀態／資料結構定義

一維前綴和：`prefix[0] = 0; prefix[i] = prefix[i-1] + a[i];`
二維前綴和：`prefix[i][j] = a[i][j] + prefix[i-1][j] + prefix[i][j-1] - prefix[i-1][j-1]`
差分：`diff[l] += v; diff[r+1] -= v;`

## 不變量或正確性證明

對一維前綴和，`sum(l, r) = prefix[r] - prefix[l-1]` 由定義直接展開即得：
prefix[r] = a[1] + ... + a[r]；prefix[l-1] = a[1] + ... + a[l-1]；相減即為 a[l] + ... + a[r]。
差分上，若 diff[l] += v 且 diff[r+1] -= v，則做一次前綴和後，對所有 i 屬於 [l, r]，累積和會多 v；對 i > r，-v 會抵銷；對 i < l，則不受影響。

## 逐步演算法

1. 讀入陣列，建構前綴和（或差分）。
2. 查詢區間 [l, r] 和：ans = prefix[r] - prefix[l-1]。
3. 區間修改：diff[l] += v，diff[r+1] -= v。
4. 全部修改完後，對 diff 做一次前綴和還原為結果陣列。

## C++17 模板

```cpp
#include <vector>

class PrefixSum2D {
    std::vector<std::vector<long long>> prefix;

public:
    PrefixSum2D(const std::vector<std::vector<int>>& matrix) {
        const int rows = static_cast<int>(matrix.size());
        const int cols = rows > 0 ? static_cast<int>(matrix[0].size()) : 0;
        prefix.assign(rows + 1, std::vector<long long>(cols + 1, 0));
        for (int i = 1; i <= rows; ++i) {
            for (int j = 1; j <= cols; ++j) {
                prefix[i][j] = matrix[i - 1][j - 1]
                             + prefix[i - 1][j]
                             + prefix[i][j - 1]
                             - prefix[i - 1][j - 1];
            }
        }
    }

    long long query(int r1, int c1, int r2, int c2) const {
        // inclusive coordinates, 1-based
        return prefix[r2][c2]
             - prefix[r1 - 1][c2]
             - prefix[r2][c1 - 1]
             + prefix[r1 - 1][c1 - 1];
    }
};
```

## 時間與空間複雜度

一維前綴和建構 O(n)，查詢 O(1)；二維 O(rc) 建構，O(1) 查詢。差分單次修改 O(1)，還原 O(n)。空間額外需要與原陣列同等級別。

## 常見錯誤與邊界條件

- 二維前綴和的四項加減符號寫錯。
- 差分忘記在 r+1 處減回來，導致後半段陣列持續累積错误值。
- 索引從 0 開始時，l-1 可能為 -1，需用 prefix[-1] = 0 的慣例或統一轉為 1-based。
- 差分與前綴和混合使用時，資料型別溢出；建議結果用 long long。

## 與相似技巧的比較

樹狀陣列與線段樹可處理動態區間修改與查詢，但前綴和與差分在靜態場景中程式碼更短、常數更小。三維前綴和的符號項數會增加到 8 項，出錯率更高，需特別小心正負號。

## 例題與分級練習

先練習一維區間和查詢與差分區間加值，再挑戰二維子矩陣和最大值的枚舉。進階可試以三維前綴和解決空間立方體求和。

## 本節重點速查

前綴和把區間求和變兩點相減；差分把區間加法變兩點單點修改；二維公式四項加減、三維八項；注意 long long。
