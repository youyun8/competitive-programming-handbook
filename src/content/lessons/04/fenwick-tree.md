---
id: fenwick-tree
volume: upper
source_file: upper-volume
chapter: 4
section: '4.2'
title: 樹狀陣列：前綴查詢的扁平歷史
summary: 以 lowbit 將前綴和拆解成對數段，支援單點更新與區間和。
prerequisites: [arrays, prefix-sum]
learning_goals:
  - 建立 bit 陣列
  - 做單點更新與前綴查詢
  - 擴展到區間更新
concepts: [binary-indexed-tree, prefix-query, point-update]
complexity:
  time: O(log n)
  space: O(n)
related_exercises: ['fenwick-tree-query']
source_book_pages: [151, 170]
source_pdf_pages: [169, 188]
review_status: verified
---

## 這個技術解決什麼問題

樹狀陣列在 $O(\log n)$ 時間內完成「單點增加＋前綴和查詢」。若前綴運算可逆，也可以 $O(\log n)$ 求區間和。

## 辨識題型的訊號

頻繁單點修改、大範圍前綴或區間和、統計頻率後維護前綴累積值。比線段樹常數小，但需滿足「前綴可逆」才能改區間和。

## 核心想法與直覺

陣列索引的二進位分解就是儲存結構。`tree[i]` 管理一段以 `i` 為右端點、長度為 `lowbit(i)` 的區間總和。更新時像爬樹一樣往右上方走；查詢時拆解位元往左下方收斂。

## 狀態／資料結構定義

`tree` 為大小 $n+1$（1-indexed）之陣列。`tree[i]` 負責區間 $(i - \text{lowbit}(i), i]$。

## 不變量或正確性證明

對任意 $i$，$[1, i]$ 可被唯一分解為若干個不相交的 `lowbit` 段，由大到小恰好對應從 $i$ 開始不斷扣 `lowbit(i)` 的過程。因此前綴和一定正確；單點更新只改與其相關的段，而這些段不重疊且覆蓋全部受其影響的 `tree[i]`。

## 逐步演算法

1. `lowbit(x) = x & -x`
2. `add(pos, delta)`：while `pos <= n`，`tree[pos] += delta`，`pos += lowbit(pos)`
3. `sum(pos)`：while `pos > 0`，累加 `tree[pos]`，`pos -= lowbit(pos)`
4. 區間和 `sum(r) - sum(l-1)`

## C++17 模板

```cpp
#include <vector>

class FenwickTree {
public:
    explicit FenwickTree(int count) : size(count), tree(count + 1, 0) {}

    void add(int position, long long delta) {
        for (int i = position; i <= size; i += lowbit(i)) {
            tree[i] += delta;
        }
    }

    long long prefix_sum(int position) const {
        long long result = 0;
        for (int i = position; i > 0; i -= lowbit(i)) {
            result += tree[i];
        }
        return result;
    }

    long long range_sum(int left, int right) const {
        if (left > right) {
            return 0;
        }
        return prefix_sum(right) - prefix_sum(left - 1);
    }

private:
    int size;
    std::vector<long long> tree;

    static int lowbit(int value) {
        return value & -value;
    }
};
```

## 時間與空間複雜度

每次 `add` 與 `prefix_sum` 最多經過 $O(\log n)$ 個 `tree` 節點；空間 $O(n)$。

## 常見錯誤與邊界條件

0-indexed 與 1-indexed 混用、忘記 `long long` 導致溢出、`add` 的迴圈條件寫成 `<` 而漏掉最後一點。

## 與相似技巧的比較

線段樹支援任意可合併資訊與區間修改；Sparse Table 不支援修改；二分索引樹最適合可逆前綴問題，且常數明顯較小。

## 例題與分級練習

先做區間和，再做區間加／單點查詢的差分樹狀陣列，最後挑戰二維樹狀陣列。

## 教材經典例題與 C++ 解答

以下例題對應本章教材的並查集與樹狀陣列主題。題意皆為本站重新敘述，程式為獨立撰寫、可直接編譯的 C++17，讀完即得完整解法。

### 例題一：動態連通性（並查集）

逐條加邊，並隨時回答兩點是否連通。並查集用路徑壓縮加按大小合併：`find` 沿途把節點接到祖父以壓平樹高，`unite` 把較小的樹掛到較大的樹下。`m` 次操作近似 O(m·α(n))，實務上可視為常數。

```cpp
#include <bits/stdc++.h>
using namespace std;

// 並查集：逐條加邊並回答兩點是否連通（路徑壓縮 + 按大小合併）。
class DisjointSet {
public:
    explicit DisjointSet(int n) : parent_(n), size_(n, 1) {
        iota(parent_.begin(), parent_.end(), 0);
    }
    int find(int x) {
        while (parent_[x] != x) { x = parent_[x] = parent_[parent_[x]]; }
        return x;
    }
    void unite(int a, int b) {
        a = find(a);
        b = find(b);
        if (a == b) { return; }
        if (size_[a] < size_[b]) { swap(a, b); }
        parent_[b] = a;
        size_[a] += size_[b];
    }
    bool connected(int a, int b) { return find(a) == find(b); }

private:
    vector<int> parent_;
    vector<int> size_;
};

int main() {
    int n, q;
    if (!(cin >> n >> q)) { return 0; }
    DisjointSet dsu(n);
    while (q--) {
        int type, a, b;
        cin >> type >> a >> b;
        if (type == 1) { dsu.unite(a, b); }
        else { cout << (dsu.connected(a, b) ? "YES" : "NO") << '\n'; }
    }
    return 0;
}
```

先合併 `{0,1}` 與 `{1,2}`，查詢 `0` 與 `2` 得 `YES`，查詢 `0` 與 `3` 得 `NO`（此時 3 尚未併入）。

### 例題二：單點修改與區間和（樹狀陣列）

支援「單點加值」與「區間和查詢」。樹狀陣列以 `lowbit` 把前綴拆成少量二進位區塊：`add` 沿 `+lowbit` 往上更新所有覆蓋該點的區塊，`prefix_sum` 沿 `-lowbit` 往左累加，區間和則是兩個前綴之差。單次操作 O(log n)。

```cpp
#include <bits/stdc++.h>
using namespace std;

// 樹狀陣列：支援單點加值與區間和查詢（1-based）。
class FenwickTree {
public:
    explicit FenwickTree(int n) : tree_(static_cast<size_t>(n) + 1, 0) {}
    void add(int index, long long delta) {
        for (; index < static_cast<int>(tree_.size()); index += index & (-index)) {
            tree_[index] += delta;
        }
    }
    long long prefix_sum(int index) const {
        long long sum = 0;
        for (; index > 0; index -= index & (-index)) { sum += tree_[index]; }
        return sum;
    }
    long long range_sum(int l, int r) const { return prefix_sum(r) - prefix_sum(l - 1); }

private:
    vector<long long> tree_;
};

int main() {
    int n, q;
    if (!(cin >> n >> q)) { return 0; }
    FenwickTree tree(n);
    for (int i = 1; i <= n; ++i) {
        long long value;
        cin >> value;
        tree.add(i, value);
    }
    while (q--) {
        int type, a, b;
        cin >> type >> a >> b;
        if (type == 1) { tree.add(a, b); }
        else { cout << tree.range_sum(a, b) << '\n'; }
    }
    return 0;
}
```

序列 `1 2 3 4 5`：查詢 `[1,3]` 得 `6`，把第 2 項加 10 後再查 `[1,3]` 得 `16`，查 `[2,2]` 得 `12`。

## 本節重點速查

`add` 往上爬（`+lowbit`），`sum` 往左收（`-lowbit`）；區間更新用兩個 BIT 或差分維護。
