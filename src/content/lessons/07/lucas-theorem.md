---
id: lucas-theorem
volume: lower
source_file: lower-volume
chapter: 7
section: '7.4'
title: Lucas 定理：質數模下的組合數分解
summary: 將 $n$、$k$ 以質數 $p$ 分位拆解，把大模數組合數化為小數字乘積。
prerequisites: [combinatorics, modular-arithmetic, prime-numbers]
learning_goals:
  - 理解 Lucas 定理的進位分解原理
  - 實作質數模下的組合數計算
  - 判斷 Lucas 定理與階乘預處理的適用範圍
concepts: [lucas-theorem, prime-modulo]
complexity:
  time: O(p log_p n)
  space: O(p)
related_exercises: []
source_book_pages: [477, 480]
source_pdf_pages: [107, 110]
review_status: verified
---

## 這個技術解決什麼問題

當 $n$ 極大但模數 $p$ 為較小質數時，階乘預處理不可行；Lucas 定理把組合數按 $p$ 進位拆解，逐位計算小規模組合數。

## 辨識題型的訊號

求 $C(n,k) \bmod p$，其中 $p$ 為質數且 $n$ 遠大於 $p$，例如 $n \le 10^{18}$、$p \le 10^6$。

## 核心想法與直覺

以 $p$ 為基底寫出 $n$ 與 $k$：$n = (n_m \dots n_0)_p$，$k = (k_m \dots k_0)_p$。則
$$C(n,k) \equiv \prod_{i} C(n_i, k_i) \pmod{p}.$$
若任一位 $k_i > n_i$，則整體為 0。

## 狀態／資料結構定義

預處理階乘與逆階乘陣列 `fact[0..p-1]`、`inv_fact[0..p-1]`，供單一位數組合數 $O(1)$ 查詢。

## 不變量或正確性證明

由二項式係數在模 $p$ 下的性質，$C(p, i) \equiv 0 \pmod{p}$ 對 $0 < i < p$ 成立。展開 $(1+x)^n$ 並以 $p$ 進位分組後，非零項恰好對應各位組合數乘積。

## 逐步演算法

1. 預處理模 $p$ 下的階乘與逆階乘至 $p-1$。
2. 將 $n$、$k$ 以 $p$ 為基底逐位拆解。
3. 若任一位 $k_i > n_i$，回傳 0。
4. 否則將各位 $C(n_i, k_i)$ 相乘並取模。

## C++17 模板

```cpp
#include <vector>

struct Lucas {
    int prime;
    std::vector<long long> fact;
    std::vector<long long> inv_fact;

    long long mod_pow(long long base, long long exp) {
        long long res = 1 % prime;
        base %= prime;
        while (exp > 0) {
            if (exp & 1LL) { res = res * base % prime; }
            base = base * base % prime;
            exp >>= 1LL;
        }
        return res;
    }

    explicit Lucas(int p) : prime(p) {
        fact.assign(p, 1);
        for (int i = 1; i < p; ++i) { fact[i] = fact[i - 1] * i % prime; }
        inv_fact.assign(p, 1);
        inv_fact[p - 1] = mod_pow(fact[p - 1], prime - 2);
        for (int i = p - 2; i >= 0; --i) {
            inv_fact[i] = inv_fact[i + 1] * (i + 1LL) % prime;
        }
    }

    long long comb_small(long long n, long long k) const {
        if (k < 0 || k > n) { return 0; }
        return fact[n] * inv_fact[k] % prime * inv_fact[n - k] % prime;
    }

    long long comb(long long n, long long k) const {
        long long res = 1;
        while (n > 0 || k > 0) {
            int ni = static_cast<int>(n % prime);
            int ki = static_cast<int>(k % prime);
            if (ki > ni) { return 0; }
            res = res * comb_small(ni, ki) % prime;
            n /= prime;
            k /= prime;
        }
        return res;
    }
};
```

## 時間與空間複雜度

預處理 $O(p)$；每次查詢 $O(\log_p n)$ 位數，每位 $O(1)$。總時間 $O(p + \log_p n)$，空間 $O(p)$。

## 常見錯誤與邊界條件

模數必須是質數；$n_i < p$ 但 $k_i > n_i$ 時要回傳 0；`fact[0]=inv_fact[0]=1` 不能漏。

## 與相似技巧的比較

階乘預處理適合 $n < p$；Lucas 適合 $n \gg p$。若模數非質數，需改用擴展 Lucas 或 CRT 拆解。

## 例題與分級練習

大 $n$ 小質數模的組合數、多重選取限制、結合容斥原理的計數。

## 本節重點速查

$p$ 進位拆解；各位獨立相乘；任一位 $k_i>n_i$ 則整體為 0。
