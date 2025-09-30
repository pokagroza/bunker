import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  FlatList,
  Modal,
} from 'react-native';
import { bunkerStyles, colors } from '../styles/bunkerStyles';
import { useSocket } from '../context/SocketContext';

const GameScreen = ({ navigation, route }) => {
  const [gameData, setGameData] = useState(null);
  const [players, setPlayers] = useState([]);
  const [myCharacter, setMyCharacter] = useState(null);
  const [votingData, setVotingData] = useState(null);
  const [events, setEvents] = useState([]);
  const [resources, setResources] = useState({});
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [showCharacterModal, setShowCharacterModal] = useState(false);

  const { socket, connected } = useSocket();
  const { playerInfo, roomInfo } = route.params;

  useEffect(() => {
    if (!connected || !socket) return;

    setGameData(roomInfo);
    setPlayers(roomInfo.players || []);
    
    // Находим персонажа текущего игрока
    const currentPlayer = roomInfo.players?.find(p => p.id === socket.id);
    if (currentPlayer) {
      setMyCharacter(currentPlayer.character);
    }

    // Настройка обработчиков событий
    socket.on('playersUpdate', (playerList) => {
      setPlayers(playerList);
      // Обновляем персонажа текущего игрока
      const updatedPlayer = playerList.find(p => p.id === socket.id);
      if (updatedPlayer) {
        setMyCharacter(updatedPlayer.character);
      }
    });

    socket.on('cardRevealed', ({ playerId, cardType, value }) => {
      setPlayers(prev => prev.map(player => {
        if (player.id === playerId) {
          return {
            ...player,
            revealedCards: [...(player.revealedCards || []), cardType]
          };
        }
        return player;
      }));
    });

    socket.on('votingStarted', (data) => {
      setVotingData(data);
    });

    socket.on('votingFinished', (result) => {
      setVotingData(null);
      Alert.alert(
        'Результаты голосования',
        `Игрок ${result.playerName} ${result.isEliminated ? 'исключен' : 'остается в бункере'}\n` +
        `Голосов "ЗА": ${result.yesVotes}/${result.totalVotes}`
      );
    });

    socket.on('playerEliminated', ({ playerName }) => {
      Alert.alert('Игрок исключен', `${playerName} был исключен из бункера`);
    });

    socket.on('gameFinished', (data) => {
      const isWinner = data.survivors.some(survivor => survivor.id === socket.id);
      Alert.alert(
        'Игра завершена!',
        isWinner ? 'Поздравляем! Вы выжили!' : 'Игра окончена. Вы не выжили.',
        [
          {
            text: 'В главное меню',
            onPress: () => navigation.navigate('MainMenu')
          }
        ]
      );
    });

    socket.on('newEvent', (event) => {
      setEvents(prev => [...prev, event]);
      Alert.alert('Новое событие!', event.description);
    });

    socket.on('resourcesUpdated', (newResources) => {
      setResources(newResources);
    });

    socket.on('error', (message) => {
      Alert.alert('Ошибка', message);
    });

    return () => {
      socket.off('playersUpdate');
      socket.off('cardRevealed');
      socket.off('votingStarted');
      socket.off('votingFinished');
      socket.off('playerEliminated');
      socket.off('gameFinished');
      socket.off('newEvent');
      socket.off('resourcesUpdated');
      socket.off('error');
    };
  }, [socket, connected, roomInfo, navigation]);

  const handleRevealCard = (cardType) => {
    if (!myCharacter || !myCharacter[cardType]) return;
    
    socket.emit('revealCard', {
      roomId: playerInfo.roomId,
      cardType
    });
  };

  const handleStartVoting = (targetPlayerId) => {
    const targetPlayer = players.find(p => p.id === targetPlayerId);
    if (!targetPlayer) return;

    Alert.alert(
      'Начать голосование',
      `Вы хотите начать голосование за исключение игрока ${targetPlayer.name}?`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Да',
          onPress: () => {
            socket.emit('startVoting', {
              roomId: playerInfo.roomId,
              targetPlayerId
            });
          }
        }
      ]
    );
  };

  const handleVote = (vote) => {
    socket.emit('vote', {
      roomId: playerInfo.roomId,
      vote
    });
  };

  const getCardTypeTranslation = (cardType) => {
    const translations = {
      profession: 'Профессия',
      hobby: 'Хобби',
      health: 'Здоровье',
      phobia: 'Фобия',
      baggage: 'Багаж',
      age: 'Возраст',
      skill: 'Навык',
      trait: 'Черта',
      condition: 'Состояние'
    };
    return translations[cardType] || cardType;
  };

  const renderCharacterCard = (cardType, value, isRevealed) => (
    <TouchableOpacity
      key={cardType}
      style={[
        bunkerStyles.characterCard,
        isRevealed && bunkerStyles.characterCardRevealed
      ]}
      onPress={() => !isRevealed && handleRevealCard(cardType)}
      disabled={isRevealed}
    >
      <Text style={bunkerStyles.subheading}>
        {getCardTypeTranslation(cardType)}
      </Text>
      {isRevealed ? (
        <Text style={bunkerStyles.text}>{value}</Text>
      ) : (
        <Text style={bunkerStyles.textDim}>
          Нажмите для открытия
        </Text>
      )}
    </TouchableOpacity>
  );

  const renderPlayer = ({ item }) => {
    const isCurrentPlayer = item.id === socket.id;
    const revealedCount = item.revealedCards?.length || 0;
    
    return (
      <TouchableOpacity
        style={[
          bunkerStyles.listItem,
          !item.isAlive && { opacity: 0.5 },
          isCurrentPlayer && bunkerStyles.listItemActive
        ]}
        onPress={() => {
          setSelectedPlayer(item);
          setShowCharacterModal(true);
        }}
      >
        <View style={[bunkerStyles.row, bunkerStyles.spaceBetween]}>
          <View style={{ flex: 1 }}>
            <Text style={bunkerStyles.text}>
              {item.name} {isCurrentPlayer && '(Вы)'}
            </Text>
            <Text style={bunkerStyles.textDim}>
              Открыто карт: {revealedCount}
            </Text>
            {!item.isAlive && (
              <Text style={bunkerStyles.textDanger}>
                ❌ Исключен
              </Text>
            )}
          </View>
          {item.isAlive && !isCurrentPlayer && (
            <TouchableOpacity
              style={[bunkerStyles.button, { paddingVertical: 8, paddingHorizontal: 12 }]}
              onPress={() => handleStartVoting(item.id)}
            >
              <Text style={[bunkerStyles.buttonText, { fontSize: 12 }]}>
                🗳️ ГОЛОСОВАТЬ
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderResource = (name, value) => (
    <View key={name} style={bunkerStyles.listItem}>
      <View style={[bunkerStyles.row, bunkerStyles.spaceBetween]}>
        <Text style={bunkerStyles.text}>{name}</Text>
        <Text style={[
          bunkerStyles.text,
          value < 30 ? bunkerStyles.textDanger : 
          value < 70 ? bunkerStyles.textWarning : 
          bunkerStyles.textGlow
        ]}>
          {value}%
        </Text>
      </View>
      <View style={bunkerStyles.progressContainer}>
        <View style={[
          bunkerStyles.progressBar,
          value < 30 ? bunkerStyles.progressBarDanger :
          value < 70 ? bunkerStyles.progressBarWarning : null,
          { width: `${value}%` }
        ]} />
      </View>
    </View>
  );

  if (!gameData) {
    return (
      <SafeAreaView style={bunkerStyles.safeArea}>
        <View style={[bunkerStyles.container, bunkerStyles.center]}>
          <Text style={bunkerStyles.text}>Загрузка игры...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={bunkerStyles.safeArea}>
      <ScrollView contentContainerStyle={bunkerStyles.scrollContainer}>
        {/* Информация о сценарии */}
        <View style={bunkerStyles.panel}>
          <Text style={bunkerStyles.heading}>
            {gameData.scenario?.title || 'Неизвестная катастрофа'}
          </Text>
          <Text style={bunkerStyles.textDim}>
            {gameData.scenario?.description || 'Описание недоступно'}
          </Text>
        </View>

        {/* Ваш персонаж */}
        {myCharacter && (
          <View style={bunkerStyles.panel}>
            <Text style={bunkerStyles.subheading}>Ваш персонаж</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {Object.entries(myCharacter).map(([cardType, value]) => {
                const currentPlayer = players.find(p => p.id === socket.id);
                const isRevealed = currentPlayer?.revealedCards?.includes(cardType) || false;
                return renderCharacterCard(cardType, value, isRevealed);
              })}
            </View>
          </View>
        )}

        {/* Ресурсы бункера */}
        {Object.keys(resources).length > 0 && (
          <View style={bunkerStyles.panel}>
            <Text style={bunkerStyles.subheading}>Ресурсы бункера</Text>
            {Object.entries(resources).map(([name, value]) => 
              renderResource(name, value)
            )}
          </View>
        )}

        {/* Активные события */}
        {events.length > 0 && (
          <View style={[bunkerStyles.panel, bunkerStyles.panelWarning]}>
            <Text style={[bunkerStyles.subheading, bunkerStyles.textWarning]}>
              Активные события
            </Text>
            {events.slice(-3).map((event, index) => (
              <View key={index} style={{ marginBottom: 12 }}>
                <Text style={bunkerStyles.text}>{event.title}</Text>
                <Text style={bunkerStyles.textDim}>{event.description}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Игроки */}
        <View style={bunkerStyles.panel}>
          <Text style={bunkerStyles.subheading}>
            Игроки в бункере ({players.filter(p => p.isAlive).length})
          </Text>
          <FlatList
            data={players}
            renderItem={renderPlayer}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>

        {/* Голосование */}
        {votingData && (
          <View style={[bunkerStyles.panel, bunkerStyles.panelDanger]}>
            <Text style={[bunkerStyles.subheading, bunkerStyles.textDanger]}>
              🗳️ Голосование за исключение
            </Text>
            <Text style={bunkerStyles.text}>
              Исключить игрока: {votingData.targetPlayerName}
            </Text>
            <View style={[bunkerStyles.row, { marginTop: 16 }]}>
              <TouchableOpacity
                style={[bunkerStyles.button, bunkerStyles.buttonDanger, { flex: 1, marginRight: 8 }]}
                onPress={() => handleVote('yes')}
              >
                <Text style={[bunkerStyles.buttonText, bunkerStyles.buttonTextDanger]}>
                  ЗА
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[bunkerStyles.button, bunkerStyles.buttonSecondary, { flex: 1, marginLeft: 8 }]}
                onPress={() => handleVote('no')}
              >
                <Text style={bunkerStyles.buttonText}>
                  ПРОТИВ
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Модальное окно персонажа */}
      <Modal
        visible={showCharacterModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCharacterModal(false)}
      >
        <View style={bunkerStyles.modal}>
          <View style={bunkerStyles.modalContent}>
            {selectedPlayer && (
              <>
                <Text style={bunkerStyles.heading}>
                  {selectedPlayer.name}
                </Text>
                {selectedPlayer.character && selectedPlayer.revealedCards?.length > 0 ? (
                  <ScrollView style={{ maxHeight: 400 }}>
                    {selectedPlayer.revealedCards.map(cardType => (
                      <View key={cardType} style={{ marginBottom: 12 }}>
                        <Text style={bunkerStyles.subheading}>
                          {getCardTypeTranslation(cardType)}:
                        </Text>
                        <Text style={bunkerStyles.text}>
                          {selectedPlayer.character[cardType]}
                        </Text>
                      </View>
                    ))}
                  </ScrollView>
                ) : (
                  <Text style={bunkerStyles.textDim}>
                    Игрок еще не открыл ни одной карты
                  </Text>
                )}
                <TouchableOpacity
                  style={[bunkerStyles.button, bunkerStyles.buttonSecondary]}
                  onPress={() => setShowCharacterModal(false)}
                >
                  <Text style={bunkerStyles.buttonText}>ЗАКРЫТЬ</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default GameScreen;