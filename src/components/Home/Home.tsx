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
import { useEffect } from 'react';
import { trpc } from '../../utils/trpc';
import {
  Cursor,
  LeaderboardSubmissionModal,
  MistakeCounter,
} from './components';
import { useTyper } from './hooks';

export const Home = () => {
  const {
    typerState,
    input,
    randomWords,
    remainingTime,
    accuracy,
    charactersPerMinute,
    mistakes,
    reset,
  } = useTyper({
    time: 20,
    wordCount: 30,
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const isActive = typerState === 'typing';
  const isFinished = typerState === 'finished';

  const { data: hasMadeLeaderboard } = trpc.useQuery([
    'leaderboard.check-if-made-leader-board',
    charactersPerMinute,
  ]);

  useEffect(
    function checkIfMadeLeaderboard() {
      if (isFinished) {
        hasMadeLeaderboard && onOpen();
      }
    },
    [isFinished, onOpen, hasMadeLeaderboard]
  );

  return (
    <>
      <LeaderboardSubmissionModal
        isOpen={isOpen}
        onClose={onClose}
        results={{
          accuracy,
          charactersPerMinute,
          mistakes,
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
            <Text as="samp">{remainingTime}</Text>
          </Flex>

          <Box position="relative" wordBreak="break-all" fontWeight="semibold">
            <Box position="absolute" inset="0">
              <Text as="samp">{input}</Text>
              {isActive && <Cursor />}
            </Box>
            <Text as="samp" color="gray.400">
              {randomWords}
            </Text>
          </Box>
        </Box>

        <Button
          aria-disabled={!isFinished}
          color="gray.300"
          variant="link"
          fontSize="xl"
          mt={4}
          onClick={() => reset()}
          tabIndex={-1}
          disabled={!isFinished}
        >
          <motion.div
            key={`${isFinished}`}
            animate={isFinished && { scale: [1, 1.1, 1] }}
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
          <Text as="samp">Accuracy: {accuracy}%</Text>
          <Text as="samp">CPM: {charactersPerMinute}</Text>
          <MistakeCounter mistakes={mistakes} />
        </Flex>
      </Center>
    </>
  );
};
