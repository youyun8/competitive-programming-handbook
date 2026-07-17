---
id: dp-general-optimization
volume: upper
source_file: upper-volume
chapter: 5
section: '5.7'
title: DP 一般優化
summary: 減少冗餘狀態、重排轉移順序、用資料結構加速查詢，讓 DP 更快更省空間。
prerequisites: [dynamic-programming]
learning_goals: [辨識可消除狀態維度, 利用資料結構加速轉移, 重排計算順序以減少重複]
concepts: [state-reduction, transition-reordering, data-structure-optimization]
complexity:
  time: 依技術而異
  space: 依技術而異
related_exercises: []
source_book_pages: [360, 365]
source_pdf_pages: [378, 383]
review_status: verified
---

## 這個技術解決什麼問題

許多 DP 初稿狀態維度很高或轉移很冗餘。透過分析依賴關係，常可刪除不必要的維度、改變枚舉順序，或用單調佇列、線段樹加速區間查詢。

## 辨識題型的訊號

DP 時間複雜度明顯過高，但觀察發現某些維度實際上可由其他維度推得；或者轉移式內部有重複的 max/min/sum 可查詢。

## 核心想法與直覺

先寫出「對的但慢的」DP，再分析：`dp[i]` 真正的值是否只看最近的某個決策點？若是的話，維度或查找都可以壓掉。

## 狀態／資料結構定義

沒有固定模板。常見手法包括：滾動陣列、離線排序改變轉移順序、離散化座標、線段樹 or 樹狀陣列維護前綴最值。

## 不變量或正確性證明

狀態縮減的正確性在於：被移除的維度對未來轉移沒有獨立貢獻，或其值可由保留維度唯一確定。資料結構只是加速查詢，不改變 DP 的值本身。

## 逐步演算法

1. 先寫暴力 DP 確認轉移式。
2. 檢查是否有維度冗餘。
3. 觀察轉移是否為區間最值 / 前綴和 / 條件計數。
4. 導入對應資料結構或重排循環。
5. 重新分析複雜度。

## C++17 模板

```cpp
#include <bits/stdc++.h>
using namespace std;

class DpOptimizationTemplate {
public:
    // 線段樹加速區間 max 查詢的 DP
    static int segment_tree_optimized_dp(const vector<int>& arr) {
        const int n = static_cast<int>(arr.size());
        const int max_val = *max_element(arr.begin(), arr.end());
        vector<int> seg(4 * (max_val + 1), 0);
        function<void(int, int, int, int, int)> update = [&](int node, int left, int right, int pos, int val) {
            if (left == right) {
                seg[node] = max(seg[node], val);
                return;
            }
            const int mid = (left + right) / 2;
            if (pos <= mid) { update(node * 2, left, mid, pos, val); }
            else { update(node * 2 + 1, mid + 1, right, pos, val); }
            seg[node] = max(seg[node * 2], seg[node * 2 + 1]);
        };
        function<int(int, int, int, int, int)> query = [&](int node, int left, int right, int qleft, int qright) -> int {
            if (qright < left || right < qleft) { return 0; }
            if (qleft <= left && right <= qright) { return seg[node]; }
            const int mid = (left + right) / 2;
            return max(query(node * 2, left, mid, qleft, qright),
                       query(node * 2 + 1, mid + 1, right, qleft, qright));
        };
        int answer = 0;
        for (int i = 0; i < n; ++i) {
            const int best = query(1, 0, max_val, 0, arr[i] - 1) + 1;
            answer = max(answer, best);
            update(1, 0, max_val, arr[i], best);
        }
        return answer;
    }
};
```

## 時間與空間複雜度

滾動陣列把空間從 O(n²) 降到 O(n)；線段樹加速可把某些 O(n²) 轉移降到 O(n log n)。實際複雜度視具體優化而定。

## 常見錯誤與邊界條件

- 狀態縮減時漏掉某個隱藏條件。
- 資料結構查詢區間開閉區間弄錯。
- 重排順序後依賴順序被破壞。

## 與相似技巧的比較

單調佇列、斜率優化、四邊形不等式都是 DP 一般優化的特例，只是適用條件更嚴格、優化幅度更大。一般優化是這些技巧的「前置步驟」：先縮狀態再想結構。

## 例題與分級練習

- 入門：LIS 線段樹優化。
- 中級：二維偏序 DP、離線排序轉移。
- 進階：CDQ 分治優化 DP、線段樹 beats。

## 本節重點速查

先寫對再加速；冗餘維度檢查；線段樹/樹狀陣列加速區間查詢；重排循環要小心依賴方向。
