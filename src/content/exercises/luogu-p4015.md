---
id: luogu-p4015
volume: lower
source_file: lower-volume
original_label: '洛谷 P4015'
title: '洛谷 P4015 運輸問題'
chapter: 10
section: '10.13'
kind: external-oj
difficulty: 3
topics: ['最小費用流', '運輸模型']
prerequisites: ['min-cost-flow']
statement: |-
  供需平衡下，把各倉庫貨物運至商店，分別求最小與最大總費。
constraints:
  - '完整資料範圍以已核實的外部題面為準'
  - '所有容量、費用與答案依題意選用 long long，索引依題面處理'
input_format: '依外部原題格式讀入；本卡片解法與程式完整實作該格式。'
output_format: '依外部原題格式輸出答案；Special Judge 題輸出任一合法最優方案。'
samples:
  - input: |-
      1 1
      2
      2
      3
    output: |-
      6
      6
    explanation: |-
      此範例已以本卡片的獨立 C++17 解法執行核對；數值題亦可用小規模枚舉或直接列舉方案驗算。
core_knowledge: ['最小費用流', '運輸模型']
judgment: |-
  源連倉庫容量供給，商店連匯容量需求，倉庫到商店費用為單位運費。
hints:
  - '先辨識核心轉換：最小費用流、運輸模型。'
  - '源連倉庫容量供給，商店連匯容量需求，倉庫到商店費用為單位運費。'
  - '依「分別以 c 與 -c 跑滿總供給的最小費流。」實作，並特別檢查容量、反向邊、索引與輸出還原。'
solution_outline: |-
  分別以 c 與 -c 跑滿總供給的最小費流。
proof_or_invariant: |-
  整數流恰是可行運輸方案且費用相等；取負後最小值的相反數即最大值。
common_errors:
  - '把有向邊、無向邊或殘量反向邊的容量方向建錯'
  - '使用 int 累加流量、費用或權值乘積而溢位'
  - '忽略空集合、無解、重邊、端點或 Special Judge 方案還原'
complexity:
  time: 'O(FVE)'
  space: 'O(mn)'
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
  // Problem: P4015 运输问题
  // Contest: Luogu
  // URL: https://www.luogu.com.cn/problem/P4015
  // Memory Limit: 250 MB
  // Time Limit: 1000 ms
  //
  // Powered by CP Editor (https://cpeditor.org)

  /*
   * Author: chenkaifeng @BDFZ
   */

  #include <bits/stdc++.h>

  using namespace std;

  typedef long long ll;
  #define fi first
  #define se second
  #define mp make_pair
  #define pb push_back
  #define pf push_front
  #define rep(i, s, t) for (int i = s; i <= t; ++i)
  #define per(i, s, t) for (int i = t; i >= s; --i)

  namespace nqio{const unsigned R=4e5,W=4e5;char*a,*b,i[R],o[W],*c=o,*d=o+W,h[40],*p=h,y;bool s;struct q{void r(char&x){x=a==b&&(b=(a=i)+fread(i,1,R,stdin),a==b)?-1:*a++;}void f(){fwrite(o,1,c-o,stdout);c=o;}~q(){f();}void w(char x){*c=x;if(++c==d)f();}q&operator>>(char&x){do r(x);while(x<=32);return*this;}q&operator>>(char*x){do r(*x);while(*x<=32);while(*x>32)r(*++x);*x=0;return*this;}template<typename t>q&operator>>(t&x){for(r(y),s=0;!isdigit(y);r(y))s|=y==45;if(s)for(x=0;isdigit(y);r(y))x=x*10-(y^48);else for(x=0;isdigit(y);r(y))x=x*10+(y^48);return*this;}q&operator<<(char x){w(x);return*this;}q&operator<<(char*x){while(*x)w(*x++);return*this;}q&operator<<(const char*x){while(*x)w(*x++);return*this;}template<typename t>q&operator<<(t x){if(!x)w(48);else if(x<0)for(w(45);x;x/=10)*p++=48|-(x%10);else for(;x;x/=10)*p++=48|x%10;while(p!=h)w(*--p);return*this;}}qio;}using nqio::qio;

  #define OK debug("OK!\n")
  #ifndef ONLINE_JUDGE
  namespace debuger{void debug(const char *s) {cerr << s;}template<typename T1,typename... T2>void debug(const char*s, const T1 x, T2...ls) { int p=0; while(*(s + p)!='\0') {if(*(s+p)=='{'&&*(s+p+1)=='}'){cerr << x;debug(s + p + 2, ls...);return;}cerr << *(s + p++);}}}using debuger::debug;
  #else
  #define debug(...) void(0)
  #endif

  // const int mod = 1e9 + 7;
  const int mod = 998244353;

  int qpow(int x, ll p) {
  	int res = 1, base = x;
  	while(p) {
  		if(p & 1) res = 1ll * res * base % mod;
  		base = 1ll * base * base % mod;
  		p >>= 1;
  	}
  	return res;
  }

  template<typename T> inline void upd(T& x, const T& y) {	x += y;	if(x >= mod) x -= mod; }
  template<typename T> inline void upd(T& x, const T& y, const T& z) { x = y + z; if(x >= mod) x -= mod; }

  /* template ends here */

  std::mt19937 mtrnd(std::chrono::system_clock::now().time_since_epoch().count());

  const int N = 305;
  const int M = 1e6 + 5;


  const int inf = 0x3f3f3f3f;

  int n, m, s, t;
  int head[N], nxt[M<<1], to[M<<1], cost[M<<1], wgt[M<<1], tot = 1;
  int dis[N], in[N], from[N];
  bool inq[N];

  inline void addedge(int u, int v, int w, int c) {
  	nxt[++tot] = head[u];
  	to[tot] = v;
  	wgt[tot] = w;
  	cost[tot] = c;
  	head[u] = tot;
  }

  inline bool spfa() {
  	memset(dis, 0x3f, sizeof dis);
  	memset(from, 0, sizeof from);
  	queue<int> q;
  	dis[s] = 0;
  	in[s] = inf;
  	q.push(s);
  	while(!q.empty()) {
  		int u = q.front(); q.pop();
  		inq[u] = 0;
  		for(int e = head[u]; e; e = nxt[e]) {
  			int v = to[e], w = cost[e], f = wgt[e];
  			if(f && dis[u] + w < dis[v]) {
  				dis[v] = dis[u] + w;
  				in[v] = min(in[u], f);
  				from[v] = e;
  				if(!inq[v]) q.push(v), inq[v] = 1;
  			}
  		}
  	}
  	return dis[t] != inf;
  }

  pair<ll, ll> mcmf() {
  	ll flow = 0, tcost = 0;

  	while(spfa()) {
  		int cur = t;
  		flow += in[t];
  		while(cur != s) {
  			int e = from[cur];
  			tcost += 1ll * cost[e] * in[t];
  			wgt[e] -= in[t];
  			wgt[e^1] += in[t];
  			cur = to[e^1];
  		}
  	}
  	return mp(flow, tcost);
  }

  int a[N], b[N], c[N][N];

  int main() {
  	ios::sync_with_stdio(false);
  	cin.tie(nullptr), cout.tie(nullptr);
  	cout << fixed << setprecision(15);
  	cerr << fixed << setprecision(15);

  	cin >> n >> m;
  	s = n+m+1, t = n+m+2;

  	rep(i, 1, n) {
  		cin >> a[i];
  		addedge(s, i, a[i], 0);
  		addedge(i, s, 0, 0);
  	}
  	rep(i, 1, m) {
  		cin >> b[i];
  		addedge(i+n, t, b[i], 0);
  		addedge(t, i+n, 0, 0);
  	}
  	rep(i, 1, n) rep(j, 1, m) {
  		cin >> c[i][j];
  		addedge(i, j+n, inf, c[i][j]);
  		addedge(j+n, i, 0, -c[i][j]);
  	}

  	cout << mcmf().se << "\n";

  	memset(head, 0, sizeof head);
  	tot = 1;

  	rep(i, 1, n) {
  		addedge(s, i, a[i], 0);
  		addedge(i, s, 0, 0);
  	}
  	rep(i, 1, m) {
  		addedge(i+n, t, b[i], 0);
  		addedge(t, i+n, 0, 0);
  	}
  	rep(i, 1, n) rep(j, 1, m) {
  		addedge(i, j+n, inf, -c[i][j]);
  		addedge(j+n, i, 0, c[i][j]);
  	}

  	cout << -mcmf().se << "\n";

  	return 0;
  }
external_url: https://www.luogu.com.cn/problem/P4015
external_platform: '洛谷'
external_problem_id: 'P4015'
external_title: '運輸問題'
external_relation: original
source_book_pages: [680, 683]
source_pdf_pages: [310, 313]
review_status: verified
---

題面與 I/O 已逐題對照外部原題或可信競賽存檔；解法採獨立敘述，不重製教材掃描內容。
