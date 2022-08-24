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
import { useState } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { trpc } from '../../../utils/trpc';
import { useRouter } from 'next/router';

type LeaderBoardSubmissionModalProps = {
  onClose: () => void;
  isOpen: boolean;
  results: {
    accuracy: number;
    charactersPerMinute: number;
    mistakes: number;
  };
};

export const LeaderboardSubmissionModal = ({
  isOpen,
  onClose,
  results: { accuracy, charactersPerMinute, mistakes },
}: LeaderBoardSubmissionModalProps) => {
  const { width, height } = useWindowSize();
  const [name, setName] = useState('Anonymous');
  const router = useRouter();
  const { mutateAsync: submitToLeaderboard, isLoading } = trpc.useMutation([
    'leaderboard.add-to-leader-board',
  ]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
      <Confetti width={width} height={height} />
      <ModalContent color="yellow.400">
        <ModalHeader>You made it on the leaderboard!</ModalHeader>
        <ModalCloseButton color="gray.400" />
        <ModalBody>
          <Stack mb={6}>
            <Text>Accuracy: {accuracy}%</Text>
            <Text>Mistakes: {mistakes}</Text>
            <Text>CPM: {charactersPerMinute}</Text>
          </Stack>
          <Input
            onChange={(e) => setName(e.target.value)}
            placeholder="Add your name"
          />
        </ModalBody>
        <ModalFooter>
          <Button mr={3} variant="ghost" onClick={onClose}>
            Not Interested
          </Button>
          <Button
            colorScheme="yellow"
            isLoading={isLoading}
            onClick={async () => {
              await submitToLeaderboard({
                accuracy: accuracy + '%',
                cpm: charactersPerMinute,
                mistakes,
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
};
