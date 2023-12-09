import type { NextPage } from 'next';
import dynamic from 'next/dynamic';

const Index = dynamic(
  //@ts-ignore
  () => import('../components/Game/Game').then((module) => module.Game),
  { ssr: false }
);

const IndexPage: NextPage = () => {
  return <Index />;
};

export default IndexPage;
