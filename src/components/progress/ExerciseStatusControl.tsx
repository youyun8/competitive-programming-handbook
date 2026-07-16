import { useEffect, useState } from 'react';
import { readExerciseProgress, saveExerciseProgress } from '@/lib/sync/store';
import type { ExerciseProgress } from '@/lib/sync/types';

type ExerciseStatus = ExerciseProgress['status'];

const statusOptions: Array<{ value: ExerciseStatus; label: string }> = [
  { value: 'not-started', label: '未開始' },
  { value: 'in-progress', label: '練習中' },
  { value: 'needs-review', label: '待複習' },
  { value: 'solved', label: '已解決' }
];

function normalizeStatus(value?: string | null): ExerciseStatus {
  if (value === 'completed') return 'solved';
  if (value === 'attempted') return 'in-progress';
  if (statusOptions.some((option) => option.value === value)) return value as ExerciseStatus;
  return 'not-started';
}

interface Props {
  exerciseId: string;
  compact?: boolean;
}

export default function ExerciseStatusControl({ exerciseId, compact = false }: Props) {
  const [status, setStatus] = useState<ExerciseStatus>('not-started');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    readExerciseProgress(exerciseId).then((progress) => {
      const localStatus = localStorage.getItem(`ac-exercise:${exerciseId}`);
      const normalized = normalizeStatus(progress?.status ?? localStatus);
      setStatus(normalized);
      localStorage.setItem(`ac-exercise:${exerciseId}`, normalized);
      setReady(true);
    });
    function handleStatusChange(event: Event) {
      const detail = (event as CustomEvent<{ exerciseId: string; status: ExerciseStatus }>).detail;
      if (detail?.exerciseId === exerciseId) setStatus(detail.status);
    }
    window.addEventListener('ac:exercise-status-change', handleStatusChange);
    return () => window.removeEventListener('ac:exercise-status-change', handleStatusChange);
  }, [exerciseId]);

  async function update(nextStatus: ExerciseStatus) {
    const updatedAt = new Date().toISOString();
    setStatus(nextStatus);
    localStorage.setItem(`ac-exercise:${exerciseId}`, nextStatus);
    await saveExerciseProgress({
      exerciseId,
      status: nextStatus,
      lastPracticedAt: nextStatus === 'not-started' ? undefined : updatedAt,
      updatedAt
    });
    window.dispatchEvent(
      new CustomEvent('ac:exercise-status-change', {
        detail: { exerciseId, status: nextStatus }
      })
    );
  }

  return (
    <div className={compact ? 'exercise-status compact' : 'exercise-status'}>
      <label htmlFor={`exercise-status-${exerciseId}`}>學習狀態</label>
      <select
        id={`exercise-status-${exerciseId}`}
        value={status}
        disabled={!ready}
        onChange={(event) => update(event.target.value as ExerciseStatus)}
      >
        {statusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <span className={`status-chip status-${status}`} aria-live="polite">
        {statusOptions.find((option) => option.value === status)?.label}
      </span>
    </div>
  );
}

export { statusOptions };
