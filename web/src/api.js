// The counter serves this page and answers its requests on 127.0.0.1 only; the token from the address protects them.
const params = new URLSearchParams(location.search);
export const token = params.get('t') || '';
export const windowed = params.get('w') === '1';
const host = window.chrome && window.chrome.webview;

export async function getState() {
  const r = await fetch('/api/state', { headers: { 'X-Token': token } });
  if (!r.ok) throw new Error('state ' + r.status);
  return r.json();
}

export async function act(action, value) {
  const r = await fetch('/api/action', {
    method: 'POST',
    headers: { 'X-Token': token, 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, value }),
  });
  const j = await r.json();
  return j.result;
}

export const reportUrl = (stamp) => `/report?t=${token}&v=${encodeURIComponent(stamp)}`;
export const overlayUrl = () => `/overlay?t=${token}`;

// Window controls of the counter's own window (its title bar is drawn here).
export function winAction(a) {
  if (host) host.postMessage({ win: a });
}
export function onWindowState(fn) {
  if (!host) return () => {};
  const handler = (e) => {
    if (e.data && typeof e.data.maximized === 'boolean') fn(e.data.maximized);
  };
  host.addEventListener('message', handler);
  return () => host.removeEventListener('message', handler);
}
