import { Box, Center, Link } from '@chakra-ui/react';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { useMedia } from 'react-use';

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell(props: AppShellProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <div>👀 Did you just try to open this on a mobile. Yeah... no.</div>;
  }

  return (
    <>
      <Head>
        <title>Typing Test</title>
        <meta name="description" content="Test your typing skills." />
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
        <NavLink href="/">Play</NavLink>
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
  const router = useRouter();
  const isActive = router.asPath === props.href;

  return (
    <NextLink href={props.href} passHref>
      <Link textDecoration={isActive ? 'underline' : 'none'}>
        {props.children}
      </Link>
    </NextLink>
  );
}

function useIsMobile() {
  const isMobileView = useMedia('(max-width: 768px)', false);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    setIsMobile(isMobileView);
  }, [isMobileView]);

  return isMobile;
}
