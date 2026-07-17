import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import fg from 'fast-glob';

const errors: string[] = [];
const required = [
  'AGENTS.md',
  'README.md',
  'data/toc.json',
  'data/page-map.json',
  'data/extraction-manifest.json',
  'data/exercise-candidates.json',
  'reports/content-review.md',
  'supabase/migrations/202607160001_initial.sql',
  '.github/workflows/deploy.yml',
  '.github/workflows/backend-checks.yml'
];

for (const path of required) if (!existsSync(path)) errors.push(`Missing required file: ${path}`);

for (const path of ['source', '.codex', 'tmp']) {
  try {
    // A clean checkout does not contain ignored directories. Check a
    // representative child path so the rule is evaluated even when the
    // directory itself is absent.
    execFileSync('git', ['check-ignore', '-q', `${path}/.keep`]);
  } catch {
    errors.push(`${path} must be ignored by Git`);
  }
}

const forbidden = fg.sync(['**/*.pdf', '**/*.png', '**/*.ocr.txt'], {
  ignore: ['source/**', 'tmp/**', 'node_modules/**', 'public/**']
});
if (forbidden.length) errors.push(`Forbidden publication artifacts: ${forbidden.join(', ')}`);

const appendix = readFileSync('src/pages/appendix/index.astro', 'utf8');
if (/```python/i.test(appendix)) errors.push('Appendix public teaching must not contain reader-facing Python code');

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('Repository policy checks passed.');
