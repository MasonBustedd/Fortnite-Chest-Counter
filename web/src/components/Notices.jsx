import { AnimatePresence, motion } from 'framer-motion';
import { Button } from './Primitives.jsx';

// Messages of the content file (a known problem, a fix to install): above every tab.
export default function Notices({ S, T, call }) {
  return (
    <AnimatePresence initial={false}>
      {(S.notices || []).map((n) => (
        <motion.div
          key={n.id}
          className={'card notice' + (n.level === 'warning' ? ' warning' : '')}
          role={n.level === 'warning' ? 'alert' : 'status'}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, height: 0 }}
        >
          <span className="ni" aria-hidden="true">{n.level === 'warning' ? '!' : 'i'}</span>
          <div className="nb">
            {n.title && <div className="nt">{n.title}</div>}
            <div className="nx">{n.text}</div>
            {n.link && (
              <div className="actions">
                <Button variant={n.level === 'warning' ? 'main' : ''} onClick={() => window.open(n.link, '_blank')}>{T.moreInfo}</Button>
              </div>
            )}
          </div>
          {n.level === 'info' && (
            <button type="button" className="nclose" title={T.close} aria-label={T.close} onClick={() => call('dismissNotice', n.id)}>
              ×
            </button>
          )}
        </motion.div>
      ))}
    </AnimatePresence>
  );
}
