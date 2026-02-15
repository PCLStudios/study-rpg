export function getSP() {
  if (typeof window === 'undefined') return 1250;
  const sp = localStorage.getItem('sp');
  return sp ? parseInt(sp, 10) : 1250;
}
export function setSP(value) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('sp', String(value));
}
