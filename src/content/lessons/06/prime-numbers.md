---
id: prime-numbers
volume: lower
source_file: lower-volume
chapter: 6
section: '6.10'
title: 質數
summary: 判定質數、以篩法預處理質數表、進行質因數分解，為數論提供基礎工具。
prerequisites: [integers]
learning_goals:
  - 熟練試除法與埃氏篩、線性篩
  - 快速質因數分解
  - 利用質數表解決數論應用
concepts: [primality-test, sieve, prime-factorization]
complexity:
  time: sieve O(n log log n), trial division O(√n)
  space: O(n)
related_exercises: []
source_book_pages: [424, 430]
source_pdf_pages: [54, 60]
review_status: verified
---

## 這個技術解決什麼問題

質數是整數的乘法原子。快速判定、列舉與分解質因數是數論演算法的基本功。

## 辨識題型的訊號

階乘尾數零個數、因數個數/因數和、與質數性質相關的組合計數、GCD/LCM 的質因數分解視角。

## 核心想法與直覺

合數必有一個質因數不大於其平方根。埃氏篩反覆劃去質數的倍數；線性篩每個合數只被最小質因數劃去一次，達到 O(n)。

## 狀態／資料結構定義

布林陣列 `is_prime[i]`；`primes[]` 儲存已知質數；`min_prime_factor[i]` 記錄最小質因數以加速分解。

## 不變量或正確性證明

埃氏篩：當處理質數 p 時，所有 `p` 的倍數（且大於 `p`）都是合數，正確標記。線性篩：每個合數 `x = p * y` 僅在 `p` 為其最小質因數時被劃去，不重複。

## 逐步演算法

埃氏篩：標記 2 為質數，劃去所有 2 的倍數；找到下一個未劃去的數，重複。線性篩：遍歷每個數，若未劃去則加入質數表；用每個已知質數 `p` 劃去 `i*p`，若 `i` 被 `p` 整除則終止。

## C++17 模板

```cpp
#include <vector>

std::vector<int> linear_sieve(int n) {
    std::vector<bool> is_prime(n + 1, true);
    std::vector<int> primes;
    is_prime[0] = is_prime[1] = false;
    for (int i = 2; i <= n; ++i) {
        if (is_prime[i]) { primes.push_back(i); }
        for (int p : primes) {
            long long v = 1LL * i * p;
            if (v > n) { break; }
            is_prime[v] = false;
            if (i % p == 0) { break; }
        }
    }
    return primes;
}

bool is_prime_trial(long long x) {
    if (x < 2) { return false; }
    for (long long d = 2; d * d <= x; ++d) {
        if (x % d == 0) { return false; }
    }
    return true;
}
```

## 時間與空間複雜度

試除法 $O(\sqrt n)$，埃氏篩 $O(n \log \log n)$，線性篩 $O(n)$ 時間與 $O(n)$ 空間。

## 常見錯誤與邊界條件

1 不是質數；篩表大小開錯；`i % p == 0` 判斷位置放錯導致線性篩退化；質因數分解時忘記處理剩餘的質數。

## 與相似技巧的比較

試除法適合單次查查詢；篩法適合大量查詢。線性篩同時得到每數最小質因數，是分解與積性函數篩的基礎。

## 例題與分級練習

初級：判斷質數、埃氏篩；中級：線性篩求 Möbius、Euler；高級：區間篩、Miller-Rabin。

## 本節重點速查

合數有平方根內的質因數；線性篩每合數只被劃一次；最小質因數陣列是分解利器。
