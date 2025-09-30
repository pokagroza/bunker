import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

import MainMenu from './components/MainMenu';
import Lobby from './components/Lobby';
import Game from './components/Game';
import AdminPanel from './components/AdminPanel';

const socket = io();

function App() {
  const [gameState, setGameState] = useState('menu'); // menu, lobby, game, admin
  const [playerInfo, setPlayerInfo] = useState(null);
  const [roomInfo, setRoomInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [adminRoomId, setAdminRoomId] = useState('');

  useEffect(() => {
    // Обработчики Socket.io событий
    socket.on('roomCreated', (data) => {
      setPlayerInfo(data);
      setGameState('lobby');
      setErrorMessage('');
    });

    socket.on('roomJoined', (data) => {
      setPlayerInfo(data);
      setGameState('lobby');
      setErrorMessage('');
    });

    socket.on('gameStarted', (data) => {
      setRoomInfo(data);
      setGameState('game');
    });

    socket.on('error', (message) => {
      setErrorMessage(message);
    });

    socket.on('playersUpdate', (players) => {
      setRoomInfo(prev => prev ? { ...prev, players } : { players });
    });

    // Cleanup при размонтировании
    return () => {
      socket.off('roomCreated');
      socket.off('roomJoined');
      socket.off('gameStarted');
      socket.off('error');
      socket.off('playersUpdate');
    };
  }, []);

  const createRoom = (playerName) => {
    socket.emit('createRoom', playerName);
  };

  const joinRoom = (roomId, playerName) => {
    socket.emit('joinRoom', { roomId, playerName });
  };

  const startGame = (scenarioId) => {
    if (playerInfo && playerInfo.isHost) {
      socket.emit('startGame', { roomId: playerInfo.roomId, scenarioId });
    }
  };

  const openAdminPanel = (roomId) => {
    setAdminRoomId(roomId);
    setGameState('admin');
  };

  const backToMenu = () => {
    setGameState('menu');
    setPlayerInfo(null);
    setRoomInfo(null);
    setAdminRoomId('');
    setErrorMessage('');
  };

  return (
    <div className="App">
      {gameState !== 'admin' && (
        <header className="App-header">
          <h1>🏠 БУНКЕР 🏠</h1>
          <p>Игра на выживание</p>
        </header>
      )}

      {errorMessage && (
        <div className="error-message">
          {errorMessage}
          <button onClick={() => setErrorMessage('')}>✕</button>
        </div>
      )}

      <main className="main-content">
        {gameState === 'menu' && (
          <MainMenu 
            onCreateRoom={createRoom}
            onJoinRoom={joinRoom}
            onOpenAdmin={openAdminPanel}
          />
        )}

        {gameState === 'lobby' && (
          <Lobby
            socket={socket}
            playerInfo={playerInfo}
            roomInfo={roomInfo}
            onStartGame={startGame}
            onBackToMenu={backToMenu}
          />
        )}

        {gameState === 'game' && (
          <Game
            socket={socket}
            playerInfo={playerInfo}
            roomInfo={roomInfo}
            onBackToMenu={backToMenu}
          />
        )}

        {gameState === 'admin' && (
          <AdminPanel
            socket={socket}
            roomId={adminRoomId}
            onBackToMenu={backToMenu}
          />
        )}
      </main>
    </div>
  );
}

export default App;