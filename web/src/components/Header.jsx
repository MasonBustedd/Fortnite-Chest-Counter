import { motion } from 'framer-motion';
function Logo() {
  return (
    <svg width="44" height="44" viewBox="0 0 56 56" aria-hidden="true">
      <rect x="6" y="20" width="44" height="28" rx="4" fill="#7a4a1e" stroke="#e7b440" strokeWidth="3" />
      <path d="M6 26 Q28 4 50 26" fill="#965d27" stroke="#e7b440" strokeWidth="3" />
      <rect x="24" y="24" width="8" height="10" rx="2" fill="#e7b440" />
    </svg>
  );
}

export default function Header({ S, call }) {
  const T = S.txt;
  return (
    <header className="header">
      <div className="brand">
        <motion.div initial={{ rotate: -8, scale: 0.9 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }}>
          <Logo />
        </motion.div>
        <div>
          <h1 className="pirate">{S.appName}</h1>
          <div className="who">
            {S.profiles.length > 1 ? (
              <select aria-label={T.profile} title={T.profile} value={S.profileKey} onChange={(e) => call('profile', e.target.value)}>
                {S.profiles.map((p) => (
                  <option key={p.key} value={p.key}>
                    {p.name} ({p.matches})
                  </option>
                ))}
              </select>
            ) : (
              <span>{S.player || ''}</span>
            )}
            <span>v{S.version}</span>
          </div>
        </div>
      </div>
      <motion.span key={S.status.kind} className={'pill ' + S.status.kind} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}>
        <i className={S.status.kind === 'live' ? 'pulse' : ''} />
        {S.status.text}
      </motion.span>
    </header>
  );
}

