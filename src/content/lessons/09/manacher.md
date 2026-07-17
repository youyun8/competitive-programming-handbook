---
id: manacher
volume: lower
source_file: lower-volume
chapter: 9
section: '9.2'
title: Manacher：線性求最長回文子串
summary: 利用對稱性與已計算半徑，在 O(n) 內找出每個中心的最長回文。
prerequisites: [strings, arrays]
learning_goals:
  - 理解回文中心與半徑的表示
  - 利用對稱區間加速計算
  - 處理奇偶長度回文的統一方式
concepts: [manacher, palindrome, center-expansion]
complexity:
  time: O(n)
  space: O(n)
related_exercises: []
source_book_pages: [549, 599]
source_pdf_pages: [179, 229]
review_status: verified
---

## 這個技術解決什麼問題

給定字串，快速求出以每個位置為中心的最長回文半徑，並解決最長回文子串、回文對數統計等問題。

## 辨識題型的訊號

最長回文子串、回文子串計數、回文覆蓋、字串變換後的回文判定。

## 核心想法與直覺

暴力從每個中心向外擴展是 O(n^2)。Manacher 維護目前最右回文邊界，當新中心落在已知回文內部時，利用對稱點的已計算結果來縮小嘗試範圍，只對超出邊界的部分繼續擴展。

## 狀態／資料結構定義

先插入分隔符（如 `#`），把奇偶長度回文統一成奇數長度。`radius[i]` 表示以 `i` 為中心的最長回文半徑（含中心）。

## 不變量或正確性證明

維護目前最右回文邊界 `right` 與其中心 `center`。對新位置 `i`，若 `i < right`，則 `radius[i]` 至少等於對稱點的半徑與 `right - i` 的較小者。這個下界是正確的，因為對稱區間的回文性保證了該範圍內的匹配。之後只需繼續比對超出 `right` 的部分，每一步成功都會更新 `right`。

## 逐步演算法

1. 插入分隔符構造新字串；
2. 從左到右掃描，利用對稱點取得初始半徑；
3. 嘗試向外擴展，更新 `radius[i]`；
4. 若擴展超過 `right`，更新 `center` 與 `right`；
5. 最後把半徑映射回原字串位置。

## C++17 模板

```cpp
#include <algorithm>
#include <string>
#include <vector>

std::vector<int> manacher(const std::string& s) {
    std::string t;
    t.reserve(s.size() * 2 + 1);
    for (char ch : s) {
        t.push_back('#');
        t.push_back(ch);
    }
    t.push_back('#');

    int n = static_cast<int>(t.size());
    std::vector<int> radius(n);
    int center = 0;
    int right = 0;
    for (int i = 0; i < n; ++i) {
        if (i < right) {
            radius[i] = std::min(right - i, radius[2 * center - i]);
        }
        while (i - radius[i] - 1 >= 0 && i + radius[i] + 1 < n
               && t[i - radius[i] - 1] == t[i + radius[i] + 1]) {
            ++radius[i];
        }
        if (i + radius[i] > right) {
            center = i;
            right = i + radius[i];
        }
    }
    return radius;
}
```

## 時間與空間複雜度

每個字元最多被比對常數次，時間 O(n)，空間 O(n)。

## 常見錯誤與邊界條件

分隔符選擇與原字衝突；回傳半徑轉回原字串索引出錯；陣列存取越界；忘記處理空字串。

## 與相似技巧的比較

雜湊也能在 O(1) 判斷單一回文，但 Manacher 一次給出所有中心結果，且無碰撞風險。回文樹（Eertree）則更進一步統計不同回文子串個數。

## 例題與分級練習

最長回文子串長度、回文子串數量、最長雙迴文子串、回文邊界判定。

## 本節重點速查

分隔符統一奇偶；對稱點給下界；最右邊界決定擴展起點；線性完成所有中心。
