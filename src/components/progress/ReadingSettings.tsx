import { useEffect, useState } from 'react';
import { saveReadingSettings } from '@/lib/sync/store';
import type { ReadingSettings as ReadingSettingsValue } from '@/lib/sync/types';

type StoredSettings = Omit<ReadingSettingsValue, 'updatedAt'>;
type NumericSetting = 'fontSize' | 'contentWidth' | 'codeFontSize';

const defaults: StoredSettings = {
  theme: 'system',
  fontSize: 17,
  contentWidth: 48,
  codeFontSize: 14
};

function isTheme(value: unknown): value is StoredSettings['theme'] {
  return value === 'light' || value === 'dark' || value === 'system';
}

function loadSettings(): StoredSettings {
  try {
    const saved = JSON.parse(
      localStorage.getItem('ac-reading-settings') || '{}'
    ) as Partial<StoredSettings>;
    const legacyTheme = localStorage.getItem('ac-theme');
    return {
      theme: isTheme(saved.theme)
        ? saved.theme
        : isTheme(legacyTheme)
          ? legacyTheme
          : defaults.theme,
      fontSize: Number(saved.fontSize) || defaults.fontSize,
      contentWidth: Number(saved.contentWidth) || defaults.contentWidth,
      codeFontSize: Number(saved.codeFontSize) || defaults.codeFontSize
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
  root.dataset.readingWidth =
    settings.contentWidth >= 80 ? 'full' : settings.contentWidth >= 60 ? 'wide' : 'focused';
  root.style.setProperty('--font-size', `${settings.fontSize}px`);
  root.style.setProperty('--reading-width', `${settings.contentWidth}rem`);
  root.style.setProperty('--code-font-size', `${settings.codeFontSize}px`);
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
    <section
      className="reading-settings"
      aria-busy={!hydrated}
      aria-labelledby={`${idPrefix}-settings-title`}
    >
      <h2 id={`${idPrefix}-settings-title`}>閱讀偏好</h2>
      <fieldset className="settings-group">
        <legend>主題</legend>
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
      <div className="field">
        <label htmlFor={`${idPrefix}-font-size`}>正文字級：{settings.fontSize}px</label>
        <input
          id={`${idPrefix}-font-size`}
          type="range"
          min="15"
          max="22"
          disabled={!hydrated}
          value={settings.fontSize}
          onChange={(event) => updateNumber('fontSize', Number(event.target.value))}
        />
      </div>
      <div className="field">
        <label htmlFor={`${idPrefix}-code-font-size`}>程式碼字級：{settings.codeFontSize}px</label>
        <input
          id={`${idPrefix}-code-font-size`}
          type="range"
          min="12"
          max="20"
          disabled={!hydrated}
          value={settings.codeFontSize}
          onChange={(event) => updateNumber('codeFontSize', Number(event.target.value))}
        />
      </div>
      <div className="settings-actions">
        <button className="button secondary" type="button" disabled={!hydrated} onClick={reset}>
          恢復預設
        </button>
      </div>
    </section>
  );
}
