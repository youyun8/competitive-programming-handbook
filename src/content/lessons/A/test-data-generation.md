---
id: test-data-generation
volume: lower
source_file: lower-volume
chapter: 10
section: 'A.2'
title: 建構測試資料與對拍
summary: 以 mt19937_64 與可重現 seed 生成分佈可控的測資，並用對拍驗證兩份實作的一致性。
prerequisites: [c++]
learning_goals:
  - 使用 mt19937_64 產生可重現的隨機測資
  - 設計邊界測資（極大、極小、去重、全等）
  - 以對拍腳本比對兩份程式輸出是否一致
concepts: [random-generation, differential-testing, reproducible-seed, test-data]
complexity:
  time: O(test_size)
  space: O(test_size)
related_exercises: []
source_book_pages: [688, 690]
source_pdf_pages: [318, 320]
review_status: verified
---

## 這個技術解決什麼問題

當題目解答看似正確，卻在線上評測系統出現 WA 或 TLE，手動構造測資無法覆蓋邊界時；隨機產生大量測資並比對暴力正確解與優化解的輸出，是最有效的除錯策略。

## 辨識題型的訊號

- 對於複雜演算法，難以確定所有邊界條件。
- 需要驗證 $n$ 極大或極小時的效能與正確性。
- 暴力解法非常慢，但結果可信；優化解速度快，但邏輯複雜。

## 核心想法與直覺

可控的隨機數生成器（如 `mt19937_64`）加上固定 seed，能讓每次運行產生完全一樣的測資，方便復現錯誤。對拍則是把同一組測資餵給兩份程式，比較 stdout；不一致時立即保存該測資。

## 狀態／資料結構定義

```cpp
#include <cstdint>
#include <random>

std::mt19937_64 make_rng(std::uint64_t seed) {
    return std::mt19937_64(seed);
}
```

- `rng()`：產生 64 位元均勻分佈整數。
- 固定 `seed` 即可復現相同序列。

## 不變量或正確性證明

`mt19937_64` 是確定性偽隨機演算法，相同 seed 與相同呼叫順序必產生相同輸出。只要暴力解正確，兩份程式輸出不一致即代表優化解有錯。

## 逐步演算法

1. 選擇固定 seed（如 `chrono::steady_clock::now().time_since_epoch().count()` 或固定常數）。
2. 產生測資檔案 `input.txt`。
3. 執行 `brute.exe < input.txt > brute.txt`。
4. 執行 `optimized.exe < input.txt > opt.txt`。
5. 比較 `brute.txt` 與 `opt.txt`；若不同，保存 `input.txt` 並停止。
6. 重複數千次直到信心足夠。

## C++17 模板

```cpp
#include <algorithm>
#include <chrono>
#include <cstdint>
#include <fstream>
#include <random>
#include <vector>

class TestGenerator {
public:
    explicit TestGenerator(std::uint64_t seed)
        : rng_(seed), dist_(1, 100000) {}

    void generate(std::ostream& out, int n, int q) {
        out << n << ' ' << q << '\n';
        for (int i = 0; i < n; ++i) {
            out << dist_(rng_) << (i + 1 == n ? '\n' : ' ');
        }
        for (int i = 0; i < q; ++i) {
            int l = dist_(rng_) % n;
            int r = dist_(rng_) % n;
            if (l > r) { std::swap(l, r); }
            out << l << ' ' << r << '\n';
        }
    }

    void generate_extreme(std::ostream& out, int n) {
        out << n << ' ' << 1 << '\n';
        for (int i = 0; i < n; ++i) {
            out << (i == 0 || i == n - 1 ? 100000 : 1)
                << (i + 1 == n ? '\n' : ' ');
        }
        out << 0 << ' ' << n - 1 << '\n';
    }

private:
    std::mt19937_64 rng_;
    std::uniform_int_distribution<int> dist_;
};

int main() {
    const std::uint64_t seed = static_cast<std::uint64_t>(
        std::chrono::steady_clock::now().time_since_epoch().count()
    );
    TestGenerator gen(seed);
    std::ofstream ofs("input.txt");
    gen.generate(ofs, 10, 5);
}
```

## 時間與空間複雜度

生成測資與比對皆為線性於測資大小。對拍的時間主要受暴力解執行時間限制。

## 常見錯誤與邊界條件

- 沒有固定 seed，導致錯誤無法復現。
- 暴力解本身有錯，對拍失去意義。
- 測資範圍沒有覆蓋所有極端：全 0、全最大值、單一元素、去重/全重複。
- 浮點數比對用精確相等，應改用誤差容許。
- Windows/Linux 換行符差異造成比對失敗。

## 與相似技巧的比較

assert 驗證只能檢查執行期不變量；對拍比較兩份程式的最終輸出，覆蓋面更廣。單元測試則需要人工設計情境，對拍是自動化的壓力測試。

## 例題與分級練習

- 基礎：為排序、二分搜尋產生隨機陣列並與 std::sort 比對。
- 進階：為線段樹與暴力陣列掃描產生區間查詢/更新序列，對拍驗證。

## 本節重點速查

固定 seed；設計極端、去重、全相等的測資；暴力解必須先確認正確；比對時注意換行與空白差異。
