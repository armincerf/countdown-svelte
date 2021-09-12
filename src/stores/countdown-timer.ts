import { writable } from "svelte/store";

export const GAME_TIME = 3;
const COUNTDOWN_FROM = GAME_TIME * 1000;

export const time = writable(COUNTDOWN_FROM / 1000);
export const isRunning = writable(false);
export const isComplete = writable(false);

const createTimer = () => {
  let animationRef: number;
  let latestStartTime: number;
  let remainingTime = COUNTDOWN_FROM;

  const animate = (timestamp: number) => {
    // is it the first iteration in this cycle?
    if (latestStartTime === undefined) {
      // make a note of the start time
      latestStartTime = timestamp + remainingTime;
    }
    // the time to display now
    const currentTime = latestStartTime - timestamp;
    if (currentTime <= 0) {
      cancelAnimationFrame(animationRef);
      time.set(0);
      isRunning.set(false);
      isComplete.set(true);
      return;
    }
    time.set(currentTime / 1000);

    // keep animating recursively
    animationRef = requestAnimationFrame(animate);
  };

  const api = {
    start: () => {
      isRunning.set(true);
      animationRef = requestAnimationFrame(animate);
    },

    pause: () => {
      cancelAnimationFrame(animationRef);
      if (latestStartTime !== undefined) {
        // prepare for the next cycle
        remainingTime = latestStartTime - performance.now();
        latestStartTime = undefined;
      }
      isRunning.set(false);
    },

    reset: () => {
      remainingTime = COUNTDOWN_FROM;
      latestStartTime = undefined;
      time.set(remainingTime / 1000);
      isRunning.set(false);
      isComplete.set(false);
      cancelAnimationFrame(animationRef);
    },
  };

  return api;
};

export const timer = createTimer();
