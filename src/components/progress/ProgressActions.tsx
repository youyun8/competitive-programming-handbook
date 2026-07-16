import { useEffect, useState } from 'react';
import { saveLessonProgress, toggleBookmark } from '@/lib/sync/store';

interface Props {
  lessonId: string;
}

export default function ProgressActions({ lessonId }: Props) {
  const [completed, setCompleted] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    const progress = localStorage.getItem(`ac-progress:${lessonId}`);
    const bookmark = localStorage.getItem(`ac-bookmark:${lessonId}`);
    setCompleted(progress === 'completed');
    setBookmarked(bookmark === 'true');
  }, [lessonId]);

  async function complete() {
    const next = !completed;
    setCompleted(next);
    localStorage.setItem(`ac-progress:${lessonId}`, next ? 'completed' : 'in-progress');
    await saveLessonProgress({
      lessonId,
      status: next ? 'completed' : 'in-progress',
      percent: next ? 100 : 50,
      updatedAt: new Date().toISOString()
    });
  }

  async function bookmark() {
    const next = await toggleBookmark('lesson', lessonId);
    setBookmarked(next);
    localStorage.setItem(`ac-bookmark:${lessonId}`, String(next));
  }

  return (
    <div className="page-actions" aria-label="學習進度操作">
      <button className="button" type="button" onClick={complete} aria-pressed={completed}>
        {completed ? '✓ 已完成' : '標記為完成'}
      </button>
      <button
        className="button secondary"
        type="button"
        onClick={bookmark}
        aria-pressed={bookmarked}
      >
        {bookmarked ? '★ 已加入書籤' : '☆ 加入書籤'}
      </button>
    </div>
  );
}
