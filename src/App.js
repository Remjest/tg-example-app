import React, { useReducer, useEffect } from 'react';
import './App.css';

const generateDeck = () => {
  const images = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg'];
  const deck = [];
  // Каждой картинке добавляем две карточки
  for (let image of images) {
    deck.push({ image, matched: false });
    deck.push({ image, matched: false });
  }
  // Перемешиваем колоду
  return deck.sort(() => Math.random() - 0.5);
};

const initialState = {
  deck: generateDeck(),
  flipped: [],
  matched: [],
  turns: 0,
  score: parseInt(localStorage.getItem('memory-game-score'), 10) || 0, // Инициализация из localStorage
  pendingReset: false,
  gameOver: false,
};

const gameReducer = (state, action) => {
  switch (action.type) {
    case 'FLIP_CARD':
      // Переворачиваем карточку
      if (
        state.flipped.length < 2 &&
        !state.flipped.includes(action.index) &&
        !state.matched.includes(state.deck[action.index].color)
      ) {
        return { ...state, flipped: [...state.flipped, action.index] };
      }
      return state;

    case 'CHECK_MATCH':
      // Проверяем совпадение перевернутых карточек
      const [first, second] = state.flipped;
      if (state.deck[first].image === state.deck[second].image) {
        const newMatched = [...state.matched, state.deck[first].image];
        const isGameOver = newMatched.length === state.deck.length / 2;
        const newScore = isGameOver ? state.score + 1 : state.score;

        // Сохраняем новый score в localStorage, если игра завершена
        if (isGameOver) {
          localStorage.setItem('memory-game-score', newScore);
        }

        return {
          ...state,
          matched: newMatched,
          score: newScore,
          flipped: [],
          pendingReset: false,
          gameOver: isGameOver,
        };
      } else {
        return { ...state, pendingReset: true };
      }

    case 'RESET_FLIPPED':
      // Сбрасываем перевернутые карточки
      return { ...state, flipped: [], pendingReset: false };

    case 'INCREMENT_TURN':
      // Увеличиваем счетчик попыток
      return { ...state, turns: state.turns + 1 };

    case 'RESET_GAME':
      // Сбрасываем состояние игры без сброса score
      return {
        ...state,
        deck: generateDeck(),
        flipped: [],
        matched: [],
        turns: 0,
        pendingReset: false,
        gameOver: false,
        // Сохраняем текущий score без изменений
        score: state.score,
      };

    case 'RESET_SCORE':
      // Сбрасываем очки
      return {
        ...state,
        score: 0,
      };

    default:
      return state;
  }
};

const App = () => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Сохранение score в localStorage при его изменении
  useEffect(() => {
    localStorage.setItem('memory-game-score', state.score);
  }, [state.score]);

  // Проверка на совпадение перевернутых карточек
  useEffect(() => {
    if (state.flipped.length === 2) {
      dispatch({ type: 'CHECK_MATCH' });
      dispatch({ type: 'INCREMENT_TURN' });
    }
  }, [state.flipped]);

  // Таймер для сброса перевернутых карточек
  useEffect(() => {
    if (state.pendingReset) {
      const timer = setTimeout(() => {
        dispatch({ type: 'RESET_FLIPPED' });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [state.pendingReset]);

  // Обработка клика на карточку
  const handleCardClick = (index) => {
    if (!state.gameOver && state.flipped.length < 2 && !state.flipped.includes(index)) {
      dispatch({ type: 'FLIP_CARD', index });
    }
  };

  const handlePlayAgain = () => {
    dispatch({ type: 'RESET_GAME' });
  };

  const handleResetScore = () => {
    localStorage.setItem('memory-game-score', 0);
    dispatch({ type: 'RESET_SCORE' });
  };

  return (
    <div className="App">
      <h1>Memory Game</h1>
      <div className="info">
        <p>Очки: {state.score}</p>
        <p>Попытки: {state.turns}/15</p>
      </div>
      <div className="deck">
  {state.deck.map((card, index) => (
    <div
      key={index}
      className={`card ${
        state.flipped.includes(index) || state.matched.includes(card.image) ? 'flipped show' : ''
      }`}
      onClick={() => handleCardClick(index)}
    >
      <div className="card-inner">
        <div className="card-front"></div>
        <div 
          className="card-back"
          style={{ 
            backgroundImage: `url(${process.env.PUBLIC_URL}/images/${card.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>
      </div>
    </div>
  ))}
</div>
      {state.gameOver && (
        <>
          <div className="overlay" />
          <div className="game-over">
            <h2>Вы выиграли!</h2>
            <button onClick={handlePlayAgain}>Заново</button>
          </div>
        </>
      )}
      {!state.gameOver && state.turns >= 15 && (
        <>
          <div className="overlay" />
          <div className="game-over">
            <h2>Игра окончена!</h2>
            <button onClick={handlePlayAgain}>Заново</button>
          </div>
        </>
      )}
      <button onClick={handleResetScore} className="reset-score">
        Сбросить очки
      </button>
    </div>
  );
};

export default App;