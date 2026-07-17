---
id: dirichlet-convolution
volume: lower
source_file: lower-volume
chapter: 6
section: '6.15'
title: 狄利克雷卷積
summary: 定義兩個算術函數在因數上的卷積，建立單位元與積性性質的數論代數框架。
prerequisites: [number-theory, multiplicative-function]
learning_goals:
  - 理解狄利克雷卷積的定義
  - 掌握單位元與結合性
  - 證明並應用積性函數的卷積封閉性
concepts: [dirichlet-convolution, mobius, identity]
complexity:
  time: O(n log n)
  space: O(n)
related_exercises: []
source_book_pages: [446, 450]
source_pdf_pages: [76, 80]
review_status: verified
---

## 這個技術解決什麼問題

狄利克雷卷積把因數求和操作統一成代數結構，讓 Möbius 反演、積性函數關係等性質有系統性的證明路徑。

## 辨識題型的訊號

因數求和關係、需要反演公式、算術函數的代數運算、推導數論恆等式。

## 核心想法與直覺

兩個算術函數 `f, g` 的狄利克雷卷積 `(f * g)(n) = Σ_{d|n} f(d)g(n/d)`，類似多項式乘法但以因數取代冪次。單位函數 `ε(n)=[n==1]` 扮演乘法單位元。

## 狀態／資料結構定義

算術函數為 `f: N → C`。卷積 `(f * g)(n)` 遍歷 n 的所有正因數對，也可寫成 `Σ_{ab=n} f(a)g(b)`。

## 不變量或正確性證明

結合性：`(f*g)*h` 與 `f*(g*h)` 都等於 `Σ_{abc=n} f(a)g(b)h(c)`。積性函數的卷積仍積性，因互質數的因數分解獨立。

## 逐步演算法

對於前 n 項卷積：枚舉 d 從 1 到 n，對每個 d 的倍數 k，累加 `f(d) * g(k/d)` 到 `(f*g)(k)`。

## C++17 模板

```cpp
#include <vector>

std::vector<long long> dirichlet_convolution(
    const std::vector<long long>& f,
    const std::vector<long long>& g,
    long long mod
) {
    const int n = static_cast<int>(f.size()) - 1;
    std::vector<long long> h(n + 1, 0);
    for (int d = 1; d <= n; ++d) {
        for (int k = d; k <= n; k += d) {
            h[k] = (h[k] + f[d] * g[k / d]) % mod;
        }
    }
    return h;
}
```

## 時間與空間複雜度

前 n 項卷積需 $O(n \log n)$ 時間（`Σ n/d = n * H_n`）與 $O(n)$ 空間。

## 常見錯誤與邊界條件

索引從 1 開始；忘記取模；混淆狄利克雷卷積與普通卷積；未驗證積性前提就套用性質。

## 與相似技巧的比較

普通卷積對應多項式乘法（FFT）；狄利克雷卷積對應數論因數結構。兩者都是交換環，但底層半群不同。

## 例題與分級練習

初級：驗證 `μ * 1 = ε`；中級：證明 `φ = μ * id`；高級：以卷積推導一般反演公式。

## 本節重點速查

(f*g)(n)=Σ_{d|n} f(d)g(n/d)；單位元是 ε；積性函數的卷積仍積性；O(n log n) 前 n 項計算。
