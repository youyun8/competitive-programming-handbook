---
id: divide-and-conquer
volume: upper
source_file: upper-volume
chapter: 2
section: '2.9'
title: 分治法：拆解、征服、合併的遞迴藝術
summary: 學會將大問題分解為獨立或半獨立的子問題，遞迴求解後合併答案，並掌握漢諾塔、快速冪、合併排序與快速排序的經典套路。
prerequisites: [recursion, complexity]
learning_goals:
  - 設計分治問題的子問題劃分與合併邏輯
  - 使用主定理分析分治複雜度
  - 實作歸併排序與快速排序並理解其穩定性差異
concepts: [divide-and-conquer, recursion, merge-sort, quick-sort, fast-power]
complexity:
  time: O(n log n) for merge sort, O(log n) for fast power
  space: O(n) or O(log n)
related_exercises: ['merge-sort-inversions']
source_book_pages: [33, 95]
source_pdf_pages: [51, 113]
review_status: verified
---

## 這個技術解決什麼問題

當問題可以被劃分為兩個以上結構相同但規模更小的子問題，且子問題的解可以線性或對數時間合併為母問題的解時，分治法往往能帶來對數級的複雜度改進。漢諾塔是遞迴教育經典；快速冪是數論基石；合併排序與快速排序則是排序主題的兩大支柱。

## 辨識題型的訊號

- 大區間問題可以從中點分成左右兩個獨立區間。
- 需要計算大指數 mod 結果（快速冪）。
- 排序或求逆序對數量。
- 平面最近點對、區間最大值等幾何或統計問題。

## 核心想法與直覺

分的關鍵是「獨立性」：左右子問題互不干涉。治是遞迴到底層基例。合併是最難的部分，通常決定整體複雜度。合併排序的合併是線性掃描；快速排序的合併是「不做事」（pivot 已經歸位）。

## 狀態／資料結構定義

分治遞迴函式的典型簽名：`solve(int left, int right)`，對應區間 [left, right]。歸併排序需要額外緩衝陣列 `temp` 存放合併結果。

## 不變量或正確性證明

歸併排序的不變量：當遞迴回到區間 [l, r] 時，左右兩半 [l, mid] 與 [mid+1, r] 都已是各自有序的。合併過程比較兩端最小值並放入緩衝區，因此緩衝區結果也是全局有序的。基例區間長度為 1 時自然有序。由數學歸納法，歸併排序正確。

## 逐步演算法

快速冪：

1. 若指數為 0，回傳 1。
2. 令 half = fast_power(base, exp/2)。
3. 若 exp 為偶數，回傳 half _ half；否則回傳 half _ half \* base。

歸併排序：

1. 若區間長度 <= 1，直接回傳。
2. 取中點，遞迴排序左右兩半。
3. 雙指標合併兩個有序區間到緩衝區。
4. 將緩衝區寫回原陣列。

## C++17 模板

```cpp
#include <vector>

long long fast_power(long long base, long long exp, long long mod) {
    long long result = 1 % mod;
    base %= mod;
    while (exp > 0) {
        if (exp & 1LL) {
            result = (result * base) % mod;
        }
        base = (base * base) % mod;
        exp >>= 1LL;
    }
    return result;
}

void merge_sort(std::vector<int>& values, int left, int right, std::vector<int>& buffer) {
    if (left >= right) return;
    const int mid = left + (right - left) / 2;
    merge_sort(values, left, mid, buffer);
    merge_sort(values, mid + 1, right, buffer);

    int i = left;
    int j = mid + 1;
    int k = left;
    while (i <= mid && j <= right) {
        if (values[i] <= values[j]) {
            buffer[k++] = values[i++];
        } else {
            buffer[k++] = values[j++];
        }
    }
    while (i <= mid) buffer[k++] = values[i++];
    while (j <= right) buffer[k++] = values[j++];
    for (int p = left; p <= right; ++p) {
        values[p] = buffer[p];
    }
}
```

## 時間與空間複雜度

快速冪 O(log exp)。歸併排序 T(n) = 2T(n/2) + O(n) = O(n log n)，空間 O(n)。快速排序平均 O(n log n)，最壞 O(n^2)，空間 O(log n) 遞迴深度。

## 常見錯誤與邊界條件

- 分治的 mid 計算溢出：`mid = (left + right) / 2` 可能溢出，應改用 `left + (right - left) / 2`。
- 歸併排序緩衝區未在合併後複寫回原陣列。
- 快速排序 pivot 選得不好（如有序陣列選第一個），退化成 O(n^2)。
- 快速冪中忘記對 base 與 result 持續取 mod，導致溢出。

## 與相似技巧的比較

遞迴只是實作手段；分治是設計策略。貪心與 DP 通常也會分解問題，但分治要求子問題獨立且解可合併。若子問題重疊，應改用動態規劃記憶化解。

## 例題與分級練習

先實作快速冪與歸併排序，再用歸併排序過程計算逆序對數量。進階可嘗試平面最近點對分治解法。

## 本節重點速查

分治 = 劃分 + 遞迴求解 + 合合併；寫遞迴前先確認基例；歸併排序穩定、快速排序常數小但不穩定；中點防溢用 left + (right-left)/2。
