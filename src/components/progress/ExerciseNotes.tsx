import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { clearExerciseNote, readExerciseNote, saveExerciseNote } from '@/lib/sync/store';
import type { ExerciseNote } from '@/lib/sync/types';

interface Props {
  exerciseId: string;
  title: string;
  compact?: boolean;
}

export default function ExerciseNotes({ exerciseId, title, compact = false }: Props) {
  const [open, setOpen] = useState(false);
  const [hasNote, setHasNote] = useState(false);

  useEffect(() => {
    readExerciseNote(exerciseId).then((note) => setHasNote(Boolean(note)));
  }, [exerciseId]);

  return (
    <>
      <button
        className={
          compact ? 'button secondary note-button compact' : 'button secondary note-button'
        }
        type="button"
        onClick={() => setOpen(true)}
      >
        {hasNote ? '查看解答與思路' : '記錄解答與思路'}
      </button>
      {open && (
        <ExerciseNotesDialog
          exerciseId={exerciseId}
          title={title}
          onClose={() => setOpen(false)}
          onSaved={(present) => setHasNote(present)}
        />
      )}
    </>
  );
}

function ExerciseNotesDialog({
  exerciseId,
  title,
  onClose,
  onSaved
}: {
  exerciseId: string;
  title: string;
  onClose: () => void;
  onSaved: (present: boolean) => void;
}) {
  const [solution, setSolution] = useState('');
  const [thought, setThought] = useState('');
  const [language, setLanguage] = useState<ExerciseNote['language']>('cpp17');
  const [activePanel, setActivePanel] = useState<'solution' | 'thought'>('solution');
  const [thoughtView, setThoughtView] = useState<'edit' | 'preview'>('edit');
  const [updatedAt, setUpdatedAt] = useState<string>();
  const [saved, setSaved] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    readExerciseNote(exerciseId).then((note) => {
      if (note) {
        setSolution(note.solution);
        setThought(note.thought);
        setLanguage(note.language);
        setUpdatedAt(note.updatedAt);
      }
      setReady(true);
    });
  }, [exerciseId]);

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [onClose]);

  async function save() {
    const nextUpdatedAt = new Date().toISOString();
    const hasContent = Boolean(solution.trim() || thought.trim());
    if (!hasContent) {
      await clearExerciseNote(exerciseId);
      setUpdatedAt(undefined);
      setSaved(true);
      onSaved(false);
      return;
    }
    await saveExerciseNote({
      exerciseId,
      solution,
      thought,
      language,
      updatedAt: nextUpdatedAt
    });
    setUpdatedAt(nextUpdatedAt);
    setSaved(true);
    onSaved(true);
  }

  async function clearField(field: 'solution' | 'thought') {
    const nextSolution = field === 'solution' ? '' : solution;
    const nextThought = field === 'thought' ? '' : thought;
    setSolution(nextSolution);
    setThought(nextThought);
    const nextUpdatedAt = new Date().toISOString();
    if (!nextSolution.trim() && !nextThought.trim()) {
      await clearExerciseNote(exerciseId);
      setUpdatedAt(undefined);
      onSaved(false);
    } else {
      await saveExerciseNote({
        exerciseId,
        solution: nextSolution,
        thought: nextThought,
        language,
        updatedAt: nextUpdatedAt
      });
      setUpdatedAt(nextUpdatedAt);
      onSaved(true);
    }
    setSaved(true);
  }

  async function clearAll() {
    if (!solution.trim() && !thought.trim()) return;
    if (!window.confirm('確定要清空這題的解答與思路嗎？')) return;
    setSolution('');
    setThought('');
    setUpdatedAt(undefined);
    await clearExerciseNote(exerciseId);
    setSaved(true);
    onSaved(false);
  }

  const formattedUpdatedAt = updatedAt
    ? new Intl.DateTimeFormat('zh-TW', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).format(new Date(updatedAt))
    : null;

  return createPortal(
    <dialog
      className="notes-backdrop"
      open
      aria-modal="true"
      aria-labelledby={`notes-title-${exerciseId}`}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <div className="notes-dialog">
        <header className="notes-header">
          <div>
            <h2 id={`notes-title-${exerciseId}`}>記錄解答與思路</h2>
            <p>{title}</p>
            {formattedUpdatedAt && <small>上次更新：{formattedUpdatedAt}</small>}
          </div>
          <button className="icon-button" type="button" aria-label="關閉" onClick={onClose}>
            ×
          </button>
        </header>

        <div className="notes-body">
          <div className="notes-tabs" role="tablist" aria-label="筆記類型">
            <button
              type="button"
              role="tab"
              aria-selected={activePanel === 'solution'}
              onClick={() => setActivePanel('solution')}
            >
              解答（程式碼）
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activePanel === 'thought'}
              onClick={() => setActivePanel('thought')}
            >
              思路（Markdown）
            </button>
          </div>

          {!ready ? (
            <p>正在載入筆記…</p>
          ) : activePanel === 'solution' ? (
            <div className="notes-panel">
              <div className="notes-toolbar">
                <label>
                  語言
                  <select
                    value={language}
                    onChange={(event) => {
                      setLanguage(event.target.value as ExerciseNote['language']);
                      setSaved(false);
                    }}
                  >
                    <option value="cpp17">C++17</option>
                    <option value="cpp20">C++20</option>
                  </select>
                </label>
                <button
                  className="button secondary"
                  type="button"
                  onClick={() => clearField('solution')}
                  disabled={!solution.trim()}
                >
                  清空解答
                </button>
              </div>
              <label className="sr-only" htmlFor={`solution-note-${exerciseId}`}>
                解答程式碼
              </label>
              <textarea
                id={`solution-note-${exerciseId}`}
                className="notes-code-editor"
                value={solution}
                onChange={(event) => {
                  setSolution(event.target.value);
                  setSaved(false);
                }}
                placeholder="// 貼上或撰寫你的解法"
                spellCheck={false}
                maxLength={65536}
              />
            </div>
          ) : (
            <div className="notes-panel">
              <div className="notes-toolbar">
                <div className="notes-view-toggle">
                  <button
                    type="button"
                    aria-pressed={thoughtView === 'edit'}
                    onClick={() => setThoughtView('edit')}
                  >
                    編輯
                  </button>
                  <button
                    type="button"
                    aria-pressed={thoughtView === 'preview'}
                    onClick={() => setThoughtView('preview')}
                  >
                    預覽
                  </button>
                </div>
                <button
                  className="button secondary"
                  type="button"
                  onClick={() => clearField('thought')}
                  disabled={!thought.trim()}
                >
                  清空思路
                </button>
              </div>
              {thoughtView === 'edit' ? (
                <>
                  <label className="sr-only" htmlFor={`thought-note-${exerciseId}`}>
                    解題思路
                  </label>
                  <textarea
                    id={`thought-note-${exerciseId}`}
                    className="notes-thought-editor"
                    value={thought}
                    onChange={(event) => {
                      setThought(event.target.value);
                      setSaved(false);
                    }}
                    placeholder={
                      '記錄如何建模、使用的不變量、邊界處理與下次複習提醒。支援 Markdown。'
                    }
                    maxLength={32768}
                  />
                </>
              ) : thought.trim() ? (
                <div className="notes-markdown">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      a: ({ children, ...props }) => (
                        <a {...props} target="_blank" rel="noopener noreferrer">
                          {children}
                        </a>
                      )
                    }}
                  >
                    {thought}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="notes-empty">尚無內容可預覽</div>
              )}
            </div>
          )}
        </div>

        <footer className="notes-footer">
          <p>內容會先儲存在此瀏覽器；登入後會與進度一併同步。</p>
          <div>
            {saved && <span className="saved-label">已儲存</span>}
            <button className="button secondary" type="button" onClick={clearAll}>
              清空全部
            </button>
            <button className="button secondary" type="button" onClick={onClose}>
              關閉
            </button>
            <button className="button" type="button" onClick={save}>
              儲存記錄
            </button>
          </div>
        </footer>
      </div>
    </dialog>,
    document.body
  );
}
