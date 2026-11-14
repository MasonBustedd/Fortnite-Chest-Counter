// Replaces {0}, {1}… in a text, like the counter's own texts do.
export function fmt(text, ...values) {
  return values.reduce((r, v, i) => r.replace('{' + i + '}', v), text);
}
