import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { act } from '../api.js';
import { Button } from './Primitives.jsx';
import { fmt } from '../util.js';

// The edit box of "Chests in total": chests opened before the counter, and an estimate from the career matches.
export default function ManualDialog({ open, onClose, S, T, call }) {
  const ref = useRef(null);
  const downOnBackdrop = useRef(false);
  const [amount, setAmount] = useState('');
  const [week, setWeek] = useState(false);
  const [career, setCareer] = useState('');
  const [estimate, setEstimate] = useState(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const add = async () => {
    const n = parseInt(amount || '0', 10);
    if (!n) return;
    await call('manualAdd', { chests: n, thisWeek: week });
    setAmount('');
  };
  const compute = async () => {
    const r = await act('estimate', parseInt(career || '0', 10));
    setEstimate(r || null);
  };
  const addEstimate = async () => {
    if (!estimate || estimate.error) return;
    await call('manualEstimate', { chests: estimate.chests, career: estimate.career });
    setEstimate(null);
    setCareer('');
  };

  return (
    <dialog
      ref={ref}
      className="dialog"
      aria-labelledby="dlg-title"
      onClose={onClose}
      onPointerDown={(e) => {
        downOnBackdrop.current = e.target === ref.current;
      }}
      onClick={(e) => {
        if (downOnBackdrop.current && e.target === ref.current) onClose();
        downOnBackdrop.current = false;
      }}
    >
      <div className="dhead">
        <h2 className="pirate" id="dlg-title">{T.editChests}</h2>
        <button type="button" className="dclose" onClick={onClose} aria-label={T.close}>×</button>
      </div>
      <p className="note">{T.manualHelp}</p>
      <div className="mtotal">{fmt(T.manualTotal, S.manualText)}</div>
      <div className="actions">
        <input
          type="number"
          step="1"
          placeholder="0"
          aria-label={T.manual}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
        />
        <Button variant="main" onClick={add}>{T.addBtn}</Button>
      </div>
      {S.manualWeek ? (
        <label className="mweek">
          <input type="checkbox" checked={week} onChange={(e) => setWeek(e.target.checked)} />
          <b>{T.thisWeek}</b>
          <span>{fmt(T.thisWeekHelp, S.manualWeek)}</span>
        </label>
      ) : null}
      {S.manualHistory && S.manualHistory.length > 0 && (
        <ul className="mhist">
          <AnimatePresence initial={false}>
            {S.manualHistory.map((e) => (
              <motion.li key={e.id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                <b className="num">{e.chests}</b>
                <span>{[e.what, e.when].filter(Boolean).join(' · ')}</span>
                <button type="button" className="mx" title={T.removeEntry} aria-label={T.removeEntry} onClick={() => call('manualRemove', e.id)}>
                  ×
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}

      <div className="estimate-head">{T.estimate}</div>
      <p className="note">{T.estimateHelp}</p>
      <div className="actions">
        <input type="number" min="0" placeholder={T.career} aria-label={T.career} value={career} onChange={(e) => setCareer(e.target.value)} />
        <Button onClick={compute}>{T.compute}</Button>
      </div>
      {estimate && (
        <div className="estimate">
          {estimate.error ? (
            <span className="warn-text">{estimate.error}</span>
          ) : (
            <>
              <span>{estimate.text}</span>
              <div className="actions" style={{ marginTop: 8 }}>
                <Button variant="main" onClick={addEstimate}>{fmt(T.add, estimate.chestsText)}</Button>
              </div>
            </>
          )}
        </div>
      )}
    </dialog>
  );
}
