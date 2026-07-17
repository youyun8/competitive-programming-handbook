---
id: greedy
volume: upper
source_file: upper-volume
chapter: 2
section: '2.10'
title: 貪心法與模擬：局部最優通往全域最優
summary: 學會設計貪心選擇、以交換論證證明正確性，並能撰寫流程模擬處理狀態轉移。
prerequisites: [sorting, complexity]
learning_goals:
  - 判斷問題是否具備貪心選擇性質
  - 使用交換論證證明貪心的正確性
  - 設計模擬流程並避免時間複雜度過高
concepts: [greedy, exchange-argument, simulation, local-optimum]
complexity:
  time: 視問題而定，通常 O(n log n)
  space: O(n)
related_exercises: []
source_book_pages: [33, 95]
source_pdf_pages: [51, 113]
review_status: verified
---

## 這個技術解決什麼問題

當問題的全域最優解可以透過「每一步都選目前看起來最好的」來構造時，貪心法能在極低複雜度下得到答案。流程模擬則用於需要逐步追蹤狀態變化的題目，兩者常一起出現。

## 辨識題型的訊號

- 區間排程：選最多不重疊區間，或最少點覆蓋所有區間。
- 活動安排、檔案合併、最小延遲排程。
- 模擬題：「按照規則一步步執行直到結束狀態」。
- 霍夫曼編碼、最小生成樹（Kruskal、Prim）本質上也是貪心法。

## 核心想法與直覺

貪心的關鍵不是「直覺上對」，而是「能不能證明」。交換論證是競賽中最實用的直覺證法：假設某個最優解沒有採用貪心選擇，我們把它局部調整成貪心選整成貪心選擇，證明答案不會變差。如果能做到，則存在一個包含貪心選擇的最優解。

## 狀態／資料結構定義

貪心通常搭配排序或優先佇列來做選擇。模擬則需要清楚定義狀態態變數、轉移規則與終止條件。

## 不變量或正確性證明

以「最多不重疊區間」為例。將區間按結束時間排序，每次選結束最早的區間。假設最優解中的第一個區間不是結束最早的，我們可以把它替換成結束最早的區間，不會減少後續能選的區間數量（因為新區間結束得更早或相同）。逐步替換後，最優解就變成了貪心解。

## 逐步演算法

1. 定義貪心選擇準則（如最早結束、最小花費、最大權重）。
2. 將所有選項按準則排序。
3. 依序處理每個選項，若與已選集合相容則選入。
4. 輸出最終集合或累積值。

模擬：

1. 初始化狀態變數。
2. 在終止條件達成前，反覆套用轉移規則。
3. 注意可能出現循環或過大迭代次數，必要時用數學替代暴力。

## C++17 模板

```cpp
#include <vector>
#include <algorithm>

struct Interval {
    int start;
    int end;
};

// 最多不重疊區間數量（區間排程）
int max_non_overlapping(std::vector<Interval>& intervals) {
    std::sort(intervals.begin(), intervals.end(),
        [](const Interval& a, const Interval& b) {
            return a.end < b.end;
        });

    int count = 0;
    int last_end = -1;
    for (const auto& interval : intervals) {
        if (interval.start >= last_end) {
            ++count;
            last_end = interval.end;
        }
    }
    return count;
}
```

## 時間與空間複雜度

排序 O(n log n)，掃描 O(n)。空間 O(n)。模擬的複雜度取決於狀態數與轉移次數，若狀態空間過大需改用數學公式或動態規劃。

## 常見錯誤與邊界條件

- 未證明貪心性質就盲目套用，導致在某些測資上失敗。
- 排序順序錯誤（如按開始時間而非結束時間排序區間排程）。
- 模擬陷入無限迴圈（未檢測週期或終止條件）。
- 用 float/double 比較相等導致模擬條件判斷錯誤。

## 與相似技巧的比較

DP 適合子問題重疊的最優化；貪心適合具有貪心選擇性質的問題。若無法證明貪心正確性，通常應退回到 DP 或搜尋。模擬與貪心常結合：先模擬狀態轉移，再在轉移中做貪心選擇。

## 例題與分級練習

先解決經典區間排程，再嘗試「最少箭矢引爆氣球」。模擬方面，先寫「約瑟夫問題」的暴力模擬，再試著用數學優化到 O(n) 或 O(k log n)。

## 本節重點速查

貪心不是感覺對就對，要能交換論證；常用排序或堆做選擇；模擬要注意終止條件與迴圈檢測。
