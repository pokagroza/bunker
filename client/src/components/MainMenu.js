import React, { useState } from 'react';

const MainMenu = ({ onCreateRoom, onJoinRoom, onOpenAdmin }) => {
  const [playerName, setPlayerName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [adminRoomId, setAdminRoomId] = useState('');

  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (playerName.trim()) {
      onCreateRoom(playerName.trim());
    }
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (playerName.trim() && roomId.trim()) {
      onJoinRoom(roomId.trim().toUpperCase(), playerName.trim());
    }
  };

  const handleOpenAdmin = (e) => {
    e.preventDefault();
    if (adminRoomId.trim()) {
      onOpenAdmin(adminRoomId.trim().toUpperCase());
    }
  };

  const resetForms = () => {
    setShowJoinForm(false);
    setShowAdminForm(false);
  };

  return (
    <div className="main-menu">
      <div className="menu-container">
        <div className="game-description">
          <h2>Добро пожаловать в Бункер!</h2>
          <p>
            Мир поглотила катастрофа, и вы находитесь в бункере. 
            Но места хватит не всем! Вам предстоит убедить других, 
            что именно вы заслуживаете место в убежище.
          </p>
          <ul>
            <li>📝 Получите случайного персонажа с характеристиками</li>
            <li>🎭 Открывайте карточки по одной</li>
            <li>🗣️ Убеждайте других в своей полезности</li>
            <li>🗳️ Голосуйте за исключение игроков</li>
            <li>🏆 Выживите до конца!</li>
          </ul>
        </div>

        <div className="menu-actions">
          {!showJoinForm && !showAdminForm ? (
            <>
              <form onSubmit={handleCreateRoom} className="player-form">
                <h3>Создать новую игру</h3>
                <input
                  type="text"
                  placeholder="Введите ваше имя"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  maxLength={20}
                  required
                />
                <button type="submit" className="btn btn-primary">
                  🏠 Создать комнату
                </button>
              </form>

              <div className="divider">или</div>

              <div className="menu-buttons">
                <button 
                  className="btn btn-secondary"
                  onClick={() => setShowJoinForm(true)}
                >
                  🚪 Присоединиться к игре
                </button>
                
                <button 
                  className="btn btn-warning"
                  onClick={() => setShowAdminForm(true)}
                  title="Панель администратора для ведущих"
                >
                  ⚙️ Админ-панель
                </button>
              </div>
            </>
          ) : showJoinForm ? (
            <>
              <form onSubmit={handleJoinRoom} className="player-form">
                <h3>Присоединиться к игре</h3>
                <input
                  type="text"
                  placeholder="Код комнаты (например: ABC123)"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                  maxLength={6}
                  required
                />
                <input
                  type="text"
                  placeholder="Введите ваше имя"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  maxLength={20}
                  required
                />
                <button type="submit" className="btn btn-primary">
                  ➡️ Войти в комнату
                </button>
              </form>

              <button 
                className="btn btn-secondary"
                onClick={resetForms}
              >
                ⬅️ Назад
              </button>
            </>
          ) : (
            <>
              <form onSubmit={handleOpenAdmin} className="player-form">
                <h3>🔧 Панель администратора</h3>
                <p className="admin-description">
                  Панель для ведущих игры с расширенными возможностями управления.
                </p>
                <input
                  type="text"
                  placeholder="Код комнаты для администрирования"
                  value={adminRoomId}
                  onChange={(e) => setAdminRoomId(e.target.value.toUpperCase())}
                  maxLength={6}
                  required
                />
                <button type="submit" className="btn btn-warning">
                  🔓 Открыть панель управления
                </button>
              </form>

              <button 
                className="btn btn-secondary"
                onClick={resetForms}
              >
                ⬅️ Назад
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainMenu;