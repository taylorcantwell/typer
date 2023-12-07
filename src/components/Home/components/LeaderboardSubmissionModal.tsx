import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import * as React from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { trpc } from '../../../utils/trpc';

type Results = {
  accuracy: number;
  charactersPerMinute: number;
  mistakes: number;
};

type LeaderBoardSubmissionModalProps = {
  onClose: () => void;
  isOpen: boolean;
  results: Results;
};

export function LeaderboardSubmissionModal(
  props: LeaderBoardSubmissionModalProps
) {
  const [name, setName] = React.useState('Anonymous');
  const router = useRouter();
  const { mutateAsync: submitToLeaderboard, isLoading } = trpc.useMutation([
    'leaderboard.add-to-leader-board',
  ]);

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} isCentered size="xl">
      <ConfettiWrapper />
      <ModalContent color="yellow.400">
        <ModalHeader>You made it on the leaderboard!</ModalHeader>
        <ModalCloseButton color="gray.400" />

        <ModalBody>
          <Stack mb={6}>
            <Text>Accuracy: {props.results.accuracy}%</Text>
            <Text>Mistakes: {props.results.mistakes}</Text>
            <Text>CPM: {props.results.charactersPerMinute}</Text>
          </Stack>
          <Input
            onChange={(e) => setName(e.target.value)}
            placeholder="Add your name"
          />
        </ModalBody>

        <ModalFooter>
          <Button mr={3} variant="ghost" onClick={props.onClose}>
            Not Interested
          </Button>
          <Button
            colorScheme="yellow"
            isLoading={isLoading}
            onClick={async () => {
              await submitToLeaderboard({
                accuracy: `${props.results.accuracy}%`,
                cpm: props.results.charactersPerMinute,
                mistakes: props.results.mistakes,
                name,
              });

              router.push('/leaderboard');
            }}
          >
            Submit To Leaderboard
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

const ConfettiWrapper = () => {
  const { width, height } = useWindowSize();
  return <Confetti width={width} height={height} />;
};
