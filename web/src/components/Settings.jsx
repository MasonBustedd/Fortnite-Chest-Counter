import { useState } from 'react';
import { Button, Card, Row, Select, Switch } from './Primitives.jsx';

export default function Settings({ S, T, call }) {
  const s = S.settings;
  const [folder, setFolder] = useState(s.demos);
  // Keep the typed path while the page refreshes, and show the saved one once it changed on the counter's side.
  const [saved, setSaved] = useState(s.demos);
  if (saved !== s.demos) {
    setSaved(s.demos);
    setFolder(s.demos);
  }
  return (
    <div className="stack">
      <Card>
        <Row title={T.language}>
          <Select label={T.language} value={s.language} options={s.languages} onChange={(v) => call('language', v)} />
        </Row>
        <Row title={T.times} help={T.timesHelp}>
          <Select
            label={T.times}
            value={s.timeZone}
            options={[['local', T.timesLocal.replace('{0}', s.localZone)], ['utc', T.timesUtc]]}
            onChange={(v) => call('timeZone', v)}
          />
        </Row>
        <Row title={T.clock}>
          <Select
            label={T.clock}
            value={s.clockFormat}
            options={[
              ['auto', T.clockAuto.replace('{0}', s.windowsClock === '24' ? T.h24 : T.h12)],
              ['12', T.clock12],
              ['24', T.clock24],
            ]}
            onChange={(v) => call('clockFormat', v)}
          />
        </Row>
        {S.profiles.length > 1 && (
          <Row title={T.profile}>
            <Select
              label={T.profile}
              value={S.profileKey}
              options={S.profiles.map((p) => [p.key, p.name + ' (' + p.matches + ' · ' + p.chests + ')'])}
              onChange={(v) => call('profile', v)}
            />
          </Row>
        )}
        {s.windowed && (
          <Row title={T.tray} help={T.trayHelp}>
            <Switch label={T.tray} checked={s.minimizeToTray} onChange={(v) => call('minimizeToTray', v)} />
          </Row>
        )}
        {s.canStartWithFortnite && (
          <Row title={T.withFortnite} help={T.withFortniteHelp}>
            <Switch label={T.withFortnite} checked={s.startWithFortnite} onChange={(v) => call('startWithFortnite', v)} />
          </Row>
        )}
        <Row title={T.updates}>
          <Select
            label={T.updates}
            value={s.updateMode}
            options={[['prompt', T.upPrompt], ['auto', T.upAuto], ['off', T.upOff]]}
            onChange={(v) => call('updateMode', v)}
          />
        </Row>
        <div className="row folder-row">
          <div className="row-text">
            <div className="row-title">{T.demos}</div>
            {!s.demosExists && <div className="row-help warn-text">{T.demosMissing}</div>}
          </div>
          <div className="actions">
            <input type="text" aria-label={T.demos} value={folder} onChange={(e) => setFolder(e.target.value)} />
            <Button onClick={() => call('demosFolder', folder)}>{T.save}</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
