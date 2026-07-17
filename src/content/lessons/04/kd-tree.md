---
id: kd-tree
volume: upper
source_file: upper-volume
chapter: 4
section: '4.17'
title: K-D 樹：高維空間到二元樹的劃分
summary: 以輪替維度為基準遞迴劃分空間，支援 k 近鄰搜尋與區間查詢，平均 O(log n)。
prerequisites: [trees, geometry]
learning_goals:
  - 以輪替維度建平衡 k-d tree
  - 以剪枝策略加速最近點搜尋
  - 處理高維區間查詢
concepts: [kd-tree, nearest-neighbor, range-query]
complexity:
  time: average O(log n)
  space: O(n)
related_exercises: []
source_book_pages: [403, 420]
source_pdf_pages: [421, 438]
review_status: verified
---

## 這個技術解決什麼問題

在平面上（或更高維空間）高效搜尋最近點、範圍點數或最遠點。暴力 $O(n)$；K-D Tree 利用空間劃分與剪枝，平均降到 $O(\log n)$，高維或資料分布不佳時退化到 $O(n)$。

## 辨識題型的訊號

二維或三維空間中的最近點對、範圍查詢、k 近鄰、平面劃分與維恩圖近似。

## 核心想法與直覺

選一個維度（如 x），以中位數劃分平面為左右兩半；對每個子集再換下一個維度（y）劃分。如此形成一顆二元樹，每個節點代表一個超矩形區域。搜尋時先走正確的一側，再看另一側的矩形到查詢點的最短距離是否可能更新答案，不可能就剪枝。

## 狀態／資料結構定義

節點含 `point`（座標陣列）、`left`、`right`、`bounding_box`（可選，用於更高效率剪枝）。`dimension` 由深度模 $k$ 決定。

## 不變量或正確性證明

劃分時以中位數為界，保證左右子樹大小不超過 $n/2$。查詢正確性在於：若另一側的矩形到查詢點距離大於目前最佳答案，則該側所有點都不可能更近，可安全剪枝。

## 逐步演算法

1. 建樹：選當前維度，以 `nth_element` 找中位數，遞迴建左右子樹。
2. 最近點搜尋：
   - 先走目標點所在子樹，更新最佳距離。
   - 計算到分割超平面的垂直距離；若小於最佳距離，需搜尋另一側。
3. 區間查詢：遞迴檢查節點是否在查詢矩形內，並根據矩形與分割面關係決定是否繼續遞迴。

## C++17 模板

```cpp
#include <algorithm>
#include <cmath>
#include <limits>
#include <vector>

class KdTree {
public:
    struct Point {
        std::vector<double> coords;
    };

    struct Node {
        Point point;
        int dimension = 0;
        Node* left = nullptr;
        Node* right = nullptr;
    };

    explicit KdTree(std::vector<Point> points) {
        if (!points.empty()) {
            root = build(points, 0, 0, static_cast<int>(points.size()));
        }
    }

    ~KdTree() {
        delete_tree(root);
    }

    double nearest_distance(const Point& target) const {
        double best = std::numeric_limits<double>::infinity();
        nearest(root, target, best);
        return best;
    }

private:
    Node* root = nullptr;
    int dimensions = 2;

    Node* build(std::vector<Point>& points, int depth, int left, int right) {
        if (left >= right) {
            return nullptr;
        }
        int dim = depth % dimensions;
        int mid = left + (right - left) / 2;
        std::nth_element(
            points.begin() + left,
            points.begin() + mid,
            points.begin() + right,
            [dim](const Point& a, const Point& b) {
                return a.coords[dim] < b.coords[dim];
            }
        );
        Node* node = new Node{points[mid], dim};
        node->left = build(points, depth + 1, left, mid);
        node->right = build(points, depth + 1, mid + 1, right);
        return node;
    }

    static double squared_distance(const Point& a, const Point& b) {
        double sum = 0.0;
        for (std::size_t i = 0; i < a.coords.size(); ++i) {
            double diff = a.coords[i] - b.coords[i];
            sum += diff * diff;
        }
        return sum;
    }

    void nearest(Node* node, const Point& target, double& best) const {
        if (!node) {
            return;
        }
        double dist = squared_distance(node->point, target);
        if (dist < best) {
            best = dist;
        }
        int dim = node->dimension;
        double diff = target.coords[dim] - node->point.coords[dim];
        Node* first = diff < 0 ? node->left : node->right;
        Node* second = diff < 0 ? node->right : node->left;
        nearest(first, target, best);
        if (diff * diff < best) {
            nearest(second, target, best);
        }
    }

    static void delete_tree(Node* node) {
        if (!node) {
            return;
        }
        delete_tree(node->left);
        delete_tree(node->right);
        delete node;
    }
};
```

## 時間與空間複雜度

建樹 $O(n \log n)$（每次 `nth_element` 平均 $O(n)$，共 $O(\log n)$ 層）；最近點搜尋平均 $O(\log n)$，最壞 $O(n)$。空間 $O(n)$。

## 常見錯誤與邊界條件

剪枝條件用「到分割面的距離」而非「到節點點的距離」、高維度時 `nth_element` 比較器未正確選維度、空樹未處理、維度不一致導致陣列越界。

## 與相似技巧的比較

Voronoi Diagram 最適合二維精確最近點，但建構與動態維護複雜；暴力掃描 $O(n)$ 簡單但過慢。K-D Tree 是折衷方案，高維（$>10$）時效果變差，通常改用局部敏感雜湊或球樹。

## 例題與分級練習

先做平面最近點對，再做矩形範圍點數查詢，最後挑戰動態插入與重建（定期全域重建維持平衡）。

## 本節重點速查

輪替維度、中位數劃分、先搜正確側再剪枝另一側；最近點的剪枝條件為到分割面的距離小於目前最佳。
