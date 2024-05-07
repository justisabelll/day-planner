export function rateLimit<T extends any[]>(
  fn: (...args: T) => void,
  delay: number
) {
  let lastCall = 0;
  return function (...args: T) {
    const now = Date.now();
    if (now - lastCall < delay) {
      return;
    }
    lastCall = now;
    return fn(...args);
  };
}
