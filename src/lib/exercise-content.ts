export const hintStageLabels = ['辨識方向', '建立模型', '實作檢查'] as const;

export function threeStageHints(hints: string[]) {
  if (hints.length >= 3) {
    return [hints[0]!, hints.slice(1, -1).join('\n\n'), hints.at(-1)!];
  }
  return [
    hints[0] ?? '本題的辨識提示尚待內容審核。',
    hints[1] ?? '本題的建模提示尚待內容審核。',
    '本題的實作提示尚待內容審核。'
  ];
}

export interface ExerciseCompleteness {
  samples: unknown[];
  hints: string[];
  cpp_skeleton?: string;
  cpp_solution?: string;
  proof_or_invariant?: string;
  common_errors?: string[];
}

export function hasCompleteLearningContent(data: ExerciseCompleteness) {
  return (
    data.samples.length > 0 &&
    data.hints.length >= 3 &&
    Boolean(data.cpp_skeleton) &&
    Boolean(data.cpp_solution) &&
    Boolean(data.proof_or_invariant) &&
    Boolean(data.common_errors?.length)
  );
}
