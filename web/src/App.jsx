import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { act, getState, onWindowState, windowed, winAction } from './api.js';
import Header from './components/Header.jsx';
import Home from './components/Home.jsx';
import Overlay from './components/Overlay.jsx';
import Settings from './components/Settings.jsx';
import Help from './components/Help.jsx';
import Report from './components/Report.jsx';
import Notices from './components/Notices.jsx';
import ManualDialog from './components/ManualDialog.jsx';
import { Button, Card } from './components/Primitives.jsx';

const TABS = ['home', 'report', 'overlay', 'settings', 'help'];

function readTab() {
  const h = location.hash.slice(1);
  if (TABS.includes(h)) return h;
  try {
    const saved = localStorage.getItem('cc-gui-tab');
    if (TABS.includes(saved)) return saved;
  } catch (e) {
    // no storage: start at home
  }
  return 'home';
}

function TitleBar({ maximized, T }) {
  const ctl = (a, label, icon) => (
    <button type="button" onClick={() => winAction(a)} title={label} aria-label={label} className={a === 'close' ? 'x' : ''}>
      {icon}
    </button>
  );
  return (
    <div className="titlebar">
      <div className="wctl">
        {ctl('min', T.wMin, <svg width="10" height="10" viewBox="0 0 10 10"><path d="M0 5.5h10" stroke="currentColor" strokeWidth="1.1" /></svg>)}
        {ctl(
          'max',
          maximized ? T.wRestore : T.wMax,
          <svg width="10" height="10" viewBox="0 0 10 10">
            <rect x=".55" y=".55" width="8.9" height="8.9" fill="none" stroke="currentColor" strokeWidth="1.1" />
          </svg>
        )}
        {ctl('close', T.wClose, <svg width="10" height="10" viewBox="0 0 10 10"><path d="M.5.5l9 9M9.5.5l-9 9" stroke="currentColor" strokeWidth="1.2" /></svg>)}
      </div>
    </div>
  );
}

export default function App() {
  const [S, setS] = useState(null);
  const [offline, setOffline] = useState(false);
  const [stopped, setStopped] = useState(false);
  const [tab, setTab] = useState(readTab);
  const [dialog, setDialog] = useState(false);
  const [maximized, setMaximized] = useState(false);
  const [dismissedUpdate, setDismissedUpdate] = useState(false);
  const stoppedRef = useRef(false);

  // Polls the counter every 2 seconds, once: the timer lives as long as the page.
  const refresh = async () => {
    if (stoppedRef.current) return;
    try {
      setS(await getState());
      setOffline(false);
    } catch (e) {
      setOffline(true);
    }
  };
  const refreshRef = useRef(refresh);
  refreshRef.current = refresh;

  useEffect(() => {
    refreshRef.current();
    const id = setInterval(() => refreshRef.current(), 2000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => onWindowState(setMaximized), []);

  // The report asks for the edit box through its pencil (a message from its frame).
  useEffect(() => {
    const onMessage = (e) => {
      if (e.origin === location.origin && e.data && e.data.cc === 'editChests' && S) setDialog(true);
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [S]);

  const go = (t) => {
    setTab(t);
    try {
      localStorage.setItem('cc-gui-tab', t);
    } catch (e) {
      // no storage: the tab is only kept until the page closes
    }
    history.replaceState(null, '', '#' + t);
  };

  const call = async (name, value) => {
    const result = await act(name, value);
    await refresh();
    return result;
  };

  const quit = async () => {
    if (!window.confirm(S.txt.quitConfirm)) return;
    try {
      await act('quit');
    } catch (e) {
      // the counter closes anyway
    }
    stoppedRef.current = true;
    setStopped(true);
  };

  if (stopped) {
    return (
      <div className={'app' + (windowed ? ' windowed' : '')}>
        <main className="closed">
          <Card>{S ? S.txt.closed : 'Chest Counter'}</Card>
        </main>
      </div>
    );
  }
  if (!S) {
    return (
      <div className="app">
        <main className="closed">
          <Card>{offline ? 'The counter does not answer.' : '…'}</Card>
        </main>
      </div>
    );
  }

  const T = S.txt;
  const showUpdateBanner = !!S.update && !dismissedUpdate && tab !== 'home';
  return (
    <div className={'app' + (windowed ? ' windowed' : '')}>
      {windowed && <TitleBar maximized={maximized} T={T} />}
      <div className="scroll">
        <main>
          {offline && (
            <Card className="offline">{T.offline}</Card>
          )}
          <Header S={S} call={call} />
          <nav className="nav" aria-label="Sections">
            {TABS.map((t) => (
              <button key={t} type="button" className={'nav-btn' + (t === tab ? ' on' : '')} onClick={() => go(t)} aria-current={t === tab ? 'page' : undefined}>
                {t === tab && <motion.span layoutId="nav-pill" className="nav-pill" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                <span className="nav-label">{T[t]}</span>
              </button>
            ))}
          </nav>
          <Notices S={S} T={T} call={call} />
          {showUpdateBanner && (
            <Card className="banner">
              <span>{T.newVersion.replace('{0}', S.update.version)}</span>
              <Button variant="main" onClick={() => call('installUpdate')}>{T.install}</Button>
              <button type="button" className="nclose" aria-label={T.close} onClick={() => setDismissedUpdate(true)}>×</button>
            </Card>
          )}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={tab}
              className="view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              {tab === 'home' && <Home S={S} T={T} call={call} onReport={() => go('report')} onEdit={() => setDialog(true)} />}
              {tab === 'report' && <Report stamp={S.reportStamp} />}
              {tab === 'overlay' && <Overlay S={S} T={T} call={call} />}
              {tab === 'settings' && <Settings S={S} T={T} call={call} />}
              {tab === 'help' && <Help S={S} T={T} call={call} />}
            </motion.div>
          </AnimatePresence>
          <footer className="foot">
            {S.settings.windowed ? (
              <span>{T.footerWindow}</span>
            ) : (
              <>
                <span>{T.footer}</span>
                <Button variant="danger" onClick={quit}>{T.quit}</Button>
              </>
            )}
          </footer>
        </main>
      </div>
      <ManualDialog open={dialog} onClose={() => setDialog(false)} S={S} T={T} call={call} />
    </div>
  );
}
