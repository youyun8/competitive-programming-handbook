---
id: suffix-array
volume: lower
source_file: lower-volume
chapter: 9
section: '9.7'
title: 後綴陣列：把所有後綴排序後的強大工具
summary: 以倍增法在 O(n log n) 內對所有後綴排序，配合 LCP 進行子串相關查询。
prerequisites: [strings, sorting]
learning_goals:
  - 以倍增法建構後綴陣列
  - 計算 height / LCP 陣列
  - 應用於最長重複子串、子串計數、字典序比較
concepts: [suffix-array, doubling, lcp]
complexity:
  time: O(n log n)
  space: O(n)
related_exercises: []
source_book_pages: [549, 599]
source_pdf_pages: [179, 229]
review_status: verified
---

## 這個技術解決什麼問題

需要對字串的所有後綴進行排序，以快速回答子串相等、子串排名、最長公共前綴、最長重複子串等問題。

## 辨識題型的訊號

子串字典序第 k 小、不同子串數量、最長重複子串、兩字串最長公共子串、多模式匹配離線查詢。

## 核心想法與直覺

直接對所有後綴排序是 O(n^2 log n)。倍增法利用「長度 k 的排名已知，就能在 O(1) 比較長度 2k」的性質，每輪以雙關鍵字排序，逐步倍增到覆蓋整個字串。

## 狀態／資料結構定義

`sa[i]`：排名第 i 的後綴起始位置；`rank[i]`：從位置 i 開始的後綴目前排名；`tmp[i]`：輔助排序用臨時排名；`height[i]`：`sa[i]` 與 `sa[i-1]` 的最長公共前綴長度。

## 不變量或正確性證明

每輪結束後，`rank` 正確反映目前長度 `k` 的前綴排名。因為「長度 2k 的前綴」可拆成「前 k」與「後 k」兩個已知排名的部分，雙關鍵字排序後即可正確得到長度 2k 的排名。經過 log n 輪後，k >= n，排序正確代表所有後綴的完整排序。

## 逐步演算法

1. 初始按單一字元排名；
2. 對每個位置取 `(rank[i], rank[i+k])` 為雙關鍵字排序；
3. 重新分配排名，相同則同排名；
4. k 倍增直到 k >= n；
5. 用 Kasai 演算法從左到右計算 height / LCP。

## C++17 模板

```cpp
#include <algorithm>
#include <string>
#include <vector>

std::vector<int> build_suffix_array(const std::string& s) {
    int n = static_cast<int>(s.size());
    std::vector<int> sa(n), rank(n), tmp(n);
    for (int i = 0; i < n; ++i) {
        sa[i] = i;
        rank[i] = static_cast<unsigned char>(s[i]);
    }
    for (int k = 1; k < n; k <<= 1) {
        auto cmp = [&](int i, int j) {
            if (rank[i] != rank[j]) { return rank[i] < rank[j]; }
            int ri = i + k < n ? rank[i + k] : -1;
            int rj = j + k < n ? rank[j + k] : -1;
            return ri < rj;
        };
        std::sort(sa.begin(), sa.end(), cmp);
        tmp[sa[0]] = 0;
        for (int i = 1; i < n; ++i) {
            tmp[sa[i]] = tmp[sa[i - 1]] + (cmp(sa[i - 1], sa[i]) ? 1 : 0);
        }
        for (int i = 0; i < n; ++i) {
            rank[i] = tmp[i];
        }
        if (rank[sa[n - 1]] == n - 1) { break; }
    }
    return sa;
}

std::vector<int> build_lcp(const std::string& s, const std::vector<int>& sa) {
    int n = static_cast<int>(s.size());
    std::vector<int> rank(n);
    for (int i = 0; i < n; ++i) {
        rank[sa[i]] = i;
    }
    std::vector<int> lcp(n - 1);
    int h = 0;
    for (int i = 0; i < n; ++i) {
        if (rank[i] == 0) { continue; }
        int j = sa[rank[i] - 1];
        while (i + h < n && j + h < n && s[i + h] == s[j + h]) { ++h; }
        lcp[rank[i] - 1] = h;
        if (h > 0) { --h; }
    }
    return lcp;
}
```

## 時間與空間複雜度

倍增法每輪排序 O(n log n)，共 log n 輪，總時間 O(n log^2 n)。若使用計數排序或基數排序優化雙關鍵字，可達 O(n log n)。空間 O(n)。

## 常見錯誤與邊界條件

超出字串邊界的排名要視為 -1；排序比較函數不嚴格弱序導致未定義行為；LCP 計算時忘記遞減 h；空字串或單一字元；相同後綴導致重複計數。

## 與相似技巧的比較

後綴自動機同樣能回答子串相關問題，但後綴陣列在需字典序相關操作（如第 k 小子串）時更自然。後綴樹是離線建構的確定性樹結構，概念清楚但實作較繁雜。雜湊可部分代替子串比較，但無法直接給出排名。

## 例題與分級練習

不同子串數量、最長重複子串、最長公共子串、子串字典序第 k 小、多字串的公共子串。

## 本節重點速查

倍增法雙關鍵字排序；sa 是後綴起點順序；lcp 相鄰後綴的最長公共前綴；height 與區間最小值可做子串比較。
