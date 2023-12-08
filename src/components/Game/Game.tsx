import { RepeatIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Center,
  Flex,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import * as React from 'react';

import { trpc } from '../../utils/trpc';
import {
  Cursor,
  LeaderboardSubmissionModal,
  MistakeCounter,
} from './components';
import { useGameController } from './hooks';

export function Game() {
  const gameController = useGameController({
    time: 20,
    wordCount: 30,
  });

  const leaderBoardModal = useDisclosure();
  const isPlaying = gameController.gameStatus === 'typing';
  const isGameOver = gameController.gameStatus === 'finished';

  const hasMadeLeaderboardQuery = trpc.useQuery([
    'leaderboard.check-if-made-leader-board',
    gameController.charactersPerMinute,
  ]);

  React.useEffect(
    function checkIfMadeLeaderboard() {
      if (isGameOver && !leaderBoardModal.isOpen) {
        hasMadeLeaderboardQuery.data && leaderBoardModal.onOpen();
      }
    },
    [isGameOver, leaderBoardModal.onOpen, hasMadeLeaderboardQuery.data]
  );

  return (
    <>
      <LeaderboardSubmissionModal
        isOpen={leaderBoardModal.isOpen}
        onClose={leaderBoardModal.onClose}
        results={{
          accuracyPercent: gameController.accuracy,
          charactersPerMinute: gameController.charactersPerMinute,
          mistakeCount: gameController.mistakeCount,
        }}
      />

      <Center
        mt={'-10vh'}
        h="90vh"
        w="full"
        flexDir="column"
        color="yellow.400"
      >
        <Box userSelect="none" w="3xl" fontSize="30px">
          <Flex justifyContent="center">
            <Text as="samp">{gameController.remainingTime}</Text>
          </Flex>

          <Box position="relative" wordBreak="break-all" fontWeight="semibold">
            <Box position="absolute" inset="0">
              <Text as="samp">{gameController.input}</Text>
              {isPlaying && <Cursor />}
            </Box>
            <Text as="samp" color="gray.400">
              {gameController.words}
            </Text>
          </Box>
        </Box>

        <Button
          aria-disabled={!isGameOver}
          color="gray.300"
          variant="link"
          fontSize="xl"
          mt={4}
          onClick={gameController.restart}
          disabled={!isGameOver}
        >
          <motion.div
            key={`${isGameOver}`}
            animate={isGameOver && { scale: [1, 1.1, 1] }}
            transition={{
              duration: 0.5,
              ease: 'easeInOut',
              repeat: Infinity,
            }}
          >
            <RepeatIcon />
          </motion.div>
        </Button>

        <Flex
          mt={8}
          fontSize="xl"
          fontWeight="bold"
          gap={8}
          alignItems="center"
        >
          <Text as="samp">Accuracy: {gameController.accuracy}%</Text>
          <Text as="samp">CPM: {gameController.charactersPerMinute}</Text>
          <MistakeCounter mistakes={gameController.mistakeCount} />
        </Flex>
      </Center>
    </>
  );
}
