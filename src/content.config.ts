import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const reviewStatus = z.enum(['draft', 'verified', 'needs-review']);
const volume = z.enum(['upper', 'lower']);
const pagePair = z.tuple([z.number().int().positive(), z.number().int().positive()]);

const lessons = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/lessons' }),
  schema: z.object({
    id: z.string().min(1),
    volume,
    source_file: z.string().min(1),
    chapter: z.number().int().min(1).max(10),
    section: z.string().regex(/^((?:[1-9]|10)\.\d+|A\.\d+)$/),
    title: z.string().min(1),
    summary: z.string().min(1),
    prerequisites: z.array(z.string()),
    learning_goals: z.array(z.string()).min(1),
    concepts: z.array(z.string()).min(1),
    complexity: z
      .object({
        time: z.string().optional(),
        space: z.string().optional()
      })
      .optional(),
    related_exercises: z.array(z.string()),
    source_book_pages: pagePair,
    source_pdf_pages: pagePair,
    review_status: reviewStatus,
    visualizer: z
      .enum([
        'binary-search',
        'search',
        'union-find',
        'segment-tree',
        'lca',
        'dynamic-programming',
        'fast-power',
        'extended-gcd',
        'convex-hull',
        'kmp',
        'dijkstra',
        'max-flow'
      ])
      .optional()
  })
});

const exercises = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/exercises' }),
  schema: z.object({
    id: z.string().min(1),
    volume,
    source_file: z.string().min(1),
    original_label: z.string().optional(),
    title: z.string().min(1),
    chapter: z.number().int().min(1).max(10),
    section: z.string(),
    kind: z.enum(['worked-example', 'practice', 'external-oj']),
    difficulty: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
    topics: z.array(z.string()).min(1),
    prerequisites: z.array(z.string()),
    statement: z.string().min(1),
    constraints: z.array(z.string()).optional(),
    input_format: z.string().optional(),
    output_format: z.string().optional(),
    samples: z
      .array(
        z.object({
          input: z.string(),
          output: z.string(),
          explanation: z.string().optional()
        })
      )
      .default([]),
    hints: z.array(z.string()),
    solution_outline: z.string().min(1),
    proof_or_invariant: z.string().optional(),
    complexity: z.object({
      time: z.string().min(1),
      space: z.string().min(1)
    }),
    cpp_solution: z.string().optional(),
    external_url: z.url().optional(),
    external_platform: z.string().optional(),
    external_problem_id: z.string().optional(),
    external_title: z.string().optional(),
    external_relation: z.enum(['original', 'related']).optional(),
    source_book_pages: z.array(z.number().int().positive()).min(1),
    source_pdf_pages: z.array(z.number().int().positive()).min(1),
    ocr_confidence: z.number().min(0).max(1).optional(),
    review_status: reviewStatus
  })
});

const glossary = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/glossary' }),
  schema: z.object({
    id: z.string(),
    traditional: z.string(),
    simplified: z.string(),
    english: z.string(),
    aliases: z.array(z.string()).default([]),
    definition: z.string(),
    related_lessons: z.array(z.string()).default([]),
    review_status: reviewStatus
  })
});

const learningPaths = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/learning-paths' }),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    summary: z.string(),
    audience: z.string(),
    lesson_ids: z.array(z.string()).min(1),
    review_status: reviewStatus
  })
});

export const collections = { lessons, exercises, glossary, learningPaths };
