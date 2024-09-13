export const throttled = (fn, delay = 1000) => {
  let lastCall = 0;
  return function (...rest) {
    const now = Date.now();

    if (now - lastCall < delay) {
      return;
    }
    lastCall = now;
    return fn(...rest);
  };
};

export const debounced = (fn, delay = 1000) => {
  let timerId;
  return function (...args) {
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      fn(...args);
      timerId = null;
    }, delay);
  };
};

export const debouncedAsync = (fn, delay = 1000) => {
  let timerId;
  return async function (...args) {
    if (timerId) {
      clearTimeout(timerId);
    }
    return await new Promise((resolve, reject) => {
      timerId = setTimeout(() => {
        const response = fn(...args);
        resolve(response);
        timerId = null;
      }, delay);
    });
  };
};

export const wait = (timeMs = 1000) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, timeMs);
  });
};
