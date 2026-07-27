import { createShikiHighlighter } from '@astrojs/markdown-remark/shiki';
import katex from 'katex';
import { strategyTopics, type StrategyPage, type StrategyTopic } from './strategy-topics';
import { withBase } from './site';

export type { StrategyPage, StrategyTopic };
export { strategyTopics };

// 內容片段在建置時就內嵌進來；打包後模組位置會改變，不能在執行期讀檔。
const fragmentSources = import.meta.glob('../content/strategies/*/*.html', {
  query: '?raw',
  import: 'default',
  eager: true
}) as Record<string, string>;

function fragmentSource(topicId: string, fragment: string) {
  const source = fragmentSources[`../content/strategies/${topicId}/${fragment}.html`];
  if (source === undefined) {
    throw new Error(`找不到策略內容片段：src/content/strategies/${topicId}/${fragment}.html`);
  }
  return source;
}

export const topicById = new Map(strategyTopics.map((topic) => [topic.id, topic]));

export function pageById(topic: StrategyTopic, id: string) {
  return topic.pages.find((page) => page.id === id);
}

export function strategyHref(topicId: string, slug?: string | null) {
  return withBase(slug ? `/strategies/${topicId}/${slug}/` : `/strategies/${topicId}/`);
}

export function pageHref(topic: StrategyTopic, page: StrategyPage) {
  return strategyHref(topic.id, page.slug);
}

/** 側欄導覽：理論 → 策略分類 → 陷阱／證明／方法論／路線圖，與內容的閱讀順序一致。 */
export interface StrategyNavGroup {
  label?: string;
  items: StrategyPage[];
}

const trailingPageIds = ['pitfalls', 'proofs', 'method', 'roadmap'];

export function navGroups(topic: StrategyTopic): StrategyNavGroup[] {
  const groups: StrategyNavGroup[] = [];
  const theory = pageById(topic, 'theory');
  if (theory) groups.push({ items: [theory] });
  const strategies = topic.pages.filter((page) => page.group === 'strategies');
  if (strategies.length > 0) groups.push({ label: '2. 策略分類', items: strategies });
  const trailing = trailingPageIds
    .map((id) => pageById(topic, id))
    .filter((page): page is StrategyPage => Boolean(page));
  if (trailing.length > 0) groups.push({ items: trailing });
  return groups;
}

export function siblingPages(topic: StrategyTopic, pageId: string) {
  const index = topic.pages.findIndex((page) => page.id === pageId);
  return {
    previous: index > 0 ? topic.pages[index - 1] : undefined,
    next: index >= 0 && index < topic.pages.length - 1 ? topic.pages[index + 1] : undefined
  };
}

/** 每個主題可讀的章節數（不含主題首頁）。 */
export function readablePageCount(topic: StrategyTopic) {
  return topic.pages.filter((page) => page.fragment).length;
}

// ── 內容片段轉換 ────────────────────────────────────────────────
// 片段是手寫 HTML，維持原樣是刻意的：它是內容的唯一來源。渲染時才補上
// 站內連結、KaTeX 數學式與 Shiki 程式碼上色，避免把產生物寫回內容檔。

const inlineMathPattern = /\\\((.+?)\\\)/gs;
const displayMathPattern = /\\\[(.+?)\\\]/gs;
const codeBlockPattern = /<pre><code class="lang-cpp">([\s\S]*?)<\/code><\/pre>/g;
const inlineCodePattern = /<code>[\s\S]*?<\/code>/g;

function decodeEntities(value: string) {
  return value
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');
}

// 與 astro.config.ts 的 shikiConfig 使用同一個主題，程式碼區塊在全站看起來一致。
let highlighterPromise: ReturnType<typeof createShikiHighlighter> | null = null;

function getHighlighter() {
  highlighterPromise ??= createShikiHighlighter({ theme: 'github-dark-default' });
  return highlighterPromise;
}

function renderMath(html: string) {
  return html
    .replace(displayMathPattern, (match, tex: string) => renderTex(match, tex, true))
    .replace(inlineMathPattern, (match, tex: string) => renderTex(match, tex, false));
}

function renderTex(original: string, tex: string, displayMode: boolean) {
  try {
    return katex.renderToString(decodeEntities(tex), {
      displayMode,
      throwOnError: false,
      strict: false,
      output: 'html'
    });
  } catch {
    // 排版失敗時保留原始 TeX，讀者至少還看得到公式來源。
    return original;
  }
}

/**
 * 把片段裡的三種站內連結寫法解析成 handbook 的路由：
 *   #s2-1 等章節錨點 → 同主題的對應章節（可帶頁內片段，如 proofs#s4-3）
 *   #problems        → 題單索引的策略圖鑑分頁
 *   #topic-<id>      → 另一個主題的首頁
 */
function rewriteLinks(html: string, topic: StrategyTopic) {
  let output = html;
  for (const [anchor, target] of Object.entries(topic.anchors)) {
    const [targetId = '', fragment] = target.split('#');
    const page = pageById(topic, targetId);
    if (!page) continue;
    const href = `${pageHref(topic, page)}${fragment ? `#${fragment}` : ''}`;
    output = output.replaceAll(`href="#${anchor}"`, `href="${href}"`);
  }
  output = output.replaceAll('href="#problems"', `href="${withBase('/problem-lists/strategies/')}"`);
  for (const other of strategyTopics) {
    output = output.replaceAll(`href="#topic-${other.id}"`, `href="${strategyHref(other.id)}"`);
  }
  return output;
}

// 佔位符用 Unicode 私用區字元包起來：保證不會撞到內容，還原後也不會留下多餘空白。
const placeholderOpen = '\uE000';
const placeholderClose = '\uE001';
const placeholderPattern = /\uE000(\d+)\uE001/g;

export async function renderFragment(topic: StrategyTopic, fragment: string) {
  const raw = fragmentSource(topic.id, fragment);
  const highlighter = await getHighlighter();

  // 數學式不能滲進程式碼，先把 <pre><code> 與行內 <code> 換成佔位符再排版數學。
  const preserved: string[] = [];
  const stash = (value: string) => `${placeholderOpen}${preserved.push(value) - 1}${placeholderClose}`;

  const blocks = [...raw.matchAll(codeBlockPattern)];
  const highlighted = await Promise.all(
    blocks.map((match) =>
      highlighter.codeToHtml(decodeEntities(match[1] ?? '').trim(), 'cpp', {
        attributes: { class: 'strategy-code' },
        wrap: false
      })
    )
  );

  let cursor = 0;
  let html = raw.replace(codeBlockPattern, () => stash(highlighted[cursor++] ?? ''));
  html = html.replace(inlineCodePattern, (match) => stash(match));
  html = renderMath(html);
  html = rewriteLinks(html, topic);
  return html.replace(placeholderPattern, (_match, slot: string) => preserved[Number(slot)] ?? '');
}
