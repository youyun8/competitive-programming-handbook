import { chapterExamples, type ChapterExample } from './chapter-examples';

// 教材例題以「例 x.y」編號，本身沒有小節欄位。書上例題與題單例題指向同一道 OJ 題時，
// 才把教材版題面與參考解答掛到該小節；跨章同題（例如 hdu 1556 同時出現在 2.6 與 4.2）
// 用章號限制，避免把第 4 章的例題掛到第 2 章的小節。
const byChapterAndUrl = new Map<string, ChapterExample>();
for (const [chapter, examples] of Object.entries(chapterExamples)) {
  for (const example of examples) {
    if (!example.url) continue;
    byChapterAndUrl.set(`${chapter}|${example.url}`, example);
  }
}

export function textbookExampleFor(chapter: number, url: string) {
  return byChapterAndUrl.get(`${chapter}|${url}`);
}
