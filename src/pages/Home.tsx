import React from 'react';
import { Initial } from '../components/Initial';

interface HomeProps {
  onStartGame: () => void;
}

const Home: React.FC<HomeProps> = ({ onStartGame }) => {
  return (
    <div>
      <Initial onStartGame={onStartGame} />
    </div>
  );
};

export default Home;
