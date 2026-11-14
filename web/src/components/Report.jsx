import { useEffect, useRef, useState } from 'react';
import { reportUrl } from '../api.js';

// The report is the counter's own page (same figures as the file), shown in a frame that grows with its content.
export default function Report({ stamp }) {
  const frame = useRef(null);
  const [height, setHeight] = useState(400);
  const [src, setSrc] = useState(() => reportUrl(stamp));
  useEffect(() => {
    if (stamp) setSrc(reportUrl(stamp));
  }, [stamp]);

  const onLoad = () => {
    const doc = frame.current && frame.current.contentDocument;
    const main = doc && doc.querySelector('main');
    if (!main) return;
    const fit = () => setHeight(Math.ceil(main.getBoundingClientRect().height));
    fit();
    if (window.ResizeObserver) {
      const obs = new ResizeObserver(fit);
      obs.observe(main);
    }
  };

  return <iframe ref={frame} className="report" title="Report" scrolling="no" src={src} onLoad={onLoad} style={{ height }} />;
}
