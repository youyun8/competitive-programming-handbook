import { useEffect, useMemo, useState } from 'react';

export type VisualizerKind =
  | 'binary-search'
  | 'search'
  | 'union-find'
  | 'segment-tree'
  | 'lca'
  | 'dynamic-programming'
  | 'fast-power'
  | 'extended-gcd'
  | 'convex-hull'
  | 'kmp'
  | 'dijkstra'
  | 'max-flow';

interface VisualStep {
  values: string[];
  active: number[];
  done?: number[];
  status: string;
}

const scenarios: Record<VisualizerKind, { title: string; legend: string; steps: VisualStep[] }> = {
  'binary-search': {
    title: '二分搜尋：找第一個大於等於 7 的位置',
    legend: '藍框是目前搜尋區間；綠框是已確定不可能包含答案的位置。',
    steps: [
      {
        values: ['1', '3', '4', '7', '7', '9', '12'],
        active: [0, 1, 2, 3, 4, 5, 6],
        status: '初始化 [left, right) = [0, 7)。'
      },
      {
        values: ['1', '3', '4', '7', '7', '9', '12'],
        active: [3, 4, 5, 6],
        done: [0, 1, 2],
        status: 'mid = 3，a[mid] = 7，答案可能在 mid 或更左邊，因此 right = 3。'
      },
      {
        values: ['1', '3', '4', '7', '7', '9', '12'],
        active: [1, 2, 3],
        done: [0, 4, 5, 6],
        status: 'mid = 1，a[mid] = 3 < 7，因此 left = 2。'
      },
      {
        values: ['1', '3', '4', '7', '7', '9', '12'],
        active: [2, 3],
        done: [0, 1, 4, 5, 6],
        status: 'mid = 2，a[mid] = 4 < 7，因此 left = 3。'
      },
      {
        values: ['1', '3', '4', '7', '7', '9', '12'],
        active: [3],
        done: [0, 1, 2, 4, 5, 6],
        status: 'left = right = 3，找到第一個大於等於 7 的位置。'
      }
    ]
  },
  search: {
    title: 'BFS／DFS：相同圖，不同展開順序',
    legend: '節點列顯示 BFS 佇列的分層順序；切換步驟觀察 frontier。',
    steps: [
      {
        values: ['A', 'B', 'C', 'D', 'E', 'F'],
        active: [0],
        status: '從 A 開始，frontier = [A]。'
      },
      {
        values: ['A', 'B', 'C', 'D', 'E', 'F'],
        active: [1, 2],
        done: [0],
        status: 'BFS 展開 A，把同層鄰居 B、C 放入佇列。'
      },
      {
        values: ['A', 'B', 'C', 'D', 'E', 'F'],
        active: [2, 3, 4],
        done: [0, 1],
        status: '展開 B，新增 D、E；C 仍在佇列前方。'
      },
      {
        values: ['A', 'B', 'C', 'D', 'E', 'F'],
        active: [3, 4, 5],
        done: [0, 1, 2],
        status: '展開 C，新增 F；所有距離 1 的節點已處理。'
      },
      {
        values: ['A', 'B', 'C', 'D', 'E', 'F'],
        active: [],
        done: [0, 1, 2, 3, 4, 5],
        status: '依序完成 D、E、F。BFS 的完成順序按距離不遞減。'
      }
    ]
  },
  'union-find': {
    title: '並查集：合併集合與路徑壓縮',
    legend: '數字顯示 parent；藍框是本步存取的節點。',
    steps: [
      {
        values: ['0→0', '1→1', '2→2', '3→3', '4→4'],
        active: [],
        status: '每個節點一開始都是自己的代表。'
      },
      {
        values: ['0→0', '1→0', '2→2', '3→3', '4→4'],
        active: [0, 1],
        status: 'unite(0, 1)：把 1 的根接到 0。'
      },
      {
        values: ['0→0', '1→0', '2→0', '3→3', '4→4'],
        active: [0, 2],
        status: 'unite(1, 2)：先找根 0，再把 2 接到 0。'
      },
      {
        values: ['0→0', '1→0', '2→0', '3→3', '4→3'],
        active: [3, 4],
        status: 'unite(3, 4)：形成另一個集合。'
      },
      {
        values: ['0→0', '1→0', '2→0', '3→0', '4→0'],
        active: [0, 3, 4],
        done: [1, 2],
        status: 'unite(2, 4) 後 find(4) 做路徑壓縮，所有節點直接指向根 0。'
      }
    ]
  },
  'segment-tree': {
    title: '線段樹：區間和查詢',
    legend: '每格是被查詢 [2, 6) 完整覆蓋或需要繼續拆分的區間。',
    steps: [
      {
        values: ['[0,8)', '[0,4)', '[4,8)', '[0,2)', '[2,4)', '[4,6)', '[6,8)'],
        active: [0],
        status: '查詢 [2, 6)，根區間只有部分重疊，向下拆分。'
      },
      {
        values: ['[0,8)', '[0,4)', '[4,8)', '[0,2)', '[2,4)', '[4,6)', '[6,8)'],
        active: [1, 2],
        status: '左右子樹都與查詢範圍相交。'
      },
      {
        values: ['[0,8)', '[0,4)', '[4,8)', '[0,2)', '[2,4)', '[4,6)', '[6,8)'],
        active: [4, 5],
        done: [3, 6],
        status: '[2,4) 與 [4,6) 被完整覆蓋；另外兩段不相交。'
      },
      { values: ['sum=18'], active: [0], status: '合併兩個完整區間的答案，得到區間和 18。' }
    ]
  },
  lca: {
    title: 'LCA 倍增：同步提升兩個節點',
    legend: '以節點編號示意，藍框是目前位置。',
    steps: [
      {
        values: ['1', '2', '3', '4', '5', '6', '7'],
        active: [4, 6],
        status: '查詢 LCA(5, 7)，兩點深度相同。'
      },
      {
        values: ['1', '2', '3', '4', '5', '6', '7'],
        active: [1, 2],
        done: [4, 6],
        status: '從最大 2^k 往下試，5 與 7 的 2^0 祖先分別是 2、3，仍不同，兩者同時上跳。'
      },
      {
        values: ['1', '2', '3', '4', '5', '6', '7'],
        active: [0],
        done: [1, 2, 4, 6],
        status: '2 與 3 的父節點相同，該父節點 1 即為最近公共祖先。'
      }
    ]
  },
  'dynamic-programming': {
    title: '基礎 DP：由小狀態推到大狀態',
    legend: '以爬樓梯為例，dp[i] = dp[i-1] + dp[i-2]。',
    steps: [
      {
        values: ['1', '1', '?', '?', '?', '?'],
        active: [0, 1],
        status: '基底：dp[0] = 1，dp[1] = 1。'
      },
      {
        values: ['1', '1', '2', '?', '?', '?'],
        active: [0, 1, 2],
        status: 'dp[2] = dp[1] + dp[0] = 2。'
      },
      {
        values: ['1', '1', '2', '3', '?', '?'],
        active: [1, 2, 3],
        done: [0],
        status: 'dp[3] = dp[2] + dp[1] = 3。'
      },
      {
        values: ['1', '1', '2', '3', '5', '?'],
        active: [2, 3, 4],
        done: [0, 1],
        status: 'dp[4] = 5；只需要保留最近兩格即可做滾動陣列。'
      },
      {
        values: ['1', '1', '2', '3', '5', '8'],
        active: [3, 4, 5],
        done: [0, 1, 2],
        status: 'dp[5] = 8，所有狀態依賴都已在使用前算好。'
      }
    ]
  },
  'fast-power': {
    title: '模快速冪：拆解指數的二進位',
    legend: '計算 3^13 mod 17；每步檢查指數最低位。',
    steps: [
      {
        values: ['result=1', 'base=3', 'exp=13'],
        active: [2],
        status: '13 是奇數，把 base 乘進 result。'
      },
      {
        values: ['result=3', 'base=9', 'exp=6'],
        active: [1, 2],
        status: 'base 平方，exp 右移；6 是偶數，不更新 result。'
      },
      {
        values: ['result=3', 'base=13', 'exp=3'],
        active: [1, 2],
        status: '9² mod 17 = 13；3 是奇數。'
      },
      {
        values: ['result=5', 'base=16', 'exp=1'],
        active: [0, 1, 2],
        status: '3×13 mod 17 = 5；最後一位仍是 1。'
      },
      {
        values: ['result=12', 'base=1', 'exp=0'],
        active: [0],
        status: '5×16 mod 17 = 12，指數歸零，答案完成。'
      }
    ]
  },
  'extended-gcd': {
    title: '擴展歐幾里得：回代出裴蜀係數',
    legend: '求 30x + 18y = gcd(30,18)。',
    steps: [
      { values: ['30 = 1×18 + 12'], active: [0], status: '第一步取餘數 12。' },
      { values: ['18 = 1×12 + 6'], active: [0], status: '繼續取餘數 6。' },
      { values: ['12 = 2×6 + 0'], active: [0], status: 'gcd = 6，開始回代。' },
      { values: ['6 = 18 - 1×12'], active: [0], status: '把 6 寫成上一層兩數的線性組合。' },
      {
        values: ['6 = 2×18 - 1×30'],
        active: [0],
        status: '代入 12 = 30 - 18，得到 x = -1、y = 2。'
      }
    ]
  },
  'convex-hull': {
    title: '凸包：單調鏈維持左轉',
    legend: '點依 x、y 排序；綠色是已保留在下凸包的點。',
    steps: [
      {
        values: ['(0,0)', '(1,2)', '(2,1)', '(3,3)', '(4,0)'],
        active: [0],
        status: '排序後從最左點開始。'
      },
      {
        values: ['(0,0)', '(1,2)', '(2,1)', '(3,3)', '(4,0)'],
        active: [0, 1],
        status: '前兩點直接加入。'
      },
      {
        values: ['(0,0)', '(1,2)', '(2,1)', '(3,3)', '(4,0)'],
        active: [0, 1, 2],
        status: '加入 (2,1) 形成右轉，彈出中間點 (1,2)。'
      },
      {
        values: ['(0,0)', '(1,2)', '(2,1)', '(3,3)', '(4,0)'],
        active: [0, 2, 3],
        done: [1],
        status: '加入 (3,3) 維持左轉。'
      },
      {
        values: ['(0,0)', '(1,2)', '(2,1)', '(3,3)', '(4,0)'],
        active: [0, 4],
        done: [1, 2, 3],
        status: '處理 (4,0) 時連續右轉，彈出內部點；再反向建立上凸包。'
      }
    ]
  },
  kmp: {
    title: 'KMP：失配時沿 failure link 回退',
    legend: '模式 ABAAB 在文字 ABAABAAB 中搜尋。',
    steps: [
      {
        values: ['A', 'B', 'A', 'A', 'B', 'A', 'A', 'B'],
        active: [0],
        status: '從文字第 0 位與模式第 0 位開始。'
      },
      {
        values: ['A', 'B', 'A', 'A', 'B', 'A', 'A', 'B'],
        active: [0, 1, 2],
        status: '前三個字元 ABA 匹配。'
      },
      {
        values: ['A', 'B', 'A', 'A', 'B', 'A', 'A', 'B'],
        active: [0, 1, 2, 3],
        status: '第 3 位仍匹配 A，繼續前進。'
      },
      {
        values: ['A', 'B', 'A', 'A', 'B', 'A', 'A', 'B'],
        active: [0, 1, 2, 3, 4],
        status: '模式 ABAAB 完整出現於文字位置 0。'
      },
      {
        values: ['A', 'B', 'A', 'A', 'B', 'A', 'A', 'B'],
        active: [3, 4, 5, 6, 7],
        done: [0, 1, 2],
        status: '利用前綴函數，不回退文字指標，找到第二次出現於位置 3。'
      }
    ]
  },
  dijkstra: {
    title: 'Dijkstra：每次確定最短的未完成節點',
    legend: '格內是目前距離；綠框表示距離已定案。',
    steps: [
      {
        values: ['A:0', 'B:∞', 'C:∞', 'D:∞'],
        active: [0],
        status: '起點 A 距離為 0，放入優先佇列。'
      },
      {
        values: ['A:0', 'B:4', 'C:1', 'D:∞'],
        active: [1, 2],
        done: [0],
        status: '展開 A，鬆弛 A→B 與 A→C。'
      },
      {
        values: ['A:0', 'B:3', 'C:1', 'D:6'],
        active: [1, 3],
        done: [0, 2],
        status: 'C 的距離最小，定案 C；經 C 把 B 改成 3、D 改成 6。'
      },
      {
        values: ['A:0', 'B:3', 'C:1', 'D:4'],
        active: [3],
        done: [0, 1, 2],
        status: '定案 B，經 B 把 D 改成 4。'
      },
      {
        values: ['A:0', 'B:3', 'C:1', 'D:4'],
        active: [],
        done: [0, 1, 2, 3],
        status: 'D 定案；所有可達節點最短距離完成。'
      }
    ]
  },
  'max-flow': {
    title: 'Dinic 最大流：分層圖與阻塞流',
    legend: '格內顯示邊的流量／容量。',
    steps: [
      {
        values: ['S→A 0/3', 'S→B 0/2', 'A→T 0/2', 'B→T 0/3', 'A→B 0/1'],
        active: [0, 1],
        status: 'BFS 建立分層圖：S 在第 0 層，A、B 在第 1 層，T 在第 2 層。'
      },
      {
        values: ['S→A 2/3', 'S→B 0/2', 'A→T 2/2', 'B→T 0/3', 'A→B 0/1'],
        active: [0, 2],
        status: '沿 S→A→T 增廣 2，A→T 飽和。'
      },
      {
        values: ['S→A 2/3', 'S→B 2/2', 'A→T 2/2', 'B→T 2/3', 'A→B 0/1'],
        active: [1, 3],
        status: '沿 S→B→T 增廣 2，S→B 飽和。'
      },
      {
        values: ['S→A 3/3', 'S→B 2/2', 'A→T 2/2', 'B→T 3/3', 'A→B 1/1'],
        active: [0, 4, 3],
        status: '新一輪分層後沿 S→A→B→T 增廣 1。'
      },
      { values: ['max flow = 5'], active: [0], status: '殘量網路中 T 不再可達，最大流為 5。' }
    ]
  }
};

interface Props {
  kind: VisualizerKind;
}

export default function AlgorithmVisualizer({ kind }: Props) {
  const scenario = useMemo(() => scenarios[kind], [kind]);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const current = scenario.steps[step] ?? scenario.steps[0]!;

  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setStep((value) => {
        if (value >= scenario.steps.length - 1) {
          setPlaying(false);
          return value;
        }
        return value + 1;
      });
    }, 1200);
    return () => window.clearInterval(timer);
  }, [playing, scenario.steps.length]);

  return (
    <section className="visualizer" aria-labelledby={`${kind}-visualizer-title`}>
      <h2 id={`${kind}-visualizer-title`}>{scenario.title}</h2>
      <p>{scenario.legend}</p>
      <div className="visualizer-stage">
        <div className="visualizer-cells" aria-label="演算法狀態">
          {current.values.map((value, index) => (
            <span
              className={`visualizer-cell ${current.active.includes(index) ? 'active' : ''} ${
                current.done?.includes(index) ? 'done' : ''
              }`}
              key={`${value}-${index}`}
            >
              {value}
            </span>
          ))}
        </div>
        <p className="visualizer-status" aria-live="polite">
          步驟 {step + 1}/{scenario.steps.length}：{current.status}
        </p>
      </div>
      <div className="visualizer-controls" aria-label="視覺化控制">
        <button
          className="button secondary"
          type="button"
          onClick={() => {
            setStep(0);
            setPlaying(false);
          }}
          disabled={!hydrated}
        >
          重設
        </button>
        <button
          className="button secondary"
          type="button"
          onClick={() => setStep((value) => Math.max(0, value - 1))}
          disabled={!hydrated || step === 0}
        >
          上一步
        </button>
        <button
          className="button secondary"
          type="button"
          onClick={() => setStep((value) => Math.min(scenario.steps.length - 1, value + 1))}
          disabled={!hydrated || step === scenario.steps.length - 1}
        >
          下一步
        </button>
        <button className="button" type="button" onClick={() => setPlaying((value) => !value)} disabled={!hydrated}>
          {playing ? '暫停' : '播放'}
        </button>
      </div>
    </section>
  );
}

export { scenarios };
