import { useEvent, useMethods } from 'react-use';
import { useCountDown } from './useCountDown';
import * as React from 'react';

type UseTyperOptions = {
  time: number;
  wordCount: number;
};

export function useTyper(options: UseTyperOptions) {
  const counter = useCountDown(options.time);

  const initialState = {
    gameState: 'idle',
    randomWords: generateRandomWords(options.wordCount),
    input: '',
    countDown: options.time,
    currentPosition: 0,
    mistakes: 0,
  };

  function createMethods(state: typeof initialState) {
    return {
      restartGame() {
        counter.reset();
        return initialState;
      },
      onMatch(key: string) {
        return {
          ...state,
          input: state.input.concat(key),
          currentPosition: state.currentPosition + 1,
        };
      },
      setGameState(newState: 'idle' | 'typing' | 'finished') {
        return { ...state, gameState: newState };
      },
      incrementMistakeCounter() {
        return { ...state, mistakes: state.mistakes + 1 };
      },
    };
  }

  const [state, setState] = useMethods(createMethods, initialState);

  React.useEffect(
    function onCountDownEnd() {
      if (counter.state.expired) {
        setState.setGameState('finished');
      }
    },
    [counter.state.expired, setState.setGameState]
  );

  useEvent('keydown', ({ key, code }: KeyboardEvent) => {
    if (state.gameState === 'finished' || !isKeyboardCodeAllowed(code)) return;

    if (state.gameState === 'idle') {
      setState.setGameState('typing');
      counter.start();
    }

    if (key === state.randomWords[state.currentPosition]) {
      setState.onMatch(key);

      const isLastLetter =
        state.currentPosition === state.randomWords.length - 1;
      if (isLastLetter) {
        setState.setGameState('finished');
        counter.stop();
      }
    } else {
      setState.incrementMistakeCounter();
    }
  });

  const accuracy = calculateAccuracy(state.currentPosition, state.mistakes);
  const charactersPerMinute = calculateCPM(
    state.currentPosition,
    options.time - counter.state.currentTime
  );

  return {
    typerState: state,
    randomWords,
    input,
    remainingTime: counter.state.currentTime,
    accuracy,
    charactersPerMinute,
    mistakes,
    reset: methods.onReset,
  };
}

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
