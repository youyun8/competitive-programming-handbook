---
id: kmp
volume: lower
source_file: lower-volume
chapter: 9
section: '9.5'
title: KMP：失配時保留已知的前綴資訊
summary: 以 prefix function 表示邊界，做到線性時間模式匹配。
prerequisites: [strings, invariants]
learning_goals: [計算 prefix function, 解釋失配回退, 找出所有匹配位置]
concepts: [border, prefix-function, pattern-matching]
complexity:
  time: O(n + m)
  space: O(m)
related_exercises: []
source_book_pages: [549, 599]
source_pdf_pages: [179, 229]
review_status: verified
visualizer: kmp
---

## 這個技術解決什麼問題

在長文字中找模式的所有出現位置，失配時不把文字指標倒退，避免最壞 $O(nm)$。

## 辨識題型的訊號

單一模式精確匹配、前綴與後綴關係、字串週期、border。

## 核心想法與直覺

已匹配字串的某個真前綴若也是後綴，失配後仍可能保留這段匹配。prefix function 記錄最長可保留長度。

## 狀態／資料結構定義

`prefix[i]` 是模式前綴 `pattern[0..i]` 的最長真 border 長度。

## 不變量或正確性證明

變數 `matched` 始終是目前文字後綴與模式前綴相等的最大候選。回退沿 border 鏈，只嘗試仍可能匹配的長度。

## 逐步演算法

先建立模式 prefix function；掃描文字，失配時沿 prefix 回退，匹配則加一；長度到達模式長度就記錄答案並繼續。

## C++17 模板

```cpp
#include <string>
#include <vector>

std::vector<int> prefix_function(const std::string& pattern) {
    std::vector<int> prefix(pattern.size());
    for (int index = 1; index < static_cast<int>(pattern.size()); ++index) {
        int matched = prefix[index - 1];
        while (matched > 0 && pattern[index] != pattern[matched]) {
            matched = prefix[matched - 1];
        }
        if (pattern[index] == pattern[matched]) {
            ++matched;
        }
        prefix[index] = matched;
    }
    return prefix;
}
```

## 時間與空間複雜度

指標總前進與回退次數都是線性，時間 $O(n+m)$，空間 $O(m)$。

## 常見錯誤與邊界條件

空模式、找到一次後未回退、把 prefix 長度當索引、混淆 Z-function 與 prefix function。

## 與相似技巧的比較

Z-function 比較每個後綴與整體前綴；rolling hash 易擴充但有碰撞；AC 自動機處理多模式。

## 例題與分級練習

找全部匹配位置、最小週期、最長 border 鏈。

## 本節重點速查

文字指標不回退；模式指標沿 border 鏈回退；prefix 值是長度。
