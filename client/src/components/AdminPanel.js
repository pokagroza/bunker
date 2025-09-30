import React, { useState, useEffect } from 'react';
import './Admin.css';

const AdminPanel = ({ socket, roomId }) => {
  const [gameData, setGameData] = useState(null);
  const [players, setPlayers] = useState([]);
  const [activeEvents, setActiveEvents] = useState([]);
  const [bunkerResources, setBunkerResources] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [eventToTrigger, setEventToTrigger] = useState('');

  useEffect(() => {
    if (!socket || !roomId) return;

    // Запрос данных администратора
    socket.emit('requestAdminData', roomId);

    // Обработчики событий
    socket.on('adminGameData', (data) => {
      setGameData(data.gameData);
      setPlayers(data.players);
      setActiveEvents(data.activeEvents || []);
      setBunkerResources(data.bunkerResources);
    });

    socket.on('adminUpdate', (data) => {
      if (data.players) setPlayers(data.players);
      if (data.activeEvents) setActiveEvents(data.activeEvents);
      if (data.bunkerResources) setBunkerResources(data.bunkerResources);
    });

    return () => {
      socket.off('adminGameData');
      socket.off('adminUpdate');
    };
  }, [socket, roomId]);

  const triggerEvent = (eventId) => {
    socket.emit('triggerEvent', { roomId, eventId });
  };

  const forceRevealCard = (playerId, cardType) => {
    socket.emit('forceRevealCard', { roomId, playerId, cardType });
  };

  const modifyResource = (resourceType, amount) => {
    socket.emit('modifyResource', { roomId, resourceType, amount });
  };

  const eliminatePlayer = (playerId) => {
    socket.emit('adminEliminatePlayer', { roomId, playerId });
  };

  const pauseGame = () => {
    socket.emit('pauseGame', roomId);
  };

  const resumeGame = () => {
    socket.emit('resumeGame', roomId);
  };

  if (!gameData) {
    return (
      <div className="admin-panel">
        <div className="loading">
          <h2>🔍 ЗАГРУЗКА ПАНЕЛИ УПРАВЛЕНИЯ...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>🎮 ПАНЕЛЬ УПРАВЛЕНИЯ БУНКЕРОМ</h1>
        <div className="admin-controls">
          <button className="btn btn-secondary" onClick={pauseGame}>
            ⏸️ ПАУЗА
          </button>
          <button className="btn btn-primary" onClick={resumeGame}>
            ▶️ ПРОДОЛЖИТЬ
          </button>
        </div>
      </div>

      <div className="admin-content">
        {/* Информация об игре */}
        <div className="admin-section game-info-section">
          <h3>📊 ИНФОРМАЦИЯ ОБ ИГРЕ</h3>
          <div className="game-stats">
            <div className="stat-item">
              <span className="stat-label">Сценарий:</span>
              <span className="stat-value">{gameData.scenario?.title}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Состояние:</span>
              <span className="stat-value">{gameData.gameState}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Раунд:</span>
              <span className="stat-value">{gameData.currentRound}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Живых игроков:</span>
              <span className="stat-value">{players.filter(p => p.isAlive).length}</span>
            </div>
          </div>
        </div>

        {/* Ресурсы бункера */}
        {bunkerResources && (
          <div className="admin-section resources-section">
            <h3>🏭 РЕСУРСЫ БУНКЕРА</h3>
            <div className="resources-grid">
              {Object.entries(bunkerResources).map(([resourceType, resource]) => (
                <div key={resourceType} className="resource-item">
                  <div className="resource-header">
                    <span className="resource-name">{resourceType.toUpperCase()}</span>
                    <span className="resource-value">{Math.round(resource.current)}/{resource.max}</span>
                  </div>
                  <div className="resource-bar">
                    <div 
                      className="resource-fill"
                      style={{ 
                        width: `${(resource.current / resource.max) * 100}%`,
                        backgroundColor: resource.current < 30 ? 'var(--bunker-warning)' : 'var(--bunker-glow)'
                      }}
                    />
                  </div>
                  <div className="resource-controls">
                    <button 
                      className="btn btn-small btn-danger"
                      onClick={() => modifyResource(resourceType, -10)}
                    >
                      -10
                    </button>
                    <button 
                      className="btn btn-small btn-success"
                      onClick={() => modifyResource(resourceType, +10)}
                    >
                      +10
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Игроки */}
        <div className="admin-section players-section">
          <h3>👥 УПРАВЛЕНИЕ ИГРОКАМИ</h3>
          <div className="players-admin-grid">
            {players.map((player) => (
              <div 
                key={player.id} 
                className={`player-admin-card ${!player.isAlive ? 'eliminated' : ''} ${selectedPlayer === player.id ? 'selected' : ''}`}
                onClick={() => setSelectedPlayer(selectedPlayer === player.id ? null : player.id)}
              >
                <div className="player-admin-header">
                  <span className="player-admin-name">
                    {player.name}
                    {player.isHost && ' 👑'}
                    {!player.isAlive && ' 💀'}
                  </span>
                  <button 
                    className="btn btn-small btn-danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      eliminatePlayer(player.id);
                    }}
                  >
                    ❌ ИСКЛЮЧИТЬ
                  </button>
                </div>
                
                {player.character && (
                  <div className="player-character-overview">
                    <div className="character-traits">
                      {Object.entries(player.character).map(([trait, value]) => (
                        <div key={trait} className="trait-item">
                          <span className="trait-key">{trait}:</span>
                          <span className="trait-value">{value}</span>
                          <button 
                            className={`btn btn-tiny ${player.revealedCards?.includes(trait) ? 'btn-success' : 'btn-secondary'}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              forceRevealCard(player.id, trait);
                            }}
                          >
                            {player.revealedCards?.includes(trait) ? '👁️' : '🔒'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* События */}
        <div className="admin-section events-section">
          <h3>⚡ УПРАВЛЕНИЕ СОБЫТИЯМИ</h3>
          
          {/* Активные события */}
          {activeEvents.length > 0 && (
            <div className="active-events">
              <h4>🔥 АКТИВНЫЕ СОБЫТИЯ:</h4>
              {activeEvents.map((event, index) => (
                <div key={index} className="active-event">
                  <h5>{event.title}</h5>
                  <p>{event.description}</p>
                  <small>Эффект: {event.effect}</small>
                </div>
              ))}
            </div>
          )}

          {/* Триггер событий */}
          <div className="event-controls">
            <h4>🎲 ЗАПУСТИТЬ СОБЫТИЕ:</h4>
            <div className="event-triggers">
              <button 
                className="btn btn-warning"
                onClick={() => triggerEvent('random')}
              >
                🎰 СЛУЧАЙНОЕ СОБЫТИЕ
              </button>
              <button 
                className="btn btn-danger"
                onClick={() => triggerEvent('system_failure')}
              >
                ⚠️ СБОЙ СИСТЕМ
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => triggerEvent('resource_discovery')}
              >
                💎 НАХОДКА РЕСУРСОВ
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => triggerEvent('social_conflict')}
              >
                🤝 СОЦИАЛЬНЫЙ КОНФЛИКТ
              </button>
            </div>
          </div>
        </div>

        {/* Быстрые действия */}
        <div className="admin-section quick-actions-section">
          <h3>⚡ БЫСТРЫЕ ДЕЙСТВИЯ</h3>
          <div className="quick-actions">
            <button 
              className="btn btn-warning"
              onClick={() => socket.emit('emergencyMeeting', roomId)}
            >
              🚨 ЭКСТРЕННОЕ СОБРАНИЕ
            </button>
            <button 
              className="btn btn-danger"
              onClick={() => socket.emit('criticalEvent', roomId)}
            >
              💥 КРИТИЧЕСКОЕ СОБЫТИЕ
            </button>
            <button 
              className="btn btn-success"
              onClick={() => socket.emit('resourceBonus', roomId)}
            >
              🎁 БОНУС РЕСУРСОВ
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => socket.emit('revealAllCards', roomId)}
            >
              👁️ ПОКАЗАТЬ ВСЕ КАРТЫ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;