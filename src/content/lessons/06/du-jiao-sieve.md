---
id: du-jiao-sieve
volume: lower
source_file: lower-volume
chapter: 6
section: '6.17'
title: 杜教篩：亞線性數論求和
summary: 利用狄利克雷卷積與已知的易求和函數，在亞線性時間內計算積性函數的前綴和。
prerequisites: [dirichlet-convolution, mobius-inversion, multiplicative-function]
learning_goals:
  - 推導杜教篩的核心遞推公式
  - 選擇合適的狄利克雷卷積對 (f * g) 使 g 與 (f * g) 的前綴和皆易求
  - 實作帶記憶化的杜教篩並分析時間複雜度
concepts: [du-jiao-sieve, dirichlet-hyperbola, prefix-sum-sublinear]
complexity:
  time: O(n^(2/3)) with precompute
  space: O(n^(2/3))
related_exercises: []
source_book_pages: [456, 461]
source_pdf_pages: [86, 91]
review_status: verified
---

## 這個技術解決什麼問題

對於積性函數 f，直接計算前綴和 S(n) = Σ_{i=1}^{n} f(i) 需要 O(n) 時間。當 n 高達 10^11 時無法接受。杜教篩利用狄利克雷卷積與數論分塊，將時間降至亞線性。

## 辨識題型的訊號

- 題目要求計算積性函數的前綴和，且 n 達到 10^9 以上。
- f 能與某個簡單函數 g 進行狄利克雷卷積，使 (f * g) 與 g 的前綴和都容易計算。
- 常見目標：莫比烏斯函數 μ、歐拉函數 φ、除數函數 d 的前綴和。

## 核心想法與直覺

利用恆等式：對於任意兩個算術函數 f 與 g，有

Σ_{i=1}^{n} (f * g)(i) = Σ_{d=1}^{n} g(d) · S(⌊n/d⌋)

若 f * g = h，且 h 與 g 的前綴和都易求，則可以把 S(n) 移到等式左邊，其他項移到右邊來遞推。關鍵在於 ⌊n/d⌋ 只有 O(√n) 種不同值，因此數論分塊加速。

## 狀態／資料結構定義

- `S(n)`：f 的前綱和，需要以雜湊表或 map 記憶化。
- `pre[i]`：預處理小於等於 n^(2/3) 的前綴和。
- `id1[i], id2[i]`：把大於 √n 和小於等於 √n 的 ⌊n/d⌋ 值映射到緊湊索引。

## 不變量或正確性證明

狄利克雷卷積的定義保證了上述恆等式。當 g(1) ≠ 0 時，S(n) 可以被唯一表達為右式的線性組合。每次遞迴都將問題規模降到 ⌊n/d⌋（d ≥ 2），因此必能在有限步內終止。

## 逐步演算法

1. 選擇適當的 g，使得 g 與 h = f * g 的前綴和都容易計算。
2. 線性篩預處理前 n^(2/3) 項的 f 值與前綴和。
3. 對於更大的 n，利用數論分塊，將 ⌊n/d⌋ 相同的項合併計算。
4. 使用雜湊表記憶化已計算過的 S(⌊n/d⌋)。

## C++17 模板

```cpp
#include <cmath>
#include <cstdint>
#include <iostream>
#include <unordered_map>
#include <vector>

class DuJiaoSieve {
public:
    DuJiaoSieve(int64_t limit) : limit_(limit) {
        int64_t threshold = static_cast<int64_t>(std::pow(limit, 2.0 / 3.0));
        precompute(threshold);
    }

    // Compute prefix sum of phi: sum_{i=1}^{n} phi(i)
    int64_t phi_sum(int64_t n) {
        if (n <= precomputed_limit_) return phi_prefix_[n];
        if (phi_memo_.count(n)) return phi_memo_[n];

        int64_t result = n * (n + 1) / 2; // sum of i = sum of phi * 1 = sum_{d}(phi(d) * floor(n/d))
        // Actually phi * 1 = id, so sum phi(d) * floor(n/d) = n*(n+1)/2
        // Rearranged: S_phi(n) = n*(n+1)/2 - sum_{d=2}^{n} S_phi(n/d)
        int64_t i = 2;
        while (i <= n) {
            int64_t q = n / i;
            int64_t next_i = n / q + 1;
            result -= (next_i - i) * phi_sum(q);
            i = next_i;
        }
        phi_memo_[n] = result;
        return result;
    }

    // Compute prefix sum of mobius: sum_{i=1}^{n} mu(i)
    int64_t mobius_sum(int64_t n) {
        if (n <= precomputed_limit_) return mobius_prefix_[n];
        if (mobius_memo_.count(n)) return mobius_memo_[n];

        int64_t result = 1; // sum of mu * 1 = epsilon, so sum_{d=1}^{n} mu(d)*floor(n/d) = 1
        // Rearranged: S_mu(n) = 1 - sum_{d=2}^{n} S_mu(n/d)
        int64_t i = 2;
        while (i <= n) {
            int64_t q = n / i;
            int64_t next_i = n / q + 1;
            result -= (next_i - i) * mobius_sum(q);
            i = next_i;
        }
        mobius_memo_[n] = result;
        return result;
    }

private:
    int64_t limit_;
    int64_t precomputed_limit_ = 0;
    std::vector<int64_t> phi_prefix_;
    std::vector<int64_t> mobius_prefix_;
    std::unordered_map<int64_t, int64_t> phi_memo_;
    std::unordered_map<int64_t, int64_t> mobius_memo_;

    void precompute(int64_t threshold) {
        precomputed_limit_ = threshold;
        phi_prefix_.resize(threshold + 1);
        mobius_prefix_.resize(threshold + 1);
        std::vector<int64_t> phi(threshold + 1);
        std::vector<int> mu(threshold + 1);
        std::vector<bool> is_composite(threshold + 1, false);
        std::vector<int> primes;

        phi[1] = 1;
        mu[1] = 1;
        for (int i = 2; i <= threshold; ++i) {
            if (!is_composite[i]) {
                primes.push_back(i);
                phi[i] = i - 1;
                mu[i] = -1;
            }
            for (int p : primes) {
                int64_t v = 1LL * i * p;
                if (v > threshold) break;
                is_composite[v] = true;
                if (i % p == 0) {
                    phi[v] = phi[i] * p;
                    mu[v] = 0;
                    break;
                } else {
                    phi[v] = phi[i] * (p - 1);
                    mu[v] = -mu[i];
                }
            }
        }
        for (int64_t i = 1; i <= threshold; ++i) {
            phi_prefix_[i] = phi_prefix_[i - 1] + phi[i];
            mobius_prefix_[i] = mobius_prefix_[i - 1] + mu[i];
        }
    }
};

int main() {
    std::ios::sync_with_stdio(false);
    std::cin.tie(nullptr);
    int64_t n = 0;
    std::cin >> n;
    DuJiaoSieve sieve(n);
    std::cout << sieve.phi_sum(n) << '\n';
}
```

## 時間與空間複雜度

預處理前 n^(2/3) 項需 O(n^(2/3))。對於大於預處理範圍的每個不同 ⌊n/d⌋，只計算一次。不同值的數量約為 2√n。總時間為 O(n^(2/3))；空間同為 O(n^(2/3))。

## 常見錯誤與邊界條件

- 選擇的 g 不當，導致 g 或 h 的前綴和仍難求。
- 沒有區分 ⌊n/d⌋ 的大小於 √n 兩種映射方式，造成陣列越界。
- n 較小時直接查預處理表，避免遞迴開銷。
- 記憶化必須包含所有計算過的 ⌊n/d⌋，否則複雜度退化。

## 與相似技巧的比較

線性篩求前綴和需 O(n)；數論分塊求單一函數和約需 O(√n) 每次查詢。杜教篩在大量查詢不同 n 時，利用記憶化達到 O(n^(2/3)) 每個不同值的攤銷效率。

## 例題與分級練習

- 基礎：求 φ(i) 的前綴和、μ(i) 的前綴和。
- 進階：結合莫比烏斯反演，求 Σ_{i=1}^{n} Σ_{j=1}^{m} [gcd(i,j)=1]。

## 本節重點速查

找 g 使 f * g = h，且 g 與 h 前綴和皆易求；核心恆等式把 S(n) 和 S(⌊n/d⌋) 連起來；預處理 n^(2/3) + 數論分塊 + 記憶化 = 亞線性。
