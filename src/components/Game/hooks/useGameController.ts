import { useEvent, useMethods } from 'react-use';
import * as React from 'react';

import { useCountDown } from './useCountDown';

type UseGameControllerOptions = {
  time: number;
  wordCount: number;
};

const initialState = {
  gameStatus: 'idle' as 'idle' | 'typing' | 'finished',
  input: '',
  countDown: 0,
  currentPosition: 0,
  mistakeCount: 0,
};

export function useGameController(options: UseGameControllerOptions) {
  const counter = useCountDown(options.time);

  const [state, setState] = useMethods(
    (state) => {
      return {
        restart() {
          counter.reset();
          return {
            ...initialState,
            words: generateRandomWords(options.wordCount),
          };
        },
        onMatch(key: string) {
          return {
            ...state,
            input: state.input.concat(key),
            currentPosition: state.currentPosition + 1,
          };
        },
        setGameState(newState: 'idle' | 'typing' | 'finished') {
          return { ...state, gameStatus: newState };
        },
        incrementMistakeCounter() {
          return { ...state, mistakeCount: state.mistakeCount + 1 };
        },
      };
    },
    {
      ...initialState,
      words: generateRandomWords(options.wordCount),
    }
  );

  React.useEffect(
    function onCountDownEnd() {
      if (counter.state.expired && state.gameStatus !== 'finished') {
        setState.setGameState('finished');
      }
    },
    [counter.state.expired, setState, setState.setGameState]
  );

  useEvent('keydown', (event: KeyboardEvent) => {
    if (state.gameStatus === 'finished' || !isKeyboardCodeAllowed(event.code)) {
      return;
    }

    if (state.gameStatus === 'idle') {
      setState.setGameState('typing');
      counter.start();
    }

    if (event.key === state.words[state.currentPosition]) {
      setState.onMatch(event.key);

      const isLastLetter = state.currentPosition === state.words.length - 1;
      if (isLastLetter) {
        setState.setGameState('finished');
        counter.stop();
      }
    } else {
      setState.incrementMistakeCounter();
    }
  });

  return {
    gameStatus: state.gameStatus,
    words: state.words,
    input: state.input,
    remainingTime: counter.state.currentTime,
    accuracy: calculateAccuracy(state.currentPosition, state.mistakeCount),
    charactersPerMinute: calculateCharactersPerMinute(
      state.currentPosition,
      options.time - counter.state.currentTime
    ),
    mistakeCount: state.mistakeCount,
    restart: setState.restart,
  };
}

function isKeyboardCodeAllowed(code: string): boolean {
  return code.startsWith('Key') || code === 'Space';
}

function calculateCharactersPerMinute(
  characters: number,
  time: number
): number {
  if (characters === 0 || time === 0) return 0;
  return Math.round(characters / (time / 60));
}

function calculateAccuracy(correct: number, mistakes: number): number {
  if (!correct && !mistakes) return 0;
  return Math.round((correct / (correct + mistakes)) * 100);
}

function generateRandomWords(count: number): string {
  if (count < 1) {
    throw new Error('Word count must be greater than 0');
  }

  return Array.from(
    { length: count },
    () => words[Math.floor(Math.random() * words.length)]
  ).join(' ');
}

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
] as const;
