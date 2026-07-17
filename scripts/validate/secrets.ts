import { readFileSync } from 'node:fs';
import fg from 'fast-glob';

const files = fg.sync(['**/*'], {
  onlyFiles: true,
  ignore: [
    '.git/**',
    '.codex/**',
    'node_modules/**',
    'dist/**',
    'tmp/**',
    'source/**',
    'pnpm-lock.yaml',
    '.env.example'
  ]
});
const patterns = [
  /SUPABASE_SERVICE_ROLE_KEY\s*=\s*\S+/,
  /(?:client_secret|oauth_secret)\s*[:=]\s*["']?[A-Za-z0-9_-]{16,}/i,
  /postgres(?:ql)?:\/\/[^:\s]+:[^@\s]+@/i,
  /sb_secret_[A-Za-z0-9_-]{20,}/
];
const findings: string[] = [];
for (const file of files) {
  const value = readFileSync(file);
  if (value.includes(0)) continue;
  const text = value
    .toString('utf8')
    .replaceAll('postgresql://postgres:postgres@127.0.0.1:54322/postgres', '[local-development-database]');
  if (patterns.some((pattern) => pattern.test(text))) findings.push(file);
}
if (findings.length) {
  console.error(`Potential secrets found in: ${findings.join(', ')}`);
  process.exit(1);
}
console.log(`Secret scan passed across ${files.length} files.`);
