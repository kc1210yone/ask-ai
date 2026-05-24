// Polyfill of AbortSignal.timeout().
export const timeoutSignal = (timeout: number): AbortSignal => {
  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    controller.abort(
      new DOMException('The operation timed out.', 'TimeoutError'),
    );
  }, timeout);

  controller.signal.addEventListener(
    'abort',
    () => {
      clearTimeout(timeoutId);
    },
    { once: true },
  );

  return controller.signal;
};
