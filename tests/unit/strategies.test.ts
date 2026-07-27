import { describe, expect, it } from 'vitest';
import { strategyBeginnerMeta, strategyMiniTraces } from '@/lib/strategy-beginner';
import {
  strategyProblemCounts,
  strategyProblemKey,
  strategyProblemList,
  strategyProblemsForPage,
  strategyProblemsForTopic
} from '@/lib/strategy-problems';
import { strategyTopics } from '@/lib/strategy-topics';
import { navGroups, pageById, pageHref, readablePageCount, renderFragment, siblingPages } from '@/lib/strategies';

const topicIds = strategyTopics.map((topic) => topic.id);

describe('策略圖鑑主題註冊表', () => {
  it('registers the four merged topics', () => {
    expect(topicIds).toEqual(['greedy', 'dp', 'strings', 'ds']);
  });

  it('gives every topic exactly one home page plus readable chapters', () => {
    for (const topic of strategyTopics) {
      const homes = topic.pages.filter((page) => page.slug === null);
      expect(homes).toHaveLength(1);
      expect(homes[0]?.id).toBe('index');
      expect(readablePageCount(topic)).toBe(topic.pages.length - 1);
      // 首頁以外的每一頁都要同時有路由片段與內容片段，否則會產生無法渲染的路由。
      for (const page of topic.pages.filter((candidate) => candidate.id !== 'index')) {
        expect(page.slug, `${topic.id}/${page.id} 缺少 slug`).toBeTruthy();
        expect(page.fragment, `${topic.id}/${page.id} 缺少 fragment`).toBeTruthy();
        expect(page.nav, `${topic.id}/${page.id} 缺少側欄標題`).toBeTruthy();
      }
    }
  });

  it('keeps page ids and route slugs unique inside each topic', () => {
    for (const topic of strategyTopics) {
      const ids = topic.pages.map((page) => page.id);
      const slugs = topic.pages.map((page) => page.slug).filter(Boolean);
      expect(new Set(ids).size).toBe(ids.length);
      expect(new Set(slugs).size).toBe(slugs.length);
    }
  });

  it('resolves every cross-reference anchor to a page in the same topic', () => {
    for (const topic of strategyTopics) {
      for (const [anchor, target] of Object.entries(topic.anchors)) {
        const [targetId = ''] = target.split('#');
        expect(pageById(topic, targetId), `${topic.id} 的錨點 #${anchor} 指向不存在的頁面 ${targetId}`).toBeDefined();
      }
    }
  });

  it('lists every non-home page exactly once across the sidebar groups', () => {
    for (const topic of strategyTopics) {
      const listed = navGroups(topic).flatMap((group) => group.items.map((page) => page.id));
      const expected = topic.pages.filter((page) => page.id !== 'index').map((page) => page.id);
      expect(new Set(listed).size).toBe(listed.length);
      expect(listed.toSorted()).toEqual(expected.toSorted());
    }
  });

  it('walks previous and next links through the whole reading order', () => {
    for (const topic of strategyTopics) {
      const first = topic.pages[0];
      const last = topic.pages.at(-1);
      expect(siblingPages(topic, first!.id).previous).toBeUndefined();
      expect(siblingPages(topic, last!.id).next).toBeUndefined();
      for (const [index, page] of topic.pages.entries()) {
        const { previous, next } = siblingPages(topic, page.id);
        if (previous) expect(previous.id).toBe(topic.pages[index - 1]?.id);
        if (next) expect(next.id).toBe(topic.pages[index + 1]?.id);
      }
    }
  });

  it('builds routes under /strategies/', () => {
    const greedy = strategyTopics[0]!;
    expect(pageHref(greedy, pageById(greedy, 'index')!)).toBe('/strategies/greedy/');
    expect(pageHref(greedy, pageById(greedy, 's01')!)).toBe('/strategies/greedy/01-sorting/');
  });
});

describe('初學者導讀素材', () => {
  it('covers every topic', () => {
    for (const topic of strategyTopics) {
      const meta = strategyBeginnerMeta[topic.id];
      expect(meta, `${topic.id} 缺少初學者導讀`).toBeDefined();
      expect(meta!.errors.length).toBeGreaterThan(0);
      expect(meta!.refs.length).toBeGreaterThan(0);
      for (const [url] of meta!.refs) expect(url).toMatch(/^https?:\/\//);
    }
  });

  it('attaches mini traces only to pages that exist', () => {
    for (const key of Object.keys(strategyMiniTraces)) {
      const [topicId = '', pageId = ''] = key.split('/');
      const topic = strategyTopics.find((candidate) => candidate.id === topicId);
      expect(topic, `${key} 的主題不存在`).toBeDefined();
      expect(pageById(topic!, pageId), `${key} 的頁面不存在`).toBeDefined();
    }
  });
});

describe('策略題單', () => {
  it('matches the published counts', () => {
    expect(strategyProblemList).toHaveLength(strategyProblemCounts.rows);
    expect(new Set(strategyProblemList.map((problem) => problem.progress_id)).size).toBe(strategyProblemCounts.unique);
    expect(strategyProblemList.filter((problem) => problem.url).length).toBe(strategyProblemCounts.linked);
  });

  it('assigns every problem to a registered topic and existing strategy page', () => {
    for (const problem of strategyProblemList) {
      const topic = strategyTopics.find((candidate) => candidate.id === problem.topic);
      expect(topic, `${problem.progress_id} 的主題 ${problem.topic} 未註冊`).toBeDefined();
      expect(problem.topic_label).toBe(topic!.name);
      for (const location of problem.strategy_pages) {
        const page = pageById(topic!, location.page);
        expect(page, `${problem.progress_id} 指向不存在的章節 ${location.page}`).toBeDefined();
        expect(location.nav).toBe(page!.nav);
      }
    }
  });

  it('keeps a linked problem for every entry that names an online judge', () => {
    for (const problem of strategyProblemList) {
      if (problem.platform_label === '經典題型') {
        expect(problem.url).toBe('');
      } else {
        expect(problem.url, `${problem.progress_id} 缺少原題連結`).toMatch(/^https?:\/\//);
      }
    }
  });

  it('reuses one progress id when the same problem is taught from two angles', () => {
    const shared = new Map<string, Set<string>>();
    for (const problem of strategyProblemList) {
      const topics = shared.get(problem.progress_id) ?? new Set<string>();
      topics.add(problem.topic);
      shared.set(problem.progress_id, topics);
    }
    const crossTopic = [...shared.entries()].filter(([, topics]) => topics.size > 1);
    expect(crossTopic.length).toBeGreaterThan(0);
    // 共用 id 的用意就是讓進度同步；同一主題內不該出現重複條目。
    for (const [, topics] of shared) expect(topics.size).toBeLessThanOrEqual(strategyTopics.length);
  });

  it('normalizes cross-list keys so they can meet the《演算法競賽》problem list', () => {
    const byId = new Map(strategyProblemList.map((problem) => [problem.progress_id, problem]));
    expect(strategyProblemKey(byId.get('luogu-p1090')!)).toBe('luogu:p1090');
    expect(strategyProblemKey(byId.get('poj-1328')!)).toBe('poj:1328');
    expect(strategyProblemKey(byId.get('misc-01')!)).toBeNull();
  });

  it('groups problems by topic and by strategy page', () => {
    const perTopic = topicIds.map((id) => strategyProblemsForTopic(id).length);
    expect(perTopic.reduce((total, count) => total + count, 0)).toBe(strategyProblemCounts.rows);
    for (const id of topicIds) expect(strategyProblemCounts.byTopic[id]).toBe(strategyProblemsForTopic(id).length);
    expect(strategyProblemsForPage('greedy', 's01').map((problem) => problem.progress_id)).toContain('lc-455');
    expect(strategyProblemsForPage('greedy', 'does-not-exist')).toEqual([]);
  });
});

describe('內容片段渲染', () => {
  it('typesets TeX with KaTeX instead of leaving raw delimiters', async () => {
    const html = await renderFragment(strategyTopics[0]!, 's2-1');
    expect(html).toContain('class="katex"');
    expect(html).not.toContain('\\(');
    expect(html).not.toContain('katex-error');
  });

  it('highlights C++ blocks and leaves inline code untouched', async () => {
    const html = await renderFragment(strategyTopics[0]!, 's2-1');
    expect(html).toContain('strategy-code');
    expect(html).toContain('data-language="cpp"');
    // 與全站其他程式碼區塊一樣走 Astro 設定的 Shiki 主題。
    expect(html).toContain('astro-code github-dark-default');
    expect(html).not.toContain('<code class="lang-cpp">');
    // 行內程式碼原樣保留，數學排版不得滲入。
    expect(html).toContain('<code>');
  });

  it('rewrites in-topic, cross-topic, and problem-list links to site routes', async () => {
    const html = await renderFragment(strategyTopics[1]!, 's2-3');
    expect(html).not.toMatch(/href="#(s\d|problems|topic-)/);
    const dp = strategyTopics[1]!;
    for (const [anchor, target] of Object.entries(dp.anchors)) {
      if (!html.includes(`href="#${anchor}"`)) continue;
      expect(html).toContain(pageHref(dp, pageById(dp, target.split('#')[0]!)!));
    }
  });

  it('renders every registered fragment without leaking unresolved markup', async () => {
    for (const topic of strategyTopics) {
      for (const page of topic.pages) {
        if (!page.fragment) continue;
        const html = await renderFragment(topic, page.fragment);
        expect(html.length, `${topic.id}/${page.fragment} 內容為空`).toBeGreaterThan(0);
        expect(html, `${topic.id}/${page.fragment} 有未解析的錨點`).not.toMatch(/href="#(s\d|problems|topic-)/);
        expect(html, `${topic.id}/${page.fragment} 有殘留的 TeX 分隔符`).not.toContain('\\(');
        expect(html, `${topic.id}/${page.fragment} 有殘留的佔位符`).not.toMatch(/[\uE000\uE001]/);
      }
    }
  });

  it('fails loudly when a fragment is missing', async () => {
    await expect(renderFragment(strategyTopics[0]!, 'no-such-fragment')).rejects.toThrow(/找不到策略內容片段/);
  });
});
