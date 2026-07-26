import { useEffect, useState } from 'react';
import { saveReadingSettings } from '@/lib/sync/store';
import type { ReadingSettings as ReadingSettingsValue } from '@/lib/sync/types';

type StoredSettings = Omit<ReadingSettingsValue, 'updatedAt'>;
type NumericSetting = 'fontSize' | 'contentWidth' | 'codeFontSize';

const defaults: StoredSettings = {
  theme: 'system',
  fontSize: 17,
  contentWidth: 48,
  codeFontSize: 14,
  wrapLines: true
};

function isTheme(value: unknown): value is StoredSettings['theme'] {
  return value === 'light' || value === 'dark' || value === 'system';
}

function loadSettings(): StoredSettings {
  try {
    const saved = JSON.parse(localStorage.getItem('ac-reading-settings') || '{}') as Partial<StoredSettings>;
    const legacyTheme = localStorage.getItem('ac-theme');
    return {
      theme: isTheme(saved.theme) ? saved.theme : isTheme(legacyTheme) ? legacyTheme : defaults.theme,
      fontSize: Number(saved.fontSize) || defaults.fontSize,
      contentWidth: Number(saved.contentWidth) || defaults.contentWidth,
      codeFontSize: Number(saved.codeFontSize) || defaults.codeFontSize,
      wrapLines: typeof saved.wrapLines === 'boolean' ? saved.wrapLines : defaults.wrapLines
    };
  } catch {
    return defaults;
  }
}

function applySettings(settings: StoredSettings) {
  const root = document.documentElement;
  const resolvedTheme =
    settings.theme === 'system'
      ? matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : settings.theme;
  root.dataset.theme = resolvedTheme;
  root.dataset.themePreference = settings.theme;
  root.dataset.readingWidth = settings.contentWidth >= 80 ? 'full' : settings.contentWidth >= 60 ? 'wide' : 'focused';
  root.style.setProperty('--font-size', `${settings.fontSize}px`);
  root.style.setProperty('--reading-width', `${settings.contentWidth}rem`);
  root.style.setProperty('--code-font-size', `${settings.codeFontSize}px`);
  root.dataset.wrapLines = String(settings.wrapLines);
}

interface Props {
  idPrefix?: string;
}

export default function ReadingSettings({ idPrefix = 'reading' }: Props) {
  const [settings, setSettings] = useState(defaults);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = loadSettings();
    setSettings(saved);
    applySettings(saved);
    setHydrated(true);
  }, []);

  async function persist(next: StoredSettings) {
    localStorage.setItem('ac-reading-settings', JSON.stringify(next));
    localStorage.setItem('ac-theme', next.theme);
    applySettings(next);
    window.dispatchEvent(new CustomEvent('ac:setting-change', { detail: next }));
    await saveReadingSettings({ ...next, updatedAt: new Date().toISOString() });
  }

  async function updateNumber(key: NumericSetting, value: number) {
    const next = { ...settings, [key]: value };
    setSettings(next);
    await persist(next);
  }

  async function updateTheme(theme: StoredSettings['theme']) {
    const next = { ...settings, theme };
    setSettings(next);
    await persist(next);
  }

  async function reset() {
    setSettings(defaults);
    await persist(defaults);
  }

  return (
    <section className="reading-settings" aria-busy={!hydrated} aria-labelledby={`${idPrefix}-settings-title`}>
      <header className="settings-header">
        <h2 id={`${idPrefix}-settings-title`}>閱讀偏好</h2>
        <p className="settings-hint">調整後立即套用到全站，並保存在此裝置。</p>
      </header>

      <fieldset className="settings-group">
        <legend>主題</legend>
        <p className="settings-hint">「跟隨系統」會依作業系統的深淺色設定自動切換。</p>
        <div className="segmented-control">
          {(
            [
              ['system', '跟隨系統'],
              ['light', '淺色'],
              ['dark', '深色']
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              disabled={!hydrated}
              aria-pressed={settings.theme === value}
              onClick={() => updateTheme(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="settings-group">
        <legend>頁面寬度</legend>
        <p className="settings-hint">決定內文每行的長度，寬版與全螢幕適合對照程式碼。</p>
        <div className="segmented-control">
          {(
            [
              [48, '專注'],
              [62, '寬版'],
              [80, '全螢幕']
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              disabled={!hydrated}
              aria-pressed={settings.contentWidth === value}
              onClick={() => updateNumber('contentWidth', value)}
            >
              {label}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="settings-group">
        <div className="settings-row">
          <div className="settings-row-head">
            <label htmlFor={`${idPrefix}-font-size`}>正文字級</label>
            <span className="settings-value">{settings.fontSize}px</span>
          </div>
          <input
            className="settings-range"
            id={`${idPrefix}-font-size`}
            type="range"
            min="15"
            max="22"
            disabled={!hydrated}
            value={settings.fontSize}
            aria-valuetext={`${settings.fontSize}px`}
            onChange={(event) => updateNumber('fontSize', Number(event.target.value))}
          />
          <div className="settings-scale" aria-hidden="true">
            <span>15px</span>
            <span>22px</span>
          </div>
        </div>

        <div className="settings-row">
          <div className="settings-row-head">
            <label htmlFor={`${idPrefix}-code-font-size`}>程式碼字級</label>
            <span className="settings-value">{settings.codeFontSize}px</span>
          </div>
          <input
            className="settings-range"
            id={`${idPrefix}-code-font-size`}
            type="range"
            min="12"
            max="20"
            disabled={!hydrated}
            value={settings.codeFontSize}
            aria-valuetext={`${settings.codeFontSize}px`}
            onChange={(event) => updateNumber('codeFontSize', Number(event.target.value))}
          />
          <div className="settings-scale" aria-hidden="true">
            <span>12px</span>
            <span>20px</span>
          </div>
        </div>
      </div>

      <label className="settings-toggle">
        <input
          type="checkbox"
          checked={settings.wrapLines}
          disabled={!hydrated}
          onChange={(event) => {
            const next = { ...settings, wrapLines: event.target.checked };
            setSettings(next);
            void persist(next);
          }}
        />
        <span className="settings-toggle-text">
          <strong>程式碼長行換行</strong>
          <span className="settings-hint">關閉後過長的程式碼改用左右捲動，保留原始排版。</span>
        </span>
      </label>

      <div className="settings-actions">
        <button className="button secondary" type="button" disabled={!hydrated} onClick={reset}>
          恢復預設
        </button>
      </div>
    </section>
  );
}
