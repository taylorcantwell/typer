import * as React from 'react';
import { useMethods } from 'react-use';

export const useCountDown = (countDown: number) => {
  const [state, counter] = useMethods(createMethods, {
    countDown,
    currentTime: countDown,
    expired: false,
    paused: true,
  });

  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(
    function startCounter() {
      if (state.paused === true) return;

      intervalRef.current = setInterval(() => counter.tick(), 1000);
      return () => clearInterval(intervalRef.current!);
    },
    [state.paused]
  );

  React.useEffect(function expire() {
    if (state.currentTime === 0) {
      counter.expire();
      return clearInterval(intervalRef.current!);
    }
  });

  return {
    state,
    stop: counter.stop,
    start: counter.start,
    reset: counter.reset,
  };
};

type IntialState = {
  countDown: number;
  currentTime: number;
  expired: boolean;
  paused: boolean;
};

const createMethods = (state: IntialState) => {
  return {
    stop() {
      return { ...state, paused: true };
    },
    expire() {
      return { ...state, expired: true };
    },
    reset() {
      return {
        ...state,
        currentTime: state.countDown,
        expired: false,
        paused: true,
      };
    },
    start() {
      return { ...state, paused: false };
    },
    tick() {
      return { ...state, currentTime: state.currentTime - 1 };
    },
  };
};
