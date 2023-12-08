import { useEvent, useMethods } from 'react-use';
import * as React from 'react';

import { useCountDown } from './useCountDown';

type GameStatus = 'idle' | 'typing' | 'finished';

const initialState = {
  gameStatus: 'idle' as GameStatus,
  input: '',
  countDown: 0,
  currentPosition: 0,
  mistakeCount: 0,
};

type UseGameControllerOptions = {
  time: number;
  wordCount: number;
};

export function useGameController(options: UseGameControllerOptions) {
  const counter = useCountDown(options.time);

  const [gameState, gameController] = useMethods(
    (state) => {
      return {
        restart() {
          counter.reset();
          return {
            ...initialState,
            words: generateRandomWords(options.wordCount),
          };
        },
        incrementPosition(key: string) {
          return {
            ...state,
            input: state.input.concat(key),
            currentPosition: state.currentPosition + 1,
          };
        },
        setGameStatus(newState: GameStatus) {
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
      if (counter.state.expired && gameState.gameStatus !== 'finished') {
        gameController.setGameStatus('finished');
      }
    },
    [counter.state.expired, gameController, gameController.setGameStatus]
  );

  useEvent('keydown', (event: KeyboardEvent) => {
    if (
      gameState.gameStatus === 'finished' ||
      !isKeyboardCodeAllowed(event.code)
    ) {
      return;
    }

    if (gameState.gameStatus === 'idle') {
      gameController.setGameStatus('typing');
      counter.start();
    }

    if (event.key === gameState.words[gameState.currentPosition]) {
      gameController.incrementPosition(event.key);

      const isLastLetter =
        gameState.currentPosition === gameState.words.length - 1;
      if (isLastLetter) {
        gameController.setGameStatus('finished');
        counter.stop();
      }
    } else {
      gameController.incrementMistakeCounter();
    }
  });

  return {
    gameStatus: gameState.gameStatus,
    words: gameState.words,
    input: gameState.input,
    remainingTime: counter.state.currentTime,
    accuracy: calculateAccuracy(
      gameState.currentPosition,
      gameState.mistakeCount
    ),
    charactersPerMinute: calculateCharactersPerMinute(
      gameState.currentPosition,
      options.time - counter.state.currentTime
    ),
    mistakeCount: gameState.mistakeCount,
    restart: gameController.restart,
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

function calculateAccuracy(correctCount: number, mistakeCount: number): number {
  if (!correctCount && !mistakeCount) return 0;
  return Math.round((correctCount / (correctCount + mistakeCount)) * 100);
}

function generateRandomWords(wordCount: number): string {
  if (wordCount < 1) {
    throw new Error('Word count must be greater than 0');
  }

  return Array.from(
    { length: wordCount },
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
