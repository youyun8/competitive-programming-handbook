export const chapterExerciseCode: Record<string, string> = {
  括號序列驗證: String.raw`#include <bits/stdc++.h>
using namespace std;

bool matches(char left, char right) {
    return (left == '(' && right == ')') ||
           (left == '[' && right == ']') ||
           (left == '{' && right == '}');
}

int main() {
    string text;
    getline(cin, text);
    vector<pair<char, int>> stack;
    int error_position = 0;

    for (int index = 0; index < static_cast<int>(text.size()); ++index) {
        char current = text[index];
        if (current == '(' || current == '[' || current == '{') {
            stack.push_back({current, index + 1});
        } else if (current == ')' || current == ']' || current == '}') {
            if (stack.empty() || !matches(stack.back().first, current)) {
                error_position = index + 1;
                break;
            }
            stack.pop_back();
        }
    }

    if (error_position == 0 && !stack.empty()) {
        error_position = stack.back().second;
    }
    cout << error_position << '\n';
    return 0;
}
`,
  循環佇列: String.raw`#include <bits/stdc++.h>
using namespace std;

class CircularQueue {
public:
    explicit CircularQueue(int capacity)
        : buffer_(static_cast<size_t>(capacity) + 1), head_(0), tail_(0) {}

    bool empty() const {
        return head_ == tail_;
    }

    bool full() const {
        return (tail_ + 1) % buffer_.size() == head_;
    }

    int size() const {
        return static_cast<int>((tail_ + buffer_.size() - head_) % buffer_.size());
    }

    bool push(int value) {
        if (full()) {
            return false;
        }
        buffer_[tail_] = value;
        tail_ = (tail_ + 1) % buffer_.size();
        return true;
    }

    bool pop() {
        if (empty()) {
            return false;
        }
        head_ = (head_ + 1) % buffer_.size();
        return true;
    }

    int front() const {
        return buffer_[head_];
    }

private:
    vector<int> buffer_;
    size_t head_;
    size_t tail_;
};

int main() {
    int capacity, query_count;
    cin >> capacity >> query_count;
    CircularQueue queue(capacity);

    for (int query_index = 0; query_index < query_count; ++query_index) {
        string operation;
        cin >> operation;
        if (operation == "push") {
            int value;
            cin >> value;
            cout << (queue.push(value) ? "ok" : "full") << '\n';
        } else if (operation == "pop") {
            cout << (queue.pop() ? "ok" : "empty") << '\n';
        } else if (operation == "front") {
            if (queue.empty()) {
                cout << "empty\n";
            } else {
                cout << queue.front() << '\n';
            }
        } else if (operation == "size") {
            cout << queue.size() << '\n';
        }
    }
    return 0;
}
`,
  窗口極值: String.raw`#include <bits/stdc++.h>
using namespace std;

int main() {
    int n, window_size;
    cin >> n >> window_size;
    vector<int> values(n);
    for (int& value : values) {
        cin >> value;
    }

    deque<int> minimum_queue;
    deque<int> maximum_queue;
    vector<int> minimums;
    vector<int> maximums;

    for (int index = 0; index < n; ++index) {
        while (!minimum_queue.empty() &&
               minimum_queue.front() <= index - window_size) {
            minimum_queue.pop_front();
        }
        while (!maximum_queue.empty() &&
               maximum_queue.front() <= index - window_size) {
            maximum_queue.pop_front();
        }
        while (!minimum_queue.empty() &&
               values[minimum_queue.back()] >= values[index]) {
            minimum_queue.pop_back();
        }
        while (!maximum_queue.empty() &&
               values[maximum_queue.back()] <= values[index]) {
            maximum_queue.pop_back();
        }
        minimum_queue.push_back(index);
        maximum_queue.push_back(index);

        if (index >= window_size - 1) {
            minimums.push_back(values[minimum_queue.front()]);
            maximums.push_back(values[maximum_queue.front()]);
        }
    }

    for (int value : minimums) {
        cout << value << ' ';
    }
    cout << '\n';
    for (int value : maximums) {
        cout << value << ' ';
    }
    cout << '\n';
    return 0;
}
`,
  合併木材: String.raw`#include <bits/stdc++.h>
using namespace std;

int main() {
    int piece_count;
    cin >> piece_count;
    priority_queue<long long, vector<long long>, greater<long long>> pieces;
    for (int index = 0; index < piece_count; ++index) {
        long long length;
        cin >> length;
        pieces.push(length);
    }

    long long total_cost = 0;
    while (pieces.size() > 1) {
        long long first = pieces.top();
        pieces.pop();
        long long second = pieces.top();
        pieces.pop();
        long long merged = first + second;
        total_cost += merged;
        pieces.push(merged);
    }
    cout << total_cost << '\n';
    return 0;
}
`,
  第一個可行答案: String.raw`#include <bits/stdc++.h>
using namespace std;

int main() {
    int n, target;
    cin >> n >> target;
    vector<int> values(n);
    for (int& value : values) {
        cin >> value;
    }

    int left = 0;
    int right = n;
    while (left < right) {
        int middle = left + (right - left) / 2;
        if (values[middle] >= target) {
            right = middle;
        } else {
            left = middle + 1;
        }
    }

    cout << left << '\n';
    return 0;
}
`,
  區間總和: String.raw`#include <bits/stdc++.h>
using namespace std;

int main() {
    int n, query_count;
    cin >> n >> query_count;
    vector<long long> prefix(n + 1, 0);
    for (int index = 1; index <= n; ++index) {
        long long value;
        cin >> value;
        prefix[index] = prefix[index - 1] + value;
    }

    for (int query_index = 0; query_index < query_count; ++query_index) {
        int left, right;
        cin >> left >> right;
        cout << prefix[right] - prefix[left - 1] << '\n';
    }
    return 0;
}
`,
  靜態RMQ: String.raw`#include <bits/stdc++.h>
using namespace std;

int main() {
    int n, query_count;
    cin >> n >> query_count;
    vector<int> values(n);
    for (int& value : values) {
        cin >> value;
    }

    int log_limit = 1;
    while ((1 << log_limit) <= n) {
        ++log_limit;
    }
    vector<vector<int>> table(log_limit, vector<int>(n));
    table[0] = values;
    for (int level = 1; level < log_limit; ++level) {
        int length = 1 << level;
        int half = length >> 1;
        for (int left = 0; left + length <= n; ++left) {
            table[level][left] =
                min(table[level - 1][left], table[level - 1][left + half]);
        }
    }

    for (int query_index = 0; query_index < query_count; ++query_index) {
        int left, right;
        cin >> left >> right;
        --left;
        --right;
        int length = right - left + 1;
        int level = 31 - __builtin_clz(length);
        int block = 1 << level;
        cout << min(table[level][left], table[level][right - block + 1]) << '\n';
    }
    return 0;
}
`,
  逆序對: String.raw`#include <bits/stdc++.h>
using namespace std;

long long merge_count(vector<long long>& values, vector<long long>& buffer,
                      int left, int right) {
    if (right - left <= 1) {
        return 0;
    }

    int middle = left + (right - left) / 2;
    long long answer = merge_count(values, buffer, left, middle);
    answer += merge_count(values, buffer, middle, right);
    int first = left;
    int second = middle;
    int position = left;
    while (first < middle || second < right) {
        if (second == right ||
            (first < middle && values[first] <= values[second])) {
            buffer[position++] = values[first++];
        } else {
            buffer[position++] = values[second++];
            answer += middle - first;
        }
    }
    for (int index = left; index < right; ++index) {
        values[index] = buffer[index];
    }
    return answer;
}

int main() {
    int n;
    cin >> n;
    vector<long long> values(n);
    for (long long& value : values) {
        cin >> value;
    }
    vector<long long> buffer(n);
    cout << merge_count(values, buffer, 0, n) << '\n';
    return 0;
}
`,
  網格連通塊: String.raw`#include <bits/stdc++.h>
using namespace std;

int main() {
    int rows, columns;
    cin >> rows >> columns;
    vector<string> grid(rows);
    for (string& row : grid) {
        cin >> row;
    }

    const int delta_row[] = {-1, 1, 0, 0};
    const int delta_column[] = {0, 0, -1, 1};
    int component_count = 0;
    vector<vector<bool>> visited(rows, vector<bool>(columns, false));

    for (int row = 0; row < rows; ++row) {
        for (int column = 0; column < columns; ++column) {
            if (grid[row][column] != '1' || visited[row][column]) {
                continue;
            }
            ++component_count;
            queue<pair<int, int>> frontier;
            frontier.push({row, column});
            visited[row][column] = true;
            while (!frontier.empty()) {
                auto [current_row, current_column] = frontier.front();
                frontier.pop();
                for (int direction = 0; direction < 4; ++direction) {
                    int next_row = current_row + delta_row[direction];
                    int next_column = current_column + delta_column[direction];
                    if (next_row < 0 || next_row >= rows ||
                        next_column < 0 || next_column >= columns) {
                        continue;
                    }
                    if (grid[next_row][next_column] != '1' ||
                        visited[next_row][next_column]) {
                        continue;
                    }
                    visited[next_row][next_column] = true;
                    frontier.push({next_row, next_column});
                }
            }
        }
    }
    cout << component_count << '\n';
    return 0;
}
`,
  無權最短路: String.raw`#include <bits/stdc++.h>
using namespace std;

int main() {
    int vertex_count, edge_count, source, target;
    cin >> vertex_count >> edge_count >> source >> target;
    vector<vector<int>> graph(vertex_count);
    for (int edge_index = 0; edge_index < edge_count; ++edge_index) {
        int from, to;
        cin >> from >> to;
        graph[from].push_back(to);
        graph[to].push_back(from);
    }

    vector<int> distance(vertex_count, -1);
    vector<int> parent(vertex_count, -1);
    queue<int> frontier;
    frontier.push(source);
    distance[source] = 0;
    while (!frontier.empty()) {
        int current = frontier.front();
        frontier.pop();
        for (int next : graph[current]) {
            if (distance[next] != -1) {
                continue;
            }
            distance[next] = distance[current] + 1;
            parent[next] = current;
            frontier.push(next);
        }
    }

    if (distance[target] == -1) {
        cout << "-1\n";
        return 0;
    }
    vector<int> path;
    for (int current = target; current != -1; current = parent[current]) {
        path.push_back(current);
    }
    reverse(path.begin(), path.end());
    cout << distance[target] << '\n';
    for (int vertex : path) {
        cout << vertex << ' ';
    }
    cout << '\n';
    return 0;
}
`,
  零一邊權: String.raw`#include <bits/stdc++.h>
using namespace std;

int main() {
    int vertex_count, edge_count, source;
    cin >> vertex_count >> edge_count >> source;
    vector<vector<pair<int, int>>> graph(vertex_count);
    for (int edge_index = 0; edge_index < edge_count; ++edge_index) {
        int from, to, weight;
        cin >> from >> to >> weight;
        graph[from].push_back({to, weight});
        graph[to].push_back({from, weight});
    }

    const int infinity = numeric_limits<int>::max() / 4;
    vector<int> distance(vertex_count, infinity);
    deque<int> frontier;
    distance[source] = 0;
    frontier.push_back(source);
    while (!frontier.empty()) {
        int current = frontier.front();
        frontier.pop_front();
        for (auto [next, weight] : graph[current]) {
            if (distance[current] + weight >= distance[next]) {
                continue;
            }
            distance[next] = distance[current] + weight;
            if (weight == 0) {
                frontier.push_front(next);
            } else {
                frontier.push_back(next);
            }
        }
    }

    for (int value : distance) {
        if (value == infinity) {
            cout << -1 << ' ';
        } else {
            cout << value << ' ';
        }
    }
    cout << '\n';
    return 0;
}
`,
  雙向密碼鎖: String.raw`#include <bits/stdc++.h>
using namespace std;

int expand_one_layer(queue<int>& frontier, vector<int>& own_distance,
                     const vector<int>& other_distance,
                     const vector<vector<int>>& graph) {
    int layer_size = static_cast<int>(frontier.size());
    while (layer_size-- > 0) {
        int current = frontier.front();
        frontier.pop();
        for (int next : graph[current]) {
            if (own_distance[next] != -1) {
                continue;
            }
            own_distance[next] = own_distance[current] + 1;
            if (other_distance[next] != -1) {
                return own_distance[next] + other_distance[next];
            }
            frontier.push(next);
        }
    }
    return -1;
}

int main() {
    int vertex_count, edge_count, source, target;
    cin >> vertex_count >> edge_count >> source >> target;
    vector<vector<int>> graph(vertex_count);
    for (int edge_index = 0; edge_index < edge_count; ++edge_index) {
        int from, to;
        cin >> from >> to;
        graph[from].push_back(to);
        graph[to].push_back(from);
    }
    if (source == target) {
        cout << 0 << '\n';
        return 0;
    }

    queue<int> from_source;
    queue<int> from_target;
    vector<int> source_distance(vertex_count, -1);
    vector<int> target_distance(vertex_count, -1);
    from_source.push(source);
    from_target.push(target);
    source_distance[source] = 0;
    target_distance[target] = 0;
    int answer = -1;

    while (!from_source.empty() && !from_target.empty() && answer == -1) {
        if (from_source.size() <= from_target.size()) {
            answer = expand_one_layer(from_source, source_distance,
                                      target_distance, graph);
        } else {
            answer = expand_one_layer(from_target, target_distance,
                                      source_distance, graph);
        }
    }
    cout << answer << '\n';
    return 0;
}
`,
  動態連通性: String.raw`#include <bits/stdc++.h>
using namespace std;

class DisjointSetUnion {
public:
    explicit DisjointSetUnion(int size) : parent_(size), size_(size, 1) {
        iota(parent_.begin(), parent_.end(), 0);
    }

    int find(int node) {
        if (parent_[node] == node) {
            return node;
        }
        return parent_[node] = find(parent_[node]);
    }

    bool unite(int left, int right) {
        left = find(left);
        right = find(right);
        if (left == right) {
            return false;
        }
        if (size_[left] < size_[right]) {
            swap(left, right);
        }
        parent_[right] = left;
        size_[left] += size_[right];
        return true;
    }

private:
    vector<int> parent_;
    vector<int> size_;
};

int main() {
    int vertex_count, operation_count;
    cin >> vertex_count >> operation_count;
    DisjointSetUnion dsu(vertex_count);
    for (int operation_index = 0; operation_index < operation_count;
         ++operation_index) {
        char operation;
        int left, right;
        cin >> operation >> left >> right;
        if (operation == 'U') {
            dsu.unite(left, right);
        } else {
            cout << (dsu.find(left) == dsu.find(right) ? "Yes" : "No") << '\n';
        }
    }
    return 0;
}
`,
  區間和: String.raw`#include <bits/stdc++.h>
using namespace std;

class FenwickTree {
public:
    explicit FenwickTree(int size) : tree_(size + 1, 0) {}

    void add(int index, long long delta) {
        for (; index < static_cast<int>(tree_.size()); index += index & -index) {
            tree_[index] += delta;
        }
    }

    long long prefix_sum(int index) const {
        long long result = 0;
        for (; index > 0; index -= index & -index) {
            result += tree_[index];
        }
        return result;
    }

    long long range_sum(int left, int right) const {
        return prefix_sum(right) - prefix_sum(left - 1);
    }

private:
    vector<long long> tree_;
};

int main() {
    int n, operation_count;
    cin >> n >> operation_count;
    FenwickTree tree(n);
    for (int index = 1; index <= n; ++index) {
        long long value;
        cin >> value;
        tree.add(index, value);
    }
    for (int operation_index = 0; operation_index < operation_count;
         ++operation_index) {
        char operation;
        int left, right;
        cin >> operation >> left >> right;
        if (operation == 'A') {
            tree.add(left, right);
        } else {
            cout << tree.range_sum(left, right) << '\n';
        }
    }
    return 0;
}
`,
  區間加與區間和: String.raw`#include <bits/stdc++.h>
using namespace std;

class SegmentTree {
public:
    explicit SegmentTree(const vector<long long>& values)
        : size_(static_cast<int>(values.size()) - 1),
          sum_(size_ * 4 + 4, 0),
          lazy_(size_ * 4 + 4, 0) {
        build(1, 1, size_, values);
    }

    void add(int left, int right, long long delta) {
        update(1, 1, size_, left, right, delta);
    }

    long long query(int left, int right) {
        return query_impl(1, 1, size_, left, right);
    }

private:
    int size_;
    vector<long long> sum_;
    vector<long long> lazy_;

    void build(int node, int left, int right,
               const vector<long long>& values) {
        if (left == right) {
            sum_[node] = values[left];
            return;
        }
        int middle = (left + right) / 2;
        build(node * 2, left, middle, values);
        build(node * 2 + 1, middle + 1, right, values);
        pull(node);
    }

    void pull(int node) {
        sum_[node] = sum_[node * 2] + sum_[node * 2 + 1];
    }

    void apply(int node, int left, int right, long long delta) {
        sum_[node] += delta * (right - left + 1);
        lazy_[node] += delta;
    }

    void push(int node, int left, int right) {
        if (lazy_[node] == 0 || left == right) {
            return;
        }
        int middle = (left + right) / 2;
        apply(node * 2, left, middle, lazy_[node]);
        apply(node * 2 + 1, middle + 1, right, lazy_[node]);
        lazy_[node] = 0;
    }

    void update(int node, int left, int right, int query_left,
                int query_right, long long delta) {
        if (query_left <= left && right <= query_right) {
            apply(node, left, right, delta);
            return;
        }
        push(node, left, right);
        int middle = (left + right) / 2;
        if (query_left <= middle) {
            update(node * 2, left, middle, query_left, query_right, delta);
        }
        if (query_right > middle) {
            update(node * 2 + 1, middle + 1, right, query_left, query_right,
                   delta);
        }
        pull(node);
    }

    long long query_impl(int node, int left, int right, int query_left,
                         int query_right) {
        if (query_left <= left && right <= query_right) {
            return sum_[node];
        }
        push(node, left, right);
        int middle = (left + right) / 2;
        long long result = 0;
        if (query_left <= middle) {
            result += query_impl(node * 2, left, middle, query_left,
                                 query_right);
        }
        if (query_right > middle) {
            result += query_impl(node * 2 + 1, middle + 1, right, query_left,
                                 query_right);
        }
        return result;
    }
};

int main() {
    int n, operation_count;
    cin >> n >> operation_count;
    vector<long long> values(n + 1);
    for (int index = 1; index <= n; ++index) {
        cin >> values[index];
    }
    SegmentTree tree(values);
    for (int operation_index = 0; operation_index < operation_count;
         ++operation_index) {
        char operation;
        int left, right;
        cin >> operation >> left >> right;
        if (operation == 'A') {
            long long delta;
            cin >> delta;
            tree.add(left, right, delta);
        } else {
            cout << tree.query(left, right) << '\n';
        }
    }
    return 0;
}
`,
  樹上路徑查詢: String.raw`#include <bits/stdc++.h>
using namespace std;

class HeavyLightDecomposition {
public:
    explicit HeavyLightDecomposition(const vector<vector<int>>& graph,
                                     const vector<long long>& values)
        : graph_(graph), values_(values), parent_(graph.size(), -1),
          depth_(graph.size(), 0), subtree_size_(graph.size(), 0),
          heavy_child_(graph.size(), -1), chain_head_(graph.size(), -1),
          position_(graph.size(), 0), base_(graph.size(), 0) {
        dfs_size(0, -1);
        int current_position = 0;
        decompose(0, 0, current_position);
        tree_.assign(graph.size() * 4 + 4, 0);
        build(1, 0, static_cast<int>(graph.size()) - 1);
    }

    long long path_sum(int left, int right) {
        long long result = 0;
        while (chain_head_[left] != chain_head_[right]) {
            if (depth_[chain_head_[left]] < depth_[chain_head_[right]]) {
                swap(left, right);
            }
            result += range_sum(1, 0, static_cast<int>(base_.size()) - 1,
                                position_[chain_head_[left]], position_[left]);
            left = parent_[chain_head_[left]];
        }
        if (depth_[left] > depth_[right]) {
            swap(left, right);
        }
        result += range_sum(1, 0, static_cast<int>(base_.size()) - 1,
                            position_[left], position_[right]);
        return result;
    }

private:
    const vector<vector<int>>& graph_;
    const vector<long long>& values_;
    vector<int> parent_;
    vector<int> depth_;
    vector<int> subtree_size_;
    vector<int> heavy_child_;
    vector<int> chain_head_;
    vector<int> position_;
    vector<long long> base_;
    vector<long long> tree_;

    void dfs_size(int node, int parent) {
        parent_[node] = parent;
        subtree_size_[node] = 1;
        int best_size = 0;
        for (int next : graph_[node]) {
            if (next == parent) {
                continue;
            }
            depth_[next] = depth_[node] + 1;
            dfs_size(next, node);
            subtree_size_[node] += subtree_size_[next];
            if (subtree_size_[next] > best_size) {
                best_size = subtree_size_[next];
                heavy_child_[node] = next;
            }
        }
    }

    void decompose(int node, int head, int& current_position) {
        chain_head_[node] = head;
        position_[node] = current_position;
        base_[current_position] = values_[node];
        ++current_position;
        if (heavy_child_[node] != -1) {
            decompose(heavy_child_[node], head, current_position);
        }
        for (int next : graph_[node]) {
            if (next == parent_[node] || next == heavy_child_[node]) {
                continue;
            }
            decompose(next, next, current_position);
        }
    }

    void build(int node, int left, int right) {
        if (left == right) {
            tree_[node] = base_[left];
            return;
        }
        int middle = (left + right) / 2;
        build(node * 2, left, middle);
        build(node * 2 + 1, middle + 1, right);
        tree_[node] = tree_[node * 2] + tree_[node * 2 + 1];
    }

    long long range_sum(int node, int left, int right, int query_left,
                        int query_right) {
        if (query_left <= left && right <= query_right) {
            return tree_[node];
        }
        int middle = (left + right) / 2;
        long long result = 0;
        if (query_left <= middle) {
            result += range_sum(node * 2, left, middle, query_left,
                                query_right);
        }
        if (query_right > middle) {
            result += range_sum(node * 2 + 1, middle + 1, right, query_left,
                                query_right);
        }
        return result;
    }
};

int main() {
    int n, query_count;
    cin >> n >> query_count;
    vector<long long> values(n);
    for (long long& value : values) {
        cin >> value;
    }
    vector<vector<int>> graph(n);
    for (int edge_index = 0; edge_index < n - 1; ++edge_index) {
        int left, right;
        cin >> left >> right;
        graph[left].push_back(right);
        graph[right].push_back(left);
    }
    HeavyLightDecomposition decomposition(graph, values);
    for (int query_index = 0; query_index < query_count; ++query_index) {
        int left, right;
        cin >> left >> right;
        cout << decomposition.path_sum(left, right) << '\n';
    }
    return 0;
}
`,
  最長遞增子序列: String.raw`#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> tails;
    for (int index = 0; index < n; ++index) {
        int value;
        cin >> value;
        auto position = lower_bound(tails.begin(), tails.end(), value);
        if (position == tails.end()) {
            tails.push_back(value);
        } else {
            *position = value;
        }
    }
    cout << tails.size() << '\n';
    return 0;
}
`,
  '0/1與完全背包': String.raw`#include <bits/stdc++.h>
using namespace std;

long long zero_one_knapsack(const vector<int>& weights,
                            const vector<int>& values, int capacity) {
    vector<long long> dp(capacity + 1, 0);
    for (int item = 0; item < static_cast<int>(weights.size()); ++item) {
        for (int current = capacity; current >= weights[item]; --current) {
            dp[current] =
                max(dp[current], dp[current - weights[item]] + values[item]);
        }
    }
    return dp[capacity];
}

long long complete_knapsack(const vector<int>& weights,
                            const vector<int>& values, int capacity) {
    vector<long long> dp(capacity + 1, 0);
    for (int item = 0; item < static_cast<int>(weights.size()); ++item) {
        for (int current = weights[item]; current <= capacity; ++current) {
            dp[current] =
                max(dp[current], dp[current - weights[item]] + values[item]);
        }
    }
    return dp[capacity];
}

int main() {
    int item_count, capacity;
    cin >> item_count >> capacity;
    vector<int> weights(item_count);
    vector<int> values(item_count);
    for (int& weight : weights) {
        cin >> weight;
    }
    for (int& value : values) {
        cin >> value;
    }
    cout << zero_one_knapsack(weights, values, capacity) << '\n';
    cout << complete_knapsack(weights, values, capacity) << '\n';
    return 0;
}
`,
  石子合併: String.raw`#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<long long> values(n + 1);
    vector<long long> prefix(n + 1, 0);
    for (int index = 1; index <= n; ++index) {
        cin >> values[index];
        prefix[index] = prefix[index - 1] + values[index];
    }

    const long long infinity = numeric_limits<long long>::max() / 4;
    vector<vector<long long>> dp(n + 1, vector<long long>(n + 1, 0));
    for (int length = 2; length <= n; ++length) {
        for (int left = 1; left + length - 1 <= n; ++left) {
            int right = left + length - 1;
            dp[left][right] = infinity;
            for (int middle = left; middle < right; ++middle) {
                long long cost = dp[left][middle] + dp[middle + 1][right] +
                                 prefix[right] - prefix[left - 1];
                dp[left][right] = min(dp[left][right], cost);
            }
        }
    }
    cout << dp[1][n] << '\n';
    return 0;
}
`,
  樹上選點: String.raw`#include <bits/stdc++.h>
using namespace std;

const long long negative_infinity = numeric_limits<long long>::min() / 4;
vector<vector<int>> tree;
vector<long long> weight;
vector<array<vector<long long>, 2>> dp;
int limit_k;

void dfs(int node, int parent) {
    for (int selected = 0; selected < 2; ++selected) {
        dp[node][selected].assign(limit_k + 1, negative_infinity);
    }
    dp[node][0][0] = 0;
    if (limit_k >= 1) {
        dp[node][1][1] = weight[node];
    }

    for (int next : tree[node]) {
        if (next == parent) {
            continue;
        }
        dfs(next, node);
        array<vector<long long>, 2> merged;
        for (int selected = 0; selected < 2; ++selected) {
            merged[selected].assign(limit_k + 1, negative_infinity);
        }
        for (int current_count = 0; current_count <= limit_k; ++current_count) {
            for (int child_count = 0; child_count <= limit_k; ++child_count) {
                if (current_count + child_count > limit_k) {
                    break;
                }
                if (dp[node][0][current_count] != negative_infinity) {
                    long long best_child =
                        max(dp[next][0][child_count], dp[next][1][child_count]);
                    merged[0][current_count + child_count] =
                        max(merged[0][current_count + child_count],
                            dp[node][0][current_count] + best_child);
                }
                if (dp[node][1][current_count] != negative_infinity &&
                    dp[next][0][child_count] != negative_infinity) {
                    merged[1][current_count + child_count] =
                        max(merged[1][current_count + child_count],
                            dp[node][1][current_count] +
                                dp[next][0][child_count]);
                }
            }
        }
        dp[node] = move(merged);
    }
}

int main() {
    int n;
    cin >> n >> limit_k;
    weight.resize(n);
    for (long long& value : weight) {
        cin >> value;
    }
    tree.assign(n, {});
    for (int edge_index = 0; edge_index < n - 1; ++edge_index) {
        int left, right;
        cin >> left >> right;
        tree[left].push_back(right);
        tree[right].push_back(left);
    }
    dp.resize(n);
    dfs(0, -1);
    cout << max(dp[0][0][limit_k], dp[0][1][limit_k]) << '\n';
    return 0;
}
`,
  模快速冪: String.raw`#include <bits/stdc++.h>
using namespace std;

long long multiply_mod(long long left, long long right, long long modulus) {
    left %= modulus;
    right %= modulus;
    if (left < 0) {
        left += modulus;
    }
    if (right < 0) {
        right += modulus;
    }
    long long result = 0;
    while (right > 0) {
        if (right & 1) {
            if (result >= modulus - left) {
                result -= modulus - left;
            } else {
                result += left;
            }
        }
        if (left >= modulus - left) {
            left -= modulus - left;
        } else {
            left += left;
        }
        right >>= 1;
    }
    return result;
}

long long mod_power(long long base, long long exponent, long long modulus) {
    base %= modulus;
    if (base < 0) {
        base += modulus;
    }
    long long result = 1 % modulus;
    while (exponent > 0) {
        if (exponent & 1) {
            result = multiply_mod(result, base, modulus);
        }
        base = multiply_mod(base, base, modulus);
        exponent >>= 1;
    }
    return result;
}

int main() {
    long long base, exponent, modulus;
    cin >> base >> exponent >> modulus;
    cout << mod_power(base, exponent, modulus) << '\n';
    return 0;
}
`,
  線性同餘: String.raw`#include <bits/stdc++.h>
using namespace std;

long long multiply_mod(long long left, long long right, long long modulus) {
    left %= modulus;
    right %= modulus;
    if (left < 0) {
        left += modulus;
    }
    if (right < 0) {
        right += modulus;
    }
    long long result = 0;
    while (right > 0) {
        if (right & 1) {
            if (result >= modulus - left) {
                result -= modulus - left;
            } else {
                result += left;
            }
        }
        if (left >= modulus - left) {
            left -= modulus - left;
        } else {
            left += left;
        }
        right >>= 1;
    }
    return result;
}

long long extended_gcd(long long a, long long b, long long& x, long long& y) {
    if (b == 0) {
        x = 1;
        y = 0;
        return a;
    }
    long long next_x, next_y;
    long long divisor = extended_gcd(b, a % b, next_x, next_y);
    x = next_y;
    y = next_x - (a / b) * next_y;
    return divisor;
}

int main() {
    long long a, b, modulus;
    cin >> a >> b >> modulus;
    long long x, y;
    long long divisor = extended_gcd(a, modulus, x, y);
    if (b % divisor != 0) {
        cout << "no solution\n";
        return 0;
    }
    long long reduced_modulus = modulus / divisor;
    long long solution =
        multiply_mod(x, b / divisor, reduced_modulus);
    cout << solution << ' ' << reduced_modulus << '\n';
    return 0;
}
`,
  質因數批次查詢: String.raw`#include <bits/stdc++.h>
using namespace std;

int main() {
    int limit, query_count;
    cin >> limit >> query_count;
    vector<int> smallest_factor(limit + 1, 0);
    vector<int> primes;
    for (int value = 2; value <= limit; ++value) {
        if (smallest_factor[value] == 0) {
            smallest_factor[value] = value;
            primes.push_back(value);
        }
        for (int prime : primes) {
            if (prime > smallest_factor[value] ||
                value * prime > limit) {
                break;
            }
            smallest_factor[value * prime] = prime;
        }
    }

    for (int query_index = 0; query_index < query_count; ++query_index) {
        int value;
        cin >> value;
        while (value > 1) {
            int prime = smallest_factor[value];
            int exponent = 0;
            while (value % prime == 0) {
                value /= prime;
                ++exponent;
            }
            cout << prime << '^' << exponent << ' ';
        }
        cout << '\n';
    }
    return 0;
}
`,
  固定長度最短路: String.raw`#include <bits/stdc++.h>
using namespace std;

using Matrix = vector<vector<long long>>;
const long long infinity = numeric_limits<long long>::max() / 4;

Matrix multiply(const Matrix& left, const Matrix& right) {
    int size = static_cast<int>(left.size());
    Matrix result(size, vector<long long>(size, infinity));
    for (int i = 0; i < size; ++i) {
        for (int middle = 0; middle < size; ++middle) {
            if (left[i][middle] == infinity) {
                continue;
            }
            for (int j = 0; j < size; ++j) {
                if (right[middle][j] == infinity) {
                    continue;
                }
                result[i][j] =
                    min(result[i][j], left[i][middle] + right[middle][j]);
            }
        }
    }
    return result;
}

Matrix power(Matrix base, long long exponent) {
    int size = static_cast<int>(base.size());
    Matrix result(size, vector<long long>(size, infinity));
    for (int i = 0; i < size; ++i) {
        result[i][i] = 0;
    }
    while (exponent > 0) {
        if (exponent & 1) {
            result = multiply(result, base);
        }
        base = multiply(base, base);
        exponent >>= 1;
    }
    return result;
}

int main() {
    int vertex_count, edge_count;
    long long step_count;
    cin >> vertex_count >> edge_count >> step_count;
    Matrix matrix(vertex_count, vector<long long>(vertex_count, infinity));
    for (int edge_index = 0; edge_index < edge_count; ++edge_index) {
        int from, to;
        long long cost;
        cin >> from >> to >> cost;
        matrix[from][to] = min(matrix[from][to], cost);
    }
    Matrix answer = power(matrix, step_count);
    for (int from = 0; from < vertex_count; ++from) {
        for (int to = 0; to < vertex_count; ++to) {
            if (answer[from][to] == infinity) {
                cout << "inf ";
            } else {
                cout << answer[from][to] << ' ';
            }
        }
        cout << '\n';
    }
    return 0;
}
`,
  Pascal三角形: String.raw`#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<vector<long long>> combination(n + 1, vector<long long>(n + 1, 0));
    for (int row = 0; row <= n; ++row) {
        combination[row][0] = 1;
        combination[row][row] = 1;
        for (int column = 1; column < row; ++column) {
            combination[row][column] =
                combination[row - 1][column - 1] +
                combination[row - 1][column];
        }
    }
    for (int row = 0; row <= n; ++row) {
        for (int column = 0; column <= row; ++column) {
            cout << combination[row][column] << ' ';
        }
        cout << '\n';
    }
    return 0;
}
`,
  鴿巢前綴和: String.raw`#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> first_position(n, -1);
    first_position[0] = 0;
    int remainder = 0;
    for (int index = 1; index <= n; ++index) {
        int value;
        cin >> value;
        remainder = (remainder + value) % n;
        if (remainder < 0) {
            remainder += n;
        }
        if (first_position[remainder] != -1) {
            for (int position = first_position[remainder] + 1;
                 position <= index; ++position) {
                cout << position << ' ';
            }
            cout << '\n';
            return 0;
        }
        first_position[remainder] = index;
    }
    return 0;
}
`,
  受限排列: String.raw`#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<long long> factorial(n + 1, 1);
    for (int value = 1; value <= n; ++value) {
        factorial[value] = factorial[value - 1] * value;
    }

    long long answer = 0;
    for (int selected = 0; selected <= n; ++selected) {
        long long term = factorial[n] / factorial[selected];
        term /= factorial[n - selected];
        term *= factorial[n - selected];
        if (selected % 2 == 0) {
            answer += term;
        } else {
            answer -= term;
        }
    }
    cout << answer << '\n';
    return 0;
}
`,
  Nim合併遊戲: String.raw`#include <bits/stdc++.h>
using namespace std;

int main() {
    int pile_count;
    cin >> pile_count;
    int xor_sum = 0;
    for (int index = 0; index < pile_count; ++index) {
        int stones;
        cin >> stones;
        xor_sum ^= stones;
    }
    cout << (xor_sum == 0 ? "Second" : "First") << '\n';
    return 0;
}
`,
  線段相交: String.raw`#include <bits/stdc++.h>
using namespace std;

struct Point {
    long long x;
    long long y;
};

long long cross(const Point& a, const Point& b, const Point& c) {
    return (b.x - a.x) * (c.y - a.y) -
           (b.y - a.y) * (c.x - a.x);
}

bool in_box(const Point& a, const Point& b, const Point& point) {
    return min(a.x, b.x) <= point.x && point.x <= max(a.x, b.x) &&
           min(a.y, b.y) <= point.y && point.y <= max(a.y, b.y);
}

bool intersects(const Point& a, const Point& b,
                const Point& c, const Point& d) {
    long long first = cross(a, b, c);
    long long second = cross(a, b, d);
    long long third = cross(c, d, a);
    long long fourth = cross(c, d, b);
    if (((first > 0 && second < 0) || (first < 0 && second > 0)) &&
        ((third > 0 && fourth < 0) || (third < 0 && fourth > 0))) {
        return true;
    }
    if (first == 0 && in_box(a, b, c)) {
        return true;
    }
    if (second == 0 && in_box(a, b, d)) {
        return true;
    }
    if (third == 0 && in_box(c, d, a)) {
        return true;
    }
    return fourth == 0 && in_box(c, d, b);
}

int main() {
    Point a, b, c, d;
    cin >> a.x >> a.y >> b.x >> b.y;
    cin >> c.x >> c.y >> d.x >> d.y;
    cout << (intersects(a, b, c, d) ? "Yes" : "No") << '\n';
    return 0;
}
`,
  多邊形面積: String.raw`#include <bits/stdc++.h>
using namespace std;

struct Point {
    long long x;
    long long y;
};

int main() {
    int n;
    cin >> n;
    vector<Point> points(n);
    for (Point& point : points) {
        cin >> point.x >> point.y;
    }

    long long twice_area = 0;
    for (int index = 0; index < n; ++index) {
        int next = (index + 1) % n;
        twice_area += points[index].x * points[next].y -
                      points[index].y * points[next].x;
    }
    cout << fixed << setprecision(1)
         << static_cast<double>(abs(twice_area)) / 2.0 << '\n';
    return 0;
}
`,
  凸包周長: String.raw`#include <bits/stdc++.h>
using namespace std;

struct Point {
    long long x;
    long long y;

    bool operator<(const Point& other) const {
        return tie(x, y) < tie(other.x, other.y);
    }

    bool operator==(const Point& other) const {
        return x == other.x && y == other.y;
    }
};

long long cross(const Point& a, const Point& b, const Point& c) {
    return (b.x - a.x) * (c.y - a.y) -
           (b.y - a.y) * (c.x - a.x);
}

double distance_between(const Point& a, const Point& b) {
    long long dx = a.x - b.x;
    long long dy = a.y - b.y;
    return hypot(static_cast<double>(dx), static_cast<double>(dy));
}

int main() {
    int n;
    cin >> n;
    vector<Point> points(n);
    for (Point& point : points) {
        cin >> point.x >> point.y;
    }
    sort(points.begin(), points.end());
    points.erase(unique(points.begin(), points.end()), points.end());

    if (points.size() <= 1) {
        cout << "0.000000\n";
        return 0;
    }
    vector<Point> hull;
    for (const Point& point : points) {
        while (hull.size() >= 2 &&
               cross(hull[hull.size() - 2], hull.back(), point) <= 0) {
            hull.pop_back();
        }
        hull.push_back(point);
    }
    size_t lower_size = hull.size();
    for (int index = static_cast<int>(points.size()) - 2; index >= 0;
         --index) {
        while (hull.size() > lower_size &&
               cross(hull[hull.size() - 2], hull.back(), points[index]) <= 0) {
            hull.pop_back();
        }
        hull.push_back(points[index]);
    }
    hull.pop_back();

    double perimeter = 0;
    for (int index = 0; index < static_cast<int>(hull.size()); ++index) {
        perimeter += distance_between(
            hull[index], hull[(index + 1) % hull.size()]);
    }
    cout << fixed << setprecision(6) << perimeter << '\n';
    return 0;
}
`,
  最遠點對: String.raw`#include <bits/stdc++.h>
using namespace std;

struct Point {
    long long x;
    long long y;

    bool operator<(const Point& other) const {
        return tie(x, y) < tie(other.x, other.y);
    }

    bool operator==(const Point& other) const {
        return x == other.x && y == other.y;
    }
};

long long cross(const Point& a, const Point& b, const Point& c) {
    return (b.x - a.x) * (c.y - a.y) -
           (b.y - a.y) * (c.x - a.x);
}

long long distance_square(const Point& a, const Point& b) {
    long long dx = a.x - b.x;
    long long dy = a.y - b.y;
    return dx * dx + dy * dy;
}

vector<Point> convex_hull(vector<Point> points) {
    sort(points.begin(), points.end());
    points.erase(unique(points.begin(), points.end()), points.end());
    if (points.size() <= 1) {
        return points;
    }
    vector<Point> hull;
    for (const Point& point : points) {
        while (hull.size() >= 2 &&
               cross(hull[hull.size() - 2], hull.back(), point) <= 0) {
            hull.pop_back();
        }
        hull.push_back(point);
    }
    size_t lower_size = hull.size();
    for (int index = static_cast<int>(points.size()) - 2; index >= 0;
         --index) {
        while (hull.size() > lower_size &&
               cross(hull[hull.size() - 2], hull.back(), points[index]) <= 0) {
            hull.pop_back();
        }
        hull.push_back(points[index]);
    }
    hull.pop_back();
    return hull;
}

int main() {
    int n;
    cin >> n;
    vector<Point> points(n);
    for (Point& point : points) {
        cin >> point.x >> point.y;
    }
    vector<Point> hull = convex_hull(points);
    long long answer = 0;
    int hull_size = static_cast<int>(hull.size());
    if (hull_size == 1) {
        cout << 0 << '\n';
        return 0;
    }
    if (hull_size == 2) {
        cout << distance_square(hull[0], hull[1]) << '\n';
        return 0;
    }

    int opposite = 1;
    for (int index = 0; index < hull_size; ++index) {
        int next = (index + 1) % hull_size;
        while (abs(cross(hull[index], hull[next],
                         hull[(opposite + 1) % hull_size])) >
               abs(cross(hull[index], hull[next], hull[opposite]))) {
            opposite = (opposite + 1) % hull_size;
        }
        answer = max(answer, distance_square(hull[index], hull[opposite]));
        answer = max(answer, distance_square(hull[next], hull[opposite]));
    }
    cout << answer << '\n';
    return 0;
}
`,
  前綴函數: String.raw`#include <bits/stdc++.h>
using namespace std;

int main() {
    string text;
    cin >> text;
    vector<int> prefix(text.size(), 0);
    for (int index = 1; index < static_cast<int>(text.size()); ++index) {
        int matched = prefix[index - 1];
        while (matched > 0 && text[index] != text[matched]) {
            matched = prefix[matched - 1];
        }
        if (text[index] == text[matched]) {
            ++matched;
        }
        prefix[index] = matched;
    }
    for (int value : prefix) {
        cout << value << ' ';
    }
    cout << '\n';
    return 0;
}
`,
  字典統計: String.raw`#include <bits/stdc++.h>
using namespace std;

class Trie {
public:
    Trie() {
        nodes_.push_back(Node{});
    }

    void insert(const string& word) {
        int node = 0;
        for (char character : word) {
            int index = character - 'a';
            if (nodes_[node].child[index] == -1) {
                nodes_[node].child[index] = static_cast<int>(nodes_.size());
                nodes_.push_back(Node{});
            }
            node = nodes_[node].child[index];
            ++nodes_[node].pass_count;
        }
        ++nodes_[node].end_count;
    }

    int count_prefix(const string& prefix) const {
        int node = 0;
        for (char character : prefix) {
            int index = character - 'a';
            if (nodes_[node].child[index] == -1) {
                return 0;
            }
            node = nodes_[node].child[index];
        }
        return nodes_[node].pass_count;
    }

private:
    struct Node {
        array<int, 26> child;
        int pass_count = 0;
        int end_count = 0;

        Node() {
            child.fill(-1);
        }
    };

    vector<Node> nodes_;
};

int main() {
    int operation_count;
    cin >> operation_count;
    Trie trie;
    for (int operation_index = 0; operation_index < operation_count;
         ++operation_index) {
        char operation;
        string word;
        cin >> operation >> word;
        if (operation == 'I') {
            trie.insert(word);
        } else {
            cout << trie.count_prefix(word) << '\n';
        }
    }
    return 0;
}
`,
  多模式匹配: String.raw`#include <bits/stdc++.h>
using namespace std;

class AhoCorasick {
public:
    AhoCorasick() {
        nodes_.push_back(Node{});
    }

    void add_pattern(const string& pattern) {
        int node = 0;
        for (char character : pattern) {
            int index = character - 'a';
            if (nodes_[node].next[index] == -1) {
                nodes_[node].next[index] = static_cast<int>(nodes_.size());
                nodes_.push_back(Node{});
            }
            node = nodes_[node].next[index];
        }
        ++nodes_[node].output;
    }

    void build() {
        queue<int> frontier;
        for (int index = 0; index < 26; ++index) {
            int child = nodes_[0].next[index];
            if (child == -1) {
                nodes_[0].next[index] = 0;
            } else {
                frontier.push(child);
            }
        }
        while (!frontier.empty()) {
            int node = frontier.front();
            frontier.pop();
            nodes_[node].output += nodes_[nodes_[node].fail].output;
            for (int index = 0; index < 26; ++index) {
                int child = nodes_[node].next[index];
                if (child == -1) {
                    nodes_[node].next[index] =
                        nodes_[nodes_[node].fail].next[index];
                } else {
                    nodes_[child].fail =
                        nodes_[nodes_[node].fail].next[index];
                    frontier.push(child);
                }
            }
        }
    }

    int count_matches(const string& text) const {
        int node = 0;
        int answer = 0;
        for (char character : text) {
            node = nodes_[node].next[character - 'a'];
            answer += nodes_[node].output;
        }
        return answer;
    }

private:
    struct Node {
        array<int, 26> next;
        int fail = 0;
        int output = 0;

        Node() {
            next.fill(-1);
        }
    };

    vector<Node> nodes_;
};

int main() {
    int pattern_count;
    cin >> pattern_count;
    AhoCorasick automaton;
    for (int index = 0; index < pattern_count; ++index) {
        string pattern;
        cin >> pattern;
        automaton.add_pattern(pattern);
    }
    automaton.build();
    string text;
    cin >> text;
    cout << automaton.count_matches(text) << '\n';
    return 0;
}
`,
  不同子字串數: String.raw`#include <bits/stdc++.h>
using namespace std;

struct State {
    int length = 0;
    int link = -1;
    array<int, 26> next;

    State() {
        next.fill(-1);
    }
};

int main() {
    string text;
    cin >> text;
    vector<State> states(2 * text.size());
    int state_count = 1;
    int last = 0;

    for (char character : text) {
        int index = character - 'a';
        int current = state_count++;
        states[current].length = states[last].length + 1;
        int parent = last;
        while (parent != -1 && states[parent].next[index] == -1) {
            states[parent].next[index] = current;
            parent = states[parent].link;
        }
        if (parent == -1) {
            states[current].link = 0;
        } else {
            int previous = states[parent].next[index];
            if (states[parent].length + 1 == states[previous].length) {
                states[current].link = previous;
            } else {
                int clone = state_count++;
                states[clone] = states[previous];
                states[clone].length = states[parent].length + 1;
                while (parent != -1 &&
                       states[parent].next[index] == previous) {
                    states[parent].next[index] = clone;
                    parent = states[parent].link;
                }
                states[previous].link = clone;
                states[current].link = clone;
            }
        }
        last = current;
    }

    long long answer = 0;
    for (int state = 1; state < state_count; ++state) {
        answer += states[state].length - states[states[state].link].length;
    }
    cout << answer << '\n';
    return 0;
}
`,
  字典序拓撲排序: String.raw`#include <bits/stdc++.h>
using namespace std;

int main() {
    int vertex_count, edge_count;
    cin >> vertex_count >> edge_count;
    vector<vector<int>> graph(vertex_count);
    vector<int> in_degree(vertex_count, 0);
    for (int edge_index = 0; edge_index < edge_count; ++edge_index) {
        int from, to;
        cin >> from >> to;
        graph[from].push_back(to);
        ++in_degree[to];
    }

    priority_queue<int, vector<int>, greater<int>> ready;
    for (int vertex = 0; vertex < vertex_count; ++vertex) {
        if (in_degree[vertex] == 0) {
            ready.push(vertex);
        }
    }
    vector<int> order;
    while (!ready.empty()) {
        int current = ready.top();
        ready.pop();
        order.push_back(current);
        for (int next : graph[current]) {
            --in_degree[next];
            if (in_degree[next] == 0) {
                ready.push(next);
            }
        }
    }

    if (static_cast<int>(order.size()) != vertex_count) {
        cout << "cycle\n";
        return 0;
    }
    for (int vertex : order) {
        cout << vertex << ' ';
    }
    cout << '\n';
    return 0;
}
`,
  單源最短路: String.raw`#include <bits/stdc++.h>
using namespace std;

struct Edge {
    int to;
    long long weight;
};

int main() {
    int vertex_count, edge_count, source;
    cin >> vertex_count >> edge_count >> source;
    vector<vector<Edge>> graph(vertex_count);
    for (int edge_index = 0; edge_index < edge_count; ++edge_index) {
        int from, to;
        long long weight;
        cin >> from >> to >> weight;
        graph[from].push_back({to, weight});
    }

    const long long infinity = numeric_limits<long long>::max() / 4;
    vector<long long> distance(vertex_count, infinity);
    priority_queue<pair<long long, int>,
                   vector<pair<long long, int>>,
                   greater<pair<long long, int>>> frontier;
    distance[source] = 0;
    frontier.push({0, source});
    while (!frontier.empty()) {
        auto [current_distance, current] = frontier.top();
        frontier.pop();
        if (current_distance != distance[current]) {
            continue;
        }
        for (const Edge& edge : graph[current]) {
            long long candidate = current_distance + edge.weight;
            if (candidate >= distance[edge.to]) {
                continue;
            }
            distance[edge.to] = candidate;
            frontier.push({candidate, edge.to});
        }
    }

    for (long long value : distance) {
        if (value == infinity) {
            cout << "inf ";
        } else {
            cout << value << ' ';
        }
    }
    cout << '\n';
    return 0;
}
`,
  橋與割點: String.raw`#include <bits/stdc++.h>
using namespace std;

struct Edge {
    int to;
    int id;
};

vector<vector<Edge>> graph;
vector<int> discovery_time;
vector<int> low;
vector<bool> articulation;
vector<pair<int, int>> bridges;
int timer = 0;

void dfs(int node, int parent_edge) {
    discovery_time[node] = low[node] = ++timer;
    int child_count = 0;
    for (const Edge& edge : graph[node]) {
        if (edge.id == parent_edge) {
            continue;
        }
        if (discovery_time[edge.to] == 0) {
            ++child_count;
            dfs(edge.to, edge.id);
            low[node] = min(low[node], low[edge.to]);
            if (parent_edge != -1 && low[edge.to] >= discovery_time[node]) {
                articulation[node] = true;
            }
            if (low[edge.to] > discovery_time[node]) {
                bridges.push_back({node, edge.to});
            }
        } else {
            low[node] = min(low[node], discovery_time[edge.to]);
        }
    }
    if (parent_edge == -1 && child_count >= 2) {
        articulation[node] = true;
    }
}

int main() {
    int vertex_count, edge_count;
    cin >> vertex_count >> edge_count;
    graph.assign(vertex_count, {});
    for (int edge_index = 0; edge_index < edge_count; ++edge_index) {
        int left, right;
        cin >> left >> right;
        graph[left].push_back({right, edge_index});
        graph[right].push_back({left, edge_index});
    }
    discovery_time.assign(vertex_count, 0);
    low.assign(vertex_count, 0);
    articulation.assign(vertex_count, false);
    for (int vertex = 0; vertex < vertex_count; ++vertex) {
        if (discovery_time[vertex] == 0) {
            dfs(vertex, -1);
        }
    }

    cout << "articulation:";
    for (int vertex = 0; vertex < vertex_count; ++vertex) {
        if (articulation[vertex]) {
            cout << ' ' << vertex;
        }
    }
    cout << "\nbridges:";
    for (auto [left, right] : bridges) {
        cout << " (" << left << ',' << right << ')';
    }
    cout << '\n';
    return 0;
}
`,
  選擇衝突模型: String.raw`#include <bits/stdc++.h>
using namespace std;

class TwoSat {
public:
    explicit TwoSat(int variable_count)
        : graph_(variable_count * 2),
          reverse_graph_(variable_count * 2),
          assignment_(variable_count, false) {}

    void add_clause(int variable_a, bool value_a,
                    int variable_b, bool value_b) {
        int first = literal(variable_a, value_a);
        int second = literal(variable_b, value_b);
        add_implication(first ^ 1, second);
        add_implication(second ^ 1, first);
    }

    bool solve() {
        int node_count = static_cast<int>(graph_.size());
        vector<bool> visited(node_count, false);
        vector<int> order;
        for (int node = 0; node < node_count; ++node) {
            if (!visited[node]) {
                dfs_order(node, visited, order);
            }
        }
        vector<int> component(node_count, -1);
        int component_count = 0;
        reverse(order.begin(), order.end());
        for (int node : order) {
            if (component[node] == -1) {
                dfs_component(node, component_count++, component);
            }
        }
        for (int variable = 0; variable < static_cast<int>(assignment_.size());
             ++variable) {
            if (component[variable * 2] == component[variable * 2 + 1]) {
                return false;
            }
            assignment_[variable] =
                component[variable * 2] > component[variable * 2 + 1];
        }
        return true;
    }

    const vector<bool>& assignment() const {
        return assignment_;
    }

private:
    vector<vector<int>> graph_;
    vector<vector<int>> reverse_graph_;
    vector<bool> assignment_;

    int literal(int variable, bool value) const {
        return variable * 2 + (value ? 0 : 1);
    }

    void add_implication(int from, int to) {
        graph_[from].push_back(to);
        reverse_graph_[to].push_back(from);
    }

    void dfs_order(int node, vector<bool>& visited, vector<int>& order) {
        visited[node] = true;
        for (int next : graph_[node]) {
            if (!visited[next]) {
                dfs_order(next, visited, order);
            }
        }
        order.push_back(node);
    }

    void dfs_component(int node, int id, vector<int>& component) {
        component[node] = id;
        for (int next : reverse_graph_[node]) {
            if (component[next] == -1) {
                dfs_component(next, id, component);
            }
        }
    }
};

int main() {
    int variable_count, clause_count;
    cin >> variable_count >> clause_count;
    TwoSat solver(variable_count);
    for (int clause_index = 0; clause_index < clause_count; ++clause_index) {
        int first_variable, second_variable;
        int first_value, second_value;
        cin >> first_variable >> first_value >> second_variable >> second_value;
        solver.add_clause(first_variable, first_value != 0,
                          second_variable, second_value != 0);
    }
    if (!solver.solve()) {
        cout << "unsatisfiable\n";
        return 0;
    }
    for (bool value : solver.assignment()) {
        cout << static_cast<int>(value) << ' ';
    }
    cout << '\n';
    return 0;
}
`
};
