---
id: string-hash
volume: lower
source_file: lower-volume
chapter: 9
section: '9.1'
title: 進制雜湊：把字串壓成可滾動的數字指紋
summary: 以多項式進制把字串轉成雜湊值，支援 O(1) 子串比較與滾動更新。
prerequisites: [strings, modular-arithmetic]
learning_goals:
  - 計算並比較子串雜湊值
  - 處理碰撞與雙雜湊
  - 應用於迴文判定、LCP、字串匹配
concepts: [rolling-hash, bkdrhash, string-equality]
complexity:
  time: O(n) preprocess, O(1) query
  space: O(n)
related_exercises: []
source_book_pages: [549, 599]
source_pdf_pages: [179, 229]
review_status: verified
---

## 這個技術解決什麼問題

需要頻繁比較不同位置、不同長度的子串是否相同，或快速取得字串的前綴／後綴特徵，但又不希望使用複雜的後綴結構。

## 辨識題型的訊號

大量子串相等查詢、字串匹配、迴文前綴、字典序比較、字串壓縮。

## 核心想法與直覺

把字串視為進制多項式，每位字元是係數，前綴雜湊是累積值。藉由預處理進制冪與前綴雜湊，子串雜湊可在 O(1) 拆出。

## 狀態／資料結構定義

`prefix_hash[i]`：前綴 `s[0..i-1]` 的雜湊值；`power[i]`：進制的 i 次方對模數取餘。模數通常選大質數，如 10^9+7、10^9+9。

## 不變量或正確性證明

任一子串 `[l, r)` 的雜湊值等於 `prefix_hash[r] - prefix_hash[l] * power[r-l]`。模運算下減法與乘法的線性保持穩定，因此只要模數相同，雜湊值相等即代表多項式值在模意義下相等。

## 逐步演算法

掃描字串，逐位更新前綴雜湊與冪次；查詢時代入公式，注意負數取模。

## C++17 模板

```cpp
#include <string>
#include <vector>

static const long long MOD = 1'000'000'007LL;
static const long long BASE = 91138233LL;

struct RollingHash {
    std::vector<long long> prefix_hash;
    std::vector<long long> power;

    explicit RollingHash(const std::string& s) {
        prefix_hash.resize(s.size() + 1);
        power.resize(s.size() + 1);
        power[0] = 1;
        for (size_t i = 0; i < s.size(); ++i) {
            power[i + 1] = (power[i] * BASE) % MOD;
            prefix_hash[i + 1] = (prefix_hash[i] * BASE + s[i]) % MOD;
        }
    }

    long long get_substring(size_t left, size_t right) const {
        long long value = prefix_hash[right] - (prefix_hash[left] * power[right - left]) % MOD;
        if (value < 0) { value += MOD; }
        return value;
    }
};
```

## 時間與空間複雜度

前處理時間 O(n)，每次子串查詢時間 O(1)，空間 O(n)。

## 常見錯誤與邊界條件

進制與模數選太小導致碰撞；忘記處理負數取模；字元映射錯誤（如 char 有號負值）；溢出沒有轉 long long；子串長度為零。

## 與相似技巧的比較

KMP、Z-function 精確匹配無碰撞，但難以 O(1) 回答任意子串比較。後綴陣列／自動機更強大但實作複雜。雙雜湊可大幅降低碰撞機率，近似地毯式保險。

## 例題與分級練習

子串相等查詢、迴文對數統計、最長重複子串、字串匹配。

## 本節重點速查

前綴雜湊滾動求子串；進制與模數防碰撞；雙雜湊增強可信度。
