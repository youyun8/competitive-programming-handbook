---
id: catalan-stirling
volume: lower
source_file: lower-volume
chapter: 7
section: '7.6'
title: Catalan 數與 Stirling 數
summary: 以兩類經典數列處理合法括號、路徑、集合劃分與排列環結構的計數。
prerequisites: [combinatorics, binomial-theorem]
learning_goals:
  - 辨識 Catalan 數的題型特徵
  - 理解第一類與第二類 Stirling 數的遞推意義
  - 建立數表並處理模運算
concepts: [catalan-number, stirling-number]
complexity:
  time: O(n²) for table
  space: O(n²)
related_exercises: []
source_book_pages: [486, 491]
source_pdf_pages: [116, 121]
review_status: verified
---

## 這個技術解決什麼問題

Catalan 數計數「不破壞結構」的對象：合法括號、不跨越對角線的路徑、二叉樹形態。Stirling 數計數集合劃分與排列的循環分解。

## 辨識題型的訊號

- Catalan：n 對括號合法序列、$n+1$ 個節點的二叉樹、凸 $n+2$ 邊形的三角剖分。
- Stirling 第一類：排列的循環數量。
- Stirling 第二類：把 $n$ 個相異元素分進 $k$ 個非空子集。

## 核心想法與直覺

- Catalan：$C_n = \frac{1}{n+1} C(2n,n)$。遞推 $C_n = \sum_{i=0}^{n-1} C_i C_{n-1-i}$，對應「第一個元素配對後左右子問題」。
- Stirling 第二類 $S(n,k)$：第 $n$ 個元素可自成一組（$S(n-1,k-1)$）或併入既有 $k$ 組之一（$k \cdot S(n-1,k)$）。
- Stirling 第一類 $s(n,k)$（無符號）：第 $n$ 個元素自成循環或插入既有循環的某個位置之後。

## 狀態／資料結構定義

二維陣列 `cat[n+1]` 與 `stir[n+1][k+1]`，模 `mod` 儲存。

## 不變量或正確性證明

Catalan 的封閉式由反射原理得到：總路徑 $C(2n,n)$ 減去曾跨越對角線的路徑 $C(2n,n+1)$，比值得 $C_n$。Stirling 的遞推直接對應最後元素的歸屬決策。

## 逐步演算法

1. 初始化 $C_0=1$、$S(0,0)=1$。
2. 依據題型選擇遞推或封閉式。
3. 模運算下對除法使用逆元。

## C++17 模板

```cpp
#include <vector>

struct CatalanStirling {
    std::vector<long long> cat;
    std::vector<std::vector<long long>> stir2;

    static long long mod_pow(long long a, long long e, long long mod) {
        long long r = 1 % mod;
        while (e) {
            if (e & 1) r = r * a % mod;
            a = a * a % mod;
            e >>= 1;
        }
        return r;
    }

    CatalanStirling(int n, long long mod) {
        cat.assign(n + 1, 0);
        cat[0] = 1;
        for (int i = 1; i <= n; ++i) {
            long long c = 1;
            for (int j = 0; j < i; ++j) {
                c = (c * (2 * i - j) % mod) * mod_pow(j + 1, mod - 2, mod) % mod;
            }
            cat[i] = c * mod_pow(i + 1, mod - 2, mod) % mod;
        }

        stir2.assign(n + 1, std::vector<long long>(n + 1, 0));
        stir2[0][0] = 1;
        for (int i = 1; i <= n; ++i) {
            for (int k = 1; k <= i; ++k) {
                stir2[i][k] = (stir2[i - 1][k - 1] + k * stir2[i - 1][k]) % mod;
            }
        }
    }
};
```

## 時間與空間複雜度

Catalan 封閉式單點 $O(n)$；建表 $O(n^2)$。Stirling 建表 $O(n^2)$ 時間與空間。

## 常見錯誤與邊界條件

$C_n$ 的 $n=0$ 為 1；$S(n,0)$ 僅 $S(0,0)=1$，其餘為 0；模數非質數時不能用逆元算封閉式。

## 與相似技巧的比較

Catalan 與 Ballot 問題同屬反射原理的應用；Stirling 數與貝爾數、割點計數密切相關。

## 例題與分級練習

括號合法序列數、凸多邊形三角剖分、集合劃分數、排列循環數統計。

## 本節重點速查

Catalan 不破壞結構；Stirling 第二類是分組、第一類是循環；都用最後元素歸屬列遞推。
