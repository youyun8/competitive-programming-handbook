---
id: combinatorics-basics
volume: lower
source_file: lower-volume
chapter: 7
section: '7.1'
title: 排列與組合：計數的基本語言
summary: 用排列、組合與加法／乘法原則建立計數直覺，並處理重複與限制條件。
prerequisites: [integers]
learning_goals:
  - 區分排列與組合的適用場景
  - 運用加法與乘法原則分解計數問題
  - 處理可重複選取與受限條件
concepts: [permutation, combination, counting]
complexity:
  time: O(n) 或 O(n²) for table
  space: O(n)
related_exercises: []
source_book_pages: [463, 467]
source_pdf_pages: [93, 97]
review_status: verified
---

## 這個技術解決什麼問題

給定有限集合，計算滿足條件的選取方式數目。這是組合數學的基礎：把問題拆解成「先選再放」或「分類計數」。

## 辨識題型的訊號

題目問「有幾種方法」「多少方案」「總數為何」，且涉及選取、排序、分組、染色等操作。

## 核心想法與直覺

- 排列：選出的物件有順序之分。
- 組合：選出的物件只看集合內容，不看順序。
- 加法原則：分類互斥時，總數為各類之和。
- 乘法原則：步驟獨立時，總數為各步之積。

## 狀態／資料結構定義

階乘表 `factorial[0..n]`，其中 $\text{factorial}[k] = k!$；組合數表 $C[n][k]$，即楊輝三角的 rows。

## 不變量或正確性證明

$P(n,k) = \frac{n!}{(n-k)!}$ 是從 $n$ 個相異物取 $k$ 個排成一列的方法數；$C(n,k) = \frac{P(n,k)}{k!} = \frac{n!}{k!(n-k)!}$ 則消去 $k$ 個內部排列。兩者均由乘法原則推得。

## 逐步演算法

1. 判斷是否計入順序：是則用排列，否則用組合。
2. 判斷選取取是否獨立：獨立步驟相乘，互斥分類相加。
3. 若有重複元素或限制條件，使用容斥或遞推分解。

## C++17 模板

```cpp
#include <vector>

long long combination_table(int n, std::vector<std::vector<long long>>& c) {
    c.assign(n + 1, std::vector<long long>(n + 1, 0));
    for (int i = 0; i <= n; ++i) {
        c[i][0] = c[i][i] = 1;
        for (int j = 1; j < i; ++j) {
            c[i][j] = c[i - 1][j - 1] + c[i - 1][j];
        }
    }
    return c[n][n];
}
```

## 時間與空間複雜度

階乘預處理 $O(n)$；楊輝三角表 $O(n^2)$ 時間與空間。單次查詢若已有階乘與逆階乘則 $O(1)$。

## 常見錯誤與邊界條件

$0! = 1$；$C(n,0)=C(n,n)=1$；$n<k$ 時應回傳 0；使用 `long long` 時注意 $n>20$ 會溢位，需要取模或改用大數。

## 與相似技巧的比較

排列組合是計數的「原子」；後續的生成函數與 Burnside 都是在更高抽象層次上自動化這些計數。

## 例題與分級練習

從簡單的「從 $n$ 個人選 $k$ 個」開始，進階到棋盤染色、路徑計數與隔板法。

## 本節重點速查

先問「有無順序」再問「步驟還是分類」；組合數可用遞推或階乘／逆元計算；注意溢位與 $n<k$。
