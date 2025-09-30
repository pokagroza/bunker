import React, { useState, useEffect } from 'react';

const Lobby = ({ socket, playerInfo, roomInfo, onStartGame, onBackToMenu }) => {
  const [scenarios, setScenarios] = useState([]);
  const [selectedScenario, setSelectedScenario] = useState(null);

  useEffect(() => {
    // Запрашиваем список сценариев
    socket.emit('getScenarios');
    
    socket.on('scenarios', (scenariosList) => {
      setScenarios(scenariosList);
      if (scenariosList.length > 0) {
        setSelectedScenario(scenariosList[0].id);
      }
    });

    return () => {
      socket.off('scenarios');
    };
  }, [socket]);

  const players = roomInfo?.players || [];
  const isHost = playerInfo?.isHost;
  const canStartGame = players.length >= 3;

  const handleStartGame = () => {
    if (selectedScenario && canStartGame) {
      onStartGame(selectedScenario);
    }
  };

  return (
    <div className="lobby">
      <div className="lobby-container">
        <div className="lobby-header">
          <h2>🏠 Лобби игры</h2>
          <div className="room-info">
            <span className="room-id">Код комнаты: <strong>{playerInfo?.roomId}</strong></span>
            <button className="btn btn-small" onClick={() => navigator.clipboard.writeText(playerInfo?.roomId)}>
              📋 Копировать
            </button>
          </div>
        </div>

        <div className="lobby-content">
          <div className="players-section">
            <h3>👥 Игроки ({players.length}/12)</h3>
            <div className="players-list">
              {players.map((player) => (
                <div key={player.id} className={`player-card ${player.isHost ? 'host' : ''}`}>
                  <span className="player-name">{player.name}</span>
                  {player.isHost && <span className="host-badge">👑 Хост</span>}
                </div>
              ))}
            </div>
            
            {players.length < 3 && (
              <div className="waiting-message">
                ⏳ Ожидание игроков... (минимум 3 игрока)
              </div>
            )}
          </div>

          {isHost && (
            <div className="scenario-section">
              <h3>🎭 Выбор сценария</h3>
              <div className="scenarios-list">
                {scenarios.map((scenario) => (
                  <div 
                    key={scenario.id} 
                    className={`scenario-card ${selectedScenario === scenario.id ? 'selected' : ''}`}
                    onClick={() => setSelectedScenario(scenario.id)}
                  >
                    <h4>{scenario.title}</h4>
                    <p>{scenario.description}</p>
                    <div className="scenario-details">
                      <small>
                        📅 Продолжительность: {scenario.duration} | 
                        👥 Выживших: {scenario.bunkerCapacity} | 
                        📦 {scenario.resources}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!isHost && selectedScenario && (
            <div className="scenario-preview">
              <h3>🎭 Выбранный сценарий</h3>
              {scenarios.find(s => s.id === selectedScenario) && (
                <div className="scenario-card selected">
                  <h4>{scenarios.find(s => s.id === selectedScenario).title}</h4>
                  <p>{scenarios.find(s => s.id === selectedScenario).description}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="lobby-actions">
          <button className="btn btn-secondary" onClick={onBackToMenu}>
            ⬅️ В главное меню
          </button>
          
          {isHost && (
            <button 
              className={`btn btn-primary ${!canStartGame ? 'disabled' : ''}`}
              onClick={handleStartGame}
              disabled={!canStartGame}
            >
              🚀 Начать игру
            </button>
          )}
          
          {!isHost && (
            <div className="waiting-host">
              ⏳ Ожидание начала игры от хоста...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Lobby;