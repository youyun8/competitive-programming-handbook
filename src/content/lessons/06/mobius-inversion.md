---
id: mobius-inversion
volume: lower
source_file: lower-volume
chapter: 6
section: '6.16'
title: 莫比烏斯函數與反演
summary: 以莫比烏斯函數做狄利克雷反演，把因數條件轉為互質條件或進行容斥計數。
prerequisites: [dirichlet-convolution, multiplicative-function]
learning_goals:
  - 理解莫比烏斯函數的定義與意義
  - 證明並應用莫比烏斯反演公式
  - 以線性篩高效計算 μ 的前綴值
concepts: [mobius-function, mobius-inversion]
complexity:
  time: O(n log log n) for sieve
  space: O(n)
related_exercises: []
source_book_pages: [450, 456]
source_pdf_pages: [80, 86]
review_status: verified
---

## 這個技術解決什麼問題

若已知 `F(n) = Σ_{d|n} f(d)`，莫比烏斯反演能直接求出 `f(n)`，是把「因數和」與「原函數」互相轉換的核心工具。

## 辨識題型的訊號

已知因數和的封閉式要回推原函數、互質計數、GCD 為 1 的計數、包含排除的精簡形式。

## 核心想法與直覺

`μ(n)` 是 `1(n)=1` 在狄利克雷卷積下的逆元：`μ * 1 = ε`。因此 `F = f * 1` 兩側與 `μ` 卷積得 `f = F * μ`，即反演公式。

## 狀態／資料結構定義

`μ(1)=1`；`μ(n)=0` 若 n 有平方質因數；`μ(n)=(-1)^k` 若 n 是 k 個相異質數的乘積。線性篩可同時求 `μ` 與 `min_prime_factor`。

## 不變量或正確性證明

`Σ_{d|n} μ(d) = [n==1]` 的證明：若 n>1，令 n 的質因數分解有 k 個相異質數，則貢獻來自選 0~k 個質數的組合，總和為 `Σ_{i=0}^k C(k,i)(-1)^i = (1-1)^k = 0`。此即 `μ * 1 = ε`。

## 逐步演算法

1. 以線性篩計算 `μ[1..n]`。
2. 反演公式：`f(n) = Σ_{d|n} μ(d) * F(n/d)`。
3. 常用變形：`Σ_{i=1}^n Σ_{j=1}^m [gcd(i,j)=1] = Σ_{d=1}^{min(n,m)} μ(d) * floor(n/d) * floor(m/d)`。

## C++17 模板

```cpp
#include <vector>

std::vector<int> mobius_sieve(int n) {
    std::vector<int> mu(n + 1, 0);
    std::vector<int> primes;
    std::vector<bool> is_composite(n + 1, false);
    mu[1] = 1;
    for (int i = 2; i <= n; ++i) {
        if (!is_composite[i]) {
            primes.push_back(i);
            mu[i] = -1;
        }
        for (int p : primes) {
            long long v = 1LL * i * p;
            if (v > n) { break; }
            is_composite[v] = true;
            if (i % p == 0) {
                mu[v] = 0;
                break;
            } else {
                mu[v] = -mu[i];
            }
        }
    }
    return mu;
}
```

## 時間與空間複雜度

線性篩求 μ 前 n 項為 $O(n)$ 時間與 $O(n)$ 空間。配合整除分塊，區間互質計數可達 $O(\sqrt n)$。

## 常見錯誤與邊界條件

`μ` 為零表示有平方因數，不可省略；反演時索引方向容易搞反；大區間求和需配合整除分塊而非直接枚舉。

## 與相似技巧的比較

莫比烏斯反演是包含排除的代數封裝；與一般容斥原理等價但更系統化。積性函數的性質讓 μ 可線性篩，這是一般容斥做不到的。

## 例題與分級練習

初級：計算 μ(n) 與驗證反演；中級：計算 GCD=1 的配對數；高級：結合杜教篩處理前綴和、多變數反演。

## 本節重點速查

μ 是 1 的狄利克雷反元素；μ*1=ε；反演 f=F*μ；配合整除分塊加速區間求和。
