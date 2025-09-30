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
  TextInput,
} from 'react-native';
import { bunkerStyles, colors } from '../styles/bunkerStyles';
import { useSocket } from '../context/SocketContext';

const AdminScreen = ({ navigation, route }) => {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [resourceValue, setResourceValue] = useState('');

  const { socket, connected } = useSocket();
  const { roomId } = route.params;

  useEffect(() => {
    if (!connected || !socket) return;

    // Запрашиваем админ-данные
    socket.emit('requestAdminData', roomId);

    // Настройка обработчиков событий
    socket.on('adminData', (data) => {
      setAdminData(data);
      setLoading(false);
    });

    socket.on('playerUpdated', (player) => {
      setAdminData(prev => ({
        ...prev,
        players: prev.players.map(p => p.id === player.id ? player : p)
      }));
    });

    socket.on('resourceUpdated', ({ resourceName, value }) => {
      setAdminData(prev => ({
        ...prev,
        resources: {
          ...prev.resources,
          [resourceName]: value
        }
      }));
    });

    socket.on('error', (message) => {
      setLoading(false);
      Alert.alert('Ошибка', message);
    });

    // Обновляем данные каждые 5 секунд
    const interval = setInterval(() => {
      socket.emit('requestAdminData', roomId);
    }, 5000);

    return () => {
      socket.off('adminData');
      socket.off('playerUpdated');
      socket.off('resourceUpdated');
      socket.off('error');
      clearInterval(interval);
    };
  }, [socket, connected, roomId]);

  const handleForceRevealCard = (playerId, cardType) => {
    socket.emit('forceRevealCard', { roomId, playerId, cardType });
  };

  const handleEliminatePlayer = (playerId) => {
    const player = adminData.players.find(p => p.id === playerId);
    if (!player) return;

    Alert.alert(
      'Исключить игрока',
      `Вы уверены, что хотите исключить игрока ${player.name}?`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Исключить',
          style: 'destructive',
          onPress: () => {
            socket.emit('eliminatePlayer', { roomId, playerId });
          }
        }
      ]
    );
  };

  const handleUpdateResource = () => {
    if (!selectedResource || !resourceValue) return;

    const value = parseInt(resourceValue);
    if (isNaN(value) || value < 0 || value > 100) {
      Alert.alert('Ошибка', 'Введите значение от 0 до 100');
      return;
    }

    socket.emit('updateResource', {
      roomId,
      resourceName: selectedResource,
      value
    });

    setShowResourceModal(false);
    setSelectedResource(null);
    setResourceValue('');
  };

  const handleTriggerEvent = (eventType) => {
    Alert.alert(
      'Запустить событие',
      `Запустить случайное событие типа "${eventType}"?`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Запустить',
          onPress: () => {
            socket.emit('triggerEvent', { roomId, eventType });
          }
        }
      ]
    );
  };

  const handleRestartGame = () => {
    Alert.alert(
      'Перезапустить игру',
      'Это сбросит всех игроков и начнет игру заново. Продолжить?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Перезапустить',
          style: 'destructive',
          onPress: () => {
            socket.emit('restartGame', roomId);
          }
        }
      ]
    );
  };

  const handleForceStartGame = () => {
    Alert.alert(
      'Принудительно начать игру',
      'Начать игру принудительно с текущими игроками?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Начать',
          onPress: () => {
            socket.emit('forceStartGame', roomId);
          }
        }
      ]
    );
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

  const renderGameInfo = () => {
    if (!adminData?.gameInfo) return null;

    const { gameInfo } = adminData;
    return (
      <View style={bunkerStyles.panel}>
        <Text style={bunkerStyles.subheading}>Информация об игре</Text>
        <Text style={bunkerStyles.text}>
          Комната: {gameInfo.roomId}
        </Text>
        <Text style={bunkerStyles.text}>
          Состояние: {gameInfo.gameState}
        </Text>
        <Text style={bunkerStyles.text}>
          Раунд: {gameInfo.currentRound}
        </Text>
        <Text style={bunkerStyles.text}>
          Игроков: {gameInfo.playersAlive}/{gameInfo.playersTotal}
        </Text>
        <Text style={bunkerStyles.text}>
          Сценарий: {gameInfo.scenario}
        </Text>
      </View>
    );
  };

  const renderPlayer = ({ item }) => (
    <TouchableOpacity
      style={[
        bunkerStyles.listItem,
        !item.isAlive && { opacity: 0.5 }
      ]}
      onPress={() => {
        setSelectedPlayer(item);
        setShowPlayerModal(true);
      }}
    >
      <View style={[bunkerStyles.row, bunkerStyles.spaceBetween]}>
        <View style={{ flex: 1 }}>
          <Text style={bunkerStyles.text}>{item.name}</Text>
          <Text style={bunkerStyles.textDim}>
            Открыто карт: {item.revealedCards?.length || 0}
          </Text>
          {!item.isAlive && (
            <Text style={bunkerStyles.textDanger}>❌ Исключен</Text>
          )}
        </View>
        {item.isAlive && (
          <TouchableOpacity
            style={[bunkerStyles.button, { paddingVertical: 6, paddingHorizontal: 10 }]}
            onPress={() => handleEliminatePlayer(item.id)}
          >
            <Text style={[bunkerStyles.buttonText, { fontSize: 10 }]}>
              ИСКЛЮЧИТЬ
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderResource = ({ item }) => {
    const [name, value] = item;
    return (
      <TouchableOpacity
        style={bunkerStyles.listItem}
        onPress={() => {
          setSelectedResource(name);
          setResourceValue(value.toString());
          setShowResourceModal(true);
        }}
      >
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
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={bunkerStyles.safeArea}>
        <View style={[bunkerStyles.container, bunkerStyles.center]}>
          <Text style={bunkerStyles.text}>Загрузка админ-панели...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!adminData) {
    return (
      <SafeAreaView style={bunkerStyles.safeArea}>
        <View style={[bunkerStyles.container, bunkerStyles.center]}>
          <Text style={bunkerStyles.textDanger}>
            Ошибка загрузки данных
          </Text>
          <TouchableOpacity
            style={[bunkerStyles.button, bunkerStyles.buttonSecondary]}
            onPress={() => navigation.goBack()}
          >
            <Text style={bunkerStyles.buttonText}>НАЗАД</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={bunkerStyles.safeArea}>
      <ScrollView contentContainerStyle={bunkerStyles.scrollContainer}>
        {/* Информация об игре */}
        {renderGameInfo()}

        {/* Ресурсы */}
        {adminData.resources && Object.keys(adminData.resources).length > 0 && (
          <View style={bunkerStyles.panel}>
            <Text style={bunkerStyles.subheading}>Ресурсы бункера</Text>
            <FlatList
              data={Object.entries(adminData.resources)}
              renderItem={renderResource}
              keyExtractor={([name]) => name}
              scrollEnabled={false}
            />
          </View>
        )}

        {/* Игроки */}
        <View style={bunkerStyles.panel}>
          <Text style={bunkerStyles.subheading}>
            Управление игроками ({adminData.players?.length || 0})
          </Text>
          <FlatList
            data={adminData.players || []}
            renderItem={renderPlayer}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>

        {/* События */}
        <View style={bunkerStyles.panel}>
          <Text style={bunkerStyles.subheading}>Запуск событий</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            <TouchableOpacity
              style={[bunkerStyles.button, { flex: 1, minWidth: '45%' }]}
              onPress={() => handleTriggerEvent('environmental')}
            >
              <Text style={bunkerStyles.buttonText}>🌪️ ЭКОЛОГИЯ</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[bunkerStyles.button, { flex: 1, minWidth: '45%' }]}
              onPress={() => handleTriggerEvent('resource')}
            >
              <Text style={bunkerStyles.buttonText}>📦 РЕСУРСЫ</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[bunkerStyles.button, { flex: 1, minWidth: '45%' }]}
              onPress={() => handleTriggerEvent('social')}
            >
              <Text style={bunkerStyles.buttonText}>👥 СОЦИАЛЬНОЕ</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[bunkerStyles.button, { flex: 1, minWidth: '45%' }]}
              onPress={() => handleTriggerEvent('emergency')}
            >
              <Text style={bunkerStyles.buttonText}>🚨 АВАРИЯ</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Управление игрой */}
        <View style={bunkerStyles.panel}>
          <Text style={bunkerStyles.subheading}>Управление игрой</Text>
          <TouchableOpacity
            style={[bunkerStyles.button, bunkerStyles.buttonPrimary]}
            onPress={handleForceStartGame}
          >
            <Text style={[bunkerStyles.buttonText, bunkerStyles.buttonTextPrimary]}>
              🚀 ПРИНУДИТЕЛЬНЫЙ СТАРТ
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[bunkerStyles.button, bunkerStyles.buttonWarning]}
            onPress={handleRestartGame}
          >
            <Text style={[bunkerStyles.buttonText, bunkerStyles.buttonTextWarning]}>
              🔄 ПЕРЕЗАПУСК ИГРЫ
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Модальное окно игрока */}
      <Modal
        visible={showPlayerModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPlayerModal(false)}
      >
        <View style={bunkerStyles.modal}>
          <View style={bunkerStyles.modalContent}>
            {selectedPlayer && (
              <>
                <Text style={bunkerStyles.heading}>
                  {selectedPlayer.name}
                </Text>
                {selectedPlayer.character && (
                  <ScrollView style={{ maxHeight: 300 }}>
                    {Object.entries(selectedPlayer.character).map(([cardType, value]) => {
                      const isRevealed = selectedPlayer.revealedCards?.includes(cardType);
                      return (
                        <View key={cardType} style={{ marginBottom: 12 }}>
                          <View style={[bunkerStyles.row, bunkerStyles.spaceBetween]}>
                            <Text style={bunkerStyles.subheading}>
                              {getCardTypeTranslation(cardType)}:
                            </Text>
                            {!isRevealed && (
                              <TouchableOpacity
                                style={[bunkerStyles.button, { paddingVertical: 4, paddingHorizontal: 8 }]}
                                onPress={() => handleForceRevealCard(selectedPlayer.id, cardType)}
                              >
                                <Text style={[bunkerStyles.buttonText, { fontSize: 10 }]}>
                                  ОТКРЫТЬ
                                </Text>
                              </TouchableOpacity>
                            )}
                          </View>
                          <Text style={[
                            bunkerStyles.text,
                            isRevealed ? bunkerStyles.textGlow : bunkerStyles.textDim
                          ]}>
                            {isRevealed ? value : '???'}
                          </Text>
                        </View>
                      );
                    })}
                  </ScrollView>
                )}
                <TouchableOpacity
                  style={[bunkerStyles.button, bunkerStyles.buttonSecondary]}
                  onPress={() => setShowPlayerModal(false)}
                >
                  <Text style={bunkerStyles.buttonText}>ЗАКРЫТЬ</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Модальное окно ресурса */}
      <Modal
        visible={showResourceModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowResourceModal(false)}
      >
        <View style={bunkerStyles.modal}>
          <View style={bunkerStyles.modalContent}>
            <Text style={bunkerStyles.heading}>
              Изменить ресурс: {selectedResource}
            </Text>
            <TextInput
              style={bunkerStyles.input}
              placeholder="Значение (0-100)"
              placeholderTextColor={colors.bunkerTextDim}
              value={resourceValue}
              onChangeText={setResourceValue}
              keyboardType="numeric"
              maxLength={3}
            />
            <View style={[bunkerStyles.row, { gap: 8 }]}>
              <TouchableOpacity
                style={[bunkerStyles.button, bunkerStyles.buttonPrimary, { flex: 1 }]}
                onPress={handleUpdateResource}
              >
                <Text style={[bunkerStyles.buttonText, bunkerStyles.buttonTextPrimary]}>
                  ОБНОВИТЬ
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[bunkerStyles.button, bunkerStyles.buttonSecondary, { flex: 1 }]}
                onPress={() => setShowResourceModal(false)}
              >
                <Text style={bunkerStyles.buttonText}>ОТМЕНА</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default AdminScreen;