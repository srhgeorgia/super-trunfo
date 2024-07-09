import React, { useState } from 'react';
import styles from '../styles/Initial.module.css';

interface InitialProps {
  onStartGame: () => void;
}

export const Initial: React.FC<InitialProps> = ({ onStartGame }) => {
  const [showRules, setShowRules] = useState(false);

  const handleShowRules = () => {
    setShowRules(true);
  };

  const handleHideRules = () => {
    setShowRules(false);
  };

  return (
    <div className={styles.container}>
      {!showRules ? (
        <div className={styles.box}>
          <div className={styles.boxTitle}>
            <h1 className={styles.title}>Super Trunfo</h1>
            <img
              src="./src/assets/carta.png"
              alt="cartas"
              className={styles.imagem}
            />
          </div>
          <p className={styles.description}>
            Bem-vindo ao Super Trunfo! <br></br>Clique no botão abaixo para
            iniciar o jogo.
          </p>
          <button onClick={onStartGame}>Iniciar jogo</button>
          <button onClick={handleShowRules}>Regras</button>
        </div>
      ) : (
        <div className={styles.rules}>
          <h2 className={styles.title}>Regras do Super Trunfo</h2>
          <div className={styles.descriptionRules}>
            <p>1. Cada jogador recebe um número igual de cartas aleatórias.</p>
            <p>
              2. Em cada rodada, um jogador escolhe um atributo para comparar.
            </p>
            <p>
              3. Escolha a carta e em seguida o atributo que deseja desafiar.
            </p>
            <p>
              4. Espere o jogador adversário escolher sua carta e depois clique
              em "Jogar".
            </p>
            <p>
              5. O jogador com o valor mais alto nesse atributo ganha a rodada e
              fica com as cartas comparadas.
            </p>
            <p>6. O jogo continua até que um jogador tenha todas as cartas.</p>
          </div>
          <button onClick={handleHideRules} className={styles.button}>
            Voltar
          </button>
        </div>
      )}
    </div>
  );
};
