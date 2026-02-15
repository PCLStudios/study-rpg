export function getChuts() {
  if (typeof window === 'undefined') return 1250;
  // backward compatibility: check 'chuts' then 'sp'
  const c = localStorage.getItem('chuts');
  if (c) return parseInt(c, 10);
  const sp = localStorage.getItem('sp');
  return sp ? parseInt(sp, 10) : 1250;
}
export function setChuts(value) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('chuts', String(value));
}

// legacy aliases
export const getSP = getChuts;
export const setSP = setChuts;

// spins helpers
export function getSpins() {
  if (typeof window === 'undefined') return 0;
  const s = localStorage.getItem('spins');
  return s ? parseInt(s, 10) : 0;
}

export function setSpins(value) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('spins', String(value));
}
