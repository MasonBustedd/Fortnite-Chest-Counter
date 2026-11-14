import { useState } from 'react';
import { act, overlayUrl } from '../api.js';
import { Button, Card, Row, Select, Switch } from './Primitives.jsx';

export default function Overlay({ S, T, call }) {
  const o = S.overlay;
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await act('copyObsPath');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="stack">
      <Card>
        <Row title={T.inGame} help={T.inGameHelp}>
          <Switch label={T.inGame} checked={o.show} onChange={(v) => call('showOverlay', v)} />
        </Row>
        <Row title={T.style}>
          <Select label={T.style} value={o.style} options={[['hud', T.hud], ['classic', T.classic]]} onChange={(v) => call('overlayStyle', v)} />
        </Row>
        {o.show && (
          <>
            <Row title={T.size}>
              <Select label={T.size} value={o.size} options={o.sizes.map((x) => [x, x + ' %'])} onChange={(v) => call('overlaySize', Number(v))} />
            </Row>
            <Row title={T.opacity}>
              <Select label={T.opacity} value={o.opacity} options={o.opacities.map((x) => [x, x + ' %'])} onChange={(v) => call('overlayOpacity', Number(v))} />
            </Row>
          </>
        )}
        <Row
          title={<>{T.squadToggle}<span className="badge" title={T.inaccurateWhy}>{T.inaccurate}</span></>}
          help={<>{T.squadHelp}<br />{T.inaccurateWhy}</>}
        >
          <Switch label={T.squadToggle} checked={o.squad} onChange={(v) => call('showSquadTotal', v)} />
        </Row>
      </Card>

      <section>
        <h2 className="pirate">{T.obs}</h2>
        <Card>
          <span className="path">{S.paths.overlay}</span>
          <p className="note">{T.obsSteps}</p>
          <div className="actions">
            <Button variant="main" onClick={copy}>{copied ? T.copied : T.copy}</Button>
            <Button onClick={() => window.open(overlayUrl(), '_blank')}>{T.preview}</Button>
          </div>
        </Card>
      </section>
    </div>
  );
}
