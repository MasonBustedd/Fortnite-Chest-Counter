import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

// A number that counts up or down to its new value instead of jumping.
export function CountUp({ value }) {
  const [shown, setShown] = useState(typeof value === 'number' ? value : 0);
  const from = useRef(shown);
  useEffect(() => {
    if (typeof value !== 'number') return;
    const start = performance.now();
    const begin = from.current;
    const distance = value - begin;
    if (distance === 0) return;
    let frame;
    const step = (now) => {
      const t = Math.min(1, (now - start) / 600);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = Math.round(begin + distance * eased);
      setShown(current);
      from.current = current;
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [value]);
  return typeof value === 'number' ? shown.toLocaleString() : value;
}

export function Row({ title, help, children }) {
  return (
    <div className="row">
      <div className="row-text">
        <div className="row-title">{title}</div>
        {help && <div className="row-help">{help}</div>}
      </div>
      <div className="row-control">{children}</div>
    </div>
  );
}

export function Switch({ checked, onChange, label }) {
  return (
    <label className="switch">
      <input type="checkbox" checked={!!checked} aria-label={label} onChange={(e) => onChange(e.target.checked)} />
      <span />
    </label>
  );
}

export function Select({ value, options, onChange, label }) {
  return (
    <select value={String(value)} aria-label={label} onChange={(e) => onChange(e.target.value)}>
      {options.map(([v, text]) => (
        <option key={String(v)} value={String(v)}>
          {text}
        </option>
      ))}
    </select>
  );
}

// A card that eases in when it appears, and lifts a little under the pointer.
export function Card({ className = '', children, delay = 0, ...rest }) {
  return (
    <motion.div
      className={'card ' + className}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: [0.2, 0.8, 0.2, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function Button({ variant = '', onClick, children, ...rest }) {
  return (
    <motion.button
      type="button"
      className={'btn ' + variant}
      onClick={onClick}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      {...rest}
    >
      {children}
    </motion.button>
  );
}

export function Pencil() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 20h4L19 9l-4-4L4 16z" />
      <path d="M14 6l4 4" />
    </svg>
  );
}
