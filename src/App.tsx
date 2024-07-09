import React, { useState } from 'react';
import Home from './pages/Home';
import Cards from './components/Cards';

const App: React.FC = () => {
  const [gameStarted, setGameStarted] = useState(false);

  const handleStartGame = () => {
    setGameStarted(true);
  };

  return (
    <div>
      {gameStarted ? <Cards /> : <Home onStartGame={handleStartGame} />}
    </div>
  );
};

export default App;
