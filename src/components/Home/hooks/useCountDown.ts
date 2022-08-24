import { useEffect } from 'react';
import { useMethods } from 'react-use';

export const useCountDown = (countDown: number) => {
  const [state, methods] = useMethods(createMethods, {
    countDown,
    currentTime: countDown,
    expired: false,
    paused: true,
  });

  useEffect(
    function init() {
      if (state.currentTime === 0 && !state.expired) {
        methods.expire();
        return;
      }

      if (state.paused === true) {
        return;
      }

      const interval = setInterval(() => {
        if (state.currentTime === 0) {
          clearInterval(interval);
          return;
        }

        methods.tick();
      }, 1000);
      return () => clearInterval(interval);
    },
    [state.currentTime, state.expired, state.paused]
  );

  return {
    state,
    stopCountDown: methods.stopCountDown,
    resetCountDown: methods.resetCountDown,
    startCountDown: methods.startCountDown,
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
    stopCountDown() {
      return { ...state, paused: true };
    },
    expire() {
      return { ...state, expired: true };
    },
    resetCountDown() {
      return {
        ...state,
        currentTime: state.countDown,
        expired: false,
        paused: true,
      };
    },
    startCountDown() {
      return { ...state, paused: false };
    },
    tick() {
      return { ...state, currentTime: state.currentTime - 1 };
    },
  };
};
