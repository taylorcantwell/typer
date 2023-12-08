import type { NextPage } from 'next';
import dynamic from 'next/dynamic';

const Home = dynamic(
  () => import('../components/Game/Game').then((module) => module.Game),
  { ssr: false }
);

const HomePage: NextPage = () => {
  return <Home />;
};

export default HomePage;
