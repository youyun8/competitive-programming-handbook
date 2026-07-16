import { mkdirSync, writeFileSync } from 'node:fs';
import fg from 'fast-glob';
import exerciseCandidates from '../../data/exercise-candidates.json' with { type: 'json' };
import manifest from '../../data/extraction-manifest.json' with { type: 'json' };
import toc from '../../data/toc.json' with { type: 'json' };

const pages = Object.values(manifest.volumes).flatMap((volume) => volume.pages);
const stats = {
  generatedAt: new Date().toISOString(),
  sourcePages: pages.length,
  ocrCompletePages: pages.filter((page) => page.status === 'ocr-complete').length,
  candidateExampleLabels: pages.reduce((sum, page) => sum + page.candidate_labels.length, 0),
  candidateExternalUrls: pages.reduce((sum, page) => sum + page.candidate_urls.length, 0),
  candidateQrLinks: pages.reduce((sum, page) => sum + (page.qr_candidates?.length ?? 0), 0),
  exerciseCandidates: exerciseCandidates.counts.total,
  labeledExerciseCandidates: exerciseCandidates.counts.labeled_examples,
  unlabeledExternalOjCandidatePages: exerciseCandidates.counts.unlabeled_external_oj_pages,
  pagesPendingHumanReview: pages.filter((page) => page.manual_review !== 'verified').length,
  chapters: toc.chapters.length,
  sections: toc.chapters.reduce((sum, chapter) => sum + chapter.sections.length, 0),
  publishedLessons: fg.sync('src/content/lessons/**/*.{md,mdx}').length,
  publishedExercises: fg.sync('src/content/exercises/**/*.{md,mdx}').length,
  glossaryEntries: fg.sync('src/content/glossary/**/*.{md,mdx}').length
};
mkdirSync('reports', { recursive: true });
writeFileSync('reports/content-stats.json', `${JSON.stringify(stats, null, 2)}\n`);
console.log(JSON.stringify(stats, null, 2));
