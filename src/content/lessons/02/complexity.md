---
id: complexity
volume: upper
source_file: upper-volume
chapter: 2
section: '2.1'
title: 演算法複雜度：衡量效率的語言
summary: 學會用 Big-O 描述時間與空間複雜度，並能在設計演算法前快速估算可行上限。
prerequisites: [loops, recursion]
learning_goals:
  - 正確計算巢狀迴圈與遞迴的時間複雜度
  - 區分最壞、平均與均攤複雜度
  - 依題目限制選擇合適的演算法等級
concepts: [big-o, time-complexity, space-complexity, amortized-analysis]
complexity:
  time: N/A
  space: N/A
related_exercises: []
source_book_pages: [33, 95]
source_pdf_pages: [51, 113]
review_status: verified
---

## 這個技術解決什麼問題

複雜度分析讓你在寫下第一行程式碼之前，就能判斷這個方法會不會超時或超過記憶體限制。它是選擇演算法、設計資料結構與溝通實作難度的通用語言。

## 辨識題型的訊號

所有題目都需要；特別是當資料規模達到 10^5 或 10^6 時，O(n^2) 通常不可行，需要 O(n log n) 或更佳。

## 核心想法與直覺

Big-O 描述的是當 n 夠大時，成長曲線的上界。我們只保留最高次項且忽略常數係數，因為在足夠大的輸入下，低次項與常數對執行時間的影響將被淹沒。

## 狀態／資料結構定義

不需要特定資料結構，重點是對運算次數建立數學上界。

## 不變量或正確性證明

Big-O 的定義：f(n) = O(g(n)) 表示存在常數 c 與 n0，使得當 n >= n0 時，f(n) <= c \* g(n)。這是對演算法成本的上界承諾，不是精確公式。均攤分析則考慮一連串操作的總成本除以操作次數，某些單次昂貴操作可被大量廉價操作平均分攤。

## 逐步演算法

1. 找出決定執行時間的基本操作（比較、賦值、算術）。
2. 建立輸入規模 n 與基本操作次數的函數關係 T(n)。
3. 化簡為最高次項的主導項，寫成 O(...)。
4. 若存在遞迴，使用主定理或展開遞迴式求解。

## C++17 模板

```cpp
#include <iostream>

// 示範：O(n) 線性掃描找最大值
int find_max(const int* arr, int n) {
    int max_val = arr[0];
    for (int i = 1; i < n; ++i) {
        if (arr[i] > max_val) {
            max_val = arr[i];
        }
    }
    return max_val;
}

// 示範：O(n log n) merge sort 分治框架
void merge_sort_example(int n) {
    // T(n) = 2 * T(n/2) + O(n)
    // 根據主定理 case 2，得到 O(n log n)
    (void)n;
}
```

## 時間與空間複雜度

常見等級由快到慢：O(1) < O(log n) < O(sqrt(n)) < O(n) < O(n log n) < O(n^2) < O(2^n) < O(n!)。空間複雜度同樣以此類推，衡量輔助記憶體大小。

## 常見錯誤與邊界條件

- 看到雙層迴圈就直接寫 O(n^2)，忽略了內層迴圈範圍可能受限（例如 j < i）。
- 忽略遞迴的隱含空間成本（call stack）。
- 把均攤與平均複雜度混為一談；前者是對操作序列的總成本保證，後者是對輸入分佈的期望。
- 忘記 STL 容器操作的複雜度（如 vector 中間插入是 O(n)）。

## 與相似技巧的比較

Omega 與 Theta 提供下界與緊界，但在競賽中只要說出上界 O(...) 就足夠。實際執行時間還受常數、快取與分支預測影響，但 Big-O 仍是初步篩選的最有效工具。

## 例題與分級練習

先練習為常見排序演算法標註複雜度，再嘗試估算兩層迴圈搭配 break 條件的複雜度。進階題研究攤銷分析的 potential method。

## 本節重點速查

Big-O 只看最高次項；常見上限 n=10^5 對應 O(n log n) 可過、O(n^2) 會超時；空間別忘記算陣列與遞迴深度。
