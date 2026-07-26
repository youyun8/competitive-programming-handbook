---
id: luogu-p5331
volume: lower
source_file: lower-volume
original_label: '洛谷 P5331'
title: '洛谷 P5331 通信'
chapter: 10
section: '10.13'
kind: external-oj
difficulty: 5
topics: ['最小費用流', 'CDQ 分治優化建圖']
prerequisites: ['min-cost-flow']
statement: |-
  每站可付 W 直連中心，或連到某個更早且尚未被後站使用的站，代價為頻段差，求最小總費。
constraints:
  - '完整資料範圍以已核實的外部題面為準'
  - '所有容量、費用與答案依題意選用 long long，索引依題面處理'
input_format: '依外部原題格式讀入；本卡片解法與程式完整實作該格式。'
output_format: '依外部原題格式輸出答案；Special Judge 題輸出任一合法最優方案。'
samples:
  - input: |-
      6 7
      8 4 6 1 3 0
    output: |-
      23
    explanation: |-
      此範例已以本卡片的獨立 C++17 解法執行核對；數值題亦可用小規模枚舉或直接列舉方案驗算。
core_knowledge: ['最小費用流', 'CDQ 分治優化建圖']
judgment: |-
  樸素由每個後站向所有前站連 |a_i-a_j| 邊會有 O(n^2) 邊。
hints:
  - '先辨識核心轉換：最小費用流、CDQ 分治優化建圖。'
  - '樸素由每個後站向所有前站連 |a_i-a_j| 邊會有 O(n^2) 邊。'
  - '依「以站點供需建費用流；CDQ 處理右半到左半的連線，按頻段建立雙向差分鏈，把絕對值費用壓成 O(n log n) 邊。」實作，並特別檢查容量、反向邊、索引與輸出還原。'
solution_outline: |-
  以站點供需建費用流；CDQ 處理右半到左半的連線，按頻段建立雙向差分鏈，把絕對值費用壓成 O(n log n) 邊。
proof_or_invariant: |-
  每個後站到任一前站都在唯一某層跨越分治中有一條費用恰為絕對差的鏈路；容量一保證前站至多被使用一次。
common_errors:
  - '把有向邊、無向邊或殘量反向邊的容量方向建錯'
  - '使用 int 累加流量、費用或權值乘積而溢位'
  - '忽略空集合、無解、重邊、端點或 Special Judge 方案還原'
complexity:
  time: 'O(費用流於 O(n log n) 邊)'
  space: 'O(n log n)'
cpp_skeleton: |-
  #include <iostream>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：依卡片解法建立圖或狀態，完成增廣／動態規劃並輸出答案。
      return 0;
  }
cpp_solution: |-
  #if defined(__GNUC__)
  #pragma GCC diagnostic ignored "-Wconversion"
  #pragma GCC diagnostic ignored "-Wshadow"
  #pragma GCC diagnostic ignored "-Wunused-parameter"
  #pragma GCC diagnostic ignored "-Wunused-variable"
  #pragma GCC diagnostic ignored "-Wpedantic"
  #pragma GCC diagnostic ignored "-Wcomment"
  #pragma GCC diagnostic ignored "-Wsign-compare"
  #pragma GCC diagnostic ignored "-Wmisleading-indentation"
  #endif
  // P5331.cpp
  #include <bits/stdc++.h>

  using namespace std;

  const int MAX_N = 1e6 + 200, INF = 0x3f3f3f3f;
  typedef long long ll;

  int head[MAX_N], current, n, W, ai[MAX_N], start_pos, end_pos, flow[MAX_N], pre[MAX_N], ptot;
  int stk[MAX_N];
  ll dist[MAX_N];
  bool vis[MAX_N];

  struct edge
  {
      int to, nxt, weight, cost;
  } edges[MAX_N << 1];

  void addpath(int src, int dst, int weight, int cost)
  {
      edges[current].to = dst, edges[current].nxt = head[src];
      edges[current].weight = weight, edges[current].cost = cost;
      head[src] = current++;
  }

  void addtube(int src, int dst, int weight, int cost)
  {
      addpath(src, dst, weight, cost);
      addpath(dst, src, 0, -cost);
  }

  bool spfa()
  {
      memset(dist, 0x3f, sizeof(ll) * (ptot + 10)), memset(vis, false, sizeof(bool) * (ptot + 10));
      queue<int> q;
      q.push(start_pos), vis[start_pos] = true, dist[start_pos] = 0, flow[start_pos] = INF;
      while (!q.empty())
      {
          ll u = q.front();
          q.pop(), vis[u] = false;
          for (ll i = head[u]; i != -1; i = edges[i].nxt)
              if (edges[i].weight > 0 && dist[edges[i].to] > dist[u] + edges[i].cost)
              {
                  dist[edges[i].to] = dist[u] + edges[i].cost;
                  flow[edges[i].to] = min(flow[u], edges[i].weight);
                  pre[edges[i].to] = i;
                  if (!vis[edges[i].to])
                      vis[edges[i].to] = true, q.push(edges[i].to);
              }
      }
      return dist[end_pos] != 0x3f3f3f3f3f3f3f3f;
  }

  ll mcmf()
  {
      ll max_flow = 0, min_cost = 0;
      while (spfa())
      {
          ll p = end_pos, i = pre[end_pos];
          max_flow += flow[end_pos], min_cost += 1LL * flow[end_pos] * dist[end_pos];
          while (p != start_pos)
          {
              edges[i].weight -= flow[end_pos], edges[i ^ 1].weight += flow[end_pos];
              p = edges[i ^ 1].to, i = pre[p];
          }
      }
      return min_cost;
  }

  void solve(int l, int r)
  {
  	if (l == r)
  		return;
  	int mid = (l + r) >> 1, tot = 0;
  	solve(l, mid), solve(mid + 1, r);
  	for (int i = l; i <= r; i++)
  		stk[++tot] = ai[i];
  	sort(stk + 1, stk + 1 + tot), tot = unique(stk + 1, stk + 1 + tot) - stk - 1;
  	for (int i = 1; i < tot; i++)
  	{
  		addtube(ptot + i, ptot + i + 1, INF, stk[i + 1] - stk[i]);
  		addtube(ptot + i + 1, ptot + i, INF, stk[i + 1] - stk[i]);
  	}
  	for (int i = l; i <= r; i++)
  	{
  		int pos = lower_bound(stk + 1, stk + 1 + tot, ai[i]) - stk;
  		if (i <= mid)
  			addtube(ptot + pos, i + n, 1, 0);
  		else
  			addtube(i, ptot + pos, 1, 0);
  	}
  	ptot += tot;
  }

  int main()
  {
      memset(head, -1, sizeof(head));
      scanf("%d%d", &n, &W), start_pos = 2 * n + 1, end_pos = ptot = start_pos + 1;
  	for (int i = 1; i <= n; i++)
  		scanf("%d", &ai[i]), addtube(start_pos, i, 1, 0), addtube(i + n, end_pos, 1, 0), addtube(i, end_pos, 1, W);
  	solve(1, n);
      printf("%lld\n", mcmf());
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P5331
external_platform: '洛谷'
external_problem_id: 'P5331'
external_title: '通信'
external_relation: original
source_book_pages: [680, 683]
source_pdf_pages: [310, 313]
review_status: verified
---

題面與 I/O 已逐題對照外部原題或可信競賽存檔；解法採獨立敘述，不重製教材掃描內容。
