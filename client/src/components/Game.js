import React, { useState, useEffect } from 'react';
import CharacterCard from './CharacterCard';
import VotingInterface from './VotingInterface';

const Game = ({ socket, playerInfo, roomInfo, onBackToMenu }) => {
  const [myCharacter, setMyCharacter] = useState(null);
  const [players, setPlayers] = useState([]);
  const [scenario, setScenario] = useState(null);
  const [gameState, setGameState] = useState('playing'); // playing, voting, finished
  const [revealedCards, setRevealedCards] = useState({});
  const [votingInfo, setVotingInfo] = useState(null);
  const [gameLog, setGameLog] = useState([]);

  useEffect(() => {
    if (roomInfo) {
      setPlayers(roomInfo.players || []);
      setScenario(roomInfo.scenario);
    }

    // Обработчики событий игры
    socket.on('characterAssigned', (character) => {
      setMyCharacter(character);
      addToLog('🎭 Вы получили своего персонажа!');
    });

    socket.on('cardRevealed', (data) => {
      setRevealedCards(prev => ({
        ...prev,
        [data.playerId]: {
          ...prev[data.playerId],
          [data.cardType]: data.cardValue,
          revealedCards: data.revealedCards
        }
      }));
      addToLog(`🃏 ${data.playerName} открыл карточку "${data.cardType}": ${data.cardValue}`);
    });

    socket.on('votingStarted', (data) => {
      setGameState('voting');
      setVotingInfo(data);
      addToLog(`🗳️ Началось голосование за исключение игрока ${data.targetPlayerName}`);
    });

    socket.on('voteReceived', (data) => {
      addToLog(`✅ ${data.playerName} проголосовал (${data.votesCount}/${data.totalPlayers})`);
    });

    socket.on('votingFinished', (data) => {
      setGameState('playing');
      setVotingInfo(null);
      setPlayers(data.alivePlayers);
      
      if (data.isEliminated) {
        addToLog(`❌ ${data.targetPlayer.name} исключен из бункера! (${data.yesVotes}/${data.totalVotes} голосов "За")`);
      } else {
        addToLog(`✅ ${data.targetPlayer.name} остается в бункере (${data.yesVotes}/${data.totalVotes} голосов "За")`);
      }

      if (data.isGameFinished) {
        setGameState('finished');
        addToLog('🎉 Игра завершена! Определены выжившие.');
      }
    });

    socket.on('gameFinished', (data) => {
      setGameState('finished');
      addToLog('🏆 Игра завершена! Поздравляем выживших!');
    });

    return () => {
      socket.off('characterAssigned');
      socket.off('cardRevealed');
      socket.off('votingStarted');
      socket.off('voteReceived');
      socket.off('votingFinished');
      socket.off('gameFinished');
    };
  }, [socket, roomInfo]);

  const addToLog = (message) => {
    setGameLog(prev => [...prev, { id: Date.now(), message, timestamp: new Date() }]);
  };

  const revealCard = (cardType) => {
    socket.emit('revealCard', { roomId: playerInfo.roomId, cardType });
  };

  const startVoting = (targetPlayerId) => {
    socket.emit('startVoting', { roomId: playerInfo.roomId, targetPlayerId });
  };

  const vote = (voteValue) => {
    socket.emit('vote', { roomId: playerInfo.roomId, vote: voteValue });
  };

  const alivePlayers = players.filter(player => player.isAlive);
  const myPlayer = players.find(player => player.id === playerInfo.playerId);
  const canVote = gameState === 'voting' && myPlayer?.isAlive;
  const canStartVoting = gameState === 'playing' && myPlayer?.isAlive;

  return (
    <div className="game">
      <div className="game-container">
        {/* Заголовок игры */}
        <div className="game-header">
          <h2>🏠 Бункер - {scenario?.title}</h2>
          <p className="scenario-description">{scenario?.description}</p>
          <div className="game-info">
            <span>⏱️ Продолжительность: {scenario?.duration}</span>
            <span>👥 Игроков живых: {alivePlayers.length}</span>
            <span>🏠 Мест в бункере: {scenario?.bunkerCapacity}</span>
          </div>
        </div>

        <div className="game-content">
          {/* Моя карточка персонажа */}
          {myCharacter && (
            <div className="my-character-section">
              <h3>🎭 Ваш персонаж</h3>
              <CharacterCard
                character={myCharacter}
                isOwn={true}
                onRevealCard={revealCard}
                revealedCards={myPlayer?.revealedCards || []}
              />
            </div>
          )}

          {/* Интерфейс голосования */}
          {gameState === 'voting' && votingInfo && (
            <VotingInterface
              votingInfo={votingInfo}
              onVote={vote}
              canVote={canVote}
            />
          )}

          {/* Список игроков */}
          <div className="players-section">
            <h3>👥 Игроки в бункере</h3>
            <div className="players-grid">
              {alivePlayers.map((player) => (
                <div key={player.id} className={`player-info ${player.id === playerInfo.playerId ? 'own' : ''}`}>
                  <div className="player-header">
                    <span className="player-name">
                      {player.name}
                      {player.isHost && ' 👑'}
                      {!player.isAlive && ' 💀'}
                    </span>
                    {canStartVoting && player.id !== playerInfo.playerId && (
                      <button 
                        className="btn btn-danger btn-small"
                        onClick={() => startVoting(player.id)}
                      >
                        🗳️ Голосование
                      </button>
                    )}
                  </div>
                  
                  {/* Отображаем открытые карточки других игроков */}
                  {revealedCards[player.id] && (
                    <div className="revealed-cards">
                      {Object.entries(revealedCards[player.id]).map(([cardType, cardValue]) => {
                        if (cardType === 'revealedCards') return null;
                        return (
                          <div key={cardType} className="revealed-card">
                            <strong>{cardType}:</strong> {cardValue}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Лог игры */}
          <div className="game-log-section">
            <h3>📜 Лог игры</h3>
            <div className="game-log">
              {gameLog.map((entry) => (
                <div key={entry.id} className="log-entry">
                  <span className="log-time">
                    {entry.timestamp.toLocaleTimeString()}
                  </span>
                  <span className="log-message">{entry.message}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Результат игры */}
        {gameState === 'finished' && (
          <div className="game-result">
            <h2>🎉 Игра завершена!</h2>
            <div className="survivors">
              <h3>🏆 Выжившие:</h3>
              {alivePlayers.map((player) => (
                <div key={player.id} className="survivor">
                  {player.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Действия */}
        <div className="game-actions">
          <button className="btn btn-secondary" onClick={onBackToMenu}>
            🏠 В главное меню
          </button>
          
          {gameState === 'playing' && (
            <div className="game-tips">
              💡 Открывайте карточки персонажа и убеждайте других в своей полезности!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Game;