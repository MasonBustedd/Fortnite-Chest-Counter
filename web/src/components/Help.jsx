import { act } from '../api.js';
import { Button, Card } from './Primitives.jsx';

export default function Help({ S, T, call }) {
  const uninstall = async (all) => {
    if (!window.confirm(T.uninstallConfirm)) return;
    await act('uninstall', all);
    window.location.reload();
  };
  return (
    <div className="stack">
      <Card>
        <p className="top-p">{T.helpText}</p>
        <div className="actions">
          <Button onClick={() => call('openDataFolder')}>{T.dataFolder}</Button>
          {S.paths.errorLog && <Button onClick={() => call('openErrorLog')}>{T.errorLog}</Button>}
          <Button onClick={() => call('openIssues')}>{T.issue}</Button>
          <Button onClick={() => call('openRepo')}>{T.project}</Button>
        </div>
      </Card>
      {S.canUninstall && (
        <section>
          <h2 className="pirate">{T.uninstall}</h2>
          <Card>
            <span className="path">{S.paths.data}</span>
            <div className="actions">
              <Button variant="danger" onClick={() => uninstall(false)}>{T.uninstall} · {T.keepData}</Button>
              <Button variant="danger" onClick={() => uninstall(true)}>{T.uninstall} · {T.deleteData}</Button>
            </div>
          </Card>
        </section>
      )}
    </div>
  );
}
