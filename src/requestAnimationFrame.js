const raf = (function _raf() {
  const w = window;
  ['ms', 'moz', 'webkit', 'o'].forEach(vendor => {
    if (!w.requestAnimationFrame) {
      w.requestAnimationFrame = w[`${vendor}RequestAnimationFrame`];
      w.cancelAnimationFrame =
        w[`${vendor}CancelAnimationFrame`] || w[`${vendor}CancelRequestAnimationFrame`];
    }
  });

  if (!w.requestAnimationFrame) {
    w.requestAnimationFrame = callback => {
      let currentTime;
      let targetTime = 0;
      targetTime = Math.max(targetTime + 16, (currentTime = +new Date()));
      return w.setTimeout(() => callback(+new Date()), targetTime - currentTime);
    };
  }

  if (!w.cancelAnimationFrame) {
    w.cancelAnimationFrame = id => clearTimeout(id);
  }
})();

export { raf };
