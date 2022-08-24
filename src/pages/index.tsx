import type { NextPage } from 'next';
import dynamic from 'next/dynamic';

const Home = dynamic(
  () => import('../components/Home/Home').then((module) => module.Home),
  { ssr: false }
);

const HomePage: NextPage = () => {
  return <Home />;
};

export default HomePage;
