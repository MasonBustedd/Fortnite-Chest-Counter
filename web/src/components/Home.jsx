import { AnimatePresence, motion } from 'framer-motion';
import { Card, CountUp, Button, Pencil } from './Primitives.jsx';
import { fmt } from '../util.js';

function Welcome({ S, T, call }) {
  return (
    <Card className="welcome" delay={0}>
      <h2 className="pirate">{T.welcome}</h2>
      <p className="muted-top">{T.welcomeText}</p>
      <div className="row-title" style={{ marginTop: 14 }}>{T.welcomeQuick}</div>
      <div className="welcome-actions">
        <Button variant="main" onClick={() => call('dismissWelcome')}>{T.welcomeDone}</Button>
      </div>
    </Card>
  );
}

function Tile({ hero, label, sub, value, delay, onEdit, editLabel }) {
  return (
    <motion.div
      className={'tile' + (hero ? ' hero' : '')}
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.35, delay, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {hero ? (
        <>
          <div className="l">{label}</div>
          <div className="v num"><CountUp value={value} /></div>
          <div className="l">{sub}</div>
          <button type="button" className="editbtn" onClick={onEdit} title={editLabel} aria-label={editLabel}>
            <Pencil />
          </button>
        </>
      ) : (
        <>
          <div className="v num"><CountUp value={value} /></div>
          <div className="l">{label}{sub ? <>{sub}</> : null}</div>
        </>
      )}
    </motion.div>
  );
}

export default function Home({ S, T, call, onReport, onEdit }) {
  const update = S.update;
  return (
    <div className="stack">
      {S.autoClose && (
        <Card className="notice warning">
          <div>
            <b>{S.status.text}</b>
            <br />
            {T.autoCloseText}
          </div>
          <div className="actions"><Button variant="main" onClick={() => call('keepOpen')}>{T.keepOpen}</Button></div>
        </Card>
      )}
      {S.firstRun && <Welcome S={S} T={T} call={call} />}
      {S.progress && (
        <Card>
          <b>{T.analyzing} {S.progress.done} / {S.progress.total}</b>
          <div className="bar">
            <motion.i
              animate={{ width: Math.round((100 * S.progress.done) / Math.max(1, S.progress.total)) + '%' }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </Card>
      )}
      {S.whatsNew && S.whatsNew.length > 0 && (
        <Card>
          <h2 className="pirate">{fmt(T.whatsNew, S.version)}</h2>
          <ul>{S.whatsNew.map((n, i) => <li key={i}>{n}</li>)}</ul>
          <Button variant="main" onClick={() => call('dismissWhatsNew')}>{T.ok}</Button>
        </Card>
      )}
      {update && (
        <Card>
          <h2 className="pirate">{fmt(T.newVersion, update.version)}</h2>
          <ul>{update.notes.map((n, i) => <li key={i}>{n}</li>)}</ul>
          <Button variant="main" onClick={() => call('installUpdate')}>{T.install}</Button>
        </Card>
      )}

      <section className="tiles">
        <Tile
          hero
          label={T.total}
          value={S.total}
          sub={
            <>
              {T.totalSub}
              {S.manual && <><br />{fmt(T.byHand, S.manualText.replace('+', ''))}</>}
            </>
          }
          onEdit={onEdit}
          editLabel={T.editChests}
          delay={0}
        />
        <Tile label={<>{T.session} · {S.sessionMatches} {T.matches}</>} value={S.session} delay={0.05} />
        <Tile
          label={S.last ? <>{T.last}<br />{S.last.when} · {S.last.mode}</> : <>{T.last}</>}
          value={S.last ? S.last.chests : '—'}
          delay={0.1}
        />
        {S.squad && (
          <Tile
            label={
              <>
                {T.squad}
                <span className="badge" title={T.inaccurateWhy}>{T.inaccurate}</span>
                <br />
                {fmt(T.squadSub, S.squad.team)}
              </>
            }
            value={S.squad.total}
            delay={0.15}
          />
        )}
        <Tile
          label={<>{T.treasures} · {S.matches} {T.matches} · {fmt(T.perMatch, S.average)}</>}
          value={'★ ' + S.treasures}
          delay={0.2}
        />
      </section>

      <div className="actions">
        <Button variant="main" onClick={onReport}>{T.openReport}</Button>
        {S.overlay.running && (
          <>
            <Button onClick={() => call('toggleOverlayVisible')}>{S.overlay.visible ? T.hideOverlay : T.showOverlay}</Button>
            <Button onClick={() => call('toggleOverlayLock')}>{S.overlay.locked ? T.unlock : T.lock}</Button>
          </>
        )}
        {!update && S.updatesOn && <Button onClick={() => call('checkUpdate')}>{T.checkUpdate}</Button>}
      </div>

      <Card className="activity">
        <h2 className="pirate">{T.activity}</h2>
        <div className="log">
          {S.activity.length === 0 && <span className="mut">{T.noActivity}</span>}
          <AnimatePresence initial={false}>
            {S.activity.map((line, i) => (
              <motion.div key={i + '-' + line.map((s) => s.t).join('')} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}>
                {line.map((s, j) => (
                  <span key={j} className={s.c}>{s.t}</span>
                ))}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </Card>
    </div>
  );
}
