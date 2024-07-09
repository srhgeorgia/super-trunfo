import React, { useState } from 'react';
import styles from './Initial.module.css';

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
              src="/src/assets/carta.png"
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
          <h2>Regras do Super Trunfo</h2>
          <p>1. Cada jogador recebe um número igual de cartas.</p>
          <p>
            2. Em cada rodada, um jogador escolhe um atributo para comparar.
          </p>
          <p>
            3. O jogador com o valor mais alto nesse atributo ganha a rodada e
            fica com as cartas comparadas.
          </p>
          <p>
            4. O jogo continua até que um jogador tenha todas as cartas ou que
            um tempo limite seja alcançado.
          </p>
          <button onClick={handleHideRules} className={styles.button}>
            Voltar
          </button>
        </div>
      )}
    </div>
  );
};
