import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, normalize } from 'node:path';
import fg from 'fast-glob';

const root = 'dist';
const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? 'competitive-programming-handbook';
const base = (process.env.PUBLIC_BASE_PATH ?? (process.env.GITHUB_ACTIONS ? `/${repositoryName}` : '/')).replace(
  /\/$/,
  ''
);
const htmlFiles = fg.sync('**/*.html', { cwd: root });
const errors: string[] = [];

function targetPath(fromFile: string, href: string) {
  const withoutFragment = href.split('#')[0]?.split('?')[0] ?? '';
  let path = withoutFragment;
  if (base && path.startsWith(`${base}/`)) path = path.slice(base.length);
  if (path.startsWith('/')) path = path.slice(1);
  if (!path) return fromFile;
  if (!href.startsWith('/') && !href.startsWith(base)) {
    path = normalize(join(dirname(fromFile), path));
  }
  if (path.endsWith('/')) path += 'index.html';
  else if (!/\.[a-z0-9]+$/i.test(path)) path += '/index.html';
  return path;
}

for (const file of htmlFiles) {
  const html = readFileSync(join(root, file), 'utf8');
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]!);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicates.length) errors.push(`${file}: duplicate ids ${[...new Set(duplicates)].join(', ')}`);

  for (const image of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\salt="[^"]*"/.test(image[0])) errors.push(`${file}: image missing alt`);
  }

  for (const link of html.matchAll(/\shref="([^"]+)"/g)) {
    const href = link[1]!;
    if (/^(?:https?:|mailto:|tel:|javascript:|data:)/.test(href)) continue;
    const target = targetPath(file, href);
    if (!existsSync(join(root, target))) {
      errors.push(`${file}: broken internal link ${href} -> ${target}`);
      continue;
    }
    const fragment = href.includes('#') ? decodeURIComponent(href.split('#')[1] ?? '') : '';
    if (fragment) {
      const targetHtml = readFileSync(join(root, target), 'utf8');
      if (!targetHtml.includes(`id="${fragment}"`)) {
        errors.push(`${file}: missing anchor ${href}`);
      }
    }
  }
}

if (errors.length) {
  console.error(errors.slice(0, 100).join('\n'));
  if (errors.length > 100) console.error(`...and ${errors.length - 100} more`);
  process.exit(1);
}
console.log(`Validated ${htmlFiles.length} HTML files: internal links, anchors, image alt, and duplicate IDs.`);
