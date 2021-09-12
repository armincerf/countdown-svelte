import { readable } from "svelte/store";
let timeLeft = 30;
export const time = readable(timeLeft, function start(set) {
  const interval = setInterval(() => {
    if (timeLeft >= 0) {
      set(timeLeft - 0.1);
    } else {
      clearInterval(interval);
    }
  }, 100);

  return function stop() {
    clearInterval(interval);
  };
});
