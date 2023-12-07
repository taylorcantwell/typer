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

export const LeaderBoard = () => {
  const { data } = trpc.useQuery(['leaderboard.get-leader-board']);

  if (!data) {
    return (
      <Center h={'80vh'}>
        <Spinner color="yellow.400" />
      </Center>
    );
  }

  return (
    <TableContainer w="80%" mx="auto">
      <Table variant="simple">
        <TableCaption>
          Made by Taylor Cantwell -{' '}
          <Link
            textDecoration="underline"
            href="https://github.com/taylorcantwell"
          >
            GitHub
          </Link>
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
          {data.map((record) => {
            const key = `${record.createdAt.toDateString()}-${record.name}`;

            return (
              <Tr color="gray.400" key={key}>
                <Td>{record.name}</Td>
                <Td>{record.createdAt.toDateString()}</Td>
                <Td>{record.cpm}</Td>
                <Td>{record.accuracy}</Td>
                <Td>{record.mistakes}</Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

const titles = ['Name', 'Date', 'CPM', 'Accuracy', 'Mistakes'];
