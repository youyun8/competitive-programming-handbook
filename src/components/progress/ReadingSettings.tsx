import { useEffect, useState } from 'react';
import { saveReadingSettings } from '@/lib/sync/store';

const defaults = { fontSize: 17, contentWidth: 48, codeFontSize: 14 };

export default function ReadingSettings() {
  const [settings, setSettings] = useState(defaults);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('ac-reading-settings') || '{}');
    setSettings({ ...defaults, ...saved });
  }, []);

  async function update(key: keyof typeof defaults, value: number) {
    const next = { ...settings, [key]: value };
    setSettings(next);
    localStorage.setItem('ac-reading-settings', JSON.stringify(next));
    document.documentElement.style.setProperty(
      key === 'fontSize'
        ? '--font-size'
        : key === 'contentWidth'
          ? '--reading-width'
          : '--code-font-size',
      `${value}${key === 'contentWidth' ? 'rem' : 'px'}`
    );
    await saveReadingSettings({
      theme: document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light',
      ...next,
      updatedAt: new Date().toISOString()
    });
  }

  return (
    <section className="card" aria-labelledby="reading-settings-title">
      <h2 id="reading-settings-title">閱讀偏好</h2>
      <div className="field">
        <label htmlFor="font-size">正文字級：{settings.fontSize}px</label>
        <input
          id="font-size"
          type="range"
          min="15"
          max="22"
          value={settings.fontSize}
          onChange={(event) => update('fontSize', Number(event.target.value))}
        />
      </div>
      <div className="field">
        <label htmlFor="content-width">正文寬度：{settings.contentWidth}rem</label>
        <input
          id="content-width"
          type="range"
          min="38"
          max="62"
          value={settings.contentWidth}
          onChange={(event) => update('contentWidth', Number(event.target.value))}
        />
      </div>
      <div className="field">
        <label htmlFor="code-font-size">程式碼字級：{settings.codeFontSize}px</label>
        <input
          id="code-font-size"
          type="range"
          min="12"
          max="20"
          value={settings.codeFontSize}
          onChange={(event) => update('codeFontSize', Number(event.target.value))}
        />
      </div>
    </section>
  );
}
