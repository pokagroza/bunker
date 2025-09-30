const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const scenarios = require('./scenarios');
const { generateRandomCharacter } = require('./characterCards');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Храним игровые комнаты
const gameRooms = new Map();

// Структура игровой комнаты
class GameRoom {
  constructor(id, hostId) {
    this.id = id;
    this.hostId = hostId;
    this.players = new Map();
    this.scenario = null;
    this.gameState = 'waiting'; // waiting, playing, voting, finished
    this.currentRound = 0;
    this.votingTarget = null;
    this.votes = new Map();
    this.eliminatedPlayers = [];
    this.createdAt = new Date();
  }

  addPlayer(playerId, playerName) {
    if (this.players.size >= 12) return false; // Максимум 12 игроков
    
    const player = {
      id: playerId,
      name: playerName,
      character: generateRandomCharacter(),
      revealedCards: [],
      isAlive: true,
      isHost: playerId === this.hostId
    };
    
    this.players.set(playerId, player);
    return true;
  }

  removePlayer(playerId) {
    this.players.delete(playerId);
    this.votes.delete(playerId);
    
    // Если хост покинул игру, назначаем нового хоста
    if (playerId === this.hostId && this.players.size > 0) {
      const newHost = this.players.values().next().value;
      this.hostId = newHost.id;
      newHost.isHost = true;
    }
  }

  startGame(scenarioId) {
    if (this.players.size < 3) return false; // Минимум 3 игрока
    
    this.scenario = scenarios.find(s => s.id === scenarioId);
    this.gameState = 'playing';
    return true;
  }

  revealCard(playerId, cardType) {
    const player = this.players.get(playerId);
    if (!player || !player.isAlive) return false;
    
    if (!player.revealedCards.includes(cardType)) {
      player.revealedCards.push(cardType);
      return true;
    }
    return false;
  }

  startVoting(targetPlayerId) {
    if (this.gameState !== 'playing') return false;
    
    this.gameState = 'voting';
    this.votingTarget = targetPlayerId;
    this.votes.clear();
    return true;
  }

  vote(voterId, vote) {
    if (this.gameState !== 'voting') return false;
    
    const voter = this.players.get(voterId);
    if (!voter || !voter.isAlive) return false;
    
    this.votes.set(voterId, vote);
    return true;
  }

  finishVoting() {
    if (this.gameState !== 'voting') return false;
    
    const yesVotes = Array.from(this.votes.values()).filter(vote => vote === 'yes').length;
    const totalVotes = this.votes.size;
    const isEliminated = yesVotes > totalVotes / 2;
    
    if (isEliminated) {
      const targetPlayer = this.players.get(this.votingTarget);
      if (targetPlayer) {
        targetPlayer.isAlive = false;
        this.eliminatedPlayers.push(this.votingTarget);
      }
    }
    
    this.gameState = 'playing';
    this.votingTarget = null;
    this.votes.clear();
    this.currentRound++;
    
    return { isEliminated, yesVotes, totalVotes };
  }

  getAlivePlayers() {
    return Array.from(this.players.values()).filter(player => player.isAlive);
  }

  isGameFinished() {
    const alivePlayers = this.getAlivePlayers();
    const bunkerCapacity = Math.ceil(this.players.size * 0.5); // 50% выживших
    return alivePlayers.length <= bunkerCapacity;
  }
}

// Socket.io обработчики
io.on('connection', (socket) => {
  console.log('Пользователь подключился:', socket.id);

  // Создание новой игровой комнаты
  socket.on('createRoom', (playerName) => {
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const room = new GameRoom(roomId, socket.id);
    
    if (room.addPlayer(socket.id, playerName)) {
      gameRooms.set(roomId, room);
      socket.join(roomId);
      
      socket.emit('roomCreated', {
        roomId,
        playerId: socket.id,
        isHost: true
      });
      
      io.to(roomId).emit('playersUpdate', Array.from(room.players.values()));
    }
  });

  // Присоединение к игровой комнате
  socket.on('joinRoom', ({ roomId, playerName }) => {
    const room = gameRooms.get(roomId);
    
    if (!room) {
      socket.emit('error', 'Комната не найдена');
      return;
    }
    
    if (room.gameState !== 'waiting') {
      socket.emit('error', 'Игра уже началась');
      return;
    }
    
    if (room.addPlayer(socket.id, playerName)) {
      socket.join(roomId);
      
      socket.emit('roomJoined', {
        roomId,
        playerId: socket.id,
        isHost: false,
        scenario: room.scenario
      });
      
      io.to(roomId).emit('playersUpdate', Array.from(room.players.values()));
    } else {
      socket.emit('error', 'Комната заполнена');
    }
  });

  // Запуск игры
  socket.on('startGame', ({ roomId, scenarioId }) => {
    const room = gameRooms.get(roomId);
    
    if (!room || room.hostId !== socket.id) {
      socket.emit('error', 'Недостаточно прав или комната не найдена');
      return;
    }
    
    if (room.startGame(scenarioId)) {
      io.to(roomId).emit('gameStarted', {
        scenario: room.scenario,
        players: Array.from(room.players.values()).map(player => ({
          id: player.id,
          name: player.name,
          isAlive: player.isAlive
        }))
      });
      
      // Отправляем каждому игроку его персонажа
      room.players.forEach((player, playerId) => {
        io.to(playerId).emit('characterAssigned', player.character);
      });
    } else {
      socket.emit('error', 'Недостаточно игроков для начала игры');
    }
  });

  // Открытие карточки персонажа
  socket.on('revealCard', ({ roomId, cardType }) => {
    const room = gameRooms.get(roomId);
    
    if (!room || room.gameState !== 'playing') {
      socket.emit('error', 'Игра не активна');
      return;
    }
    
    if (room.revealCard(socket.id, cardType)) {
      const player = room.players.get(socket.id);
      
      io.to(roomId).emit('cardRevealed', {
        playerId: socket.id,
        playerName: player.name,
        cardType,
        cardValue: player.character[cardType],
        revealedCards: player.revealedCards
      });
    }
  });

  // Начало голосования
  socket.on('startVoting', ({ roomId, targetPlayerId }) => {
    const room = gameRooms.get(roomId);
    
    if (!room || room.gameState !== 'playing') {
      socket.emit('error', 'Нельзя начать голосование');
      return;
    }
    
    if (room.startVoting(targetPlayerId)) {
      const targetPlayer = room.players.get(targetPlayerId);
      
      io.to(roomId).emit('votingStarted', {
        targetPlayerId,
        targetPlayerName: targetPlayer.name,
        alivePlayers: room.getAlivePlayers().map(p => ({ id: p.id, name: p.name }))
      });
    }
  });

  // Голосование
  socket.on('vote', ({ roomId, vote }) => {
    const room = gameRooms.get(roomId);
    
    if (!room || room.gameState !== 'voting') {
      socket.emit('error', 'Голосование не активно');
      return;
    }
    
    if (room.vote(socket.id, vote)) {
      const player = room.players.get(socket.id);
      
      io.to(roomId).emit('voteReceived', {
        playerId: socket.id,
        playerName: player.name,
        votesCount: room.votes.size,
        totalPlayers: room.getAlivePlayers().length
      });
      
      // Если все проголосовали, завершаем голосование
      if (room.votes.size === room.getAlivePlayers().length) {
        const result = room.finishVoting();
        
        io.to(roomId).emit('votingFinished', {
          ...result,
          targetPlayer: room.players.get(room.votingTarget),
          alivePlayers: room.getAlivePlayers(),
          isGameFinished: room.isGameFinished()
        });
        
        if (room.isGameFinished()) {
          room.gameState = 'finished';
          io.to(roomId).emit('gameFinished', {
            survivors: room.getAlivePlayers(),
            eliminated: room.eliminatedPlayers.map(id => room.players.get(id))
          });
        }
      }
    }
  });

  // Получение списка доступных сценариев
  socket.on('getScenarios', () => {
    socket.emit('scenarios', scenarios);
  });

  // Получение информации о комнате
  socket.on('getRoomInfo', (roomId) => {
    const room = gameRooms.get(roomId);
    
    if (room) {
      socket.emit('roomInfo', {
        id: room.id,
        players: Array.from(room.players.values()),
        scenario: room.scenario,
        gameState: room.gameState,
        currentRound: room.currentRound
      });
    } else {
      socket.emit('error', 'Комната не найдена');
    }
  });

  // АДМИН-ПАНЕЛЬ: Получение данных для администратора
  socket.on('requestAdminData', (roomId) => {
    const room = gameRooms.get(roomId);
    
    if (room) {
      const adminData = {
        gameInfo: {
          roomId: room.id,
          gameState: room.gameState,
          currentRound: room.currentRound,
          playersTotal: room.players.size,
          playersAlive: room.getAlivePlayers().length,
          scenario: room.scenario?.title || 'Не выбран',
          votingTarget: room.votingTarget,
          bunkerCapacity: Math.ceil(room.players.size * 0.5)
        },
        players: Array.from(room.players.values()).map(player => ({
          ...player,
          character: player.character || {}
        })),
        resources: room.resources,
        activeEvents: room.activeEvents || [],
        bunkerInfo: room.bunkerInfo || {}
      };
      
      socket.emit('adminData', adminData);
    } else {
      socket.emit('error', 'Комната не найдена');
    }
  });

  // АДМИН-ПАНЕЛЬ: Принудительное раскрытие карты игрока
  socket.on('forceRevealCard', ({ roomId, playerId, cardType }) => {
    const room = gameRooms.get(roomId);
    
    if (room && room.players.has(playerId)) {
      const player = room.players.get(playerId);
      if (player.character && player.character[cardType] !== undefined) {
        player.revealedCards = player.revealedCards || [];
        if (!player.revealedCards.includes(cardType)) {
          player.revealedCards.push(cardType);
          
          // Уведомляем всех игроков об открытии карты
          io.to(roomId).emit('cardRevealed', {
            playerId,
            cardType,
            value: player.character[cardType]
          });
          
          // Обновляем админ-данные
          socket.emit('playerUpdated', player);
        }
      }
    }
  });

  // АДМИН-ПАНЕЛЬ: Исключение игрока
  socket.on('eliminatePlayer', ({ roomId, playerId }) => {
    const room = gameRooms.get(roomId);
    
    if (room && room.players.has(playerId)) {
      const player = room.players.get(playerId);
      player.isAlive = false;
      room.eliminatedPlayers = room.eliminatedPlayers || [];
      if (!room.eliminatedPlayers.includes(playerId)) {
        room.eliminatedPlayers.push(playerId);
      }
      
      // Уведомляем всех игроков
      io.to(roomId).emit('playerEliminated', {
        playerId,
        playerName: player.name
      });
      
      // Обновляем админ-данные
      socket.emit('playerUpdated', player);
      
      // Проверяем завершение игры
      if (room.isGameFinished()) {
        room.gameState = 'finished';
        io.to(roomId).emit('gameFinished', {
          survivors: room.getAlivePlayers(),
          eliminated: room.eliminatedPlayers
        });
      }
    }
  });

  // АДМИН-ПАНЕЛЬ: Изменение ресурсов
  socket.on('updateResource', ({ roomId, resourceName, value }) => {
    const room = gameRooms.get(roomId);
    
    if (room) {
      room.resources = room.resources || {};
      room.resources[resourceName] = Math.max(0, Math.min(100, value));
      
      // Уведомляем всех игроков об изменении ресурсов
      io.to(roomId).emit('resourcesUpdated', room.resources);
      
      // Обновляем админ-данные
      socket.emit('resourceUpdated', { resourceName, value: room.resources[resourceName] });
    }
  });

  // АДМИН-ПАНЕЛЬ: Запуск события
  socket.on('triggerEvent', ({ roomId, eventType }) => {
    const room = gameRooms.get(roomId);
    
    if (room) {
      const events = require('./events');
      let event;
      
      switch (eventType) {
        case 'environmental':
          event = events.getRandomEnvironmentalEvent();
          break;
        case 'resource':
          event = events.getRandomResourceEvent();
          break;
        case 'social':
          event = events.getRandomSocialEvent();
          break;
        case 'emergency':
          event = events.getRandomEmergencyEvent();
          break;
        default:
          event = events.getRandomEvent();
      }
      
      if (event) {
        room.activeEvents = room.activeEvents || [];
        event.id = Date.now().toString();
        event.startTime = new Date();
        room.activeEvents.push(event);
        
        // Применяем эффекты события
        if (event.effects) {
          room.resources = room.resources || {};
          for (const [resourceName, change] of Object.entries(event.effects)) {
            room.resources[resourceName] = Math.max(0, Math.min(100, 
              (room.resources[resourceName] || 50) + change));
          }
        }
        
        // Уведомляем всех игроков о событии
        io.to(roomId).emit('newEvent', event);
        
        // Если есть изменения ресурсов, уведомляем о них
        if (event.effects) {
          io.to(roomId).emit('resourcesUpdated', room.resources);
        }
      }
    }
  });

  // АДМИН-ПАНЕЛЬ: Завершение события
  socket.on('endEvent', ({ roomId, eventId }) => {
    const room = gameRooms.get(roomId);
    
    if (room && room.activeEvents) {
      room.activeEvents = room.activeEvents.filter(event => event.id !== eventId);
      
      // Уведомляем всех игроков
      io.to(roomId).emit('eventEnded', eventId);
    }
  });

  // АДМИН-ПАНЕЛЬ: Перезапуск игры
  socket.on('restartGame', (roomId) => {
    const room = gameRooms.get(roomId);
    
    if (room) {
      // Сбрасываем состояние игры
      room.gameState = 'lobby';
      room.currentRound = 0;
      room.votingTarget = null;
      room.votes.clear();
      room.eliminatedPlayers = [];
      room.activeEvents = [];
      
      // Восстанавливаем всех игроков
      room.players.forEach(player => {
        player.isAlive = true;
        player.character = null;
        player.revealedCards = [];
      });
      
      // Сбрасываем ресурсы
      room.resources = {
        food: 100,
        water: 100,
        energy: 100,
        air: 100,
        medicine: 100,
        materials: 100
      };
      
      // Уведомляем всех игроков
      io.to(roomId).emit('gameRestarted');
      io.to(roomId).emit('playersUpdate', Array.from(room.players.values()));
      io.to(roomId).emit('resourcesUpdated', room.resources);
    }
  });

  // АДМИН-ПАНЕЛЬ: Принудительное начало игры
  socket.on('forceStartGame', (roomId) => {
    const room = gameRooms.get(roomId);
    
    if (room && room.players.size > 0) {
      room.gameState = 'playing';
      
      // Если нет сценария, выбираем случайный
      if (!room.scenario) {
        const scenarios = require('./scenarios');
        room.scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
      }
      
      // Если у игроков нет персонажей, генерируем их
      const characterCards = require('./characterCards');
      room.players.forEach(player => {
        if (!player.character) {
          player.character = characterCards.generateCharacter();
          player.revealedCards = [];
        }
      });
      
      // Инициализируем ресурсы если их нет
      if (!room.resources) {
        room.resources = {
          food: 100,
          water: 100,
          energy: 100,
          air: 100,
          medicine: 100,
          materials: 100
        };
      }
      
      // Уведомляем всех игроков
      io.to(roomId).emit('gameStarted', {
        scenario: room.scenario,
        players: Array.from(room.players.values()),
        resources: room.resources
      });
    }
  });

  // Отключение игрока
  socket.on('disconnect', () => {
    console.log('Пользователь отключился:', socket.id);
    
    // Находим и обновляем комнаты, где был этот игрок
    gameRooms.forEach((room, roomId) => {
      if (room.players.has(socket.id)) {
        room.removePlayer(socket.id);
        
        // Если в комнате больше нет игроков, удаляем её
        if (room.players.size === 0) {
          gameRooms.delete(roomId);
        } else {
          // Уведомляем остальных игроков
          io.to(roomId).emit('playersUpdate', Array.from(room.players.values()));
        }
      }
    });
  });
});

// Статические файлы для production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

module.exports = app;