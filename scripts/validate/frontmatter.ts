import { readFileSync } from 'node:fs';
import YAML from 'yaml';

export function readFrontmatter(path: string) {
  const source = readFileSync(path, 'utf8');
  const match = source.match(/^---\n([\s\S]*?)\n---/);
  if (!match) throw new Error(`Missing frontmatter: ${path}`);
  return {
    data: YAML.parse(match[1]!),
    body: source.slice(match[0].length)
  };
}
