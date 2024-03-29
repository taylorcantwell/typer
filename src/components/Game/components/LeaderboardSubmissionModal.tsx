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
  Text
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import Confetti from 'react-confetti';

import { useLocalStorage, useWindowSize } from 'react-use';
import { trpc } from '../../../utils/trpc';

type Results = {
  accuracyPercent: number;
  charactersPerMinute: number;
  mistakeCount: number;
};

type LeaderBoardSubmissionModalProps = {
  onClose: () => void;
  isOpen: boolean;
  results: Results;
};

export function LeaderboardSubmissionModal(
  props: LeaderBoardSubmissionModalProps
) {
  const [name, setName] = useLocalStorage('name', 'Anonymous');
  const router = useRouter();
  const addToLeaderboardMutation = trpc.useMutation(['leaderboard.add']);

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} isCentered size="xl">
      <ConfettiWrapper />
      <ModalContent color="yellow.400">
        <ModalHeader>You made it on the leaderboard!</ModalHeader>
        <ModalCloseButton color="gray.400" />

        <ModalBody>
          <Stack mb="6">
            <Text>Accuracy: {props.results.accuracyPercent}%</Text>
            <Text>Mistakes: {props.results.mistakeCount}</Text>
            <Text>CPM: {props.results.charactersPerMinute}</Text>
          </Stack>
          <Input
            onChange={(e) => setName(e.target.value)}
            placeholder="Add your name"
            value={name}
          />
        </ModalBody>

        <ModalFooter>
          <Button mr="3" variant="ghost" onClick={props.onClose} type="button">
            Not Interested
          </Button>
          <Button
            type="button"
            colorScheme="yellow"
            isLoading={addToLeaderboardMutation.isLoading}
            onClick={async () => {
              await addToLeaderboardMutation.mutateAsync({
                accuracyPercent: props.results.accuracyPercent,
                charactersPerMinute: props.results.charactersPerMinute,
                mistakeCount: props.results.mistakeCount,
                name: name!,
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

function ConfettiWrapper() {
  const windowSize = useWindowSize();
  return <Confetti width={windowSize.width} height={windowSize.height} />;
}
