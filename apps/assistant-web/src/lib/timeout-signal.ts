// Polyfill of AbortSignal.timeout().
export const timeoutSignal = (ms: number): AbortSignal => {
  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    controller.abort(
      new DOMException('The operation timed out.', 'TimeoutError'),
    );
  }, ms);

  controller.signal.addEventListener(
    'abort',
    () => {
      clearTimeout(timeoutId);
    },
    { once: true },
  );

  return controller.signal;
};
