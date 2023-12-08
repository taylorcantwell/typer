import {
  Center,
  Spinner,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Link,
} from '@chakra-ui/react';

import { trpc } from '../utils/trpc';

export function LeaderBoard() {
  const leaderboardQuery = trpc.useQuery(['leaderboard.get']);

  if (!leaderboardQuery.data) {
    return (
      <Center h="80vh">
        <Spinner color="yellow.400" />
      </Center>
    );
  }

  return (
    <TableContainer w="80%" mx="auto">
      <Table variant="simple">
        <TableCaption>
          Made by Taylor Cantwell -{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/taylorcantwell"
          >
            GitHub
          </a>
        </TableCaption>

        <Thead>
          <Tr>
            {titles.map((title) => (
              <Th key={title} color="yellow.400">
                {title}
              </Th>
            ))}
          </Tr>
        </Thead>

        <Tbody>
          {leaderboardQuery.data.map((record) => {
            const key = `${record.createdAt.toDateString()}-${record.name}`;

            return (
              <Tr color="gray.400" key={key}>
                <Td>{record.name}</Td>
                <Td>{record.createdAt.toDateString()}</Td>
                <Td>{record.charactersPerMinute}</Td>
                <Td>{`${record.accuracyPercent}%`}</Td>
                <Td>{record.mistakeCount}</Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
}

const titles = ['Name', 'Date', 'CPM', 'Accuracy', 'Mistakes'] as const;
