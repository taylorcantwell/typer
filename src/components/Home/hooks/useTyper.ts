import { useEffect } from 'react';
import { useEvent, useMethods } from 'react-use';
import { useCountDown } from './useCountDown';

export const useTyper = (options: { time: number; wordCount: number }) => {
  const { time, wordCount } = options;
  const {
    state: countDownState,
    startCountDown,
    stopCountDown,
    resetCountDown,
  } = useCountDown(time);

  const initialState = {
    state: 'idle',
    randomWords: generateRandomWords(wordCount),
    input: '',
    countDown: countDownState.currentTime,
    currentPosition: 0,
    mistakes: 0,
  };

  function createMethods(state: typeof initialState) {
    return {
      onReset() {
        resetCountDown();
        return initialState;
      },
      onMatch(key: string) {
        return {
          ...state,
          input: state.input.concat(key),
          currentPosition: state.currentPosition + 1,
        };
      },
      setAppState(newState: 'idle' | 'typing' | 'finished') {
        return { ...state, state: newState };
      },
      onMistake() {
        return { ...state, mistakes: state.mistakes + 1 };
      },
    };
  }

  const [{ randomWords, state, input, currentPosition, mistakes }, methods] =
    useMethods(createMethods, initialState);

  useEffect(function onCountDownEnd() {
    if (countDownState.expired && state === 'typing') {
      methods.setAppState('finished');
    }
  });

  useEvent('keydown', ({ key, code }: KeyboardEvent) => {
    if (state === 'finished' || !isKeyboardCodeAllowed(code)) {
      return;
    }

    if (state === 'idle') {
      methods.setAppState('typing');
      startCountDown();
    }

    if (key === randomWords[currentPosition]) {
      methods.onMatch(key);

      if (currentPosition === randomWords.length - 1) {
        methods.setAppState('finished');
        stopCountDown();
      }
    } else {
      methods.onMistake();
    }
  });

  const accuracy = calculateAccuracy(currentPosition, mistakes);
  const charactersPerMinute = calculateCPM(
    currentPosition,
    time - countDownState.currentTime
  );

  return {
    typerState: state,
    randomWords,
    input,
    remainingTime: countDownState.currentTime,
    accuracy,
    charactersPerMinute,
    mistakes,
    reset: methods.onReset,
  };
};

const isKeyboardCodeAllowed = (code: string) => {
  return code.startsWith('Key') || code === 'Space';
};

const calculateCPM = (characters: number, time: number) => {
  if (characters === 0 || time === 0) return 0;

  return Math.round(characters / (time / 60));
};

const calculateAccuracy = (correct = 0, mistakes = 0) => {
  if (!correct && !mistakes) {
    return 0;
  }

  const accuracy = correct / (correct + mistakes);
  return Math.round(accuracy * 100);
};

const generateRandomWords = (count: number) => {
  const randomWords = [];

  for (let i = 0; i < count; i++) {
    randomWords.push(words[Math.floor(Math.random() * words.length)]);
  }

  return randomWords.join(' ');
};

const words = [
  'auto',
  'rich',
  'litas',
  'kitten',
  'firewall',
  'siren',
  'toilet',
  'alphabet',
  'unicorn',
  'irate',
  'bizzare',
  'puppy',
  'pizza',
  'pancake',
  'flamingo',
  'zebra',
  'zombie',
  'deranged',
  'dig',
  'billowy',
  'wax',
  'decay',
  'puffy',
  'punch',
  'ugly',
  'productive',
  'fuzzy',
  'society',
  'contradict',
  'fortunate',
  'elbow',
  'fight',
  'frighten',
  'frightened',
  'frightening',
  'frighteningly',
];
