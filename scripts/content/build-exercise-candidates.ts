import { writeFileSync } from 'node:fs';
import manifest from '../../data/extraction-manifest.json' with { type: 'json' };

type Volume = 'upper' | 'lower';

interface PageRecord {
  page: number;
  status: string;
  ocr_confidence: number | null;
  candidate_labels: string[];
  candidate_flags: string[];
}

interface ExerciseCandidate {
  id: string;
  volume: Volume;
  candidate_kind: 'labeled-example' | 'external-oj-page';
  original_label?: string;
  source_pdf_pages: number[];
  source_book_pages: number[];
  evidence_flags: string[];
  ocr_confidence_range: [number, number];
  review_status: 'needs-review';
  public_content_status: 'blocked-until-human-review';
}

function bookPage(volume: Volume, pdfPage: number) {
  if (volume === 'upper' && pdfPage >= 19 && pdfPage <= 403) return pdfPage - 18;
  if (volume === 'lower' && pdfPage >= 17 && pdfPage <= 323) return pdfPage + 370;
  return null;
}

function slug(value: string) {
  return value
    .replace('例', '')
    .trim()
    .replace(/[.．·]/g, '-')
    .replace(/[^0-9-]/g, '');
}

const candidates: ExerciseCandidate[] = [];

for (const volume of ['upper', 'lower'] as const) {
  const pages = manifest.volumes[volume].pages as PageRecord[];
  const byLabel = new Map<string, PageRecord[]>();
  for (const page of pages) {
    for (const label of page.candidate_labels) {
      const group = byLabel.get(label) ?? [];
      group.push(page);
      byLabel.set(label, group);
    }
  }

  for (const [label, records] of byLabel) {
    const pdfPages = [...new Set(records.map((record) => record.page))].sort(
      (left, right) => left - right
    );
    const bookPages = pdfPages
      .map((page) => bookPage(volume, page))
      .filter((page): page is number => page !== null);
    const confidences = records.map((record) => record.ocr_confidence ?? 0);
    candidates.push({
      id: `${volume}-example-${slug(label)}`,
      volume,
      candidate_kind: 'labeled-example',
      original_label: label,
      source_pdf_pages: pdfPages,
      source_book_pages: bookPages,
      evidence_flags: [...new Set(records.flatMap((record) => record.candidate_flags))].sort(),
      ocr_confidence_range: [Math.min(...confidences), Math.max(...confidences)],
      review_status: 'needs-review',
      public_content_status: 'blocked-until-human-review'
    });
  }

  for (const page of pages) {
    if (page.candidate_labels.length === 0 && page.candidate_flags.includes('external-oj')) {
      const mappedBookPage = bookPage(volume, page.page);
      candidates.push({
        id: `${volume}-page-${String(page.page).padStart(3, '0')}-external-oj`,
        volume,
        candidate_kind: 'external-oj-page',
        source_pdf_pages: [page.page],
        source_book_pages: mappedBookPage === null ? [] : [mappedBookPage],
        evidence_flags: page.candidate_flags,
        ocr_confidence_range: [page.ocr_confidence ?? 0, page.ocr_confidence ?? 0],
        review_status: 'needs-review',
        public_content_status: 'blocked-until-human-review'
      });
    }
  }
}

candidates.sort(
  (left, right) =>
    left.volume.localeCompare(right.volume) ||
    left.source_pdf_pages[0]! - right.source_pdf_pages[0]!
);

const output = {
  version: 1,
  generated_at: new Date().toISOString(),
  source_manifest: 'data/extraction-manifest.json',
  policy:
    'Metadata-only OCR candidate inventory. No OCR prose, problem statements, samples, code, or URLs are publishable until human review.',
  counts: {
    total: candidates.length,
    labeled_examples: candidates.filter(
      (candidate) => candidate.candidate_kind === 'labeled-example'
    ).length,
    unlabeled_external_oj_pages: candidates.filter(
      (candidate) => candidate.candidate_kind === 'external-oj-page'
    ).length
  },
  candidates
};

writeFileSync('data/exercise-candidates.json', `${JSON.stringify(output, null, 2)}\n`);
console.log(JSON.stringify(output.counts, null, 2));
