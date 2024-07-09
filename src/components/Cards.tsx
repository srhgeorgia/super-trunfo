import React, { useState, useEffect } from 'react';
import styles from './Cards.module.css';

interface Card {
  name: string;
  power: number;
  speed: number;
  torque: number;
}

interface Player {
  name: string;
  cards: Card[];
}

const initialCards: Card[] = [
  { name: 'BYD Seal', power: 530, speed: 180, torque: 60.2 },
  { name: 'Ferrari Purosangue', power: 725, speed: 110, torque: 73 },
  { name: 'Fiat Argo HGT', power: 135, speed: 192, torque: 18.8 },
  { name: 'Fiat Pulse Abarth', power: 180, speed: 215, torque: 27.5 },
  { name: 'Honda Civic LXS', power: 139, speed: 190, torque: 17.5 },
  { name: 'Honda City DX', power: 115, speed: 180, torque: 15.2 },
  { name: 'VW Gol GTS 1991', power: 97, speed: 167, torque: 14.7 },
  { name: 'VW Golf', power: 230, speed: 238, torque: 35.7 },
  { name: 'Toyota Corolla GLi', power: 139, speed: 190, torque: 17.7 },
  { name: 'Ford Mustang Mach 1', power: 483, speed: 250, torque: 56.7 },
];

const shuffleArray = (array: Card[]): Card[] => {
  return array.sort(() => Math.random() - 0.5);
};

const distributeCards = (
  cards: Card[],
): { playerA: Card[]; playerB: Card[] } => {
  const playerA: Card[] = [];
  const playerB: Card[] = [];

  cards.forEach((card, index) => {
    if (index % 2 === 0) {
      playerA.push(card);
    } else {
      playerB.push(card);
    }
  });

  return { playerA, playerB };
};

const Cards: React.FC = () => {
  const [playerA, setPlayerA] = useState<Player>({
    name: 'Player A',
    cards: [],
  });
  const [playerB, setPlayerB] = useState<Player>({
    name: 'Player B',
    cards: [],
  });
  const [selectedCardA, setSelectedCardA] = useState<Card | null>(null);
  const [selectedCardB, setSelectedCardB] = useState<Card | null>(null);
  const [selectedAttribute, setSelectedAttribute] = useState<
    'power' | 'speed' | 'torque' | null
  >(null);
  const [currentPlayer, setCurrentPlayer] = useState<'A' | 'B'>('A');
  const [winner, setWinner] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState(false);

  const initializeGame = () => {
    const shuffledCards = shuffleArray(initialCards);
    const { playerA, playerB } = distributeCards(shuffledCards);

    setPlayerA({ name: 'Player A', cards: playerA });
    setPlayerB({ name: 'Player B', cards: playerB });
    setSelectedCardA(null);
    setSelectedCardB(null);
    setSelectedAttribute(null);
    setCurrentPlayer('A');
    setWinner(null);
    setGameOver(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const determineWinner = () => {
    if (!selectedCardA || !selectedCardB || !selectedAttribute) return null;

    if (selectedCardA[selectedAttribute] > selectedCardB[selectedAttribute]) {
      return 'Player A';
    } else if (
      selectedCardA[selectedAttribute] < selectedCardB[selectedAttribute]
    ) {
      return 'Player B';
    } else {
      return 'Draw';
    }
  };

  const playRound = () => {
    if (!selectedCardA || !selectedCardB || !selectedAttribute) {
      return alert('Please select a card and an attribute to play!');
    }

    const roundWinner = determineWinner();
    const updatedPlayerA: Player = { ...playerA };
    const updatedPlayerB: Player = { ...playerB };

    if (roundWinner === 'Player A') {
      updatedPlayerA.cards.push(selectedCardB);
      updatedPlayerB.cards = updatedPlayerB.cards.filter(
        (card) => card !== selectedCardB,
      );
    } else if (roundWinner === 'Player B') {
      updatedPlayerB.cards.push(selectedCardA);
      updatedPlayerA.cards = updatedPlayerA.cards.filter(
        (card) => card !== selectedCardA,
      );
    }

    setWinner(roundWinner);
    setPlayerA(updatedPlayerA);
    setPlayerB(updatedPlayerB);
    setSelectedCardA(null);
    setSelectedCardB(null);
    setSelectedAttribute(null);
    setCurrentPlayer((prev) => (prev === 'A' ? 'B' : 'A'));

    if (
      updatedPlayerA.cards.length === 0 ||
      updatedPlayerB.cards.length === 0
    ) {
      setGameOver(true);
    }
  };

  const selectCard = (player: 'A' | 'B', card: Card) => {
    if (player === 'A') {
      setSelectedCardA(card);
    } else {
      setSelectedCardB(card);
    }
  };

  const selectAttribute = (attribute: 'power' | 'speed' | 'torque') => {
    setSelectedAttribute(attribute);
    const roundWinner = determineWinner();
    setWinner(roundWinner);
  };

  const startNewRound = () => {
    initializeGame();
  };

  const winnerText =
    winner === 'Draw'
      ? "It's a draw!"
      : `${winner} wins this round with ${selectedAttribute}!`;

  return (
    <div className={styles.game}>
      <button onClick={() => window.location.reload()}>
        Super Trunfo Game
      </button>

      {selectedCardA && selectedCardB && (
        <div className={styles.controls}>
          <button onClick={() => selectAttribute('power')}>Power</button>
          <button onClick={() => selectAttribute('speed')}>Speed</button>
          <button onClick={() => selectAttribute('torque')}>Torque</button>
        </div>
      )}
      {winner && !gameOver && (
        <div className={styles.result}>
          <p>{winnerText}</p>
        </div>
      )}
      <button
        onClick={playRound}
        disabled={!selectedCardA || !selectedCardB || !selectedAttribute}
      >
        Jogar
      </button>
      {gameOver && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Game Over!</h2>
            <p>
              {winner === 'Player A'
                ? `${playerA.name} Wins!`
                : `${playerB.name} Wins!`}
            </p>
            <button onClick={startNewRound}>Play Again</button>
          </div>
        </div>
      )}
      {!gameOver && <p>Current Player: {currentPlayer}</p>}
      <div className={styles.players}>
        <div className={styles.player}>
          <h3>{playerA.name}</h3>
          <div className={styles.cards}>
            {playerA.cards.map((card, index) => (
              <div
                key={index}
                className={`${styles.card} ${
                  selectedCardA === card ? styles.selected : ''
                }`}
                onClick={() => selectCard('A', card)}
              >
                <p>{card.name}</p>
                <p>Power: {card.power}</p>
                <p>Speed: {card.speed}</p>
                <p>Torque: {card.torque}</p>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.player}>
          <h3>{playerB.name}</h3>
          <div className={styles.cards}>
            {playerB.cards.map((card, index) => (
              <div
                key={index}
                className={`${styles.card} ${
                  selectedCardB === card ? styles.selected : ''
                }`}
                onClick={() => selectCard('B', card)}
              >
                <p>{card.name}</p>
                <p>Power: {card.power}</p>
                <p>Speed: {card.speed}</p>
                <p>Torque: {card.torque}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cards;
