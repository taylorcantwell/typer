import { ChakraProvider } from '@chakra-ui/react';
import { withTRPC } from '@trpc/next';
import type { AppType } from 'next/dist/shared/lib/utils';
import superjson from 'superjson';
import { AppShell } from '../components/AppShell';
import type { AppRouter } from '../server/router/root';
import '../styles/globals.css';

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ChakraProvider>
      <AppShell>
        <Component {...pageProps} />
      </AppShell>
    </ChakraProvider>
  );
};

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return '';
  }
  if (process.browser) return '';
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;

  return `http://localhost:${process.env.PORT ?? 3000}`;
};

export default withTRPC<AppRouter>({
  config({ ctx }) {
    const url = `${getBaseUrl()}/api/trpc`;

    return {
      url,
      transformer: superjson,
    };
  },

  ssr: false,
})(MyApp);
