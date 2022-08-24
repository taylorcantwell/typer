import { Box, Center, Link } from '@chakra-ui/react';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';

export const AppShell = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const currentRoute = router.pathname;

  return (
    <>
      <Head>
        <title>Typer Challenge</title>
        <meta name="description" content="Test your typing skillz." />
      </Head>

      <Center
        bg="gray.700"
        m="0 auto"
        gap="5"
        h="10vh"
        color="yellow.400"
        fontSize="2xl"
        fontWeight="bold"
      >
        <NextLink href="/" passHref>
          <Link textDecoration={currentRoute === '/' ? 'underline' : 'none'}>
            Type Challenge
          </Link>
        </NextLink>
        <NextLink href="/leaderboard" passHref>
          <Link
            textDecoration={
              currentRoute === '/leaderboard' ? 'underline' : 'none'
            }
          >
            Leaderboard
          </Link>
        </NextLink>
      </Center>
      <Box bg="gray.700">{children}</Box>
    </>
  );
};
