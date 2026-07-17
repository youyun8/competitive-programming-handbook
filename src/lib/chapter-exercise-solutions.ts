export interface ExerciseSolution {
  approach: string;
  correctness: string;
  complexity: string;
}

export const chapterExerciseSolutions: Record<string, ExerciseSolution> = {
  括號序列驗證: {
    approach:
      '由左到右掃描。遇到左括號就把字元與位置推入 stack；遇到右括號時，stack 不可為空且頂端種類必須配對，否則目前位置就是第一個錯誤。掃描結束後若 stack 非空，最早仍未配對的左括號就是錯誤。',
    correctness:
      'stack 依序保存尚未配對的左括號。右括號只能與最近的未配對左括號相配，因此每次檢查頂端既必要也充分。',
    complexity: '時間 O(n)，空間 O(n)。'
  },
  循環佇列: {
    approach:
      '配置容量為 capacity + 1 的陣列，以 head 指向隊首、tail 指向下一個寫入位置。head == tail 代表空；(tail + 1) % size == head 代表滿。push 與 pop 都只移動一個索引。',
    correctness:
      '保留一格不用可讓空與滿具有不同表示；索引每次取模，所以元素的邏輯順序跨越陣列尾端後仍保持不變。',
    complexity: '每個操作時間 O(1)，空間 O(capacity)。'
  },
  窗口極值: {
    approach:
      '分別維護遞增與遞減的索引 deque。加入 i 前先移除已離開窗口的隊首，再從隊尾刪掉被 a[i] 支配的候選；兩個隊首分別是窗口最小值與最大值。',
    correctness:
      '被刪除的隊尾比新元素更早離開窗口且數值更差，之後不可能成為答案；未被刪除的索引保持單調，隊首因此永遠是當前最優者。',
    complexity: '時間 O(n)，空間 O(k)。'
  },
  合併木材: {
    approach:
      '把所有長度放入小根堆。反覆取出最短的兩段，將其合併成本加入答案，再把長度和放回堆中。',
    correctness:
      '交換論證可證明，存在一個最優合併樹讓兩個最小權重成為最深的一對兄弟；先合併它們後，剩餘問題仍是同型的較小問題。',
    complexity: '時間 O(n log n)，空間 O(n)。'
  },
  第一個可行答案: {
    approach:
      '使用半開區間 [left, right)，維持 left 左側皆不可行、right 及其右側皆可行。取 mid；若可行就令 right = mid，否則令 left = mid + 1，直到兩端相等。',
    correctness:
      '單調性保證每次排除的一半不含第一個可行答案；迴圈結束時候選只剩 left，它就是最小可行值。',
    complexity: '若判定成本為 T，時間 O(T log R)，空間 O(1)。'
  },
  區間總和: {
    approach:
      '一維令 prefix[i] 為前 i 個數之和，區間 [l,r) 為 prefix[r]-prefix[l]。二維則建立矩形前綴和，查詢時以四個角做容斥。',
    correctness:
      '前綴差會保留查詢區間並消去其左側；二維容斥先加右下前綴，再扣除上方與左方，最後補回被扣兩次的左上區域。',
    complexity: '預處理 O(n) 或 O(hw)，每次查詢 O(1)，空間同預處理大小。'
  },
  靜態RMQ: {
    approach:
      '預先計算 table[level][i]，表示從 i 開始、長度 2^level 的最小值。查詢長度 len 時取 level=floor(log2(len))，合併左右兩個長度 2^level 的區間。',
    correctness: '兩個冪次區間覆蓋完整查詢範圍；min 具有冪等性，即使中間重疊也不影響答案。',
    complexity: '預處理 O(n log n)，查詢 O(1)，空間 O(n log n)。'
  },
  逆序對: {
    approach:
      '用合併排序分割序列。合併兩個已排序區間時，若右半元素先被取出，它會與左半所有尚未取出的元素形成逆序對。',
    correctness:
      '逆序對只分成完全位於左半、完全位於右半、跨越兩半三類；遞迴計算前兩類，合併步驟恰好計算第三類。',
    complexity: '時間 O(n log n)，額外空間 O(n)。'
  },
  網格連通塊: {
    approach: '逐格掃描；遇到尚未造訪的可走格就啟動一次 BFS/DFS，標記同一塊內所有格並累計面積。',
    correctness:
      '一次 flood fill 會沿所有合法相鄰邊走到且只走到同一連通塊；外層掃描因此每個連通塊恰好啟動一次。',
    complexity: '時間 O(hw)，空間 O(hw)。'
  },
  無權最短路: {
    approach:
      '從起點 BFS，在節點第一次入隊時設定 distance 與 parent。到達終點後沿 parent 反向走回起點，再反轉得到路徑。',
    correctness:
      'BFS 按距離層遞增展開，所以節點第一次被發現時已使用最少邊數；parent 保存的正是該最短路徑上的前一點。',
    complexity: '時間 O(V+E)，空間 O(V)。'
  },
  零一邊權: {
    approach:
      '使用 deque 做鬆弛。權重 0 的改善節點放前端，權重 1 的改善節點放後端，使待處理距離保持不下降。',
    correctness:
      '從目前最小距離 d 出發只會產生 d 或 d+1；前推零權、後推一權等價於此特例上的 Dijkstra 排序。',
    complexity: '時間 O(V+E)，空間 O(V)。'
  },
  雙向密碼鎖: {
    approach:
      '從起點與終點各維護距離表，每輪展開 frontier 較小的一側。新狀態若已被另一側看見，就以兩側距離和更新答案。',
    correctness:
      '所有合法操作可逆，因此任一完整路徑都可在某個狀態分成兩段；按層擴展保證首次最短交會給出最少步數。',
    complexity: '最壞仍與狀態數線性，典型搜尋深度由 d 降為約 d/2。'
  },
  動態連通性: {
    approach:
      '以並查集保存每個集合代表。find 使用路徑壓縮，union 依大小或秩把較小樹接到較大樹；兩點代表相同即連通。',
    correctness:
      '每次 union 只合併指定的兩個等價類，不會拆散既有關係；find 回傳唯一代表，因此代表相等恰等價於同集合。',
    complexity: 'm 次操作為 O(m α(n))，空間 O(n)。'
  },
  區間和: {
    approach:
      '只有點更新與區間和時用 Fenwick Tree：add 更新涵蓋該點的 lowbit 區塊，prefix_sum 向前累加；區間和是兩個前綴差。',
    correctness:
      'Fenwick 的查詢路徑把前綴拆成互斥的二進位區塊，更新路徑則恰好修改所有包含該點的區塊摘要。',
    complexity: '建構 O(n log n)，更新與查詢 O(log n)，空間 O(n)。'
  },
  區間加與區間和: {
    approach:
      '線段樹節點保存區間和與 lazy 加值。整段被覆蓋時直接增加 sum += delta*length 並累加標記；部分覆蓋前先下推，再遞迴並向上合併。',
    correctness:
      '節點 sum 永遠已反映自己的 lazy；下推只把同一更新分配給兩個子區間，所以任何查詢合併出的值都等於真實區間和。',
    complexity: '建構 O(n)，每次更新或查詢 O(log n)，空間 O(n)。'
  },
  樹上路徑查詢: {
    approach:
      '先計算 parent、depth、subtree_size 與 heavy_child，再把重鏈連續編號。查詢 u-v 時反覆處理較深鏈頂到 u 的區間，最後處理同鏈上的剩餘段。',
    correctness:
      '每次跨越一條輕邊都完整取走一段不重疊的路徑；同鏈最後一段補齊中間部分，因此所有路徑節點恰好被涵蓋一次。',
    complexity: '分解 O(n)，搭配線段樹每次路徑操作 O(log² n)。'
  },
  最長遞增子序列: {
    approach:
      '維護 tails[len] 為長度 len+1 的遞增子序列可達到的最小尾值。對每個值以 lower_bound 找第一個不小於它的位置並替換，若不存在就延長。',
    correctness:
      '較小尾值至少保有原尾值的所有延伸可能；tails 的長度只在確實找到更長遞增子序列時增加。',
    complexity: '時間 O(n log n)，空間 O(n)。'
  },
  '0/1與完全背包': {
    approach:
      '令 dp[c] 為容量 c 的最佳值。0/1 背包容量由大到小更新，避免同一物品重用；完全背包由小到大更新，允許本輪新狀態再次使用該物品。',
    correctness:
      '更新方向控制轉移依賴的是上一輪還是本輪狀態，分別精確對應每件最多一次與可用任意次。',
    complexity: '時間 O(nC)，空間 O(C)。'
  },
  石子合併: {
    approach:
      '令 dp[l][r] 為合併區間 [l,r] 的最小成本，按區間長度遞增計算，枚舉最後切點 k，轉移為兩側成本加整段石子總和。',
    correctness:
      '任何最後一次合併都把區間分成兩個已各自合併完成的連續部分；枚舉所有切點即涵蓋所有方案，取最小得到最優解。',
    complexity: '時間 O(n³)，空間 O(n²)。'
  },
  樹上選點: {
    approach:
      '把樹定根，令 dp[u][k] 為 u 子樹選 k 點的最佳值。DFS 回程時逐個合併兒子的背包，枚舉目前已選數與兒子貢獻數。',
    correctness: '不同兒子子樹互不相交；固定總選點數時，所有分配方式都會在背包合併中被枚舉。',
    complexity: '典型為 O(nK²)，空間 O(nK)，可依子樹大小縮小迴圈。'
  },
  模快速冪: {
    approach:
      '先把 base 正規化到 [0,mod)。維持 result*base^exponent 與原目標同餘；指數為奇數時乘入 result，之後 base 平方、指數除以二。乘法可能溢位時使用 __int128。',
    correctness:
      '奇數情況抽出一個 base，偶數情況用 base^(2q)=(base²)^q；每輪都保持不變量，指數歸零時 result 即答案。',
    complexity: '時間 O(log exponent)，空間 O(1)。'
  },
  線性同餘: {
    approach:
      '將 ax≡b (mod m) 改寫為 ax+my=b。用 extended_gcd 求 g=gcd(a,m) 及係數；若 g 不整除 b 則無解，否則縮放係數並對 m/g 正規化。',
    correctness: 'Bézout 等式可生成 b 當且僅當 g|b；縮放後得到一組解，而所有解相差 m/g。',
    complexity: '時間 O(log min(a,m))，空間依實作為 O(1) 或遞迴深度。'
  },
  質因數批次查詢: {
    approach:
      '線性篩同時保存每個數的最小質因數。分解 x 時反覆取 spf[x] 並除盡，即可得到質因數與次方。',
    correctness:
      '篩法讓每個合數由其最小質因數唯一生成一次；分解時每一步移除一個已證實的質因數，直到剩下 1。',
    complexity: '預處理 O(N)，單次分解 O(log x)，空間 O(N)。'
  },
  固定長度最短路: {
    approach:
      '建立 min-plus 矩陣 A，A[i][j] 是一條邊的成本。min-plus 乘法以 min 取代加法、加法取代乘法；快速計算 A^k。',
    correctness:
      '矩陣乘法枚舉路徑在中間點的切分，因此 A^k[i][j] 恰為使用 k 條邊的最小成本；快速冪只重新括號化相同乘積。',
    complexity: '樸素矩陣乘法下時間 O(V³ log k)，空間 O(V²)。'
  },
  Pascal三角形: {
    approach: '使用 C(n,k)=C(n-1,k-1)+C(n-1,k)，邊界 C(n,0)=C(n,n)=1，逐列計算到需要的 n。',
    correctness:
      '依指定元素是否被選，把所有 k 元子集合分成包含與不包含該元素兩個互斥且完備的類別。',
    complexity: '計算完整三角形到 n 為 O(n²) 時間與 O(n²) 空間；只留上一列可降為 O(n)。'
  },
  鴿巢前綴和: {
    approach:
      '計算前綴和 modulo m。若某前綴餘數為 0 即得到答案；否則 m 個以上前綴落入 m-1 個非零餘數，必有兩個相同，其差對 m 整除。',
    correctness:
      '兩個同餘前綴的差正是中間連續區間和，且餘數相減為 0；鴿巢原理保證指定數量下必然存在。',
    complexity: '時間 O(n)，空間 O(m) 或 O(n)。'
  },
  受限排列: {
    approach: '先用無限制排列數計數，再把違反各限制的集合視為事件，枚舉事件子集合並依奇偶做容斥。',
    correctness:
      '每個合法排列不屬於任何壞事件，權重總和為 1；任何至少違反一項的排列，其所屬壞事件子集權重和為 0。',
    complexity: '若有 r 個限制，典型時間 O(2^r·poly(r))。'
  },
  Nim合併遊戲: {
    approach:
      '把每個互不影響的子遊戲轉成 Sprague-Grundy 值；普通 Nim 的單堆 SG 值就是石子數，合併遊戲的 SG 為所有子遊戲 SG 的 xor。',
    correctness:
      'xor 為 0 的局面任何一步都會變成非 0；xor 非 0 時可選一個子遊戲把總 xor 變成 0，因此它們分別是必敗與必勝局面。',
    complexity: 'Nim 判定時間 O(n)，空間 O(1)。'
  },
  線段相交: {
    approach:
      '先用包圍盒判斷投影是否重疊，再計算兩端點相對另一線段的叉積方向；兩組方向乘積皆不大於 0 時相交，並明確納入共線端點。',
    correctness:
      '非共線時，兩線段互相跨越對方所在直線正是相交條件；共線時則由包圍盒重疊判定是否共享點。',
    complexity: '每對線段時間 O(1)，空間 O(1)。'
  },
  多邊形面積: {
    approach: '依邊界順序累加 cross(p[i],p[i+1])，最後取絕對值除以二；若只需兩倍面積就保留整數。',
    correctness:
      '每條有向邊與原點形成的三角形帶符號面積相加，內部重疊部分互相消去，只留下多邊形面積。',
    complexity: '時間 O(n)，空間 O(1)。'
  },
  凸包周長: {
    approach:
      '先按座標排序去重。分別建立下凸包與上凸包；加入新點時，只要最後三點不維持指定轉向就彈出中間點。合併後累加相鄰距離。',
    correctness:
      '被彈出的點位於目前邊界內側或共線中間，不可能是必要頂點；掃描完成時上下鏈包含所有極端點且保持凸性。',
    complexity: '排序主導，時間 O(n log n)，空間 O(n)。'
  },
  最遠點對: {
    approach:
      '先求凸包，再用 rotating calipers。對每條凸包邊，單調移動對踵點直到三角形面積不再增加，檢查相關端點距離。',
    correctness:
      '最遠點對一定是凸包頂點；凸多邊形上對固定邊的面積隨頂點先增後減，因此對踵索引可單調前進且不漏掉候選。',
    complexity: '含凸包為 O(n log n)，凸包上的掃描為 O(h)。'
  },
  前綴函數: {
    approach:
      '令 pi[i] 為 s[0..i] 的最長真前綴且也是後綴的長度。失配時反覆令 j=pi[j-1]，匹配後增加 j。',
    correctness:
      '任何較短可行邊界必是目前邊界的邊界；沿 pi 鏈回退會依長度遞減枚舉所有候選，因此第一個匹配者就是最長者。',
    complexity: '時間 O(n)，空間 O(n)。'
  },
  字典統計: {
    approach:
      'Trie 節點保存各字元轉移、經過次數與結尾次數。插入沿字元建立節點並更新計數；查詢前綴走到對應節點後讀取經過次數。',
    correctness:
      '每個字串在 Trie 中對應唯一根到節點路徑，共同前綴共享同一路徑，所以節點計數恰等於具有該前綴的字串數。',
    complexity: '每次操作 O(字串長度)，空間 O(所有字串總長)。'
  },
  多模式匹配: {
    approach:
      '先建立 Trie，再用 BFS 建 failure link，缺失轉移沿 failure 補齊。掃描文本時只做一次自動機轉移，並沿輸出資訊統計匹配。',
    correctness:
      'failure 指向目前字串最長的可用真後綴；失配後它保留所有仍可能匹配的模式前綴，因此不會漏掉任何結尾位置。',
    complexity: '建構 O(模式總長·字元轉移成本)，掃描 O(文本長+輸出量)。'
  },
  不同子字串數: {
    approach:
      '逐字元擴充 suffix automaton。每個狀態代表一組 endpos 相同的子字串；其新增不同子字串數為 len[state]-len[link[state]]，累加所有非初始狀態。',
    correctness:
      '狀態涵蓋的子字串長度恰為 (len(link), len]，不同狀態的 endpos 類別互斥；分段長度總和因此恰好計數每個不同子字串一次。',
    complexity: '固定字元集下時間 O(n)，空間 O(n)。'
  },
  字典序拓撲排序: {
    approach:
      '計算入度，把所有入度 0 的點放入小根堆。每次取編號最小者輸出，刪除其出邊並把新出現的入度 0 點加入堆。',
    correctness:
      '入度 0 的點都可安全放在目前位置；取其中最小者使第一個可不同的位置最小，反覆套用即得到字典序最小拓撲序。',
    complexity: '時間 O((V+E) log V)，空間 O(V+E)。'
  },
  單源最短路: {
    approach:
      '先依邊權選演算法：全為 1 用 BFS、只有 0/1 用 deque、非負權用 Dijkstra、可能有負權則用 Bellman-Ford 或其他具相應保證的方法。',
    correctness:
      '核心是只在演算法的定案前提成立時鎖定距離；所有方法都以鬆弛維持 dist[v] 是目前已知路徑的最小成本。',
    complexity: 'BFS/0-1 BFS 為 O(V+E)；二元堆 Dijkstra 為 O((V+E) log V)。'
  },
  橋與割點: {
    approach:
      'DFS 記錄 dfn 與 low。樹邊 u-v 若 low[v]>dfn[u] 則為橋；非根 u 若存在 low[v]>=dfn[u] 的兒子則為割點，根則需至少兩個 DFS 兒子。無向圖要以 edge_id 排除父邊。',
    correctness:
      'low[v] 是 v 子樹不經父邊可到達的最早祖先；上述不等式正好表示子樹沒有繞回 u 上方或 u 本身的替代路徑。',
    complexity: '時間 O(V+E)，空間 O(V+E)。'
  },
  選擇衝突模型: {
    approach:
      '每個布林變數建立真、假兩個節點。限制轉成蘊含邊，例如 (a∨b) 加入 ¬a→b 與 ¬b→a；求 SCC，變數與其否定同 SCC 則無解，否則依 SCC 拓撲序取值。',
    correctness:
      '每條蘊含邊表達原子句的必要條件；同一 SCC 內命題互相推出，若同時含 x 與 ¬x 就矛盾，否則縮點 DAG 的逆拓撲賦值滿足所有蘊含。',
    complexity: '時間 O(V+E)，空間 O(V+E)。'
  }
};
