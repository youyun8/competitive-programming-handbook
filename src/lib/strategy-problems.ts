import strategyProblems from '../../data/strategy-problems.json';
import { problemKey } from './problem-list';

export interface StrategyProblemPage {
  /** 策略章節的頁面 id。 */
  page: string;
  /** 側欄短標題，例如「2.4 反悔貪心」。 */
  nav: string;
}

export interface StrategyProblem {
  /** 練習進度的 key；同一題從不同策略角度收錄時刻意共用。 */
  progress_id: string;
  title: string;
  topic: string;
  topic_label: string;
  platform: string;
  platform_label: string;
  /** 該平臺的題號；沒有線上判題連結的概念題為空字串。 */
  problem_id: string;
  url: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  tags: string[];
  idea: string;
  strategy_pages: StrategyProblemPage[];
}

export const strategyProblemSource = strategyProblems.source;

export const strategyProblemList = strategyProblems.items as StrategyProblem[];

export const strategyProblemTags = [...new Set(strategyProblemList.flatMap((problem) => problem.tags))].sort((a, b) =>
  a.localeCompare(b, 'zh-Hant')
);

export const strategyProblemPlatforms = [...new Set(strategyProblemList.map((problem) => problem.platform_label))].sort(
  (a, b) => a.localeCompare(b, 'zh-Hant')
);

export const strategyProblemCounts = {
  rows: strategyProblems.counts.rows,
  unique: strategyProblems.counts.unique_problems,
  linked: strategyProblems.counts.linked,
  byTopic: strategyProblemList.reduce<Record<string, number>>((totals, problem) => {
    totals[problem.topic] = (totals[problem.topic] ?? 0) + 1;
    return totals;
  }, {})
};

/** 依策略章節分組，供各章節頁面列出自己的題目。 */
const byPage = new Map<string, StrategyProblem[]>();
for (const problem of strategyProblemList) {
  for (const location of problem.strategy_pages) {
    const key = `${problem.topic}/${location.page}`;
    const bucket = byPage.get(key) ?? [];
    bucket.push(problem);
    byPage.set(key, bucket);
  }
}

export function strategyProblemsForPage(topicId: string, pageId: string) {
  return byPage.get(`${topicId}/${pageId}`) ?? [];
}

export function strategyProblemsForTopic(topicId: string) {
  return strategyProblemList.filter((problem) => problem.topic === topicId);
}

/**
 * 與《演算法競賽》題單交叉比對用的 key，兩份題單共用 problem-list 的正規化規則，
 * 因此同一道題在兩邊會對到同一個值。沒有題號的概念題不參與比對。
 */
export function strategyProblemKey(problem: StrategyProblem) {
  return problem.problem_id ? problemKey(problem.platform_label, problem.problem_id) : null;
}

export const strategyProblemsByKey = new Map<string, StrategyProblem[]>();
for (const problem of strategyProblemList) {
  const key = strategyProblemKey(problem);
  if (!key) continue;
  const bucket = strategyProblemsByKey.get(key) ?? [];
  bucket.push(problem);
  strategyProblemsByKey.set(key, bucket);
}
