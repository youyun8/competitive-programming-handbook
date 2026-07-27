import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import ExerciseStatusControl from '@/components/progress/ExerciseStatusControl';

/**
 * 策略圖鑑的內文是手寫 HTML 片段，題目卡以 data-problem-id 標記。
 * 這個島掛載後掃出所有題目卡，就地補上與題庫共用的練習狀態控制項——
 * 進度 id 沿用題庫的命名（lc-455、luogu-p1090），因此同一題在策略頁面、
 * 題單索引與題庫詳情頁標記任一處，其他地方都會同步。
 */
export default function StrategyProgress() {
  const [mounts, setMounts] = useState<Array<{ id: string; host: HTMLElement }>>([]);

  useEffect(() => {
    const cards = document.querySelectorAll<HTMLElement>('.strategy-body [data-problem-id]');
    const created: Array<{ id: string; host: HTMLElement }> = [];
    for (const card of cards) {
      const id = card.dataset.problemId;
      if (!id || card.querySelector(':scope > .strategy-problem-status')) continue;
      const host = document.createElement('div');
      host.className = 'strategy-problem-status';
      card.append(host);
      created.push({ id, host });
    }
    setMounts(created);
    return () => {
      for (const mount of created) mount.host.remove();
    };
  }, []);

  return (
    <>
      {mounts.map((mount) =>
        createPortal(<ExerciseStatusControl exerciseId={mount.id} compact />, mount.host, mount.id)
      )}
    </>
  );
}
