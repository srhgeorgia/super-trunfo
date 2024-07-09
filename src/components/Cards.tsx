import React, { useState, useEffect } from 'react';
import styles from '../styles/Cards.module.css';
import { Card, Player } from '../types/interfaces';
import initialCards from '../types/initialCards';

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
    name: 'Jogador A',
    cards: [],
  });
  const [playerB, setPlayerB] = useState<Player>({
    name: 'Jogador B',
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
  const [winnerText, setWinnerText] = useState<string>('');
  const [gameHistory, setGameHistory] = useState<
    { playerA: Card[]; playerB: Card[]; winner: string; attribute: string }[]
  >([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showSelectionAlert, setShowSelectionAlert] = useState(false);

  const saveGameToLocalStorage = (
    playerA: Card[],
    playerB: Card[],
    winner: string,
    attribute: string,
  ) => {
    const newGame = { playerA, playerB, winner, attribute };
    const history = [...gameHistory, newGame];
    localStorage.setItem('gameHistory', JSON.stringify(history));
    setGameHistory(history);
  };

  const loadGameFromLocalStorage = () => {
    const historyString = localStorage.getItem('gameHistory');
    if (historyString) {
      const history = JSON.parse(historyString);
      setGameHistory(history);
    }
  };

  const initializeGame = () => {
    const shuffledCards = shuffleArray(initialCards);
    const { playerA, playerB } = distributeCards(shuffledCards);

    setPlayerA({ name: 'Jogador A', cards: playerA });
    setPlayerB({ name: 'Jogador B', cards: playerB });
    setSelectedCardA(null);
    setSelectedCardB(null);
    setSelectedAttribute(null);
    setCurrentPlayer('A');
    setWinner(null);
    setGameOver(false);
    setWinnerText('');
    setShowSelectionAlert(false);
  };

  useEffect(() => {
    loadGameFromLocalStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    initializeGame();
  }, []);

  const determineWinner = () => {
    if (!selectedCardA || !selectedCardB || !selectedAttribute) return null;

    if (selectedCardA[selectedAttribute] > selectedCardB[selectedAttribute]) {
      return 'Jogador A ganhou a partida!';
    } else if (
      selectedCardA[selectedAttribute] < selectedCardB[selectedAttribute]
    ) {
      return 'Jogador B ganhou a partida!';
    } else {
      return 'Empate!';
    }
  };

  const playRound = () => {
    if (!selectedCardA || !selectedCardB || !selectedAttribute) {
      setShowSelectionAlert(true);
      return;
    }

    const roundWinner = determineWinner();
    const updatedPlayerA: Player = { ...playerA };
    const updatedPlayerB: Player = { ...playerB };

    if (roundWinner === 'Jogador A ganhou a partida!') {
      updatedPlayerA.cards.push(selectedCardB);
      updatedPlayerB.cards = updatedPlayerB.cards.filter(
        (card) => card !== selectedCardB,
      );
    } else if (roundWinner === 'Jogador B ganhou a partida!') {
      updatedPlayerB.cards.push(selectedCardA);
      updatedPlayerA.cards = updatedPlayerA.cards.filter(
        (card) => card !== selectedCardA,
      );
    }

    setWinner(roundWinner);
    setPlayerA(updatedPlayerA);
    setPlayerB(updatedPlayerB);
    setCurrentPlayer((prev) => (prev === 'A' ? 'B' : 'A'));

    const attributeText =
      selectedAttribute === 'power'
        ? 'Power'
        : selectedAttribute === 'speed'
        ? 'Speed'
        : 'Torque';

    if (
      updatedPlayerA.cards.length === 0 ||
      updatedPlayerB.cards.length === 0
    ) {
      setGameOver(true);
      if (roundWinner !== null) {
        saveGameToLocalStorage(
          playerA.cards,
          playerB.cards,
          roundWinner,
          attributeText,
        );
      }
    } else {
      setWinnerText(`${roundWinner}`);
    }

    // Limpar seleção de cartas após cada rodada
    setSelectedCardA(null);
    setSelectedCardB(null);
    setSelectedAttribute(null);
  };

  const selectCard = (player: 'A' | 'B', card: Card) => {
    if (player === 'A') {
      if (selectedCardA === card) {
        setSelectedCardA(null);
      } else {
        setSelectedCardA(card);
      }
    } else {
      if (selectedCardB === card) {
        setSelectedCardB(null);
      } else {
        setSelectedCardB(card);
      }
    }
  };

  const selectAttribute = (attribute: 'power' | 'speed' | 'torque') => {
    setSelectedAttribute(attribute);
  };

  const startNewRound = () => {
    initializeGame();
  };

  const clearHistory = () => {
    localStorage.removeItem('gameHistory');
    setGameHistory([]);
  };

  const renderGameHistory = () => {
    return (
      <div className={styles.gameHistory}>
        <h2>Histórico de Jogos</h2>
        <div className={styles.titleHistory}>
          <button onClick={() => setShowHistory(false)}>
            Fechar Histórico
          </button>
          <button onClick={clearHistory}>Limpar Histórico</button>
        </div>
        <div className={styles.boxHistory}>
          {gameHistory.map((game, index) => (
            <div key={index} className={styles.gameEntry}>
              <h3>Rodada {index + 1}</h3>
              <div>
                <h4>Jogador A:</h4>
                {game.playerA.map((card, idx) => (
                  <p key={idx}>
                    {card.name} - Power: {card.power} - Speed: {card.speed} -
                    Torque: {card.torque}
                  </p>
                ))}
              </div>
              <div>
                <h4>Jogador B:</h4>
                {game.playerB.map((card, idx) => (
                  <p key={idx}>
                    {card.name} - Power: {card.power} - Speed: {card.speed} -
                    Torque: {card.torque}
                  </p>
                ))}
              </div>
              <p>Vencedor: {game.winner}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.game}>
      <div className={styles.containerButtons}>
        <button onClick={() => window.location.reload()}>Voltar</button>
        <button
          onClick={() => {
            playRound();
          }}
          disabled={!selectedCardA || !selectedCardB || !selectedAttribute}
        >
          Jogar
        </button>
        <button onClick={() => setShowHistory(true)}>Ver Histórico</button>
      </div>

      {showSelectionAlert && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Selecione uma Carta!</h2>
            <button onClick={() => setShowSelectionAlert(false)}>OK</button>
          </div>
        </div>
      )}

      {showHistory && gameHistory.length > 0 ? (
        renderGameHistory()
      ) : showHistory && gameHistory.length === 0 ? (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Nenhum Histórico Disponível</h2>
            <button onClick={() => setShowHistory(false)}>OK</button>
          </div>
        </div>
      ) : null}

      <div className={styles.containerAtributes}>
        {selectedCardA && selectedCardB ? (
          <div className={styles.controls}>
            <button
              onClick={() => selectAttribute('power')}
              className={`${styles.buttonAttribute} ${
                selectedAttribute === 'power' ? styles.selected : ''
              }`}
            >
              Power
            </button>
            <button
              onClick={() => selectAttribute('speed')}
              className={`${styles.buttonAttribute} ${
                selectedAttribute === 'speed' ? styles.selected : ''
              }`}
            >
              Speed
            </button>
            <button
              onClick={() => selectAttribute('torque')}
              className={`${styles.buttonAttribute} ${
                selectedAttribute === 'torque' ? styles.selected : ''
              }`}
            >
              Torque
            </button>
          </div>
        ) : (
          winner &&
          !gameOver && (
            <div className={styles.result}>
              <p>{winnerText}</p>
            </div>
          )
        )}
      </div>

      <div className={styles.containerPlayers}>
        {!gameOver && (
          <p className={styles.playerRound}>
            Jogador da rodada: {currentPlayer}
          </p>
        )}
        {gameOver && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <h2>Fim de partida!</h2>
              <p>
                {winner === 'Jogador A'
                  ? `${playerA.name} Ganhou!`
                  : `${playerB.name} Ganhou!`}
              </p>
              <button onClick={startNewRound}>Jogar Novamente</button>
            </div>
          </div>
        )}
      </div>

      <div className={styles.players}>
        <div className={styles.player}>
          <h3 className={styles.playerName}>{playerA.name}</h3>
          <div className={styles.cards}>
            {playerA.cards.map((card, index) => (
              <div
                key={index}
                className={`${styles.card} ${
                  selectedCardA === card ? styles.selected : ''
                }`}
                onClick={() => selectCard('A', card)}
              >
                <p className={styles.cardName}>{card.name}</p>
                <img
                  src={card.imageUrl}
                  alt={card.name}
                  width="150"
                  height="100"
                />
                <p className={styles.descripCard}>Power: {card.power}</p>
                <p className={styles.descripCard}>Speed: {card.speed}</p>
                <p className={styles.descripCard}>Torque: {card.torque}</p>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.player}>
          <h3 className={styles.playerName}>{playerB.name}</h3>
          <div className={styles.cards}>
            {playerB.cards.map((card, index) => (
              <div
                key={index}
                className={`${styles.card} ${
                  selectedCardB === card ? styles.selected : ''
                }`}
                onClick={() => selectCard('B', card)}
              >
                <p className={styles.cardName}>{card.name}</p>
                <img
                  src={card.imageUrl}
                  alt={card.name}
                  width="150"
                  height="100"
                />
                <p className={styles.descripCard}>Power: {card.power}</p>
                <p className={styles.descripCard}>Speed: {card.speed}</p>
                <p className={styles.descripCard}>Torque: {card.torque}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cards;
