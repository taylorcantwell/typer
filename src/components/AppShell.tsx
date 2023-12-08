import { Box, Center, Link } from '@chakra-ui/react';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell(props: AppShellProps) {
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
        <NavLink href="/">Type Challenge</NavLink>
        <NavLink href="/leaderboard">Leaderboard</NavLink>
      </Center>
      <Box bg="gray.700">{props.children}</Box>
    </>
  );
}

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
};

function NavLink(props: NavLinkProps) {
  const { asPath } = useRouter();
  const isActive = asPath === props.href;

  return (
    <NextLink href={props.href} passHref>
      <Link textDecoration={isActive ? 'underline' : 'none'}>
        {props.children}
      </Link>
    </NextLink>
  );
}
