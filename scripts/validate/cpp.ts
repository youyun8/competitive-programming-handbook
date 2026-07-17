import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { basename } from 'node:path';
import fg from 'fast-glob';
import { readFrontmatter } from './frontmatter';
import { chapterExamples } from '../../src/lib/chapter-examples';

const outputDirectory = 'tmp/validate/cpp';
rmSync(outputDirectory, { recursive: true, force: true });
mkdirSync(outputDirectory, { recursive: true });
const sources: Array<{ name: string; code: string; sample?: { input: string; output: string } }> =
  [];

for (const path of fg.sync('src/content/lessons/**/*.{md,mdx}')) {
  const source = readFileSync(path, 'utf8');
  for (const [index, match] of [...source.matchAll(/```cpp\n([\s\S]*?)```/g)].entries()) {
    sources.push({ name: `${basename(path)}-block-${index}`, code: match[1]! });
  }
}

for (const path of fg.sync('src/content/exercises/**/*.{md,mdx}')) {
  const { data } = readFrontmatter(path);
  if (data.cpp_solution) {
    sources.push({
      name: `${basename(path)}-solution`,
      code: data.cpp_solution,
      sample: data.samples?.[0]
    });
  }
}

for (const path of fg.sync('examples/**/*.cpp')) {
  sources.push({ name: basename(path), code: readFileSync(path, 'utf8') });
}

for (const [chapter, examples] of Object.entries(chapterExamples)) {
  for (const [index, example] of examples.entries()) {
    sources.push({ name: `chapter-${chapter}-example-${index}`, code: example.code });
  }
}

for (const [index, source] of sources.entries()) {
  const sourcePath = `${outputDirectory}/${index}.cpp`;
  const objectPath = `${outputDirectory}/${index}.o`;
  writeFileSync(sourcePath, source.code);
  execFileSync(
    'g++',
    [
      '-std=c++17',
      '-pedantic-errors',
      '-Wall',
      '-Wextra',
      '-Wconversion',
      '-Wshadow',
      '-Werror',
      '-c',
      sourcePath,
      '-o',
      objectPath
    ],
    {
      stdio: 'pipe'
    }
  );
  if (source.sample) {
    const executable = `${outputDirectory}/${index}`;
    execFileSync('g++', ['-std=c++17', '-pedantic-errors', '-O2', sourcePath, '-o', executable], {
      stdio: 'pipe'
    });
    const actual = execFileSync(executable, {
      input: source.sample.input,
      encoding: 'utf8',
      timeout: 5000
    }).trim();
    const expected = String(source.sample.output).trim();
    if (actual !== expected)
      throw new Error(`${source.name}: sample mismatch\nexpected: ${expected}\nactual: ${actual}`);
  }
}

console.log(`Compiled ${sources.length} C++ snippets/programs; all exercise samples passed.`);
