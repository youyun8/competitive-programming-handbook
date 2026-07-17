---
id: multiplicative-function
volume: lower
source_file: lower-volume
chapter: 6
section: '6.12'
title: 積性函數
summary: 定義與識別積性函數，以線性篩在 O(n) 時間內同時求得多個數論函數。
prerequisites: [number-theory]
learning_goals:
  - 理解積性與完全積性的定義
  - 掌握積性函數的乘積公式
  - 以線性篩批量計算積性函數
concepts: [multiplicative, dirichlet]
complexity:
  time: O(n log log n) linear sieve
  space: O(n)
related_exercises: []
source_book_pages: [433, 437]
source_pdf_pages: [63, 67]
review_status: verified
---

## 這個技術解決什麼問題

許多數論函數如因數個數、因數和、Euler's totient 都具備積性。利用積性性質，可用線性篩批量求出 1~n 所有值，而非逐枚舉分解。

## 辨識題型的訊號

大量詢問因數相關函數、區間數論求和、需要預處理所有數的函數值。

## 核心想法與直覺

若 `f(ab) = f(a)f(b)` 當 `gcd(a,b)=1`，則 `f` 為積性。每個整數的質因數分解唯一，積性函數的值可從質冪處的值乘出。

## 狀態／資料結構定義

線性篩維護 `f[i]` 與 `min_prime_power[i]`（最小質因數的冪次），根據 `i` 是否被質數 `p` 整除分類轉移。

## 不變量或正確性證明

積性函數的值由質冪處唯一決定。線性篩確保每個數被最小質因數分解一次，根據 `p` 是否整除 `i` 套用正確的積性公式，維持正確性。

## 逐步演算法

1. 初始化 `f[1] = 1`。
2. 線性篩過程中，若 `i` 不被 `p` 整除，`f[i*p] = f[i] * f[p]`。
3. 若 `i` 被 `p` 整除，根據函數在質幂處的公式計算 `f[i*p]`。

## C++17 模板

```cpp
#include <vector>

struct MultiplicativeSieve {
    std::vector<int> min_pf;
    std::vector<int> f;

    void build(int n) {
        min_pf.assign(n + 1, 0);
        f.assign(n + 1, 0);
        f[1] = 1;
        std::vector<int> primes;
        for (int i = 2; i <= n; ++i) {
            if (min_pf[i] == 0) {
                min_pf[i] = i;
                primes.push_back(i);
                f[i] = i - 1; // example: phi
            }
            for (int p : primes) {
                long long v = 1LL * i * p;
                if (v > n) { break; }
                min_pf[v] = p;
                if (i % p == 0) {
                    f[v] = f[i] * p;
                    break;
                } else {
                    f[v] = f[i] * (p - 1);
                }
            }
        }
    }
};
```

## 時間與空間複雜度

線性篩 $O(n)$ 時間與 $O(n)$ 空間。每個合數只被最小質因數訪問一次。

## 常見錯誤與邊界條件

`f(1)` 必為 1；整除分支與不整除分支公式不同；不是所有數論函數都積性（如 Mangoldt 函數）。

## 與相似技巧的比較

埃氏篩或單獨分解每個數都更慢；線性篩一次預處理可同時求多個積性函數。積性是 Dirichlet 卷積與 Möbius 反演的基礎。

## 例題與分級練習

初級：因數個數與因數和篩；中級：同時篩 phi 與 mu；高級：以積性優化 GCD 求和。

## 本節重點速查

積性：互質分開乘；完全積性：無需互質條件；線性篩是批量計算利器。
